export function createSearchHints(input, mirrors = []) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compact = window.matchMedia("(max-width: 640px)");
  const layer = document.createElement("div");
  layer.className = "search-hints";
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  input.after(layer);
  const examples = [
    ["Rechercher une ressource · Universalis, ScholarVox…", "Rechercher une ressource · Universalis"],
    ["Rechercher un titre de presse · Le Monde, Le Figaro…", "Rechercher un journal · Le Monde"],
    ["Rechercher un livre · titre ou auteur", "Rechercher un livre · titre ou auteur"],
    ["Rechercher un livre · ISBN : 9782200628789", "Rechercher un ISBN · 9782200628789"],
  ];
  const totalSteps = examples.length * 2;
  let started = false;
  let stopped = false;
  let timer;
  let animations = [];
  let index = 0;

  function stop() {
    stopped = true;
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

  function advance() {
    if (stopped || input.value || document.activeElement === input) { stop(); return; }
    index += 1;
    const previous = layer.firstElementChild;
    const next = line(currentText());
    layer.append(next);
    animations = [
      previous.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 300, easing: "ease-in-out", fill: "forwards" }),
      next.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: 300, easing: "ease-in-out", fill: "forwards" }),
    ];
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (stopped) return;
      previous.remove();
      animations.forEach(animation => animation.cancel());
      animations = [];
      if (index === totalSteps) stop();
      else timer = setTimeout(advance, 2700);
    }).catch(() => { /* Interaction cancels the transition immediately. */ });
  }

  for (const field of [input, ...mirrors]) {
    for (const event of ["focus", "pointerdown", "input"]) field.addEventListener(event, stop);
  }
  motion.addEventListener("change", () => { if (motion.matches) stop(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  compact.addEventListener("change", () => {
    if (!stopped && layer.childElementCount === 1) layer.firstElementChild.textContent = currentText();
  });

  return {
    start() {
      if (started || stopped) return;
      started = true;
      if (motion.matches || document.hidden || input.value || document.activeElement === input || typeof Element.prototype.animate !== "function") return;
      layer.replaceChildren(line(currentText()));
      layer.hidden = false;
      input.classList.add("has-search-hints");
      timer = setTimeout(advance, 2700);
    },
  };
}
