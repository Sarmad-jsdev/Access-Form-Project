import React, { useState, useEffect } from 'react';
import { Sun, Moon, Type } from 'lucide-react';

const Settings = () => {

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved).fontSize || 14 : 14;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved).theme || 'light' : 'light';
  });

  // Apply theme & font-size globally
  useEffect(() => {
    const root = document.documentElement;

    // Font
    root.style.fontSize = `${fontSize}px`;

    // Remove old theme classes
    root.classList.remove('dark', 'high-contrast', 'dyslexia');

    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'high-contrast') root.classList.add('high-contrast');
    if (theme === 'dyslexia') root.classList.add('dyslexia');

    // Save
    localStorage.setItem('app-settings', JSON.stringify({ fontSize, theme }));

    // Trigger a global event so charts can re-render
    const event = new Event('themeChange');
    window.dispatchEvent(event);

  }, [fontSize, theme]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--card-shadow)] p-8 border border-[var(--border)]">

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8 border-b border-[var(--border)] pb-4">
          Accessibility Settings
        </h1>

        {/* Theme Buttons */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Sun size={20} /> Visual Theme
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'light', label: 'Light Mode' },
              { id: 'dark', label: 'Dark Mode' },
              { id: 'high-contrast', label: 'High Contrast' },
              { id: 'dyslexia', label: 'Dyslexia-Friendly' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
                  ${theme === t.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Font Size */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Type size={20} /> Text Size
          </h2>

          <div className="flex items-center gap-6 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border)]">
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] shadow flex items-center justify-center text-xl font-bold text-[var(--text-primary)] hover:bg-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">-</button>

            <span className="text-lg font-medium text-[var(--text-primary)]">
              Current Size: {fontSize}px
            </span>

            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] shadow flex items-center justify-center text-xl font-bold text-[var(--text-primary)] hover:bg-[var(--primary)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">+</button>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-2 italic">
            *Adjust text size across the platform.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Settings;