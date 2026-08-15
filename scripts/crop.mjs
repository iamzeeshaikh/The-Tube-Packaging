// Crop the same vertical band out of the reference and Astro screenshots and
// write them side by side, so a visual difference can actually be looked at.
//   node scripts/crop.mjs <slug> <breakpoint> <y> <height>
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SHOTS = path.join(ROOT, 'reports', 'screenshots');
const [slug, vp, yArg, hArg] = process.argv.slice(2);
const Y = Number(yArg || 0);
const H = Number(hArg || 400);

function readPNG(file) {
  const buf = fs.readFileSync(file);
  let pos = 8, width = 0, height = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += len + 12;
  }
  const ch = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const f = raw[rp++];
    const line = raw.subarray(rp, rp + stride); rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[x] = v & 0xff;
    }
  }
  return { width, height, ch, data: out };
}

function writePNG(file, width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  let table = null;
  function crc32(buf) {
    if (!table) {
      table = new Int32Array(256);
      for (let n = 0; n < 256; n++) { let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c; }
    }
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return c ^ -1;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]));
}

const refKind = process.env.REF || 'snapshot';
const refFile = path.join(SHOTS, vp, refKind, slug + '.png');
const a = readPNG(refFile);
const b = readPNG(path.join(SHOTS, vp, 'local', slug + '.png'));
const w = Math.min(a.width, b.width);
const h = Math.min(H, a.height - Y, b.height - Y);
const gap = 24;
const out = Buffer.alloc(h * (w * 2 + gap) * 4, 255);
for (let y = 0; y < h; y++) {
  for (const [img, xoff] of [[a, 0], [b, w + gap]]) {
    for (let x = 0; x < w; x++) {
      const si = ((y + Y) * img.width + x) * img.ch;
      const di = (y * (w * 2 + gap) + x + xoff) * 4;
      out[di] = img.data[si]; out[di + 1] = img.data[si + 1];
      out[di + 2] = img.data[si + 2]; out[di + 3] = 255;
    }
  }
}
const dest = path.join(ROOT, 'reports', `crop-${slug}-${vp}-${Y}.png`);
writePNG(dest, w * 2 + gap, h, out);
console.log('wrote', dest, `(reference: ${path.basename(path.dirname(refFile))}, left = reference, right = Astro)`);
