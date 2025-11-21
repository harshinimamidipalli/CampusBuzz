import React, { createContext, useState, useContext, useMemo } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            background: "#121212",
            text: "#ffffff",
            accent: "tomato",
            inputBackground: "#1E1E1E",
            placeholder: "#aaa",
          }
        : {
            background: "#ffffff",
            text: "#000000",
            accent: "tomato",
            inputBackground: "#f9f9f9",
            placeholder: "#666",
          },
    [theme]
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = { theme, isDarkMode: theme === "dark", colors, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ✅ Custom hook (import this in all screens)
export const useTheme = () => useContext(ThemeContext);
