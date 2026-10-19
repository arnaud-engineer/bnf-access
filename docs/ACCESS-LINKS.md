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
both vertically centered. Link glyph is 16px, with a smaller desktop control
and a preserved 44px coarse-pointer target. URL and provider names use the
theme's muted text token; access labels remain prominent. Provider metadata
is structured separately from the full accessible label, never parsed out
of a combined label string.
