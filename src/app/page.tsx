"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    title: "RootsAI",
    description: "At DiamondHacks 2025, my team and I created RootsAI, winning the Best Use of Letta award. This application helps families navigate government assistance programs using Whisper and Google Gemini.",
    image: "/images/rootsai.png",
    technologies: ["React", "TypeScript", "MongoDB", "Express", "FastAPI", "Whisper", "Gemini API", "Auth0", "Docker"]
  },
  {
    title: "Domain Films",
    description: "test",
    image: "/images/",
    technologies: ["test"]
  },
  {
    title: "ZeroG Inbox",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Live Aid",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Carbon Closet",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Recycle or Not",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Neon Navigator",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Icebreak",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Personal Scheduling System",
    description: "",
    image: "/images/",
    technologies: []
  },
  {
    title: "Real-Time Chat",
    description: "",
    image: "/images/",
    technologies: []
  },
];

const experiences = [
	{
		company: 'FOX',
		position: 'Software Engineer',
		location: 'Century City, CA',
		date: '09/2025 - Present',
		logo: '/images/fox.jpg',
		tags: ['Internship'],
	},
  {
		company: 'Cal Poly Pomona',
		position: 'ML Researcher',
		location: 'Pomona, CA',
		date: '09/2025 - Present',
		logo: '/images/cpp.jpg',
		tags: ['Dr. Korah'],
	},
	{
		company: 'Neweggg',
		position: 'Software Engineer',
		location: 'Diamond Bar, CA',
		date: '06/2025 - 08/2025',
		logo: '/images/newegg.jpg',
		tags: ['Internship'],
	},
  {
		company: 'Cal Poly Pomona',
		position: 'UAV Researcher',
		location: 'Pomona, CA',
		date: '09/2024 - 05/2025',
		logo: '/images/cpp.jpg',
		tags: ['Dr. Bhandari'],
	},
  {
		company: 'SWE Association',
		position: 'Frontend Developer',
		location: 'Pomona, CA',
		date: '06/2023 - 05/2024',
		logo: '/images/sea.jpg',
		tags: ['Club Member'],
	},
  {
		company: 'Magikid',
		position: 'Robotics Coach',
		location: 'San Marino, CA',
		date: '02/2023 - 08/2024',
		logo: '/images/magikid.png',
		tags: ['Part-Time'],
	},

];

const typingStrings = ["Ethan Ngo.", "a Software Engineer."];

export default function Home() {
	// No conditional rendering for sections; all are always rendered
	const [displayText, setDisplayText] = useState("");
	const [typingIndex, setTypingIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const typingDelay = 100;
	const pauseDelay = 1600;

	// Typing animation effect
	useEffect(() => {
		let timeout: NodeJS.Timeout;
		const currentString = typingStrings[typingIndex];
		if (!isDeleting && charIndex < currentString.length) {
			setDisplayText(currentString.slice(0, charIndex + 1));
			timeout = setTimeout(() => setCharIndex(charIndex + 1), typingDelay);
		} else if (isDeleting && charIndex > 0) {
			setDisplayText(currentString.slice(0, charIndex - 1));
			timeout = setTimeout(() => setCharIndex(charIndex - 1), typingDelay / 2);
		} else {
			timeout = setTimeout(() => {
				if (!isDeleting) {
					setIsDeleting(true);
				} else {
					setIsDeleting(false);
					setTypingIndex((typingIndex + 1) % typingStrings.length);
				}
			}, pauseDelay);
		}
		return () => clearTimeout(timeout);
	}, [charIndex, isDeleting, typingIndex]);

	// Remove hashchange logic; all sections are always visible

	return (
		<div className="min-h-screen bg-[#13141f] text-white pl-20">
			<main className="container mx-auto px-4 py-12">
				{/* Introduction */}
				<section id="home" className="py-32 min-h-screen flex flex-col">
					<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 w-full max-w-5xl mx-auto">
						<div className="flex flex-col items-start justify-center text-left mx-auto md:col-span-7 w-full">
							<h1 className="text-5xl font-bold mb-4">
								Nice to meet you!
								<br />
								I&apos;m <span className="text-[#00b4d8]">{displayText}</span>
								<span className="border-r-2 border-[#00b4d8] ml-1 animate-pulse">&nbsp;</span>
							</h1>
							<p className="text-xl text-gray-300 mb-6">
								Passionate about building innovative solutions and creating
								impactful experiences through code.
							</p>
							<div className="flex gap-4 mt-4">
								<a
									href="https://linkedin.com"
									target="_blank"
									rel="noreferrer"
									className="text-[#00b4d8] hover:text-white transition-colors"
								>
									<FaLinkedin size={32} />
								</a>
								<a
									href="https://github.com"
									target="_blank"
									rel="noreferrer"
									className="text-[#00b4d8] hover:text-white transition-colors"
								>
									<FaGithub size={32} />
								</a>
							</div>
						</div>
						<div className="flex justify-center md:col-span-5 w-full">
							<div className="w-72 h-72 rounded-full bg-gray-800 ring-8 ring-gray-700 overflow-hidden flex items-center justify-center">
								<img src="/images/profile.jpg" alt="profile" className="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</section>

				{/* Projects */}
				<section id="projects" className="py-40 min-h-screen flex items-center">
					<div className="w-full">
						<h2 className="text-4xl font-bold mb-8">Projects</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{projects.map((p) => (
								<ProjectCard key={p.title} {...p} />
							))}
						</div>
					</div>
				</section>

				{/* Experience */}
				<section id="experience" className="py-40 min-h-screen flex items-center">
					<div className="w-full">
						<h2 className="text-4xl font-bold mb-8">Experience</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full bg-[#232532] rounded-xl overflow-hidden shadow-lg">
								<thead>
									<tr className="text-left text-lg text-white">
										<th className="px-8 py-6 font-bold">COMPANY</th>
										<th className="px-8 py-6 font-bold">POSITION</th>
										<th className="px-8 py-6 font-bold">DATE</th>
									</tr>
								</thead>
								<tbody>
									{experiences.map((e, idx) => (
										<tr key={e.company + e.position} className="border-t border-[#31323d]">
											<td className="flex items-center gap-4 px-8 py-6">
												<img src={e.logo} alt={e.company} className="w-12 h-12 rounded-full object-cover bg-[#181926] border-2 border-[#232532]" />
												<div>
													<div className="font-bold text-white text-lg">{e.company}</div>
													<div className="text-gray-400 text-sm">{e.location}</div>
												</div>
											</td>
											<td className="px-8 py-6 align-top">
												<div className="font-semibold text-white text-lg">{e.position}</div>
												<div className="flex flex-wrap gap-2 mt-2">
													{e.tags.map((tag) => (
														<span key={tag} className="px-3 py-1 bg-[#393b48] text-gray-200 rounded-full text-sm">
															{tag}
														</span>
													))}
												</div>
											</td>
											<td className="px-8 py-6 align-top text-white text-lg whitespace-nowrap">{e.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}