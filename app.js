(function(){

  /* ---------- storage helpers (fail gracefully if storage is blocked) ---------- */
  /* ----- read localStorage ----- */
  function lsGet(key){ try{ return localStorage.getItem(key); }catch{ return null; } }
  /* ----- write localStorage ----- */
  function lsSet(key,val){ try{ localStorage.setItem(key,val); }catch{} }

  const DB_NAME = 'ht-homepage', STORE = 'kv';
  /* ----- open database ----- */
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
  /* ----- read one saved value ----- */
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
  /* ----- write one saved value ----- */
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
  /* ----- delete one saved value ----- */
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
  /* ----- add a value under a new key ----- */
  async function idbAdd(storeKeyPrefix, val){
    const key = storeKeyPrefix + ':' + Date.now() + ':' + Math.random().toString(36).slice(2);
    await idbSet(key, val);
    return key;
  }
  /* ----- list saved keys by prefix ----- */
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
  /* ----- update clock and date ----- */
  function tick(){
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    dateEl.textContent = now.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'});
  }
  /* ----- start the clock ----- */
  tick(); setInterval(tick, 1000*10);

  /* ---------- search ---------- */
  const ENGINES = {
    google:       {name:'Google',        url:'https://www.google.com/search?q=%s'},
    bing:         {name:'Bing',          url:'https://www.bing.com/search?q=%s'},
    duckduckgo:   {name:'DuckDuckGo',    url:'https://duckduckgo.com/?q=%s'},
    startpage:    {name:'Startpage',     url:'https://www.startpage.com/do/search?q=%s'},
    brave:        {name:'Brave',         url:'https://search.brave.com/search?q=%s'},
    wikipedia:    {name:'Wikipedia',     url:'https://en.wikipedia.org/w/index.php?search=%s'},
    reddit:       {name:'Reddit',        url:'https://www.reddit.com/search/?q=%s'},
    wallhaven:    {name:'Wallhaven',     url:'https://wallhaven.cc/search?q=%s'},
    youtube:      {name:'YouTube',       url:'https://www.youtube.com/results?search_query=%s'},
    youtubemusic: {name:'YouTube Music', url:'https://music.youtube.com/search?q=%s'},
  };
  /* BEGIN GENERATED ICONS */
const ICON_PALETTE = ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FF6C24", "#FFEC27", "#00E436", "#29ADFF", "#291814", "#FF77A8", "#FFCCAA"];
const ICON_ART = {
  close: ["00000000", "00000000", "00700700", "00077000", "00077000", "00700700", "00000000", "00000000"],
  youtubemusic: ["000dddd000", "00d8888d00", "0d887888d0", "d88877888d", "d88877788d", "d88877788d", "d88877888d", "0d887888d0", "00d8888d00", "000dddd000"],
  google: ["000ddddd00", "00d88888d0", "0d887778d0", "daa77777d0", "daa777777d", "daa77ccccd", "d337777ccd", "0d3377733d", "00d33333d0", "000ddddd00"],
  duckduckgo: ["000dddd000", "00d9999d00", "0d999999d0", "d99977999d", "d997d7799d", "d99777aa9d", "d99977999d", "0d999999d0", "00d9999d00", "000dddd000"],
  startpage: ["0dddddddd0", "dd777777dd", "d77111776d", "d71777176d", "d71777176d", "d71777176d", "d77111776d", "d77777716d", "dd666666dd", "0dddddddd0"],
  reddit: ["000dddd000", "00d9999d00", "0d979999d0", "d99979999d", "d97777779d", "d97977979d", "d97777779d", "0d977779d0", "00d9999d00", "000dddd000"],
  youtube: ["0dddddddd0", "dd888888dd", "d88878888d", "d88877888d", "d88877788d", "d88877788d", "d88877888d", "d88878888d", "dd888888dd", "0dddddddd0"],
  wallhaven: ["0dddddddd0", "dd777777dd", "d77777716d", "d77777776d", "d77777176d", "d17771116d", "d11711111d", "d11111111d", "dd666666dd", "0dddddddd0"],
  bing: ["00dd000000", "0dccd00000", "0dccd00000", "0dccddd000", "0dcccccd00", "0dccddccd0", "0dccddccd0", "0dccddccd0", "0ddccccd00", "00ddddd000"],
  brave: ["0dddddddd0", "dd999999dd", "d97999979d", "d99777799d", "d99777799d", "d99977999d", "0d999999d0", "00d9999d00", "000d99d000", "0000dd0000"],
  wikipedia: ["0dddddddd0", "dd777777dd", "d77777776d", "d7d7777d6d", "d7d7777d6d", "d7d7dd7d6d", "d77d77d76d", "d77777776d", "dd666666dd", "0dddddddd0"],
};
/* END GENERATED ICONS */

  /* ----- svg text to data link ----- */
  const svgUri = svg => 'data:image/svg+xml,' + encodeURIComponent(svg);
  /* ----- flat pixel svg ----- */
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
    '<path d="M.08 .841V.225Q.08 .088 .217 .088H.866" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M.929 .166V.785Q.929 .922 .793 .922H.141" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/></g></defs>';
  /* ----- glass pixel svg ----- */
  function glassSvg(cells, backdrop = '', size = 8, pad = 0){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${size + 2 * pad} ${size + 2 * pad}">` + GLASS_DEFS + backdrop +
      cells.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" rx=".18" fill="${c}"/><use href="#o" x="${x}" y="${y}"/>`).join('') + '</svg>';
  }
  const iconMemo = {};
  /* ----- engine icon as data link ----- */
  function iconUri(name, glass = true){
    const key = glass ? name : name + '@flat';
    if(iconMemo[key]) return iconMemo[key];
    const cells = [];
    ICON_ART[name].forEach((row, y) => [...row].forEach((ch, x) => {
      const i = parseInt(ch, 16);
      if(i) cells.push([x, y, ICON_PALETTE[i]]);
    }));
    const size = ICON_ART[name].length;
    return (iconMemo[key] = svgUri(glass ? glassSvg(cells, '', size) : pixelSvg(cells, '', size)));
  }

  const IDENT_COLOURS = [12, 14, 9, 11, 3, 2, 8, 1].map(i => ICON_PALETTE[i]);
  /* ----- seeded random numbers ----- */
  function seededRandom(seed){
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* ----- seed from a name ----- */
  const nameSeed = name => [...name].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7);
  /* ----- new random seed ----- */
  const newSeed = () => Math.floor(Math.random() * 1e9) + 1;
  /* ----- generated icon for custom engines ----- */
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
    const shape = new Set();
    for(let y = 0; y < 8; y++) for(let x = 0; x < 8; x++){
      if((x === 0 || x === 7) && (y === 0 || y === 7)) continue;
      shape.add(x + ',' + y);
    }
    const outline = new Set();
    for(const key of shape){
      const [x, y] = key.split(',').map(Number);
      for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
        const n = (x + dx) + ',' + (y + dy);
        if(!shape.has(n)) outline.add(n);
      }
    }
    const toCells = (set, colour) => [...set].map(k => { const [x, y] = k.split(',').map(Number); return [x, y, colour]; });
    const ground = toCells(shape, ICON_PALETTE[7]).map(([x, y, c]) => (x === 7 || y === 7) ? [x, y, ICON_PALETTE[6]] : [x, y, c]);
    const ring = toCells(outline, ICON_PALETTE[13]);
    return svgUri(glassSvg(ground.concat(px, ring), '', 8, 1));
  }

  const SEARCH_ICON = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round">' +
    '<g stroke="#000" stroke-width="4.8"><circle cx="11" cy="10.5" r="6.5"/><path d="M16 15.5l4.5 4.5"/></g>' +
    '<g stroke="#fff" stroke-width="2.4"><circle cx="11" cy="10.5" r="6.5"/><path d="M16 15.5l4.5 4.5"/></g></svg>');

  // Chrome/Edge: chrome.search.query({text}); Firefox: browser.search.search({query})
  const searchApi = typeof browser !== 'undefined' && browser.search && typeof browser.search.search === 'function' ? browser.search
    : typeof chrome !== 'undefined' && chrome.search && typeof chrome.search.query === 'function' ? chrome.search : null;
  /* ----- is the browser search API available ----- */
  const hasBrowserSearch = ()=> !!searchApi;
  /* ----- fill %s in a search URL ----- */
  const searchUrl = (template, q)=> template.replace('%s', ()=> encodeURIComponent(q));

  /* ----- check a custom engine URL ----- */
  function isValidTemplate(url){
    if(typeof url !== 'string' || url.split('%s').length !== 2) return false;
    try{
      const u = new URL(url.replace('%s', 'x'));
      return u.protocol === 'https:' || u.protocol === 'http:';
    }catch{ return false; }
  }
  /* ----- load saved custom engines ----- */
  function loadCustomEngines(){
    try{
      const list = JSON.parse(lsGet('customEngines') || '[]');
      return Array.isArray(list) ? list.filter(e => e && e.id && typeof e.name === 'string' && e.name && isValidTemplate(e.url)) : [];
    }catch{ return []; }
  }
  /* ----- save custom engines ----- */
  function saveCustomEngines(list){ lsSet('customEngines', JSON.stringify(list)); }

  /* ----- all engines in menu order ----- */
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
  /* ----- engine used when none is saved ----- */
  const fallbackEngine = ()=> hasBrowserSearch() ? 'default' : 'google';
  let currentEngine = lsGet('engine');
  /* ----- currently selected engine ----- */
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

  /* ----- make an icon image ----- */
  const makeIcon = src => { const img = document.createElement('img'); img.src = src; img.alt = ''; return img; };
  /* ----- icon image for an engine ----- */
  const engineIcon = e => makeIcon(e.icon);
  engineToggle.append(makeIcon(SEARCH_ICON));

  /* ----- add-engine button and form ----- */
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
  /* ----- show the new icon preview ----- */
  const showPreview = ()=>{ preview.src = identiconUri(pendingSeed); };
  /* ----- shuffle icon button ----- */
  addForm.querySelector('.ef-shuffle').addEventListener('click', ()=>{ pendingSeed = newSeed(); showPreview(); });

  /* ----- update search placeholder ----- */
  function updateEngineToggle(){
    const e = activeEngine();
    searchInput.placeholder = e.key === 'default' ? 'Search the web…' : 'Search ' + e.name + '…';
    engineToggle.setAttribute('aria-label', 'Search engine: ' + e.name);
  }
  /* ----- build the engine menu ----- */
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
  /* ----- pick an engine ----- */
  function selectEngine(key){
    currentEngine = key;
    lsSet('engine', key);
    updateEngineToggle();
    renderEngineMenu();
  }
  /* ----- delete a custom engine ----- */
  function removeCustomEngine(e){
    saveCustomEngines(loadCustomEngines().filter(x => x.id !== e.id));
    if(currentEngine === e.key) selectEngine(fallbackEngine());
    else renderEngineMenu();
  }

  /* ----- close add-engine form ----- */
  function closeEngineForm(){
    addForm.hidden = true; addBtn.hidden = false;
    nameInput.value = ''; urlInput.value = ''; formError.textContent = '';
  }
  /* ----- close engine menu ----- */
  function closeEngineMenu(){
    engineMenu.classList.remove('open');
    closeEngineForm();
  }
  const MENU_EDGE = 12;
  /* ----- size and place engine menu ----- */
  function positionEngineMenu(){
    const rect = searchWrap.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 8 - MENU_EDGE;
    const above = rect.top - 8 - MENU_EDGE;
    engineMenu.style.maxHeight = 'none';
    const flip = engineMenu.scrollHeight > below && above > below;
    engineMenu.classList.toggle('flip-up', flip);
    engineMenu.style.maxHeight = Math.max(160, Math.floor(flip ? above : below)) + 'px';
  }
  /* ----- re-place menu on resize ----- */
  window.addEventListener('resize', ()=>{ if(engineMenu.classList.contains('open')) positionEngineMenu(); });
  /* ----- save a new custom engine ----- */
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

  /* ----- open add-engine form ----- */
  addBtn.addEventListener('click', ()=>{
    pendingSeed = newSeed(); showPreview();
    addBtn.hidden = true; addForm.hidden = false;
    positionEngineMenu();
    nameInput.focus();
  });
  /* ----- cancel and add buttons ----- */
  addForm.querySelector('.ef-cancel').addEventListener('click', closeEngineForm);
  addForm.querySelector('.ef-save').addEventListener('click', saveEngine);
  /* ----- Enter key saves engine ----- */
  [nameInput, urlInput].forEach(input => input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ e.preventDefault(); saveEngine(); }
  }));
  /* ----- open or close engine menu ----- */
  engineToggle.addEventListener('click', e => {
    e.stopPropagation();
    if(engineMenu.classList.contains('open')){ closeEngineMenu(); return; }
    closeWallpaperMenu();
    engineMenu.classList.add('open');
    positionEngineMenu();
  });
  /* ----- click outside closes engine menu ----- */
  document.addEventListener('click', e => {
    if(!e.composedPath().includes(engineMenu)) closeEngineMenu();
  });
  /* ----- Escape closes menu, / focuses search ----- */
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){ closeEngineMenu(); return; }
    if(e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){
      e.preventDefault();
      searchInput.focus();
    }
  });

  /* ----- run a search ----- */
  function runSearch(q){
    const engine = activeEngine();
    if(engine.key !== 'default'){ location.href = searchUrl(engine.url, q); return; }
    const goGoogle = ()=>{ location.href = searchUrl(ENGINES.google.url, q); };
    try{
      const result = searchApi.query ? searchApi.query({text: q, disposition: 'CURRENT_TAB'})
        : searchApi.search({query: q, disposition: 'CURRENT_TAB'});
      if(result && typeof result.catch === 'function') result.catch(goGoogle);
    }catch{ goGoogle(); }
  }
  /* ----- search form submit ----- */
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = searchInput.value.trim();
    if(!q) return;
    if(/^https?:\/\//i.test(q)){
      location.href = q;
    } else if(/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) && !q.includes(' ')){
      location.href = 'https://' + q;
    } else {
      runSearch(q);
    }
  });

  /* ----- first draw of menu and placeholder ----- */
  renderEngineMenu();
  updateEngineToggle();

  /* ---------- wallpaper ---------- */
  const bgEl = document.getElementById('bg');
  const fallbackNote = document.getElementById('bg-fallback-note');
  const noteText = document.getElementById('note-text');
  const noteAction = document.getElementById('note-action');
  let currentPoolKey = null;
  /* ----- show bottom-left note ----- */
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

  /* ----- set wallpaper image ----- */
  function setBackground(url){
    bgEl.style.backgroundImage = `url("${url}")`;
  }

  /* ----- show last wallpaper at once ----- */
  function showCachedInstantly(){
    const cached = lsGet('lastWallpaperDataUrl');
    if(cached) setBackground(cached);
  }

  /* ----- save wallpaper for next load ----- */
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

  /* ----- remember recent wallpaper ----- */
  function markRecent(key){
    const recent = JSON.parse(lsGet('recentWallpapers') || '[]');
    lsSet('recentWallpapers', JSON.stringify(recent.concat(key).slice(-RECENT_WALLPAPER_CAP)));
  }

  /* ----- random pick, skipping recent ----- */
  function pickAvoidingRecent(items, keyFn){
    const recent = JSON.parse(lsGet('recentWallpapers') || '[]');
    const cap = Math.min(RECENT_WALLPAPER_CAP, items.length - 1);
    const avoid = new Set(cap > 0 ? recent.slice(-cap) : []);
    const pool = items.filter(item => !avoid.has(keyFn(item)));
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    markRecent(keyFn(chosen));
    return chosen;
  }

  /* ----- random wallpaper from folder + images added by drop or chooser ----- */
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

  /* ----- show a stored wallpaper ----- */
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

  /* ----- random wallpaper from added images ----- */
  async function pickRandomFromDroppedPool(){
    currentPoolKey = null;
    const keys = await idbAllKeysWithPrefix('dropped:');
    if(keys.length === 0) return false;
    return showPoolImage(pickAvoidingRecent(keys, k => k));
  }

  /* ----- note when no images are added ----- */
  function showEmptyPoolNote(){
    showNote(
      matchMedia('(pointer: coarse)').matches
        ? 'Pick images to use as your wallpaper.'
        : 'Pick images to use as your wallpaper, or drop them onto the page.',
      'Choose images');
  }

  /* ----- show another wallpaper ----- */
  const showAnother = ()=> usingFolder() ? pickRandomFromDirHandle(dirHandle) : pickRandomFromDroppedPool();

  /* ----- remove current wallpaper ----- */
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

  /* ----- check folder permission ----- */
  async function verifyPermission(handle){
    const opts = {mode:'read'};
    if((await handle.queryPermission(opts)) === 'granted') return true;
    return false;
  }

  const wallpaperInput = document.getElementById('wallpaper-input');
  /* ----- file chooser instead of folder picker ----- */
  const useImageChooser = ()=> !('showDirectoryPicker' in window) || matchMedia('(pointer: coarse)').matches;

  /* ----- file identity for duplicates ----- */
  const fileSignature = f => `${f.name}|${f.size}|${f.lastModified}`;

  /* ----- identities of stored images ----- */
  async function poolSignatures(){
    const known = new Map();
    for(const key of await idbAllKeysWithPrefix('dropped:')){
      const f = await idbGet(key);
      if(f) known.set(fileSignature(f), key);
    }
    return known;
  }

  /* ----- add images to the rotation ----- */
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

  /* ----- first wallpaper on load ----- */
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

  /* ----- pick folder or images ----- */
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
  /* ----- close wallpaper buttons ----- */
  function closeWallpaperMenu(){ wallpaperMenu.classList.remove('open'); }
  /* ----- is folder mode active ----- */
  const usingFolder = ()=> !useImageChooser() && !!dirHandle && !needsReconnect;
  /* ----- update wallpaper buttons ----- */
  function refreshWallpaperMenu(){
    wpAdd.title = wpAdd.ariaLabel = useImageChooser() ? 'Add images' : 'Choose folder';
    wpNext.hidden = !(usingFolder() || currentPoolKey);
    wpRemove.hidden = !currentPoolKey;
  }
  /* ----- gear button ----- */
  wallpaperBtn.addEventListener('click', ()=>{
    refreshWallpaperMenu();
    wallpaperMenu.classList.toggle('open');
    closeEngineMenu();
  });
  /* ----- reload button ----- */
  wpNext.addEventListener('click', async ()=>{ await showAnother(); refreshWallpaperMenu(); });
  /* ----- add images button ----- */
  wpAdd.addEventListener('click', ()=>{ closeWallpaperMenu(); chooseWallpaper(); });
  /* ----- delete button ----- */
  wpRemove.addEventListener('click', ()=>{ closeWallpaperMenu(); removeCurrentWallpaper(); });
  /* ----- click outside closes wallpaper buttons ----- */
  document.addEventListener('click', e=>{
    const path = e.composedPath();
    if(!path.includes(wallpaperMenu) && !path.includes(wallpaperBtn)) closeWallpaperMenu();
  });
  /* ----- Escape closes wallpaper buttons ----- */
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeWallpaperMenu(); });
  /* ----- note button ----- */
  noteAction.addEventListener('click', chooseWallpaper);

  /* ---------- show or hide clock and search bar ---------- */
  const wpClock = document.getElementById('wp-clock');
  const wpSearch = document.getElementById('wp-search');
  /* ----- apply saved clock and search bar choice ----- */
  function applyVisibility(){
    const hideClock = lsGet('hideClock') === '1', hideSearch = lsGet('hideSearch') === '1';
    document.body.classList.toggle('hide-clock', hideClock);
    document.body.classList.toggle('hide-search', hideSearch);
    wpClock.classList.toggle('off', hideClock);
    wpSearch.classList.toggle('off', hideSearch);
    wpClock.title = wpClock.ariaLabel = hideClock ? 'Show clock' : 'Hide clock';
    wpSearch.title = wpSearch.ariaLabel = hideSearch ? 'Show search bar' : 'Hide search bar';
    if(hideSearch) closeEngineMenu();
  }
  /* ----- clock button ----- */
  wpClock.addEventListener('click', ()=>{ lsSet('hideClock', lsGet('hideClock') === '1' ? '' : '1'); applyVisibility(); });
  /* ----- search bar button ----- */
  wpSearch.addEventListener('click', ()=>{ lsSet('hideSearch', lsGet('hideSearch') === '1' ? '' : '1'); applyVisibility(); });
  applyVisibility();

  /* ---------- drag & drop fallback ---------- */
  const dropHint = document.getElementById('drop-hint');
  let dragCounter = 0;
  /* ----- show drop hint ----- */
  document.addEventListener('dragenter', (e)=>{
    e.preventDefault(); dragCounter++;
    dropHint.classList.add('show');
  });
  /* ----- hide drop hint ----- */
  document.addEventListener('dragleave', ()=>{
    dragCounter--; if(dragCounter<=0){ dragCounter=0; dropHint.classList.remove('show'); }
  });
  /* ----- allow dropping ----- */
  document.addEventListener('dragover', (e)=> e.preventDefault());
  /* ----- add dropped images ----- */
  document.addEventListener('drop', async (e)=>{
    e.preventDefault();
    dragCounter = 0;
    dropHint.classList.remove('show');
    await addImages(e.dataTransfer.files);
  });
  /* ----- add chosen images ----- */
  wallpaperInput.addEventListener('change', async ()=>{
    await addImages(wallpaperInput.files);
    wallpaperInput.value = '';
  });

  /* ----- start the wallpaper ----- */
  initWallpaper();

})();
