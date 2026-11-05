/* Kotoba offline cache. Bump VERSION when publishing updated content. */
const VERSION = 'kotoba-phone-kanji-v8';
const CACHE = `${VERSION}-offline`;
const BASE = new URL('./', self.registration.scope);
const STATIC = ['./','./index.html','./manifest.webmanifest',
  './assets/index.js','./assets/index.css',
  './assets/kotoba-bright-theme.css','./assets/themes.css','./icon.svg','./data/lessons.json']
  .map(path=>new URL(path,BASE).href);
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(STATIC);
    const listResponse=await cache.match(new URL('./data/lessons.json', BASE).href);
    const names=await listResponse.json();
    await cache.addAll(names.map(name=>new URL(`./data/${name}`,BASE).href));
    // KanjiVG downloads are managed in IndexedDB by assets/index.js.
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin || !url.pathname.startsWith(BASE.pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)))}
      return response;
    }).catch(()=>caches.match(new URL('./index.html',BASE).href)));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)))}
    return response;
  })));
});
