import { useState } from "react";
import assets from "../assets/assests";

const faqs = [
  {
    question: "Do I need to be an expert to use this?",
    answer:
      "No! We handles the complex accessibility rules for you automatically.",
  },
  {
    question: "Is it really WCAG compliant?",
    answer:
      "Yes, our platform is fully WCAG 2.1 compliant and meets all accessibility standards.",
  },
  {
    question: "Will it work with Screen Readers?",
    answer:
      "Yes, our platform is fully compatible with all major screen readers.",
  },
  {
    question: "Can users navigate using only a keyboard?",
    answer: "Yes, our platform is fully keyboard accessible and supports all standard keyboard navigation patterns.",
  },
  {
    question: "How do I export my results?",
    answer:
      "	You can download your data into clear, accessible reports like Excel, CSV, or PDF.",
  },
];

const FAQ = () =>  {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="body-font bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300 border-b border-[var(--border-color)] shadow-sm">
      <div className="container-fluid max-w-4xl px-6 py-16 mx-auto">

        {/* Section Heading */}
        <div className="flex flex-col text-center w-full mb-10">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-[var(--text-primary)]">
            Frequently Asked Questions
          </h1> 
          <p className="text-md font-medium pt-3  text-[var(--text-primary)]">
             Everything you need to know about building accessible surveys.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-sm transition-all duration-300 text-[var(--text-secondary)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-2xl"
                >
                  <span className="font-semibold text-[var(--text-secondary)]">
                    {faq.question}
                  </span>

                  {/* ICON */}
                
                    {isOpen ? (
                      <img src={assets.minus} alt="Minus icon" className="w-4 h-4 invert-[.5]" loading="lazy" />
                    ) : (
                      <img src={assets.plus} alt="Plus icon" className="w-4 h-4 invert-[.5]" loading="lazy" />
                    )}
                </button>

                {/* ANSWER */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 p-6 pt-0"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden text-[var(--text-secondary)] text-md leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


export default FAQ;