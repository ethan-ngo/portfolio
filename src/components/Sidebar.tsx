import { FaHome, FaProjectDiagram, FaBriefcase } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav aria-label="Main navigation" className="fixed left-0 top-0 h-full w-20 bg-[#1a1b26] flex flex-col justify-center items-center py-8 text-white">
      <div className="flex flex-col gap-8 w-full items-center justify-center h-full">
        <a href="#home" className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaHome size={24} />
            <span className="text-xs mt-1 block">Home</span>
          </div>
        </a>
        <a href="#projects" className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaProjectDiagram size={24} />
            <span className="text-xs mt-1 block">Projects</span>
          </div>
        </a>
        <a href="#experience" className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaBriefcase size={24} />
            <span className="text-xs mt-1 block">Experience</span>
          </div>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;