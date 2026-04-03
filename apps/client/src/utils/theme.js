const THEME_KEY = 'de_theme';

export function getStoredTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }

  document.body.classList.toggle('theme-dark', theme === 'dark');
  window.localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(theme) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  return nextTheme;
}
