// Serverless replacement for Elementor Pro's form handler.
//
// The forms themselves are unchanged -- same fields, same names, same required
// flags, same file upload, same honeypot. This endpoint reproduces what
// Elementor did server-side: mail the submission to the recipients configured
// in the WordPress install, with the same subject, From address and redirect.
import Busboy from 'busboy';
import nodemailer from 'nodemailer';
import forms from '../src/data/forms.json' with { type: 'json' };

export const config = { api: { bodyParser: false } };

const MAX_FILE_BYTES = 8 * 1024 * 1024;

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_BYTES, files: 5 } });
    const fields = {};
    const files = [];
    bb.on('field', (name, value) => {
      if (name.endsWith('[]')) {
        (fields[name] ||= []).push(value);
      } else if (name in fields) {
        fields[name] = [].concat(fields[name], value);
      } else {
        fields[name] = value;
      }
    });
    bb.on('file', (name, stream, info) => {
      const chunks = [];
      let truncated = false;
      stream.on('data', (c) => chunks.push(c));
      stream.on('limit', () => { truncated = true; });
      stream.on('end', () => {
        const content = Buffer.concat(chunks);
        if (content.length && !truncated) {
          files.push({ filename: info.filename, contentType: info.mimeType, content });
        }
      });
    });
    bb.on('error', reject);
    bb.on('close', () => resolve({ fields, files }));
    req.pipe(bb);
  });
}

// Elementor names its visible fields form_fields[name]; the two fields with no
// label or placeholder are the honeypot pair, which must stay empty.
const HONEYPOT = new Set([
  'form_fields[field_027508e]', 'form_fields[field_228829a]',
  'form_fields[field_7678a05]', 'form_fields[field_361fe73]',
]);

// Elementor mailed the field's *label*, not its generated id. forms.json carries
// the label for every field, so notifications read "Phone" rather than
// "field_f54cfcb"; anything unmapped falls back to a readable version of the id.
function labelFor(key, cfg) {
  const m = key.match(/^form_fields\[(.+?)\](\[\])?$/);
  const id = m ? m[1] : key;
  const mapped = cfg.field_labels && cfg.field_labels[id];
  if (mapped) return mapped;
  return id.replace(/^field_[0-9a-f]+$/, 'Additional Detail')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'An error occurred.' });
  }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch {
    return res.status(400).json({ ok: false, message: 'An error occurred.' });
  }
  const { fields, files } = parsed;

  const cfg = forms[fields.form_id];
  if (!cfg) return res.status(400).json({ ok: false, message: 'An error occurred.' });

  // silently accept honeypot hits so bots get no signal
  for (const trap of HONEYPOT) {
    if (fields[trap]) return res.status(200).json({ ok: true, message: cfg.success_message });
  }

  // Forms that show the reCAPTCHA v2 checkbox were verified server-side by
  // Elementor Pro; keep that check with the same key pair.
  if (fields['g-recaptcha-response'] !== undefined && process.env.RECAPTCHA_SECRET_KEY) {
    const body = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: fields['g-recaptcha-response'] || '',
    });
    try {
      const verify = await fetch('https://www.google.com/recaptcha/api/siteverify',
        { method: 'POST', body });
      const outcome = await verify.json();
      if (!outcome.success) {
        return res.status(400).json({
          ok: false,
          message: cfg.invalid_message || "There's something wrong. The form is invalid.",
        });
      }
    } catch (err) {
      console.error('recaptcha verify failed', err);
      return res.status(502).json({ ok: false, message: cfg.error_message || 'An error occurred.' });
    }
  }

  const rows = Object.entries(fields)
    .filter(([k]) => k.startsWith('form_fields[') && !HONEYPOT.has(k))
    .map(([k, v]) => [labelFor(k, cfg), [].concat(v).join(', ')])
    .filter(([, v]) => v !== '');

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const html = [
    '<table cellpadding="6" cellspacing="0" border="0">',
    ...rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`),
    '</table>',
    `<p>Sent from ${esc(fields.page_url || fields.referer_title || '')}</p>`,
  ].join('\n');

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nSent from ${fields.page_url || ''}`;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const to = (process.env.FORM_TO_OVERRIDE || cfg.email_to)
    .split(',').map((s) => s.trim()).filter(Boolean);
  const replyTo = fields['form_fields[email]'] || undefined;

  try {
    await transport.sendMail({
      from: `"${cfg.email_from_name || process.env.MAIL_FROM_NAME}" <${cfg.email_from || process.env.MAIL_FROM_EMAIL}>`,
      to,
      replyTo,
      subject: cfg.email_subject || `New message from "${cfg.form_name}"`,
      text,
      html,
      attachments: files,
    });
  } catch (err) {
    console.error('form send failed', err);
    return res.status(502).json({ ok: false, message: cfg.error_message || 'An error occurred.' });
  }

  return res.status(200).json({
    ok: true,
    message: cfg.success_message || 'The form was sent successfully.',
    redirect: cfg.redirect_to || null,
  });
}
