// Renders the hero videos: the boot-up that auto-plays on load (boot.mp4) and
// the seamless loop that keeps the room alive afterwards (idle.mp4).
//
//   node scripts/hero/render.mjs [--frames 72] [--idle-frames 96] [--width 1280]
//
// Headless Edge (or Chrome) composites the desk photo and the HUD from
// scene.js for every frame, then ffmpeg stitches the frames into H.264
// videos. The first and last boot-up frames are also saved as stills for the
// poster and for visitors who prefer reduced motion.
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const heroDir = path.join(root, 'public/hero');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
	const i = args.indexOf(`--${name}`);
	return i >= 0 ? Number(args[i + 1]) : fallback;
};
const FRAMES = opt('frames', 72);
// 96 frames at 24 fps = a 4 s loop; scene.js repeats every idle motion within it.
const IDLE_FRAMES = opt('idle-frames', 96);
const WIDTH = opt('width', 1280);
const HEIGHT = Math.round((WIDTH * 1500) / 2000);

const pageHtml = `<!doctype html><canvas id="c" width="${WIDTH}" height="${HEIGHT}"></canvas>
<script type="module">
import { drawFrame, drawIdle, photoDim, PHOTO_W, PHOTO_H } from './scene.js';
const c = document.getElementById('c').getContext('2d');
const photo = new Image();
photo.src = 'setup.webp';
await photo.decode();
const render = (dim, draw, quality) => {
	c.setTransform(1, 0, 0, 1, 0, 0);
	c.drawImage(photo, 0, 0, ${WIDTH}, ${HEIGHT});
	c.fillStyle = 'rgba(0,0,0,' + dim + ')';
	c.fillRect(0, 0, ${WIDTH}, ${HEIGHT});
	c.setTransform(${WIDTH} / PHOTO_W, 0, 0, ${HEIGHT} / PHOTO_H, 0, 0);
	draw();
	return c.canvas.toDataURL('image/jpeg', quality);
};
window.renderFrame = (p, quality) => render(photoDim(p), () => drawFrame(c, p), quality);
window.renderIdle = (q) => render(photoDim(1), () => drawIdle(c, q), 0.95);
window.ready = true;
</script>`;

const browser = await launch();
const page = await browser.newPage();
// Serve everything from a fake origin so the canvas is never tainted.
await page.route('http://hero.local/**', (route) => {
	const file = new URL(route.request().url()).pathname.slice(1);
	if (file === 'index.html') return route.fulfill({ contentType: 'text/html', body: pageHtml });
	if (file === 'setup.webp') return route.fulfill({ contentType: 'image/webp', body: readFileSync(path.join(heroDir, file)) });
	return route.fulfill({ contentType: 'text/javascript', body: readFileSync(path.join(here, file)) });
});
await page.goto('http://hero.local/index.html');
await page.waitForFunction(() => window.ready);

const tmp = mkdtempSync(path.join(os.tmpdir(), 'hero-frames-'));
const save = (file, dataUrl) => writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
for (let i = 0; i < FRAMES; i++) {
	save(path.join(tmp, `${String(i).padStart(3, '0')}.jpg`), await page.evaluate((p) => window.renderFrame(p, 0.95), i / (FRAMES - 1)));
}
mkdirSync(heroDir, { recursive: true });
save(path.join(heroDir, 'poster-start.jpg'), await page.evaluate(() => window.renderFrame(0, 0.82)));
save(path.join(heroDir, 'poster-end.jpg'), await page.evaluate(() => window.renderFrame(1, 0.82)));
// q stops one frame short of 1 so the loop never shows its first frame twice.
const idleTmp = mkdtempSync(path.join(os.tmpdir(), 'hero-idle-'));
for (let i = 0; i < IDLE_FRAMES; i++) {
	save(path.join(idleTmp, `${String(i).padStart(3, '0')}.jpg`), await page.evaluate((q) => window.renderIdle(q), i / IDLE_FRAMES));
}
await browser.close();

const encode = (frames, file, crf) => {
	execFileSync('ffmpeg', [
		'-y', '-loglevel', 'error',
		'-framerate', '24', '-i', path.join(frames, '%03d.jpg'),
		'-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
		'-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
		path.join(heroDir, file),
	]);
	console.log(`${file}: ${(statSync(path.join(heroDir, file)).size / 1024).toFixed(0)} KB`);
};
encode(tmp, 'boot.mp4', 26);
encode(idleTmp, 'idle.mp4', 27);
console.log(`frames kept for review: ${tmp} (boot-up), ${idleTmp} (idle loop)`);

async function launch() {
	for (const channel of ['msedge', 'chrome']) {
		try {
			return await chromium.launch({ channel });
		} catch {
			// Try the next installed browser.
		}
	}
	throw new Error('Install Microsoft Edge or Google Chrome to render the hero frames.');
}
