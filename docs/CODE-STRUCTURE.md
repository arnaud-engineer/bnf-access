# Code Structure

## Conventions

- Keep native ES modules and the static deployment. No framework or bundler is
  required merely to organize the code.
- Organize by responsibility: domain calculations, feature controllers, shared
  utilities, configuration and page entry points. A module owns one coherent
  feature, not an arbitrary slice of a large file.
- Domain modules have no DOM access, storage writes or navigation side effects.
  They accept explicit inputs and return values that unit tests can inspect.
- Feature controllers own their event listeners and transient UI state. Inject
  the state, elements and callbacks they need. Do not import the application entry
  point or use a global service locator. Read changing primitive state through
  explicit getters, not copied values.
- Import stable configuration and pure helpers where they are used. Factory
  parameter defaults may expose overrides for tests; the entry point should not
  repeatedly pass unchanged constants through every controller.
- Pass DOM elements as elements, not callback wrappers. Defer operations that
  call another controller until after composition; do not defer ordinary values.
- Page entry points compose features and coordinate startup. Existing state and
  storage keys remain compatible during extraction.
- Configuration and generated provider profiles are separate from behavior.
  Generated files remain generated; never refactor their content by hand.
- Use named exports, descriptive feature filenames, two-space indentation and
  comments only for constraints that are not evident from the code.
- Prefer modules of a few hundred lines. This is a review signal, not a reason
  to split cohesive code into arbitrary numbered files.
- HTML keeps semantic page structure and accessible control names. Repeated
  interactive rendering belongs to its feature controller; do not add a build
  pipeline solely to split a modest HTML document into fragments.
- Group CSS by feature with a documented cascade order. Preserve selectors,
  themes, breakpoints and asset paths during structural changes.

## Refactoring Contract

This is a structural migration, not a redesign. Preserve URL routes, catalogue
matching, Alpha/Beta boundaries, favorites, storage and provider warnings.
Extract declarations using the JavaScript parser, not regex brace matching.
Before changing behavior, keep an independently verified checkpoint. Each
extraction must pass domain tests and the relevant mobile/desktop interaction
smokes. An import cycle or undeclared feature dependency is a regression.
Static and deferred `import()` paths are module-relative. In contrast, existing
DOM image/script URLs and ordinary fetch strings are page-relative. Moving a
function must preserve the appropriate base, including vendor workers.
Formatting must not change whitespace inside string or template literals.

The local-only maintenance workshop and tests remain in `private/`; this public
document describes architecture, not research sessions or user data.

## Module Map

- `assets/js/app.js`: page composition, startup and application-level event
  coordination. It delegates feature rendering, listeners and persistence.
- `assets/js/config/application-state.js`: a fresh initial state per page,
  separate from restoration of browser preferences.
- `assets/js/config/application-elements.js`: DOM collection after HTML is
  available; the entry point passes each feature only its required elements.
- `assets/js/config/catalog.js`, `storage-keys.js`, `runtime.js` and
  `platforms.js`: labels, persistent key names, timings and provider entry URLs.
- `assets/js/config/data-urls.js`: fresh per-instance data URLs; decorating them
  with manifest versions must not mutate another loader's configuration.
- `assets/js/config/link-converter.js`: supported services and title extraction
  configuration, separate from generated provider profiles.
- `assets/js/shared/text.js`: catalogue normalization, HTML attribute escaping
  and capitalization, also used by the local editor.
- `assets/js/shared/counts.js`, `dates.js` and `storage.js`: pure counters,
  provider calendar formatting and tolerant optional preference persistence.
  Explicit import/reset transactions retain their own stronger error handling.
- `assets/js/book-search.js`: book catalogue loading, search coordination,
  synchronized inputs, suggestions, selected records and infinite scrolling.
- `assets/js/features/books/model.js`: immutable indexing, source-ID aliases,
  default favorites and filtering rules. Suggestions deliberately omit provider
  names; book text folding preserves punctuation unlike catalogue normalization.
- `assets/js/features/books/presentation.js`: cards, covers, platform actions,
  language badges, favorite tiles and viewport-measured description overflow.
  It reads changing context and grid targets through callbacks.
- `assets/js/features/link-converter/article-query.js`: URL-to-query calculations.
- `assets/js/features/link-converter/controller.js`: converter controls,
  service shortcuts and feedback, with explicit page dependencies.
- `assets/js/features/link-converter/routing.js`: provider recognition and
  transition URL construction, preserving the existing conversion recipes.
- `assets/js/features/link-converter/directory.js`: searchable provider modal.
- `assets/js/features/favorites/rendering.js`: favorite rows, tiles and headers.
- `assets/js/features/favorites/folders.js`: folder dialogs and row destinations.
- `assets/js/features/favorites/action-menu.js`: secondary actions and warnings.
- `assets/js/features/favorites/catalog-preview.js`: editor-only image inspection.
- `assets/js/features/favorites/persistence.js`: shared layout storage and
  one-time migrations, including book defaults and legacy favorites.
- `assets/js/features/favorites/editing.js`: favorite editing and drag/drop.
- `assets/js/features/sharing/controller.js`: configuration export/import,
  QR generation/scanning and dialog listeners; shared dialog state is explicit.
- `assets/js/features/press/filters.js`: press source, geography and taxonomy
  filter controls.
- `assets/js/features/catalog/actions.js`: provider links, edition controls
  and session-entry helpers.
- `assets/js/features/catalog/context-notes.js`: metadata badges and explanatory
  dialogs, including their own animation timers.
- `assets/js/features/catalog/selection.js`: category, profile, access, language
  and press matching shared by listings and search previews.
- `assets/js/features/catalog/filter-controls.js`: category/language controls.
- `assets/js/features/catalog/cards.js`: card markup, descriptions and badges.
- `assets/js/features/catalog/listing.js`: grouped results, responsive rows and
  progressive rendering, including cancellation of outdated batches.
- `assets/js/features/catalog/overview.js`: the lightweight all-category view.
- `assets/js/features/catalog/suggestions.js`: catalogue search previews.
- `assets/js/features/preferences/appearance.js` and `profile.js`: visual and
  access/language preferences without changing their stored keys.
- `assets/js/features/preferences/settings.js`: settings events, privacy
  acknowledgement and explicit scoped local reset. Editor drafts and unrelated
  browser data must survive that reset.
- `assets/js/features/preferences/release-mode.js`: the Alpha/Beta state owner,
  discovery gestures and notice. Other features read the current mode rather
  than capturing a stale initial boolean.
- `assets/js/features/runtime/catalog-loader.js`: versioned JSON loading,
  deduplicated requests, optional caches and deferred provider sources.
- `assets/js/features/runtime/asset-warmup.js`: cancellable idle-time warming.
- `assets/js/features/runtime/floating-tools.js`: frame-coalesced viewport and
  footer avoidance, without changing tool positioning or interaction rules.
- Existing `modules/` domain utilities and `pages/` entry points keep their
  current responsibilities.

Controllers return named operations. Cross-controller callbacks are deferred
until an interaction or startup, so composition does not depend on reading a
later controller's uninitialized binding. Controllers must not run these callbacks
from their constructors. Keep storage readers used during state construction
available before controller composition.

The entry point still contains startup and cross-feature event coordination;
it is not an empty bootstrap. Some cohesive controllers remain large. Future
extractions should follow tested ownership boundaries, not line quotas or a
single anonymous dependency container.

## Catalogue Editor

The local editor follows the same explicit-controller pattern. Its entry point
coordinates workspaces, loading and form events. Initial state and DOM collection
are in `editor-state.js` and `editor-elements.js`.

Separate modules own the catalogue list, editable values, taxonomy workspace,
recommendations and language reviews, catalogue relationships, metadata evidence,
editorial reviews, link previews, draft storage, guarded import/export and draft
conflicts. Existing books, debridage and icon-gallery workspaces remain intact.
Draft storage never replaces baseline catalogue data, and transfers preserve
identity checks and reviewer decisions. No browser sessions are exported.

- `editor-config.js` owns editor-only data paths, storage keys and display budgets.
- `editor-text.js` owns pure editor labels and description comparisons. Exact
  shared normalization/escaping functions come from the public text module;
  editor-specific date labels are not provider ISO dates.
- `workspace-navigation.js` owns workspace visibility, guarded transitions,
  theme cycling and messages to the isolated favorites preview.
- `link-review.js` owns access evidence presentation, reviewer decisions and
  link review updates. Collected suggestions never become confirmed decisions
  merely because the editor renders them.

Stable helpers/configuration are imported by their controllers with optional
test overrides. Mutable editor state, DOM bindings, persistence operations and
cross-workspace actions remain explicit dependencies.

## Data Processing Backend

The deployed site is static: there is no production application server. The
local processing tools are a separate backend responsibility, not browser
controllers. Keep this boundary explicit when extending the catalogue editor.

- Collection adapters retrieve source records and retain provenance. They do
  not publish findings or turn uncertain matches into confirmed access.
- Normalization and validation produce consistent records and reject invalid
  editor changes. The browser and processing tools share domain schemas where
  possible, rather than maintaining competing validation rules.
- Guarded application checks the export against the current baseline before
  changing canonical data. A draft or preview is not an applied change.
- Builders project validated data into artifacts consumed by the static site.
  Deployment is a separate, explicitly authorized operation.
- Browser preferences, subscription sessions and credentials are not backend
  inputs and must never appear in editor exports or generated catalogues.

Current write guarantees differ between tools. Catalogue application has a
transaction/rollback mechanism; book-rule application replaces its rules file
atomically. Debridage profile application replaces source and projection
sequentially, and the book catalogue builder writes its final output directly.
Do not describe those latter operations as a multi-file transaction. Future
hardening should stage outputs, protect concurrent application and retain a
recoverable last valid generation before replacing live artifacts.

## Verification

Structural tests check the module graph for missing files and import cycles,
including deferred vendor imports, undeclared dependencies, accidental DOM
callback wrappers, the stylesheet cascade and URL-query compatibility. Pure
domain helpers cannot reach browser state. Configuration and extracted editor
function bodies are compared against the preserved checkpoint.
Interaction checks cover synchronized search, shared book favorites, responsive
rows, sharing, provider shortcuts, cache behavior and editor draft workflows.
Tests use isolated browser contexts so they cannot modify the user's favorites.
The book model comparison exercises 34,020 combinations of queries, profile
context, language, availability, publisher/category and suggestion options.
The sharing/reset smoke includes QR photo decoding, cancellation, incoming hash
handling, persistence after reload and preservation of unrelated local data.

Wait for observable completion in browser tests, not an arbitrary delay: page
readiness does not imply background cache warming has completed. Validate
local routing independently from authenticated provider access; an intercepted
popup is not proof that a subscription article is available.

## Style Cascade

All pages still reference `assets/css/styles.css`. This compatibility entry point
imports the following sheets **in this order**, preserving the original cascade:

1. `base.css`: themes, tokens, page layout and header.
2. `search-converter.css`: notices, unified search and converter directory.
3. `favorites.css`: shortcut rows, tiles, folders and editing controls.
4. `books.css`: book suggestions, covers and results layout.
5. `catalog-filters.css`: filters, section layouts and press platform controls.
6. `catalog-cards.css`: cards, illustrations, descriptions and access actions.
7. `catalog-badges.css`: metadata badges and contextual notes.
8. `transitions.css`: intermediary access pages.
9. `preferences-and-responsive.css`: footer, settings, sharing and final mobile
   overrides. These overrides intentionally remain last, including rules that
   target other features.

Files remain in the same directory, so relative image paths are unchanged.
Do not append rules to the compatibility entry point. Keep matching responsive
rules with their feature unless their final override precedence is intentional.
