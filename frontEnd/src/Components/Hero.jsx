import React from "react";
import assets from "../assets/assests";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)] ">
      
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* 🔹 LEFT CONTENT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          
          {/* Small Tag */}
          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--primary)] font-medium">
            🌍 Accessibility First Platform
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[var(--text-primary)]">
            Every Voice Matters.
            <br />
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
              Build Surveys for Everyone.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0">
            Create inclusive, WCAG-compliant surveys that empower every voice —
            regardless of ability.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            
            <RouterLink
              to="/Login"
              className="px-7 py-3 text-lg rounded-xl font-medium shadow-md transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "var(--text-on-primary)",
              }}
            >
              Get Started
            </RouterLink>
          </div>
        </div>

        {/* 🔹 RIGHT ILLUSTRATION */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
  
  {/* Background Blob */}
  <div className="absolute -z-10 w-[500px] h-[500px] bg-[var(--primary)] opacity-20 blur-[120px] rounded-full top-[-50px] right-[-50px]" />

  <img
    src={assets.img1}
    className="relative w-full max-w-[400px] rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] "
  />
</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;