import { Heart, Sparkles, ShieldCheck } from "lucide-react";

export default function CoreValues() {
  const values = [
    {
      title: "Empathy First",
      description:
        "We don’t just write code — we focus on understanding and improving the user’s experience.",
      icon: <Heart className="w-6 h-6" />,
    },
    {
      title: "Simple for Everyone",
      description:
        "Accessibility should not be complicated. We make it as easy as drag-and-drop.",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "High Standards",
      description:
        "We follow WCAG 2.1 guidelines to ensure your product meets both legal and ethical standards.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-16 bg-[var(--bg-primary)]  text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Our Core Values
        </h2>
        <p className="mt-4 text-[var(--text-secondary)] max-w-2xl mx-auto">
          Accessibility sirf feature nahi — hamara mission hai.
        </p>

        {/* Cards */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl 
              bg-[var(--bg-secondary)] 
              border border-[var(--border)] 
              shadow-[var(--card-shadow)]
              hover:-translate-y-2 
              hover:shadow-xl 
              transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center 
                rounded-full mb-6 mx-auto 
                bg-[var(--primary)]/10 
                text-[var(--primary)]"
              >
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
