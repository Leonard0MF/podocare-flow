export type Theme = "light" | "dark" | "system";

const THEME_KEY = "podocare-theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(THEME_KEY);

  if (
    stored === "light" ||
    stored === "dark" ||
    stored === "system"
  ) {
    return stored;
  }

  return "system";
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "light") {
    root.classList.add("light");
    return;
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  root.classList.add(
    prefersDark ? "dark" : "light",
  );
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function initializeTheme() {
  const theme = getStoredTheme();

  applyTheme(theme);

  return theme;
}