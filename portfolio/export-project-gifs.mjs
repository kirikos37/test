import puppeteer from '../kwork-cover/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { PNG } from '../kwork-cover/node_modules/pngjs/lib/png.js';
import gifencPkg from '../kwork-cover/node_modules/gifenc/dist/gifenc.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { GIFEncoder, quantize, applyPalette } = gifencPkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, 'projects');
const outDir = path.join(__dirname, 'assets', 'previews');

const PREVIEW_W = 720;
const PREVIEW_H = 405;
const FRAME_COUNT = 28;
const FRAME_DELAY_MS = 160;

const projects = [
  { file: '06-react-interactive.html', gif: '06-react-interactive.gif' },
  { file: '03-developer-portfolio.html', gif: '03-developer-portfolio.gif' },
  { file: '01-saas-landing.html', gif: '01-saas-landing.gif' },
  { file: '02-coffee-shop.html', gif: '02-coffee-shop.gif' },
  { file: '04-fitness-app.html', gif: '04-fitness-app.gif' },
  { file: '05-online-course.html', gif: '05-online-course.gif' },
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

function pngToRgba(buffer) {
  return PNG.sync.read(buffer).data;
}

function framesToGif(frames, width, height, delayCs) {
  const gif = GIFEncoder();
  for (const buf of frames) {
    const rgba = pngToRgba(buf);
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    gif.writeFrame(index, width, height, { palette, delay: delayCs });
  }
  gif.finish();
  return Buffer.from(gif.bytes());
}

/** Подготовка страницы: фиксированный хедер, без прокрутки, видимый hero */
async function preparePage(page) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = 'auto';

    const nav = document.querySelector('.nav');
    if (nav) nav.classList.add('scrolled');

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      el.classList.add('visible');
    });

    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      if (!Number.isNaN(target)) el.textContent = String(target);
    });
  });
}

fs.mkdirSync(outDir, { recursive: true });

const launchOptions = { headless: true };
const executablePath = findBrowser();
if (executablePath) launchOptions.executablePath = executablePath;

const browser = await puppeteer.launch(launchOptions);
const page = await browser.newPage();

for (const proj of projects) {
  const htmlPath = path.join(projectsDir, proj.file);
  const gifPath = path.join(outDir, proj.gif);

  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));

  await preparePage(page);
  await new Promise((r) => setTimeout(r, 600));

  const frames = [];
  for (let i = 0; i < FRAME_COUNT; i++) {
    await new Promise((r) => setTimeout(r, FRAME_DELAY_MS));
    const buf = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: PREVIEW_W, height: PREVIEW_H },
    });
    frames.push(buf);
  }

  const gifBuf = framesToGif(frames, PREVIEW_W, PREVIEW_H, Math.round(FRAME_DELAY_MS / 10));
  fs.writeFileSync(gifPath, gifBuf);
  const kb = (gifBuf.length / 1024).toFixed(0);
  console.log(`✓ ${proj.gif} (${kb} KB)`);
}

await browser.close();
console.log(`\nГотово! GIF в portfolio/assets/previews/`);
