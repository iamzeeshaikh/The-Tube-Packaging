// Spam signals for form submissions. Nothing here blocks: the handler only
// labels the email "[Possible spam]" and lists the reasons, so a real enquiry
// written in an odd way still reaches the inbox (owner's rule, 2026-09-30).
//
// The bots hitting the contact form (Oct 2026) type random letters into every
// box: "Znhqp Gshsu", "HxSOcEuSvuKdnMgsYrFGkjl". A person can produce one odd
// word (Schmidt, Nguyen), so one signal alone is not enough; two are.

const VOWELS = /[aeiouy]/gi;

// Signals a single word of letters can show.
function wordSignals(word) {
  const w = word.replace(/[^A-Za-z]/g, '');
  if (w.length < 5) return 0;
  let n = 0;
  const vowels = (w.match(VOWELS) || []).length;
  if (vowels / w.length < 0.2) n++;                  // Znhqp (Smith and kraft sit at exactly 0.2)
  if (/[^aeiouyAEIOUY]{5,}/.test(w)) n++;            // Uzngfxuq, vcltvv
  const switches = (w.match(/[a-z][A-Z]|[A-Z]{2,}[a-z]/g) || []).length;
  if (switches >= 3) n++;                            // HxSOcEuSvuKdnMgsYrFGkjl
  return n;
}

function textSignals(text) {
  let n = 0;
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  for (const w of words) n += wordSignals(w);
  return n;
}

/**
 * Returns the reasons a submission looks automated; an empty list means none.
 * `fields` is the parsed form body; `names`/`message`/`email` pick the fields to read.
 */
export function spamReasons({ names = [], message = '', email = '', sentAt, now = Date.now() }) {
  const reasons = [];
  let score = 0;

  for (const name of names) {
    const s = textSignals(name);
    if (s) { score += s; reasons.push(`name looks random (${String(name).trim()})`); }
  }

  const msg = String(message || '').trim();
  if (msg) {
    // A long message with one odd word is a real message; a short one made of
    // odd words is not.
    const s = textSignals(msg);
    const words = msg.split(/\s+/).length;
    if (s && (words <= 3 || s >= 2)) { score += s; reasons.push('message looks random'); }
    if (!/\s/.test(msg) && msg.length >= 12 && /^[A-Za-z]+$/.test(msg)) { score++; if (!reasons.includes('message looks random')) reasons.push('message is one random word'); }
  }

  const local = String(email || '').split('@')[0] || '';
  if ((local.match(/\./g) || []).length >= 3) { score++; reasons.push('email uses many dots'); }

  // The page sets a timestamp when it loads; a post without one did not come
  // through the page, and one within three seconds was not typed by a person.
  const ts = Number(sentAt);
  if (!ts) { score += 2; reasons.push('no timing token'); }
  else if (now - ts < 3000) { score += 2; reasons.push('sent in under 3 seconds'); }

  // One odd word is a surname; two signals is a bot.
  return score >= 2 ? reasons : [];
}
