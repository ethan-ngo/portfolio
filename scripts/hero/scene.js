// Paints one frame of the hero boot-up HUD for scroll progress p (0..1).
// Coordinates are in the source photo's pixel space (2000x1500); the canvas is
// scaled so frames can be rendered at any resolution. The site composites the
// real Resume / GitHub / LinkedIn buttons into LINK_BAND on the monitor.

export const PHOTO_W = 2000;
export const PHOTO_H = 1500;

// A square HUD screen set just inside the monitor's bezel. The photo's monitor
// is slightly keystoned, so tracing it exactly made the straight text look crooked.
export const MONITOR = [[612, 182], [1545, 182], [1545, 715], [612, 715]];
// The terminal and the three square icon buttons under it are centered as one
// block on the visible part of the screen (x 612–1545, y 182 down to the laptop at 697).
const SCREEN_CENTER_X = 1078;
const TERMINAL_TOP = 262;
const TERMINAL_STEP = 30;
const TERMINAL_FONT = 25;
export const LINK_BAND = { x: SCREEN_CENTER_X - 150, y: 540, w: 300, h: 80 };

const CY = '0,180,216';
const LAPTOP_SCREEN = [[828, 698], [1279, 702], [1277, 1000], [830, 998]];
const LAPTOP_CUTOUT = [820, 692, 466, 320];
const OBJECTS = [
	// The stats panel covers the mic and the lamp's top edge, so their labels sit below them.
	{ label: 'microphone', conf: 0.98, pts: [[470, 725], [545, 705], [612, 820], [605, 905], [555, 912], [515, 832]], at: 0.14, labelAt: [470, 962] },
	{ label: 'lamp', conf: 0.95, circle: [318, 982, 134], at: 0.18, labelAt: [184, 1162] },
	{ label: 'laptop', conf: 0.99, pts: [[826, 697], [1280, 701], [1279, 1004], [1342, 1240], [768, 1236], [828, 1004]], at: 0.22, labelAt: [768, 1290] },
	{ label: 'mouse', conf: 0.97, ellipse: [1480, 1120, 72, 88], at: 0.26 },
	{ label: 'glasses', conf: 0.96, pts: [[1700, 945], [1990, 1065], [1948, 1208], [1640, 1082]], at: 0.3, labelAt: [1700, 935] },
	{ label: 'light panels', conf: 0.91, pts: [[1625, 122], [1998, 122], [1998, 500], [1625, 500]], at: 0.32 },
];
const TERMINAL = [
	'> whoami',
	'ethan ngo',
	'> cat education.json',
	'{ "school": "Cal Poly Pomona",',
	'  "degree": "B.S. Computer Science",',
	'  "minor": "Data Science",',
	'  "class": 2026 }',
	'> git status',
	'On branch open-to-opportunities',
];
// Mirrors the tech stack on github.com/ethan-ngo.
const SKILLS = [
	['LANGUAGES', ['Python · TypeScript · Java · C++']],
	['FRAMEWORKS', ['React · Next.js · FastAPI · Flask']],
	['DATABASES & TOOLS', ['MySQL · MongoDB · AWS · Docker']],
];

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Deterministic dots so every render of the same p is identical.
let seed = 3;
const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const DOTS = Array.from({ length: 140 }, () => ({ x: rand() * 2000, y: 120 + rand() * 1080, delay: rand() * 0.25, size: 1 + rand() * 2.5 }));

function poly(c, pts) {
	c.beginPath();
	pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
	c.closePath();
}

function glowStroke(c, alpha, width = 3) {
	c.strokeStyle = `rgba(${CY},${alpha})`;
	c.lineWidth = width;
	c.shadowColor = `rgba(${CY},${alpha})`;
	c.shadowBlur = 16;
	c.stroke();
	c.shadowBlur = 0;
}

function mono(c, text, x, y, size, alpha = 1, rgb = CY, weight = 500) {
	c.font = `${weight} ${size}px Consolas, "Cascadia Mono", ui-monospace, monospace`;
	c.fillStyle = `rgba(${rgb},${alpha})`;
	c.textAlign = 'left';
	c.textBaseline = 'middle';
	c.fillText(text, x, y);
}

function tag(c, text, x, y, alpha) {
	c.font = '600 24px Consolas, "Cascadia Mono", ui-monospace, monospace';
	const w = c.measureText(text).width + 16;
	c.fillStyle = `rgba(${CY},${0.85 * alpha})`;
	c.fillRect(x, y - 34, w, 34);
	c.fillStyle = `rgba(7,8,13,${alpha})`;
	c.textBaseline = 'middle';
	c.textAlign = 'left';
	c.fillText(text, x + 8, y - 17);
}

// Traces an outline progressively; k is the fraction of the perimeter drawn.
function traceObject(c, o, k, alpha) {
	c.save();
	c.beginPath();
	if (o.circle) {
		const [x, y, r] = o.circle;
		c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
	} else if (o.ellipse) {
		const [x, y, rx, ry] = o.ellipse;
		c.ellipse(x, y, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
	} else {
		poly(c, o.pts);
		c.setLineDash([4000 * k, 4000]);
	}
	glowStroke(c, alpha);
	c.restore();
}

function objectTop(o) {
	if (o.labelAt) return o.labelAt;
	if (o.circle) return [o.circle[0] - o.circle[2], o.circle[1] - o.circle[2] - 10];
	if (o.ellipse) return [o.ellipse[0] - o.ellipse[2], o.ellipse[1] - o.ellipse[3] - 10];
	return [Math.min(...o.pts.map((q) => q[0])), Math.min(...o.pts.map((q) => q[1])) - 10];
}

function panel(c, x, y, w, h, alpha, draw) {
	c.save();
	c.globalAlpha = alpha;
	c.fillStyle = `rgba(4,20,28,.55)`;
	c.fillRect(x, y, w, h);
	c.fillStyle = `rgba(${CY},.08)`;
	c.fillRect(x, y, w, h);
	// Panel borders breathe slowly while idle.
	c.strokeStyle = `rgba(${CY},${idle === null ? 0.75 : 0.6 + 0.25 * wave(1)})`;
	c.lineWidth = 2;
	c.strokeRect(x, y, w, h);
	c.fillStyle = `rgba(${CY},.95)`;
	c.fillRect(x, y, 70, 4);
	draw(x, y);
	c.restore();
}

// How much to darken the photo: the room starts dim and wakes up as it boots.
export const photoDim = (p) => 0.45 - 0.35 * seg(p, 0.05, 0.5);

// Idle phase (0..1) while drawIdle is rendering the loop that plays after the
// boot-up; null during the boot-up itself. Every idle motion repeats a whole
// number of times per loop so the last frame flows straight into the first.
let idle = null;
const TAU = Math.PI * 2;
const wave = (cycles, offset = 0) => Math.sin(TAU * (idle * cycles + offset));

export function drawIdle(c, q) {
	idle = q;
	drawFrame(c, 1);
	idle = null;
}

export function drawFrame(c, p) {
	// 1. Dots of light wake up across the room; while idle they drift and twinkle.
	for (const d of DOTS) {
		let a = seg(p, 0.02 + d.delay, 0.08 + d.delay) * (1 - 0.6 * seg(p, 0.6, 0.9));
		let y = d.y;
		if (idle !== null) {
			a *= 0.75 + 0.5 * wave(1 + (d.delay > 0.12 ? 1 : 0), d.delay * 4);
			y += 10 * wave(1, d.delay * 3);
		}
		if (a <= 0) continue;
		c.fillStyle = `rgba(${CY},${0.8 * a})`;
		c.shadowColor = `rgba(${CY},1)`;
		c.shadowBlur = 10;
		c.beginPath();
		c.arc(d.x, y, d.size * 2, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
	}

	// 2. A scan line sweeps the desk.
	const scan = seg(p, 0.08, 0.34);
	if (scan > 0 && scan < 1) {
		const x = scan * PHOTO_W;
		const g = c.createLinearGradient(x - 180, 0, x, 0);
		g.addColorStop(0, `rgba(${CY},0)`);
		g.addColorStop(1, `rgba(${CY},.22)`);
		c.fillStyle = g;
		c.fillRect(x - 180, 0, 180, PHOTO_H);
		c.fillStyle = `rgba(${CY},.9)`;
		c.fillRect(x, 0, 3, PHOTO_H);
	}

	// 3. The laptop boots first with a status ring.
	const lap = seg(p, 0.36, 0.42);
	if (lap > 0) {
		c.save();
		poly(c, LAPTOP_SCREEN);
		c.clip();
		c.fillStyle = `rgba(3,12,16,${0.92 * lap})`;
		c.fillRect(810, 680, 490, 340);
		const r = 62 * easeOut(seg(p, 0.38, 0.48));
		const cx = 1053, cy = 820;
		c.strokeStyle = `rgba(${CY},.85)`;
		c.lineWidth = 3;
		c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
		// While idle the inner rings keep turning: one and two full turns per loop.
		const spin = idle === null ? 0 : TAU * idle;
		c.beginPath(); c.arc(cx, cy, r * 0.72, p * 8 + spin, p * 8 + spin + 4); c.stroke();
		c.beginPath(); c.arc(cx, cy, r * 0.45, -p * 10 - 2 * spin, -p * 10 - 2 * spin + 2.5); c.stroke();
		mono(c, 'SYSTEM ONLINE', cx - 84, cy + 108, 26, seg(p, 0.46, 0.52) * (idle === null ? 1 : 0.85 + 0.15 * wave(2)));
		c.restore();
	}

	// 4. The monitor powers on and the terminal types out who I am. The band under
	// the text stays clear for the site's icon buttons, and the laptop is cut out
	// because it sits in front.
	const mon = seg(p, 0.44, 0.54);
	if (mon > 0) {
		c.save();
		c.beginPath();
		c.rect(0, 0, PHOTO_W, PHOTO_H);
		c.rect(...LAPTOP_CUTOUT);
		c.clip('evenodd');
		c.save();
		poly(c, MONITOR);
		c.clip();
		c.fillStyle = `rgba(4,22,30,${0.88 * mon})`;
		c.fillRect(540, 140, 1060, 620);
		c.strokeStyle = `rgba(${CY},${0.08 * mon})`;
		c.lineWidth = 1.5;
		for (let x = 570; x < 1580; x += 46) { c.beginPath(); c.moveTo(x, 150); c.lineTo(x, 750); c.stroke(); }
		for (let y = 170; y < 740; y += 46) { c.beginPath(); c.moveTo(560, y); c.lineTo(1580, y); c.stroke(); }

		const total = TERMINAL.join('').length;
		const shown = Math.floor(seg(p, 0.52, 0.74) * total);
		// Left-align the lines, but center the block by its widest finished line
		// so it doesn't drift sideways while typing.
		c.font = `500 ${TERMINAL_FONT}px Consolas, "Cascadia Mono", ui-monospace, monospace`;
		const left = SCREEN_CENTER_X - Math.max(...TERMINAL.map((line) => c.measureText(line).width)) / 2;
		let used = 0;
		TERMINAL.forEach((line, i) => {
			const n = clamp(shown - used, 0, line.length);
			used += line.length;
			if (n > 0) mono(c, line.slice(0, n), left, TERMINAL_TOP + i * TERMINAL_STEP, TERMINAL_FONT, mon, line.startsWith('>') ? '160,170,190' : CY);
		});
		// While idle, a cursor blinks after the last line (4 blinks per loop). It stays
		// on that line because the band below belongs to the site's icon buttons.
		if (idle !== null && (idle * 4) % 1 < 0.5) {
			const last = TERMINAL[TERMINAL.length - 1];
			const y = TERMINAL_TOP + (TERMINAL.length - 1) * TERMINAL_STEP;
			c.font = `500 ${TERMINAL_FONT}px Consolas, "Cascadia Mono", ui-monospace, monospace`;
			c.fillStyle = `rgba(${CY},.9)`;
			c.fillRect(left + c.measureText(last).width + 8, y - 13, 14, 26);
		}
		c.restore();
		poly(c, MONITOR);
		glowStroke(c, 0.7 * mon);
		c.restore();
	}

	// 5. Outlines and labels go on top so the screens never cover them.
	for (const o of OBJECTS) {
		const k = easeOut(seg(p, o.at, o.at + 0.08));
		if (k <= 0) continue;
		const alpha = 1 - 0.45 * seg(p, 0.75, 0.95);
		traceObject(c, o, k, alpha);
		if (k > 0.9) {
			const [x, y] = objectTop(o);
			tag(c, `${o.label} ${o.conf.toFixed(2)}`, x, y, seg(k, 0.9, 1) * alpha);
		}
	}

	// 6. Side panels with the highlights.
	// The skills panel overlaps the monitor's right edge so it reads larger.
	const left = easeOut(seg(p, 0.55, 0.7));
	const right = easeOut(seg(p, 0.6, 0.75));
	const status = easeOut(seg(p, 0.66, 0.8));
	if (right > 0) panel(c, 1440 + (1 - right) * 300, 520, 520, 290, right, (x, y) => {
		mono(c, 'SKILLS', x + 24, y + 40, 26, 0.9, CY, 700);
		let rowY = y + 88;
		for (const [title, lines] of SKILLS) {
			mono(c, title, x + 24, rowY, 20, 0.8, CY, 700);
			lines.forEach((line, j) => mono(c, line, x + 24, rowY + 30 + j * 30, 24, 1, '232,238,246'));
			rowY += 30 + lines.length * 30 + 12;
		}
	});
	// Centered in the empty wall between the photo's left edge and the monitor (x 0–612).
	if (left > 0) panel(c, 126 + (1 - left) * 300, 550, 360, 250, left, (x, y) => {
		mono(c, 'PROJECTS', x + 22, y + 40, 24, 0.8);
		mono(c, '16', x + 22, y + 92, 56, 1, '255,255,255');
		mono(c, 'AWARD-WINNING HACKS', x + 22, y + 152, 24, 0.8);
		mono(c, '6', x + 22, y + 204, 56, 1, '255,255,255');
	});
	if (status > 0) panel(c, 60, 1180, 400, 90, status, (x, y) => {
		mono(c, 'BOOT SEQUENCE · COMPLETE', x + 22, y + 48, 24, 1);
	});
}
