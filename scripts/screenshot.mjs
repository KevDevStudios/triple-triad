import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const buildDir = path.join(repoRoot, 'build');

if (!fs.existsSync(buildDir)) {
  console.error('Missing build/ folder. Run `npm run build` first.');
  process.exit(1);
}

const port = 4173;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
};

function safeJoin(root, reqPath) {
  const clean = reqPath.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(clean);
  const candidate = path.normalize(path.join(root, decoded));
  if (!candidate.startsWith(root)) return null;
  return candidate;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';
  const resolved = safeJoin(buildDir, urlPath === '/' ? '/index.html' : urlPath);
  if (!resolved) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  let filePath = resolved;

  // SPA fallback
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(buildDir, 'index.html');
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';
    const data = fs.readFileSync(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

await new Promise((resolve) => server.listen(port, resolve));

const url = `http://localhost:${port}/`;
const outDir = path.join(repoRoot, 'artifacts');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `gameboard-${Date.now()}.png`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  // If a start overlay (coin flip) exists, wait for it to finish so the screenshot
  // captures the game layout.
  try {
    await page.waitForSelector('[data-testid="coinflip-overlay"]', { state: 'detached', timeout: 6500 });
  } catch {
    // ignore
  }
  await page.waitForTimeout(250);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved screenshot: ${outPath}`);
} finally {
  await browser.close();
  server.close();
}
