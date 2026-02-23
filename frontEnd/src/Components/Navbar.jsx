import { useState } from "react";
import assets from "../assets/assests";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems =[{name: "Home", path: "/"}, {name: "About Us", path: "/about"}, {name: "Contact Us", path: "/contact"}, {name:"Settings", path: '/settings'}];

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center margin-right-3 cursor-pointer">
            <Link
              to="/"
              className="flex items-center text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
            >
              <img
                src={assets.logo}
                alt="Access Form Logo"
                className="h-10 w-auto"
                loading="lazy"
              />
              <span className="ml-2 text-lg sm:text-md font-bold text-[var(--text-primary)]">
                Access Form
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-2 text-base font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[var(--text-primary)] hover:text-[var(--primary)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                rounded px-1 py-1 transition"
              >
                {item.name}

              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-4">

              {/* Login */}
              <Link                 to="/Login"
                className="rounded-lg bg-[var(--primary)] px-5 py-2.5 
                text-sm font-semibold  
                text-[var(--text-on-primary)]
                hover:bg-[var(--primary-dark)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                transition"
              >
                Login
              </Link>

              {/* Register - Soft Variant */}
              <Link
                to="/Register"
                className="rounded-lg border border-[var(--primary)] 
                bg-[transparent] 
                text-[var(--primary)] 
                px-5 py-2.5 text-sm font-semibold 
                hover:bg-[var(--primary)] hover:text-white 
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                transition"
              >
                Register
              </Link>

            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-md bg-[var(--bg-secondary)] 
              border border-[var(--border-color)] p-2 
              text-[var(--text-primary)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition"
            >
              
                {isOpen ? (
                  <img src={assets.cross} alt="Close menu" className="h-5 w-5 invert-[.5]" loading="lazy" />
                ) : (
                  <img src={assets.menu} alt="Open menu" className="h-5 w-5  invert-[.5]" loading="lazy"/>
                )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 
          border-t border-[var(--border-color)] pt-4">

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}    // Close menu on link click
                className="block text-[var(--text-primary)] 
                hover:text-[var(--primary)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] 
                rounded px-2 py-1"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-4">

              <Link                 to="/Login"
                onClick={() => setIsOpen(false)}    // Close menu on link click
                className="rounded-lg bg-[var(--primary)] 
                text-[var(--text-on-primary)]
                px-5 py-2.5 text-sm font-semibold  text-center
                hover:bg-[var(--primary-dark)]
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              >
                Login
              </Link>

              <Link
                to="/Register"
                onClick={() => setIsOpen(false)}    // Close menu on link click
                className="rounded-lg border border-[var(--primary)] 
                bg-[color:rgba(20,184,166,0.1)] 
                text-[var(--primary)] 
                px-5 py-2.5 text-sm font-semibold text-center
                hover:bg-[var(--primary)] hover:text-white
                focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              >
                Register
              </Link>

            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
