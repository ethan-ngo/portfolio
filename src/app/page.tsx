"use client";

import { FaLinkedin, FaGithub, FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import ProjectCard from '@/components/ProjectCard';
import Image from "next/image";

const projects = [
  {
    title: "RootsAI",
    description: "This application helps families navigate government assistance programs using agentic AI. RootsAI maintains conversations that remember users' details across sessions, providing personalized guidance in the user's preferred language to simplify complex government processes. Awarded Best Use of Letta at Diamond Hacks 2025. ",
    image: "/images/rootsai.png",
    technologies: ["React", "TypeScript", "FastAPI", "Whisper", "Gemini API", "Auth0", "Docker", "Letta"],
	link: "https://www.hackroots.tech/",
	githubLink: "https://github.com/lyeric2022/diamondhacks2025",
  },
  {
    title: "Domain Films",
    description: "In my Software Engineering course, I codeveloped with 4 students a full-stack movie streaming app. The project features both web and mobile interfaces, allowing users to browse, search, get recommended, and stream movies and shows seamlessly across devices.",
    image: "/images/domainfilms.png",
    technologies: ["MongoDB", "React Native", "Express.js", "Node.js", "Javascript", "Expo", "AWS", "Jellyfin"],
	githubLink: "https://github.com/ethan-ngo/CS4800-Netflix"
  },
  {
    title: "ZeroG Inbox",
    description: "The tinder for email organization connects to gmail account. In one swipe, eliminate inbox clutter with AI powered summarizations, folder management, and smart replies. Awarded Best AI/ML project at Fullyhacks 2025 ",
    image: "/images/zerog.png",
    technologies: ["Next.js", "TypeScript", "Python", "Flask", "Clerk", "Gemini API", "Gmail API", "ShadCN", "Tailwind CSS"],
	githubLink: "https://github.com/ethan-ngo/fullyhacks2025",
	link: "https://youtu.be/j9X4relETyw?si=08JLia7NaP0pBCPM"
  },
  {
    title: "Live Aid",
    description: "Comprehensive financial impact dashboard that visualizes the economic consequences of displacement in conflict regions. Key features include interactive map visualization, economic loss estimation, predictive modeling, and AI based resource allocation recommendations. Awarded Wolfram Alpha and vly.ai prizes at Hacktech 2025.",
    image: "/images/liveaid.png",
    technologies: ["Convex", "OpenAI API", "Next.js", "TypeScript", "scikit-learn", "Python", "newsdata.io"],
	githubLink: "https://github.com/xhcarina/Hacktech25-LiveAid",
	link: "https://dyzlq9-3000.csb.app/"
  },
  {
    title: "Carbon Closet",
    description: "A gamified thrift e-commerce platform that streamlines buying, selling, and donating vintage clothes. It aims to save users time while encouraging sustainable fashion through an engaging token and gacha reward system. Won 3rd at Broncohacks 2025.",
    image: "/images/carboncloset.png",
    technologies: ["Firebase", "Next.js", "Python", "JavaScript", "Flask", "ShadCN"],
	githubLink: "https://github.com/uuriah/LeBroncoHacks",
	link: "https://www.youtube.com/watch?v=Rzp-D-KonUo"
  },
  {
    title: "Recycle or Not",
    description: "Computer vision web app that detects and classifys items as recyclabe in real time using the Ultrallytics YOLO model. Awarded best sustainibility project at Rosehacks 2025.",
    image: "/images/recycle.jpg",
    technologies: ["OpenCV", "Python", "Flask", "JavaScript", "React"],
	githubLink: "https://github.com/joshmre/computer-vision-webapp",
	link: "https://www.youtube.com/watch?v=oJyRTPOPXxo"
  },
   {
    title: "UAV Obstacle Avoidance",
    description: "Worked on the LiDAR team among a group of 30 students to compete in the SUAS competition. Researched and developed an algorithm to convert PointCloud2 data into a set of closest obstacle points that a Pixhawk can consume via MAVLink messages.",
    image: "/images/lidar2.png",
    technologies: ["ROS", "Python","C++", "Linux", "Bash", "PointCloud2", "JetsonNano", "LiDAR"],
	githubLink: "https://github.com/CPP-Aerial-Vision-Analysis-System/Obstacle_Avoidance_2024-2025"
  },
  {
    title: "Icebreak",
    description: "Worked with CPP SEA club to create a central hub for members to be always updated on the latest events while providing features to incentivize member growth. Designed responsive user-interfaces.",
    image: "/images/icebreak.png",
    technologies: ["Expo", "React Native", "JavaScript", "Express.js", "PostgreSQL", "Prisma", "Redis"],
	githubLink: "https://github.com/cppsea/icebreak"
  },
  {
    title: "Personal Scheduling System",
    description: "A smart digital planner that makes it easy for you to plan your day, week, or month without any scheduling conflicts. It's built using a Model-View-Controller architecture and is designed with object-oriented programming principles.",
    image: "/images/pss2.png",
    technologies: ["Next.js", "JavaScript", "Python", "Flask"],
	githubLink: "https://github.com/omarcruz999/PersonalSchedulingSystem",
	link: "https://www.youtube.com/watch?v=4dcPYF_yOcw"
  },
  {
    title: "Real-Time Chat",
    description: "For my systems programming class, I built a multi-user, real-time chat system, using TCP sockets and threads. It allows multiple client programs to connect to a server, send messages, and have the messages relayed to all other connected clients.",
    image: "/images/chat.jpg",
    technologies: ["C", "Linux"],
	githubLink: "https://github.com/ethan-ngo/cs2600"
  },
  {
    title: "Neon Navigator",
    description: "Codeveloped with 5 students a 2.5D platformer game that splits between puzzle-solving and auto-scroller.",
    image: "/images/neon.png",
    technologies: ["C#", "Unity"],
	githubLink: "https://github.com/Lfer58/Neon-Navigator",
	link:"https://www.youtube.com/watch?v=AJF5Z4aIbgA"
  },
];

const experiences: Array<{
	company: string | React.ReactNode;
	position: string;
	location: string;
	date: string;
	logo: string;
	tags: string[];
}> = [
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
		company: <>Software Engineering<br/>Association</>,
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
		<div className="min-h-screen bg-[#13141f] text-white md:pl-[calc(var(--sidebar-open,1)*80px)]">
			<main className="container mx-auto px-4">
				{/* Introduction */}
				<section id="home" className="min-h-screen flex flex-col justify-center">
					<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8 w-full max-w-5xl mx-auto">
						<div className="flex flex-col items-start justify-center text-left mx-auto md:col-span-7 w-full">
							<h1 className="text-5xl font-bold mb-4">
								Nice to meet you!
								<br />
								I&apos;m <span className="text-[#00b4d8]">{displayText}</span>
								<span className="border-r-2 border-[#00b4d8] ml-1 animate-pulse">&nbsp;</span>
							</h1>
							<p className="text-xl text-gray-300 mb-6">
								Currently I&apos;m studying computer science and data science at California State Polytechnic University, Pomona.
							</p>
							<div className="flex gap-4 mt-4">
								<a
									href="https://linkedin.com/in/ethan48"
									target="_blank"
									rel="noreferrer"
									className="text-[#00b4d8] hover:text-white transition-colors"
								>
									<FaLinkedin size={32} />
								</a>
								<a
									href="https://github.com/ethan-ngo"
									target="_blank"
									rel="noreferrer"
									className="text-[#00b4d8] hover:text-white transition-colors"
								>
									<FaGithub size={32} />
								</a>
								<a
									href="/Portfolio_Resume.pdf"
									target="_blank"
									rel="noreferrer"
									className="text-[#00b4d8] hover:text-white transition-colors"
									title="View Resume"
								>
									<FaFileAlt size={32} />
								</a>
							</div>
						</div>
						<div className="flex justify-center md:col-span-5 w-full">
											<div className="w-72 h-72 rounded-full bg-gray-800 ring-8 ring-gray-700 overflow-hidden flex items-center justify-center">
												<Image src="/images/profile.jpg" alt="profile" width={288} height={288} className="w-full h-full object-cover" priority />
											</div>
						</div>
					</div>
				</section>

				{/* Projects */}
				<section id="projects" className="py-20 min-h-screen flex items-center">
					<div className="w-full px-4">
						<h2 className="text-4xl font-bold mb-8">Projects</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{projects.map((p) => (
								<ProjectCard key={p.title} {...p} />
							))}
						</div>
					</div>
				</section>

				{/* Experience */}
				<section id="experience" className="py-20 min-h-screen flex items-center">
					<div className="w-full px-4">
						<h2 className="text-4xl font-bold mb-8">Experience</h2>
						<div className="overflow-x-auto">
							<table className="min-w-full bg-[#232532] rounded-xl overflow-hidden shadow-lg">
								<thead>
									<tr className="text-left text-lg text-white">
										<th className="px-8 py-6 font-bold w-2/5">COMPANY</th>
										<th className="px-8 py-6 font-bold w-2/5">POSITION</th>
										<th className="px-8 py-6 font-bold w-1/5">DATE</th>
									</tr>
								</thead>
								<tbody>
													{experiences.map((e) => (
										<tr key={e.company + e.position} className="border-t border-[#31323d]">
											<td className="flex items-center gap-4 px-8 py-6">
																		<Image src={e.logo} alt={typeof e.company === 'string' ? e.company : 'company logo'} width={48} height={48} className="w-12 h-12 rounded-full object-cover bg-[#181926] border-2 border-[#232532]" />
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