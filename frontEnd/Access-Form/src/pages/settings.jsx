import React, { useState, useEffect } from 'react';
import { Sun, Moon, Type, Eye, EyeOff } from 'lucide-react';

const Settings = () => {

  // ✅ Initialize from localStorage ONCE
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved).fontSize || 14 : 14;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved).theme || 'light' : 'light';
  });

  // ✅ Apply theme + font + save
  useEffect(() => {
    const root = document.documentElement;

    // Apply font size
    root.style.fontSize = `${fontSize}px`;

    // Apply theme
    root.classList.remove('dark', 'high-contrast');

    if (theme === 'dark') {
      root.classList.add('dark');
    }

    if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    }

    // Save settings
    localStorage.setItem(
      'app-settings',
      JSON.stringify({ fontSize, theme })
    );

  }, [fontSize, theme]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--card-shadow)] p-8 border border-[var(--border)]">

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8 border-b border-[var(--border)] pb-4">
          Accessibility Settings
        </h1>

        {/* 1. Appearance / Theme */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Sun size={20} /> Visual Theme
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
              ${
                theme === 'light'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              Light Mode
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border-2 transition-all
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
              ${
                theme === 'dark'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              Dark Mode
            </button>

            <button
              onClick={() => setTheme('high-contrast')}
              className={`p-4 rounded-xl border-2 font-semibold transition-all
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]
              ${
                theme === 'high-contrast'
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              High Contrast
            </button>

          </div>
        </section>

        {/* 2. Font Size Adjustment */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
            <Type size={20} /> Text Size
          </h2>

          <div className="flex items-center gap-6 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border)]">

            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] 
              border border-[var(--border)]
              shadow 
              flex items-center justify-center text-xl font-bold 
              text-[var(--text-primary)]
              hover:bg-[var(--primary)]/10
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              aria-label="Decrease font size"
            >
              -
            </button>

            <span className="text-lg font-medium text-[var(--text-primary)]">
              Current Size: {fontSize}px
            </span>

            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] 
              border border-[var(--border)]
              shadow 
              flex items-center justify-center text-xl font-bold 
              text-[var(--text-primary)]
              hover:bg-[var(--primary)]/10
              focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              aria-label="Increase font size"
            >
              +
            </button>

          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-2 italic">
            *This will adjust the text size across the entire platform.
          </p>
        </section>

        {/* 3. Dyslexia Friendly Option */}
        <section>
          <div className="flex items-center justify-between p-4 
            bg-[var(--bg-primary)] 
            border border-[var(--border)] 
            rounded-xl">

            <div>
              <h3 className="font-bold text-[var(--text-primary)]">
                Dyslexia Friendly Font
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Use a specialized font for easier reading.
              </p>
            </div>

            <input
              type="checkbox"
              className="w-6 h-6 accent-[var(--primary)]"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;