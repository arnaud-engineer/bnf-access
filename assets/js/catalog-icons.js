import {scheduleLogoBackgrounds} from "./logo-background.js";

const themedSvgCache = new Map();
function getIconBackgroundColor(resource) {
  const color = resource.icon_background_color;
  return typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color) ? color : "";
}

function isSvgIcon(url) {
  return typeof url === "string" && /\.svg(?:[?#].*)?$/i.test(url);
}

export function hydrateThemedSvgIcons(root = document) {
  root.querySelectorAll(".themed-svg-icon[data-icon-src][data-icon-color]").forEach((target) => {
    if (target.dataset.hydrated === "true") {
      return;
    }

    target.dataset.hydrated = "true";
    const appearance = target.closest('[data-icon-white="true"]');
    const removal = target.closest('[data-icon-remove-background="true"], [data-icon-remove-outer-background="true"]');
    if (target.closest('[data-icon-remove-outer-background="true"]')) {
      const image = new Image();
      image.alt = "";
      image.src = target.dataset.iconSrc;
      target.replaceChildren(image);
      scheduleLogoBackgrounds();
      return;
    }
    const iconColor = appearance?.dataset.iconColor;
    const renderedColor = removal ? target.dataset.iconColor : iconColor && /^#[0-9a-f]{6}$/i.test(iconColor)
      ? iconColor
      : appearance ? "#ffffff" : target.dataset.iconColor;
    loadThemedSvg(target.dataset.iconSrc, renderedColor)
      .then((svg) => {
        if (svg) {
          if (target.closest('[data-icon-remove-background="true"], [data-icon-remove-outer-background="true"]')) {
            const image = new Image();
            image.alt = "";
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
            target.replaceChildren(image);
            scheduleLogoBackgrounds();
          } else target.replaceChildren(svg);
        }
      })
      .catch(() => {
        // Le <img> de secours reste affiché si le SVG ne peut pas être préparé.
      });
  });
}

async function loadThemedSvg(src, color) {
  const cacheKey = `${src}|${color}`;
  const cached = themedSvgCache.get(cacheKey);
  if (cached) {
    return cached.cloneNode(true);
  }

  const response = await fetch(src);
  if (!response.ok) {
    return null;
  }

  const svg = buildThemedSvg(await response.text(), color);
  if (!svg) {
    return null;
  }

  themedSvgCache.set(cacheKey, svg);
  return svg.cloneNode(true);
}

export async function themedLogoImageSource(src, color) {
  if (!isSvgIcon(src) || typeof color !== "string" || !/^#[0-9a-f]{6}$/i.test(color)) return src;
  const svg = await loadThemedSvg(src, color);
  return svg
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`
    : src;
}

function buildThemedSvg(svgText, color) {
  const documentSvg = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = documentSvg.querySelector("svg");
  if (!svg || documentSvg.querySelector("parsererror")) {
    return null;
  }

  svg.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
  const sourceColor = findPrimarySvgColor(svg);
  if (!sourceColor) {
    return null;
  }

  replaceSvgColor(svg, sourceColor, color);
  svg.removeAttribute("id");
  svg.removeAttribute("x");
  svg.removeAttribute("y");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("themed-svg-icon__svg");
  return svg;
}

function findPrimarySvgColor(svg) {
  const colors = new Map();
  svg.querySelectorAll("*").forEach((node) => {
    for (const color of getNodeFillColors(node)) {
      const normalized = normalizeHexColor(color);
      if (normalized && normalized !== "#ffffff" && normalized !== "#000000") {
        colors.set(normalized, (colors.get(normalized) ?? 0) + 1);
      }
    }
  });

  return [...colors.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}

function getNodeFillColors(node) {
  const colors = [];
  const fill = node.getAttribute("fill");
  const style = node.getAttribute("style");

  if (fill) {
    colors.push(fill);
  }

  if (style) {
    const match = style.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/i);
    if (match) {
      colors.push(match[1]);
    }
  }

  return colors;
}

function replaceSvgColor(svg, sourceColor, targetColor) {
  svg.querySelectorAll("*").forEach((node) => {
    if (normalizeHexColor(node.getAttribute("fill")) === sourceColor) {
      node.setAttribute("fill", targetColor);
    }

    const style = node.getAttribute("style");
    if (!style) {
      return;
    }

    node.setAttribute(
      "style",
      style.replace(/((?:^|;)\s*fill\s*:\s*)(#[0-9a-f]{3,6})/gi, (match, prefix, color) => (
        normalizeHexColor(color) === sourceColor ? `${prefix}${targetColor}` : match
      )),
    );
  });
}

function normalizeHexColor(color) {
  if (typeof color !== "string") {
    return "";
  }

  const trimmed = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${[...trimmed.slice(1)].map((char) => char + char).join("")}`.toLowerCase();
  }

  return "";
}
