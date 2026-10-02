// Existing UI timings and batch sizes; changing these requires behavioral review.
// Batches of 24 remain row-complete for one, two and three columns.
export const startupImageTimeoutMs = 450;

export const converterResourcesAnimationMs = 160;

export const converterResourceSearchDelayMs = 350;

export const converterResourcePageSize = 50;

export const initialCardCount = 24;

export const deferredCardBatchSize = 24;

export const backgroundAssetBatchSize = 4;

export const backgroundAssetWarmupDelayMs = 80;

export const backgroundAssetRetryLimit = 2;

export const runtimeJsonCacheName = "bnf-access:v2:json:v5";

export const catalogFavoritesLargeImageThresholdBytes = 15 * 1024;

export const floatingFooterGap = 18;

export const maxFloatingViewportOffset = 120;

export const quickLaunchAutoScrollEdge = 72;

export const quickLaunchAutoScrollAccelerationMs = 1600;

export const quickLaunchAutoScrollMinSpeed = 1.5;

export const quickLaunchAutoScrollMaxSpeed = 12;

export const startupImageBlockingCount = 72;

export const listRefreshAnimationClass = "is-entering";

export const siteAccessValues = new Set(["unknown", "yes", "no"]);

export const themeValues = new Set(["auto", "light", "dark", "oled"]);

export const themeCycle = ["light", "dark", "oled"];
