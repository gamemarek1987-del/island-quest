// ===== world builder =====
'use strict';
const world = new THREE.Group(); scene.add(world);
let theme = null; const movers = [], bars = [], pads = [], killers = [], hazards = [], items = [], npcs = [], chests = [], signs = [], karts = [], ramps = [], lamps = [], waters = [], triggers = [];
let checkpoints = [], courseFinish = [];
const THEMES = {
  sunny: { name:'Sunny Island', grass:0x7ed957, grass2:0x6cc84a, dirt:0x9c6b3c, sand:0xf4e2a0, rock:0x9aa3ad, water:0x2f9de8, sky:[0x2f7fe8,0x8fd0ff,0xe8f6ff], fog:0xbfe3ff, leaf:[0x3ddc84,0x2ecc71,0x58e39a,0x27ae60], trunk:0x8b5a2b, amb:'fireflies', decor:'tree' },
  snow:  { name:'Frosty Peak', grass:0xf1f8ff, grass2:0xdfeeff, dirt:0xb7c4d4, sand:0xe8f0f8, rock:0x8fa3b8, water:0x6fc3ff, sky:[0x1d4f9c,0xa9d6ff,0xffffff], fog:0xd8ecff, leaf:[0x2f9e5d,0x3bb06e,0xe8f6ff], trunk:0x5c3f2a, amb:'snow', decor:'pine' },
  jungle:{ name:'Volcano Jungle', grass:0x3fae4a, grass2:0x2f8f3c, dirt:0x6b4a2a, sand:0x2d2d2d, rock:0x5a4a4a, water:0x1f8fcf, sky:[0xff8c42,0xffc27a,0xfff0d0], fog:0xffd9b0, leaf:[0x2ecc71,0x1e9e5a,0x7fe04a,0x16a34a], trunk:0x6b4a2a, amb:'embers', decor:'palm' },
};
function clearWorld(){ groundLayer = 0; while (world.children.length){ const c = world.children.pop(); } blocks.length = 0; [movers,bars,pads,killers,hazards,items,npcs,chests,signs,karts,ramps,lamps,waters,triggers].forEach(a => a.length = 0); checkpoints = []; courseFinish = []; }
function setTheme(t){ theme = THEMES[t]; skyMat.uniforms.top.value.set(theme.sky[0]); skyMat.uniforms.mid.value.set(theme.sky[1]); skyMat.uniforms.bot.value.set(theme.sky[2]); scene.fog.color.set(theme.fog); seaMat.color.set(theme.water); ambMat.color.set(theme.amb==='snow'?0xffffff:theme.amb==='embers'?0xffaa33:0xffffaa); ambMat.size = theme.amb==='snow'?0.3:0.18; }
const W = (geo, m, x,y,z) => mesh(geo, m, x,y,z, world);
// ---- terrain pieces (collidable) ----
let groundLayer = 0;
function ground(x,z,w,d, h=2, color, top){ color = color||theme.dirt; top = top===undefined?theme.grass:top; const lift = groundLayer*0.06; groundLayer++; const b = W(rgeo(w,h,d,0.8), mat(color), x,-h/2+lift,z); b.receiveShadow = true; if (top !== null){ const t = W(rgeo(w-0.6,0.4,d-0.6,0.3), mat(top), x,-0.14+lift,z); t.receiveShadow = true; } solid(x,-h/2+lift,z,w,h,d); return b; }
function plateau(x,y,z,w,d,h, color, top){ const b = W(rgeo(w,h,d,0.6), mat(color||theme.rock), x,y-h/2,z); b.receiveShadow = true; if (top !== null){ W(rgeo(w-0.5,0.3,d-0.5,0.25), mat(top||theme.grass), x,y-0.1,z).receiveShadow = true; } solid(x,y-h/2,z,w,h,d); return b; }
function platformBlock(x,y,z,w,d,color,h=1.2){ const b = W(rgeo(w,h,d,0.3), mat(color), x,y-h/2,z); b.receiveShadow = true; solid(x,y-h/2,z,w,h,d); return b; }
function path(x,z,w,d, color){ const p = W(rgeo(w,0.12,d,0.3), mat(color||0xd9c7a3), x,0.12,z); p.receiveShadow = true; p.castShadow = false; }
function water(x,z,w,d){ const m = W(new THREE.PlaneGeometry(w,d), mat(theme.water,{roughness:0.1,transparent:true,opacity:0.9}), x,0.08,z); m.rotation.x = -Math.PI/2; m.castShadow = false; waters.push({x,z,w,d}); hazards.push({ x,y:-0.4,z,w,h:1,d, water:true }); solid(x,-0.5,z,w,0.8,d,{ghost:true}); }
// ---- decor ----
function tree(x,z,y=0,s=1,type){ const t = type||theme.decor; if (t==='pine'){ cyl(0.2*s,0.3*s,1.2*s,mat(theme.trunk),x,y+0.6*s,z,world,8); [1.6,1.2,0.8].forEach((r,i) => { const c = cone(r*s,1.8*s,mat(theme.leaf[i%theme.leaf.length]),x,y+(1.6+i*1.1)*s,z,world,8); if (theme.amb==='snow'){ const sn = cone(r*s*0.95,0.35*s,mat(0xffffff),x,y+(1.6+i*1.1+0.75)*s,z,world,8); } }); }
  else if (t==='palm'){ const tr = cyl(0.18*s,0.3*s,3.4*s,mat(theme.trunk),x,y+1.7*s,z,world,8); tr.rotation.z = 0.12; for (let i=0;i<6;i++){ const a = i/6*Math.PI*2; const l = mesh(rgeo(2.4*s,0.08*s,0.6*s,0.04), mat(theme.leaf[i%theme.leaf.length]), x+Math.cos(a)*1.1*s, y+3.4*s, z+Math.sin(a)*1.1*s, world); l.rotation.y = -a; l.rotation.z = 0.35; } sphere(0.22*s,mat(0x6b4a2a),x+0.3*s,y+3.1*s,z,world,8); }
  else { cyl(0.22*s,0.32*s,1.6*s,mat(theme.trunk),x,y+0.8*s,z,world,10); [[1.3,0,1.6,0],[1.0,0.5,2.4,0.3],[0.9,-0.5,2.3,-0.3],[0.7,0.1,3.1,0]].forEach(([r,dx,dy,dz],i) => sphere(r*s,mat(theme.leaf[i%theme.leaf.length]),x+dx*s,y+dy*s,z+dz*s,world,14)); }
  solid(x,y+1,z,0.7*s,2,0.7*s); }
function bush(x,z,y=0,s=1){ sphere(0.7*s,mat(theme.leaf[1]),x,y+0.5*s,z,world,12); sphere(0.5*s,mat(theme.leaf[2]),x+0.5*s,y+0.4*s,z+0.2*s,world,10); }
function flower(x,z,y=0,color=0xff6fae){ cyl(0.03,0.03,0.4,mat(0x2e8b3a),x,y+0.2,z,world,5); for (let i=0;i<5;i++){ const a=i/5*Math.PI*2; sphere(0.08,mat(color),x+Math.cos(a)*0.1,y+0.42,z+Math.sin(a)*0.1,world,6); } sphere(0.07,mat(0xffd43b),x,y+0.45,z,world,6); }
function rock(x,z,y=0,s=1,color){ const r = sphere(0.8*s,mat(color||theme.rock,{roughness:0.95,flatShading:true}),x,y+0.4*s,z,world,7); r.scale.set(1.3,0.7,1); r.rotation.y = R()*3; solid(x,y+0.3*s,z,1.6*s,0.8*s,1.3*s); }
function fence(x1,z1,x2,z2){ const len = Math.hypot(x2-x1,z2-z1); const n = Math.max(1,Math.round(len/2)); const a = Math.atan2(x2-x1,z2-z1); const fm = mat(0xd9b27c); for (let i=0;i<=n;i++){ const t=i/n; cyl(0.08,0.08,1.1,fm,x1+(x2-x1)*t,0.55,z1+(z2-z1)*t,world,6); } [0.45,0.85].forEach(h => { const r = mesh(bgeo(0.08,0.1,len), fm, (x1+x2)/2,h,(z1+z2)/2, world); r.rotation.y = a; }); solid((x1+x2)/2,0.5,(z1+z2)/2, Math.abs(x2-x1)+0.3, 1, Math.abs(z2-z1)+0.3); }
function lamp(x,z,y=0){ cyl(0.08,0.1,3,mat(0x333333),x,y+1.5,z,world,8); const l = sphere(0.28,mat(0xfff2b0,{emissive:0xffe080,emissiveIntensity:1.2}),x,y+3.1,z,world,10); const pl = new THREE.PointLight(0xffe0a0, 0.0, 9); pl.position.set(x,y+3,z); world.add(pl); lamps.push({pl,l}); }
function bench(x,z,rot=0,y=0){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = rot; world.add(g); const wm = mat(0xb07a45); mesh(rgeo(2,0.12,0.6,0.04), wm, 0,0.5,0, g); mesh(rgeo(2,0.5,0.1,0.04), wm, 0,0.85,-0.28, g); [-0.8,0.8].forEach(ex => mesh(bgeo(0.1,0.5,0.5), mat(0x333333), ex,0.25,0, g)); solid(x,0.5,z,2,1,0.7); }
function house(x,z,rot=0,wall=0xfff1d6,roof=0xe74c3c,w=6,d=5,h=3.2,y=0){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = rot; world.add(g);
  mesh(rgeo(w,h,d,0.2), mat(wall), 0,h/2,0, g); const rf = mesh(new THREE.ConeGeometry(Math.max(w,d)*0.78, h*0.75, 4), mat(roof), 0,h+h*0.37,0, g); rf.rotation.y = Math.PI/4;
  mesh(rgeo(1.1,1.9,0.15,0.08), mat(0x7a4b24), 0,0.95,d/2+0.02, g); sphere(0.08,mat(0xffd43b),0.35,0.95,d/2+0.12,g,6);
  [-w/3,w/3].forEach(ex => { mesh(rgeo(1.1,1.0,0.12,0.06), mat(0x9fd8ff,{emissive:0x335577,emissiveIntensity:0.5}), ex,1.9,d/2+0.02, g); mesh(rgeo(1.3,0.12,0.2,0.04), mat(0x7a4b24), ex,1.35,d/2+0.08, g); });
  mesh(bgeo(0.6,1.2,0.6), mat(0x8a8a8a), w/3,h+1.0,-d/4, g);
  const cs = Math.cos(rot), sn = Math.sin(rot); const ww = Math.abs(w*cs)+Math.abs(d*sn), dd = Math.abs(w*sn)+Math.abs(d*cs); solid(x,y+h/2,z,ww,h,dd);
  const door = { kind:'door', x: x + sn*(d/2+2.0), z: z + cs*(d/2+2.0), r:2.4, g, rot, outX: x + sn*(d/2+3.0), outZ: z + cs*(d/2+3.0) }; triggers.push(door); door.room = interior(door, roof); return g; }
let interiorCount = 0;
function interior(door, accent){ const idx = interiorCount++; const cx = 0, cz = -600 - idx*40; const wm = mat(0xfff1d6), fm = mat(0xc9a37a);
  const floor = W(rgeo(14,1,12,0.3), fm, cx,-0.5,cz); floor.receiveShadow = true; solid(cx,-0.5,cz,14,1,12);
  const rug = W(rgeo(6,0.06,4,0.6), mat(accent||0xe74c3c), cx,0.03,cz); rug.castShadow = false;
  [[cx,cz-6,14,0.4],[cx,cz+6,14,0.4]].forEach(([x,z,w,d]) => { W(rgeo(w,4,d,0.1), wm, x,2,z); solid(x,2,z,w,4,d); });
  [[cx-7,cz,0.4,12],[cx+7,cz,0.4,12]].forEach(([x,z,w,d]) => { W(rgeo(w,4,d,0.1), wm, x,2,z); solid(x,2,z,w,4,d); });
  // windows
  [[cx-3.5,cz-5.8],[cx+3.5,cz-5.8]].forEach(([x,z]) => { W(rgeo(2,1.6,0.2,0.05), mat(0x9fd8ff,{emissive:0x88ccff,emissiveIntensity:0.6}), x,2.3,z); W(rgeo(2.3,0.12,0.3,0.03), mat(0x7a4b24), x,1.4,z); });
  // door (inside) + mat
  W(rgeo(1.4,2.4,0.2,0.08), mat(0x7a4b24), cx,1.2,cz+5.8); W(rgeo(2,0.08,1.2,0.2), mat(0x8b5a2b), cx,0.04,cz+4.8);
  const t = idx % 3;
  if (t === 0){ // bedroom
    W(rgeo(3,0.6,4.5,0.2), mat(0xd9b27c), cx-4.5,0.3,cz-3); W(rgeo(2.8,0.4,4.2,0.2), mat(0x3b82f6), cx-4.5,0.8,cz-3); W(rgeo(2.2,0.3,0.9,0.15), mat(0xffffff), cx-4.5,1.15,cz-4.6); W(rgeo(3,1.6,0.3,0.1), mat(0x8b5a2b), cx-4.5,0.8,cz-5.4); solid(cx-4.5,0.5,cz-3,3,1,4.5);
    W(rgeo(2.2,0.15,2.2,0.1), mat(0x8b5a2b), cx+3.5,0.9,cz-2); cyl(0.15,0.15,0.9,mat(0x8b5a2b),cx+3.5,0.45,cz-2,world,8); solid(cx+3.5,0.5,cz-2,2.2,1,2.2); [cx+2.2,cx+4.8].forEach(x => { W(rgeo(0.8,0.1,0.8,0.05), mat(0xb07a45), x,0.55,cz-2); W(rgeo(0.8,0.9,0.1,0.05), mat(0xb07a45), x,1.0,cz-2.4); });
    W(rgeo(3,3,0.6,0.1), mat(0x8b5a2b), cx+4.5,1.5,cz-5.6); for (let i=0;i<9;i++) W(rgeo(0.25,0.7,0.5,0.03), mat([0xef4444,0x3b82f6,0x22c55e,0xf59e0b][i%4]), cx+3.3+i*0.3,0.9+Math.floor(i/5)*1.2,cz-5.5); solid(cx+4.5,1.5,cz-5.6,3,3,0.6);
    cyl(0.5,0.5,0.6,mat(0xffd43b),cx-5.5,1.1,cz+3,world,10); cyl(0.08,0.08,1.2,mat(0x333333),cx-5.5,0.5,cz+3,world,6); const pl = new THREE.PointLight(0xffe0a0,1.2,12); pl.position.set(cx-5.5,1.4,cz+3); world.add(pl);
  } else if (t === 1){ // kitchen
    W(rgeo(6,1.0,1.4,0.1), mat(0xffffff), cx-3,0.5,cz-5.2); W(rgeo(6.2,0.12,1.6,0.05), mat(0x9ca3af), cx-3,1.06,cz-5.2); solid(cx-3,0.5,cz-5.2,6,1,1.4); W(rgeo(1.2,0.3,1,0.05), mat(0x374151), cx-1.5,1.2,cz-5.2); [cx-1.8,cx-1.2].forEach(x => cyl(0.2,0.2,0.05,mat(0x111111),x,1.38,cz-5.2,world,12));
    W(rgeo(1.4,2.6,1.2,0.1), mat(0xe5e7eb), cx+5.5,1.3,cz-5.2); solid(cx+5.5,1.3,cz-5.2,1.4,2.6,1.2); W(rgeo(0.1,0.8,0.08,0.02), mat(0x374151), cx+4.8,1.5,cz-4.6);
    W(rgeo(3,0.15,1.8,0.1), mat(0x8b5a2b), cx+2,0.9,cz-1); [cx+0.8,cx+3.2].forEach(x => cyl(0.1,0.1,0.9,mat(0x8b5a2b),x,0.45,cz-1,world,6)); solid(cx+2,0.5,cz-1,3,1,1.8); for (let i=0;i<3;i++) sphere(0.22,mat([0xef4444,0x22c55e,0xf59e0b][i]),cx+1.2+i*0.8,1.2,cz-1,world,10);
    [[cx+0.8,cz+0.6],[cx+3.2,cz+0.6]].forEach(([x,z]) => { W(rgeo(0.8,0.1,0.8,0.05), mat(0xb07a45), x,0.55,z); W(rgeo(0.8,0.9,0.1,0.05), mat(0xb07a45), x,1.0,z+0.4); });
    W(rgeo(2.5,0.8,0.3,0.05), mat(0x7a4b24), cx-4,2.6,cz-5.7); for (let i=0;i<4;i++) cyl(0.2,0.2,0.3,mat(0xffffff),cx-4.9+i*0.6,3.15,cz-5.7,world,10);
  } else { // workshop / barn interior
    for (let i=0;i<4;i++){ const hb = W(rgeo(1.6,1.0,1.2,0.2), mat(0xe8d27a), cx-5+(i%2)*1.8,0.5+Math.floor(i/2)*1.0,cz-4.5); } solid(cx-4.1,1,cz-4.5,3.6,2,1.2);
    W(rgeo(4,0.15,1.6,0.08), mat(0x8b5a2b), cx+3,0.95,cz-5); [cx+1.2,cx+4.8].forEach(x => W(rgeo(0.3,0.9,1.4,0.05), mat(0x8b5a2b), x,0.45,cz-5)); solid(cx+3,0.5,cz-5,4,1,1.6); for (let i=0;i<3;i++) W(rgeo(0.4,0.1,0.8,0.03), mat(0x9ca3af,{metalness:0.7}), cx+1.8+i*0.8,1.07,cz-5);
    cyl(0.6,0.5,1.2,mat(0x8b5a2b),cx+5.5,0.6,cz+2,world,12); solid(cx+5.5,0.6,cz+2,1.2,1.2,1.2); cyl(0.6,0.5,1.2,mat(0x8b5a2b),cx+5.5,0.6,cz+3.4,world,12); solid(cx+5.5,0.6,cz+3.4,1.2,1.2,1.2);
    W(rgeo(0.15,2.2,0.15,0.03), mat(0x7a4b24), cx-5.8,1.1,cz+2); W(rgeo(0.5,0.4,0.15,0.05), mat(0x9ca3af,{metalness:0.7}), cx-5.8,2.2,cz+2);
  }
  // coins inside
  for (let i=0;i<3;i++) items.push({ kind:'coin', x:cx-3+i*3, y:0.8, z:cz+2, r:1.3 });
  const room = { cx, cz, idx, exit:{ kind:'exit', x:cx, z:cz+4.6, r:1.8, door } }; triggers.push(room.exit); return room; }
function barn(x,z,rot=0){ const g = house(x,z,rot,0xc0392b,0x8b2e21,9,7,4); mesh(rgeo(2,2.6,0.2,0.1), mat(0x7a4b24), 0,1.3,3.52, g); mesh(bgeo(0.15,2.6,0.15), mat(0xffffff), 0,1.3,3.65, g); }
function fountain(x,z){ cyl(2.4,2.6,0.6,mat(0xbfc5cc),x,0.3,z,world,20); const w = cyl(2.1,2.1,0.1,mat(0x4fb3ff,{transparent:true,opacity:0.85,roughness:0.1}),x,0.62,z,world,20); w.castShadow=false; cyl(0.3,0.4,1.6,mat(0xbfc5cc),x,1.2,z,world,12); cyl(0.9,0.6,0.25,mat(0xbfc5cc),x,2.0,z,world,14); solid(x,0.3,z,5,0.6,5); return {x,z}; }
function well(x,z){ cyl(1,1.1,1,mat(0x8a8a8a),x,0.5,z,world,12); [-0.9,0.9].forEach(ex => cyl(0.08,0.08,2.2,mat(0x7a4b24),x+ex,1.6,z,world,6)); cone(1.4,0.9,mat(0xe74c3c),x,2.9,z,world,4).rotation.y = Math.PI/4; solid(x,0.5,z,2.2,1,2.2); }
function stall(x,z,rot=0,color=0xff6b6b){ const g = new THREE.Group(); g.position.set(x,0,z); g.rotation.y = rot; world.add(g); mesh(rgeo(3,0.9,1.4,0.1), mat(0xb07a45), 0,0.45,0, g); [-1.3,1.3].forEach(ex => cyl(0.06,0.06,2.6,mat(0x7a4b24),ex,1.3,-0.5,g,6)); for (let i=0;i<6;i++) mesh(bgeo(0.55,0.08,1.8), mat(i%2?color:0xffffff), -1.4+i*0.55,2.6,-0.2, g); for (let i=0;i<6;i++) sphere(0.18,mat([0xef4444,0xf59e0b,0x22c55e,0xef4444,0xa855f7,0xf59e0b][i]),-1.1+i*0.44,1.05,0.2,g,10); solid(x,0.45,z,3,1,1.5); }
function pier(x,z,len,rot=0){ const g = new THREE.Group(); g.position.set(x,0,z); g.rotation.y = rot; world.add(g); mesh(bgeo(3,0.25,len), mat(0xb07a45), 0,0.1,-len/2, g); for (let i=0;i<=len/3;i++) [-1.3,1.3].forEach(ex => cyl(0.12,0.12,2,mat(0x7a4b24),ex,-0.5,-i*3,g,6)); const cs=Math.cos(rot),sn=Math.sin(rot); solid(x - sn*len/2, 0.1, z - cs*len/2, Math.abs(3*cs)+Math.abs(len*sn), 0.25, Math.abs(3*sn)+Math.abs(len*cs)); }
function boat(x,z,rot=0){ const g = new THREE.Group(); g.position.set(x,-0.5,z); g.rotation.y = rot; world.add(g); const hull = mesh(rgeo(2.6,1.2,6,0.5), mat(0xc0392b), 0,0.4,0, g); mesh(rgeo(2.2,0.2,5,0.3), mat(0xd9b27c), 0,0.95,0, g); cyl(0.08,0.08,4.5,mat(0x7a4b24),0,3,0.3,g,6); const sail = mesh(bgeo(0.05,2.6,2.2), mat(0xffffff), 0.1,3.4,1.3, g); mesh(bgeo(1.2,0.2,2.5), mat(0x7a4b24), 0,1.2,-1.5, g); g.userData.bob = Math.random()*6; triggers.push({ kind:'boat', x, z, r:3.5, g }); return g; }
function chest(x,z,id,y=0){ const g = new THREE.Group(); g.position.set(x,y,z); world.add(g); mesh(rgeo(1.2,0.7,0.8,0.1), mat(0x8b5a2b), 0,0.35,0, g); const lid = new THREE.Group(); lid.position.set(0,0.7,-0.4); g.add(lid); mesh(rgeo(1.2,0.35,0.8,0.1), mat(0xa0672f), 0,0.17,0.4, lid); mesh(bgeo(1.25,0.12,0.12), mat(0xffd43b), 0,0.3,0.4, lid); mesh(bgeo(0.25,0.3,0.1), mat(0xffd43b), 0,0.55,0.42, g); const opened = (save.chests||[]).includes(id); if (opened) lid.rotation.x = -1.6; chests.push({ x,y,z,id,g,lid,opened }); solid(x,y+0.35,z,1.2,0.7,0.8); }
function sign(x,z,text,rot=0,y=0){ cyl(0.08,0.08,1.6,mat(0x7a4b24),x,y+0.8,z,world,6); const b = mesh(rgeo(2.2,0.8,0.1,0.08), mat(0xd9b27c), x,y+1.6,z, world); b.rotation.y = rot; const sp = textSprite(text,'#5a3a00',0.75); sp.position.set(x,y+1.6,z); world.add(sp); }
function bridge(x,z,len,rot=0,y=0){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = rot; world.add(g); mesh(rgeo(3,0.3,len,0.1), mat(0xb07a45), 0,0.15,0, g); [-1.4,1.4].forEach(ex => { mesh(bgeo(0.1,0.1,len), mat(0x7a4b24), ex,1.0,0, g); for (let i=0;i<=len/2;i++) cyl(0.06,0.06,1,mat(0x7a4b24),ex,0.6,-len/2+i*2,g,6); }); const cs=Math.cos(rot),sn=Math.sin(rot); solid(x,y+0.15,z,Math.abs(3*cs)+Math.abs(len*sn),0.3,Math.abs(3*sn)+Math.abs(len*cs)); }
function campfire(x,z){ for (let i=0;i<5;i++){ const a=i/5*Math.PI*2; const l = cyl(0.12,0.12,1.2,mat(0x6b4a2a),x+Math.cos(a)*0.3,0.2,z+Math.sin(a)*0.3,world,6); l.rotation.z = Math.PI/2; l.rotation.y = a; } const f = cone(0.45,1.1,mat(0xff7a1a,{emissive:0xff4500,emissiveIntensity:1.2}),x,0.7,z,world,8); f.userData.fire = true; const pl = new THREE.PointLight(0xff7a1a,1.2,8); pl.position.set(x,1,z); world.add(pl); hazards.push({x,y:0.5,z,w:0.9,h:1,d:0.9,fire:true}); }
function snowman(x,z){ const wm = mat(0xffffff); sphere(0.8,wm,x,0.7,z,world,14); sphere(0.6,wm,x,1.8,z,world,14); sphere(0.45,wm,x,2.6,z,world,14); cone(0.08,0.4,mat(0xf59e0b),x,2.6,z+0.5,world,6).rotation.x = Math.PI/2; [-0.15,0.15].forEach(ex => sphere(0.05,mat(0x222222),x+ex,2.7,z+0.42,world,6)); cyl(0.3,0.3,0.3,mat(0x222222),x,3.1,z,world,10); cyl(0.5,0.5,0.06,mat(0x222222),x,2.98,z,world,10); solid(x,1,z,1.6,2,1.6); }
function volcano(x,z,h=22,r=18){ const v = cone(r,h,mat(0x4a3a3a,{flatShading:true,roughness:1}),x,h/2-1,z,world,9); const top = cyl(r*0.25,r*0.3,1,mat(0xff4a12,{emissive:0xff2a00,emissiveIntensity:1}),x,h-1.2,z,world,9); const pl = new THREE.PointLight(0xff4a12,1.5,30); pl.position.set(x,h,z); world.add(pl); solid(x,h/2-1,z,r*1.1,h,r*1.1); }
function mushroom(x,z,y=0,color=0xef4444){ cyl(0.12,0.16,0.5,mat(0xfff5e0),x,y+0.25,z,world,8); const c = sphere(0.38,mat(color),x,y+0.55,z,world,12); c.scale.y = 0.6; [[0.15,0.1],[-0.12,0.18],[0,-0.2]].forEach(([dx,dz]) => sphere(0.07,mat(0xffffff),x+dx,y+0.7,z+dz,world,6)); }
function kart(x,z,yaw,color){ const g = new THREE.Group(); g.position.set(x,0,z); g.rotation.y = yaw; world.add(g); const b = mesh(rgeo(2.0,0.7,3.4,0.3), mat(color), 0,0.75,0, g); mesh(rgeo(1.0,0.5,0.9,0.15), mat(0x222222), 0,1.2,0.4, g); mesh(rgeo(1.0,0.35,1.2,0.15), mat(0xffffff), 0,0.9,-1.5, g); mesh(rgeo(2.2,0.1,0.5,0.05), mat(0x222222), 0,1.45,1.6, g); [[-0.8,1.0,1.55],[0.8,1.0,1.55]].forEach(([wx,wy,wz]) => mesh(bgeo(0.1,0.4,0.1), mat(0x222222), wx,wy+0.2,wz, g)); mesh(rgeo(0.3,0.3,0.1,0.04), mat(0xffd43b,{emissive:0xffd43b,emissiveIntensity:0.6}), -0.6,0.9,-1.72, g); mesh(rgeo(0.3,0.3,0.1,0.04), mat(0xffd43b,{emissive:0xffd43b,emissiveIntensity:0.6}), 0.6,0.9,-1.72, g); const wheels = []; [[-1.05,-1.1],[1.05,-1.1],[-1.05,1.15],[1.05,1.15]].forEach(([wx,wz]) => { const w = cyl(0.42,0.42,0.4,mat(0x222222,{roughness:0.8}),wx,0.42,wz,g,16); w.rotation.z = Math.PI/2; const rim = cyl(0.22,0.22,0.42,mat(0xcccccc,{metalness:0.8,roughness:0.3}),0,0,0,w,10); wheels.push(w); }); const k = { x,y:0,z,yaw,speed:0,vy:0,w:2.4,h:1.2,g,wheels,home:{x,y:0,z,yaw},ground:false,launchCd:0,color }; karts.push(k); return k; }
function ramp(x,z,n=8,rise=0.3,w=4){ for (let i=0;i<n;i++){ platformBlock(x, (i+1)*rise, z-i-0.5, w, 1, 0xf59e0b, (i+1)*rise+0.6); } ramps.push({ x, z: z-n+0.5, w, top: n*rise }); }
// ---- obstacle course pieces (over the sea) ----
function cpPad(x,y,z,n){ const m = W(rgeo(2.6,0.3,2.6,0.1), mat(0x37d67a,{emissive:0x0a5a2a,emissiveIntensity:0.5}), x,y+0.15,z); cyl(0.08,0.08,3.2,mat(0x333333),x-1,y+1.6,z-1,world,6); const flag = mesh(bgeo(1.3,0.9,0.08), mat(0xcccccc), x-0.35,y+2.7,z-1, world); checkpoints.push({ x,y:y+0.3,z,n,m,flag,on:false }); }
function bouncePad(x,y,z){ const m = W(rgeo(2.2,0.4,2.2,0.1), mat(0xffd43b,{emissive:0x665500,emissiveIntensity:0.5}), x,y+0.2,z); const a = W(bgeo(1,0.1,1), mat(0xffffff,{emissive:0xffffff,emissiveIntensity:1}), x,y+0.42,z); pads.push({ x,y:y+0.4,z,m,a }); }
function mover(x,y,z,w,d,dx,dz,period,phase=0){ const m = W(rgeo(w,1,d,0.25), mat(0x9b59b6), x,y-0.5,z); const b = solid(x,y-0.5,z,w,1,d,{ isMover:true, m, x0:x, z0:z, dx, dz, period, phase, vx:0, vz:0 }); movers.push(b); }
function spinner(x,y,z,len,speed){ const g = new THREE.Group(); const b = mesh(rgeo(len,0.7,0.7,0.2), mat(0xef4444,{emissive:0x550000,emissiveIntensity:0.6}), 0,0,0, g); const hub = cyl(0.5,0.5,1.6,mat(0x374151),0,0.3,0,g,12); g.position.set(x,y+0.4,z); world.add(g); bars.push({ x,y:y+0.4,z,len,speed,g,a:R()*6 }); }
function killerBlock(x,y,z,w,h,d,dx,dz,period,phase){ const m = W(rgeo(w,h,d,0.15), mat(0xef4444,{emissive:0x880000,emissiveIntensity:0.7}), x,y,z); killers.push({ x,y,z,w,h,d,m,x0:x,z0:z,dx,dz,period,phase }); }
function finishGate(x,y,z,id){ [-2,2].forEach(ex => cyl(0.15,0.15,4,mat(0xffd43b),x+ex,y+2,z,world,8)); mesh(bgeo(4.3,0.5,0.3), mat(0xffd43b), x,y+4,z, world); const sp = textSprite('FINISH','#ffffff',0.9); sp.position.set(x,y+4.9,z); world.add(sp); W(rgeo(4,0.2,2,0.1), mat(0xffffff), x,y+0.1,z); courseFinish.push({ x,y,z,id }); }
// course generator: start at (x0,z0) heading -z at height y0
function course(id, x0, y0, z0, segs){ let cx = x0, cz = z0, cy = y0, i = 0; const pal = [0x3498db,0x9b59b6,0xf39c12,0x1abc9c,0xe74c3c,0x2ecc71];
  platformBlock(cx,cy,cz-3,6,6,0x7ed957,1.4); cpPad(cx,cy,cz-3,0); cz -= 6;
  for (const [type,p] of segs){ const land = () => { platformBlock(cx,cy,cz-3,6,6,0x7ed957,1.4); cpPad(cx,cy,cz-3,++i); cz -= 6; };
    if (type==='gaps'){ for (let k=0;k<(p.n||5);k++){ const size = p.size||3, gap = p.gap||2.6; const c = cz-gap-size/2; const ox = (R()-.5)*2; platformBlock(cx+ox,cy,c,size,size,pal[k%6]); if (k%2) items.push({ kind:'coin', x:cx+ox, y:cy+1.2, z:c }); cz = c-size/2; } land(); }
    else if (type==='movers'){ for (let k=0;k<(p.n||3);k++){ cz -= 5.5; if (k%2===0) mover(cx,cy,cz-1.5,3,3,0,2.5,4,k); else mover(cx,cy,cz-1.5,3,3,4,0,5,k); cz -= 3+(k%2===0?2.5:0); } cz -= 1; land(); }
    else if (type==='spinner'){ const L = 12; platformBlock(cx,cy,cz-L/2,12,L,pal[3],1.4); spinner(cx,cy,cz-6,11,p.speed||1.6); items.push({kind:'coin',x:cx+4.5,y:cy+1.2,z:cz-6}); items.push({kind:'coin',x:cx-4.5,y:cy+1.2,z:cz-6}); cz -= L; land(); }
    else if (type==='stairs'){ for (let k=0;k<(p.n||8);k++){ const x = cx+(k%2?2.5:-2.5); cz -= 3.5; cy += p.rise||1.2; platformBlock(x,cy,cz,3,3,pal[(k+2)%6]); if (k%3===2) items.push({kind:'coin',x,y:cy+1.2,z:cz}); } cz -= 2.5; land(); }
    else if (type==='pads'){ for (let k=0;k<(p.n||2);k++){ cz -= 1; platformBlock(cx,cy,cz-2,4,4,pal[2]); bouncePad(cx,cy,cz-2); items.push({kind:'coin',x:cx,y:cy+4.5,z:cz-2-5.5}); cz -= 11; } cz -= 1; land(); }
    else if (type==='beams'){ const len = p.len||14; cz -= 1; platformBlock(cx,cy,cz-len/2,1,len,pal[4]); items.push({kind:'coin',x:cx,y:cy+1.2,z:cz-len/2}); cz -= len+1; platformBlock(cx+3,cy,cz-0.5,7,1,pal[4]); platformBlock(cx+6,cy,cz-len/2-0.5,1,len,pal[4]); cz -= len+1; cx += 6; land(); }
    else if (type==='pistons'){ const len = p.len||18, n = p.n||3; const z0 = cz; platformBlock(cx,cy,z0-len/2,4,len,pal[0],1.4); for (let k=0;k<n;k++){ const z = z0-3-k*((len-6)/(n-1||1)); killerBlock(cx-4,cy+0.6,z,1.2,1.2,1.5,8,0,p.period||2.6,k*0.9); platformBlock(cx-4,cy,z,1.5,1.5,0x555555); } cz = z0-len; land(); }
    else if (type==='shrink'){ for (let k=0;k<(p.n||6);k++){ const w = Math.max(1.3,3-k*0.3); const c = cz-(p.gap||3)-w/2; platformBlock(cx,cy,c,w,w,pal[(k+1)%6]); items.push({kind:'coin',x:cx,y:cy+1.2,z:c}); cz = c-w/2; } land(); }
  }
  platformBlock(cx,cy,cz-5,10,10,0x7ed957,1.4); finishGate(cx,cy,cz-5,id); return { x:x0, z:z0 };
}
// ---- island assembly ----
function spawnItem(kind, x, z, y=0, extra){ items.push(Object.assign({ kind, x, y: y+0.6, z }, extra||{})); }
function spawnNPC(id, x, z, yaw, cfg, y=0){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = yaw; world.add(g); let P; if (cfg.animal) P = buildAnimal(g, cfg.animal, cfg.name); else P = buildChar(g, Object.assign({ nameColor:'#aee8ff' }, cfg)); const n = { id, x, y, z, yaw, g, P, cfg, home:{x,z}, talkT:0 }; npcs.push(n); if (!cfg.noCollide) solid(x,y+0.9,z,0.9,1.8,0.9,{ghost:true}); return n; }
// item meshes
function buildItemMesh(it){ const g = new THREE.Group(); const k = it.kind;
  if (k==='coin'){ const m = cyl(0.42,0.42,0.14,mat(0xffd43b,{emissive:0xaa7700,emissiveIntensity:0.5,metalness:0.6,roughness:0.3}),0,0,0,g,20); m.rotation.x = Math.PI/2; }
  else if (k==='apple'){ sphere(0.32,mat(0xef4444,{roughness:0.35}),0,0,0,g,14); cyl(0.03,0.03,0.25,mat(0x6b4a2a),0,0.35,0,g,5); const lf = sphere(0.12,mat(0x2ecc71),0.12,0.4,0,g,8); lf.scale.set(1.6,0.5,0.8); }
  else if (k==='shell'){ const s = cone(0.32,0.45,mat(0xffc1cc,{roughness:0.4}),0,0,0,g,7); s.rotation.x = Math.PI/2; }
  else if (k==='flower'){ cyl(0.03,0.03,0.5,mat(0x2e8b3a),0,-0.2,0,g,5); for (let i=0;i<6;i++){ const a=i/6*Math.PI*2; sphere(0.12,mat(0x3b82f6),Math.cos(a)*0.17,0.1,Math.sin(a)*0.17,g,8); } sphere(0.1,mat(0xffd43b),0,0.12,0,g,8); }
  else if (k==='gear'){ const t = new THREE.Mesh(new THREE.TorusGeometry(0.32,0.1,8,8), mat(0x9ca3af,{metalness:0.8,roughness:0.3})); g.add(t); for (let i=0;i<8;i++){ const a=i/8*Math.PI*2; mesh(bgeo(0.14,0.14,0.14), mat(0x9ca3af,{metalness:0.8,roughness:0.3}), Math.cos(a)*0.42,Math.sin(a)*0.42,0, g); } }
  else if (k==='mushroom'){ cyl(0.1,0.14,0.4,mat(0xfff5e0),0,-0.1,0,g,8); const c = sphere(0.3,mat(0xa855f7),0,0.15,0,g,12); c.scale.y = 0.6; sphere(0.06,mat(0xffffff),0.12,0.25,0.1,g,6); }
  else if (k==='egg'){ const e = sphere(0.26,mat(0xfff8e1,{roughness:0.3}),0,0,0,g,14); e.scale.y = 1.3; }
  else if (k==='crystal'){ const c = mesh(new THREE.OctahedronGeometry(0.4,0), mat(0x7ff0ff,{emissive:0x20c0ff,emissiveIntensity:0.6,transparent:true,opacity:0.9}), 0,0,0, g); }
  else if (k==='coconut'){ sphere(0.3,mat(0x6b4a2a,{roughness:0.9}),0,0,0,g,12); }
  else if (k==='snowflake'){ for (let i=0;i<3;i++){ const b = mesh(bgeo(0.9,0.08,0.08), mat(0xffffff,{emissive:0x9fd8ff,emissiveIntensity:0.6}), 0,0,0, g); b.rotation.z = i*Math.PI/3; } }
  else if (k==='banana'){ const b = new THREE.Mesh(new THREE.TorusGeometry(0.35,0.1,8,12,Math.PI), mat(0xffe135)); b.rotation.z = Math.PI; g.add(b); }
  else if (k==='key'){ const t = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.06,8,16), mat(0xffd43b,{metalness:0.7,roughness:0.3})); t.position.y = 0.25; g.add(t); mesh(bgeo(0.08,0.5,0.08), mat(0xffd43b,{metalness:0.7,roughness:0.3}), 0,-0.1,0, g); mesh(bgeo(0.2,0.08,0.08), mat(0xffd43b,{metalness:0.7,roughness:0.3}), 0.08,-0.3,0, g); }
  else if (k==='star'){ const s = new THREE.Shape(); for (let i=0;i<10;i++){ const r = i%2?0.18:0.42; const a = i/10*Math.PI*2-Math.PI/2; i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r); } const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:0.12,bevelEnabled:false}), mat(0xffd43b,{emissive:0xffaa00,emissiveIntensity:0.8})); m.position.z = -0.06; g.add(m); }
  else if (k==='letter'){ mesh(rgeo(0.6,0.4,0.05,0.03), mat(0xffffff), 0,0,0, g); mesh(bgeo(0.5,0.02,0.06), mat(0xef4444), 0,0.05,0.02, g); }
  else if (k==='bone'){ cyl(0.06,0.06,0.6,mat(0xfff8e1),0,0,0,g,6).rotation.z = Math.PI/2; [-0.3,0.3].forEach(ex => { sphere(0.1,mat(0xfff8e1),ex,0.08,0,g,8); sphere(0.1,mat(0xfff8e1),ex,-0.08,0,g,8); }); }
  else if (k==='fish'){ const b = sphere(0.3,mat(0x3b82f6),0,0,0,g,12); b.scale.set(1.6,0.8,0.6); cone(0.2,0.3,mat(0x3b82f6),-0.55,0,0,g,4).rotation.z = Math.PI/2; sphere(0.05,mat(0x111111),0.3,0.08,0.15,g,6); }
  else if (k==='carrot'){ const c = cone(0.14,0.6,mat(0xf97316),0,0,0,g,8); c.rotation.x = Math.PI; [0,0.4,-0.4].forEach(a => { const l = cone(0.05,0.3,mat(0x22c55e),Math.sin(a)*0.08,0.4,Math.cos(a)*0.08,g,5); l.rotation.z = a*0.5; }); }
  else if (k==='chicken'){ buildAnimal(g,'chicken'); g.children.forEach(c => c.position.y -= 0.45); }
  else { sphere(0.3,mat(0xffffff),0,0,0,g,10); }
  // keep items above ground / out of walls
  { let top = -99, blocker = null; for (const b of blocks){ if (b.ghost) continue; if (it.x > b.x-b.w/2 && it.x < b.x+b.w/2 && it.z > b.z-b.d/2 && it.z < b.z+b.d/2){ const bt = b.y+b.h/2; if (bt > top && bt <= it.y+1.5){ top = bt; } if (b.h > 2.4 && it.y < bt && it.y+0.5 > b.y-b.h/2){ blocker = b; } } }
    if (blocker){ const side = it.x >= blocker.x ? 1 : -1; it.x = blocker.x + side*(blocker.w/2+1.2); it.z = blocker.z + (it.z >= blocker.z ? 1 : -1)*(blocker.d/2+1.2); top = -99; for (const b of blocks){ if (b.ghost) continue; if (it.x > b.x-b.w/2 && it.x < b.x+b.w/2 && it.z > b.z-b.d/2 && it.z < b.z+b.d/2){ const bt = b.y+b.h/2; if (bt > top && bt <= 1.5) top = bt; } } }
    if (top > -99 && it.y < top+0.5) it.y = top+0.7; }
  g.position.set(it.x,it.y,it.z); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); world.add(g); it.g = g; it.got = false; if (!it.r) it.r = 1.4;
  if (it.kind !== 'coin' && it.label !== false){ const sp = textSprite(it.kind, '#ffffff', 0.45); sp.position.y = 0.9; sp.visible = false; g.add(sp); it.lbl = sp; }
}
