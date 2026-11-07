// ===== extras: daily quests, leaderboard, achievements, secrets, hard mode, race, co-op, my house =====
'use strict';
const ISLAND_ICONS = ['🏝️','🏔️','🌋','🏜️','🏰','🌌'];
function todayKey(){ const d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function weekKey(){ const d = new Date(); const onejan = new Date(d.getFullYear(),0,1); const w = Math.ceil((((d - onejan)/86400000) + onejan.getDay()+1)/7); return d.getFullYear()+'-W'+String(w).padStart(2,'0'); }
function seededRng(str){ let h = 2166136261; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return rng(h>>>0); }
function hardMode(){ return !!save.hard; }
// ---------- coins / events ----------
function addCoins(n, why){ if (n > 0 && hardMode() && why === 'reward') n = Math.round(n*1.5); save.coins = (save.coins||0) + n; if (n > 0){ const wk = weekKey(); if (!save.week || save.week.key !== wk) save.week = { key: wk, coins: 0, stars: 0 }; save.week.coins += n; save.totalCoins = (save.totalCoins||0) + n; } persist(); hud(); gameEvent('coins', { n }); return n; }
const EVT = [];
function gameEvent(type, data){ try { dailyEvent(type, data); checkAchievements(type, data); if (type !== 'coins') pushScore(); } catch(e){ console.error(e); } }
// ---------- DAILY QUESTS ----------
const DAILY_TEMPLATES = [
  { id:'coins30', text:'Collect 40 coins today', need:40, ev:'coins', reward:80 },
  { id:'coins80', text:'Collect 100 coins today', need:100, ev:'coins', reward:150 },
  { id:'items5', text:'Pick up 8 quest items', need:8, ev:'item', reward:100 },
  { id:'course', text:'Finish any obstacle course', need:1, ev:'course', reward:150 },
  { id:'quiz', text:'Finish a quiz with 80% or more', need:1, ev:'quizgood', reward:120 },
  { id:'secrets3', text:'Find 3 secret stars', need:3, ev:'secret', reward:120 },
  { id:'kart', text:'Drive a kart 500 m', need:500, ev:'kart', reward:100 },
  { id:'house', text:'Visit 3 houses', need:3, ev:'house', reward:80 },
  { id:'talk', text:'Talk to 6 villagers', need:6, ev:'talk', reward:80 },
  { id:'race', text:'Finish a kart race', need:1, ev:'race', reward:150 },
  { id:'jump', text:'Jump 100 times', need:100, ev:'jump', reward:60 },
  { id:'chest', text:'Open a treasure chest', need:1, ev:'chest', reward:100 },
];
function dailyState(){ const k = todayKey(); if (!save.daily || save.daily.date !== k){ const r = seededRng('daily'+k); const pool = DAILY_TEMPLATES.slice(); const picks = []; while (picks.length < 3 && pool.length){ const i = Math.floor(r()*pool.length); picks.push(pool.splice(i,1)[0].id); } save.daily = { date:k, picks, prog:{}, done:{} }; persist(); } return save.daily; }
function dailyEvent(type, data){ const d = dailyState(); let changed = false; d.picks.forEach(id => { const t = DAILY_TEMPLATES.find(x => x.id === id); if (!t || d.done[id]) return; let add = 0; if (t.ev === type){ add = type === 'coins' ? Math.max(0, data.n) : type === 'kart' ? data.n : 1; } if (!add) return; d.prog[id] = (d.prog[id]||0) + add; changed = true; if (d.prog[id] >= t.need){ d.done[id] = true; persist(); SFX.quest(); showMsg('📅 Daily done: '+t.text+' +'+t.reward+' 🪙', 2600); addCoins(t.reward, 'reward'); gameEvent('daily', {}); } }); if (changed) persist(); if (document.getElementById('pDaily') && !$('pDaily').classList.contains('hide')) renderDaily(); }
function renderDaily(){ const d = dailyState(); const el = $('dailyList'); el.innerHTML = ''; d.picks.forEach(id => { const t = DAILY_TEMPLATES.find(x => x.id === id); const p = Math.min(t.need, d.prog[id]||0); const done = !!d.done[id]; const div = document.createElement('div'); div.className = 'q '+(done?'done':'active'); div.innerHTML = '<div class="t">'+(done?'✅ ':'📅 ')+t.text+'</div><div class="d">'+p+' / '+t.need+' • 🪙 '+t.reward+'</div>'; el.appendChild(div); }); const all = d.picks.every(id => d.done[id]); $('dailyInfo').textContent = all ? '🎉 All daily quests done! Come back tomorrow.' : 'New quests every day. Finish all 3 for bonus luck!'; }
// ---------- LEADERBOARD (Firebase) ----------
let scoreT = 0;
let lastPush = 0;
function pushScore(){ try { if (typeof fdb === 'undefined' || !fdb || !uid) return; if (performance.now()-lastPush < 10000) return; lastPush = performance.now(); const wk = weekKey(); const w = (save.week && save.week.key === wk) ? save.week : { coins:0 }; const data = { n: save.name||'Player', week: wk, coins: w.coins||0, secrets: Object.values(save.secrets||{}).reduce((a,b) => a+b.length, 0), quests: Object.values(save.quests||{}).filter(x => x==='done').length, race: save.raceBest && save.raceBest[0] ? save.raceBest[0] : null, t: firebase.database.ServerValue.TIMESTAMP }; fdb.ref('scores/'+uid).set(data).catch(() => {}); } catch(e){} }
function renderBoard(){ const el = $('boardList'); el.innerHTML = '<div class="d">Loading...</div>'; try { if (typeof fdb === 'undefined' || !fdb){ el.innerHTML = '<div class="d">Online ranking not available.</div>'; return; } fdb.ref('scores').once('value').then(snap => { const all = snap.val()||{}; const wk = weekKey(); const rows = Object.entries(all).map(([id,v]) => Object.assign({id}, v)).filter(v => v.week === wk).sort((a,b) => (b.coins||0)-(a.coins||0)); el.innerHTML = ''; if (!rows.length) el.innerHTML = '<div class="d">No scores this week yet. Earn coins!</div>'; rows.slice(0,10).forEach((r,i) => { const div = document.createElement('div'); div.className = 'q'+(r.id===uid?' active':''); div.innerHTML = '<div class="t">'+(['🥇','🥈','🥉'][i]||('#'+(i+1)))+' '+(r.n||'Player')+(r.id===uid?' (you)':'')+'</div><div class="d">🪙 '+(r.coins||0)+' this week • ⭐ '+(r.secrets||0)+' secrets • 📜 '+(r.quests||0)+' quests'+(r.race?' • 🏎️ '+fmtT(r.race):'')+'</div>'; el.appendChild(div); }); }).catch(() => { el.innerHTML = '<div class="d">Could not load the ranking.</div>'; }); } catch(e){ el.innerHTML = '<div class="d">Ranking error.</div>'; } }
function fmtT(s){ s = Math.max(0, s); const m = Math.floor(s/60), r = s - m*60; return (m?m+':':'')+(m?String(Math.floor(r)).padStart(2,'0'):Math.floor(r))+'.'+String(Math.floor((r%1)*10)); }
// ---------- ACHIEVEMENTS ----------
const ACH = [
  { id:'first_quest', n:'First Steps', d:'Finish your first quest', ic:'🥾', test:s => cnt(s.quests,'done') >= 1 },
  { id:'ten_quests', n:'Helper', d:'Finish 10 quests', ic:'🤝', test:s => cnt(s.quests,'done') >= 10 },
  { id:'all_quests', n:'Island Legend', d:'Finish 40 quests', ic:'🏆', test:s => cnt(s.quests,'done') >= 40 },
  { id:'coins1k', n:'Rich Kid', d:'Earn 1000 coins in total', ic:'💰', test:s => (s.totalCoins||0) >= 1000 },
  { id:'coins5k', n:'Millionaire (almost)', d:'Earn 5000 coins in total', ic:'🤑', test:s => (s.totalCoins||0) >= 5000 },
  { id:'words20', n:'Word Collector', d:'Learn 20 words', ic:'📖', test:s => (s.words||[]).length >= 20 },
  { id:'words50', n:'Dictionary', d:'Learn 50 words', ic:'📚', test:s => (s.words||[]).length >= 50 },
  { id:'course1', n:'Runner', d:'Finish an obstacle course', ic:'🏁', test:s => Object.keys(s.courseBest||{}).length >= 1 },
  { id:'course3', n:'Speed Star', d:'Get 3 stars on a course', ic:'⭐', test:s => Object.values(s.courseBest||{}).some(c => c.stars >= 3) },
  { id:'secrets20', n:'Star Hunter', d:'Find all 20 secret stars on one island', ic:'🌟', test:s => Object.values(s.secrets||{}).some(a => a.length >= 20) },
  { id:'houses5', n:'Visitor', d:'Enter 5 houses', ic:'🏠', test:s => (s.stats||{}).houses >= 5 },
  { id:'kart1k', n:'Road Trip', d:'Drive a kart 1 km', ic:'🏎️', test:s => (s.stats||{}).kart >= 1000 },
  { id:'quiz_perfect', n:'Brainiac', d:'Get 100% on a quiz', ic:'🧠', test:s => (s.stats||{}).perfect >= 1 },
  { id:'math_perfect', n:'Math Wizard', d:'Get 100% on a math class', ic:'🧮', test:s => (s.stats||{}).mathPerfect >= 1 },
  { id:'race', n:'Racer', d:'Finish a kart race', ic:'🏆', test:s => Object.keys(s.raceBest||{}).length >= 1 },
  { id:'race_fast', n:'Lightning', d:'Finish the Sunny Island race under 60 s', ic:'⚡', test:s => s.raceBest && s.raceBest[0] && s.raceBest[0] < 60 },
  { id:'coop', n:'Teamwork', d:'Open the co-op treasure with a friend', ic:'👥', test:s => (s.chests||[]).includes('coop') },
  { id:'islands', n:'World Traveler', d:'Unlock all 6 islands', ic:'🌍', test:s => (s.unlocked||1) >= 6 },
  { id:'daily7', n:'Every Day', d:'Finish 7 daily quests', ic:'📅', test:s => (s.stats||{}).daily >= 7 },
  { id:'furniture5', n:'Interior Designer', d:'Place 5 pieces of furniture in your house', ic:'🛋️', test:s => Object.values(s.house||{}).filter(x => x).length >= 5 },
];
function cnt(o, v){ return Object.values(o||{}).filter(x => x === v).length; }
function checkAchievements(type, data){ save.stats = save.stats||{}; if (type === 'house') save.stats.houses = (save.stats.houses||0)+1; if (type === 'kart') save.stats.kart = (save.stats.kart||0)+data.n; if (type === 'quizgood' && data.perfect){ if (data.math) save.stats.mathPerfect = (save.stats.mathPerfect||0)+1; else save.stats.perfect = (save.stats.perfect||0)+1; } if (type === 'daily') save.stats.daily = (save.stats.daily||0)+1;
  save.ach = save.ach||[]; ACH.forEach(a => { if (!save.ach.includes(a.id) && a.test(save)){ save.ach.push(a.id); persist(); setTimeout(() => { SFX.chest(); showMsg(a.ic+' Trophy: '+a.n+'!', 2600); emit(P.x,P.y+2,P.z,30,{colors:[0xffd43b,0xffffff],speed:5,g:4,life:1.4,up:1.5}); }, 600); } }); }
function renderTrophies(){ const el = $('trophyList'); el.innerHTML = ''; const got = save.ach||[]; $('trophyInfo').textContent = got.length+' / '+ACH.length+' trophies'; ACH.forEach(a => { const div = document.createElement('div'); div.className = 'q '+(got.includes(a.id)?'done':''); div.innerHTML = '<div class="t">'+(got.includes(a.id)?a.ic:'🔒')+' '+a.n+'</div><div class="d">'+a.d+'</div>'; el.appendChild(div); }); }
// ---------- SECRET STARS ----------
function placeSecrets(isl){ const r = seededRng('secrets'+isl); const got = (save.secrets||{})[isl]||[]; const highBlocks = blocks.filter(b => !b.ghost && b.h >= 1 && b.y+b.h/2 > 1 && b.y+b.h/2 < 14 && b.w >= 3 && b.d >= 3 && b.x < 70 && b.z > -200); // candidate spots: on blocks tops (plateaus/houses roofs excluded), interiors, random ground
  for (let i=0;i<20;i++){ let x, y, z; const t = r();
    if (t < 0.25){ const b = highBlocks[Math.floor(r()*highBlocks.length)]; if (b){ x = b.x + (r()-.5)*(b.w-2); z = b.z + (r()-.5)*(b.d-2); y = b.y+b.h/2+0.8; } else { x = (r()-.5)*120; z = (r()-.5)*100; y = 0.8; } }
    else if (t < 0.4){ const rooms = triggers.filter(tr => tr.kind === 'exit'); const rm = rooms[Math.floor(r()*rooms.length)]; if (rm){ x = rm.x + (r()-.5)*8; z = rm.z - 2 - r()*6; y = 0.8; } else { x = (r()-.5)*120; z = (r()-.5)*100; y = 0.8; } }
    else if (t < 0.55){ x = (r()-.5)*120; z = (r()-.5)*100; y = 3 + r()*3; } // floating: needs a jump
    else { x = (r()-.5)*130; z = (r()-.5)*110; y = 0.8; }
    const it = { kind:'secret', x, y, z, r:1.6, idx:i, got: got.includes(i), secret:true }; items.push(it); buildItemMesh(it); if (it.got) it.g.visible = false; }
}
function secretCount(isl){ return ((save.secrets||{})[isl]||[]).length; }
function onSecret(it){ save.secrets = save.secrets||{}; const a = save.secrets[islandIdx] = save.secrets[islandIdx]||[]; if (!a.includes(it.idx)) a.push(it.idx); persist(); SFX.item(); addCoins(10); const n = a.length; showMsg('🌟 Secret star '+n+'/20 (+10 🪙)', 1600); emit(it.x,it.y,it.z,16,{colors:[0xa855f7,0xffffff,0xffd43b],speed:4,g:3,life:0.8}); gameEvent('secret', {}); if (n === 20){ setTimeout(() => { addCoins(500, 'reward'); showMsg('🌟 ALL 20 SECRETS FOUND! +500 🪙', 3000); SFX.win(); }, 800); } }
// ---------- COURSE TIMING / HARD MODE ----------
let courseRun = null; // {id, t0}
const COURSE_PAR = { sky:75, ice:90, lava:100, pyr:100, dragon:110, orbit:110 };
function courseStart(id){ courseRun = { id, t0: performance.now() }; showMsg('⏱ Go! Reach the FINISH gate', 1500); }
function courseFinished(id){ let res = null; if (courseRun && courseRun.id === id){ const t = (performance.now()-courseRun.t0)/1000; const par = (COURSE_PAR[id]||90) * (hardMode()?0.85:1); const stars = t <= par ? 3 : t <= par*1.5 ? 2 : 1; save.courseBest = save.courseBest||{}; const prev = save.courseBest[id]; const best = !prev || t < prev.time; save.courseBest[id] = { time: best ? t : prev.time, stars: Math.max(stars, prev?prev.stars:0) }; persist(); res = { time:t, stars, best }; showMsg('🏁 '+fmtT(t)+'  '+'⭐'.repeat(stars)+'☆'.repeat(3-stars)+(best?'  NEW BEST!':''), 3200); } courseRun = null; gameEvent('course', { id }); return res; }
function hardFactor(){ return hardMode() ? 1.5 : 1; }
// ---------- KART RACE ----------
let race = null; let raceGates = [];
const RACE_LAYOUTS = { 0: [[8,-26],[26,-20],[60,-10],[62,30],[40,44],[0,40],[-40,44],[-60,20],[-56,-20],[-30,-26]], default: [[8,34],[40,36],[60,10],[50,-12],[20,-14],[-20,-14],[-50,-10],[-62,16],[-40,40],[-10,36]] };
function buildRace(isl){ raceGates = []; const lay = RACE_LAYOUTS[isl] || RACE_LAYOUTS.default; lay.forEach(([x,z],i) => { const g = new THREE.Group(); g.position.set(x,0,z); world.add(g); const col = i === 0 ? 0x37d67a : 0xffd43b; [-2.5,2.5].forEach(ex => cyl(0.12,0.12,4,mat(col,{emissive:col,emissiveIntensity:0.6}),ex,2,0,g,8)); mesh(bgeo(5.2,0.3,0.2), mat(col,{emissive:col,emissiveIntensity:0.6}), 0,4,0, g); const sp = textSprite(i===0?'START':String(i), '#ffffff', 0.6); sp.position.y = 4.8; g.add(sp); const nx = lay[(i+1)%lay.length]; g.rotation.y = Math.atan2(nx[0]-x, nx[1]-z); raceGates.push({ x, z, i, g }); }); }
function updateRace(k, dt){ if (!raceGates.length) return; const g0 = raceGates[0]; const near = (g, r=4.5) => Math.hypot(k.x-g.x, k.z-g.z) < r;
  if (!race){ if (near(g0)){ race = { next:1, t0:performance.now(), lastLap:0 }; showMsg('🏁 RACE! Drive through gates 1 → '+(raceGates.length-1)+' → START', 2500); SFX.check(); } return; }
  const target = race.next < raceGates.length ? raceGates[race.next] : g0; if (near(target)){ if (race.next < raceGates.length){ race.next++; SFX.coin(); showMsg('Gate '+(race.next-1)+' ✓', 600); } else { const t = (performance.now()-race.t0)/1000; save.raceBest = save.raceBest||{}; const prev = save.raceBest[islandIdx]; const best = !prev || t < prev; if (best) save.raceBest[islandIdx] = t; persist(); addCoins(best?120:40, 'reward'); SFX.win(); showMsg('🏆 Race time '+fmtT(t)+(best?'  NEW RECORD!':'  (best '+fmtT(prev)+')'), 3500); emit(k.x,k.y+2,k.z,50,{colors:[0xffd43b,0xff4d88,0x37d67a,0xffffff],speed:7,g:5,life:2,up:1.5}); race = null; gameEvent('race', {}); } }
  if (race){ $('raceHud').style.display = 'inline-block'; $('raceHud').textContent = '🏎️ '+fmtT((performance.now()-race.t0)/1000)+' • next gate '+(race.next < raceGates.length ? race.next : 'START'); } }
function raceAbort(){ if (race){ race = null; showMsg('Race cancelled', 1200); } $('raceHud').style.display = 'none'; }
// ---------- CO-OP TREASURE (island 0) ----------
let coop = null;
function buildCoop(isl){ coop = null; if (isl !== 0) return; const cx = -62, cz = -58; plateau(cx,1.5,cz,16,12,1.5,theme.rock,theme.grass); // vault
  const gate = W(rgeo(6,4,1,0.2), mat(0x8a8f99,{metalness:0.6,roughness:0.4}), cx, 3.5, cz+6); const gs = solid(cx,3.5,cz+6,6,4,1); [-3.5,3.5].forEach(ex => cyl(0.5,0.5,5,mat(0x6b7280),cx+ex,4,cz+6,world,10));
  mesh(rgeo(16,2,1,0.2), mat(theme.rock), cx,2.5,cz-6, world); solid(cx,2.5,cz-6,16,2,1); [[cx-8,cz,1,12],[cx+8,cz,1,12]].forEach(([x,z,w,d]) => { mesh(rgeo(w,2,d,0.2), mat(theme.rock), x,2.5,z, world); solid(x,2.5,z,w,2,d); });
  const p1 = { x:cx-6, z:cz+12 }, p2 = { x:cx+6, z:cz+12 }; [p1,p2].forEach((p,i) => { const m = W(rgeo(2.6,0.3,2.6,0.1), mat(0x3b82f6,{emissive:0x1e3a8a,emissiveIntensity:0.5}), p.x,0.15,p.z); p.m = m; const sp = textSprite(i?'PLATE 2':'PLATE 1', '#aee8ff', 0.6); sp.position.set(p.x,2,p.z); world.add(sp); });
  sign(cx,cz+16,'Co-op vault: 2 players!',0); chest(cx, cz, 'coop', 1.5); coop = { gate, gs, p1, p2, open:false, cx, cz }; }
function updateCoop(dt){ if (!coop) return; const onPlate = (p, x, z) => Math.abs(x-p.x) < 1.6 && Math.abs(z-p.z) < 1.6; const me1 = onPlate(coop.p1,P.x,P.z), me2 = onPlate(coop.p2,P.x,P.z); let peer1 = false, peer2 = false; peers.forEach(pr => { if (pr.isl !== islandIdx) return; if (onPlate(coop.p1,pr.x,pr.z)) peer1 = true; if (onPlate(coop.p2,pr.x,pr.z)) peer2 = true; });
  const both = (me1 && peer2) || (me2 && peer1) || (peer1 && peer2); coop.p1.m.material.emissiveIntensity = (me1||peer1) ? 1.5 : 0.5; coop.p2.m.material.emissiveIntensity = (me2||peer2) ? 1.5 : 0.5;
  const target = both ? -1.5 : 3.5; coop.gate.position.y += (target - coop.gate.position.y)*Math.min(1,dt*2); coop.gs.y = coop.gate.position.y; if (both && !coop.open){ coop.open = true; SFX.pad(); showMsg('🔓 The vault opens! Teamwork!', 2000); } if (!both && coop.open) coop.open = false;
  if ((me1||me2) && !both && !coop.hintT){ coop.hintT = 6; showMsg('👥 You need a friend on the other plate!', 2200); } if (coop.hintT) coop.hintT -= dt; }
// ---------- MY HOUSE (furniture) ----------
const FURNITURE = [
  { id:'bed_blue', n:'Blue bed', ic:'🛏️', price:150 }, { id:'bed_pink', n:'Pink bed', ic:'🛏️', price:150 }, { id:'sofa', n:'Sofa', ic:'🛋️', price:200 }, { id:'table', n:'Table & chairs', ic:'🪑', price:120 }, { id:'lamp', n:'Lamp', ic:'💡', price:80 }, { id:'plant', n:'Plant', ic:'🪴', price:60 }, { id:'shelf', n:'Bookshelf', ic:'📚', price:140 }, { id:'tv', n:'Big TV', ic:'📺', price:300 }, { id:'aquarium', n:'Aquarium', ic:'🐠', price:250 }, { id:'piano', n:'Piano', ic:'🎹', price:350 }, { id:'trophy', n:'Trophy shelf', ic:'🏆', price:200 }, { id:'robot', n:'Robot friend', ic:'🤖', price:400 }, { id:'rug', n:'Rainbow rug', ic:'🌈', price:90 }, { id:'arcade', n:'Arcade machine', ic:'🕹️', price:500 },
];
const HOUSE_SLOTS = [[-4.5,-3],[4.5,-3],[-4.5,2],[4.5,2],[0,-4.5],[0,3.5],[-1.5,-1],[1.5,-1]];
let myHouse = null;
function buildFurniture(kind, g){ const F = (geo,m,x,y,z) => mesh(geo,m,x,y,z,g);
  if (kind === 'bed_blue' || kind === 'bed_pink'){ const c = kind==='bed_blue'?0x3b82f6:0xff6fae; F(rgeo(2.4,0.5,3.6,0.2), mat(0xd9b27c), 0,0.25,0); F(rgeo(2.2,0.4,3.4,0.2), mat(c), 0,0.7,0); F(rgeo(1.8,0.3,0.8,0.15), mat(0xffffff), 0,1.05,-1.2); F(rgeo(2.4,1.4,0.3,0.1), mat(0x8b5a2b), 0,0.7,-1.8); }
  else if (kind === 'sofa'){ F(rgeo(3,0.7,1.2,0.25), mat(0x7c3aed), 0,0.35,0); F(rgeo(3,0.9,0.4,0.2), mat(0x6d28d9), 0,0.9,-0.4); [-1.3,1.3].forEach(x => F(rgeo(0.4,0.5,1.2,0.15), mat(0x6d28d9), x,0.95,0)); }
  else if (kind === 'table'){ F(rgeo(2.2,0.15,1.4,0.1), mat(0x8b5a2b), 0,0.9,0); [[-0.9,-0.5],[0.9,-0.5],[-0.9,0.5],[0.9,0.5]].forEach(([x,z]) => cyl(0.08,0.08,0.9,mat(0x8b5a2b),x,0.45,z,g,6)); [-1.5,1.5].forEach(x => { F(rgeo(0.7,0.1,0.7,0.05), mat(0xb07a45), x,0.55,0); F(rgeo(0.7,0.8,0.1,0.05), mat(0xb07a45), x+(x>0?0.3:-0.3),0.95,0); }); sphere(0.2,mat(0xef4444),0,1.2,0,g,10); }
  else if (kind === 'lamp'){ cyl(0.3,0.4,0.1,mat(0x333333),0,0.05,0,g,10); cyl(0.05,0.05,1.6,mat(0x333333),0,0.9,0,g,6); cyl(0.5,0.3,0.6,mat(0xffe08a,{emissive:0xffcc55,emissiveIntensity:0.8}),0,1.9,0,g,12); const pl = new THREE.PointLight(0xffe0a0,1.2,10); pl.position.set(0,1.8,0); g.add(pl); }
  else if (kind === 'plant'){ cyl(0.35,0.3,0.5,mat(0xc2703e),0,0.25,0,g,10); [[0,0.9,0,0.45],[0.3,1.2,0.2,0.35],[-0.3,1.3,-0.1,0.35],[0,1.6,0,0.3]].forEach(([x,y,z,r]) => sphere(r,mat(0x22c55e),x,y,z,g,10)); }
  else if (kind === 'shelf'){ F(rgeo(2.2,2.4,0.6,0.1), mat(0x8b5a2b), 0,1.2,0); for (let i=0;i<10;i++) F(rgeo(0.3,0.6,0.5,0.03), mat([0xef4444,0x3b82f6,0x22c55e,0xf59e0b,0xa855f7][i%5]), -0.8+(i%5)*0.4, 0.6+Math.floor(i/5)*0.9, 0.05); }
  else if (kind === 'tv'){ F(rgeo(2.6,0.5,0.8,0.1), mat(0x374151), 0,0.25,0); F(rgeo(2.8,1.6,0.15,0.08), mat(0x111111), 0,1.4,0); F(rgeo(2.6,1.4,0.05,0.05), mat(0x00bbf9,{emissive:0x0088cc,emissiveIntensity:0.9}), 0,1.4,0.08); }
  else if (kind === 'aquarium'){ F(rgeo(2.2,0.6,1,0.1), mat(0x374151), 0,0.3,0); F(rgeo(2,1.3,0.9,0.05), mat(0x7fd6ff,{transparent:true,opacity:0.5,roughness:0.1}), 0,1.25,0); for (let i=0;i<3;i++){ const f = sphere(0.14,mat([0xf59e0b,0xef4444,0x22c55e][i]),-0.6+i*0.6,1.0+i*0.25,0,g,8); f.scale.set(1.6,0.8,0.6); } sphere(0.3,mat(0x22c55e),0.7,0.75,0.2,g,8); }
  else if (kind === 'piano'){ F(rgeo(2.4,1.0,1.2,0.1), mat(0x111111), 0,0.5,0); F(rgeo(2.2,0.1,0.4,0.03), mat(0xffffff), 0,1.05,0.5); for (let i=0;i<8;i++) F(bgeo(0.1,0.12,0.25), mat(0x111111), -0.9+i*0.26,1.1,0.42); F(rgeo(0.8,0.1,0.5,0.05), mat(0x111111), 0,0.5,1.1); }
  else if (kind === 'trophy'){ F(rgeo(2,1.6,0.5,0.1), mat(0x8b5a2b), 0,0.8,0); for (let i=0;i<3;i++){ cyl(0.08,0.15,0.3,mat(0xffd43b,{metalness:0.7,roughness:0.3}),-0.6+i*0.6,1.75,0,g,8); sphere(0.18,mat(0xffd43b,{metalness:0.7,roughness:0.3}),-0.6+i*0.6,2.0,0,g,10); } }
  else if (kind === 'robot'){ buildAnimal(g,'robot'); g.children.forEach(c => c.scale.setScalar(0.7)); }
  else if (kind === 'rug'){ for (let i=0;i<5;i++){ const r = new THREE.Mesh(new THREE.RingGeometry(i*0.4, i*0.4+0.4, 24), mat([0xef4444,0xf59e0b,0xffd43b,0x22c55e,0x3b82f6][i])); r.rotation.x = -Math.PI/2; r.position.y = 0.05; g.add(r); } }
  else if (kind === 'arcade'){ F(rgeo(1.2,2.2,1.0,0.1), mat(0xef4444), 0,1.1,0); F(rgeo(1,0.8,0.1,0.05), mat(0x00f5d4,{emissive:0x00f5d4,emissiveIntensity:0.8}), 0,1.6,0.5); F(rgeo(1,0.3,0.4,0.05), mat(0x111111), 0,1.05,0.55); sphere(0.08,mat(0xffd43b),-0.2,1.25,0.6,g,8); sphere(0.08,mat(0x3b82f6),0.1,1.25,0.6,g,8); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); }
function buildMyHouse(isl){ myHouse = null; if (isl !== 0) return; nextInteriorType = 'myhouse'; const g = house(-30,18,0.9,0xfff7e0,0x3b82f6,7,6,3.4); nextInteriorType = null; const door = triggers.filter(t => t.kind==='door').pop(); myHouse = { room: door.room, slots: [] }; sign(-26,24,'My House ★',0.6); HOUSE_SLOTS.forEach(([sx,sz],i) => { const grp = new THREE.Group(); grp.position.set(door.room.cx+sx, 0, door.room.cz+sz); world.add(grp); const pad = W(rgeo(2.2,0.04,2.2,0.3), mat(0xffffff,{transparent:true,opacity:0.25}), door.room.cx+sx, 0.03, door.room.cz+sz); pad.castShadow = false; myHouse.slots.push({ grp, i }); }); refreshHouse(); }
function refreshHouse(){ if (!myHouse) return; const h = save.house||{}; myHouse.slots.forEach(s => { while (s.grp.children.length) s.grp.remove(s.grp.children[0]); const kind = h[s.i]; if (kind) buildFurniture(kind, s.grp); s.grp.rotation.y = HOUSE_SLOTS[s.i][0] < 0 ? Math.PI/2 : HOUSE_SLOTS[s.i][0] > 0 ? -Math.PI/2 : 0; }); }
function renderDecor(){ const el = $('decorList'); el.innerHTML = ''; const owned = FURNITURE.filter(f => (save.owned||[]).includes(f.id)); const h = save.house||{}; HOUSE_SLOTS.forEach((_,i) => { const div = document.createElement('div'); div.className = 'q active'; const sel = document.createElement('select'); sel.style.cssText = 'font:inherit;padding:6px;border-radius:8px;background:#0a1526;color:#fff;border:2px solid #ffd43b;max-width:100%'; const o0 = document.createElement('option'); o0.value = ''; o0.textContent = '— empty —'; sel.appendChild(o0); owned.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.ic+' '+f.n; if (h[i] === f.id) o.selected = true; sel.appendChild(o); }); sel.onchange = () => { save.house = save.house||{}; save.house[i] = sel.value||null; persist(); refreshHouse(); SFX.click(); gameEvent('furniture', {}); }; div.innerHTML = '<div class="t">Spot '+(i+1)+'</div>'; div.appendChild(sel); el.appendChild(div); }); $('decorInfo').textContent = owned.length ? 'Choose furniture for each spot.' : 'Buy furniture in the Shop (🛋️ Furniture tab) first!'; }

// ---------- GIFT CODES ----------
function giftHash(str){ let h = 7; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) % 1000003; return h; }
// code format: ISLAND-<coins>-<check>  where check = giftHash('zq'+coins+'kv') % 997, written in base36
function makeGiftCode(coins){ return 'ISLAND-'+coins+'-'+(giftHash('zq'+coins+'kv')%997).toString(36).toUpperCase(); }
function redeemGift(code){ code = String(code||'').trim().toUpperCase(); const m = code.match(/^ISLAND-(\d+)-([0-9A-Z]+)$/); if (!m){ return { ok:false, msg:'Unknown code' }; } const coins = +m[1]; if (coins <= 0 || coins > 100000 || m[2] !== (giftHash('zq'+coins+'kv')%997).toString(36).toUpperCase()) return { ok:false, msg:'Unknown code' }; save.used = save.used||[]; if (save.used.includes(code)) return { ok:false, msg:'Code already used' }; save.used.push(code); addCoins(coins); persist(); return { ok:true, msg:'+'+coins+' coins!' }; }
