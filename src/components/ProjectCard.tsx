interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
}

const ProjectCard = ({ title, description, image, technologies }: ProjectCardProps) => {
  return (
    <div className="bg-[#1a1b26] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
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