import React from 'react'

const Stats = () => {
  return (
    <div>
    {/* Big Stat + Card Section */}
      <section className="bg-[var(--bg-primary)] text-[var(--text-secondary)] py-20 px-6 lg:px-16 border-b border-[var(--border-color)] shadow-sm ">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Big Stat side*/}
          <div className="text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-[var(--primary)]">
              1 in 6
            </h2>
            <p className="mt-4 text-xl text-[var(--text-primary)] font-semibold">
              People globally live with a disability
            </p>
          </div>

          {/* Right Card side*/}
          <div
            className="bg-[var(--bg-secondary)] p-8 rounded-2xl 
                        border border-[var(--border)] 
                        shadow-[var(--card-shadow)] hover:-translate-y-2 
                        hover:shadow-xl 
                        transition-all duration-300"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              The Hidden Gap in Today's Web
            </h3>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              Most survey tools are built without accessibility in mind—making
              it impossible for screen reader users or keyboard-only users to
              participate. We saw this problem and decided to fix it.
            </p>
          </div>
        </div>
      </section>
      </div>
  )
}

export default Stats