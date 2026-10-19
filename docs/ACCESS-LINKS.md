# Access links

Resource and press cards share one secondary action and native dialog in
`assets/js/features/catalog/access-links.js`. Books and favorite shortcuts
are unchanged. No catalogue metadata or authentication mechanism is changed.

The adapter uses `createResourceActions` to resolve every catalogue action,
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
both vertically centered. Link glyph is 14px in a 28px desktop square,
and a preserved 44px coarse-pointer target. URL and provider names use the
theme's muted text token; access labels remain prominent. Provider metadata
is structured separately from the full accessible label, never parsed out
of a combined label string.
Hover colors stay within themed grays for links and gold/yellow for favorites,
including the border and glyph; do not use the general red accent for hover.

Bookmark/share follow-up: header tools gap is 6px. The named access heading is
a native draggable HTTP(S) link to the canonical URL, not the session-transition
helper. Keep the resource name in its visible text so a dragged bookmark has
a meaningful title. Desktop help describes dragging to the browser toolbar;
coarse-pointer/no-hover devices get long-press/copy/manual-bookmark guidance.
Native toolbar drops depend on the browser chrome and are not proven by a DOM
test of the link alone.

The trailing Share icon is conditional on secure context, navigator.share,
navigator.canShare accepting the exact title/URL and web-share Permissions
Policy where inspectable. Detection never invokes the native pane. Only a
direct click calls share with the canonical URL. Cancellation stays silent;
other failures hide that action and retain Copy/Open. Available destinations
cannot be enumerated in advance; an API-positive check is not a guarantee
that the system pane will open. Tests mock the API: physical mobile share
panels and actual creation of a browser bookmark still need manual validation.
No extension or HTML export is part of this implementation.
