const CACHE='karty-8dd44686';
const CORE=['./','index.html','manifest.webmanifest','xlsx.full.min.js','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  const same=u.origin===self.location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  if(same&&(r.mode==='navigate'||u.pathname.endsWith('/index.html'))){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.mode==='navigate'?'index.html':r,cp));return res;}).catch(()=>caches.match(r.mode==='navigate'?'index.html':r).then(x=>x||caches.match('./'))));return;}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));
});
