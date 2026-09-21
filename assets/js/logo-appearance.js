import {scheduleLogoBackgrounds, restoreLogoBackground} from "./logo-background.js";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const ICON_URL = /^(?:https?:|\.\.\/|\.\/)/;

function ensureColorFilter(color) {
  if (typeof document === "undefined") return "";
  const id = `logo-color-${color.slice(1).toLowerCase()}`;
  if (document.getElementById(id)) return id;
  let definitions = document.getElementById("logo-color-filters");
  if (!definitions) {
    definitions = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    definitions.id = "logo-color-filters";
    definitions.setAttribute("aria-hidden", "true");
    definitions.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    definitions.append(document.createElementNS("http://www.w3.org/2000/svg", "defs"));
    document.documentElement.append(definitions);
  }
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.id = id;
  filter.setAttribute("color-interpolation-filters", "sRGB");
  const matrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
  const channels = [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16) / 255);
  matrix.setAttribute("type", "matrix");
  matrix.setAttribute("values", `0 0 0 0 ${channels[0]} 0 0 0 0 ${channels[1]} 0 0 0 0 ${channels[2]} 0 0 0 1 0`);
  filter.append(matrix);
  definitions.firstElementChild.append(filter);
  return id;
}

export function defaultLogoBackground(resource) {
  const explicitBackground = HEX_COLOR.test(resource.icon_background || "") ? resource.icon_background : "";
  const isPressTitle = Array.isArray(resource.entry_types) && resource.entry_types.includes("press_title");
  return explicitBackground || (isPressTitle ? "#ffffff" : "");
}

function appearance(resource) {
  const background = defaultLogoBackground(resource);
  const backgroundImage = ICON_URL.test(resource.icon_background_image || "") ? resource.icon_background_image : "";
  const customColor = resource.icon_white === true && HEX_COLOR.test(resource.icon_color || "")
    ? resource.icon_color.toLowerCase()
    : "";
  return { background, backgroundImage, customColor };
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function cssUrl(value) {
  return encodeURI(value).replaceAll('"', "%22").replaceAll("'", "%27").replaceAll("\\", "%5C");
}

export function logoAppearanceAttributes(resource) {
  const { background, backgroundImage, customColor } = appearance(resource);
  if (resource.icon_remove_background === true || resource.icon_remove_outer_background === true) scheduleLogoBackgrounds();
  const align = ["center", "top", "bottom", "left", "right"].includes(resource.icon_align) ? resource.icon_align : "center";
  const alignAttribute = align === "center" ? "" : ` data-icon-align="${align}"`;
  const styles = [];
  if (background) styles.push(`background-color:${background}`);
  if (backgroundImage) styles.push(`background-image:url(&quot;${escapeAttribute(cssUrl(backgroundImage))}&quot;);background-size:cover;background-position:center;background-repeat:no-repeat`);
  if (customColor) styles.push(`--icon-color-filter:url(#${ensureColorFilter(customColor)})`);
  return `${styles.length ? ` style="${styles.join(";")}"` : ""}${resource.icon_white === true ? ' data-icon-white="true"' : ""}${customColor ? ` data-icon-color="${customColor}"` : ""}${backgroundImage ? ' data-icon-background-image="true"' : ""}${resource.icon_remove_background === true ? ' data-icon-remove-background="true"' : ""}${resource.icon_remove_outer_background === true ? ' data-icon-remove-outer-background="true"' : ""}${alignAttribute}`;
}

export function applyLogoAppearance(element, resource) {
  const { background, backgroundImage, customColor } = appearance(resource);
  element.style.backgroundColor = background;
  element.style.backgroundImage = backgroundImage ? `url("${backgroundImage.replaceAll('"', '\\"')}")` : "";
  element.style.backgroundSize = backgroundImage ? "cover" : "";
  element.style.backgroundPosition = backgroundImage ? "center" : "";
  element.style.backgroundRepeat = backgroundImage ? "no-repeat" : "";
  element.classList.toggle("has-icon-background-image", Boolean(backgroundImage));
  if (resource.icon_white === true) element.dataset.iconWhite = "true";
  else delete element.dataset.iconWhite;
  if (customColor) {
    element.dataset.iconColor = customColor;
    element.style.setProperty("--icon-color-filter", `url(#${ensureColorFilter(customColor)})`);
  } else {
    delete element.dataset.iconColor;
    element.style.removeProperty("--icon-color-filter");
  }
  const align = ["center", "top", "bottom", "left", "right"].includes(resource.icon_align) ? resource.icon_align : "center";
  if (align === "center") delete element.dataset.iconAlign;
  else element.dataset.iconAlign = align;
  const previousRemovalMode = element.dataset.iconRemoveOuterBackground === "true" ? "outer"
    : element.dataset.iconRemoveBackground === "true" ? "all" : "";
  const removalMode = resource.icon_remove_outer_background === true ? "outer"
    : resource.icon_remove_background === true ? "all" : "";
  if (previousRemovalMode && previousRemovalMode !== removalMode) restoreLogoBackground(element);
  if (removalMode) {
    if (resource.icon_remove_background === true) element.dataset.iconRemoveBackground = "true";
    else delete element.dataset.iconRemoveBackground;
    if (resource.icon_remove_outer_background === true) element.dataset.iconRemoveOuterBackground = "true";
    else delete element.dataset.iconRemoveOuterBackground;
    scheduleLogoBackgrounds();
  } else {
    delete element.dataset.iconRemoveBackground;
    delete element.dataset.iconRemoveOuterBackground;
    restoreLogoBackground(element);
  }
}
