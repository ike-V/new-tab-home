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
  async function idbDelete(key){
    try{
      const db = await idb();
      return await new Promise((resolve,reject)=>{
        const tx = db.transaction(STORE,'readwrite');
        tx.objectStore(STORE).delete(key);
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
  /* BEGIN GENERATED ICONS */
const ICON_PALETTE = ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FF6C24", "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"];
const ICON_ART = {
  close: ["00000000", "00000000", "00700700", "00077000", "00077000", "00700700", "00000000", "00000000"],
  bing: ["00000000", "0cc00000", "0cc00000", "0ccccc00", "0cc00cc0", "0cc00cc0", "0ccccc00", "00000000"],
  brave: ["00000000", "99999999", "97999979", "99777799", "99977999", "09999990", "00999900", "00099000"],
  wikipedia: ["07777770", "77777777", "70777707", "70777707", "70700707", "77077077", "77777777", "07777770"],
  youtubemusic: ["08888880", "88878888", "88877888", "88877788", "88877788", "88877888", "88878888", "08888880"],
  google: ["00888880", "08800088", "aa000000", "aa000000", "aa00cccc", "330000cc", "03300033", "00333330"],
  duckduckgo: ["00999900", "09999990", "99977999", "99707799", "99777aa9", "99977999", "09999990", "00999900"],
  startpage: ["07777770", "77111777", "71777177", "71777177", "71777177", "77111777", "77777717", "07777770"],
  reddit: ["00999900", "09799990", "99979999", "97777779", "97977979", "97777779", "09777790", "00999900"],
  youtube: ["00888800", "08878880", "88877888", "88877788", "88877788", "88877888", "08878880", "00888800"],
  wallhaven: ["07777770", "77777717", "77777777", "77777d77", "1777ddd7", "117ddddd", "111ddddd", "0111ddd0"],
};
const ICON_ART16 = {
  remove: ["7700000000000077", "7770000000000777", "0777000000007770", "0077700000077700", "0007770000777000", "0000777007770000", "0000077777700000", "0000007777000000", "0000007777000000", "0000077777700000", "0000777007770000", "0007770000777000", "0077700000077700", "0777000000007770", "7770000000000777", "7700000000000077"],
  refresh: ["0000077777700000", "0007777777777000", "0077700000077700", "0777000000007700", "0770000000007700", "7700000007077700", "7700000007777000", "7700000007770000", "7700000007777000", "7700000000000000", "7700000000000000", "0770000000000000", "0777000000007700", "0077700000077700", "0007777777777000", "0000077777700000"],
  add: ["0777777777777770", "7777777777777777", "7777777777777777", "7777777777700077", "7777777777700077", "7777777777700077", "7777777777777777", "7777777777777777", "7700777777777777", "7000077000777777", "0077000070077777", "0777700777007777", "7777770077700777", "7777777007770077", "7777777777777007", "0777777777777700"],
  gear: ["0000000000000000", "0077000770007700", "0777707777077770", "0777777777777770", "0077777777777700", "0007777007777000", "0077770000777700", "0777700000077770", "0777700000077770", "0077770000777700", "0007777007777000", "0077777777777700", "0777777777777770", "0777707777077770", "0077000770007700", "0000000000000000"],
};
/* END GENERATED ICONS */

  const svgUri = svg => 'data:image/svg+xml,' + encodeURIComponent(svg);
  function pixelSvg(cells, backdrop = '', size = 8){
    const byColour = {};
    for(const [x, y, colour] of cells) (byColour[colour] = byColour[colour] || []).push(`M${x} ${y}h1v1h-1z`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` + backdrop +
      Object.entries(byColour).map(([colour, d]) => `<path fill="${colour}" d="${d.join('')}"/>`).join('') + '</svg>';
  }
  // Glass pixels: each art pixel is a rounded tile with a bevel and a light-to-dark shade.
  const GLASS_DEFS = '<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/>' +
    '<stop offset=".52" stop-color="#000" stop-opacity=".02"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' +
    '<g id="o"><rect width="1" height="1" rx=".18" fill="url(#s)"/>' +
    '<path d="M.08 .84V.22Q.08 .08 .22 .08H.84" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M.92 .14V.78Q.92 .92 .78 .92H.1" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/></g></defs>';
  function glassSvg(cells, backdrop = ''){
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">' + GLASS_DEFS + backdrop +
      cells.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" rx=".18" fill="${c}"/><use href="#o" x="${x}" y="${y}"/>`).join('') + '</svg>';
  }
  const iconMemo = {};
  function iconUri(name, glass = true){
    const key = glass ? name : name + '@flat';
    if(iconMemo[key]) return iconMemo[key];
    const cells = [];
    ICON_ART[name].forEach((row, y) => [...row].forEach((ch, x) => {
      const i = parseInt(ch, 16);
      if(i) cells.push([x, y, ICON_PALETTE[i]]);
    }));
    return (iconMemo[key] = svgUri(glass ? glassSvg(cells) : pixelSvg(cells)));
  }
  function iconUri16(name){
    const key = name + '@16';
    if(iconMemo[key]) return iconMemo[key];
    const cells = [];
    ICON_ART16[name].forEach((row, y) => [...row].forEach((ch, x) => {
      const i = parseInt(ch, 16);
      if(i) cells.push([x, y, ICON_PALETTE[i]]);
    }));
    return (iconMemo[key] = svgUri(pixelSvg(cells, '', 16)));
  }
  document.querySelectorAll('img[data-icon]').forEach(img => {
    const name = img.dataset.icon;
    img.src = name in ICON_ART16 ? iconUri16(name) : iconUri(name);
  });

  const IDENT_COLOURS = [12, 14, 9, 11, 13, 10, 8, 6].map(i => ICON_PALETTE[i]);
  function seededRandom(seed){
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const nameSeed = name => [...name].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);
  const newSeed = () => Math.floor(Math.random() * 1e9) + 1;
  function identiconUri(seed){
    const rand = seededRandom(seed);
    let cells, on;
    do{
      cells = [];
      for(let i = 0; i < 18; i++) cells.push(rand() < 0.45);
      on = cells.filter(Boolean).length;
    }while(on < 6 || on > 10);
    const colour = IDENT_COLOURS[Math.floor(rand() * IDENT_COLOURS.length)];
    const px = [];
    cells.forEach((filled, i) => {
      if(!filled) return;
      const x = i % 3, y = Math.floor(i / 3);
      px.push([1 + x, 1 + y, colour], [6 - x, 1 + y, colour]);
    });
    return svgUri(glassSvg(px, '<path fill="#2A2A28" d="M1 0h6v1h1v6h-1v1H1v-1H0V1h1z"/>'));
  }

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
      list.push({key, name:e.name, url:e.url, icon:iconUri(key)});
    }
    for(const e of loadCustomEngines()){
      list.push({key:'custom:' + e.id, id:e.id, name:e.name, url:e.url, custom:true, icon:identiconUri(Number.isInteger(e.seed) ? e.seed : nameSeed(e.name))});
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
  const engineIcon = e => makeIcon(e.icon);

  const addBtn = document.createElement('button');
  addBtn.type = 'button'; addBtn.className = 'engine-add'; addBtn.textContent = '+ Add search engine';
  const addForm = document.createElement('div');
  addForm.className = 'engine-form'; addForm.hidden = true;
  addForm.innerHTML =
    '<div class="ef-iconrow"><img class="ef-preview" alt=""><button type="button" class="ef-shuffle">Shuffle icon</button></div>' +
    '<input class="ef-name" type="text" placeholder="Name" maxlength="30" autocomplete="off">' +
    '<input class="ef-url" type="text" placeholder="https://example.com/search?q=%s" autocomplete="off">' +
    '<div class="ef-error" role="alert"></div>' +
    '<div class="ef-actions"><button type="button" class="ef-cancel">Cancel</button><button type="button" class="ef-save">Add</button></div>';
  const nameInput = addForm.querySelector('.ef-name');
  const urlInput = addForm.querySelector('.ef-url');
  const formError = addForm.querySelector('.ef-error');
  const preview = addForm.querySelector('.ef-preview');
  let pendingSeed = newSeed();
  const showPreview = ()=>{ preview.src = identiconUri(pendingSeed); };
  addForm.querySelector('.ef-shuffle').addEventListener('click', ()=>{ pendingSeed = newSeed(); showPreview(); });

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
        rm.type = 'button'; rm.className = 'engine-remove'; rm.append(makeIcon(iconUri('close', false)));
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
    saveCustomEngines(loadCustomEngines().concat({id, name, url, seed:pendingSeed}));
    selectEngine('custom:' + id);
    closeEngineMenu();
  }

  addBtn.addEventListener('click', ()=>{
    pendingSeed = newSeed(); showPreview();
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
    closeWallpaperMenu();
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

  /* ---------- wallpaper ---------- */
  const bgEl = document.getElementById('bg');
  const fallbackNote = document.getElementById('bg-fallback-note');
  const noteText = document.getElementById('note-text');
  const noteAction = document.getElementById('note-action');
  let currentPoolKey = null;
  function showNote(text, actionLabel){
    noteText.textContent = text;
    noteAction.hidden = !actionLabel;
    noteAction.textContent = actionLabel || '';
    fallbackNote.style.display = 'block';
  }
  const IMG_RE = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i;
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

  function markRecent(key){
    const recent = JSON.parse(lsGet('recentWallpapers') || '[]');
    lsSet('recentWallpapers', JSON.stringify(recent.concat(key).slice(-RECENT_WALLPAPER_CAP)));
  }

  function pickAvoidingRecent(items, keyFn){
    const recent = JSON.parse(lsGet('recentWallpapers') || '[]');
    const cap = Math.min(RECENT_WALLPAPER_CAP, items.length - 1);
    const avoid = new Set(cap > 0 ? recent.slice(-cap) : []);
    const pool = items.filter(item => !avoid.has(keyFn(item)));
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    markRecent(keyFn(chosen));
    return chosen;
  }

  // Folder images plus any images added by drop or chooser.
  async function pickRandomFromDirHandle(handle){
    const items = [];
    for await (const entry of handle.values()){
      if(entry.kind === 'file' && IMG_RE.test(entry.name)) items.push({key: entry.name, entry});
    }
    for(const key of await idbAllKeysWithPrefix('dropped:')) items.push({key});
    if(items.length === 0) return false;
    const chosen = pickAvoidingRecent(items, item => item.key);
    const blob = chosen.entry ? await chosen.entry.getFile() : await idbGet(chosen.key);
    if(!blob) return false;
    if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(blob);
    setBackground(currentObjectUrl);
    cacheAsDataUrl(blob);
    currentPoolKey = chosen.entry ? null : chosen.key;
    fallbackNote.style.display = 'none';
    return true;
  }

  async function showPoolImage(key){
    currentPoolKey = null;
    const blob = await idbGet(key);
    if(!blob) return false;
    if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(blob);
    setBackground(currentObjectUrl);
    currentPoolKey = key;
    fallbackNote.style.display = 'none';
    return true;
  }

  async function pickRandomFromDroppedPool(){
    currentPoolKey = null;
    const keys = await idbAllKeysWithPrefix('dropped:');
    if(keys.length === 0) return false;
    return showPoolImage(pickAvoidingRecent(keys, k => k));
  }

  function showEmptyPoolNote(){
    showNote(
      matchMedia('(pointer: coarse)').matches
        ? 'Pick images to use as your wallpaper.'
        : 'Pick images to use as your wallpaper, or drop them onto the page.',
      'Choose images');
  }

  const showAnother = ()=> usingFolder() ? pickRandomFromDirHandle(dirHandle) : pickRandomFromDroppedPool();

  async function removeCurrentWallpaper(){
    if(!currentPoolKey) return;
    await idbDelete(currentPoolKey);
    lsSet('lastWallpaperDataUrl', '');
    if(await showAnother()) return;
    if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
    bgEl.style.backgroundImage = '';
    if(usingFolder()) showNote('No images found in your wallpaper folder.', 'Choose a different folder');
    else showEmptyPoolNote();
  }

  async function verifyPermission(handle){
    const opts = {mode:'read'};
    if((await handle.queryPermission(opts)) === 'granted') return true;
    return false;
  }

  const wallpaperInput = document.getElementById('wallpaper-input');
  const useImageChooser = ()=> !('showDirectoryPicker' in window) || matchMedia('(pointer: coarse)').matches;

  const fileSignature = f => `${f.name}|${f.size}|${f.lastModified}`;

  async function poolSignatures(){
    const known = new Map();
    for(const key of await idbAllKeysWithPrefix('dropped:')){
      const f = await idbGet(key);
      if(f) known.set(fileSignature(f), key);
    }
    return known;
  }

  async function addImages(fileList){
    const files = Array.from(fileList).filter(f=> f.type.startsWith('image/') || IMG_RE.test(f.name));
    if(files.length === 0){
      const msg = 'No image files in that drop. Drag image files from your computer, or use the ⚙ button.';
      showNote(msg);
      if(bgEl.style.backgroundImage) setTimeout(()=>{ if(noteText.textContent === msg) fallbackNote.style.display = 'none'; }, 5000);
      return;
    }
    const known = await poolSignatures();
    let added, existing, skipped = 0;
    for(const f of files){
      const sig = fileSignature(f);
      if(known.has(sig)){ existing = known.get(sig); skipped++; continue; }
      added = await idbAdd('dropped', f);
      known.set(sig, added);
    }
    if(added && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(()=>{});
    const newest = added || existing;
    markRecent(newest);
    if(!(await showPoolImage(newest))) await pickRandomFromDroppedPool();
    if(skipped){
      const msg = skipped === 1 ? 'Already added, skipped 1 duplicate.' : `Already added, skipped ${skipped} duplicates.`;
      showNote(msg);
      setTimeout(()=>{ if(noteText.textContent === msg) fallbackNote.style.display = 'none'; }, 4000);
    }
  }

  async function initWallpaper(){
    showCachedInstantly();

    const alreadyPurged = await idbGet('poolPurged');
    await idbSet('poolPurged', true);

    if(useImageChooser()){
      const ok = await pickRandomFromDroppedPool();
      if(!ok) showEmptyPoolNote();
      return;
    }

    const saved = await idbGet('dirHandle');
    if(saved){
      dirHandle = saved;
      if(!alreadyPurged){
        for(const key of await idbAllKeysWithPrefix('dropped:')) await idbDelete(key);
      }
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
  const wallpaperBtn = document.getElementById('wallpaper-btn');
  const wallpaperMenu = document.getElementById('wallpaper-menu');
  const wpNext = document.getElementById('wp-next');
  const wpAdd = document.getElementById('wp-add');
  const wpRemove = document.getElementById('wp-remove');
  function closeWallpaperMenu(){ wallpaperMenu.classList.remove('open'); }
  const usingFolder = ()=> !useImageChooser() && !!dirHandle && !needsReconnect;
  function refreshWallpaperMenu(){
    wpAdd.title = wpAdd.ariaLabel = useImageChooser() ? 'Add images' : 'Choose folder';
    wpNext.hidden = !(usingFolder() || currentPoolKey);
    wpRemove.hidden = !currentPoolKey;
  }
  wallpaperBtn.addEventListener('click', ()=>{
    refreshWallpaperMenu();
    wallpaperMenu.classList.toggle('open');
    closeEngineMenu();
  });
  wpNext.addEventListener('click', async ()=>{ await showAnother(); refreshWallpaperMenu(); });
  wpAdd.addEventListener('click', ()=>{ closeWallpaperMenu(); chooseWallpaper(); });
  wpRemove.addEventListener('click', ()=>{ closeWallpaperMenu(); removeCurrentWallpaper(); });
  document.addEventListener('click', e=>{
    const path = e.composedPath();
    if(!path.includes(wallpaperMenu) && !path.includes(wallpaperBtn)) closeWallpaperMenu();
  });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeWallpaperMenu(); });
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
