// Ad-hoc sign the Mac app. Unsigned Apple Silicon apps are reported as "damaged";
// ad-hoc signed ones get the normal "Open Anyway" prompt instead.
const { execFileSync } = require('child_process');
exports.default = async ctx => {
  if (ctx.electronPlatformName !== 'darwin' || /-temp$/.test(ctx.appOutDir)) return; // sign only the merged universal app
  const app = `${ctx.appOutDir}/${ctx.packager.appInfo.productFilename}.app`;
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' });
};
