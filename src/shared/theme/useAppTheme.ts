import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "mdms-theme";

export function useAppTheme() {
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem(THEME_STORAGE_KEY) === "dark",
  );

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return {
    isDark,
    toggleTheme: () => setIsDark((current) => !current),
  };
}
