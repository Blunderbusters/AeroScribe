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

## Access codes

The app opens to a lock screen. Codes live in `index.html` as salted SHA-256
hashes in the `ACCESS_CODES` list near the top of the script, each with a label
saying who it was issued to.

- **Add a code:** Files › Access codes › Make a new code. Paste the generated
  line into `ACCESS_CODES` and upload `index.html` again.
- **Revoke a code:** delete its line and upload again. Anyone holding it gets
  the lock screen the next time the app loads, because a saved unlock is
  re-checked against the current list on every start.
- **Force periodic re-entry:** set `ACCESS_DAYS` to a number of days. `0`
  means a device stays unlocked.

This keeps casual visitors out of a public URL. It is not real security: the
page is delivered to the browser, so someone technical can read around it.
Anything genuinely confidential needs a server, which this app deliberately
does not have.

## Google Drive

Files › Google Drive backs each inspection up to a Drive folder called
**Condition Inspection Log**. One file per inspection, photos included;
backing the same job up again replaces its file rather than piling up copies.
Restore merges by timestamp — whichever copy was edited most recently wins.

The Google app ID is built into `index.html`, so there is nothing to set up —
press **Connect**, sign in, approve the Drive permission. Google shows an
"unverified app" warning for small apps: Advanced, then Continue.

Two conditions apply to that built-in ID:

- It only works from the web address registered on the Google Cloud OAuth
  client (Authorized JavaScript origins). Serving the app from a different
  address needs either that address added to the client, or a different client
  ID pasted into Files › Google Drive › Advanced.
- Until the OAuth consent screen is switched from Testing to **Published**,
  only accounts added as test users can authorize. Publishing does not require
  Google verification review, because the app only asks for the non-sensitive
  `drive.file` scope.

The scope requested is `drive.file`, which means the app can only see files it
created itself. It cannot read anything else in the Drive.

## Backups

Files tab → Export. The exported JSON contains the photos, so it is the
portable copy of a job and the way to move one between devices.
