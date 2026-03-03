import assets from "../assets/assests";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "admin":
        return "/Admindashboard";
      case "creator":
        return "/creator-dashboard";
      case "respondent":
        return "/Respondent";
      default:
        return "/";
    }
  };

  const publicNav = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Settings", path: "/settings" },
  ];

  const userNav = [
    { name: "Dashboard", path: getDashboardPath() },
    { name: "Contact Us", path: "/contact" },
    { name: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Link
              to="/"
              className="flex items-center text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
            >
              <img src={assets.logo} alt="AccessForm Logo" className="h-10 w-auto" />
              <span className="ml-2 text-lg font-bold">Access Form</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav
            className="hidden md:flex items-center gap-4"
            role="navigation"
            aria-label="Main navigation"
          >
            {(user ? userNav : publicNav).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[var(--text-primary)] hover:text-[var(--primary)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[var(--text-primary)] font-medium">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-[var(--primary)] text-[var(--text-on-primary)] px-5 py-2.5 text-sm font-semibold  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
            aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isOpen}
          >
            <img
              src={isOpen ? assets.cross : assets.menu}
              alt={isOpen ? "Close menu icon" : "Open menu icon"}
              className="h-5 w-5 invert-[.5]"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav
            className="md:hidden mt-4 space-y-4 pb-4 border-t border-[var(--border-color)] pt-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {(user ? userNav : publicNav).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-primary)] hover:text-[var(--primary)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;