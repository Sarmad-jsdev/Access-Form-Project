import React, { useState, useEffect } from "react";
import { Sun, Type } from "lucide-react";
import DashboardLayout from "../Components/DashboardLayout";

const Settings = () => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("app-settings");
    return saved ? JSON.parse(saved).fontSize || 14 : 14;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("app-settings");
    return saved ? JSON.parse(saved).theme || "light" : "light";
  });

  // APPLY SETTINGS
  useEffect(() => {
    const root = document.documentElement;

    root.style.fontSize = `${fontSize}px`;

    root.classList.remove("dark", "high-contrast", "dyslexia");

    if (theme === "dark") root.classList.add("dark");
    if (theme === "high-contrast") root.classList.add("high-contrast");
    if (theme === "dyslexia") root.classList.add("dyslexia");

    localStorage.setItem(
      "app-settings",
      JSON.stringify({ fontSize, theme })
    );

    window.dispatchEvent(new Event("themeChange"));
  }, [fontSize, theme]);

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Accessibility Settings
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Customize your experience (theme & text size)
          </p>
        </div>

        {/* THEME */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Sun size={16} /> Theme
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
              { id: "high-contrast", label: "Contrast" },
              { id: "dyslexia", label: "Readable" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl text-sm border transition
                  ${
                    theme === t.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* FONT SIZE */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Type size={16} /> Text Size
          </h2>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            >
              -
            </button>

            <span className="text-sm text-[var(--text-primary)]">
              {fontSize}px
            </span>

            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            >
              +
            </button>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-3">
            Adjust text size across dashboard
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;