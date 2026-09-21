try {
  const previewTheme = new URLSearchParams(window.location.search).get("theme");
  const theme = ["light", "dark", "oled"].includes(previewTheme)
    ? previewTheme
    : localStorage.getItem("bnf-access:v2:theme:v1");

  if (theme === "dark" || theme === "oled") {
    document.documentElement.dataset.theme = theme;
  } else if (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.dataset.theme = "oled";
  }

  if (localStorage.getItem("bnf-access:v2:colorblind-mode:v1") === "true") {
    document.documentElement.dataset.colorVision = "colorblind";
  }

  const resolvedTheme = document.documentElement.dataset.theme;
  document.querySelector("#themeColor")?.setAttribute(
    "content",
    resolvedTheme === "oled" ? "#000000" : resolvedTheme === "dark" ? "#141619" : "#f7f7f4",
  );
} catch {
  // The default light theme remains usable when storage is unavailable.
}
