// Serves the MD|442 Android app as a real .apk download (Content-Type and file name set so phones offer Install).
const zlib = require('zlib'), fs = require('fs'), path = require('path');
let apk = null;
async function load(host) {
  if (apk) return apk;
  let gz;
  try { gz = fs.readFileSync(path.join(__dirname, '..', 'md442', 'android', 'md442-apk.gz')); }
  catch (_) { const r = await fetch('https://' + host + '/md442/android/md442-apk.gz'); gz = Buffer.from(await r.arrayBuffer()); }
  return (apk = zlib.gunzipSync(gz));
}
module.exports = async (req, res) => {
  try {
    const b = await load(req.headers.host || 'music.nestgroup.space');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="md442.apk"');
    res.setHeader('Content-Length', b.length);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.statusCode = 200; res.end(req.method === 'HEAD' ? undefined : b);
  } catch (e) { res.statusCode = 500; res.end('MD|442 Android download is unavailable right now. Try again in a minute.'); }
};
