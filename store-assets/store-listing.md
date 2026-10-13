# Chrome Web Store listing

## Store listing tab

**Name:** New Tab Home ~/ (from manifest)

**Summary** (manifest description, 109/132):
A custom New Tab page: clock, multi-engine search, and a wallpaper that rotates through a local image folder.

**Category:** Productivity

**Language:** English

**Description:**

```
A new tab that is truly yours.

Got a folder full of wallpapers you never see?
Now you will, every time you open a new tab.
"New Tab Home ~/" (~/ short for Home folder) replaces your new tab page with a clock, a search bar, and a wallpaper picked at random from a folder of your own images.

Your images never leave your computer.

 -No accounts, no tracking, no ads-

WALLPAPERS
• Choose a folder once. Every new tab / refresh shows a different image

• Recently shown images are skipped, so you don't see the same few over and over

• Choose "Allow on every visit" and the folder stays available after you restart your browser

• The gear button opens a small menu: add images, refresh, or remove the current wallpaper image

• Drag image files onto the page to add them to the rotation

• Remove only deletes the copy the extension holds, never your original files. Images from your folder can't be removed this way; delete the file from the folder instead

• No folder access? Some browsers turn it off, and touch devices work differently. Add images directly instead

• Works with common image file types


SEARCH
• Uses your browser's default search engine
• Or pick another built-in engine
• Add your own search engines with a URL template (put %s where the search goes)
• Type a web address and press Enter to go straight there
• Press / anywhere on the page to jump to the search bar

PRIVACY
Your images are read in your browser and never uploaded. The extension has no server, no analytics, and no remote code. Searches go straight to the engine you choose. It makes no network requests of its own. It asks for one permission, "search", so it can use your browser's default search engine. Full policy: https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md

Works in Chromium-based browsers such as Chrome, Edge and Brave.

Source code: https://github.com/ike-V/new-tab-home
```

**Graphics:**
- Icon 128×128: `icons/icon128.png` (inside the ZIP)
- Screenshots 1280×800: `screenshots/screenshot*.jpg` (local, git-ignored)
- Small promo tile 440×280: `store-assets/promo-tile-440x280.png`

## Privacy practices tab

**Single purpose:**
Replace the New Tab page with a clock, search bar, and local-folder wallpaper.

**Permission justification: `search`:**
Used to run searches from the new tab page with the browser's default search engine via `chrome.search.query`, so the user's search-engine choice is respected.

**Host permissions:** none requested.

**Remote code:** No, I am not using remote code. All JavaScript is bundled in the extension package.

**Data usage:** leave every collection checkbox unchecked (no personally identifiable information, health, financial, authentication, personal communications, location, web history, user activity, or website content is collected).

**Certifications** (check all three):
- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL:**
https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md
(must be pushed to `main` before submitting)

## Distribution tab

- Visibility: Public
- Regions: all
- Pricing: free

## Submission checklist

- Pay the one-time $5 developer fee and enable 2-step verification on the account.
- Upload `store-assets/new-tab-home.zip`.
- Rebuild the ZIP after any change to `manifest.json`, `index.html`, `app.js`, or `icons/`:
  `python3 store-assets/build_zip.py` (leaves the manifest's `key` out of the package).
- Bump `version` in `manifest.json` for each update.
- `manifest.json` keeps the store's public `key`, so unpacked copies get the store ID (`milkcimjhceibipjhmcobjahhhkmjehc`). An unpacked copy and the store copy can't be installed in one browser together.
