// Renders the 3D plan (plan3d.js) to tools/plan3d.png, used by crop.py to rebuild slide 2.
// Usage: node tools/render_plan.js   (needs playwright + a Chromium; CHROMIUM=/path overrides the browser)
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const root = path.resolve(__dirname, '..');
  const b = await chromium.launch({ args: ['--no-sandbox'], executablePath: process.env.CHROMIUM || undefined });
  const p = await b.newPage({ viewport: { width: 1400, height: 570 }, deviceScaleFactor: 2 });
  await p.setContent(`<!doctype html><meta charset="utf-8"><body style="margin:0;background:transparent">
    <svg id="s" style="width:1400px;height:570px"></svg></body>`);
  await p.addScriptTag({ path: path.join(root, 'plan3d.js') });
  await p.evaluate(() => Plan3D.render(document.getElementById('s')));
  await p.screenshot({ path: path.join(__dirname, 'plan3d.png'), omitBackground: true });
  await b.close();
})();
