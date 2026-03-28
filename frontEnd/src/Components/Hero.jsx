import React from "react";
import assets from "../assets/assests";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="body-font bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm"
      aria-labelledby="hero-heading"
    >
      <div className="container-fluid mx-auto flex px-12 py-10 md:flex-row flex-col items-center">
        {/* Left Text Content */}
        <div className="lg:flex-grow md:w-1/2 lg:pr-18 md:pr-10 flex flex-col md:items-start md:text-left mb-4 sm:mb-0 items-center text-center">
          <h1
            id="hero-heading"
            className="title-font sm:text-4xl text-3xl mb-4 font-medium text-[var(--text-primary)]"
          >
            Every Voice Matters. Build Surveys for Everyone.
          </h1>
          <p className="mb-8 leading-relaxed text-[var(--text-secondary)]">
            Create WCAG-compliant surveys that empower people of all abilities to share their insights independently.
          </p>

          {/* CTA Button */}
          <RouterLink
            to="/Login"
            className="inline-flex text-[var(--text-on-primary)] bg-[var(--primary)] border-0 py-2 px-6 rounded text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] hover:bg-[var(--primary-dark)] transition-colors duration-200"
            role="button"
            aria-label="Start building accessible surveys for free"
          >
            Start Building for Free
          </RouterLink>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-full">
            <img
              src={assets.img1}
              alt="Illustration showing a diverse team collaborating and analyzing survey results"
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;