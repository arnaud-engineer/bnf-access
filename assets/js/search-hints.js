export function createSearchHints(input, mirrors = []) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 640px)");
  const layer = document.createElement("div");
  layer.className = "search-hints";
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  input.after(layer);
  const searchExamples = [
    ["Rechercher une ressource · Universalis, ScholarVox…", "Rechercher une ressource · Universalis"],
    ["Rechercher un titre de presse · Le Monde, Le Figaro…", "Rechercher un journal · Le Monde"],
    ["Rechercher un livre · titre ou auteur", "Rechercher un livre · titre ou auteur"],
    ["Rechercher un livre · ISBN : 9782200628789", "Rechercher un ISBN · 9782200628789"],
  ];
  const linkExample = ["Débrider un lien · coller l’URL d’un article", "Débrider un lien · coller une URL"];
  const betaPlaceholder = input.placeholder;
  const betaLabel = input.getAttribute("aria-label");
  let alpha = false;
  let examples = searchExamples;
  let totalSteps = examples.length * 2;
  let started = false;
  let stopped = false;
  let timer = null;
  let hovered = false;
  let remaining = 2700;
  let deadline = 0;
  let animations = [];
  let index = 0;
  let revision = 0;

  function stop() {
    stopped = true;
    revision += 1;
    clearTimeout(timer);
    animations.forEach(animation => animation.cancel());
    animations = [];
    layer.hidden = true;
    layer.replaceChildren();
    input.classList.remove("has-search-hints");
  }

  function line(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  }

  function currentText() {
    return index < totalSteps ? examples[index % examples.length][compact.matches ? 1 : 0] : input.placeholder;
  }

  function schedule(delay = 2700) {
    clearTimeout(timer);
    timer = null;
    remaining = delay;
    if (hovered) return;
    deadline = performance.now() + delay;
    timer = setTimeout(() => { timer = null; advance(); }, delay);
  }

  input.addEventListener("mouseenter", () => {
    hovered = true;
    if (stopped || layer.hidden) return;
    if (timer !== null) {
      remaining = Math.max(0, deadline - performance.now());
      clearTimeout(timer);
      timer = null;
    }
  });
  input.addEventListener("mouseleave", () => {
    hovered = false;
    if (stopped || layer.hidden) return;
    if (!animations.length) schedule(remaining);
  });

  function advance() {
    if (stopped || input.value || document.activeElement === input) { stop(); return; }
    index += 1;
    const previous = layer.firstElementChild;
    const next = line(currentText());
    layer.append(next);
    const version = revision;
    animations = [
      previous.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 300, easing: "ease-in-out", fill: "forwards" }),
      next.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 300, easing: "ease-in-out", fill: "forwards" }),
    ];
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (stopped || version !== revision) return;
      previous.remove();
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (index === totalSteps) stop();
      else schedule();
    }).catch(() => { /* Interaction cancels the transition immediately. */ });
  }

  for (const field of [input, ...mirrors]) {
    for (const event of ["focus", "pointerdown", "input"]) field.addEventListener(event, stop);
  }
  motion.addEventListener("change", () => { if (motion.matches) stop(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  compact.addEventListener("change", () => {
    syncPlaceholder();
    if (!stopped && layer.childElementCount === 1) layer.firstElementChild.textContent = currentText();
  });

  function syncPlaceholder() {
    input.placeholder = alpha
      ? compact.matches ? "Débrider un lien ; rechercher…" : "Débrider un lien ; rechercher une ressource, un titre de presse ou un livre…"
      : betaPlaceholder;
    input.setAttribute("aria-label", alpha ? "Débrider un lien ; rechercher une ressource, un titre de presse ou un livre" : betaLabel);
  }

  return {
    setAlphaMode(enabled) {
      if (alpha === enabled) return;
      alpha = enabled;
      examples = enabled ? [...searchExamples, linkExample] : searchExamples;
      totalSteps = examples.length * 2;
      syncPlaceholder();
      if (started && !stopped && !layer.hidden) {
        revision += 1;
        clearTimeout(timer);
        animations.forEach(animation => animation.cancel());
        animations = [];
        index = 0;
        layer.replaceChildren(line(currentText()));
        schedule();
      }
    },
    start() {
      if (started || stopped) return;
      started = true;
      if (motion.matches || document.hidden || input.value || document.activeElement === input || typeof Element.prototype.animate !== "function") return;
      layer.replaceChildren(line(currentText()));
      layer.hidden = false;
      input.classList.add("has-search-hints");
      hovered = input.matches(":hover");
      schedule();
    },
  };
}
