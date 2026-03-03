import React from "react";
import assets from "../assets/assests";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "HR Manager",
      text: "Finally! A tool that lets our employees with visual impairments fill out feedback forms independently.",
    },
    {
      name: "Mark D.",
      role: "Researcher",
      text: "Our response rates went up by 20% because we can finally reach people who use screen readers.",
    },
    {
      name: "Elena R.",
      role: "Legal Consultant",
      text: "I don't have to worry about WCAG laws anymore. This builder handles the accessibility for me.",
    },
    {
      name: "Amina K.",
      role: "UX Designer",
      text: "Its the only survey tool Ive found that actually works perfectly with just a keyboard.",
    },
  ];

  return (
    <section className="body-font bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="container-fluid px-5 py-10 mx-auto">

        {/* Section Heading */}
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-[var(--text-primary)]">
            Trusted by Inclusive Teams.
          </h1> 
          <p className="text-md font-medium pt-3  text-[var(--text-primary)]">
             See how we help organizations reach 100% of their audience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="flex flex-wrap m-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 md:w-1/2 w-full">
              <div className="h-full bg-[var(--bg-secondary)] border border-[var(--border)] p-8 rounded-xl transition-all duration-300 hover:shadow-lg">

                {/* Quote Icon */}
                <img src={assets.quote} alt="quote" className="w-8 h-8 mb-4 invert-[.5]" loading="lazy"/>

                {/* Text */}
                <p className="leading-relaxed mb-6">
                  {testimonial.text}
                </p>

                {/* User Info */}
                <div className="inline-flex items-center">
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-[var(--text-secondary)]">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      {testimonial.role}
                    </span>
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
