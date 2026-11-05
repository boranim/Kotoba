/**
 * Kotoba KanjiVG asset synchronization.
 * Run in your Kotoba root: node restore-kotoba-kanji.cjs
 * Optional preview: node restore-kotoba-kanji.cjs --dry-run
 * KanjiVG is licensed CC BY-SA 3.0; see kanji/KANJIVG-ATTRIBUTION.txt.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const DIR = path.join(ROOT, 'kanji');
const dryRun = process.argv.includes('--dry-run');
if (!fs.existsSync(path.join(ROOT, 'index.html')) || !fs.existsSync(path.join(DATA,'lessons.json'))) {
  console.error('Missing index.html or data/lessons.json: place this script in the Kotoba root folder.');
  process.exit(1);
}
function readJson(filename) { return JSON.parse(fs.readFileSync(filename,'utf8')); }
function kanjiChars(value) {
  if (typeof value !== 'string') return [];
  return [...value].filter(c => /[\p{Script=Han}]/u.test(c));
}
function filename(c) { return c.codePointAt(0).toString(16).padStart(5,'0')+'.svg'; }
const lessonNames = readJson(path.join(DATA,'lessons.json'));
if (!Array.isArray(lessonNames)) throw new Error('data/lessons.json must contain an array of filenames.');
const chars = new Set();
for (const lessonName of lessonNames) {
  if (!/^w\d+d\d+\.json$/.test(lessonName)) throw new Error(`Invalid lesson name: ${lessonName}`);
  const lesson = readJson(path.join(DATA,lessonName));
  for (const family of lesson.families || []) {
    for (const key of ['id','base']) for (const c of kanjiChars(family[key])) chars.add(c);
    for (const variant of family.characters || []) for (const c of kanjiChars(variant)) chars.add(c);
  }
  for (const word of lesson.words || []) {
    for (const key of ['kanji','word']) for (const c of kanjiChars(word[key])) chars.add(c);
  }
}
const files = [...chars].map(filename).sort();
const present = name => {
  try { const text = fs.readFileSync(path.join(DIR,name),'utf8'); return /<svg\b/.test(text) && /<path\b/.test(text); }
  catch { return false; }
};
function download(url, redirects=0) {
  return new Promise((resolve,reject) => {
    const req=https.get(url,{headers:{'User-Agent':'Kotoba-KanjiVG-Lesson-Sync/1.0'},timeout:18000},response=>{
      if ([301,302,303,307,308].includes(response.statusCode) && response.headers.location && redirects<5) {
        response.resume(); return resolve(download(new URL(response.headers.location,url).href,redirects+1));
      }
      if(response.statusCode!==200){response.resume();return reject(new Error(`HTTP ${response.statusCode}`));}
      const chunks=[];let size=0;
      response.on('data',chunk=>{size+=chunk.length;if(size>2_000_000){response.destroy(new Error('SVG too large'));return;}chunks.push(chunk);});
      response.on('end',()=>resolve(Buffer.concat(chunks).toString('utf8')));
      response.on('error',reject);
    });
    req.on('timeout',()=>req.destroy(new Error('Network timeout'))).on('error',reject);
  });
}
function saveManifest() {
  const available=files.filter(present);
  fs.writeFileSync(path.join(DIR,'manifest.json'), JSON.stringify(available,null,2)+'\n');
  return available.length;
}
async function main(){
  fs.mkdirSync(DIR,{recursive:true});
  const missing=files.filter(name=>!present(name));
  console.log(`Lessons: ${lessonNames.length} | unique kanji: ${files.length} | already available: ${files.length-missing.length} | missing: ${missing.length}`);
  if(dryRun){console.log('Missing SVGs (first 35):',missing.slice(0,35).join(', '));return;}
  let done=0,failed=[];
  // Limited concurrency, gentle to the upstream repository.
  let next=0;
  const workers=Array.from({length:Math.min(4,missing.length)},async()=>{
    while(next<missing.length){
      const name=missing[next++];
      try{
        const svg=await download(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${name}`);
        if(!/<svg\b/.test(svg)||!/<path\b/.test(svg)||!/kvg:/.test(svg)) throw new Error('Not a KanjiVG SVG');
        fs.writeFileSync(path.join(DIR,name),svg,'utf8');
        done++;
      }catch(err){failed.push(`${name}: ${err.message}`);}
    }
  });
  await Promise.all(workers);
  const count=saveManifest();
  const attribution=path.join(DIR,'KANJIVG-ATTRIBUTION.txt');
  fs.writeFileSync(attribution,'KanjiVG (Kanji Vector Graphics)\nCopyright Ulrich Apel and KanjiVG contributors.\nSource: https://github.com/KanjiVG/kanjivg\nLicense: CC BY-SA 3.0 https://creativecommons.org/licenses/by-sa/3.0/\nSVGs downloaded by Kotoba; original KanjiVG artwork remains under its source license.\n');
  console.log(`Done: ${done} downloaded, ${count} present, ${failed.length} failed. Manifest: kanji/manifest.json`);
  if(failed.length){console.error('Failures:\n'+failed.slice(0,25).join('\n'));if(failed.length>25)console.error(`...and ${failed.length-25} more`);process.exitCode=1;}
  console.log('After downloading, restart the server and refresh the browser. For offline use, reload once while online.');
}
main().catch(err=>{console.error(err);process.exitCode=1;});
