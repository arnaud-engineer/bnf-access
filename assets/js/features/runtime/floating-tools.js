import {floatingFooterGap, maxFloatingViewportOffset} from '../../config/runtime.js';

// Coalesce scroll and viewport updates without changing the footer and keyboard avoidance offsets.
export function createFloatingTools({
  jumpToSearchDock,
  pressPopularityNote,
  schedulePressTitleCategoryBadgeLayout,
  siteFooter,
  syncPressPopularityNoteDockOffset
}) {
  let floatingToolsFrame = null;

  function setupFloatingTools() {
    if (!jumpToSearchDock) {
      return;
    }

    scheduleFloatingToolsUpdate();
    window.addEventListener("scroll", scheduleFloatingToolsUpdate, { passive: true });
    window.addEventListener("resize", scheduleFloatingToolsUpdate);
    window.addEventListener("resize", schedulePressTitleCategoryBadgeLayout);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("scroll", scheduleFloatingToolsUpdate, { passive: true });
      window.visualViewport.addEventListener("resize", scheduleFloatingToolsUpdate);
    }

    if ("ResizeObserver" in window) {
      const popularityNoteObserver = new ResizeObserver(syncPressPopularityNoteDockOffset);
      popularityNoteObserver.observe(pressPopularityNote);
    }
  }

  function scheduleFloatingToolsUpdate() {
    if (!jumpToSearchDock || floatingToolsFrame) {
      return;
    }

    floatingToolsFrame = window.requestAnimationFrame(() => {
      floatingToolsFrame = null;
      updateFloatingToolsPosition();
    });
  }

  function updateFloatingToolsPosition() {
    const visualViewportOffset = getFloatingVisualViewportOffset();

    jumpToSearchDock.style.setProperty("--floating-viewport-offset", `${visualViewportOffset}px`);
    jumpToSearchDock.style.setProperty("--floating-footer-offset", "0px");

    if (!siteFooter) {
      return;
    }

    const dockRect = jumpToSearchDock.getBoundingClientRect();
    const footerRect = siteFooter.getBoundingClientRect();
    const footerOffset = Math.max(0, Math.ceil(dockRect.bottom + floatingFooterGap - footerRect.top));

    jumpToSearchDock.style.setProperty("--floating-footer-offset", `${footerOffset}px`);
  }

  function getFloatingVisualViewportOffset() {
    if (!window.visualViewport) {
      return 0;
    }

    const layoutHeight = window.innerHeight || document.documentElement.clientHeight;
    const hiddenBottom = layoutHeight - window.visualViewport.height - window.visualViewport.offsetTop;

    return Math.min(maxFloatingViewportOffset, Math.max(0, Math.ceil(hiddenBottom)));
  }

  return {
    scheduleFloatingToolsUpdate,
    setupFloatingTools
  };
}
