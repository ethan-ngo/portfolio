
import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
  githubLink?: string;
}


const ProjectCard = ({ title, description, image, technologies, link, githubLink }: ProjectCardProps) => {
  return (
    <div className="bg-[#1a1b26] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative group">
      <div className="relative">
        <Image src={image} alt={title} width={400} height={192} className="w-full h-48 object-cover" />
        
        {/* Glass Morphism Overlay */}
        {(link || githubLink) && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all duration-200 transform hover:scale-110 border border-white/30"
                title="View on GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub size={24} />
              </a>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all duration-200 transform hover:scale-110 border border-white/30"
                title="View Demo"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={20} />
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-[#2a2b36] text-[#00b4d8] rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;