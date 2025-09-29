"use client";

import { FaHome, FaProjectDiagram, FaBriefcase } from 'react-icons/fa';

const Sidebar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      let scrollTarget = element.offsetTop;
      
      // For sections with headers, scroll to position the header at the top of viewport
      if (sectionId === 'projects' || sectionId === 'experience') {
        const header = element.querySelector('h2');
        if (header) {
          // Get the absolute position of the header from the top of the page
          const headerRect = (header as HTMLElement).getBoundingClientRect();
          const pageYOffset = window.pageYOffset || document.documentElement.scrollTop;
          scrollTarget = headerRect.top + pageYOffset;
        }
      }
      
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav aria-label="Main navigation" className="fixed left-0 top-0 h-full w-20 bg-[#1a1b26] flex flex-col justify-center items-center py-8 text-white">
      <div className="flex flex-col gap-8 w-full items-center justify-center h-full">
        <button onClick={() => scrollToSection('home')} className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaHome size={24} />
            <span className="text-xs mt-1 block">Home</span>
          </div>
        </button>
        <button onClick={() => scrollToSection('projects')} className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaProjectDiagram size={24} />
            <span className="text-xs mt-1 block">Projects</span>
          </div>
        </button>
        <button onClick={() => scrollToSection('experience')} className="w-full flex justify-center">
          <div className="flex flex-col items-center justify-center hover:text-[#00b4d8] transition-colors p-3 w-full">
            <FaBriefcase size={24} />
            <span className="text-xs mt-1 block">Experience</span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;