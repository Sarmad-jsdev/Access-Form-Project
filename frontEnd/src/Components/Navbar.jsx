import assets from "../assets/assests";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={assets.logo} className="h-10" />
            <span className="font-bold text-[var(--text-primary)]">
              AccessForm
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all
                  ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--text-on-primary)] shadow-sm"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                {item.name}
              </NavLink>
            ))}

            {/* AUTH BUTTONS */}
            <div className="flex items-center gap-2 ml-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm rounded-lg border border-[var(--primary)] text-[var(--primary)]"
              >
                Register
              </Link>
            </div>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <img
              src={isOpen ? assets.cross : assets.menu}
              className="h-5 w-5 invert-[.5]"
            />
          </button>
        </div>

        {/* MOBILE NAV */}
        {isOpen && (
          <div className="md:hidden mt-4 border-t border-[var(--border)] pt-4 space-y-2 pb-4">

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  block px-3 py-2 rounded-lg text-sm
                  ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--text-secondary)]"
                  }
                `}
              >
                {item.name}
              </NavLink>
            ))}

            <div className="flex flex-col gap-2 pt-3">
              <Link to="/login" className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-center">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-center">
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