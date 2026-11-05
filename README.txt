KOTOBA PHONE-LOCAL KANJIVG DOWNLOADS — V8

ONLY TWO FILES CHANGED:
  assets/index.js
  sw.js

Copy them to your working Kotoba folder and push both to GitHub.
You can leave kanji/ out of GitHub entirely. No changes to CSS, themes,
index.html, manifest.webmanifest, or lesson JSON files are needed.

On your phone, open Kotoba -> Settings -> Kanji handwriting downloads
-> Download all drawings. The progress shows saved SVGs, and missing drawings
can be retried. Visiting a lesson online also downloads its SVGs.

SVGs are saved in IndexedDB: kotoba-kanjivg-offline-v1 / drawings.
Not accessible from Android's Downloads folder, but located on device storage.
Use Chrome outside Incognito mode. First online visit required.

Official source: https://github.com/KanjiVG/kanjivg
KanjiVG (c) Ulrich Apel. CC BY-SA 3.0.

Note: This preserves the component coloring logic from v7. Drawings
are still subject to the existing component-matching limitations.
Do not clear site data if you want to retain progress or downloaded SVGs.
