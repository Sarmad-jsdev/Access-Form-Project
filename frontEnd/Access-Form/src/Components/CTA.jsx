import React from "react";
import { Link as RouterLink } from "react-router-dom";  


const FinalCTA = () => {
  return (
    <section className="relative py-28 px-6 lg:px-16 bg-[var(--bg-primary)] text-[var(--text-secondary)] text-center overflow-hidden transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[var(--primary)] opacity-10 blur-[120px] -z-10"></div>

      <div className="max-w-3xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
          Join Our Mission for a{" "}
          <span className="text-[var(--primary)]">
            More Inclusive Web.
          </span>
        </h2>

        {/* Supporting Line (optional but recommended) */}
        <p className="mt-6 text-[var(--text-secondary)] text-lg">
          Accessibility isn’t optional — it’s essential. Start building forms
          that truly work for everyone.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <button
            className="px-10 py-4 rounded-xl font-semibold 
            bg-[var(--primary)]
            hover:bg-[var(--primary-dark)]
            text-[var(--text-on-primary)]
            active:scale-95
            transition-all duration-300
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            <RouterLink to="/Login" className="flex items-center gap-2">
            Build Your First Accessible Survey
            </RouterLink>
          </button>
        </div>

      </div>
    </section>
  );
}

export default FinalCTA;