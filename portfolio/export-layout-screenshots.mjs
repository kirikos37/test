import puppeteer from '../kwork-cover/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, 'projects');
const kworkDir = path.join(__dirname, 'screenshots', 'kwork-layout');

const works = [
  { file: '07-responsive-adapt.html', output: '01-responsive-adapt.png', title: 'Адаптация До/После' },
  { file: '08-catalog-grid.html', output: '02-catalog-grid.png', title: 'Адаптивный каталог' },
  { file: '09-mobile-nav.html', output: '03-mobile-nav.png', title: 'Адаптивная навигация' },
  { file: '10-form-responsive.html', output: '04-form-responsive.png', title: 'Адаптивная форма' },
  { file: '11-table-adaptive.html', output: '05-table-adaptive.png', title: 'Таблица → карточки' },
];

function findBrowser() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p));
}

fs.mkdirSync(kworkDir, { recursive: true });

const launchOptions = { headless: true };
const executablePath = findBrowser();
if (executablePath) launchOptions.executablePath = executablePath;

const browser = await puppeteer.launch(launchOptions);
const page = await browser.newPage();

for (const work of works) {
  const htmlPath = path.join(projectsDir, work.file);
  const kworkPath = path.join(kworkDir, work.output);

  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.screenshot({ path: kworkPath, type: 'png' });
  console.log(`✓ ${work.output} — ${work.title}`);
}

await browser.close();
console.log(`\nГотово! Загружайте из portfolio/screenshots/kwork-layout/`);
