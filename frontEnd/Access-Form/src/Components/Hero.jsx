import React from "react";
import assets from "../assets/assests";
import { Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="body-font bg-[var(--bg-primary)]  text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm"
    >
    <div className="container-fluid mx-auto flex px-12 py-10 md:flex-row flex-col items-center">
        {/* Left Text Content */}
        <div className="lg:flex-grow md:w-1/2 lg:pr-18 md:pr-10 flex flex-col md:items-start md:text-left mb-4 sm:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-[var(--text-primary)] dark:text-[var(--text-primary)]">
            Every Voice Matters. Build Surveys for Everyone.
          </h1>
          <p className="mb-8 leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
            Create WCAG-compliant surveys that empower people of all abilities to share their insights independently.
          </p>

            <button className="inline-flex text-[var(--text-on-primary)] bg-[var(--primary)] border-0 py-2 px-6 focus:outline-none hover:bg-[var(--primary-dark)]  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                transition rounded text-lg transition-colors duration-200">
                  <RouterLink to="/Login">
             Start Building for Free
            </RouterLink>
              </button>
          </div>

        {/* Right Image */}
        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-full">

            <img
              src={assets.img1}
              alt="Creative Team Performance"
              className=" object-contain rounded-lg"
              loading="lazy"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
