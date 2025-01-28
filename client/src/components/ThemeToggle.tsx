import React from "react";
import { useTheme } from "../context/ThemeContext";

import { MoonIcon } from "@heroicons/react/24/outline";

import { SunIcon } from "@heroicons/react/20/solid";
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      // className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded"
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5 text-zinc-500" />
      ) : (
        <SunIcon className="h-6 w-6 text-zinc-400" />
      )}
    </div>
  );
};

export default ThemeToggle;
