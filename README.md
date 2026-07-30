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
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Publishing on GitHub Pages

1. Create a new **public** repository.
2. Upload every file above to the repository root.
3. Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait about a minute, then open `https://<user>.github.io/<repo>/`.
5. On the phone: Safari → Share → **Add to Home Screen**.

All paths in the app are relative, so serving from a subfolder works without changes.

## Updating

Commit the new `index.html`, then bump the cache name in `sw.js`
(`const CACHE = "insp-v1"` → `"insp-v2"`). Installed phones pick up the new
version on their next launch. Inspection data is untouched by updates.

## Backups

Files tab → Export. The exported JSON contains the photos, so it is the
portable copy of a job and the way to move one between devices.
