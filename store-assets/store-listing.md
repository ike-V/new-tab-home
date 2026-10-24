# Store listings

Build both ZIPs first: `python3 store-assets/build_zip.py`
- `new-tab-home.zip`: Chrome Web Store and Edge Add-ons
- `new-tab-home-firefox.zip`: Firefox Add-ons

Shared assets: icon `icons/icon128.png` (in this repo). Everything else lives outside the repo in `~/Projects/NTH-Assets/`: screenshots `screenshots/screenshot-store-1..4-*.png` (1280×800; #4 is `store/icons-names-1280x800.png`), Edge logo `store/store-logo-300x300.png`, small promo tile `store/promo-tile-440x280.png`, marquee `store/marquee-tile-1400x560.png` (sources: the `.html` files next to them).
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

addons.mozilla.org ▸ Developer Hub ▸ New Tab Home ~/ ▸ Upload New Version ▸ upload `new-tab-home-firefox.zip`. (A first submission is Submit a New Add-on ▸ On this site.)

**Name:** New Tab Home ~/ · **Categories:** Tabs, Appearance · **License:** All Rights Reserved · **Privacy policy:** URL above · **Support site / email:** GitHub issues URL

**Summary** (104/250, the manifest description plus the two privacy words):

```
A new tab that is truly yours: your own wallpapers, a clock, and a search bar. No accounts, no tracking.
```

**Description:**

```
· NO ACCOUNTS · NO TRACKING · NO ADS
· NO SERVERS · NO NETWORK REQUESTS
· NO ACCESS TO TABS, HISTORY, DOWNLOADS OR COOKIES

Got a folder full of wallpapers you never see?
Select them all once, and you'll see them every time you open a new tab.
"New Tab Home ~/" (~/ short for Home folder) replaces your new tab page with a clock, a search bar, and a wallpaper picked at random from your own images.

Your images never leave your computer.

WALLPAPERS
• Add images from the gear menu: select as many as you like at once, a whole folder's worth if you want. You can also drag image files onto the page
• Every new tab shows a different one, and recently shown images are skipped so you don't see the same few over and over
• The gear menu can also refresh to another image, remove the current one, or hide the clock and the search bar to see your whole picture
• Remove only deletes the copy the extension holds, never your original files
• Works with common image file types
• Firefox doesn't offer folder picking, so wallpapers are added as images

SEARCH
• Uses your browser's default search engine
• Or pick another built-in engine, each with its own pixel-art icon
• The icons are small pixel-art sprites made in PICO-8 and built into the extension, so the sites' favicons don't need to be fetched from the internet
• Add your own search engines with a URL template (put %s where the search goes)
• Type a web address and press Enter to go straight there
• Press / anywhere on the page to jump to the search bar

USE IT AS YOUR HOME PAGE TOO (OPTIONAL)
Firefox's Homepage menu has no entry for extensions, but it accepts the extension's own address:
1. Open about:debugging#/runtime/this-firefox, find New Tab Home ~/, and copy its Internal UUID
2. Open Settings, then Home and startup. Under Homepage and new windows, choose Custom URLs
3. Enter moz-extension://YOUR-UUID/index.html, with your Internal UUID in place of YOUR-UUID, and click Add address
4. The Home button and new windows now open the extension
The UUID belongs to your Firefox profile, so it is different on every computer.

PRIVACY AND PERMISSIONS
• One permission: "search", used only to run your search through your browser's default search engine
• It does not ask to read or change any website, and it cannot see your tabs, history, bookmarks, downloads or cookies
• No account, no login, no server, no analytics, no ads. Nothing is synced
• No remote code. Everything it runs is inside the package, as plain readable code
• It makes no network requests of its own
• Your images are read in your browser and never uploaded. Images you add are copied into the extension's own storage on this computer
• Your settings stay in your browser on this computer and are removed when you uninstall
• A search goes straight from your browser to the engine you picked, the same as typing it in the address bar

Works in Firefox 140 or newer on desktop. Firefox for Android doesn't allow custom new tab pages.

Full policy: https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md

Source code: https://github.com/ike-V/new-tab-home
```

**Release notes:**

```
Version 1.0.3

• New: two buttons in the gear menu hide or show the clock and the search bar, so you can see your whole picture. Your choice is remembered
• The magnifier, gear and wallpaper buttons now use the same dark glass as the search bar
• Optional: use it for the Home button too. The steps are at the end of the description
```

**Notes to reviewer:**

```
Update from 1.0.2. No build step and no source code upload needed: the package is the plain source (manifest.json, index.html, app.js, icons/*.png), not minified or generated at upload time.

Changes since 1.0.2:
• Two new buttons in the gear menu (index.html, app.js) hide or show the clock and the search bar. The choice is saved in localStorage ("hideClock" and "hideSearch").
• The toolbar buttons use the same background colour as the search bar (CSS only).
• Short label comments were added to app.js and index.html.
• manifest.json: only the version number changed. No new permissions.
```

## Submission checklist

- Bump `version` in `manifest.json`; rebuild both ZIPs after any change to `manifest.json`, `index.html`, `app.js` or `icons/`.
- Pay the one-time $5 Chrome developer fee and enable 2-step verification. Edge and Firefox are free.
- `manifest.json` keeps the Chrome store's public `key`, so unpacked copies get the store ID (`milkcimjhceibipjhmcobjahhhkmjehc`) and can't sit next to the store copy. Both ZIPs leave it out.
- The Firefox add-on ID (`new-tab-home@ike-v.github.io`) is permanent once published.
- Test the Firefox ZIP in `about:debugging` before submitting.
