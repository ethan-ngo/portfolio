"use client";

import { FaHome, FaProjectDiagram, FaBriefcase, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Update CSS custom property when sidebar state changes
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-open', isOpen ? '1' : '0');
  }, [isOpen]);
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
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-50 p-3 bg-[#1a1b26] text-white rounded-lg hover:text-[#00b4d8] transition-all duration-300 ${
            isOpen ? 'left-5' : 'left-4'
          }`}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Sidebar */}
        {isOpen && (
          <nav 
            aria-label="Main navigation" 
            className="fixed left-0 top-0 h-full w-20 bg-[#1a1b26] text-white flex flex-col justify-center items-center py-8 z-40 transition-all duration-300"
          >
            <div className="flex flex-col gap-8 w-full items-center justify-center h-full">
              <button 
                onClick={() => scrollToSection('home')} 
                className="flex flex-col items-center gap-2 p-3 hover:text-[#00b4d8] transition-all duration-200 hover:bg-[#232532] rounded-lg hover:-translate-y-1"
              >
                <FaHome size={24} />
                <span className="text-xs mt-1 block">Home</span>
              </button>
              <button 
                onClick={() => scrollToSection('projects')} 
                className="flex flex-col items-center gap-2 p-3 hover:text-[#00b4d8] transition-all duration-200 hover:bg-[#232532] rounded-lg hover:-translate-y-1"
              >
                <FaProjectDiagram size={24} />
                <span className="text-xs mt-1 block">Projects</span>
              </button>
              <button 
                onClick={() => scrollToSection('experience')} 
                className="flex flex-col items-center gap-2 p-3 hover:text-[#00b4d8] transition-all duration-200 hover:bg-[#232532] rounded-lg hover:-translate-y-1"
              >
                <FaBriefcase size={24} />
                <span className="text-xs mt-1 block">Experience</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-[#1a1b26] text-white rounded-full hover:text-[#00b4d8] transition-colors shadow-lg"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Mobile Overlay Menu */}
        {isOpen && (
          <nav 
            className="fixed top-16 left-4 bg-[#1a1b26] text-white rounded-lg shadow-xl z-40 p-4 min-w-[200px]"
          >
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => scrollToSection('home')} 
                className="flex items-center gap-3 p-3 hover:text-[#00b4d8] transition-colors hover:bg-[#232532] rounded-lg"
              >
                <FaHome size={18} />
                <span>Home</span>
              </button>
              <button 
                onClick={() => scrollToSection('projects')} 
                className="flex items-center gap-3 p-3 hover:text-[#00b4d8] transition-colors hover:bg-[#232532] rounded-lg"
              >
                <FaProjectDiagram size={18} />
                <span>Projects</span>
              </button>
              <button 
                onClick={() => scrollToSection('experience')} 
                className="flex items-center gap-3 p-3 hover:text-[#00b4d8] transition-colors hover:bg-[#232532] rounded-lg"
              >
                <FaBriefcase size={18} />
                <span>Experience</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;