"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 text-gray-800 dark:text-gray-200 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">
        <i className="bi bi-moon-fill text-xl"></i>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 text-gray-800 dark:text-gray-200 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <i className="bi bi-sun-fill text-xl"></i>
      ) : (
        <i className="bi bi-moon-fill text-xl"></i>
      )}
    </button>
  );
}
