# Access links

Resource and press cards share one secondary action and native dialog in
`assets/js/features/catalog/access-links.js`. Books and favorite shortcuts
are unchanged. No catalogue metadata or authentication mechanism is changed.

On main, the adapter uses the existing action functions in `assets/js/app.js`
to resolve every catalogue action,
including collapsed variants and all declared editions. Listing filters do
not remove links from this dialog. Exact duplicate presentations collapse;
distinct labels or destinations remain separate. Only HTTP(S) URLs are exposed.

Europresse retains its existing authenticated deep link. For other providers
requiring a session initializer, both the initializer and external destination
are recoverable; opening the destination preserves the existing transition
helper attributes. No redirected session URL is collected. A copied target
alone does not replace a provider's session initialization or access rights.

The dialog uses native modal semantics plus explicit Tab wrapping, Escape,
backdrop dismissal and focus restoration. Clipboard denial falls back to a
selected read-only URL and legacy copy, with an explicit manual-copy message
when that also fails. Clipboard results from a closed dialog are ignored.

Local regression tests: `private/tests/access_links.test.mjs` covers catalogue
extraction, variants, editions, session routes, unsafe/missing URLs and source
immutability. Browser checks cover Resources/Press at 1440 and 390 pixels,
individual copy/open, Clipboard denial, favorites, keyboard focus and long
URL/many-link overflow. Authentication delivery is not tested by these checks.

The private asset-index builder must recognize `lucide-link.svg` when rebuilding
the tracked image index and manifest. The icon uses the existing Lucide license.

Presentation amendment: use a read-only single-line input, Copy and Open in one
non-wrapping row, including mobile. Card header actions are horizontal so the
secondary icon does not add its own row above descriptions. Free/public access
metadata suppresses the authentication notice; other authenticated accesses
use affirmative wording. A normal website cannot invoke the browser's native
bookmark-creation dialog; do not add a misleading bookmark button.

Visual hierarchy: header Link precedes Favorite (star at the outer right),
both vertically centered. Link glyph is 14px in a 28px square on both desktop
and touch screens; the favorite remains a 38px square, with no flex shrinking
and a 6px gap. URL and provider names use the
theme's muted text token; access labels remain prominent. Provider metadata
is structured separately from the full accessible label, never parsed out
of a combined label string.
Hover colors stay within themed grays for links and gold/yellow for favorites,
including the border and glyph; do not use the general red accent for hover.

Bookmark/share follow-up: header tools gap is 6px. Each access has an app-like
card-identical logo with a caption underneath, linked to the canonical HTTP(S) URL, not
the session-transition helper. The application supplies the existing card logo
as presentation data; the common dialog clones it, with initials as fallback.
For a single generic Open action the caption is just the resource name. Other
routes retain the resource name plus access type. Native drag data preserves
the URL and meaningful title (URI list, HTML and Firefox URL/title formats).
A temporary logo-only top-layer preview is supplied to setDragImage, without
an added frame, caption or rounding; the source dims
during dragging and dragend/close clean up state. Compact intro/authentication notices
share one paragraph and precede a centered, wrapping row of logo shortcuts.
Multiple shortcuts show access-type captions only; native bookmark payloads
retain the full resource/access title. One adaptive help follows the whole row,
then one separator and labeled URL/actions rows without intermediate rules.
Shortcut clicks (including Enter and middle-click) do not navigate; the separate
Open action remains the explicit navigation control. Native link dragging and
the context menu retain the canonical URL.
Desktop help describes dragging the icon to the browser toolbar;
coarse-pointer/no-hover devices get long-press/copy/manual-bookmark guidance.
Native toolbar drops depend on the browser chrome and are not proven by a DOM
test of the link alone.

The drag image is not a bookmark favicon. Standard link drag formats expose
URL/text, and Firefox's text/x-moz-url parser consumes URL/title only. Do not
promise a transferred favicon or change canonical BnF URLs to achieve one.

Bulk browser export is available as the third tab of the configuration-sharing
dialog. browser-bookmarks.js serializes Netscape bookmark HTML with escaped
titles/attributes and HTTP(S)-only destinations. Preserve row/folder order,
nest multiple accesses by resource, and report unavailable favorites.
The main backport excludes the experimental book catalogue and its adapters.
Download is user-triggered, local-only and does not replace site preferences.
The UI distinguishes BnF Access configuration sharing/import from browser
bookmark import, including desktop/mobile guidance and no favicon guarantee.
Import instructions detect Firefox/Chrome conservatively, use a generic fallback
for other browsers, and allow a manual browser choice. Mobile/tablet guidance
avoids promising an on-device HTML import. Official help links use ordinary
same-tab navigation, not popup windows. Procedures were checked against Mozilla
and Google support pages on 2026-10-19.
Firefox guidance is an ordered list, identifying the unlabeled Mac up/down
arrow control with a Lucide illustration. After import, locate BnF Access in
All Bookmarks / Bookmarks Menu, then optionally drag it to Bookmarks Toolbar;
warn against importing again while merely searching for the imported folder.
Chrome and Safari also have five numbered steps, including post-import location
and moving BnF Access to the favorites bar. Safari is automatically detected
after Chromium exclusions and is manually selectable. Current procedures were
checked against Google and Apple support pages on 2026-10-19; native Safari
import was not exercised. Its File menu wording can vary by version.
On detected phones/tablets, the browser-export tab contains only a desktop-only
notice, not the download, procedures, selector or help links. Configuration
sharing/import stay available. Desktop detection is not based on viewport width.
The individual access-link dialog is separate: narrow screens or coarse-touch
devices hide the logo shortcuts/intro/drag instructions and separator. Each
access has its own label, a full-width URL and a second full-width row of
equally sized Copy/Open/optional Share actions with visible text. Share remains
capability/policy/secure-context gated. Desktop retains its inline controls.
Targeted tests: private/tests/browser_bookmarks.test.mjs. A real HTML download
and tab switching were checked in isolated Chrome desktop/mobile contexts;
browser-native bookmark import and authenticated delivery remain untested.

The trailing Share icon is conditional on secure context, navigator.share,
navigator.canShare accepting the exact title/URL and web-share Permissions
Policy where inspectable. Detection never invokes the native pane. Only a
direct click calls share with the canonical URL. Cancellation stays silent;
other failures hide that action and retain Copy/Open. Available destinations
cannot be enumerated in advance; an API-positive check is not a guarantee
that the system pane will open. Tests mock the API: physical mobile share
panels and actual creation of a browser bookmark still need manual validation.
No extension or HTML export is part of this implementation.
