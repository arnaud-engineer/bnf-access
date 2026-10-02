// The lightweight overview delegates each category to its existing renderer.
export function createCatalogOverview({
  appendCardRange,
  bookSearch,
  getFilteredResources,
  getVisibleActions,
  grid,
  isPressResourceEntry,
  isPressTitleEntry,
  render,
  renderFilters,
  resultsSummary,
  state
}) {
  function renderOverview() {
    resultsSummary.hidden = true;
    grid.classList.add("results-grouped");
    grid.replaceChildren();
    const resources = getFilteredResources()
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    for (const [label, category, allEntries] of [
      ["Ressources", "Toutes", resources.filter(resource => isPressResourceEntry(resource) && !isPressTitleEntry(resource))],
      ["Presse", "Presse", resources.filter(resource => isPressTitleEntry(resource) && getVisibleActions(resource).length)],
    ]) {
      const entries = allEntries.filter(resource => state.query.trim() || resource.default_favorite);
      const hasMore = allEntries.length > Math.min(entries.length, 40);
      if (!entries.length && (category !== "Presse" || state.pressLoaded)) continue;
      const section = document.createElement("section");
      section.className = "entry-section overview-section";
      const heading = document.createElement("div");
      heading.className = "entry-section-heading";
      const title = document.createElement("h2");
      title.textContent = label;
      const more = document.createElement("button");
      more.type = "button";
      more.className = "filter-button";
      more.textContent = "Voir tout";
      more.setAttribute("aria-label", `Voir tous les résultats : ${label}`);
      const openCategory = () => { state.category = category; renderFilters(); render(); };
      more.addEventListener("click", openCategory);
      heading.append(title);
      if (hasMore) heading.append(more);
      const list = document.createElement("div");
      list.className = "entry-grid";
      appendCardRange(list, entries, 0, Math.min(entries.length, 40), {
        eager: true,
        context: category === "Presse" ? "title" : "resource",
      });
      if (!entries.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = category === "Presse" && !state.pressLoaded ? "Chargement des titres de presse…" : "Aucun résultat avec ces filtres.";
        list.append(empty);
      }
      const bottomMore = more.cloneNode(true);
      bottomMore.classList.add("overview-more");
      bottomMore.addEventListener("click", openCategory);
      section.append(heading, list);
      if (hasMore) section.append(bottomMore);
      grid.append(section);
    }
    const books = document.createElement("section");
    books.className = "entry-section overview-section";
    grid.append(books);
    bookSearch.renderOverview(books).then(() => {
      if (state.category !== "Tout" || grid.childElementCount) return;
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Aucun résultat avec ces filtres.";
      grid.append(empty);
    });
    grid.dataset.renderComplete = "true";
  }

  return {
    renderOverview
  };
}
