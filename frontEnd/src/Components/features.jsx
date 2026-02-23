import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Keyboard-Only Navigation",
      description:
        "Fully operable without a mouse. Our logical tab-order and focus management ensure a seamless experience for users with motor impairments.",
    },
    {
      title: "Screen Reader Optimized",
      description:
        "Deep ARIA integration and semantic HTML structures allow tools like NVDA, JAWS, and VoiceOver to announce every question and error clearly.",
    },
    {
      title: "Full WCAG 2.1 Compliance",
      description:
        "Create surveys that natively meet Level AA standards. We handle the technical complexity so you can focus on the right questions.",

    },
    {
      title: "Dyslexia-Friendly Typography",
      description:
        "Specialized font options and layout spacing designed to improve readability and reduce visual stress for neurodivergent respondents.",

    },
    {
      title: "High-Contrast Themes",
      description:
        "Carefully curated color palettes that exceed standard contrast ratios, making surveys accessible for users with low vision or color blindness.",

    },
    {
      title: "Cognitive Simplicity",
      description:
        "Built-in tools to help you write simpler, clearer questions that are easier to process for users with cognitive disabilities.",

    },
  ];

  return (
    <section className="body-font bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="container-fluid px-5 py-10 mx-auto ">
        
        {/* Heading */}
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-[var(--text-primary)]">
            Surveys That Everyone Can Fill.
          </h1>
          <p className="text-md font-medium pt-3  text-[var(--text-primary)]">
            Build forms that work for people of all abilities. We make accessibility simple so you don't have to be an expert.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap m-4">
          {features.map((feature, index) => (
            <div key={index} className="p-4 md:w-1/3">
              <div className="flex rounded-xl h-full bg-[var(--bg-secondary)] border border-[var(--border)] p-8 flex-col transition-all duration-300 hover:shadow-lg">
                
                {/* Icon + Title */}
                <div className="flex items-center mb-3">
                  <h2 className="text-[var(--text-secondary)] text-lg font-medium">
                    {feature.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="flex-grow">
                  <p className="leading-relaxed text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
