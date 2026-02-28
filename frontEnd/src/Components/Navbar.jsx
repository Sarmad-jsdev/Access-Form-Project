import assets from "../assets/assests";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // Added missing state
  const navigate = useNavigate();

  // Define navItems 
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Link to="/" className="flex items-center text-[var(--text-primary)]">
              <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
              <span className="ml-2 text-lg font-bold">Access Form</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className="text-[var(--text-primary)] hover:text-[var(--primary)] px-1 py-1">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[var(--text-primary)] font-medium">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-primary)]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-4">
                <Link to="/Login" className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-on-primary)]">
                  Login
                </Link>
                <Link to="/Register" className="rounded-lg border border-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary)]">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
              <img src={isOpen ? assets.cross : assets.menu} alt="menu" className="h-5 w-5 invert-[.5]" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 border-t border-[var(--border-color)] pt-4">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="block px-2 py-1">
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
               {/* Mobile Auth Links */}
               {user ? (
                 <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
               ) : (
                 <>
                  <Link to="/Login" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/Register" onClick={() => setIsOpen(false)}>Register</Link>
                 </>
               )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
