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
