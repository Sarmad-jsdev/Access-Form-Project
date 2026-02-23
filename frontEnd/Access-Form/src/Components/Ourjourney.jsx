import { Headphones, ShieldCheck } from "lucide-react";

export default function JourneyAndTesting() {
  return (
    <section className="py-24 px-6 lg:px-16 bg-[var(--bg-primary)] text-[var(--text-secondary)] relative transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">

      {/* Soft Accent Glow */}
      <div className="absolute inset-0 bg-[var(--accent)] opacity-5 blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* Left Side — Our Journey */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
            Our Journey
          </h2>

          <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
            AccessForm started as a university project with the goal of improving web accessibility. During our research, we studied the challenges faced by users with visual and motor impairments through articles, case studies, and accessibility guidelines. 
            <span className="text-[var(--primary)] font-semibold">
              {" "}One important thing we understood was that users do not want special treatment.
            </span>{" "}
            They simply want equal and independent access to digital platforms. This idea became the foundation of our project.
          </p>
        </div>

        {/* Right Side — Testing Card */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] 
          rounded-2xl p-8 shadow-[var(--card-shadow)]">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center 
              rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
              How We Ensure Quality
            </h3>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            Instead of relying only on automated accessibility tools, we also tested our forms using screen readers such as
            <span className="font-semibold text-[var(--text-primary)]"> (NVDA) </span>
            and followed 
            <span className="font-semibold text-[var(--text-primary)]"> (WCAG 2.1) </span>
            guidelines to improve usability. While this is a student project, we aimed to apply real-world accessibility standards as accurately as possible.
          </p>

          {/* Trust Points */}
          <div className="mt-6 space-y-3 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[var(--primary)]" />
              Real screen reader testing
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
              WCAG 2.1 compliant structure
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
