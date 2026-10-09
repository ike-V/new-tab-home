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
    google:       {name:'Google',        url:'https://www.google.com/search?q=%s'},
    bing:         {name:'Bing',          url:'https://www.bing.com/search?q=%s'},
    duckduckgo:   {name:'DuckDuckGo',    url:'https://duckduckgo.com/?q=%s'},
    brave:        {name:'Brave Search',  url:'https://search.brave.com/search?q=%s'},
    startpage:    {name:'Startpage',     url:'https://www.startpage.com/do/search?q=%s'},
    wikipedia:    {name:'Wikipedia',     url:'https://en.wikipedia.org/w/index.php?search=%s'},
    reddit:       {name:'Reddit',        url:'https://www.reddit.com/search/?q=%s'},
    youtube:      {name:'YouTube',       url:'https://www.youtube.com/results?search_query=%s'},
    youtubemusic: {name:'YouTube Music', url:'https://music.youtube.com/search?q=%s'},
    wallhaven:    {name:'Wallhaven',     url:'https://wallhaven.cc/search?q=%s'},
  };
  const SEARCH_ICON = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="10.5" r="6.5"/><path d="M16 15.5l4.5 4.5"/></svg>');

  const hasBrowserSearch = ()=> typeof chrome !== 'undefined' && !!chrome.search && typeof chrome.search.query === 'function';
  const searchUrl = (template, q)=> template.replace('%s', ()=> encodeURIComponent(q));

  function isValidTemplate(url){
    if(typeof url !== 'string' || url.split('%s').length !== 2) return false;
    try{
      const u = new URL(url.replace('%s', 'x'));
      return u.protocol === 'https:' || u.protocol === 'http:';
    }catch{ return false; }
  }
  function loadCustomEngines(){
    try{
      const list = JSON.parse(lsGet('customEngines') || '[]');
      return Array.isArray(list) ? list.filter(e => e && e.id && typeof e.name === 'string' && e.name && isValidTemplate(e.url)) : [];
    }catch{ return []; }
  }
  function saveCustomEngines(list){ lsSet('customEngines', JSON.stringify(list)); }

  function engineList(){
    const list = [];
    if(hasBrowserSearch()) list.push({key:'default', name:'Browser default', icon:SEARCH_ICON});
    for(const [key, e] of Object.entries(ENGINES)){
      list.push({key, name:e.name, url:e.url, icon:faviconFor(e.url.replace('%s', 'x'))});
    }
    for(const e of loadCustomEngines()){
      list.push({key:'custom:' + e.id, id:e.id, name:e.name, url:e.url, custom:true, icon:null});
    }
    return list;
  }
  const fallbackEngine = ()=> hasBrowserSearch() ? 'default' : 'google';
  let currentEngine = lsGet('engine');
  const activeEngine = ()=>{
    const list = engineList();
    return list.find(e => e.key === currentEngine) || list.find(e => e.key === fallbackEngine());
  };
  currentEngine = activeEngine().key;

  const searchWrap = document.getElementById('search-wrap');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search');
  const engineToggle = document.getElementById('engine-toggle');
  const engineMenu = document.getElementById('engine-menu');

  const makeIcon = src => { const img = document.createElement('img'); img.src = src; img.alt = ''; return img; };
  const avatarHue = name => [...name].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7) % 360;
  const makeAvatar = name => {
    const el = document.createElement('span');
    el.className = 'engine-avatar';
    el.textContent = [...name][0].toUpperCase();
    el.style.background = 'hsl(' + avatarHue(name) + ',55%,42%)';
    return el;
  };
  const engineIcon = e => e.icon ? makeIcon(e.icon) : makeAvatar(e.name);

  const addBtn = document.createElement('button');
  addBtn.type = 'button'; addBtn.className = 'engine-add'; addBtn.textContent = '+ Add search engine';
  const addForm = document.createElement('div');
  addForm.className = 'engine-form'; addForm.hidden = true;
  addForm.innerHTML =
    '<input class="ef-name" type="text" placeholder="Name" maxlength="30" autocomplete="off">' +
    '<input class="ef-url" type="text" placeholder="https://example.com/search?q=%s" autocomplete="off">' +
    '<div class="ef-error" role="alert"></div>' +
    '<div class="ef-actions"><button type="button" class="ef-cancel">Cancel</button><button type="button" class="ef-save">Add</button></div>';
  const nameInput = addForm.querySelector('.ef-name');
  const urlInput = addForm.querySelector('.ef-url');
  const formError = addForm.querySelector('.ef-error');

  function updateEngineToggleIcon(){
    const e = activeEngine();
    engineToggle.replaceChildren(engineIcon(e));
    engineToggle.setAttribute('aria-label', 'Search engine: ' + e.name);
  }
  function renderEngineMenu(){
    const rows = engineList().map(e => {
      const row = document.createElement('div');
      row.className = 'engine-row' + (e.key === currentEngine ? ' active' : '');
      const pick = document.createElement('button');
      pick.type = 'button'; pick.className = 'engine-pick';
      const label = document.createElement('span');
      label.textContent = e.name;
      pick.append(engineIcon(e), label);
      pick.addEventListener('click', ()=>{ selectEngine(e.key); closeEngineMenu(); });
      row.append(pick);
      if(e.custom){
        const rm = document.createElement('button');
        rm.type = 'button'; rm.className = 'engine-remove'; rm.textContent = '×';
        rm.title = 'Remove ' + e.name;
        rm.addEventListener('click', ()=> removeCustomEngine(e));
        row.append(rm);
      }
      return row;
    });
    engineMenu.replaceChildren(...rows, addBtn, addForm);
  }
  function selectEngine(key){
    currentEngine = key;
    lsSet('engine', key);
    updateEngineToggleIcon();
    renderEngineMenu();
  }
  function removeCustomEngine(e){
    saveCustomEngines(loadCustomEngines().filter(x => x.id !== e.id));
    if(currentEngine === e.key) selectEngine(fallbackEngine());
    else renderEngineMenu();
  }

  function closeEngineForm(){
    addForm.hidden = true; addBtn.hidden = false;
    nameInput.value = ''; urlInput.value = ''; formError.textContent = '';
  }
  function closeEngineMenu(){
    engineMenu.classList.remove('open');
    closeEngineForm();
  }
  function positionEngineMenu(){
    const rect = searchWrap.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    engineMenu.classList.toggle('flip-up', spaceBelow < engineMenu.scrollHeight && spaceAbove > spaceBelow);
  }
  function saveEngine(){
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if(!name){ formError.textContent = 'Enter a name.'; nameInput.focus(); return; }
    if(!isValidTemplate(url)){
      formError.textContent = 'Enter an http(s) URL containing %s once, where the search term goes.';
      urlInput.focus();
      return;
    }
    const id = Date.now().toString(36);
    saveCustomEngines(loadCustomEngines().concat({id, name, url}));
    selectEngine('custom:' + id);
    closeEngineMenu();
  }

  addBtn.addEventListener('click', ()=>{
    addBtn.hidden = true; addForm.hidden = false;
    positionEngineMenu();
    nameInput.focus();
  });
  addForm.querySelector('.ef-cancel').addEventListener('click', closeEngineForm);
  addForm.querySelector('.ef-save').addEventListener('click', saveEngine);
  [nameInput, urlInput].forEach(input => input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ e.preventDefault(); saveEngine(); }
  }));
  engineToggle.addEventListener('click', e => {
    e.stopPropagation();
    if(engineMenu.classList.contains('open')){ closeEngineMenu(); return; }
    engineMenu.classList.add('open');
    positionEngineMenu();
  });
  document.addEventListener('click', e => {
    if(!e.composedPath().includes(engineMenu)) closeEngineMenu();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeEngineMenu(); return; }
    if(e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){
      e.preventDefault();
      searchInput.focus();
    }
  });

  function runSearch(q){
    const engine = activeEngine();
    if(engine.key !== 'default'){ location.href = searchUrl(engine.url, q); return; }
    const goGoogle = ()=>{ location.href = searchUrl(ENGINES.google.url, q); };
    try{
      const result = chrome.search.query({text: q, disposition: 'CURRENT_TAB'});
      if(result && typeof result.catch === 'function') result.catch(goGoogle);
    }catch{ goGoogle(); }
  }
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if(!q) return;
    // allow typing a bare URL
    if(/^https?:\/\//i.test(q)){
      location.href = q;
    } else if(/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) && !q.includes(' ')){
      location.href = 'https://' + q;
    } else {
      runSearch(q);
    }
  });

  renderEngineMenu();
  updateEngineToggleIcon();

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
  const noteText = document.getElementById('note-text');
  const noteAction = document.getElementById('note-action');
  function showNote(text, actionLabel){
    noteText.textContent = text;
    noteAction.hidden = !actionLabel;
    noteAction.textContent = actionLabel || '';
    fallbackNote.style.display = 'block';
  }
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
      const ok = await pickRandomFromDroppedPool();
      if(!ok) showNote(
        matchMedia('(pointer: coarse)').matches
          ? 'Pick images to use as your wallpaper.'
          : 'Pick images to use as your wallpaper, or drop them onto the page.',
        'Choose images');
      return;
    }

    const saved = await idbGet('dirHandle');
    if(saved){
      dirHandle = saved;
      if(await verifyPermission(saved)){
        const ok = await pickRandomFromDirHandle(dirHandle);
        if(!ok) showNote('No images found in your wallpaper folder.', 'Choose a different folder');
      } else {
        needsReconnect = true;
        showNote('Wallpaper folder needs permission again.', 'Reconnect folder');
      }
    } else {
      const ok = await pickRandomFromDroppedPool();
      if(!ok) showNote('Choose a folder of images to use as your wallpaper.', 'Choose folder');
    }
  }

  async function chooseWallpaper(){
    if(useImageChooser()){
      wallpaperInput.click();
      return;
    }
    try{
      if(needsReconnect && dirHandle){
        const perm = await dirHandle.requestPermission({mode:'read'});
        if(perm === 'granted'){
          needsReconnect = false;
          if(!(await pickRandomFromDirHandle(dirHandle))) showNote('No images found in your wallpaper folder.', 'Choose a different folder');
          return;
        }
      }
      const handle = await window.showDirectoryPicker();
      needsReconnect = false;
      await idbSet('dirHandle', handle);
      dirHandle = handle;
      if(!(await pickRandomFromDirHandle(handle))) showNote('No images found in that folder.', 'Choose a different folder');
    }catch(err){
      if(err.name !== 'AbortError') showNote('Could not access that folder: ' + err.message, 'Try again');
    }
  }
  document.getElementById('wallpaper-btn').addEventListener('click', chooseWallpaper);
  noteAction.addEventListener('click', chooseWallpaper);

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
