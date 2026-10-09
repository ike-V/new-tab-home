(function(){

  /* ---------- storage helpers (fail gracefully if storage is blocked) ---------- */
  function lsGet(key){ try{ return localStorage.getItem(key); }catch{ return null; } }
  function lsSet(key,val){ try{ localStorage.setItem(key,val); }catch{} }

  const DB_NAME = 'ht-homepage', STORE = 'kv';
  function idb(){
    return new Promise((resolve, reject)=>{
      try{
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = ()=> req.result.createObjectStore(STORE);
        req.onsuccess = ()=> resolve(req.result);
        req.onerror = ()=> reject(req.error);
      }catch(e){ reject(e); }
    });
  }
  async function idbGet(key){
    try{
      const db = await idb();
      return await new Promise((resolve,reject)=>{
        const tx = db.transaction(STORE,'readonly');
        const r = tx.objectStore(STORE).get(key);
        r.onsuccess = ()=> resolve(r.result);
        r.onerror = ()=> reject(r.error);
      });
    }catch(e){ return null; }
  }
  async function idbSet(key,val){
    try{
      const db = await idb();
      return await new Promise((resolve,reject)=>{
        const tx = db.transaction(STORE,'readwrite');
        tx.objectStore(STORE).put(val,key);
        tx.oncomplete = ()=> resolve();
        tx.onerror = ()=> reject(tx.error);
      });
    }catch(e){ }
  }
  async function idbAdd(storeKeyPrefix, val){
    const key = storeKeyPrefix + ':' + Date.now() + ':' + Math.random().toString(36).slice(2);
    await idbSet(key, val);
    return key;
  }
  async function idbAllKeysWithPrefix(prefix){
    try{
      const db = await idb();
      return await new Promise((resolve,reject)=>{
        const tx = db.transaction(STORE,'readonly');
        const req = tx.objectStore(STORE).getAllKeys();
        req.onsuccess = ()=> resolve(req.result.filter(k=>k.startsWith(prefix)));
        req.onerror = ()=> reject(req.error);
      });
    }catch(e){return []; }
  }

  /* ---------- clock ---------- */
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');
  function tick(){
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    dateEl.textContent = now.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'});
  }
  tick(); setInterval(tick, 1000*10);

  /* ---------- search ---------- */
  const ENGINES = {
    google:      {name:'Google',       url:'https://www.google.com/search?q='},
    bing:        {name:'Bing',         url:'https://www.bing.com/search?q='},
    duckduckgo:  {name:'DuckDuckGo',   url:'https://duckduckgo.com/?q='},
    brave:       {name:'Brave Search', url:'https://search.brave.com/search?q='},
    startpage:   {name:'Startpage',    url:'https://www.startpage.com/do/search?q='},
    wikipedia:   {name:'Wikipedia',    url:'https://en.wikipedia.org/w/index.php?search='},
    reddit:      {name:'Reddit',       url:'https://www.reddit.com/search/?q='},
    youtube:      {name:'YouTube',       url:'https://www.youtube.com/results?search_query='},
    youtubemusic: {name:'YouTube Music', url:'https://music.youtube.com/search?q='},
    wallhaven:    {name:'Wallhaven',     url:'https://wallhaven.cc/search?q='},
  };

  let currentEngine = lsGet('engine') || 'google';
  const engineToggle = document.getElementById('engine-toggle');
  const engineMenu = document.getElementById('engine-menu');

  function updateEngineToggleIcon(){
    engineToggle.innerHTML = `<img src="${faviconFor(ENGINES[currentEngine].url)}" alt="${ENGINES[currentEngine].name}">`;
  }
  function renderEngineMenu(){
    engineMenu.innerHTML = '';
    Object.entries(ENGINES).forEach(([key, val])=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.innerHTML = `<img src="${faviconFor(val.url)}"> ${val.name}`;
      btn.addEventListener('click', ()=>{
        currentEngine = key;
        lsSet('engine', currentEngine);
        updateEngineToggleIcon();
        engineMenu.classList.remove('open');
      });
      engineMenu.appendChild(btn);
    });
  }
  renderEngineMenu();
  updateEngineToggleIcon();

  function positionEngineMenu(){
    const formRect = document.getElementById('search-form').getBoundingClientRect();
    const spaceBelow = window.innerHeight - formRect.bottom - 8;
    const spaceAbove = formRect.top - 8;
    if(spaceBelow < engineMenu.scrollHeight && spaceAbove > spaceBelow){
      engineMenu.classList.add('flip-up');
    } else {
      engineMenu.classList.remove('flip-up');
    }
  }
  engineToggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    const opening = !engineMenu.classList.contains('open');
    engineMenu.classList.toggle('open');
    if(opening) positionEngineMenu();
  });
  document.addEventListener('click', (e)=>{
    if(!engineMenu.contains(e.target) && e.target !== engineToggle){
      engineMenu.classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') engineMenu.classList.remove('open');
  });

  document.getElementById('search-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = document.getElementById('search').value.trim();
    if(!q) return;
    // allow typing a bare URL
    if(/^https?:\/\//i.test(q)){
      location.href = q;
    } else if(/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) && !q.includes(' ')){
      location.href = 'https://' + q;
    } else {
      location.href = ENGINES[currentEngine].url + encodeURIComponent(q);
    }
  });

  /* ---------- favicon helper ---------- */

  function faviconFor(url){
    try{
      const u = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
    }catch{ return ''; }
  }

  /* ---------- wallpaper ---------- */
  const bgEl = document.getElementById('bg');
  const fallbackNote = document.getElementById('bg-fallback-note');
  const IMG_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;
  let currentObjectUrl = null;
  let dirHandle = null;
  let needsReconnect = false;

  function setBackground(url){
    bgEl.style.backgroundImage = `url("${url}")`;
  }

  function showCachedInstantly(){
    const cached = lsGet('lastWallpaperDataUrl');
    if(cached) setBackground(cached);
  }

  async function cacheAsDataUrl(blob){
    if(blob.size > 4*1024*1024) return;
    const reader = new FileReader();
    return new Promise(resolve=>{
      reader.onload = ()=>{
        lsSet('lastWallpaperDataUrl', reader.result);
        resolve();
      };
      reader.readAsDataURL(blob);
    });
  }

  const RECENT_WALLPAPER_CAP = 20;

  function pickAvoidingRecent(items, keyFn){
    const recent = JSON.parse(lsGet('recentWallpapers') || '[]');
    const cap = Math.min(RECENT_WALLPAPER_CAP, items.length - 1);
    const avoid = new Set(cap > 0 ? recent.slice(-cap) : []);
    const pool = items.filter(item => !avoid.has(keyFn(item)));
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    lsSet('recentWallpapers', JSON.stringify(recent.concat(keyFn(chosen)).slice(-RECENT_WALLPAPER_CAP)));
    return chosen;
  }

  async function pickRandomFromDirHandle(handle){
    const files = [];
    for await (const entry of handle.values()){
      if(entry.kind === 'file' && IMG_RE.test(entry.name)) files.push(entry);
    }
    if(files.length === 0) return false;
    const chosen = pickAvoidingRecent(files, f => f.name);
    const file = await chosen.getFile();
    if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(file);
    setBackground(currentObjectUrl);
    cacheAsDataUrl(file);
    fallbackNote.style.display = 'none';
    return true;
  }

  async function pickRandomFromDroppedPool(){
    const keys = await idbAllKeysWithPrefix('dropped:');
    if(keys.length === 0) return false;
    const key = pickAvoidingRecent(keys, k => k);
    const blob = await idbGet(key);
    if(!blob) return false;
    if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(blob);
    setBackground(currentObjectUrl);
    fallbackNote.style.display = 'none';
    return true;
  }

  async function verifyPermission(handle){
    const opts = {mode:'read'};
    if((await handle.queryPermission(opts)) === 'granted') return true;
    return false;
  }

  const wallpaperInput = document.getElementById('wallpaper-input');
  const useImageChooser = ()=> !('showDirectoryPicker' in window) || matchMedia('(pointer: coarse)').matches;

  async function addImages(fileList){
    const files = Array.from(fileList).filter(f=> f.type.startsWith('image/'));
    if(files.length === 0) return;
    for(const f of files) await idbAdd('dropped', f);
    await pickRandomFromDroppedPool();
  }

  async function initWallpaper(){
    showCachedInstantly();

    if(useImageChooser()){
      fallbackNote.textContent = 'Use the ⛭ button (top right) to choose images, or drag & drop them onto the page.';
      fallbackNote.style.display = 'block';
      await pickRandomFromDroppedPool();
      return;
    }

    const saved = await idbGet('dirHandle');
    if(saved){
      const granted = await verifyPermission(saved);
      if(granted){
        dirHandle = saved;
        const ok = await pickRandomFromDirHandle(dirHandle);
        if(!ok) fallbackNote.style.display = 'block';
        return;
      } else {
        fallbackNote.textContent = 'Wallpaper folder needs permission again — click the ⛭ button (top right).';
        fallbackNote.style.display = 'block';
        dirHandle = saved;
        needsReconnect = true;
      }
    } else {
      const ok = await pickRandomFromDroppedPool();
      if(!ok) fallbackNote.style.display = 'block';
    }
  }
  document.getElementById('wallpaper-btn').addEventListener('click', async ()=>{
    if(useImageChooser()){
      wallpaperInput.click();
      return;
    }
    try{
      if(needsReconnect && dirHandle){
        const perm = await dirHandle.requestPermission({mode:'read'});
        if(perm === 'granted'){
          needsReconnect = false;
          await pickRandomFromDirHandle(dirHandle);
          return;
        }
      }
      const handle = await window.showDirectoryPicker();
      needsReconnect = false;
      await idbSet('dirHandle', handle);
      dirHandle = handle;
      await pickRandomFromDirHandle(handle);
    }catch(err){
      if(err.name !== 'AbortError'){
        fallbackNote.textContent = 'Could not access that folder: ' + err.message;
        fallbackNote.style.display = 'block';
      }
    }
  });

  /* ---------- drag & drop fallback ---------- */
  const dropHint = document.getElementById('drop-hint');
  let dragCounter = 0;
  document.addEventListener('dragenter', (e)=>{
    e.preventDefault(); dragCounter++;
    dropHint.classList.add('show');
  });
  document.addEventListener('dragleave', ()=>{
    dragCounter--; if(dragCounter<=0){ dragCounter=0; dropHint.classList.remove('show'); }
  });
  document.addEventListener('dragover', (e)=> e.preventDefault());
  document.addEventListener('drop', async (e)=>{
    e.preventDefault();
    dragCounter = 0;
    dropHint.classList.remove('show');
    await addImages(e.dataTransfer.files);
  });
  wallpaperInput.addEventListener('change', async ()=>{
    await addImages(wallpaperInput.files);
    wallpaperInput.value = '';
  });

  initWallpaper();

})();
