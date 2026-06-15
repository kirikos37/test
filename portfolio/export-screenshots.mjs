import puppeteer from '../kwork-cover/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, 'projects');
const kworkDir = path.join(__dirname, 'screenshots', 'kwork');
const fullDir = path.join(__dirname, 'screenshots', 'full');

const works = [
  { file: '06-react-interactive.html', output: '01-react-interactive.png', title: 'React-интерфейс ReactFlow', order: 1 },
  { file: '03-developer-portfolio.html', output: '02-developer-portfolio.png', title: 'Портфолио Frontend', order: 2 },
  { file: '01-saas-landing.html', output: '03-saas-landing.png', title: 'SaaS CloudFlow', order: 3 },
  { file: '02-coffee-shop.html', output: '04-coffee-shop.png', title: 'Кофейня Brew & Bean', order: 4 },
  { file: '04-fitness-app.html', output: '05-fitness-app.png', title: 'FitPulse App', order: 5 },
  { file: '05-online-course.html', output: '06-online-course.png', title: 'SkillUp EdTech', order: 6 },
];

// Главная витрина портфолио (для ссылки в описании кворка, не для загрузки в сетку)
const showcase = { file: '../index.html', output: '00-portfolio-showcase.png', title: 'Витрина портфолио' };

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
fs.mkdirSync(fullDir, { recursive: true });

const launchOptions = { headless: true };
const executablePath = findBrowser();
if (executablePath) launchOptions.executablePath = executablePath;

const browser = await puppeteer.launch(launchOptions);
const page = await browser.newPage();

for (const work of works) {
  const htmlPath = path.join(projectsDir, work.file);
  const kworkPath = path.join(kworkDir, work.output);
  const fullPath = path.join(fullDir, work.output);

  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  // Kwork: hero-кадр 1280×800 — лучше смотрится в сетке портфолио
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.screenshot({ path: kworkPath, type: 'png' });
  console.log(`✓ Kwork  ${work.title} → screenshots/kwork/${work.output}`);

  // Полная страница — для детального просмотра
  await page.screenshot({ path: fullPath, type: 'png', fullPage: true });
  console.log(`  Full   ${work.title} → screenshots/full/${work.output}`);
}

// Витрина портфолио
{
  const htmlPath = path.join(__dirname, 'index.html');
  const kworkPath = path.join(kworkDir, showcase.output);
  const fullPath = path.join(fullDir, showcase.output);

  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500)); // дождаться анимаций hero

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.screenshot({ path: kworkPath, type: 'png' });
  console.log(`✓ Kwork  ${showcase.title} → screenshots/kwork/${showcase.output}`);

  await page.screenshot({ path: fullPath, type: 'png', fullPage: true });
  console.log(`  Full   ${showcase.title} → screenshots/full/${showcase.output}`);
}

await browser.close();
console.log(`\nГотово! Загружайте файлы из portfolio/screenshots/kwork/`);
console.log(`Витрина: откройте portfolio/index.html в браузере`);
