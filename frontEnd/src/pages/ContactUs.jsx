import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent. (Student Project Demo)");
  };

  return (
    <section className="bg-[var(--bg-primary)] min-h-screen py-16 px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
            Get In Touch
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Have questions about our Accessible Survey Builder? We're here to help you build inclusive digital experiences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 
          bg-[var(--bg-secondary)] 
          rounded-3xl shadow-[var(--card-shadow)] 
          overflow-hidden border border-[var(--border)]">

          {/* Left Side */}
          <div className="lg:w-1/3 
            bg-[var(--primary)] 
            text-[var(--text-on-primary)] p-10 flex flex-col justify-between">

            <div>
              <h2 className="text-2xl font-bold mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <Mail className="text-[var(--text-on-primary)]" />
                  <p>support@accessform.edu</p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Side */}
          <div className="lg:w-2/3 p-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-semibold text-[var(--text-primary)]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Enter your name"
                  className="p-3 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline-none transition"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-[var(--text-primary)]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@gmail.com"
                  className="p-3 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline-none transition"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="subject" className="font-semibold text-[var(--text-primary)]">
                  Subject
                </label>
                <select
                  id="subject"
                  className="p-3 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline-none transition"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Accessibility Feedback</option>
                  <option>Bug Report</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="message" className="font-semibold text-[var(--text-primary)]">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  rows="4"
                  required
                  placeholder="Write your message here..."
                  className="p-3 rounded-lg 
                  border border-[var(--border)] 
                  bg-[var(--bg-primary)] 
                  text-[var(--text-primary)]
                  focus:ring-2 focus:ring-[var(--focus-ring)] 
                  outline-none transition"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full md:w-auto 
                  bg-[var(--primary)] 
                  hover:bg-[var(--primary-dark)] 
                  text-[var(--text-on-primary)] px-10 py-4 rounded-lg font-bold 
                  transition-all shadow-lg active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;