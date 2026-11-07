// ===== Szymon's Island Adventure — engine =====
'use strict';
const $ = id => document.getElementById(id);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a+(b-a)*t;
function rng(seed){ let s = seed>>>0 || 1; return () => { s = (s*1664525 + 1013904223)>>>0; return s/4294967296; }; }
const R = rng(20261107);

// ---------- SAVE ----------
const SAVE_KEY = 'islandAdventure_v1';
let save = { name:'', coins:0, owned:['hoodie_yellow','cap_red','kart_red'], eq:{ hoodie:'hoodie_yellow', cap:'cap_red', glasses:false, backpack:true, kart:'kart_red', trail:'trail_none' }, quests:{}, items:{}, words:[], chests:[], stars:{}, sound:true, tutorial:false };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) save = Object.assign(save, s); } catch(e){}
function persist(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch(e){} }

// ---------- AUDIO ----------
let AC = null, master = null, musicOn = false, musicTimer = null;
function ensureAC(){ if (!AC){ try { AC = new (window.AudioContext||window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = save.sound ? 1 : 0; master.connect(AC.destination); } catch(e){} } if (AC && AC.state === 'suspended') AC.resume(); }
function beep(f, d=0.08, type='square', v=0.07, delay=0, slide=0){
  if (!AC) return; try { const o = AC.createOscillator(), g = AC.createGain(); const t0 = AC.currentTime + delay;
    o.type = type; o.frequency.setValueAtTime(f, t0); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide), t0+d);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + d + 0.02); } catch(e){}
}
const SFX = {
  jump: () => beep(420,0.12,'square',0.04,0,300), djump: () => { beep(600,0.1,'triangle',0.06,0,400); beep(900,0.12,'triangle',0.05,0.06,300); },
  land: () => beep(120,0.06,'sine',0.05), coin: () => { beep(988,0.07,'sine',0.09); beep(1319,0.14,'sine',0.08,0.07); },
  item: () => { beep(660,0.08,'sine',0.08); beep(880,0.1,'sine',0.08,0.08); beep(1320,0.16,'sine',0.07,0.16); },
  die: () => { beep(200,0.35,'sawtooth',0.08,0,-150); beep(90,0.4,'square',0.05,0.05); },
  check: () => { [660,880,1100].forEach((f,i)=>beep(f,0.14,'sine',0.07,i*0.08)); },
  pad: () => { beep(250,0.15,'triangle',0.07,0,500); beep(700,0.25,'triangle',0.06,0.1,400); },
  win: () => { [523,659,784,1046,1318].forEach((f,i)=>beep(f, i===4?0.7:0.16, 'square', 0.06, i*0.14)); },
  quest: () => { [523,659,784,1046].forEach((f,i)=>beep(f,0.18,'triangle',0.07,i*0.1)); },
  talk: () => beep(700,0.05,'sine',0.04), click: () => beep(500,0.05,'sine',0.05), nope: () => beep(180,0.2,'sawtooth',0.05),
  correct: () => { beep(784,0.1,'sine',0.08); beep(1046,0.2,'sine',0.08,0.1); }, wrong: () => { beep(300,0.15,'square',0.05); beep(200,0.25,'square',0.05,0.12); },
  chest: () => { [392,523,659,784,1046].forEach((f,i)=>beep(f,0.2,'triangle',0.07,i*0.09)); },
};
const SONGS = [
  { bpm: 112, bass: [48,48,53,53,55,55,50,50], arp: [[72,76,79],[72,76,79],[77,81,84],[77,81,84],[79,83,86],[79,83,86],[74,77,81],[74,77,81]] },
];
let songIdx = 0, songStep = 0, nextNote = 0;
const mtof = m => 440*Math.pow(2,(m-69)/12);
function musicTick(){
  if (!AC || !musicOn) return; const song = SONGS[songIdx], beat = 60/song.bpm;
  while (nextNote < AC.currentTime + 0.3){ const bar = Math.floor(songStep/4)%8, sub = songStep%4; const dl = nextNote - AC.currentTime;
    if (sub === 0 || sub === 2) beep(mtof(song.bass[bar]), beat*0.45, 'triangle', 0.07, dl);
    const chord = song.arp[bar]; beep(mtof(chord[sub%3] + (sub===3?12:0)), beat*0.28, 'sine', 0.035, dl);
    if (sub === 0) beep(60, 0.08, 'sine', 0.1, dl, -40); nextNote += beat/2; songStep++; }
}
function startMusic(i=0){ ensureAC(); if (!AC) return; songIdx = i; songStep = 0; nextNote = AC.currentTime + 0.1; musicOn = true; if (!musicTimer) musicTimer = setInterval(musicTick, 100); }
function stopMusic(){ musicOn = false; }

// ---------- RENDERER / SCENE ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 700);
const hemi = new THREE.HemisphereLight(0xffffff, 0x6a9a4a, 0.75); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff4e0, 1.5); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera, { left:-50, right:50, top:50, bottom:-50, near:1, far:250 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
scene.add(sun); scene.add(sun.target);
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); });
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { top:{value:new THREE.Color(0x2f7fe8)}, mid:{value:new THREE.Color(0x8fd0ff)}, bot:{value:new THREE.Color(0xe8f6ff)}, sunDir:{value:new THREE.Vector3(0.4,0.6,0.3).normalize()}, sunCol:{value:new THREE.Color(0xfff2c0)} },
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform vec3 top,mid,bot,sunDir,sunCol; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h>0.0 ? mix(mid,top,pow(h,0.65)) : mix(mid,bot,pow(-h,0.5)); float s = max(dot(vP,sunDir),0.0); c += sunCol*(pow(s,256.0)*1.5 + pow(s,8.0)*0.25); gl_FragColor = vec4(c,1.0); }` });
const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), skyMat); scene.add(sky);
scene.fog = new THREE.Fog(0xbfe3ff, 90, 260);
const seaMat = new THREE.MeshStandardMaterial({ color: 0x2f9de8, roughness: 0.15, metalness: 0.05, transparent: true, opacity: 0.92 });
const sea = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), seaMat); sea.rotation.x = -Math.PI/2; sea.position.y = -1.2; sea.receiveShadow = true; scene.add(sea);
// ambient dust/butterflies
const AMB_N = 220; const ambGeo = new THREE.BufferGeometry(); const ambPos = new Float32Array(AMB_N*3); for (let i=0;i<AMB_N*3;i++) ambPos[i] = (Math.random()-.5)*120; ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos,3));
const ambMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.6 }); const amb = new THREE.Points(ambGeo, ambMat); scene.add(amb);

// ---------- GEOMETRY / MATERIAL HELPERS ----------
const geoCache = {};
function bgeo(w,h,d){ const k = 'b'+w+'_'+h+'_'+d; return geoCache[k] || (geoCache[k] = new THREE.BoxGeometry(w,h,d)); }
function rgeo(w,h,d,r){ r = Math.min(r, w/2-0.01, d/2-0.01, h/2-0.01); const k = 'r'+w+'_'+h+'_'+d+'_'+r; if (geoCache[k]) return geoCache[k];
  const s = new THREE.Shape(); const x=-w/2,y=-d/2; s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r); s.lineTo(x+w,y+d-r); s.quadraticCurveTo(x+w,y+d,x+w-r,y+d); s.lineTo(x+r,y+d); s.quadraticCurveTo(x,y+d,x,y+d-r); s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h-2*r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 6 }); g.rotateX(-Math.PI/2); g.computeVertexNormals();
  const b = new THREE.Box3().setFromBufferAttribute(g.attributes.position); g.translate(0, -(b.max.y+b.min.y)/2, 0); return geoCache[k] = g; }
const matCache = {};
function mat(color, extra){ if (!extra){ const k = 'm'+color; return matCache[k] || (matCache[k] = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.02 })); } return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.02 }, extra)); }
function mesh(geo, m, x=0,y=0,z=0, parent=scene){ const o = new THREE.Mesh(geo, m); o.position.set(x,y,z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
function sphere(r, m, x,y,z, parent, seg=16){ const k = 's'+r+'_'+seg; const g = geoCache[k] || (geoCache[k] = new THREE.SphereGeometry(r, seg, Math.max(8,seg*0.7|0))); return mesh(g, m, x,y,z, parent); }
function capsule(r, len, m, x,y,z, parent){ const k = 'c'+r+'_'+len; const g = geoCache[k] || (geoCache[k] = new THREE.CapsuleGeometry(r, len, 4, 12)); return mesh(g, m, x,y,z, parent); }
function cyl(rt, rb, h, m, x,y,z, parent, seg=12){ const k = 'y'+rt+'_'+rb+'_'+h+'_'+seg; const g = geoCache[k] || (geoCache[k] = new THREE.CylinderGeometry(rt, rb, h, seg)); return mesh(g, m, x,y,z, parent); }
function cone(r, h, m, x,y,z, parent, seg=8){ const k = 'k'+r+'_'+h+'_'+seg; const g = geoCache[k] || (geoCache[k] = new THREE.ConeGeometry(r, h, seg)); return mesh(g, m, x,y,z, parent); }
function textSprite(text, color='#ffd43b', scale=1, bg=null){ const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); if (bg){ g.fillStyle = bg; g.beginPath(); g.roundRect(60,20,392,88,30); g.fill(); } g.font = 'bold 60px Fredoka, Arial'; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = '#000'; g.strokeText(text, 256, 86); g.fillStyle = color; g.fillText(text, 256, 86); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false, transparent: true })); sp.scale.set(4*scale, 1*scale, 1); return sp; }

// ---------- COLLISION WORLD ----------
const blocks = [];   // {x,y,z,w,h,d, [isMover, vx,vz], [step]}
function solid(x,y,z,w,h,d, extra){ const b = Object.assign({ x,y,z,w,h,d }, extra||{}); blocks.push(b); return b; }
function aabbHit(e, b){ return e.x+e.w/2 > b.x-b.w/2 && e.x-e.w/2 < b.x+b.w/2 && e.z+e.w/2 > b.z-b.d/2 && e.z-e.w/2 < b.z+b.d/2 && e.y+e.h > b.y-b.h/2 && e.y < b.y+b.h/2; }
// moves entity e {x,y,z,w,h,vx,vy,vz,ground,onMover} with dt; returns landing info
function moveEntity(e, dt, opts={}){
  const stepH = opts.step||0;
  if (e.onMover){ e.x += e.onMover.vx; e.z += e.onMover.vz; } e.onMover = null;
  const tryStep = () => { if (!stepH) return false; for (const b of blocks){ if (b.ghost) continue; if (aabbHit(e,b)){ const top = b.y+b.h/2; if (top - e.y <= stepH && top - e.y > 0){ let free = true; const probe = { x:e.x, y:top+0.02, z:e.z, w:e.w, h:e.h }; for (const c of blocks){ if (c.ghost) continue; if (aabbHit(probe,c)){ free = false; break; } } if (free){ e.y = top; return true; } } } } return false; };
  e.x += e.vx*dt; for (const b of blocks){ if (b.ghost) continue; if (aabbHit(e,b)){ if (tryStep()) break; if (e.vx > 0) e.x = b.x-b.w/2-e.w/2; else e.x = b.x+b.w/2+e.w/2; e.vx = opts.bounce ? -e.vx*opts.bounce : 0; e.bumped = true; } }
  e.z += e.vz*dt; for (const b of blocks){ if (b.ghost) continue; if (aabbHit(e,b)){ if (tryStep()) break; if (e.vz > 0) e.z = b.z-b.d/2-e.w/2; else e.z = b.z+b.d/2+e.w/2; e.vz = opts.bounce ? -e.vz*opts.bounce : 0; e.bumped = true; } }
  const prevY = e.y; e.y += e.vy*dt; const wasGround = e.ground; e.ground = false;
  for (const b of blocks){ if (b.ghost) continue; if (aabbHit(e,b)){ const top = b.y+b.h/2; if (e.vy <= 0 && prevY >= top-0.45){ e.y = top; e.vy = 0; e.ground = true; e.groundBlock = b; if (b.isMover) e.onMover = b; } else if (e.vy > 0){ e.y = b.y-b.h/2-e.h; e.vy = 0; } } }
  return { landed: e.ground && !wasGround };
}

// ---------- PARTICLES ----------
const PN = 500; const pMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.28,0.28,0.28), new THREE.MeshBasicMaterial({ toneMapped: false }), PN); pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); pMesh.frustumCulled = false; scene.add(pMesh);
const parts = []; for (let i=0;i<PN;i++) parts.push({ life:0 }); let pIdx = 0; const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
function emit(x,y,z, n, opt={}){
  for (let i=0;i<n;i++){ const p = parts[pIdx]; pIdx = (pIdx+1)%PN; const sp = opt.speed||4;
    p.x = x + (Math.random()-.5)*(opt.spread||0.5); p.y = y + (Math.random()-.5)*(opt.spread||0.5); p.z = z + (Math.random()-.5)*(opt.spread||0.5);
    p.vx = (Math.random()-.5)*sp; p.vy = (Math.random()-.2)*sp*(opt.up||1); p.vz = (Math.random()-.5)*sp;
    p.life = p.max = (opt.life||0.6)*(0.6+Math.random()*0.8); p.g = opt.g===undefined?12:opt.g; p.size = (opt.size||1)*(0.6+Math.random()*0.8);
    const cols = opt.colors || [0xffffff]; p.col = cols[Math.floor(Math.random()*cols.length)]; p.rot = Math.random()*6; p.spin = (Math.random()-.5)*10; }
}
function updateParts(dt){
  for (let i=0;i<PN;i++){ const p = parts[i];
    if (p.life > 0){ p.life -= dt; p.vy -= p.g*dt; p.x += p.vx*dt; p.y += p.vy*dt; p.z += p.vz*dt; p.rot += p.spin*dt; const k = clamp(p.life/p.max,0,1); const s = p.size*k;
      _q.setFromAxisAngle(_p.set(0.3,1,0.2).normalize(), p.rot); _m.compose(_p.set(p.x,p.y,p.z), _q, _s.set(s,s,s)); pMesh.setMatrixAt(i,_m); pMesh.setColorAt(i,_c.set(p.col)); }
    else { _m.makeScale(0,0,0); pMesh.setMatrixAt(i,_m); } }
  pMesh.instanceMatrix.needsUpdate = true; if (pMesh.instanceColor) pMesh.instanceColor.needsUpdate = true;
}

// ---------- INPUT ----------
const keys = {}; const inputEv = { jump:false, action:false };
addEventListener('keydown', e => { if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return; keys[e.code] = true; if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault(); if (e.code === 'Space') inputEv.jump = true; if (e.code === 'KeyE' || e.code === 'Enter') inputEv.action = true; if (e.code === 'Escape') inputEv.esc = true; ensureAC(); });
addEventListener('keyup', e => keys[e.code] = false);
const joy = { active:false, id:null, ox:0, oy:0, x:0, y:0 }, look = { id:null, lx:0, ly:0 }; let jumpBtn = false, camYaw = 0, camPitch = 0.42;
function setupTouch(){
  const joyEl = $('joy'), knob = $('knob'), bj = $('bj'), be = $('be');
  if ('ontouchstart' in window) document.body.classList.add('touch');
  bj.addEventListener('pointerdown', e => { e.preventDefault(); jumpBtn = true; inputEv.jump = true; bj.classList.add('on'); ensureAC(); });
  ['pointerup','pointercancel','pointerleave'].forEach(ev => bj.addEventListener(ev, () => { jumpBtn = false; bj.classList.remove('on'); }));
  be.addEventListener('pointerdown', e => { e.preventDefault(); inputEv.action = true; ensureAC(); });
  const cvs = renderer.domElement;
  cvs.addEventListener('pointerdown', e => { ensureAC();
    if (e.pointerType === 'touch' && e.clientX < innerWidth*0.45 && !joy.active){ joy.active = true; joy.id = e.pointerId; joy.ox = e.clientX; joy.oy = e.clientY; joy.x = joy.y = 0; joyEl.style.display = 'block'; joyEl.style.left = (e.clientX-65)+'px'; joyEl.style.top = (e.clientY-65)+'px'; knob.style.left = '38px'; knob.style.top = '38px'; }
    else if (look.id === null){ look.id = e.pointerId; look.lx = e.clientX; look.ly = e.clientY; } });
  cvs.addEventListener('pointermove', e => {
    if (joy.active && e.pointerId === joy.id){ let dx = e.clientX-joy.ox, dy = e.clientY-joy.oy; const l = Math.hypot(dx,dy); if (l > 55){ dx = dx/l*55; dy = dy/l*55; } joy.x = dx/55; joy.y = dy/55; knob.style.left = (38+dx)+'px'; knob.style.top = (38+dy)+'px'; }
    else if (e.pointerId === look.id){ camYaw -= (e.clientX-look.lx)*0.006; camPitch = clamp(camPitch + (e.clientY-look.ly)*0.004, -0.1, 1.2); look.lx = e.clientX; look.ly = e.clientY; } });
  const endPtr = e => { if (e.pointerId === joy.id){ joy.active = false; joy.id = null; joy.x = joy.y = 0; joyEl.style.display = 'none'; } if (e.pointerId === look.id) look.id = null; };
  cvs.addEventListener('pointerup', endPtr); cvs.addEventListener('pointercancel', endPtr);
}
function readMove(){ let ix = 0, iz = 0; if (keys.KeyW||keys.ArrowUp) iz -= 1; if (keys.KeyS||keys.ArrowDown) iz += 1; if (keys.KeyA||keys.ArrowLeft) ix -= 1; if (keys.KeyD||keys.ArrowRight) ix += 1; if (joy.active){ ix += joy.x; iz += joy.y; } const l = Math.hypot(ix,iz); if (l > 1){ ix/=l; iz/=l; } return { ix, iz, l: Math.min(1,l), run: !!(keys.ShiftLeft||keys.ShiftRight) }; }
function camVectors(){ const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw), rx = Math.cos(camYaw), rz = -Math.sin(camYaw); return { fx, fz, rx, rz }; }
