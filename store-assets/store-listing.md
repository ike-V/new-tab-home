# Store listings

Build both ZIPs first: `python3 store-assets/build_zip.py`
- `new-tab-home.zip`: Chrome Web Store and Edge Add-ons
- `new-tab-home-firefox.zip`: Firefox Add-ons

Shared assets: icon `icons/icon128.png`; screenshots `screenshots/screenshot-store-1..4-*.png` (1280×800, local; #4 is `store-assets/icons-names-1280x800.png`); Edge logo `store-assets/store-logo-300x300.png`; promo tiles `store-assets/promo-tile-440x280.png`, `store-assets/marquee-tile-1400x560.png` (sources: `promo-tile.html`, `marquee-tile.html`).
Privacy policy URL (must be on `main`): https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md
Source: https://github.com/ike-V/new-tab-home · Issues: https://github.com/ike-V/new-tab-home/issues

## Chrome Web Store

**Name:** New Tab Home ~/ (from manifest) · **Summary:** manifest description (78/132) · **Category:** Productivity · **Language:** English

**Description:**

```
· NO ACCOUNTS · NO TRACKING · NO ADS
· NO SERVERS · NO NETWORK REQUESTS
· NO ACCESS TO TABS, HISTORY, DOWNLOADS OR COOKIES

Got a folder full of wallpapers you never see?
Now you will, every time you open a new tab.
"New Tab Home ~/" (~/ short for Home folder) replaces your new tab page with a clock, a search bar, and a wallpaper picked at random from a folder of your own images.

Your images never leave your computer.

WALLPAPERS
• Choose a folder once. Every new tab / refresh shows a different image
• Recently shown images are skipped, so you don't see the same few over and over
• Choose "Allow on every visit" and the folder stays available after you restart your browser
• The gear button opens a small menu: add images, refresh, remove the current wallpaper image, or hide the clock and the search bar to see your whole picture
• Drag image files onto the page to add them to the rotation
• Remove only deletes the copy the extension holds, never your original files. Images from your folder can't be removed this way; delete the file from the folder instead
• No folder access? Some browsers turn it off, and touch devices work differently. Add images directly instead
• Works with common image file types

SEARCH
• Uses your browser's default search engine
• Or pick another built-in engine, each with its own pixel-art icon
• The icons are small pixel-art sprites made in PICO-8 and built into the extension, so the sites' favicons don't need to be fetched from the internet
• Add your own search engines with a URL template (put %s where the search goes)
• Type a web address and press Enter to go straight there
• Press / anywhere on the page to jump to the search bar

PRIVACY AND PERMISSIONS
• One permission: "search", used only to run your search through your browser's default search engine
• It does not ask to read or change any website, and it cannot see your tabs, history, bookmarks, downloads or cookies
• No account, no login, no server, no analytics, no ads. Nothing is synced
• No remote code. Everything it runs is inside the package, as plain readable code
• It makes no network requests of its own
• Your images are read in your browser and never uploaded. A wallpaper folder is opened read-only, and only after you choose it
• Your settings stay in your browser on this computer and are removed when you uninstall
• A search goes straight from your browser to the engine you picked, the same as typing it in the address bar

Full policy: https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md

Works in Chromium-based browsers such as Chrome, Edge and Brave.

Source code: https://github.com/ike-V/new-tab-home
```

**Privacy practices tab**
- Single purpose: `Replace the New Tab page with a clock, search bar, and local-folder wallpaper.`
- Permission `search`: `Used to run searches from the new tab page with the browser's default search engine via chrome.search.query, so the user's search-engine choice is respected.`
- Host permissions: none · Remote code: No (all JavaScript is bundled) · Data usage: leave every checkbox unchecked
- Certifications: check all three
- Privacy policy URL: above

**Distribution:** Public, all regions, free.

## Microsoft Edge Add-ons

Partner Center ▸ Edge ▸ New extension ▸ upload `new-tab-home.zip`.

**Category:** Productivity · **Logo:** `store-logo-300x300.png` · **Screenshots:** 1280×800 · **Support contact / website:** GitHub URLs above

**Description:** the Chrome description above, with the closing line replaced by:

```
Made for Microsoft Edge. Also works in other Chromium-based browsers such as Chrome and Brave.
```

**Search terms** (up to 7): `new tab`, `wallpaper`, `clock`, `search bar`, `custom new tab`, `start page`, `homepage`

**Notes for certification:**

```
No account or login is needed. Open a new tab to see the extension. The gear button (top right) opens the wallpaper buttons: add images (or drag image files onto the page), show another, remove, and hide or show the clock and the search bar. The icon at the right of the search bar picks the search engine. The only permission, "search", runs searches with the browser's default search engine. The extension makes no network requests of its own and has no remote code.
```

## Firefox Add-ons (AMO)

addons.mozilla.org ▸ Developer Hub ▸ Submit a New Add-on ▸ On this site ▸ upload `new-tab-home-firefox.zip`.

**Name:** New Tab Home ~/ · **Categories:** Tabs, Appearance · **License:** All Rights Reserved · **Privacy policy:** URL above · **Support site / email:** GitHub issues URL

**Summary** (170/250):

```
A new tab that is truly yours: a clock, a search bar, and a wallpaper picked at random from your own images. No accounts, no tracking, and no network requests of its own.
```

**Description:**

```
· NO ACCOUNTS · NO TRACKING · NO ADS
· NO SERVERS · NO NETWORK REQUESTS
· NO ACCESS TO TABS, HISTORY, DOWNLOADS OR COOKIES

"New Tab Home ~/" (~/ short for Home folder) replaces your new tab page with a clock, a search bar, and a wallpaper picked at random from your own images.

Your images never leave your computer.

WALLPAPERS
• Add images from the gear menu, or drag image files onto the page. Every new tab shows a different one
• Recently shown images are skipped, so you don't see the same few over and over
• Refresh to see another, or remove the current one. Remove only deletes the copy the extension holds, never your original files
• Works with common image file types
• Hide the clock, the search bar, or both from the gear menu to see your whole picture
• Firefox doesn't offer folder picking, so wallpapers are added as images

SEARCH
• Uses your browser's default search engine
• Or pick another built-in engine, each with its own pixel-art icon
• The icons are small pixel-art sprites made in PICO-8 and built into the extension, so the sites' favicons don't need to be fetched from the internet
• Add your own search engines with a URL template (put %s where the search goes)
• Type a web address and press Enter to go straight there
• Press / anywhere on the page to jump to the search bar

PRIVACY AND PERMISSIONS
• One permission: "search", used only to run your search through your browser's default search engine
• It does not ask to read or change any website, and it cannot see your tabs, history, bookmarks, downloads or cookies
• No account, no login, no server, no analytics, no ads. Nothing is synced
• No remote code. Everything it runs is inside the package, as plain readable code
• It makes no network requests of its own
• Your images are read in your browser and never uploaded. Images you add are copied into the extension's own storage on this computer
• Your settings stay in your browser on this computer and are removed when you uninstall
• A search goes straight from your browser to the engine you picked, the same as typing it in the address bar

Source code: https://github.com/ike-V/new-tab-home
```

**Release notes:**

```
First Firefox release. Pixel-art search engine icons, a glass-and-outline look, a rounded clock, and a search bar that names the active engine.
```

**Notes to reviewer:**

```
No build step: the package is the plain source (manifest.json, index.html, app.js, icons). app.js is not minified. The "search" permission is used only for browser.search.search with disposition CURRENT_TAB when the user picks "Browser default". Wallpaper images stay in the extension's IndexedDB; nothing is sent anywhere, and there are no network requests. data_collection_permissions is "none". To test: open a new tab; the gear (top right) adds images and hides or shows the clock and search bar; the icon at the right of the search bar picks the engine.
```

## Submission checklist

- Bump `version` in `manifest.json`; rebuild both ZIPs after any change to `manifest.json`, `index.html`, `app.js` or `icons/`.
- Pay the one-time $5 Chrome developer fee and enable 2-step verification. Edge and Firefox are free.
- `manifest.json` keeps the Chrome store's public `key`, so unpacked copies get the store ID (`milkcimjhceibipjhmcobjahhhkmjehc`) and can't sit next to the store copy. Both ZIPs leave it out.
- The Firefox add-on ID (`new-tab-home@ike-v.github.io`) is permanent once published.
- Test the Firefox ZIP in `about:debugging` before submitting.
