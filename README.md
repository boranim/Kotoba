# Kotoba — standalone recovery

This project restores the published **Kotoba · Japanese Study** frontend from browser-captured files. It does not require ChatGPT Sites, Work, or Codex.

## Run

Requires Python 3. From this directory:

```bash
python -m http.server 8000
```

Open http://localhost:8000 in Chrome. **Do not open index.html as a file:** the app requires HTTP for modules, IndexedDB, and the service worker.

## Project layout

- `index.html` — newly reconstructed page entry point.
- `assets/index-DIHk88xe.js` — original compiled React application bundle, preserved unchanged.
- `assets/index-BJ2mNG6s.css` — original production stylesheet, preserved unchanged.
- `sw.js` — rewritten service worker to cache only recovered files (original would fail because assets were missing).
- `manifest.webmanifest`, `icon.svg` — replacement PWA metadata and icon.
- `kanji/` — 5 SVG diagrams recovered from the rendered HTML snapshot.
- `reference/` — readable (equivalent) CSS and static HTML snapshot for inspection, not loaded by the app.

## Known limitations

- The original React/TypeScript source files and build configuration were not available. The compiled JavaScript is usable but difficult to maintain. Rebuilding into readable React source is a separate task.
- The old service worker lists 70+ diagrams, but only 5 diagram files could be recovered from the uploaded snapshot. The app already has a fallback kanji glyph for missing diagrams.
- Browser IndexedDB data belongs to the browser origin. A new localhost origin will not automatically inherit study progress from the published app. Export/import study data using the app if available.
- Original icon PNGs were not provided; a replacement vector icon is supplied.
- Keep an independent backup before importing or editing study data.
