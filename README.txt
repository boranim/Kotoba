KOTOBA KANJI FAMILY-COMPONENT COLORING FIX (v7)

Copy only these two files into your EXISTING Kotoba folder:
  assets/index.js
  sw.js

Do not replace your CSS, themes, lesson JSON, or kanji SVG files.
Reload Chrome and update the service worker (Application > Service Workers > Update).
Do not clear site data; it contains local study progress.

W1D1/W1D2 retain the previous colouring logic. For W1D3-W1D7,
KanjiVG component labels are compared across the actual members of each
family. Shared structural strokes stay neutral; differing strokes are
coloured. When a common labelled component cannot be established reliably,
the drawing remains neutral instead of highlighting the entire glyph.

A few families may remain neutral because the available KanjiVG SVGs do not
label their common part identically. The lesson transcriptions still need
proofreading against the textbook.
