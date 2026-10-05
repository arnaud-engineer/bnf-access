import {accessModeClasses as defaultAccessModeClasses} from '../../config/catalog.js';
import {
  deferredCardBatchSize as defaultDeferredCardBatchSize,
  initialCardCount as defaultInitialCardCount
} from '../../config/runtime.js';
import {escapeHtml, escapeAttribute} from '../../shared/text.js';
import {logoAppearanceAttributes} from '../../logo-appearance.js?v=2026-09-16-press-background';

// Progressive lists own cancellation state so obsolete batches cannot append to a new view.
export function createCatalogListing({
  openPlatformDirectory,
  accessModeClasses = defaultAccessModeClasses,
  bookSearch,
  createCard,
  createPressTitleFilters,
  deferredCardBatchSize = defaultDeferredCardBatchSize,
  getAccessMode,
  getAccessModeLabel,
  getFilteredResources,
  getResourceTaxonomyAncestors,
  getResourceTaxonomyIndex,
  getResourceTaxonomyNodes,
  getVisibleActions,
  grid,
  initialCardCount = defaultInitialCardCount,
  isPressResourceEntry,
  isPressTitleEntry,
  loadPressCatalog,
  matchesPressTitleCountryFilter,
  matchesPressTitleEditorialFilter,
  matchesPressTitleLocalRegionFilter,
  matchesPressTitleSourceFilter,
  playListRefreshAnimation,
  playResourceGridAnimation,
  pressPlatformCompactLabels,
  pressPlatformNarrowLabels,
  pressPlatformResourceIds,
  pressPlatformToneIds,
  pressTitleMediumLayoutQuery,
  pressTitleNarrowLayoutQuery,
  renderActionLink,
  renderIcon,
  renderOverview,
  requestIdleWork,
  resultCount,
  resultsHeading,
  resultsSummary,
  scheduleBackgroundAssetWarmup,
  scheduleFloatingToolsUpdate,
  shouldShowPressTitleSection,
  state
}) {
  let entryCardColumnCount = getEntryCardColumnCount();

  let progressiveRenderVersion = 0;

  let pendingProgressiveRender = null;

  function resumeProgressiveRendering() {
    if (pendingProgressiveRender) {
      scheduleNextCardBatch(pendingProgressiveRender.renderVersion);
    }
  }

  function getPressPlatformResources(resources) {
    const byId = new Map(resources.map((resource) => [resource.id, resource]));
    return pressPlatformResourceIds.map((id) => byId.get(id)).filter(Boolean);
  }

  function renderResourceGrid(options = {}) {
    const renderVersion = ++progressiveRenderVersion;
    if (state.category === "Tout") {
      renderOverview();
      return;
    }
    if (state.category === "Livre") {
      resultsSummary.hidden = true;
      grid.classList.add("results-grouped");
      bookSearch.renderGrid(grid, resultCount);
      return;
    }
    const resources = getFilteredResources();
    const resourceEntries = resources.filter(isPressResourceEntry);
    const displayedResourceEntries = shouldShowPressTitleSection()
      ? getPressPlatformResources(resourceEntries)
      : resourceEntries;
    const titleCandidates = shouldShowPressTitleSection()
      ? resources.filter(isPressTitleEntry)
      : [];
    const titleEntries = titleCandidates
      .filter(matchesPressTitleSourceFilter)
      .filter(matchesPressTitleCountryFilter)
      .filter(matchesPressTitleEditorialFilter)
      .filter(matchesPressTitleLocalRegionFilter)
      .filter((resource) => getVisibleActions(resource).length > 0);
    const deferredSections = [];

    const pressCategorySelected = state.category === "Presse";
    resultsSummary.hidden = pressCategorySelected;
    resultsHeading.hidden = true;
    resultCount.textContent = `Total : ${formatSectionCount(displayedResourceEntries.length, "ressource")}`;
    grid.innerHTML = "";
    grid.classList.add("results-grouped");
    grid.dataset.renderComplete = "false";
    if (shouldShowPressTitleSection() && !state.pressLoaded) {
      const status = document.createElement("p");
      status.className = "empty";
      status.setAttribute("role", "status");
      status.textContent = state.pressLoadError ? "Les titres de presse n’ont pas pu être chargés. " : "Chargement des titres de presse…";
      if (state.pressLoadError) {
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = "Réessayer";
        retry.addEventListener("click", () => loadPressCatalog());
        status.append(retry);
      }
      grid.append(status);
    }

    if (!displayedResourceEntries.length && !titleCandidates.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Aucune ressource ne correspond à cette recherche.";
      grid.append(empty);
      grid.dataset.renderComplete = "true";
      playListRefreshAnimation(grid);
      return;
    }

    if (state.category === "Presse") {
      appendPressPlatformSection(displayedResourceEntries);
    } else if (state.category !== "Toutes") {
      appendTaxonomyResourceSections(resourceEntries);
    } else {
      appendResourceSection("Ressources", resourceEntries, "press-resources", {
        cardContext: "resource",
        hideHeading: !shouldShowPressTitleSection(),
      });
    }
    appendResourceSection("Titres de presse", titleEntries, "press-titles", {
      cardContext: "title",
      controls: titleCandidates.length ? createPressTitleFilters(titleCandidates) : null,
      emptyLabel: "Aucun titre de presse ne correspond à ce filtre.",
      showWhenEmpty: shouldShowPressTitleSection() && titleCandidates.length > 0,
    });

    playResourceGridAnimation(options.animationTarget);
    beginProgressiveCardRendering(renderVersion, deferredSections);
    if (state.appRevealed) {
      scheduleBackgroundAssetWarmup();
    }

    function appendResourceSection(title, sectionResources, sectionClass, options = {}) {
      if (!sectionResources.length && !options.showWhenEmpty) {
        return;
      }

      const section = document.createElement("section");
      section.className = `entry-section ${sectionClass}`;
      section.id = sectionClass;
      section.setAttribute("aria-labelledby", `${sectionClass}-heading`);

      const heading = document.createElement("div");
      heading.className = "entry-section-heading";
      heading.hidden = options.hideHeading === true;
      heading.innerHTML = `
        <h2 id="${sectionClass}-heading">${escapeHtml(title)}</h2>
        <p>${formatSectionCount(sectionResources.length, title === "Titres de presse" ? "titre" : "ressource")}</p>
      `;

      const list = document.createElement("div");
      list.className = "entry-grid";

      if (sectionResources.length) {
        const immediateEnd = Math.min(sectionResources.length, initialCardCount);
        appendCardRange(list, sectionResources, 0, immediateEnd, {
          context: options.cardContext,
          showTaxonomyBadges: options.showTaxonomyBadges,
          eager: true,
        });

        if (immediateEnd < sectionResources.length) {
          deferredSections.push({
            list,
            resources: sectionResources,
            nextIndex: immediateEnd,
            context: options.cardContext,
            showTaxonomyBadges: options.showTaxonomyBadges,
          });
        }
      } else {
        const empty = document.createElement("p");
        empty.className = "empty section-empty";
        empty.textContent = options.emptyLabel ?? "Aucune ressource ne correspond à cette recherche.";
        list.append(empty);
      }

      section.append(heading);
      if (options.controls) {
        section.append(options.controls);
      }
      section.append(list);
      grid.append(section);
    }

    function appendPressPlatformSection(platforms) {
      if (!platforms.length) return;

      const section = document.createElement("section");
      section.className = "entry-section press-platforms";
      section.setAttribute("aria-labelledby", "press-platforms-heading");
      section.innerHTML = `
        <div class="entry-section-heading press-platforms-heading">
          <h2 id="press-platforms-heading">Plateformes de presse</h2>
          <button type="button" class="quick-launch-action neutral platform-directory-link" aria-label="Voir toutes les bases de presse dans Ressources">Voir tout</button>
        </div>
        <div class="press-platform-list">
          ${platforms.map((resource) => {
            const action = getVisibleActions(resource)[0];
            const accessMode = getAccessMode(resource);
            const toneId = pressPlatformToneIds[resource.id] ?? "default";
            return `
              <article class="press-platform-item press-platform-${escapeAttribute(toneId)}">
                <div class="press-platform-logo"${logoAppearanceAttributes(resource)}>${renderIcon(resource, true)}</div>
                <strong title="${escapeAttribute(resource.name)}"><span class="press-platform-dot" aria-hidden="true"></span><span class="press-platform-label">${escapeHtml(pressPlatformCompactLabels[resource.id] ?? resource.name)}</span>${pressPlatformNarrowLabels[resource.id] ? `<span class="press-platform-label-narrow">${escapeHtml(pressPlatformNarrowLabels[resource.id])}</span>` : ""}</strong>
                <span class="press-platform-access ${escapeAttribute(accessModeClasses[accessMode] ?? "onsite")}">${escapeHtml(getAccessModeLabel(resource))}</span>
                ${action ? renderActionLink(resource, action, { compactAppearance: true }) : ""}
              </article>
            `;
          }).join("")}
        </div>
      `;
      section.querySelector('.platform-directory-link').addEventListener('click', () => openPlatformDirectory('presse_et_medias'));
      grid.append(section);
    }

    function appendTaxonomyResourceSections(sectionResources) {
      const root = getResourceTaxonomyIndex().get(state.category);
      const categories = state.resourceTaxonomy?.taxonomy?.categories ?? [];
      const childOrders = state.resourceTaxonomy?.taxonomy?.child_orders ?? {};
      const byParent = new Map();
      categories.forEach((category) => {
        if (!byParent.has(category.parent_id)) byParent.set(category.parent_id, []);
        byParent.get(category.parent_id).push(category);
      });
      for (const [parentId, children] of byParent.entries()) {
        const order = childOrders[parentId] ?? [];
        const orderIndex = new Map(order.map((id, index) => [id, index]));
        children.sort((left, right) => {
          const leftIndex = orderIndex.get(left.id);
          const rightIndex = orderIndex.get(right.id);
          if (leftIndex != null || rightIndex != null) {
            if (leftIndex == null) return 1;
            if (rightIndex == null) return -1;
            return leftIndex - rightIndex;
          }
          return left.label.localeCompare(right.label, "fr", { sensitivity: "base" });
        });
      }
      const children = byParent.get(state.category) ?? [];
      const groupedIds = new Set();

      for (const child of children) {
        const branch = [];
        const collectBranch = (category) => {
          branch.push(category);
          (byParent.get(category.id) ?? []).forEach(collectBranch);
        };
        collectBranch(child);
        for (const category of branch) {
          const categoryResources = sectionResources.filter((resource) => (
            getResourceTaxonomyNodes(resource).some((node) => node.id === category.id)
          ));
          if (!categoryResources.length) continue;
          categoryResources.forEach((resource) => groupedIds.add(resource.id));
          const heading = getResourceTaxonomyAncestors(category)
            .slice(1)
            .map((ancestor) => ancestor.label)
            .join(" › ");
          appendResourceSection(heading, categoryResources, `resource-taxonomy-${category.id}`, {
            cardContext: "resource",
            showTaxonomyBadges: false,
          });
        }
      }

      const ungrouped = sectionResources.filter((resource) => !groupedIds.has(resource.id));
      if (ungrouped.length) {
        appendResourceSection(root?.label ?? "Autres ressources", ungrouped, `resource-taxonomy-${state.category}-other`, {
          cardContext: "resource",
          showTaxonomyBadges: false,
        });
      }
    }
  }

  function appendCardRange(list, resources, startIndex, endIndex, options = {}) {
    let currentRow = null;
    const columns = getEntryCardColumnCount();

    for (let index = startIndex; index < endIndex; index += 1) {
      if (index % columns === 0) {
        currentRow = document.createElement("div");
        currentRow.className = "entry-row";
        list.append(currentRow);
      }

      currentRow.append(createCard(resources[index], options.eager === true, {
        context: options.context,
        showTaxonomyBadges: options.showTaxonomyBadges,
      }));
    }

    return endIndex - startIndex;
  }

  function getEntryCardColumnCount() {
    if (pressTitleNarrowLayoutQuery.matches) return 1;
    if (pressTitleMediumLayoutQuery.matches) return 2;
    return 3;
  }

  function syncEntryGridColumns() {
    const columns = getEntryCardColumnCount();
    if (columns === entryCardColumnCount) return;
    entryCardColumnCount = columns;

    document.querySelectorAll(".entry-grid").forEach((list) => {
      const cards = Array.from(list.children).flatMap((row) => (
        row.classList.contains("entry-row") ? Array.from(row.children) : []
      ));
      if (!cards.length) return;

      const rows = document.createDocumentFragment();
      for (let index = 0; index < cards.length; index += columns) {
        const row = document.createElement("div");
        row.className = "entry-row";
        row.append(...cards.slice(index, index + columns));
        rows.append(row);
      }

      Array.from(list.children)
        .filter((child) => child.classList.contains("entry-row"))
        .forEach((row) => row.remove());
      list.append(rows);
    });
  }

  function beginProgressiveCardRendering(renderVersion, sections) {
    pendingProgressiveRender = { renderVersion, sections };

    if (!sections.length) {
      finishProgressiveCardRendering(renderVersion);
      return;
    }

    if (state.appRevealed) {
      scheduleNextCardBatch(renderVersion);
    }
  }

  function scheduleNextCardBatch(renderVersion) {
    window.requestAnimationFrame(() => {
      requestIdleWork(() => renderNextCardBatch(renderVersion), 120);
    });
  }

  function renderNextCardBatch(renderVersion) {
    // An intervening filter change invalidates callbacks already queued by the browser.
    if (renderVersion !== progressiveRenderVersion || pendingProgressiveRender?.renderVersion !== renderVersion) {
      return;
    }

    const section = pendingProgressiveRender.sections.find((item) => item.nextIndex < item.resources.length);

    if (!section) {
      finishProgressiveCardRendering(renderVersion);
      return;
    }

    const endIndex = Math.min(section.resources.length, section.nextIndex + deferredCardBatchSize);
    appendCardRange(section.list, section.resources, section.nextIndex, endIndex, {
      context: section.context,
      showTaxonomyBadges: section.showTaxonomyBadges,
      eager: false,
    });
    section.nextIndex = endIndex;
    scheduleFloatingToolsUpdate();
    scheduleNextCardBatch(renderVersion);
  }

  function finishProgressiveCardRendering(renderVersion) {
    if (renderVersion !== progressiveRenderVersion) {
      return;
    }

    pendingProgressiveRender = null;
    grid.dataset.renderComplete = "true";
    grid.dispatchEvent(new CustomEvent("bnf:render-complete"));
  }

  function formatSectionCount(count, label) {
    return `${count} ${label}${count > 1 ? "s" : ""}`;
  }

  return {
    appendCardRange,
    renderResourceGrid,
    resumeProgressiveRendering,
    syncEntryGridColumns
  };
}
