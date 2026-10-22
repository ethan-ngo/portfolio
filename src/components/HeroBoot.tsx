"use client";

import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub, FaFileAlt } from "react-icons/fa";

// The hero video is rendered by scripts/hero/render.mjs from the desk photo.
// These match the photo's pixel space and LINK_BAND in scripts/hero/scene.js,
// the empty band left on the monitor where the real links sit.
const PHOTO_W = 2000;
const PHOTO_H = 1500;
const LINK_BAND = { x: 928, y: 540, w: 300, h: 80 };
// Scroll progress at which the monitor has powered on in the video.
const MONITOR_ON = 0.5;

const links = [
	{ label: "Resume", href: "/Ethan_Ngo_Resume.pdf", Icon: FaFileAlt },
	{ label: "GitHub", href: "https://github.com/ethan-ngo", Icon: FaGithub },
	{ label: "LinkedIn", href: "https://linkedin.com/in/ethan48", Icon: FaLinkedin },
];

type Band = { left: number; top: number; width: number; height: number };

const HeroBoot = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const hintRef = useRef<HTMLDivElement>(null);
	const [band, setBand] = useState<Band | null>(null);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [monitorOn, setMonitorOn] = useState(false);

	useEffect(() => {
		setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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

	// Scrub the video with the scroll position.
	useEffect(() => {
		if (reducedMotion) {
			setMonitorOn(true);
			return;
		}
		const video = videoRef.current;
		const section = sectionRef.current;
		if (!video || !section) return;

		// iOS only buffers a muted video once it has started playing.
		video.play().then(() => video.pause()).catch(() => {});

		let frame = 0;
		const update = () => {
			frame = 0;
			const rect = section.getBoundingClientRect();
			const scrollable = rect.height - window.innerHeight;
			// Finish the boot a little before the end so the final state holds briefly.
			const progress = Math.min(1, Math.max(0, -rect.top / (scrollable * 0.85)));
			if (video.duration) video.currentTime = progress * (video.duration - 0.05);
			if (hintRef.current) hintRef.current.style.opacity = String(1 - Math.min(1, progress * 12));
			setMonitorOn(progress >= MONITOR_ON);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		video.addEventListener("loadedmetadata", update);
		update();
		return () => {
			window.removeEventListener("scroll", onScroll);
			video.removeEventListener("loadedmetadata", update);
			cancelAnimationFrame(frame);
		};
	}, [reducedMotion]);

	return (
		<section id="home" ref={sectionRef} className={reducedMotion ? "relative h-screen" : "relative h-[220vh]"}>
			<div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-black">
				{reducedMotion ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src="/hero/poster-end.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
				) : (
					<video
						ref={videoRef}
						src="/hero/boot.mp4"
						poster="/hero/poster-start.jpg"
						muted
						playsInline
						preload="auto"
						aria-hidden="true"
						className="absolute inset-0 h-full w-full object-cover"
					/>
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
									monitorOn
										? "border-[#00b4d8] bg-[#04161e]/70 text-[#7fdcef] shadow-[0_0_18px_rgba(0,180,216,0.45)]"
										: "border-[#00b4d8]/40 bg-black/40 text-[#7fdcef]/80"
								}`}
							>
								<Icon />
							</a>
						))}
					</div>
				)}

				{!reducedMotion && (
					<div ref={hintRef} className="absolute bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs tracking-[0.3em] text-gray-400 portrait:hidden">
						SCROLL TO POWER ON
					</div>
				)}
			</div>
		</section>
	);
};

export default HeroBoot;
