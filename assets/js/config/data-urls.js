// Version decoration belongs to each loader; never share its mutable URL map.
export function createDataUrls() {
  return {
    assetIndex: "./data/asset-index.json",
    catalog: "./data/catalog-core.json",
    press: "./data/catalog-press.json",
    europresseLinks: "./data/europresse-link-sources.json",
    pressreaderLinks: "./data/pressreader-link-sources.json",
    indexpresseLinks: "./data/indexpresse-business-link-sources.json",
    linkDirectorySettings: "./data/link-directory-settings.json",
    popularity: "./data/press-popularity.json",
  };
}
