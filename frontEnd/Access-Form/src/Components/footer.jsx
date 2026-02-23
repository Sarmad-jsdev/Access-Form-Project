import { Link } from "react-router-dom";
import assets from "../assets/assests";

const Footer = () => {
  const footerData = [
    {
      title: "RESOURCES",
      links: [
        { name: "Accessibility Guide", path: "/accessibility" },
        { name: "Help Center", path: "/help" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Settings", path: "/settings" },
      ],
    },
  ];

  return (
    <footer className="bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row md:items-start gap-12 ">

        {/* Logo Section */}
        <div className="md:w-1/3">
          <Link
            to="/"
            className="flex items-center gap-3 text-[var(--text-primary)]"
          >
            {/* Logo Image and Text */}
              <img
                src={assets.logo}
                alt="AccessForm Logo"
                className="w-10 h-10 object-contain"
                loading="lazy"
              />  
            <span className="text-xl font-bold tracking-tight">
              AccessForm
            </span>
          </Link>

          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Building a web that works for everyone. Create accessible surveys in minutes.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-1 flex-wrap gap-12">
          {footerData.map((category, index) => (
            <div key={index}>
              <h2 className="text-sm font-bold tracking-wider text-[var(--text-primary)] mb-4">
                {category.title}
              </h2>

              <ul className="space-y-3">
                {category.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm">
          <p>
            © 2026 AccessForm — Built for everyone — @SarmadQadeer
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
