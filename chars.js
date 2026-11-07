// ===== characters: cartoon hero + NPCs =====
'use strict';
const SKIN = 0xffd9b3, SKIN2 = 0xf3c08f, SKIN3 = 0xc68642;
const HOODIES = { hoodie_yellow:0xffd43b, hoodie_blue:0x3b82f6, hoodie_green:0x37d67a, hoodie_red:0xef4444, hoodie_purple:0x9b59b6, hoodie_black:0x222233, hoodie_pink:0xff6fae, hoodie_orange:0xff8c42 };
const CAPS = { cap_red:0xef4444, cap_blue:0x2563eb, cap_green:0x16a34a, cap_black:0x111111, cap_gold:0xffd43b, cap_none:null, cap_pirate:'pirate', cap_crown:'crown', cap_wizard:'wizard', cap_helmet:'helmet' };
// builds a chibi character into group g; cfg: {hoodie, pants, cap, skin, hair, glasses, backpack, beard, dress, hat, name, nameColor, scale}
function buildChar(g, cfg){
  while (g.children.length) g.remove(g.children[0]);
  const C = Object.assign({ hoodie:0xffd43b, pants:0x2f5fd6, shoes:0xffffff, skin:SKIN, hair:0x5a3a1a, cap:0xef4444, glasses:false, backpack:false, eyes:0x222233, scale:1 }, cfg);
  const P = {};
  const skinM = mat(C.skin), hoodM = mat(C.hoodie), pantM = mat(C.pants), hairM = mat(C.hair);
  // legs (pivot at hip)
  P.legL = new THREE.Group(); P.legL.position.set(-0.19,0.78,0); g.add(P.legL); capsule(0.15,0.35,pantM,0,-0.28,0,P.legL); const sl = mesh(rgeo(0.34,0.2,0.46,0.07), mat(C.shoes), 0,-0.62,0.06, P.legL);
  P.legR = new THREE.Group(); P.legR.position.set(0.19,0.78,0); g.add(P.legR); capsule(0.15,0.35,pantM,0,-0.28,0,P.legR); mesh(rgeo(0.34,0.2,0.46,0.07), mat(C.shoes), 0,-0.62,0.06, P.legR);
  // body
  P.body = new THREE.Group(); P.body.position.y = 0.78; g.add(P.body);
  if (C.dress){ cone(0.55,0.95,hoodM,0,0.38,0,P.body,16); } else { capsule(0.42,0.5,hoodM,0,0.45,0,P.body); mesh(rgeo(0.5,0.18,0.3,0.06),mat(C.hoodie),0,0.0,0,P.body); }
  if (C.apron){ mesh(rgeo(0.5,0.6,0.1,0.05), mat(C.apron), 0,0.35,0.4, P.body); }
  if (C.tie){ mesh(rgeo(0.1,0.4,0.05,0.02), mat(C.tie), 0,0.55,0.44, P.body); }
  // arms (pivot at shoulder)
  P.armL = new THREE.Group(); P.armL.position.set(-0.52,0.85,0); P.body.add(P.armL); capsule(0.13,0.4,hoodM,0,-0.3,0,P.armL); sphere(0.15,skinM,0,-0.62,0,P.armL,12);
  P.armR = new THREE.Group(); P.armR.position.set(0.52,0.85,0); P.body.add(P.armR); capsule(0.13,0.4,hoodM,0,-0.3,0,P.armR); sphere(0.15,skinM,0,-0.62,0,P.armR,12);
  if (C.backpack){ mesh(rgeo(0.6,0.7,0.3,0.1), mat(C.backpackColor||0x2563eb), 0,0.5,-0.45, P.body); mesh(rgeo(0.4,0.3,0.12,0.05), mat(0xffd43b), 0,0.35,-0.62, P.body); }
  // head
  P.head = new THREE.Group(); P.head.position.y = 1.2; P.body.add(P.head);
  const hd = sphere(0.62,skinM,0,0.55,0,P.head,24); hd.scale.set(1,0.95,0.95);
  // eyes
  [-0.22,0.22].forEach(ex => { const w = sphere(0.17,mat(0xffffff,{roughness:0.2}),ex,0.58,0.5,P.head,16); w.scale.set(1,1.25,0.6); const pu = sphere(0.085,mat(C.eyes),ex*1.05,0.56,0.63,P.head,12); const hl = sphere(0.03,mat(0xffffff,{emissive:0xffffff,emissiveIntensity:0.6}),ex*1.05+0.04,0.62,0.69,P.head,8); });
  // brows / mouth / cheeks
  [-0.22,0.22].forEach(ex => { mesh(rgeo(0.2,0.05,0.04,0.015), hairM, ex,0.82,0.52, P.head); });
  const mouth = mesh(rgeo(0.22,0.06,0.04,0.02), mat(0x7a2e2e), 0,0.3,0.6, P.head); P.mouth = mouth;
  [-0.4,0.4].forEach(ex => { const c = sphere(0.09,mat(0xffa6b8),ex,0.42,0.42,P.head,10); c.scale.set(1,0.7,0.4); });
  if (C.beard){ const b = sphere(0.5,mat(C.beard),0,0.22,0.2,P.head,16); b.scale.set(1,0.6,0.8); }
  if (C.mustache){ mesh(rgeo(0.36,0.09,0.08,0.04), mat(C.mustache), 0,0.36,0.6, P.head); }
  if (C.glasses){ [-0.22,0.22].forEach(ex => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.19,0.03,8,20), mat(0x222222)); r.position.set(ex,0.58,0.62); P.head.add(r); }); mesh(bgeo(0.12,0.03,0.03), mat(0x222222), 0,0.58,0.64, P.head); }
  if (C.sunglasses){ mesh(rgeo(0.78,0.2,0.1,0.06), mat(0x111111,{roughness:0.2,metalness:0.5}), 0,0.58,0.58, P.head); }
  // hair
  const hairTop = sphere(0.6,hairM,0,0.75,-0.08,P.head,20); hairTop.scale.set(1.02,0.55,1.0);
  if (C.hairStyle === 'bun'){ sphere(0.25,hairM,0,1.15,-0.3,P.head,12); }
  if (C.hairStyle === 'long'){ const hl = sphere(0.62,hairM,0,0.5,-0.2,P.head,20); hl.scale.set(1,1,0.8); }
  if (C.hairStyle === 'spiky'){ for (let i=0;i<4;i++) cone(0.12,0.4,hairM,-0.3+i*0.2,1.15,0.1,P.head,6); }
  // cap / hats
  const cap = C.cap; P.hat = null;
  if (typeof cap === 'number'){ const cm = mat(cap); const dome = sphere(0.64,cm,0,0.78,-0.02,P.head,20); dome.scale.set(1,0.6,1); const peak = cyl(0.5,0.5,0.1,cm,0,0.74,C.capBack?-0.45:0.45,P.head,16); peak.scale.set(1,1,0.8); const btn = sphere(0.08,cm,0,1.14,-0.02,P.head,8); }
  else if (cap === 'straw'){ const sm = mat(0xf4d58d); cyl(0.95,0.95,0.06,sm,0,0.8,0,P.head,20); cyl(0.55,0.6,0.35,sm,0,0.98,0,P.head,20); cyl(0.57,0.57,0.08,mat(0xef4444),0,0.88,0,P.head,20); }
  else if (cap === 'chef'){ const cm = mat(0xffffff); cyl(0.5,0.52,0.3,cm,0,0.95,0,P.head,16); sphere(0.6,cm,0,1.25,0,P.head,16).scale.set(1,0.7,1); }
  else if (cap === 'sailor'){ const cm = mat(0xffffff); cyl(0.6,0.6,0.25,cm,0,0.9,0,P.head,16); cyl(0.62,0.62,0.08,mat(0x1e3a8a),0,0.8,0,P.head,16); cyl(0.5,0.5,0.1,mat(0x111111),0,0.78,0.45,P.head,16).scale.set(1,1,0.7); }
  else if (cap === 'pirate'){ const cm = mat(0x222222); const h = sphere(0.66,cm,0,0.8,0,P.head,16); h.scale.set(1.3,0.5,1.1); mesh(rgeo(0.3,0.3,0.05,0.05), mat(0xffffff), 0,0.98,0.6, P.head); }
  else if (cap === 'crown'){ const cm = mat(0xffd43b,{metalness:0.6,roughness:0.3}); cyl(0.5,0.5,0.25,cm,0,1.0,0,P.head,8); for (let i=0;i<6;i++){ const a=i/6*Math.PI*2; cone(0.1,0.25,cm,Math.cos(a)*0.46,1.22,Math.sin(a)*0.46,P.head,4); } sphere(0.09,mat(0xef4444,{emissive:0x880000,emissiveIntensity:0.4}),0,1.0,0.5,P.head,8); }
  else if (cap === 'wizard'){ const cm = mat(0x4a2a8a); cyl(0.95,0.95,0.06,cm,0,0.8,0,P.head,20); cone(0.5,1.2,cm,0,1.4,0,P.head,12); }
  else if (cap === 'helmet'){ const cm = mat(0xf59e0b); const h = sphere(0.68,cm,0,0.72,0,P.head,20); h.scale.set(1,0.75,1); cyl(0.72,0.72,0.08,cm,0,0.6,0.2,P.head,20).scale.set(1,1,0.9); }
  else if (cap === 'beanie'){ const cm = mat(C.beanie||0xef4444); const h = sphere(0.66,cm,0,0.8,0,P.head,20); h.scale.set(1,0.75,1); sphere(0.14,mat(0xffffff),0,1.32,0,P.head,8); }
  else if (cap === 'antenna'){ cyl(0.04,0.04,0.6,mat(0x888888),0,1.4,0,P.head,6); sphere(0.1,mat(0xff2bd6,{emissive:0xff2bd6,emissiveIntensity:1}),0,1.72,0,P.head,8); }
  // name tag
  if (C.name){ const sp = textSprite(C.name, C.nameColor||'#ffd43b', 0.7); sp.position.y = 2.55; g.add(sp); P.tag = sp; }
  g.scale.setScalar(C.scale);
  g.traverse(o => { if (o.isMesh){ o.castShadow = true; o.receiveShadow = false; } });
  P.cfg = C; return P;
}
// animation: a = {walk, speed, air, sit, wave, talk, dance}
function animChar(P, t, a){
  const sp = clamp(a.speed/7, 0, 1.3); const sw = a.sit ? 0 : Math.sin(a.walk)*0.9*sp;
  if (a.sit){ P.legL.rotation.x = P.legR.rotation.x = -1.5; P.armL.rotation.x = P.armR.rotation.x = -0.9; P.armL.rotation.z = P.armR.rotation.z = 0; }
  else if (a.air){ P.legL.rotation.x = 0.5; P.legR.rotation.x = -0.3; P.armL.rotation.z = 1.2 + Math.sin(t*10)*0.1; P.armR.rotation.z = -1.2 - Math.sin(t*10)*0.1; P.armL.rotation.x = P.armR.rotation.x = 0; }
  else if (a.dance){ P.legL.rotation.x = Math.sin(t*8)*0.5; P.legR.rotation.x = -Math.sin(t*8)*0.5; P.armL.rotation.z = 2.4 + Math.sin(t*8)*0.5; P.armR.rotation.z = -2.4 - Math.cos(t*8)*0.5; P.armL.rotation.x = P.armR.rotation.x = 0; P.body.rotation.y = Math.sin(t*4)*0.3; P.head.rotation.z = Math.sin(t*8)*0.2; return; }
  else { P.legL.rotation.x = sw; P.legR.rotation.x = -sw; P.armL.rotation.x = -sw*0.8; P.armR.rotation.x = sw*0.8; P.armL.rotation.z = 0.15; P.armR.rotation.z = -0.15; }
  if (a.wave){ P.armR.rotation.z = -2.6 + Math.sin(t*10)*0.35; P.armR.rotation.x = 0; }
  P.body.rotation.y = 0; P.head.rotation.z = a.sit ? 0 : Math.sin(t*2)*0.03; P.head.rotation.x = a.talk ? Math.sin(t*12)*0.05 : 0;
  P.body.position.y = 0.78 + (sp > 0.05 && !a.air && !a.sit ? Math.abs(Math.sin(a.walk))*0.08*sp : Math.sin(t*2)*0.02);
  if (P.mouth){ P.mouth.scale.y = a.talk ? 1 + Math.abs(Math.sin(t*14))*2.2 : 1; }
}
// ---- animals ----
function buildAnimal(g, kind, name){
  while (g.children.length) g.remove(g.children[0]); const P = { kind };
  if (kind === 'dog'){ const fm = mat(0xc8a06a); const body = capsule(0.32,0.6,fm,0,0.55,0,g); body.rotation.z = Math.PI/2; const head = sphere(0.33,fm,0,0.85,0.55,g,16); sphere(0.2,mat(0xe6c89a),0,0.75,0.8,g,10); [-0.14,0.14].forEach(ex => { sphere(0.07,mat(0x222222),ex,0.95,0.82,g,8); const ear = sphere(0.12,mat(0x8a6a3a),ex*1.8,1.08,0.45,g,8); ear.scale.set(0.6,1.2,0.6); }); sphere(0.07,mat(0x222222),0,0.78,0.98,g,8); P.legs = []; [[-0.18,0.3],[0.18,0.3],[-0.18,-0.3],[0.18,-0.3]].forEach(([x,z]) => { const l = new THREE.Group(); l.position.set(x,0.4,z); g.add(l); cyl(0.08,0.08,0.4,fm,0,-0.2,0,l,8); P.legs.push(l); }); const tail = cyl(0.05,0.03,0.5,fm,0,0.8,-0.6,g,6); tail.rotation.x = -0.8; P.tail = tail; }
  else if (kind === 'chicken'){ const wm = mat(0xffffff); const b = sphere(0.3,wm,0,0.45,0,g,14); b.scale.set(1,0.9,1.2); sphere(0.2,wm,0,0.8,0.25,g,12); cone(0.06,0.18,mat(0xf59e0b),0,0.78,0.48,g,6).rotation.x = Math.PI/2; mesh(bgeo(0.06,0.14,0.12), mat(0xef4444), 0,1.0,0.2, g); [-0.08,0.08].forEach(ex => sphere(0.04,mat(0x222222),ex,0.85,0.4,g,6)); [-0.1,0.1].forEach(ex => cyl(0.03,0.03,0.3,mat(0xf59e0b),ex,0.15,0,g,6)); }
  else if (kind === 'cow'){ const wm = mat(0xffffff); const body = mesh(rgeo(0.9,0.8,1.5,0.3), wm, 0,0.9,0, g); [[0.2,1.1,0.3],[-0.3,0.8,-0.4],[0.1,1.0,-0.6]].forEach(([x,y,z]) => { const s = sphere(0.22,mat(0x222222),x,y,z,g,10); s.scale.set(1,0.9,1.2); }); const head = mesh(rgeo(0.6,0.6,0.6,0.2), wm, 0,1.15,0.95, g); mesh(rgeo(0.5,0.3,0.3,0.1), mat(0xffb6c1), 0,1.0,1.2, g); [-0.2,0.2].forEach(ex => { sphere(0.06,mat(0x222222),ex,1.3,1.25,g,6); cone(0.06,0.25,mat(0xeeeeee),ex*1.7,1.5,0.9,g,6); }); P.legs = []; [[-0.3,0.5],[0.3,0.5],[-0.3,-0.5],[0.3,-0.5]].forEach(([x,z]) => { const l = new THREE.Group(); l.position.set(x,0.5,z); g.add(l); cyl(0.12,0.12,0.5,wm,0,-0.25,0,l,8); P.legs.push(l); }); }
  else if (kind === 'owl'){ const bm = mat(0x8b5a2b); const body = sphere(0.5,bm,0,0.7,0,g,18); body.scale.set(1,1.2,0.9); const belly = sphere(0.35,mat(0xd9b38c),0,0.6,0.25,g,14); belly.scale.set(1,1.2,0.5); [-0.2,0.2].forEach(ex => { const w = sphere(0.24,mat(0xffffff),ex,1.0,0.35,g,14); const p = sphere(0.12,mat(0x222222),ex,1.0,0.52,g,10); sphere(0.04,mat(0xffffff),ex+0.05,1.06,0.6,g,6); cone(0.1,0.3,bm,ex*1.6,1.35,0,g,5); }); cone(0.08,0.2,mat(0xf59e0b),0,0.85,0.55,g,6).rotation.x = Math.PI/2; [-0.5,0.5].forEach(ex => { const wg = sphere(0.22,bm,ex,0.6,0,g,10); wg.scale.set(0.5,1.4,0.9); }); const gl1 = new THREE.Mesh(new THREE.TorusGeometry(0.25,0.03,6,20), mat(0x222222)); gl1.position.set(-0.2,1.0,0.5); g.add(gl1); const gl2 = gl1.clone(); gl2.position.x = 0.2; g.add(gl2); const hat = cyl(0.3,0.3,0.25,mat(0x222222),0,1.5,0,g,12); cyl(0.5,0.5,0.05,mat(0x222222),0,1.38,0,g,12); }
  else if (kind === 'robot'){ const mm = mat(0x9ca3af,{metalness:0.7,roughness:0.3}); mesh(rgeo(0.9,1.0,0.6,0.15), mm, 0,0.9,0, g); mesh(rgeo(0.8,0.7,0.7,0.15), mm, 0,1.75,0, g); mesh(rgeo(0.6,0.25,0.1,0.05), mat(0x00e5ff,{emissive:0x00e5ff,emissiveIntensity:1}), 0,1.8,0.35, g); [-0.2,0.2].forEach(ex => sphere(0.08,mat(0x111111),ex,1.8,0.4,g,8)); cyl(0.04,0.04,0.4,mm,0,2.3,0,g,6); P.light = sphere(0.1,mat(0xff2bd6,{emissive:0xff2bd6,emissiveIntensity:1.2}),0,2.5,0,g,8); [-0.6,0.6].forEach(ex => { cyl(0.1,0.1,0.8,mm,ex,0.95,0,g,8); sphere(0.14,mm,ex,0.5,0,g,8); }); [-0.25,0.25].forEach(ex => cyl(0.14,0.14,0.4,mm,ex,0.2,0,g,8)); mesh(rgeo(0.5,0.5,0.4,0.1), mat(0x374151), 0,0.9,-0.45, g); }
  if (name){ const sp = textSprite(name, '#aee8ff', 0.7); sp.position.y = kind==='cow'?2.1:kind==='robot'?2.9:1.9; g.add(sp); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return P;
}
function animAnimal(P, t, moving){ if (P.legs){ P.legs.forEach((l,i) => l.rotation.x = moving ? Math.sin(t*10 + (i%2?Math.PI:0))*0.6 : 0); } if (P.tail) P.tail.rotation.z = Math.sin(t*8)*0.4; if (P.light) P.light.material.emissiveIntensity = 0.6 + Math.sin(t*4)*0.5; }
