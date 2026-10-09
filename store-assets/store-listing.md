# Chrome Web Store listing

## Store listing tab

**Name:** New Tab ~/ (from manifest)

**Summary** (manifest description, 109/132):
A custom New Tab page: clock, multi-engine search, and a wallpaper that rotates through a local image folder.

**Category:** Productivity

**Language:** English

**Description:**

```
Got a folder full of wallpapers you never see? New Tab ~/ puts them on your new tab page: pick a folder once, and every new tab shows a different image, with a clock and a search bar on top.

Your images never leave your computer. There are no accounts, no tracking, and no ads.

FEATURES
• Wallpapers from your own folder, with recently shown images skipped so you don't see the same few over and over
• "Allow on every visit" keeps the folder available across restarts
• Search with your browser's default engine, or pick from the various built-in engine options
• Add your own search engines with a URL template
• Press / anywhere on the page to focus the search bar

PRIVACY
The extension has no server, no analytics, and no remote code. Searches go straight to the engine you choose. The only network requests it makes are favicon lookups for the built-in engines in the picker. Full policy: https://github.com/ike-V/new-tab-home/blob/main/PRIVACY.md

Open source (MIT): https://github.com/ike-V/new-tab-home
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
  `zip -r store-assets/new-tab-home.zip manifest.json index.html app.js icons -x "*.DS_Store"`
- Bump `version` in `manifest.json` for each update.
- Optionally pin the extension ID by adding a `key` to the manifest (from the store dashboard's package tab).
