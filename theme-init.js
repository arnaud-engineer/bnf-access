(() => {
  const themeStorageKey = "bnf-access:theme:v1";

  try {
    const theme = localStorage.getItem(themeStorageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || theme === "oled") {
      document.documentElement.dataset.theme = theme;
    } else if (theme !== "light" && prefersDark) {
      document.documentElement.dataset.theme = "oled";
    }
  } catch {}
})();
