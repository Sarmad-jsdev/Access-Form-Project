import React from "react";
import assets from "../assets/assests";
import { Link as RouterLink } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-[var(--bg-primary)]  text-[var(--text-secondary)] flex items-center px-4 sm:px-8 lg:px-16 py-12 transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-[1.2] mb-6">
            We Believe Every <br className="hidden sm:block" />
            <span className="text-[var(--primary)]">Voice</span>{" "}
            <br className="hidden sm:block" />
            Deserves to be Heard.
          </h1>

          <p className="text-[var(--text-secondary)] text-base sm:text-lg lg:text-xl max-w-lg mb-10 leading-relaxed">
           Digital barriers shouldn't stop anyone from sharing their feedback. We started AccessForm to bridge the gap between technology and inclusivity.
          </p>

          {/* Button */}

            <button
              className="bg-[var(--primary)] text-[var(--text-on-primary)] px-8 py-4 rounded-md 
              font-semibold hover:bg-[var(--primary-dark)] 
              transition-all shadow-md active:scale-95 
              text-sm sm:text-base 
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              <RouterLink to="/Login" className="flex items-center gap-2">
              Start Building Accessible Surveys
              </RouterLink>
            </button>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-full">

            <img
              src={assets.img3}
              alt="Creative Team Performance"
              className=" object-contain drop-shadow-xl rounded-lg"
              loading="lazy"
            />

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
