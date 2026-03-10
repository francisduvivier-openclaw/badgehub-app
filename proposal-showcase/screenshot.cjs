const { chromium } = require('playwright');
const path = require('path');

const pages = [
  'index.html',
  'a1-local-agent.html',
  'a2-pr-bot.html',
  'n1-rulesplit.html',
  'n2-workbench.html',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
  const baseDir = __dirname;

  for (const f of pages) {
    const p = 'file://' + path.join(baseDir, f);
    await page.goto(p, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(baseDir, f.replace('.html', '.png')), fullPage: true });
    console.log('shot', f);
  }

  await browser.close();
})();
