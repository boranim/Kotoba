Kotoba GitHub Pages PWA install fix v9

Replace ONLY these files in your repository root:
  manifest.webmanifest
  sw.js
  icons/icon-192.png
  icons/icon-512.png

Do not change index.js, theme CSS or lesson JSON.
Publish changes to GitHub Pages, open /Kotoba/ in Chrome on Android, refresh and try Chrome menu > Add to Home screen > Install.
If the icon files give 404, upload the icons/ folder to the repository root.
IMPORTANT: sw.js assumes your existing assets/index.js, assets/index.css, assets/kotoba-bright-theme.css, assets/themes.css, icon.svg, data/lessons.json and lesson JSONs exist.
