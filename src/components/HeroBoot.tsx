"use client";

import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub, FaFileAlt } from "react-icons/fa";

// The hero videos are rendered by scripts/hero/render.mjs from the desk photo.
// These match the photo's pixel space and LINK_BAND in scripts/hero/scene.js,
// the empty band left on the monitor where the real links sit.
const PHOTO_W = 2000;
const PHOTO_H = 1500;
const LINK_BAND = { x: 928, y: 540, w: 300, h: 80 };
// The boot-up plays a little slower than rendered so the terminal text is readable.
const BOOT_SPEED = 0.75;
// Fraction of the boot-up at which the monitor has powered on.
const MONITOR_ON = 0.5;

const links = [
	{ label: "Resume", href: "/Ethan_Ngo_Resume.pdf", Icon: FaFileAlt },
	{ label: "GitHub", href: "https://github.com/ethan-ngo", Icon: FaGithub },
	{ label: "LinkedIn", href: "https://linkedin.com/in/ethan48", Icon: FaLinkedin },
];

type Band = { left: number; top: number; width: number; height: number };
// "boot" plays once on load, then "idle" loops forever; "still" shows the finished
// frame for reduced motion or when the browser blocks autoplay.
type Phase = "boot" | "idle" | "still";

const HeroBoot = () => {
	const stageRef = useRef<HTMLDivElement>(null);
	const bootRef = useRef<HTMLVideoElement>(null);
	const idleRef = useRef<HTMLVideoElement>(null);
	const [band, setBand] = useState<Band | null>(null);
	const [phase, setPhase] = useState<Phase>("boot");
	const [monitorOn, setMonitorOn] = useState(false);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("still");
	}, []);

	// Place the links over the monitor using the same cover crop as the video.
	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;
		const place = () => {
			const { width, height } = stage.getBoundingClientRect();
			const scale = Math.max(width / PHOTO_W, height / PHOTO_H);
			const offsetX = (width - PHOTO_W * scale) / 2;
			const offsetY = (height - PHOTO_H * scale) / 2;
			setBand({
				left: offsetX + LINK_BAND.x * scale,
				top: offsetY + LINK_BAND.y * scale,
				width: LINK_BAND.w * scale,
				height: LINK_BAND.h * scale,
			});
		};
		place();
		const observer = new ResizeObserver(place);
		observer.observe(stage);
		return () => observer.disconnect();
	}, []);

	// Play the boot-up once, then hand off to the idle loop.
	useEffect(() => {
		if (phase !== "boot") return;
		const boot = bootRef.current;
		const idle = idleRef.current;
		if (!boot || !idle) return;

		const finish = () => {
			boot.pause();
			setMonitorOn(true);
			idle.play().then(() => setPhase("idle")).catch(() => setPhase("still"));
		};
		const onTime = () => {
			if (boot.duration && boot.currentTime >= boot.duration * MONITOR_ON) setMonitorOn(true);
		};
		// Visitors who scroll away early skip straight to the finished room.
		const onScroll = () => {
			if (window.scrollY > 40) finish();
		};

		// Loading a video resets playbackRate to the default, so set both.
		boot.defaultPlaybackRate = BOOT_SPEED;
		boot.playbackRate = BOOT_SPEED;
		boot.addEventListener("timeupdate", onTime);
		boot.addEventListener("ended", finish);
		window.addEventListener("scroll", onScroll, { passive: true });
		boot.play().catch(() => setPhase("still"));
		return () => {
			boot.removeEventListener("timeupdate", onTime);
			boot.removeEventListener("ended", finish);
			window.removeEventListener("scroll", onScroll);
		};
	}, [phase]);

	return (
		<section id="home" className="relative h-screen">
			<div ref={stageRef} className="relative h-full overflow-hidden bg-black">
				{phase === "still" ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src="/hero/poster-end.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
				) : (
					<>
						<video
							ref={bootRef}
							src="/hero/boot.mp4"
							poster="/hero/poster-start.jpg"
							muted
							playsInline
							preload="auto"
							aria-hidden="true"
							className="absolute inset-0 h-full w-full object-cover"
						/>
						{/* Fades in over the boot-up's last frame so the handoff has no visible jump. */}
						<video
							ref={idleRef}
							src="/hero/idle.mp4"
							muted
							playsInline
							loop
							preload="auto"
							aria-hidden="true"
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${phase === "idle" ? "opacity-100" : "opacity-0"}`}
						/>
					</>
				)}

				{/* Fade the room into the page background so the projects section follows on smoothly. */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0b0b10]" />

				{/* Headline sits on the left wall; on portrait screens it moves to the dark desk edge at the bottom. */}
				<div className="absolute left-0 top-0 px-6 pt-24 md:px-16 md:pt-20 portrait:top-auto portrait:bottom-0 portrait:pb-12 portrait:pt-6 [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
					<h1 className="text-[clamp(2.1rem,3.6vw,3.75rem)] font-bold leading-tight text-white">
						Hi, I&apos;m <span className="text-[#00b4d8]">Ethan Ngo</span>
					</h1>
					<p className="mt-3 text-[clamp(1rem,1.6vw,1.25rem)] text-gray-200">Software Engineer · AI and Full-Stack</p>
				</div>

				{band && (
					<div
						className="absolute flex justify-between"
						style={{ left: band.left, top: band.top, width: band.width, height: band.height }}
					>
						{links.map(({ label, href, Icon }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noreferrer"
								aria-label={label}
								title={label}
								className={`flex aspect-square h-full items-center justify-center rounded-lg border text-[clamp(1rem,2.2vw,1.9rem)] transition-all duration-500 hover:bg-[#00b4d8] hover:text-[#04161e] ${
									monitorOn || phase === "still"
										? "border-[#00b4d8] bg-[#04161e]/70 text-[#7fdcef] shadow-[0_0_18px_rgba(0,180,216,0.45)]"
										: "border-[#00b4d8]/40 bg-black/40 text-[#7fdcef]/80"
								} ${phase === "idle" ? "animate-breathe" : ""}`}
							>
								<Icon />
							</a>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default HeroBoot;
