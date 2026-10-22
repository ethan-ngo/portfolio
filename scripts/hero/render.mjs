// Renders the hero boot-up sequence to a scroll-scrubbable MP4.
//
//   node scripts/hero/render.mjs [--frames 72] [--width 1280]
//
// Headless Edge (or Chrome) composites the desk photo and the HUD from
// scene.js for every frame, then ffmpeg stitches the frames into an H.264
// video with a keyframe on every frame so the site can seek to any scroll
// position instantly. The first and last frames are also saved as stills
// for the poster and for visitors who prefer reduced motion.
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
const WIDTH = opt('width', 1280);
const HEIGHT = Math.round((WIDTH * 1500) / 2000);

const pageHtml = `<!doctype html><canvas id="c" width="${WIDTH}" height="${HEIGHT}"></canvas>
<script type="module">
import { drawFrame, photoDim, PHOTO_W, PHOTO_H } from './scene.js';
const c = document.getElementById('c').getContext('2d');
const photo = new Image();
photo.src = 'setup.webp';
await photo.decode();
window.renderFrame = (p, quality) => {
	c.setTransform(1, 0, 0, 1, 0, 0);
	c.drawImage(photo, 0, 0, ${WIDTH}, ${HEIGHT});
	c.fillStyle = 'rgba(0,0,0,' + photoDim(p) + ')';
	c.fillRect(0, 0, ${WIDTH}, ${HEIGHT});
	c.setTransform(${WIDTH} / PHOTO_W, 0, 0, ${HEIGHT} / PHOTO_H, 0, 0);
	drawFrame(c, p);
	return c.canvas.toDataURL('image/jpeg', quality);
};
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
await browser.close();

const video = path.join(heroDir, 'boot.mp4');
execFileSync('ffmpeg', [
	'-y', '-loglevel', 'error',
	'-framerate', '24', '-i', path.join(tmp, '%03d.jpg'),
	'-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-g', '1',
	'-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
	video,
]);
console.log(`frames kept for review: ${tmp}`);
console.log(`boot.mp4: ${(statSync(video).size / 1024).toFixed(0)} KB, ${FRAMES} frames at ${WIDTH}x${HEIGHT}`);

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
