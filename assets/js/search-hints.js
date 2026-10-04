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
  let pass = 0;
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
    return index < examples.length ? examples[index][compact.matches ? 1 : 0] : input.placeholder;
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
    const rewind = index === examples.length - 1 && pass < 2;
    const frames = [{ element: layer.firstElementChild, offset: 0 }];
    if (rewind) {
      // Keep every intermediate line on the same moving strip during the rewind.
      for (let step = index - 1; step >= 0; step--) {
        const element = line(examples[step][compact.matches ? 1 : 0]);
        layer.append(element);
        frames.push({ element, offset: step - index });
      }
      pass += 1;
      index = 0;
    } else {
      index += 1;
      const element = line(currentText());
      layer.append(element);
      frames.push({ element, offset: 1 });
    }
    const distance = rewind ? frames.length - 1 : -1;
    const version = revision;
    animations = frames.map(({ element, offset }) => element.animate([
      { transform: `translateY(${offset * 100}%)` },
      { transform: `translateY(${(offset + distance) * 100}%)` },
    ], { duration: rewind ? distance * 240 : 300, easing: rewind ? "linear" : "ease-in-out", fill: "forwards" }));
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (stopped || version !== revision) return;
      layer.replaceChildren(frames[frames.length - 1].element);
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (index === examples.length) stop();
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
      syncPlaceholder();
      if (started && !stopped && !layer.hidden) {
        revision += 1;
        clearTimeout(timer);
        animations.forEach(animation => animation.cancel());
        animations = [];
        index = 0;
        pass = 0;
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
