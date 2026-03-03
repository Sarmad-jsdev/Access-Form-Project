import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 dark:bg-teal-600 transition-colors"
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          darkMode ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default DarkModeToggle;
