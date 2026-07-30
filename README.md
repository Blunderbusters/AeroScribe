# Condition Inspection Log

Single-page app for documenting aircraft annual and condition inspections:
pre-work walkaround photos, a checklist built from the Team Rocket F1 ICA
inspection table merged with 14 CFR part 43 appendix D, owner requests,
squawks with estimates, recurring inspection and AD/SB tracking, an owner
report, and airframe / engine / propeller logbook entries sized for stickers.

Runs entirely in the browser. Inspection data is stored on the device in
IndexedDB (localStorage fallback); nothing is sent anywhere.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole application |
| `manifest.webmanifest` | Home-screen install metadata |
| `sw.js` | Service worker — caches the app shell for offline use |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Icons |
| `version.json` | The version the app checks itself against |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Publishing on GitHub Pages

1. Create a new **public** repository.
2. Upload every file above to the repository root.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait about a minute, then open `https://<user>.github.io/<repo>/`.
5. On the phone: Safari → Share → **Add to Home Screen**.

All paths in the app are relative, so serving from a subfolder works without changes.

## Updating

Three numbers have to match, and they all live at the top of their files:

1. `index.html` — `const APP_VERSION = "1.5.0"`
2. `version.json` — `"version": "1.5.0"`
3. `sw.js` — `const CACHE_VERSION = "1.5.0"`

To publish an update, commit the new `index.html` with a higher `APP_VERSION`,
and raise the other two to the same number. Put a short line in the `notes`
field of `version.json` — the app shows it to you when it finds the update.

Installed devices check `version.json` on launch and roughly every half hour
when you come back to the app. Out of date shows red with an **Install update**
button; current shows green. Inspection data is never touched by an update —
only the program is replaced.

## Reading screenshots (OCR)

Parts prices and receipt totals can be read straight off a screenshot. The OCR
engine is Tesseract compiled to WebAssembly and runs entirely in the browser —
no image ever leaves the device.

By default the engine downloads once from a CDN and is then cached by the
service worker, so it keeps working with no signal. For a hangar with no
internet at all, put the engine in the repository instead: create a `vendor`
folder next to `index.html` containing

    vendor/tesseract.min.js
    vendor/worker.min.js
    vendor/tesseract-core.wasm.js
    vendor/tesseract-core-simd.wasm.js
    vendor/tesseract-core-lstm.wasm.js
    vendor/tesseract-core-simd-lstm.wasm.js
    vendor/eng.traineddata.gz

The first two come from `https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/`,
the four core files from `https://cdn.jsdelivr.net/npm/tesseract.js-core@5/`,
and the language file from
`https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz`.

Roughly 20 MB in total. The app checks for `vendor/tesseract.min.js` on
startup and prefers the local copy when it is there. Files › OCR engine shows
which source is in use.

## Google Drive

Files › Google Drive backs each inspection up to a Drive folder called
**Condition Inspection Log**. One file per inspection, photos included;
backing the same job up again replaces its file rather than piling up copies.
Restore merges by timestamp — whichever copy was edited most recently wins.

Google requires a one-time client ID before a web page may touch Drive:

1. console.cloud.google.com → create a project.
2. APIs & Services → Library → enable **Google Drive API**.
3. APIs & Services → Credentials → Create credentials → **OAuth client ID** →
   Web application.
4. Authorized JavaScript origins → add the exact address the app is served
   from, e.g. `https://<user>.github.io` (origin only, no path).
5. OAuth consent screen → add yourself as a test user, or publish the app.
6. Paste the client ID into Files › Google Drive › Set up.

The scope requested is `drive.file`, which means the app can only see files it
created itself. It cannot read anything else in the Drive.

## Backups

Files tab → Export. The exported JSON contains the photos, so it is the
portable copy of a job and the way to move one between devices.
