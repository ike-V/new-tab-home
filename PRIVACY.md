# Privacy Policy: New Tab Home ~/

Last updated: 2026-10-12

New Tab Home ~/ replaces your browser's New Tab page with a clock, a search box, and a
wallpaper from your own images. It has no accounts, servers, analytics, or advertising.
The developer collects no data.

## Data stored on your device

Kept in your browser, for this extension only. Never transmitted.

- **Wallpaper images:** a reference to the folder you chose (read-only access), or
  copies of images you chose or dropped. The last wallpaper shown is cached if under
  4 MB, for faster loading.
- **Settings:** your selected search engine, any custom search engines you add (name
  and URL, plus a number that picks its generated icon), and the file names of the last 20 wallpapers shown (so they don't repeat).

To remove it: delete the extension or clear its site data. Revoke folder access in your
browser's site settings. Remove a custom engine with its × in the engine menu.

## Network requests

The extension makes no network requests of its own. The search-engine icons are pixel
art built into the extension, and custom engines get a generated icon, so no icon is
fetched from anywhere. The only traffic is what you start: submitting a search sends
your query to the engine you picked (see Searches).

## Searches

The extension does not store or log your queries. With **Browser default**, the query
is passed to your browser's search API, which sends it to your default search provider.
With any other engine, your browser opens that engine's search page with your query.
Either way, the query goes to that search provider and is governed by its privacy
policy.

## Permissions

- `search`: runs your searches with your browser's default search engine. Used for
  nothing else.
- New Tab override: replaces the New Tab page with this extension's page.
- Folder access: requested by your browser at the time you choose a wallpaper folder.
  Read-only.

## Chrome Web Store user data policy

The extension does not sell or transfer user data to third parties; does not use or
transfer user data for purposes unrelated to its single purpose (a customizable New Tab
page); and does not use or transfer user data to determine creditworthiness or for
lending purposes.

## Children

The extension collects no data from anyone, including children.

## Changes

Changes are published in this file. The repository history shows every revision.

## Contact

Open an issue at <https://github.com/ike-V/new-tab-home/issues>.
