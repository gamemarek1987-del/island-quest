// ===== main game =====
'use strict';
setupTouch();
const ITEM_EMOJI = { apple:'🍎', shell:'🐚', flower:'🌸', gear:'⚙️', mushroom:'🍄', egg:'🥚', crystal:'💎', coconut:'🥥', snowflake:'❄️', banana:'🍌', key:'🔑', star:'⭐', bone:'🦴', fish:'🐟', carrot:'🥕', chicken:'🐔', coin:'🪙' };
const SHOP = [
  ...Object.entries(HOODIES).map(([id,c],i) => ({ id, cat:'hoodie', n:id.split('_')[1], ic:'🧥', price:i===0?0:60+i*20, color:c })),
  { id:'cap_red', cat:'cap', n:'Red cap', ic:'🧢', price:0 }, { id:'cap_blue', cat:'cap', n:'Blue cap', ic:'🧢', price:50 }, { id:'cap_green', cat:'cap', n:'Green cap', ic:'🧢', price:50 }, { id:'cap_black', cat:'cap', n:'Black cap', ic:'🧢', price:60 }, { id:'cap_gold', cat:'cap', n:'Gold cap', ic:'🧢', price:120 }, { id:'cap_none', cat:'cap', n:'No cap', ic:'🙂', price:0 },
  { id:'cap_pirate', cat:'cap', n:'Pirate hat', ic:'🏴‍☠️', price:150 }, { id:'cap_crown', cat:'cap', n:'Crown', ic:'👑', price:250 }, { id:'cap_wizard', cat:'cap', n:'Wizard hat', ic:'🧙', price:180 }, { id:'cap_helmet', cat:'cap', n:'Helmet', ic:'⛑️', price:120 },
  { id:'glasses', cat:'extra', n:'Sunglasses', ic:'🕶️', price:90 }, { id:'backpack', cat:'extra', n:'Backpack', ic:'🎒', price:0 }, { id:'wings', cat:'extra', n:'Wings (triple jump!)', ic:'🪽', price:400 }, { id:'speed', cat:'extra', n:'Turbo shoes', ic:'👟', price:250 },
  { id:'kart_red', cat:'kart', n:'Red kart', ic:'🏎️', price:0 }, { id:'kart_blue', cat:'kart', n:'Blue kart', ic:'🏎️', price:100 }, { id:'kart_green', cat:'kart', n:'Green kart', ic:'🏎️', price:100 }, { id:'kart_gold', cat:'kart', n:'Gold kart', ic:'🏎️', price:300 },
  { id:'trail_none', cat:'trail', n:'No trail', ic:'➖', price:0 }, { id:'trail_fire', cat:'trail', n:'Fire trail', ic:'🔥', price:100, cols:[0xff3000,0xff9900,0xffdd00] }, { id:'trail_rainbow', cat:'trail', n:'Rainbow', ic:'🌈', price:180, cols:[0xff0000,0xff9900,0xffff00,0x00ff00,0x0099ff,0x9900ff] }, { id:'trail_stars', cat:'trail', n:'Stars', ic:'✨', price:150, cols:[0xffd43b,0xffffff,0xfff3b0] }, { id:'trail_hearts', cat:'trail', n:'Hearts', ic:'💗', price:120, cols:[0xff4d88,0xff99bb,0xffffff] },
];
const KART_COLORS = { kart_red:0xef4444, kart_blue:0x3b82f6, kart_green:0x22c55e, kart_gold:0xffd43b };
const shopItem = id => SHOP.find(i => i.id === id);

// ---------- player ----------
const P = { x:0, y:1, z:0, vx:0, vy:0, vz:0, w:0.8, h:1.9, ground:false, onMover:null, dead:0, yaw:0, jumps:0, coyote:0, jumpBuf:0, boost:false, walk:0, safe:{x:0,y:0,z:0}, safeT:0 };
const hero = new THREE.Group(); scene.add(hero); let HP = null;
function heroCfg(){ const capId = save.eq.cap; return { hoodie: HOODIES[save.eq.hoodie]||0xffd43b, cap: CAPS[capId]===undefined?0xef4444:CAPS[capId], capBack:true, glasses:false, sunglasses:!!save.eq.glasses, backpack:!!save.eq.backpack, name: save.name||'Player', nameColor:'#ffd43b' }; }
function buildHero(){ HP = buildChar(hero, heroCfg()); if (save.eq.wings){ const wm = mat(0xffffff,{emissive:0xaaddff,emissiveIntensity:0.3}); const w1 = mesh(rgeo(0.9,0.6,0.08,0.05), wm, -0.8,1.3,0.35, hero); w1.rotation.y = 0.4; const w2 = mesh(rgeo(0.9,0.6,0.08,0.05), wm, 0.8,1.3,0.35, hero); w2.rotation.y = -0.4; HP.wings = [w1,w2]; } }
let state = 'menu', island = null, islandIdx = 0, riding = null, dialog = null, quiz = null, shake = 0, elapsedT = 0, lastSafeGround = null;
const ui = { prompt: $('prompt'), promptText: $('promptText') };

// ---------- UI helpers ----------
function showMsg(t, ms=1600){ const m = $('msg'); m.textContent = t; m.classList.add('show'); clearTimeout(m._t); m._t = setTimeout(() => m.classList.remove('show'), ms); }
function fade(on){ $('fade').style.opacity = on ? 1 : 0; }
function hud(){ $('hCoins').textContent = '🪙 '+save.coins; $('hWords').textContent = '📖 '+(save.words||[]).length; if (island) $('hIsland').textContent = island.name; }
function cleanName(n){ return String(n||'').replace(/[^\p{L}\p{N} _\-!]/gu,'').trim().slice(0,14); }
function inv(kind){ return (save.items||{})[kind]||0; }
function addInv(kind, n=1){ save.items = save.items||{}; save.items[kind] = (save.items[kind]||0)+n; }
function learnWord(w){ if (!w) return; save.words = save.words||[]; if (!save.words.includes(w)){ save.words.push(w); showMsg('📖 New word: '+w.toUpperCase(), 2000); } }
function qstate(id){ return (save.quests||{})[id]||'new'; }
function setQ(id, st){ save.quests = save.quests||{}; save.quests[id] = st; persist(); renderQuests(); }
function questAvailable(q){ if (qstate(q.id) !== 'new') return false; return (q.requires||[]).every(r => qstate(r) === 'done'); }
function activeQuests(){ return island.quests.filter(q => qstate(q.id) === 'active'); }
function mainDone(){ const m = island.quests.filter(q => q.main); return { done: m.filter(q => qstate(q.id)==='done').length, total: m.length }; }
function npcById(id){ return npcs.find(n => n.id === id); }

// ---------- dialog ----------
function openDialog(name, lines, onEnd, opts={}){ dialog = { name, lines, i:0, onEnd, opts }; $('dlg').classList.remove('hide'); $('dlgName').textContent = name; dialogShow(); }
function dialogShow(){ const d = dialog; const txt = d.lines[d.i]; const el = $('dlgText'); el.textContent = ''; let k = 0; clearInterval(d.tw); d.tw = setInterval(() => { k++; el.textContent = txt.slice(0,k); if (k%3===0) SFX.talk(); if (k >= txt.length) clearInterval(d.tw); }, 22);
  const btns = $('dlgBtns'); btns.innerHTML = ''; const last = d.i === d.lines.length-1;
  if (last && d.opts.choices){ d.opts.choices.forEach(c => { const b = document.createElement('button'); b.textContent = c.label; b.className = c.cls||''; b.onclick = () => { SFX.click(); closeDialog(); c.fn(); }; btns.appendChild(b); }); }
  else { const b = document.createElement('button'); b.textContent = last ? 'OK ✓' : 'Next ▶'; b.onclick = () => { SFX.click(); dialogNext(); }; btns.appendChild(b); } }
function dialogNext(){ const d = dialog; if (!d) return; if (d.i < d.lines.length-1){ d.i++; dialogShow(); } else { closeDialog(); if (d.onEnd) d.onEnd(); } }
function closeDialog(){ if (dialog) clearInterval(dialog.tw); dialog = null; $('dlg').classList.add('hide'); }

// ---------- quests logic ----------
function talkTo(n){
  SFX.talk(); n.talkT = 2.5; n.faceT = 3;
  const qs = island.quests.filter(q => q.npc === n.id);
  // deliver quests targeting this npc
  const del = activeQuests().find(q => q.type === 'deliver' && q.target === n.id);
  if (del){ openDialog(n.cfg.name, del.lines.done, () => completeQuest(del)); return; }
  // active quest of this npc
  const act = qs.find(q => qstate(q.id) === 'active');
  if (act){
    if (act.type === 'collect'){ if (inv(act.item) >= act.count){ openDialog(n.cfg.name, act.lines.done, () => { addInv(act.item, -act.count); completeQuest(act); }); } else openDialog(n.cfg.name, [act.lines.progress[0] + ' ('+inv(act.item)+'/'+act.count+' '+act.item+(act.count>1?'s':'')+')'] ); return; }
    if (act.type === 'quiz'){ openDialog(n.cfg.name, ['Ready for the quiz?'], null, { choices:[{label:'Yes, let\'s go! 🎯', fn:() => startQuiz(act)}, {label:'Not yet', cls:'g', fn:() => {}}] }); return; }
    if (act.type === 'hide'){ openDialog(n.cfg.name, act.lines.progress); return; }
    openDialog(n.cfg.name, act.lines.progress); return;
  }
  const av = qs.find(q => questAvailable(q));
  if (av){ openDialog(n.cfg.name, av.lines.offer, null, { choices:[{label:'Yes, I will help! ✅', fn:() => acceptQuest(av, n)}, {label:'Maybe later', cls:'g', fn:() => {}}] }); return; }
  // boat captain extra: travel
  const idle = n.cfg.idleLines || ['Hello!']; openDialog(n.cfg.name, [idle[Math.floor(Math.random()*idle.length)]]);
}
function acceptQuest(q, n){ setQ(q.id, 'active'); SFX.quest(); showMsg('📜 New quest: '+q.title, 2200); openDialog(n.cfg.name, q.lines.accept, () => { if (q.type === 'hide') hideNext(q, 0); if (q.type === 'quiz') startQuiz(q); }); }
function completeQuest(q){ setQ(q.id, 'done'); save.coins += q.reward.coins; persist(); hud(); SFX.win(); showMsg('✅ Quest complete! +'+q.reward.coins+' 🪙', 2200); learnWord(q.reward.word); emit(P.x,P.y+2,P.z,40,{colors:[0xffd43b,0x37d67a,0xffffff,0xff4d88],speed:6,g:5,life:1.5,up:1.5}); if (q.type==='hide'){ const n = npcById(q.npc); if (n){ n.g.position.set(n.home.x,0,n.home.z); n.x = n.home.x; n.z = n.home.z; } }
  const md = mainDone(); if (md.done === md.total) setTimeout(() => showMsg('🎉 All main quests done! Talk to Captain Finn to sail!', 3500), 2500); }
// hide & seek
function hideNext(q, idx){ const n = npcById(q.npc); const s = q.spots[idx]; n.x = s.x; n.z = s.z; n.g.position.set(s.x,0,s.z); n.hideIdx = idx; }
function hideFound(q, n){ const idx = (n.hideIdx||0)+1; if (idx >= q.count){ openDialog(n.cfg.name, q.lines.done, () => completeQuest(q)); n.hideIdx = -1; } else { openDialog(n.cfg.name, [q.lines.found[idx-1]], () => hideNext(q, idx)); } }
// quiz
function startQuiz(q){ const qs = q.math ? genMath(q.math, q.count) : q.sets.flatMap(s => QUIZ[s]).slice().sort(() => Math.random()-0.5).slice(0, q.count); quiz = { q, qs, i:0, correct:0 }; state = 'quiz'; $('ovQuiz').classList.remove('hide'); $('quizTitle').textContent = q.title; quizShow(); }
function quizShow(){ const z = quiz; const it = z.qs[z.i]; $('quizProg').textContent = 'Question '+(z.i+1)+' / '+z.qs.length+'  •  Correct: '+z.correct; $('quizPic').textContent = it.q; $('quizPic').style.fontSize = it.text ? (it.q.length > 20 ? '30px' : '54px') : '110px'; $('quizQ').textContent = it.text ? 'What is the answer?' : 'Which word is this?'; const o = $('quizOpts'); o.innerHTML = ''; it.o.slice().sort(() => Math.random()-0.5).forEach(w => { const b = document.createElement('button'); b.textContent = w; b.className = 'y'; b.onclick = () => quizAnswer(w === it.a, b); o.appendChild(b); }); }
function quizAnswer(ok, b){ const z = quiz; if (ok){ SFX.correct(); z.correct++; b.style.background = '#37d67a'; if (!z.qs[z.i].text) learnWord(z.qs[z.i].a); } else { SFX.wrong(); b.style.background = '#ef4444'; [...$('quizOpts').children].forEach(c => { if (c.textContent === z.qs[z.i].a) c.style.background = '#37d67a'; }); }
  [...$('quizOpts').children].forEach(c => c.disabled = true);
  setTimeout(() => { z.i++; if (z.i < z.qs.length) quizShow(); else quizEnd(); }, 900); }
function quizEnd(){ const z = quiz; $('ovQuiz').classList.add('hide'); state = 'play'; const n = npcById(z.q.npc); if (z.correct >= Math.ceil(z.qs.length*0.7)){ openDialog(n.cfg.name, ['You got '+z.correct+' out of '+z.qs.length+'!', ...z.q.lines.done], () => completeQuest(z.q)); } else { openDialog(n.cfg.name, ['You got '+z.correct+' out of '+z.qs.length+'. Almost!', 'Practice and try again, hoot!']); } quiz = null; }
// objective
function objective(){ const act = activeQuests(); if (act.length){ const q = act[0]; const n = npcById(q.npc);
    if (q.type === 'collect'){ if (inv(q.item) >= q.count) return { text:'Bring '+q.item+(q.count>1?'s':'')+' to '+n.cfg.name, x:n.x, z:n.z }; let best = null, bd = 1e9; for (const it of items){ if (it.kind === q.item && !it.got){ const d = Math.hypot(it.x-P.x, it.z-P.z); if (d < bd){ bd = d; best = it; } } } return { text:'Find '+q.item+(q.count>1?'s':'')+' ('+inv(q.item)+'/'+q.count+')', x: best?best.x:n.x, z: best?best.z:n.z }; }
    if (q.type === 'deliver'){ const t = npcById(q.target); return { text:'Deliver the letter to '+t.cfg.name, x:t.x, z:t.z }; }
    if (q.type === 'hide'){ return { text:'Find '+n.cfg.name+'! ('+((n.hideIdx||0))+'/'+q.count+')', x:n.x, z:n.z }; }
    if (q.type === 'quiz'){ return { text:(q.math?'Math class with ':'Word quiz with ')+n.cfg.name, x:n.x, z:n.z }; }
    if (q.type === 'course'){ const cp = checkpoints[0]; return { text:'Finish the '+q.title.replace('The ','')+'!', x:cp?cp.x:n.x, z:cp?cp.z:n.z }; }
    return { text:q.title, x:n.x, z:n.z }; }
  const av = island.quests.find(q => questAvailable(q)); if (av){ const n = npcById(av.npc); return { text:'Talk to '+n.cfg.name, x:n.x, z:n.z }; }
  const md = mainDone(); if (md.done === md.total) return { text:'Talk to Captain Finn at the boat ⛵', x:0, z:60 }; return { text:'Explore the island!', x:P.x, z:P.z }; }
function renderQuests(){ if (!island) return; const el = $('qList'); el.innerHTML = ''; island.quests.forEach(q => { const st = qstate(q.id); if (st === 'new' && !questAvailable(q)) return; const n = npcById(q.npc); const d = document.createElement('div'); d.className = 'q '+st; d.innerHTML = '<div class="t">'+(st==='done'?'✅ ':st==='active'?'⭐ ':'❗ ')+q.title+'</div><div class="d">'+(n?n.cfg.name:'')+' • '+(q.type==='collect'?'Collect '+q.count+' '+q.item+(q.count>1?'s':'')+' ('+Math.min(inv(q.item),q.count)+'/'+q.count+')':q.type==='quiz'?(q.math?'Math quiz':'Word quiz'):q.type==='hide'?'Hide and seek':q.type==='course'?'Obstacle course':q.type==='deliver'?'Delivery':'')+' • 🪙 '+q.reward.coins+'</div>'; el.appendChild(d); });
  const w = $('wList'); w.innerHTML = ''; (save.words||[]).forEach(x => { const s = document.createElement('span'); s.className = 'w'; s.textContent = x; w.appendChild(s); }); }

// ---------- shop ----------
let shopCat = 'hoodie';
function renderShop(){ $('bank').textContent = '🪙 '+save.coins+' coins'; const tabs = [['hoodie','🧥 Hoodies'],['cap','🧢 Hats'],['extra','⚡ Extras'],['kart','🏎️ Karts'],['trail','✨ Trails']]; const tb = $('tabs'); tb.innerHTML = ''; tabs.forEach(([c,n]) => { const b = document.createElement('button'); b.textContent = n; b.className = 'g'+(c===shopCat?' act':''); b.onclick = () => { shopCat = c; SFX.click(); renderShop(); }; tb.appendChild(b); });
  const it = $('items'); it.innerHTML = ''; SHOP.filter(i => i.cat === shopCat).forEach(i => { const owned = save.owned.includes(i.id) || i.price === 0; const eq = i.cat==='extra' ? !!save.eq[i.id] : save.eq[i.cat] === i.id; const d = document.createElement('div'); d.className = 'it'+(eq?' eq':owned?' own':''); d.innerHTML = '<div class="ic">'+i.ic+'</div><div class="n">'+i.n+'</div><div class="pr">'+(eq?'✅ wearing':owned?'owned':'🪙 '+i.price)+'</div>';
    d.onclick = () => { if (!owned){ if (save.coins >= i.price){ save.coins -= i.price; save.owned.push(i.id); SFX.chest(); showMsg('Bought: '+i.n+'!'); } else { SFX.nope(); showMsg('Not enough coins! 🪙', 1200); return; } } else SFX.click();
      if (i.cat === 'extra') save.eq[i.id] = owned ? !save.eq[i.id] : true; else save.eq[i.cat] = i.id; persist(); buildHero(); hud(); renderShop(); if (i.cat === 'kart') karts.forEach(k => { if (k.player){} }); }; it.appendChild(d); }); }

// ---------- island loading ----------
function loadIsland(i){ clearWorld(); islandIdx = i; island = ISLANDS[i]; setTheme(island.theme); island.build(); items.forEach(buildItemMesh); island.npcs.forEach(n => { const npc = spawnNPC(n.id, n.x, n.z, n.yaw, Object.assign({ name:n.name, idleLines:n.idle }, n.cfg), n.y||0); }); island.chests.forEach(c => chest(c.x, c.z, c.id, c.y||0));
  // restore hide&seek position
  island.quests.filter(q => q.type==='hide' && qstate(q.id)==='active').forEach(q => hideNext(q, 0));
  // markers
  npcs.forEach(n => { const m = textSprite('!', '#ffd43b', 0.5); m.position.y = (n.cfg.animal==='cow'?2.6:n.cfg.animal==='robot'?3.4:3.1)*(n.cfg.scale||1); m.visible = false; n.g.add(m); n.marker = m; });
  P.x = island.spawn.x; P.z = island.spawn.z; P.y = 1; P.vx = P.vy = P.vz = 0; P.safe = { x:P.x, y:0, z:P.z }; riding = null; camYaw = 0; save.island = i; persist(); hud(); renderQuests(); }

// ---------- menu ----------
function renderIslands(){ const el = $('islands'); el.innerHTML = ''; const unlocked = save.unlocked||1; ISLANDS.forEach((isl,i) => { const lock = i+1 > unlocked; const done = isl.quests.filter(q => q.main && (save.quests||{})[q.id]==='done').length, total = isl.quests.filter(q => q.main).length; const d = document.createElement('div'); d.className = 'isl'+(lock?' lock':''); d.innerHTML = '<div class="ico">'+(lock?'🔒':['🏝️','🏔️','🌋'][i])+'</div><div class="nm">'+isl.name+'</div><div class="st">'+(lock?'Finish the previous island':'Quests: '+done+'/'+total)+'</div>'; if (!lock) d.onclick = () => { SFX.click(); startIsland(i); }; el.appendChild(d); }); $('menuSub').textContent = (save.name?'Hi '+save.name+'! ':'')+'Explore islands, help villagers, learn words!'; }
function startIsland(i){ ensureAC(); fade(true); setTimeout(() => { loadIsland(i); buildHero(); $('ovMenu').classList.add('hide'); state = 'play'; fade(false); startMusic(0); showMsg(island.name, 2000); setTimeout(() => { if (!save.tutorial){ openDialog('Guide', [island.intro, 'Walk with WASD or the joystick. Jump with Space. Press E (or ✋) near a person to talk.', 'Look at the top-left: the arrow shows where to go. Good luck!'], () => { save.tutorial = true; persist(); }); } else openDialog('Guide', [island.intro]); }, 800); }, 400); }
function toMenu(){ state = 'menu'; stopMusic(); closeDialog(); $('ovMenu').classList.remove('hide'); $('ovPause').classList.add('hide'); $('pQuests').classList.add('hide'); $('pShop').classList.add('hide'); renderIslands(); }
function askName(){ $('inName').value = save.name||''; $('ovName').classList.remove('hide'); $('ovMenu').classList.add('hide'); setTimeout(() => $('inName').focus(), 50); }
function nameDone(){ const n = cleanName($('inName').value); if (!n){ $('inName').style.borderColor = '#ff4d4d'; return; } save.name = n; persist(); buildHero(); $('ovName').classList.add('hide'); $('ovMenu').classList.remove('hide'); renderIslands(); SFX.click(); }
$('btnNameOk').onclick = nameDone; $('inName').addEventListener('keydown', e => { if (e.key === 'Enter') nameDone(); e.stopPropagation(); }); $('btnName').onclick = () => { SFX.click(); askName(); };
$('btnSound').onclick = () => { save.sound = !save.sound; persist(); ensureAC(); if (master) master.gain.value = save.sound?1:0; $('btnSound').textContent = save.sound?'🔊 Sound':'🔇 Sound'; }; $('btnSound').textContent = save.sound?'🔊 Sound':'🔇 Sound';
$('btnQuests').onclick = () => { if (state!=='play') return; SFX.click(); renderQuests(); $('pQuests').classList.toggle('hide'); $('pShop').classList.add('hide'); }; $('btnQClose').onclick = () => $('pQuests').classList.add('hide');
$('btnShop').onclick = () => { if (state!=='play') return; SFX.click(); renderShop(); $('pShop').classList.toggle('hide'); $('pQuests').classList.add('hide'); }; $('btnSClose').onclick = () => $('pShop').classList.add('hide');
$('btnMenu').onclick = () => { if (state==='play'){ state = 'pause'; $('ovPause').classList.remove('hide'); } }; $('btnResume').onclick = () => { state = 'play'; $('ovPause').classList.add('hide'); }; $('btnQuit').onclick = toMenu;

// ---------- interactions ----------
function nearest(list, r, fn){ let best = null, bd = r; for (const o of list){ const d = Math.hypot(o.x-P.x, o.z-P.z); if (d < bd && (!fn || fn(o))){ bd = d; best = o; } } return best; }
function die(reason){ if (P.dead) return; if (riding){ const k = riding; riding = null; setTimeout(() => resetKart(k), 900); } P.dead = 0.9; SFX.die(); shake = 0.5; emit(P.x,P.y+1,P.z,30,{colors: reason==='water'?[0x9fd8ff,0xffffff,0x3fa9f5]:[0xff6b6b,0xffd43b],speed:8,g:12,life:0.9,size:1.3}); showMsg(reason==='water'?'Splash! 💦':'Ouch! 🔥', 900); }
function respawn(){ const cp = checkpoints.filter(c => c.on).pop(); let s = P.safe; if (cp && P.onCourse) s = { x:cp.x, y:cp.y+0.1, z:cp.z }; P.x = s.x; P.y = s.y+0.5; P.z = s.z; P.vx = P.vy = P.vz = 0; P.dead = 0; P.onMover = null; P.boost = false; }
function enterKart(k){ riding = k; k.player = true; camYaw = k.yaw; SFX.click(); showMsg('🏎️ W = gas, S = brake, A/D = steer, Space = TURBO', 2500); }
function exitKart(){ if (!riding) return; const k = riding; riding = null; k.player = false; const rx = Math.cos(k.yaw), rz = -Math.sin(k.yaw); P.x = k.x + rx*2.2; P.z = k.z + rz*2.2; P.y = k.y + 0.2; P.vx = P.vy = P.vz = 0; k.speed = 0; }
function resetKart(k){ k.x = k.home.x; k.y = k.home.y; k.z = k.home.z; k.yaw = k.home.yaw; k.speed = 0; k.vy = 0; k.g.position.set(k.x,k.y,k.z); k.g.rotation.set(0,k.yaw,0); }
function doAction(){
  if (dialog){ dialogNext(); return; }
  if (riding){ exitKart(); return; }
  const n = nearest(npcs, 3.2, o => o.cfg.name); if (n){ const hq = activeQuests().find(q => q.type==='hide' && q.npc===n.id && n.hideIdx >= 0 && n.hideIdx !== undefined); if (hq){ hideFound(hq, n); return; } talkTo(n); return; }
  const c = nearest(chests, 2.6, o => !o.opened); if (c){ const data = island.chests.find(x => x.id === c.id); if (data.needs && inv(data.needs) < 1){ showMsg('🔒 Locked! You need a '+data.needs+'.', 1800); SFX.nope(); return; } if (data.needs) addInv(data.needs,-1); c.opened = true; c.lid.rotation.x = -1.6; save.chests = save.chests||[]; save.chests.push(c.id); save.coins += data.coins; persist(); hud(); SFX.chest(); learnWord(data.word); showMsg('💰 Treasure! +'+data.coins+' 🪙', 2200); emit(c.x,c.y+1,c.z,40,{colors:[0xffd43b,0xfff3b0,0xffffff],speed:6,g:6,life:1.4,up:1.6}); return; }
  const k = nearest(karts, 3.5); if (k){ enterKart(k); return; }
  const b = nearest(triggers, 4, o => o.kind==='boat'); if (b){ boatTalk(); return; }
}
function boatTalk(){ const md = mainDone(); const next = islandIdx+1 < ISLANDS.length; const choices = [];
  if (md.done === md.total && next){ choices.push({ label:'⛵ Sail to '+ISLANDS[islandIdx+1].name, fn:() => { save.unlocked = Math.max(save.unlocked||1, islandIdx+2); persist(); travel(islandIdx+1); } }); }
  for (let i=0;i<islandIdx;i++) choices.push({ label:'⛵ Back to '+ISLANDS[i].name, cls:'g', fn:() => travel(i) });
  choices.push({ label:'Stay here', cls:'g', fn:() => {} });
  const lines = md.done === md.total ? (next ? ['All main quests are done! The boat is ready.','Where do you want to sail?'] : ['You finished every island! You are the Island Hero! 🏆','Where do you want to sail?']) : ['The boat sails when all main quests are done.','Quests done: '+md.done+' / '+md.total+'. Keep helping the villagers!'];
  openDialog('Captain Finn\'s Boat', lines, null, { choices }); }
function travel(i){ fade(true); SFX.win(); setTimeout(() => { loadIsland(i); fade(false); showMsg('⛵ '+island.name, 2200); setTimeout(() => openDialog('Guide', [island.intro]), 800); }, 600); }

// ---------- multiplayer (Firebase) ----------
let fdb = null, myRef = null, uid = null; const peers = new Map(); let presT = 0, lastSent = '';
(function initFirebase(){ try { if (!window.FIREBASE_CONFIG || !window.firebase || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.indexOf('WKLEJ') === 0) return; firebase.initializeApp(FIREBASE_CONFIG); fdb = firebase.database(); firebase.auth().signInAnonymously().catch(() => {});
  firebase.auth().onAuthStateChanged(u => { if (!u) return; uid = u.uid; myRef = fdb.ref('island/'+uid); myRef.onDisconnect().remove();
    fdb.ref('island').on('value', snap => { try { const all = snap.val()||{}; const now = Date.now(); const seen = new Set(); for (const id in all){ if (id === uid) continue; const p = all[id]; if (!p || typeof p.x !== 'number') continue; if (typeof p.t === 'number' && now - p.t > 20000) continue; seen.add(id); upsertPeer(id, p); } Array.from(peers.keys()).forEach(id => { if (!seen.has(id)) dropPeer(id); }); const n = peers.size; $('hOnline').style.display = n ? 'inline-block' : 'none'; $('hOnline').textContent = '👥 '+(n+1)+' online'; } catch(e){} }); }); } catch(e){} })();
function upsertPeer(id, s){ let pr = peers.get(id); const name = cleanName(s.n)||'Player'; const key = [s.hd,s.cp,s.gl,s.bp,name].join('|');
  if (!pr){ const g = new THREE.Group(); scene.add(g); pr = { g, P:null, key:'', x:s.x, y:s.y||0, z:s.z, yaw:s.yaw||0, tx:s.x, ty:s.y||0, tz:s.z, tyaw:s.yaw||0, isl:s.i, walk:0 }; peers.set(id, pr); }
  if (pr.key !== key){ pr.key = key; pr.P = buildChar(pr.g, { hoodie: HOODIES[s.hd]||0xffd43b, cap: CAPS[s.cp]===undefined?0xef4444:CAPS[s.cp], capBack:true, sunglasses:!!s.gl, backpack:!!s.bp, name, nameColor:'#7fe0ff' }); }
  pr.tx = s.x; pr.ty = typeof s.y==='number'?s.y:0; pr.tz = s.z; pr.tyaw = typeof s.yaw==='number'?s.yaw:0; pr.isl = s.i; pr.riding = !!s.r; }
function dropPeer(id){ const pr = peers.get(id); if (!pr) return; scene.remove(pr.g); peers.delete(id); }
function updatePeers(dt, t){ peers.forEach(pr => { const vis = pr.isl === islandIdx && state !== 'menu'; pr.g.visible = vis; if (!vis) return; const k = 1-Math.pow(0.0005,dt); const dx = pr.tx-pr.x, dz = pr.tz-pr.z; pr.x += dx*k; pr.y += (pr.ty-pr.y)*k; pr.z += dz*k; let dy = pr.tyaw-pr.yaw; dy = Math.atan2(Math.sin(dy),Math.cos(dy)); pr.yaw += dy*k; pr.g.position.set(pr.x,pr.y,pr.z); pr.g.rotation.y = pr.yaw; const sp = Math.hypot(dx,dz)*6; pr.walk += dt*Math.min(sp,7)*1.7; animChar(pr.P, t, { walk:pr.walk, speed:sp, sit:pr.riding }); });
  if (myRef){ presT += dt; if (presT > 0.12){ presT = 0; const data = state==='play' ? { x:+P.x.toFixed(2), y:+P.y.toFixed(2), z:+P.z.toFixed(2), yaw:+P.yaw.toFixed(2), i:islandIdx, hd:save.eq.hoodie, cp:save.eq.cap, gl:!!save.eq.glasses, bp:!!save.eq.backpack, n:save.name||'Player', r:riding?1:0 } : { n:save.name||'Player', i:-1 }; const key = JSON.stringify(data); if (key !== lastSent || Math.random() < 0.05){ lastSent = key; data.t = firebase.database.ServerValue.TIMESTAMP; myRef.set(data).catch(() => {}); } } } }

// ---------- update ----------
let trailT = 0, promptT = '';
function setPrompt(t){ if (t !== promptT){ promptT = t; ui.promptText.textContent = t; ui.prompt.classList.toggle('show', !!t); } }
function update(dt){
  const t = performance.now()/1000;
  // world animation
  movers.forEach(m => { const ph = t*Math.PI*2/m.period + m.phase; const nx = m.x0 + Math.sin(ph)*m.dx, nz = m.z0 + Math.sin(ph)*m.dz; m.vx = nx-m.x; m.vz = nz-m.z; m.x = nx; m.z = nz; m.m.position.set(nx, m.y, nz); });
  killers.forEach(k => { const ph = t*Math.PI*2/k.period + k.phase; k.x = k.x0 + (Math.sin(ph)*0.5+0.5)*k.dx; k.m.position.set(k.x,k.y,k.z); });
  bars.forEach(b => { b.a += b.speed*dt; b.g.rotation.y = b.a; });
  items.forEach(it => { if (!it.got){ it.g.rotation.y = t*1.5 + it.x; it.g.position.y = it.y + Math.sin(t*3+it.x)*0.12; } });
  pads.forEach(p => p.a.position.y = p.y + 0.05 + Math.abs(Math.sin(t*4))*0.4);
  triggers.forEach(tr => { if (tr.kind==='boat'){ tr.g.position.y = -0.5 + Math.sin(t*1.2+tr.g.userData.bob)*0.15; tr.g.rotation.z = Math.sin(t*0.9)*0.04; } });
  lamps.forEach(l => { l.pl.intensity = 0.5; });
  const pa = ambGeo.attributes.position.array; for (let i=0;i<AMB_N;i++){ let x = pa[i*3], y = pa[i*3+1], z = pa[i*3+2]; if (theme && theme.amb==='snow'){ y -= dt*1.5; x += Math.sin(t+i)*dt*0.5; } else if (theme && theme.amb==='embers'){ y += dt*1.2; } else { y += Math.sin(t*0.7+i)*dt*0.4; x += Math.cos(t*0.5+i)*dt*0.4; } if (y < P.y-3) y = P.y+30; if (y > P.y+35) y = P.y-2; if (x < P.x-60) x += 120; if (x > P.x+60) x -= 120; if (z < P.z-60) z += 120; if (z > P.z+60) z -= 120; pa[i*3]=x; pa[i*3+1]=y; pa[i*3+2]=z; } ambGeo.attributes.position.needsUpdate = true;
  // npcs idle
  npcs.forEach(n => { const d = Math.hypot(P.x-n.x, P.z-n.z); if (n.P.kind){ animAnimal(n.P, t, false); if (n.P.kind==='dog' && d < 6){ n.g.rotation.y = Math.atan2(P.x-n.x, P.z-n.z); } } else { if (d < 6 || n.faceT > 0){ const ty = Math.atan2(P.x-n.x, P.z-n.z); let dy = ty - n.g.rotation.y; dy = Math.atan2(Math.sin(dy),Math.cos(dy)); n.g.rotation.y += dy*Math.min(1,dt*4); } n.talkT = Math.max(0, (n.talkT||0)-dt); n.faceT = Math.max(0,(n.faceT||0)-dt); animChar(n.P, t + n.x, { walk:0, speed:0, talk: n.talkT > 0, wave: d < 5 && n.cfg.name && !n.cfg.animal && (n.talkT>0 || Math.sin(t+n.z) > 0.7) }); }
    if (n.marker){ const q = island.quests.find(q => q.npc===n.id && (questAvailable(q) || (qstate(q.id)==='active' && q.type==='collect' && inv(q.item)>=q.count) || (qstate(q.id)==='active' && q.type==='quiz'))); const del = activeQuests().find(q => q.type==='deliver' && q.target===n.id); n.marker.visible = !!(q || del); n.marker.position.y = (n.cfg.animal==='cow'?2.6:n.cfg.animal==='robot'?3.4:3.1)*(n.cfg.scale||1) + Math.sin(t*3)*0.15; } });
  if (state !== 'play') return;
  elapsedT += dt;
  if (inputEv.esc){ inputEv.esc = false; if (dialog) closeDialog(); else { state = 'pause'; $('ovPause').classList.remove('hide'); return; } }
  if (keys.KeyQ && !keys._q){ keys._q = true; $('btnQuests').onclick(); } if (!keys.KeyQ) keys._q = false;
  if (P.dead > 0){ P.dead -= dt; hero.visible = false; if (P.dead <= 0){ respawn(); hero.visible = true; emit(P.x,P.y+1,P.z,20,{colors:[0x37d67a,0xffffff],speed:4,g:2,life:0.8}); } inputEv.jump = inputEv.action = false; return; }
  hero.visible = true;
  if (dialog){ inputEv.jump = false; if (inputEv.action){ inputEv.action = false; dialogNext(); } animChar(HP, t, { walk:P.walk, speed:0, talk:false }); setPrompt(''); return; }
  if (inputEv.action){ inputEv.action = false; doAction(); if (dialog) return; }
  // prompts
  let pr = ''; if (riding) pr = 'E / ✋ — get out'; else { const n = nearest(npcs, 3.2, o => o.cfg.name); const c = nearest(chests, 2.6, o => !o.opened); const k = nearest(karts, 3.5); const b = nearest(triggers, 4); if (n) pr = 'E / ✋ — talk to '+n.cfg.name; else if (c) pr = 'E / ✋ — open chest'; else if (k) pr = 'E / ✋ — drive the kart'; else if (b) pr = 'E / ✋ — the boat'; } setPrompt(pr);
  $('be').textContent = riding ? '⬅' : pr ? '✋' : '✋';
  // items near: show labels
  items.forEach(it => { if (it.lbl){ const d = Math.hypot(it.x-P.x, it.z-P.z); it.lbl.visible = !it.got && d < 8; } });
  // objective
  const ob = objective(); $('objText').textContent = ob.text; const ang = Math.atan2(ob.x-P.x, ob.z-P.z) - camYaw; $('compass').style.transform = 'rotate('+(-(ang)*180/Math.PI + 180)+'deg)';

  if (riding){ updateKart(riding, dt, t); return; }
  // ---- player physics ----
  const mv = readMove(); const cv = camVectors();
  const SPEED = (keys.ShiftLeft||keys.ShiftRight) ? 10 : 7 * (save.eq.speed ? 1.15 : 1);
  const mx = (cv.rx*mv.ix - cv.fx*mv.iz)*SPEED, mz = (cv.rz*mv.ix - cv.fz*mv.iz)*SPEED;
  const fr = theme.amb==='snow' && P.ground && !(P.groundBlock && P.groundBlock.isMover) ? 0.1 : P.ground ? 0.25 : 0.08; P.vx += (mx-P.vx)*fr; P.vz += (mz-P.vz)*fr;
  if (mv.l > 0.1) P.yaw = Math.atan2(mx, mz);
  const G = 28, JV = Math.sqrt(2*G*2.2); const maxJumps = save.eq.wings ? 3 : 2;
  P.jumpBuf = inputEv.jump ? 0.15 : Math.max(0, P.jumpBuf-dt); inputEv.jump = false; P.coyote = P.ground ? 0.12 : P.coyote - dt;
  if (P.jumpBuf > 0 && P.coyote > 0){ P.vy = JV; P.ground = false; P.coyote = 0; P.jumpBuf = 0; P.jumps = 1; SFX.jump(); emit(P.x,P.y,P.z,8,{colors:[0xffffff,0xdddddd],speed:3,g:6,life:0.4,spread:0.8}); }
  else if (P.jumpBuf > 0 && !P.ground && P.jumps < maxJumps && P.jumps > 0){ P.vy = JV*0.95; P.jumps++; P.jumpBuf = 0; SFX.djump(); emit(P.x,P.y+0.5,P.z,16,{colors:[0xaaddff,0xffffff],speed:5,g:3,life:0.6,spread:1}); }
  const held = keys.Space || jumpBtn; P.vy -= G*dt; if (P.vy < -30) P.vy = -30; if (!held && P.vy > 3 && !P.boost) P.vy -= G*dt*1.2; if (P.vy <= 0) P.boost = false;
  const res = moveEntity(P, dt, { step: 0.55 }); if (P.ground) P.jumps = 0;
  if (res.landed && P.vy <= 0){ SFX.land(); emit(P.x,P.y,P.z,8,{colors:[0xffffff,0xcccccc],speed:3,g:6,life:0.4,spread:0.8}); }
  // safe position (on real ground, not course)
  P.onCourse = P.x > 70 || checkpoints.some(c => c.on && Math.hypot(c.x-P.x,c.z-P.z) < 60 && P.x > 60);
  if (P.ground && !P.onCourse && P.y > -0.5){ P.safeT += dt; if (P.safeT > 0.5){ P.safe = { x:P.x, y:P.y, z:P.z }; P.safeT = 0; } } else P.safeT = 0;
  // hazards
  for (const h of hazards){ if (h.water) continue; if (Math.abs(P.x-h.x) < h.w/2+0.2 && Math.abs(P.z-h.z) < h.d/2+0.2 && P.y < h.y+h.h/2+0.15 && P.y+P.h > h.y-h.h/2){ die('fire'); break; } }
  for (const b of bars){ const dx = P.x-b.x, dz = P.z-b.z; const c = Math.cos(-b.a), s = Math.sin(-b.a); const lx = dx*c - dz*s, lz = dx*s + dz*c; if (Math.abs(lx) < b.len/2+0.3 && Math.abs(lz) < 0.7 && P.y < b.y+0.4 && P.y+P.h > b.y-0.4){ die('bar'); break; } }
  for (const k of killers){ if (Math.abs(P.x-k.x) < k.w/2+0.3 && Math.abs(P.z-k.z) < k.d/2+0.3 && P.y < k.y+k.h/2 && P.y+P.h > k.y-k.h/2){ die('bar'); break; } }
  for (const p of pads){ if (Math.abs(P.x-p.x) < 1.3 && Math.abs(P.z-p.z) < 1.3 && P.y <= p.y+0.05 && P.y > p.y-0.6){ P.vy = Math.sqrt(2*G*6.5); P.boost = true; P.ground = false; P.y = p.y+0.05; SFX.pad(); emit(P.x,P.y,P.z,25,{colors:[0xffd43b,0xffffff],speed:6,g:8,life:0.6,spread:1.5}); } }
  if (P.y < -0.9) die('water');
  // pickups
  for (const it of items){ if (!it.got && Math.hypot(P.x-it.x, (P.y+0.9)-it.y, P.z-it.z) < it.r){ it.got = true; it.g.visible = false; if (it.kind === 'coin'){ save.coins += 1; SFX.coin(); } else { addInv(it.kind); SFX.item(); showMsg(ITEM_EMOJI[it.kind]+' '+it.kind+' ('+inv(it.kind)+')', 1200); } persist(); hud(); emit(it.x,it.y,it.z,12,{colors:[0xffd43b,0xfff3b0,0xffffff],speed:4,g:4,life:0.6}); } }
  // checkpoints & finish
  for (const c of checkpoints) if (!c.on && Math.abs(P.x-c.x) < 1.6 && Math.abs(P.z-c.z) < 1.6 && Math.abs(P.y-c.y) < 1.2){ c.on = true; c.flag.material = mat(0x37d67a,{emissive:0x0a5a2a,emissiveIntensity:0.5}); SFX.check(); emit(c.x,c.y+1,c.z,25,{colors:[0x37d67a,0xffffff],speed:5,g:3,life:1}); if (c.n > 0) showMsg('Checkpoint '+c.n+' ✅', 1200); }
  for (const f of courseFinish) if (Math.abs(P.x-f.x) < 2.2 && Math.abs(P.z-f.z) < 2.2 && Math.abs(P.y-f.y) < 2){ const q = activeQuests().find(q => q.type==='course' && q.target===f.id); if (q){ SFX.win(); emit(P.x,P.y+2,P.z,60,{colors:[0xff4d88,0xffd43b,0x37d67a,0x3498db,0xffffff],speed:7,g:5,life:2,size:1.3,up:1.5}); const n = npcById(q.npc); openDialog(n.cfg.name, q.lines.done, () => { completeQuest(q); P.x = n.x+2; P.z = n.z+2; P.y = 0.5; P.safe = {x:P.x,y:0,z:P.z}; }); } else if (!f.cheer || t-f.cheer > 5){ f.cheer = t; showMsg('🏁 Finish! (Accept the quest from Captain Finn first)', 2000); } }
  // hide & seek proximity
  activeQuests().filter(q => q.type==='hide').forEach(q => { const n = npcById(q.npc); if (n.hideIdx >= 0 && Math.hypot(P.x-n.x,P.z-n.z) < 3.5 && !dialog){ hideFound(q, n); } });
  // trail + anim
  const tr = shopItem(save.eq.trail); const sp = Math.hypot(P.vx,P.vz); if (tr && tr.cols && (sp > 2 || !P.ground)){ trailT += dt; if (trailT > 0.03){ trailT = 0; emit(P.x,P.y+0.6,P.z,2,{colors:tr.cols,speed:1,g:-1,life:0.7,size:0.9,spread:0.6}); } }
  P.walk += dt*sp*1.7; animChar(HP, t, { walk:P.walk, speed:sp, air:!P.ground }); if (HP.wings){ HP.wings[0].rotation.y = 0.4+Math.sin(t*8)*0.3; HP.wings[1].rotation.y = -0.4-Math.sin(t*8)*0.3; }
}
function updateKart(k, dt, t){
  const mv = readMove(); const ix = clamp(mv.ix,-1,1), iz = clamp(mv.iz,-1,1); const nitro = (keys.Space||jumpBtn) && iz < 0; const maxV = 18*(nitro?1.5:1);
  if (iz < 0) k.speed += 14*dt*(nitro?1.6:1); else if (iz > 0) k.speed -= (k.speed > 0 ? 22 : 8)*dt; else k.speed *= Math.pow(0.3, dt); k.speed = clamp(k.speed, -7, maxV);
  k.yaw += -ix*2.2*dt*clamp(k.speed/8,-1,1); const fx = -Math.sin(k.yaw), fz = -Math.cos(k.yaw);
  k.vy -= 28*dt; k.launchCd -= dt; const e = { x:k.x, y:k.y, z:k.z, w:k.w, h:k.h, vx:fx*k.speed, vy:k.vy, vz:fz*k.speed, ground:false, onMover:k.onMover, bumped:false };
  moveEntity(e, dt, { step:0.5 }); if (e.bumped && Math.abs(k.speed) > 4){ k.speed *= -0.3; shake = 0.2; SFX.land(); } k.x = e.x; k.y = e.y; k.z = e.z; k.vy = e.vy; k.ground = e.ground; k.onMover = e.onMover;
  for (const r of ramps){ if (k.ground && k.launchCd <= 0 && Math.abs(k.x-r.x) < r.w/2 && Math.abs(k.z-r.z) < 1 && Math.abs(k.y-r.top) < 0.4 && k.speed > 6){ k.vy = Math.min(9, 3+k.speed*0.25); k.ground = false; k.launchCd = 1; SFX.pad(); emit(k.x,k.y,k.z,30,{colors:[0xffd43b,0xffffff],speed:6,g:8,life:0.7,spread:2}); } }
  k.g.position.set(k.x,k.y,k.z); k.g.rotation.y = k.yaw; k.g.rotation.z = lerp(k.g.rotation.z, -ix*0.08*clamp(k.speed/10,0,1), 0.2); k.wheels.forEach((w,i) => { w.rotation.x += k.speed*dt*2.2; if (i < 2) w.rotation.y = -ix*0.5; });
  if (Math.abs(k.speed) > 3 && k.ground){ trailT += dt; if (trailT > 0.05){ trailT = 0; emit(k.x-fx*2,k.y+0.2,k.z-fz*2,2,{colors:nitro?[0x00e5ff,0xffffff,0x3498db]:[0x888888,0xaaaaaa],speed:nitro?3:1.5,g:-1,life:nitro?0.6:0.9,size:nitro?1.2:0.8,spread:0.6}); } }
  P.x = k.x; P.y = k.y+0.55; P.z = k.z; P.yaw = k.yaw; let dy = k.yaw-camYaw; dy = Math.atan2(Math.sin(dy),Math.cos(dy)); if (look.id === null) camYaw += dy*(1-Math.pow(0.05,dt));
  for (const h of hazards){ if (h.water) continue; if (Math.abs(k.x-h.x) < h.w/2+0.8 && Math.abs(k.z-h.z) < h.d/2+0.8 && k.y < h.y+h.h/2+0.15){ die('fire'); return; } }
  for (const b of bars){ const dx = k.x-b.x, dz = k.z-b.z; const c = Math.cos(-b.a), s = Math.sin(-b.a); const lx = dx*c-dz*s, lz = dx*s+dz*c; if (Math.abs(lx) < b.len/2+1 && Math.abs(lz) < 1.5 && k.y < b.y+0.4 && k.y+1.2 > b.y-0.4){ die('bar'); return; } }
  if (k.y < -0.9){ die('water'); return; }
  for (const it of items){ if (!it.got && it.kind==='coin' && Math.hypot(k.x-it.x, k.z-it.z) < 2){ it.got = true; it.g.visible = false; save.coins++; hud(); SFX.coin(); } }
  if (k.ground && P.safeT !== undefined){ P.safe = { x:k.x, y:k.y, z:k.z }; }
  animChar(HP, t, { walk:0, speed:0, sit:true });
}
// ---------- render ----------
const camTarget = new THREE.Vector3(), camPos = new THREE.Vector3(), sunAnchor = new THREE.Vector3(999,999,999);
function render(dt){
  hero.position.set(P.x, P.y, P.z); hero.rotation.y = P.yaw;
  const dist = riding ? 11 : 9, cyy = Math.sin(camPitch)*dist + 1.5, ch = Math.cos(camPitch)*dist;
  camPos.set(P.x + Math.sin(camYaw)*ch, P.y+cyy, P.z + Math.cos(camYaw)*ch); if (state === 'menu'){ camPos.set(P.x + Math.sin(elapsedT*0.2)*14, P.y+6, P.z + Math.cos(elapsedT*0.2)*14); }
  camera.position.lerp(camPos, 1-Math.pow(0.001,dt)); if (shake > 0){ shake -= dt; camera.position.x += (Math.random()-.5)*shake*0.6; camera.position.y += (Math.random()-.5)*shake*0.6; }
  camTarget.set(P.x, P.y+1.6, P.z); camera.lookAt(camTarget);
  if (Math.hypot(P.x-sunAnchor.x, P.z-sunAnchor.z) > 18 || Math.abs(P.y-sunAnchor.y) > 10){ sunAnchor.set(Math.round(P.x/6)*6, Math.round(P.y/6)*6, Math.round(P.z/6)*6); sun.position.set(sunAnchor.x+30, sunAnchor.y+60, sunAnchor.z+25); sun.target.position.copy(sunAnchor); }
  sky.position.copy(camera.position); sea.position.x = Math.round(P.x/50)*50; sea.position.z = Math.round(P.z/50)*50;
  renderer.render(scene, camera);
}
let last = performance.now();
function loop(){ const now = performance.now(); const dt = Math.min(0.05,(now-last)/1000); last = now; if (state === 'menu') elapsedT += dt; try { update(dt); } catch(e){ console.error(e); } updateParts(dt); try { updatePeers(dt, now/1000); } catch(e){} render(dt); requestAnimationFrame(loop); }
// ---------- boot ----------
loadIsland(clamp(save.island||0, 0, (save.unlocked||1)-1)); buildHero(); renderIslands(); hud(); P.ground = true; P.y = 0; loop(); if (!save.name) askName();
