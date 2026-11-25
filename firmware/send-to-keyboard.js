// ===== MD|442 → keyboard: SEND TO KEYBOARD (paste into md442.js section 7b, after midiLearn) =====
// Sends this beat's scenes to an SMK-37 / FM-1 running MD|442 firmware 1.1+, over USB-MIDI SysEx, no reflash.
// Scene 1..8 → keyboard patterns 9..16 (patterns 1-7 keep Mathew's factory beats). Firmware cmd 50 (see firmware/src/app/editor.c).
// Saving a beat (saveBeat) sends it automatically when an MD|442 keyboard has answered once this session.
const KB_ROWS = ['BD', 'SD', 'LT', 'MT', 'HT', 'RS', 'CP', 'CH', 'OH', 'CR', 'RD', 'AC', 'BS'];   // firmware drum909.h order, then accent, bass
const kb = { sx: null, outs: [], ok: false, wait: null };
const kbBits = row => { let m = 0; row.forEach((on, i) => { if (on) m |= 1 << i; }); return [m & 127, (m >> 7) & 127, (m >> 14) & 3]; };
function kbFrame(slot, sc) {
  const bpm = Math.round(P.bpm), sw = clamp(Math.round((P.shuffle - 50) / 25 * 100), 0, 100), root = 40 + Math.round(P.key), acid = Math.round(P['bs.acid'] || 0);
  const f = [0xF0, 0x7D, 0x46, 0x4C, 50, slot, bpm & 127, bpm >> 7, sw, root, acid];
  KB_ROWS.forEach(k => f.push(...kbBits(sc.g[k] || Array(16).fill(false))));
  sc.n.forEach(n => f.push(clamp(Math.round(n) + 64, 0, 127)));
  f.push(0xF7); return f;
}
function kbIn(e) {
  const d = e.data; if (!d || d[0] !== 0xF0 || d[1] !== 0x7D || d[2] !== 0x46 || d[3] !== 0x4C) return;
  if (d[4] === 50 && kb.wait) { const w = kb.wait; kb.wait = null; w(d[6] === 0); }
}
async function kbAccess() {
  if (kb.sx) return true;
  if (!navigator.requestMIDIAccess) { toast('Sending to the keyboard needs Chrome or Edge.'); return false; }
  try { kb.sx = await navigator.requestMIDIAccess({ sysex: true }); } catch (_) { toast('Allow MIDI (with SysEx) in the browser to send beats to the keyboard.'); return false; }
  const scan = () => { kb.outs = []; kb.sx.outputs.forEach(o => kb.outs.push(o)); kb.sx.inputs.forEach(i => i.addEventListener('midimessage', kbIn)); };
  kb.sx.onstatechange = scan; scan(); return true;
}
const kbAsk = (out, f) => new Promise(res => { kb.wait = res; try { out.send(f); } catch (_) { kb.wait = null; res(false); } setTimeout(() => { if (kb.wait === res) { kb.wait = null; res(false); } }, 1500); });
async function sendToKeyboard(quiet) {
  if (!(await kbAccess())) return;
  const scenes = S.scenes.slice(0, 8);
  for (const out of kb.outs) {                     // the first output that answers is the keyboard
    if (!(await kbAsk(out, kbFrame(8, scenes[0])))) continue;
    for (let i = 1; i < scenes.length; i++) await kbAsk(out, kbFrame(8 + i, scenes[i]));
    kb.ok = true;
    toast('Sent to ' + (out.name || 'the keyboard') + ': ' + scenes.length + (scenes.length > 1 ? ' scenes on patterns 9–' + (8 + scenes.length) : ' scene on pattern 9') + '. The dub stab stays on the computer.');
    return;
  }
  if (!quiet) toast('No MD|442 keyboard answered. Connect it by USB and check it runs MD|442 firmware 1.1 or newer.');
}
// in buildMidi: add a SEND TO KEYBOARD key to the row:
//   const sk = key('SEND TO KEYBOARD', () => sendToKeyboard(false)); row.append(con, lk, ck, sk);
// at the end of saveBeat():
//   if (kb.ok) sendToKeyboard(true);
// in the ⌘K shortcut list (optional): 'Send this beat to the keyboard'
