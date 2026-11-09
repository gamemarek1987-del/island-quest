// ===== islands, NPCs, quests, quizzes (English) =====
'use strict';
const QUIZ = {
  food: [ {q:'🍎', a:'apple', o:['apple','banana','bread']}, {q:'🥕', a:'carrot', o:['carrot','tomato','onion']}, {q:'🍌', a:'banana', o:['lemon','banana','pear']}, {q:'🧀', a:'cheese', o:['butter','cheese','milk']}, {q:'🍕', a:'pizza', o:['pizza','cake','soup']}, {q:'🥚', a:'egg', o:['egg','rice','nut']} ],
  animals: [ {q:'🐶', a:'dog', o:['cat','dog','fox']}, {q:'🐄', a:'cow', o:['cow','horse','pig']}, {q:'🐔', a:'chicken', o:['duck','chicken','bird']}, {q:'🦉', a:'owl', o:['owl','eagle','bat']}, {q:'🐟', a:'fish', o:['frog','fish','whale']}, {q:'🐒', a:'monkey', o:['monkey','bear','lion']} ],
  colors: [ {q:'🔴', a:'red', o:['red','blue','green']}, {q:'🔵', a:'blue', o:['yellow','blue','black']}, {q:'🟢', a:'green', o:['green','white','pink']}, {q:'🟡', a:'yellow', o:['orange','purple','yellow']}, {q:'⚪', a:'white', o:['white','grey','brown']} ],
  winter: [ {q:'❄️', a:'snow', o:['rain','snow','sun']}, {q:'🧤', a:'gloves', o:['gloves','socks','hat']}, {q:'⛷️', a:'ski', o:['swim','run','ski']}, {q:'🧣', a:'scarf', o:['scarf','belt','shirt']}, {q:'🔥', a:'fire', o:['ice','fire','water']} ],
  nature: [ {q:'🌋', a:'volcano', o:['volcano','mountain','hill']}, {q:'🌴', a:'palm tree', o:['pine tree','palm tree','bush']}, {q:'🌧️', a:'rain', o:['rain','wind','cloud']}, {q:'⭐', a:'star', o:['moon','sun','star']}, {q:'🌊', a:'wave', o:['wave','lake','river']} ],
  school: [ {q:'📚', a:'books', o:['books','pens','bags']}, {q:'✏️', a:'pencil', o:['ruler','pencil','eraser']}, {q:'🎒', a:'backpack', o:['backpack','box','basket']}, {q:'🧮', a:'calculator', o:['computer','calculator','phone']}, {q:'🗺️', a:'map', o:['map','flag','sign']}, {q:'🔬', a:'microscope', o:['telescope','microscope','camera']} ],
  weather: [ {q:'☀️', a:'sunny', o:['sunny','cloudy','windy']}, {q:'🌧️', a:'rainy', o:['snowy','rainy','foggy']}, {q:'⛈️', a:'storm', o:['storm','breeze','rainbow']}, {q:'🌈', a:'rainbow', o:['rainbow','sunset','cloud']}, {q:'🌬️', a:'windy', o:['windy','hot','cold']} ],
  jobs: [ {q:'👨‍🍳', a:'chef', o:['chef','doctor','pilot']}, {q:'👩‍🚒', a:'firefighter', o:['police officer','firefighter','teacher']}, {q:'👨‍⚕️', a:'doctor', o:['dentist','doctor','nurse']}, {q:'👩‍🏫', a:'teacher', o:['teacher','student','farmer']}, {q:'👮', a:'police officer', o:['soldier','police officer','guard']}, {q:'👨‍🚀', a:'astronaut', o:['astronaut','pilot','driver']} ],
  sport: [ {q:'⚽', a:'football', o:['football','basketball','volleyball']}, {q:'🏊', a:'swimming', o:['running','swimming','diving']}, {q:'🚴', a:'cycling', o:['cycling','skating','skiing']}, {q:'🏀', a:'basketball', o:['baseball','basketball','tennis']}, {q:'🎾', a:'tennis', o:['tennis','golf','hockey']} ],
  desert: [ {q:'🐪', a:'camel', o:['camel','horse','donkey']}, {q:'🌵', a:'cactus', o:['cactus','tree','flower']}, {q:'🏜️', a:'desert', o:['desert','beach','forest']}, {q:'🔺', a:'pyramid', o:['pyramid','tower','tent']}, {q:'🐍', a:'snake', o:['snake','worm','lizard']}, {q:'🦂', a:'scorpion', o:['spider','scorpion','crab']}, {q:'🏺', a:'vase', o:['vase','cup','bowl']} ],
  castle: [ {q:'🏰', a:'castle', o:['castle','house','church']}, {q:'⚔️', a:'sword', o:['sword','knife','axe']}, {q:'🛡️', a:'shield', o:['shield','plate','door']}, {q:'👑', a:'crown', o:['crown','hat','ring']}, {q:'🐉', a:'dragon', o:['dragon','dinosaur','lizard']}, {q:'🐴', a:'horse', o:['horse','cow','deer']}, {q:'🧙', a:'wizard', o:['wizard','king','knight']}, {q:'🏹', a:'bow', o:['bow','arrow','spear']} ],
  space: [ {q:'🚀', a:'rocket', o:['rocket','plane','ship']}, {q:'🪐', a:'planet', o:['planet','moon','comet']}, {q:'🌙', a:'moon', o:['moon','sun','star']}, {q:'👽', a:'alien', o:['alien','robot','ghost']}, {q:'🛰️', a:'satellite', o:['satellite','antenna','radio']}, {q:'🔭', a:'telescope', o:['telescope','microscope','camera']}, {q:'🧑‍🚀', a:'astronaut', o:['astronaut','pilot','diver']} ],
  science: [ {q:'🧲', a:'magnet', o:['magnet','metal','coin']}, {q:'🔋', a:'battery', o:['battery','bulb','wire']}, {q:'💡', a:'light bulb', o:['light bulb','candle','lamp']}, {q:'🌡️', a:'thermometer', o:['thermometer','ruler','clock']}, {q:'🧪', a:'test tube', o:['test tube','bottle','glass']}, {q:'⚙️', a:'gear', o:['gear','wheel','screw']} ],
  body: [ {q:'👋', a:'hand', o:['hand','foot','head']}, {q:'👀', a:'eyes', o:['ears','eyes','nose']}, {q:'🦷', a:'tooth', o:['tongue','tooth','lip']}, {q:'👂', a:'ear', o:['ear','arm','leg']} ],
};
// math question generator: level 1 = add/sub to 20, 2 = multiplication, 3 = mixed + word problems
function genMath(level, n){ const out = []; const names = ['Lily','Joe','Anna','Kapu','Maya','Bolt','Tom']; const things = ['apples','coins','shells','bananas','stars','fish','books'];
  const ri = (a,b) => a+Math.floor(Math.random()*(b-a+1));
  for (let i=0;i<n;i++){ let q, a; const r = Math.random();
    if (level === 1){ if (r < 0.4){ const x = ri(12,70), y = ri(8,29); q = x+' + '+y+' = ?'; a = x+y; } else if (r < 0.8){ const x = ri(30,99), y = ri(8,29); q = x+' − '+y+' = ?'; a = x-y; } else { const x = ri(2,9), y = ri(2,9), z = ri(1,9); q = x+' + '+y+' + '+z+' = ?'; a = x+y+z; } }
    else if (level === 2){ const x = ri(3,12), y = ri(3,12); if (r < 0.45){ q = x+' × '+y+' = ?'; a = x*y; } else if (r < 0.8){ q = (x*y)+' ÷ '+x+' = ?'; a = y; } else { const z = ri(2,9); q = x+' × '+y+' + '+z+' = ?'; a = x*y+z; } }
    else if (level === 3){ const nm = names[ri(0,names.length-1)], th = things[ri(0,things.length-1)];
      if (r < 0.25){ const x = ri(3,9), y = ri(4,12), z = ri(2,15); q = nm+' has '+x+' boxes with '+y+' '+th+' in each box, and finds '+z+' more. How many '+th+' now?'; a = x*y+z; }
      else if (r < 0.5){ const price = ri(3,9), cnt = ri(2,6), pay = ri(price*cnt+5, price*cnt+20); q = 'One ticket costs $'+price+'. '+nm+' buys '+cnt+' tickets and pays $'+pay+'. How much change?'; a = pay-price*cnt; }
      else if (r < 0.75){ const h = ri(1,10), m = [0,15,30,45][ri(0,3)], add = [15,30,45,60,90][ri(0,4)]; const tot = h*60+m+add; const fmt = x => Math.floor(x/60)+':'+String(x%60).padStart(2,'0'); q = 'The film starts at '+fmt(h*60+m)+' and lasts '+add+' minutes. What time does it end?'; a = fmt(tot); const opts = new Set([a]); while (opts.size < 3){ const d = tot + [-30,-15,15,30,60][ri(0,4)]; if (d > 0) opts.add(fmt(d)); } out.push({ q, a, o:[...opts], text:true }); continue; }
      else { const total = ri(20,60), each = ri(2,6); const kids = ri(2,5); q = nm+' shares '+(each*kids)+' '+th+' equally among '+kids+' friends. How many does each friend get?'; a = each; } }
    if (level === 4){ if (r < 0.3){ const den = [2,3,4,5,10][ri(0,4)], k = ri(2,9), num = ri(1,den-1); const total = den*k; q = num+'/'+den+' of '+total+' = ?'; a = num*k; } else if (r < 0.6){ const pct = [10,20,25,50,75][ri(0,4)], base = [20,40,60,80,100,200][ri(0,5)]; q = pct+'% of '+base+' = ?'; a = base*pct/100; } else if (r < 0.8){ const x = ri(3,12), y = ri(2,9), z = ri(2,9); q = '('+x+' + '+y+') × '+z+' = ?'; a = (x+y)*z; } else { const x = ri(100,900), y = ri(50,400); q = x+' − '+y+' = ?'; a = x-y; } }
    if (level === 5){ if (r < 0.25){ const sp = [40,50,60,80][ri(0,3)], h = ri(2,5); q = 'A train goes '+sp+' km per hour. How far does it go in '+h+' hours?'; a = sp*h; } else if (r < 0.5){ const w = ri(3,12), h = ri(3,12); q = 'A rectangle is '+w+' m long and '+h+' m wide. What is its area (m²)?'; a = w*h; } else if (r < 0.75){ const x = ri(21,99)*10 + ri(1,9); const rounded = Math.round(x/10)*10; q = 'Round '+x+' to the nearest ten.'; a = rounded; } else { const x = ri(12,60), y = ri(5,20); q = 'Double '+x+', then subtract '+y+'. What do you get?'; a = 2*x-y; } }
    const opts = new Set([a]); while (opts.size < 3){ const d = a + (level >= 4 ? ri(-12,12) : ri(-6,6)); if (d >= 0 && d !== a) opts.add(d); } out.push({ q, a:String(a), o:[...opts].map(String), text:true }); }
  return out; }
// quest: {id, npc, title, type: collect|talk|deliver|hide|quiz|course|chest, item, count, target, lines:{offer,accept,progress,done}, reward:{coins,word}, main, requires}
const ISLANDS = [
{ id:0, theme:'sunny', name:'Sunny Island', spawn:{x:0,z:14}, intro:"Welcome to Sunny Island! Talk to the villagers (press E) and help them.",
  npcs: [
    { id:'joe', name:'Farmer Joe', x:38, z:-6, yaw:0.6, cfg:{ cap:'straw', hoodie:0x3b82f6, pants:0x1e3a8a, apron:0x8b5a2b, beard:0xd9b27c, skin:SKIN2 }, idle:['Nice weather for farming!','My cows are the best on the island.','Have you seen my chickens?'] },
    { id:'rose', name:'Grandma Rose', x:-6, z:-6, yaw:0.8, cfg:{ hair:0xd9d9d9, hairStyle:'bun', glasses:true, dress:true, hoodie:0xa855f7, cap:null, skin:SKIN }, idle:['Hello, dear!','Would you like a cookie?','My garden needs more flowers.'] },
    { id:'finn', name:'Captain Finn', x:0, z:58, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['Ahoy!','The sea is calm today.','My boat can take you far away...'] },
    { id:'lily', name:'Lily', x:8, z:10, yaw:-0.5, cfg:{ hoodie:0xff6fae, pants:0xfde68a, hair:0xf59e0b, hairStyle:'long', cap:null, scale:0.85 }, idle:['Wanna play?','I am the best at hiding!','Catch me if you can!'] },
    { id:'owl', name:'Professor Owl', x:-20, z:-22, yaw:0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Knowledge is power.','Do you know your words?'] },
    { id:'pierre', name:'Chef Pierre', x:-8, z:16, yaw:2.6, cfg:{ cap:'chef', hoodie:0xffffff, pants:0x222222, apron:0xef4444, mustache:0x222222 }, idle:['Bon appétit!','My soup needs mushrooms!','Cooking is art.'] },
    { id:'bolt', name:'Bolt', x:34, z:-28, yaw:-0.8, cfg:{ animal:'robot' }, idle:['Bzzt... system error.','I need my gears!'] },
    { id:'biscuit', name:'Biscuit', x:12, z:20, yaw:1, cfg:{ animal:'dog', noCollide:true }, idle:['Woof! Woof!','*wags tail*'] },
    { id:'tom', name:'Teacher Tom', x:-16, z:22, yaw:1.2, cfg:{ hoodie:0x374151, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:null }, idle:['Math is fun!','Two plus two is... four!'] },
    { id:'cow1', name:'', x:50, z:12, yaw:1.2, cfg:{ animal:'cow', noCollide:true }, idle:['Moo.'] }, { id:'cow2', name:'', x:42, z:14, yaw:-0.6, cfg:{ animal:'cow', noCollide:true }, idle:['Moooo!'] },
  ],
  quests: [
    { id:'apples', npc:'joe', main:true, title:'Apple Picking', type:'collect', item:'apple', count:5, reward:{coins:60, word:'apple'}, lines:{ offer:["Hi there! I'm Farmer Joe.","The wind blew my apples into the forest, west of the village.","Can you find 5 apples for me?"], accept:["Great! Look under the trees in the forest."], progress:["Keep looking! The forest is to the west."], done:["Wow, 5 apples! You are a great helper!","Here are some coins. Come back later!"] } },
    { id:'chickens', npc:'joe', main:false, requires:['apples'], title:'Runaway Chickens', type:'collect', item:'chicken', count:3, reward:{coins:80, word:'chicken'}, lines:{ offer:["Oh no! My 3 chickens ran away!","They are hiding somewhere on the island. Please bring them back!"], accept:["Thank you! Chickens like to hide near houses and bushes."], progress:["Cluck cluck... where are they?"], done:["My chickens! You found them all. You are amazing!"] } },
    { id:'flowers', npc:'rose', main:true, title:'Blue Flowers', type:'collect', item:'flower', count:3, reward:{coins:50, word:'flower'}, lines:{ offer:["Hello, dear. I'm Grandma Rose.","I love blue flowers. They grow near the lake, north-west of here.","Could you bring me 3 blue flowers?"], accept:["Thank you, sweetie! The lake is behind the forest."], progress:["Look near the water, dear."], done:["Oh, they are beautiful! Thank you so much!","Take these coins, dear."] } },
    { id:'letter', npc:'rose', main:true, requires:['flowers'], title:'A Letter for the Captain', type:'deliver', target:'finn', reward:{coins:70, word:'letter'}, lines:{ offer:["I wrote a letter for Captain Finn.","He is at the beach, in the south.","Can you deliver it for me?"], accept:["Thank you! Give it to Captain Finn."], progress:["The beach is south of the village."], done:["A letter from Rose? How nice!","Thank you for bringing it, sailor!"] } },
    { id:'shells', npc:'finn', main:true, title:'Seashells', type:'collect', item:'shell', count:6, reward:{coins:80, word:'shell'}, lines:{ offer:["Ahoy! I'm Captain Finn.","I collect seashells. There are 6 pretty shells on this beach.","Can you find them all?"], accept:["Look along the sand, sailor!"], progress:["Shells hide in the sand. Keep searching!"], done:["All 6 shells! You have sharp eyes!","Here, take these coins."] } },
    { id:'hide', npc:'lily', main:true, title:'Hide and Seek', type:'hide', count:3, spots:[{x:-12,z:-30},{x:22,z:26},{x:-50,z:12}], reward:{coins:60, word:'hide'}, lines:{ offer:["Hi! I'm Lily. Let's play hide and seek!","I will hide 3 times. Can you find me?"], accept:["Close your eyes... ready? Go!"], progress:["Hee hee! I'm hiding somewhere!"], found:["You found me! Now I'll hide again!","Wow, you're good! One more time!"], done:["You found me 3 times! You win!","Here is your prize!"] } },
    { id:'quiz1', npc:'owl', main:true, title:'Word Quiz: Food, Animals, School', type:'quiz', sets:['food','animals','school'], count:8, reward:{coins:100, word:'quiz'}, lines:{ offer:["Hoot hoot! I am Professor Owl.","Let's test your English words!","I show a picture, you pick the right word."], accept:["Excellent! Let's begin."], progress:["Come back when you are ready for the quiz."], done:["Hoot! You know your words very well!","Here is your reward, clever student!"] } },
    { id:'mushrooms', npc:'pierre', main:true, title:'Mushroom Soup', type:'collect', item:'mushroom', count:4, reward:{coins:70, word:'mushroom'}, lines:{ offer:["Bonjour! I am Chef Pierre.","I am making mushroom soup, but I have no mushrooms!","Find 4 purple mushrooms in the forest, please."], accept:["Merci! Purple mushrooms grow in the dark forest."], progress:["Purple ones, not red! The red ones are not for soup."], done:["Magnifique! The soup will be delicious!","Here, some coins for you."] } },
    { id:'eggs', npc:'pierre', main:false, requires:['mushrooms'], title:'Fresh Eggs', type:'collect', item:'egg', count:4, reward:{coins:70, word:'egg'}, lines:{ offer:["Now I need 4 fresh eggs for my cake.","Look around the farm, east of the village."], accept:["Eggs are near the barn and the chickens."], progress:["Four eggs, my friend!"], done:["Perfect eggs! My cake will be the best!"] } },
    { id:'gears', npc:'bolt', main:true, title:'Robot Repair', type:'collect', item:'gear', count:3, reward:{coins:90, word:'robot'}, lines:{ offer:["Bzzt... I am Bolt the robot.","I fell down the mountain and lost 3 gears.","Climb the mountain and find my gears, please. Bzzt."], accept:["Thank you, human. Jump carefully on the rocks."], progress:["Gears... on the mountain... bzzt."], done:["Systems online! Thank you, friend!","Here are coins from my pocket. Bzzt!"] } },
    { id:'math1', npc:'tom', main:true, title:'Math Class: Plus & Minus', type:'quiz', math:1, count:8, reward:{coins:100, word:'plus'}, lines:{ offer:["Hello! I'm Teacher Tom.","Do you like math? Let's practice adding and subtracting!","Answer 8 questions. Ready?"], accept:["Great! Think carefully."], progress:["Come back when you are ready for math class."], done:["Excellent! You are a math star!","Here is your reward."] } },
    { id:'bone', npc:'biscuit', main:false, title:'Biscuit\'s Bone', type:'collect', item:'bone', count:1, reward:{coins:40, word:'dog'}, lines:{ offer:["Woof! Woof!","(Biscuit lost his bone near the well. Can you find it?)"], accept:["(Biscuit wags his tail.)"], progress:["Woof... (He is looking at the well.)"], done:["WOOF! (Biscuit is very happy!)"] } },
    { id:'sky', npc:'finn', main:true, requires:['shells'], title:'The Sky Track', type:'course', target:'sky', reward:{coins:150, word:'bridge'}, lines:{ offer:["You are a brave one! Can you finish the Sky Track?","Cross the bridge in the east and jump over the platforms to the FINISH gate.","Don't fall into the sea!"], accept:["Good luck, sailor! The bridge is east of the farm."], progress:["Reach the FINISH gate on the Sky Track."], done:["You did it! You are a real adventurer!","My boat is ready. Talk to me when you want to sail to Frosty Peak!"] } },
  ],
  chests: [ {id:'s_forest', x:-62, z:-25, coins:50, word:'treasure'}, {id:'s_mountain', x:50, z:-45, y:8, coins:100, word:'mountain'}, {id:'s_beach', x:-62, z:56, coins:50, word:'beach'} ],
  build(){ const T = theme;
    ground(0,0,150,130); ground(0,58,150,18,2,T.sand,T.sand);
    // village
    fountain(0,0); path(0,-20,5,60); path(-20,0,60,5); path(32,0,40,5); path(0,40,5,40);
    house(-14,-14,0.3,0xfff1d6,0xe74c3c); house(14,-14,-0.3,0xfde68a,0x2563eb); house(-18,8,1.2,0xdbeafe,0x16a34a); house(18,8,-1.2,0xfce7f3,0xf59e0b);
    lamp(4,-4); lamp(-4,4); lamp(4,4); lamp(-4,-4); bench(-6,-5,0.6); bench(7,-3,-2.4); well(12,24); stall(-8,16,2.6,0xff6b6b); sign(2,30,'Village',0.2); sign(-26,2,'Forest ➜',-1.5); sign(28,2,'➜ Farm',1.5); sign(2,-24,'Mountain ⬆',0);
    for (let i=0;i<6;i++) flower(-3+i*1.2, 7, 0, [0xff6fae,0xffd43b,0xef4444,0xa855f7][i%4]);
    bush(-10,22); bush(22,-20); bush(-22,-2); bush(24,20);
    // karts
    kart(8,-22,0,0xef4444); kart(12,-22,0,0x3b82f6); sign(16,-22,'Karts',0); ramp(-30,34,8,0.3,4); sign(-26,36,'Ramp!',0);
    // farm
    barn(48,-4,-Math.PI/2); fence(34,2,60,2); fence(60,2,60,22); fence(34,22,60,22); fence(34,2,34,8); fence(34,16,34,22);
    for (let i=0;i<5;i++) spawnItem('egg', 40+R()*16, 4+R()*14);
    [[20,30],[-24,-16],[60,-14]].forEach(([x,z]) => spawnItem('chicken', x, z, 0, {label:false}));
    // forest
    for (let i=0;i<34;i++){ const x = -70+R()*40, z = -32+R()*50; if (Math.hypot(x+45,z+5) < 3) continue; tree(x,z,0,0.9+R()*0.6); }
    for (let i=0;i<5;i++) spawnItem('apple', -66+R()*34, -28+R()*44);
    for (let i=0;i<4;i++) spawnItem('mushroom', -66+R()*30, -28+R()*40);
    for (let i=0;i<6;i++) mushroom(-66+R()*34, -28+R()*44);
    bush(-40,18); bush(-60,-30); rock(-66,-22,0,1.2); rock(-30,-28);
    // owl stump
    cyl(1.4,1.6,1,mat(0x8b5a2b),-20,0.5,-22,world,12); solid(-20,0.5,-22,2.8,1,2.8); sign(-16,-18,'Library',0.5);
    // lake
    water(-30,-44,26,18); for (let i=0;i<10;i++) flower(-44+R()*28,-56+R()*6,0,0x3b82f6); for (let i=0;i<4;i++) spawnItem('flower', -44+R()*28, -34-R()*2);
    rock(-16,-44,0,1); rock(-44,-36,0,0.8); tree(-48,-52); tree(-14,-54);
    // mountain (stacked plateaus)
    plateau(45,2,-40,30,24,2); plateau(47,4,-43,22,16,2); plateau(50,6,-45,14,10,2); plateau(52,8,-46,8,6,2);
    rock(36,-30,0,1.4); rock(60,-52,2,1.6); rock(40,-50,2,1.2); rock(56,-36,4,1.0);
    spawnItem('gear', 40, -36, 2); spawnItem('gear', 54, -40, 4); spawnItem('gear', 52, -46, 8); tree(62,-30); tree(30,-52);
    // beach
    for (let i=0;i<6;i++) spawnItem('shell', -60+i*22+R()*8, 55+R()*8);
    pier(0,66,12,Math.PI); boat(0,82,0); for (let i=0;i<5;i++) tree(-55+i*28, 52, 0, 1, 'palm'); rock(-60,60,0,1.2); rock(-66,54,0,0.9);
    // bone
    spawnItem('bone', 15, 31);
    // sky track bridge + course
    bridge(83,30,16,Math.PI/2); course('sky', 95, 0, 36, [['gaps',{n:5}],['movers',{n:3}],['spinner',{speed:1.5}],['pads',{n:2}],['shrink',{n:5}]]);
    sign(70,27,'Sky Track ➜',1.5);
    // coins scattered
    for (let i=0;i<30;i++) spawnItem('coin', -70+R()*140, -60+R()*120);
  } },
{ id:1, theme:'snow', name:'Frosty Peak', spawn:{x:0,z:30}, intro:"Brrr! Welcome to Frosty Peak. Help the villagers in the snow!",
  npcs: [
    { id:'anna', name:'Anna', x:-6, z:4, yaw:0.5, cfg:{ cap:'beanie', beanie:0xef4444, hoodie:0x3b82f6, pants:0x1e3a8a, hair:0xf59e0b, hairStyle:'long' }, idle:['I love ice skating!','It is so cold today!'] },
    { id:'gus', name:'Miner Gus', x:30, z:-20, yaw:-0.6, cfg:{ cap:'helmet', hoodie:0x7a4b24, pants:0x374151, beard:0x9ca3af, skin:SKIN2 }, idle:['The mountain is full of crystals.','Mind the campfires!'] },
    { id:'yuki', name:'Yuki the Yeti', x:-30, z:-30, yaw:0.9, cfg:{ hoodie:0xffffff, pants:0xe5e7eb, skin:0xbfdbfe, hair:0xffffff, hairStyle:'spiky', cap:null, beard:0xffffff, scale:1.35 }, idle:['Grrr... I mean, hello!','Yetis love snowballs.'] },
    { id:'owl', name:'Professor Owl', x:14, z:14, yaw:-0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Winter words today.'] },
    { id:'tom', name:'Teacher Tom', x:-14, z:14, yaw:1.0, cfg:{ hoodie:0x374151, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:'beanie', beanie:0x3b82f6 }, idle:['Multiplication time!','Three times three is nine!'] },
    { id:'snowy', name:'Snowy', x:10, z:-6, yaw:1, cfg:{ animal:'dog', noCollide:true }, idle:['Woof!'] },
    { id:'finn', name:'Captain Finn', x:0, z:52, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['Brrr! Cold sea today.'] },
  ],
  quests: [
    { id:'snowflakes', npc:'anna', main:true, title:'Magic Snowflakes', type:'collect', item:'snowflake', count:6, reward:{coins:70, word:'snow'}, lines:{ offer:["Hi! I'm Anna.","Magic snowflakes fell around the village. They are shiny!","Can you collect 6 of them?"], accept:["They are near the trees and the frozen lake!"], progress:["Look for the shiny snowflakes!"], done:["Six snowflakes! Now I can make a snow lantern!","Thank you! Here are your coins."] } },
    { id:'crystals', npc:'gus', main:true, title:'Ice Crystals', type:'collect', item:'crystal', count:4, reward:{coins:90, word:'crystal'}, lines:{ offer:["Howdy! I'm Gus the miner.","There are 4 ice crystals high on the mountain.","Climb up and bring them to me. Careful, it's slippery!"], accept:["Jump from rock to rock. Don't touch the campfires!"], progress:["The crystals glow blue. Look up the mountain."], done:["Beautiful crystals! You are a great climber!"] } },
    { id:'key', npc:'gus', main:true, requires:['crystals'], title:'The Lost Key', type:'collect', item:'key', count:1, reward:{coins:60, word:'key'}, lines:{ offer:["I lost the key to my treasure chest!","I think it fell near the big snowman in the north."], accept:["Find the key and open the chest next to my cabin."], progress:["The key is somewhere near the snowmen."], done:["My key! Now go open the chest - it is yours!"] } },
    { id:'quiz2', npc:'owl', main:true, title:'Word Quiz: Winter, Weather, Jobs', type:'quiz', sets:['winter','colors','weather','jobs'], count:8, reward:{coins:100, word:'winter'}, lines:{ offer:["Hoot! Ready for a winter quiz?","Pick the right word for each picture."], accept:["Let's begin!"], progress:["Come back when you are ready."], done:["Hoot hoot! Perfect! You are a word master!"] } },
    { id:'snowball', npc:'yuki', main:true, title:'Yeti\'s Snowman Party', type:'collect', item:'carrot', count:3, reward:{coins:80, word:'yeti'}, lines:{ offer:["Grrr! I mean... hi! I'm Yuki.","My snowmen need noses! Carrots!","Find 3 carrots. Someone left them around the frozen lake."], accept:["Carrots are orange. Easy to see in the snow!"], progress:["Three carrots for three snowmen!"], done:["Perfect noses! My snowmen are happy! Grrr-eat!"] } },
    { id:'math2', npc:'tom', main:true, title:'Math Class: Multiplication', type:'quiz', math:2, count:8, reward:{coins:120, word:'times'}, lines:{ offer:["Hello again! Teacher Tom here, in the snow!","Today: multiplication and division!","8 questions. Can you do it?"], accept:["Let's go! Take your time."], progress:["Ready for multiplication?"], done:["Fantastic! You multiply like a pro!"] } },
    { id:'bone2', npc:'snowy', main:false, title:'Snowy\'s Bone', type:'collect', item:'bone', count:1, reward:{coins:40, word:'bone'}, lines:{ offer:["Woof! (Snowy wants his bone. It is somewhere behind the cabins.)"], accept:["(Snowy jumps happily.)"], progress:["Woof woof..."], done:["WOOF! (Snowy loves you!)"] } },
    { id:'ice', npc:'finn', main:true, requires:['snowflakes'], title:'The Ice Slide', type:'course', target:'ice', reward:{coins:150, word:'ice'}, lines:{ offer:["The Ice Slide is a tricky track over the frozen sea.","Cross the bridge in the east and reach the FINISH gate!"], accept:["It's slippery! Jump carefully."], progress:["Reach the FINISH gate on the Ice Slide."], done:["Amazing! You crossed the Ice Slide!","When you are ready, I'll sail you to the Volcano Jungle!"] } },
  ],
  chests: [ {id:'f_gus', x:36, z:-16, coins:120, word:'chest', needs:'key'}, {id:'f_lake', x:-50, z:30, coins:50, word:'lake'}, {id:'f_peak', x:38, z:-58, y:10, coins:100, word:'peak'} ],
  build(){ const T = theme;
    ground(0,0,140,120); ground(0,52,140,16,2,T.sand,T.sand);
    house(-16,-10,0.4,0xd9b27c,0x8b5a2b,6,5,3); house(16,-10,-0.4,0xc9a37a,0x6b4a2a,6,5,3); house(30,-14,-1.3,0x8b5a2b,0xffffff,5,4,2.8); path(0,0,5,70); path(0,0,60,5);
    lamp(5,5); lamp(-5,-5); bench(-8,8,0.5); sign(4,20,'Frosty Village',0.2); campfire(0,-2); campfire(26,-26); campfire(34,-36);
    snowman(-40,-50); snowman(-30,-56); snowman(-48,-58); spawnItem('key', -34, -54); sign(-34,-44,'Snowmen',0);
    for (let i=0;i<30;i++) tree(-70+R()*140, -58+R()*110, 0, 0.8+R()*0.6);
    water(-40,20,30,24); for (let i=0;i<3;i++) spawnItem('carrot', -56+R()*32, 6+R()*28);
    for (let i=0;i<6;i++) spawnItem('snowflake', -60+R()*120, -40+R()*80, 0.3);
    spawnItem('bone', 20, -2);
    // mountain
    plateau(40,2,-40,34,30,2,T.rock,T.grass); plateau(42,4,-44,26,22,2,T.rock,T.grass); plateau(40,6,-48,18,14,2,T.rock,T.grass); plateau(38,8,-52,12,10,2,T.rock,T.grass); plateau(38,10,-56,8,6,2,T.rock,T.grass);
    rock(28,-30,0,1.4); rock(56,-50,2,1.3); rock(30,-54,4,1.2); rock(48,-58,6,1.1);
    spawnItem('crystal', 32, -36, 2); spawnItem('crystal', 50, -42, 4); spawnItem('crystal', 36, -50, 6); spawnItem('crystal', 42, -54, 8);
    kart(8,22,0,0x22c55e); kart(12,22,0,0xffffff); sign(16,22,'Karts',0); ramp(-20,46,8,0.3,4);
    pier(0,60,12,Math.PI); boat(0,76,0);
    bridge(78,20,16,Math.PI/2); course('ice', 90, 0, 26, [['gaps',{n:5,gap:2.8}],['beams',{len:12}],['movers',{n:4}],['stairs',{n:6}],['pistons',{n:3}],['shrink',{n:6}]]); sign(66,17,'Ice Slide ➜',1.5);
    for (let i=0;i<30;i++) spawnItem('coin', -65+R()*130, -55+R()*105);
  } },
{ id:2, theme:'jungle', name:'Volcano Jungle', spawn:{x:0,z:30}, intro:"Welcome to the Volcano Jungle! The final island. Be careful near the lava!",
  npcs: [
    { id:'maya', name:'Explorer Maya', x:-8, z:6, yaw:0.5, cfg:{ cap:'helmet', hoodie:0xd9b27c, pants:0x7a4b24, hair:0x3a2a1a, hairStyle:'long', backpack:true, backpackColor:0x374151 }, idle:['The jungle is full of secrets!','Watch out for the lava.'] },
    { id:'kapu', name:'Chief Kapu', x:24, z:-10, yaw:-0.8, cfg:{ cap:'crown', hoodie:0xef4444, pants:0xf59e0b, skin:SKIN3, beard:0x222222 }, idle:['Welcome to my village!','The volcano is sleeping... for now.'] },
    { id:'lou', name:'Fisherman Lou', x:4, z:56, yaw:Math.PI, cfg:{ cap:'straw', hoodie:0x16a34a, pants:0x1e3a8a, skin:SKIN3, mustache:0x222222 }, idle:['Fish are jumping today!','Patience is the secret.'] },
    { id:'owl', name:'Professor Owl', x:-22, z:-18, yaw:0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Nature words today.'] },
    { id:'bolt', name:'Bolt', x:40, z:20, yaw:-1, cfg:{ animal:'robot' }, idle:['Bzzt! Hot here!'] },
    { id:'tom', name:'Teacher Tom', x:-16, z:30, yaw:0.8, cfg:{ hoodie:0xd9b27c, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:'straw' }, idle:['Word problems today!','Read carefully!'] },
    { id:'rex', name:'Rex', x:-14, z:20, yaw:1, cfg:{ animal:'dog', noCollide:true }, idle:['Woof!'] },
    { id:'finn', name:'Captain Finn', x:0, z:60, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['What a journey!'] },
  ],
  quests: [
    { id:'bananas', npc:'maya', main:true, title:'Banana Hunt', type:'collect', item:'banana', count:6, reward:{coins:70, word:'banana'}, lines:{ offer:["Hi! I'm Maya, an explorer.","The monkeys dropped bananas all over the jungle.","Can you collect 6 bananas for my expedition?"], accept:["Bananas are yellow. Look under the palm trees!"], progress:["Six bananas! Keep looking."], done:["Perfect! Now we have food for the journey!"] } },
    { id:'coconuts', npc:'kapu', main:true, title:'Coconut Feast', type:'collect', item:'coconut', count:4, reward:{coins:80, word:'coconut'}, lines:{ offer:["I am Chief Kapu. Welcome, traveler!","Tonight we have a feast. We need 4 coconuts.","They fell from the palms near the beach."], accept:["Brown and round. You will find them!"], progress:["Four coconuts for the feast!"], done:["The feast is saved! You are our friend forever!"] } },
    { id:'fish', npc:'lou', main:true, title:'Gone Fishing', type:'collect', item:'fish', count:3, reward:{coins:80, word:'fish'}, lines:{ offer:["Hey! I'm Lou. I need 3 fish for dinner.","Fish jump onto the pier and the rocks near the water.","Grab 3 of them before they jump back!"], accept:["Look along the pier and the shore."], progress:["Three fish, my friend!"], done:["Fresh fish! Dinner is ready. Thank you!"] } },
    { id:'stars', npc:'bolt', main:true, title:'Volcano Stars', type:'collect', item:'star', count:3, reward:{coins:120, word:'volcano'}, lines:{ offer:["Bzzt! Bolt here again!","Three power stars are on the volcano rocks.","Climb up and get them. Do not touch the lava! Bzzt."], accept:["The stars glow gold. Jump on the dark rocks."], progress:["Stars... volcano... bzzt."], done:["Power 100%! You are the best, human!"] } },
    { id:'quiz3', npc:'owl', main:true, title:'Word Quiz: Nature, Body, Sport', type:'quiz', sets:['nature','body','sport','jobs'], count:8, reward:{coins:100, word:'nature'}, lines:{ offer:["Hoot! The final quiz!","Nature and body words. Are you ready?"], accept:["Let's go!"], progress:["Come back when you are ready."], done:["Hoot hoot hoot! You are a true English master!"] } },
    { id:'math3', npc:'tom', main:true, title:'Math Class: Word Problems', type:'quiz', math:3, count:8, reward:{coins:150, word:'total'}, lines:{ offer:["Teacher Tom, on vacation in the jungle!","The final math class: word problems in English.","Read each question and pick the answer."], accept:["You can do it!"], progress:["Ready for word problems?"], done:["Perfect! Math master AND English master!"] } },
    { id:'bone3', npc:'rex', main:false, title:'Rex\'s Bone', type:'collect', item:'bone', count:1, reward:{coins:40, word:'friend'}, lines:{ offer:["Woof! (Rex lost his bone near the big rocks.)"], accept:["(Rex runs in circles.)"], progress:["Woof..."], done:["WOOF WOOF! (Rex is your best friend now!)"] } },
    { id:'lava', npc:'finn', main:true, requires:['stars'], title:'The Lava Run', type:'course', target:'lava', reward:{coins:200, word:'hero'}, lines:{ offer:["The last challenge: the Lava Run!","Cross the bridge in the east. Spinning bars and pistons wait for you.","Reach the FINISH gate and you will be the Island Hero!"], accept:["Go, hero! We believe in you!"], progress:["Reach the FINISH gate on the Lava Run."], done:["YOU DID IT! You finished every island!","You are the ISLAND HERO! Everyone is proud of you!"] } },
  ],
  chests: [ {id:'v_jungle', x:-60, z:-20, coins:80, word:'jungle'}, {id:'v_top', x:40, z:-40, y:12, coins:150, word:'lava'}, {id:'v_beach', x:60, z:50, coins:60, word:'palm'} ],
  build(){ const T = theme;
    ground(0,0,150,130); ground(0,56,150,18,2,0xf4e2a0,0xf4e2a0);
    house(-14,-12,0.3,0xd9b27c,0x7a4b24,5,5,3); house(14,-12,-0.3,0xd9b27c,0x7a4b24,5,5,3); house(26,-16,-1.2,0xef4444,0xffd43b,7,6,3.5); path(0,0,5,70); path(0,0,60,5);
    campfire(0,-2); lamp(5,5); lamp(-5,-5); sign(4,20,'Kapu Village',0.2); bench(8,6,-0.5);
    for (let i=0;i<40;i++) tree(-72+R()*60, -55+R()*110, 0, 0.9+R()*0.5, 'palm'); for (let i=0;i<20;i++) tree(-30+R()*60, -60+R()*30, 0, 0.9+R()*0.5);
    for (let i=0;i<6;i++) spawnItem('banana', -68+R()*55, -50+R()*100); for (let i=0;i<4;i++) spawnItem('coconut', -40+R()*100, 44+R()*10);
    bush(-30,10); bush(20,30); bush(-50,30); rock(-60,-30,0,1.5); rock(-40,30,0,1.1); spawnItem('bone', -58, -34);
    // volcano
    volcano(40,-45,22,20); plateau(28,2,-28,14,10,2,T.rock,T.rock); plateau(50,4,-24,12,8,2,T.rock,T.rock); plateau(58,6,-36,10,8,2,T.rock,T.rock); plateau(54,8,-50,8,6,2,T.rock,T.rock); plateau(40,12,-40,6,6,2,0x4a3a3a,0x4a3a3a);
    hazards.push({x:40,y:-0.3,z:-20,w:8,h:1,d:4,lava:true}); W(rgeo(8,0.2,4,0.1), mat(0xff4a12,{emissive:0xff2a00,emissiveIntensity:1}), 40,0.1,-20);
    spawnItem('star', 50, -24, 4); spawnItem('star', 56, -50, 8); spawnItem('star', 30, -28, 2);
    // beach / pier
    pier(4,64,12,Math.PI); boat(0,82,0); for (let i=0;i<3;i++) spawnItem('fish', 2+(i%2?-1.1:1.1), 58+i*3, 0.2);
    kart(-10,26,0,0xf59e0b); kart(-14,26,0,0xa855f7); sign(-18,26,'Karts',0); ramp(30,40,8,0.3,4);
    bridge(83,20,16,Math.PI/2); course('lava', 95, 0, 26, [['gaps',{n:5,gap:3}],['spinner',{speed:2.2}],['movers',{n:3}],['pistons',{n:4,len:22,period:2.2}],['pads',{n:2}],['shrink',{n:7,gap:3.2}]]); sign(70,17,'Lava Run ➜',1.5);
    for (let i=0;i<30;i++) spawnItem('coin', -70+R()*140, -60+R()*120);
  } },
{ id:3, theme:'desert', name:'Desert Pyramid', spawn:{x:0,z:30}, intro:"Welcome to the Desert! A great pyramid hides treasures... and mummies!",
  npcs: [
    { id:'ra', name:'Pharaoh Ra', x:0, z:-10, yaw:0, cfg:{ cap:'crown', hoodie:0xffd43b, pants:0xffffff, skin:SKIN3, beard:0x111111, tie:0x1e3a8a }, idle:['I am the Pharaoh!','My scarabs are sacred.'] },
    { id:'zoe', name:'Archaeologist Zoe', x:-18, z:4, yaw:0.8, cfg:{ cap:'helmet', hoodie:0xd9b27c, pants:0x7a4b24, hair:0x7a3a1a, hairStyle:'long', glasses:true, backpack:true }, idle:['History is everywhere!','Dig carefully.'] },
    { id:'ali', name:'Merchant Ali', x:18, z:8, yaw:-0.8, cfg:{ cap:'straw', hoodie:0xa855f7, pants:0xf4d58d, skin:SKIN3, mustache:0x222222 }, idle:['Dates, fresh dates!','Best prices in the desert.'] },
    { id:'max', name:'Mummy Max', x:6, z:14, yaw:-0.5, cfg:{ hoodie:0xe5e7eb, pants:0xd1d5db, skin:0xd6d3d1, hair:0xe5e7eb, hairStyle:'bun', cap:null, scale:0.9 }, idle:['Booo! Just kidding.','I love hide and seek!'] },
    { id:'owl', name:'Professor Owl', x:-14, z:-18, yaw:0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Spelling test today!'] },
    { id:'tom', name:'Teacher Tom', x:14, z:-18, yaw:-0.8, cfg:{ hoodie:0x374151, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:'straw' }, idle:['Fractions and percents!'] },
    { id:'sandy', name:'Sandy', x:-8, z:22, yaw:1, cfg:{ animal:'dog', noCollide:true }, idle:['Woof!'] },
    { id:'finn', name:'Captain Finn', x:0, z:62, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['Hot, isn\'t it?'] },
  ],
  quests: [
    { id:'scarabs', npc:'ra', main:true, title:'Golden Scarabs', type:'collect', item:'scarab', count:5, reward:{coins:120, word:'scarab'}, lines:{ offer:["I am Pharaoh Ra. Bow... no, just help me!","Five golden scarabs are lost on the pyramid.","Climb the pyramid and bring them to me."], accept:["The scarabs shine like gold. Jump up the steps!"], progress:["Five scarabs, brave one!"], done:["The scarabs are back! The desert thanks you!"] } },
    { id:'vases', npc:'zoe', main:true, title:'Ancient Vases', type:'collect', item:'vase', count:4, reward:{coins:110, word:'ancient'}, lines:{ offer:["Hi! I'm Zoe, an archaeologist.","Ancient vases are buried around the oasis and the dunes.","Can you find 4 of them?"], accept:["Look near the palm trees and the rocks!"], progress:["Four vases. They are very old, be careful!"], done:["Amazing! These vases are 3000 years old!"] } },
    { id:'dates', npc:'ali', main:true, title:'Sweet Dates', type:'collect', item:'dates', count:6, reward:{coins:100, word:'market'}, lines:{ offer:["Welcome to my market! I'm Ali.","My camel ran away with my dates and dropped them everywhere.","Bring me 6 bunches of dates, please."], accept:["They fell along the road and near the dunes."], progress:["Six bunches, my friend!"], done:["My dates! Business is saved. Thank you!"] } },
    { id:'hide2', npc:'max', main:true, title:'Mummy Hide and Seek', type:'hide', count:3, spots:[{x:-30,z:-30},{x:30,z:-34},{x:0,z:-52}], reward:{coins:100, word:'mummy'}, lines:{ offer:["Boo! I'm Max the Mummy. Don't be scared!","Let's play hide and seek around the pyramid!"], accept:["I'm the best hider in 3000 years!"], progress:["Hee hee... find me!"], found:["Found me! Again!","Wow! One more time!"], done:["You found me 3 times! You win, hero!"] } },
    { id:'spell1', npc:'owl', main:true, title:'Spelling Test: Desert', type:'quiz', spell:true, sets:['desert','castle','food'], count:6, reward:{coins:140, word:'spelling'}, lines:{ offer:["Hoot! A spelling test!","I show a picture, you TYPE the word.","6 words. Ready?"], accept:["Type carefully, hoot!"], progress:["Ready for the spelling test?"], done:["Hoot hoot! Perfect spelling!"] } },
    { id:'math4', npc:'tom', main:true, title:'Math Class: Fractions & Percents', type:'quiz', math:4, count:8, reward:{coins:160, word:'fraction'}, lines:{ offer:["Teacher Tom in the desert!","Fractions, percents and big numbers today.","8 questions. Let's go!"], accept:["Think step by step."], progress:["Ready for fractions?"], done:["Brilliant! Fractions are easy for you!"] } },
    { id:'bone4', npc:'sandy', main:false, title:'Sandy\'s Bone', type:'collect', item:'bone', count:1, reward:{coins:40, word:'sand'}, lines:{ offer:["Woof! (Sandy's bone is buried near the big cactus.)"], accept:["(Sandy digs in the sand.)"], progress:["Woof..."], done:["WOOF! (Sandy is happy!)"] } },
    { id:'pyr', npc:'finn', main:true, requires:['scarabs'], title:'The Pyramid Run', type:'course', target:'pyr', reward:{coins:200, word:'pyramid'}, lines:{ offer:["The Pyramid Run! A track over the sea in the east.","Reach the FINISH gate!"], accept:["Go, hero!"], progress:["Reach the FINISH gate on the Pyramid Run."], done:["Fantastic! The desert is done. Next: the Dragon Castle!"] } },
  ],
  chests: [ {id:'d_top', x:0, z:-46, y:11, coins:200, word:'tomb'}, {id:'d_oasis', x:-52, z:30, coins:80, word:'oasis'}, {id:'d_dune', x:56, z:-20, coins:80, word:'dune'} ],
  build(){ const T = theme;
    ground(0,0,150,130); ground(0,56,150,18,2,T.sand,T.sand);
    house(-14,-8,0.4,0xf4e2a0,0xc2703e,6,5,3); house(16,-8,-0.4,0xf4e2a0,0xc2703e,6,5,3); stall(18,10,-0.8,0xa855f7); path(0,10,5,50); path(0,0,60,5);
    lamp(5,5); lamp(-5,-5); sign(4,22,'Oasis Town',0.2); well(-8,16);
    pyramid(0,-40,5,36,2.2); for (let i=0;i<5;i++) spawnItem('scarab', -12+R()*24, -30-R()*26, [2.2,4.4,6.6,8.8,2.2][i]);
    for (let i=0;i<26;i++) tree(-70+R()*140, -58+R()*110, 0, 0.8+R()*0.6); water(-50,30,22,16); for (let i=0;i<4;i++) tree(-60+R()*20, 20+R()*20, 0, 1, 'palm');
    for (let i=0;i<4;i++) spawnItem('vase', -60+R()*40, 10+R()*40); for (let i=0;i<6;i++) spawnItem('dates', -30+R()*80, 20+R()*30);
    rock(50,-20,0,1.6,0xb08968); rock(56,-26,0,1.2,0xb08968); rock(-40,-20,0,1.4,0xb08968); spawnItem('bone', 44, 30); tree(42,32,0,1.3);
    kart(8,30,0,0xf59e0b); kart(12,30,0,0xffffff); sign(16,30,'Karts',0); ramp(-20,46,8,0.3,4);
    pier(0,66,12,Math.PI); boat(0,82,0);
    bridge(83,20,16,Math.PI/2); course('pyr', 95, 0, 26, [['gaps',{n:6,gap:3}],['stairs',{n:8}],['spinner',{speed:2}],['movers',{n:4}],['beams',{len:14}],['shrink',{n:7,gap:3.4}]]); sign(70,17,'Pyramid Run ➜',1.5);
    for (let i=0;i<30;i++) spawnItem('coin', -70+R()*140, -60+R()*120);
  } },
{ id:4, theme:'castle', name:'Dragon Castle', spawn:{x:0,z:34}, intro:"Welcome to Dragon Castle! Knights, wizards and a sleeping dragon live here.",
  npcs: [
    { id:'arthur', name:'King Arthur', x:0, z:-16, yaw:0, cfg:{ cap:'crown', hoodie:0x7c3aed, pants:0x1e3a8a, beard:0xd9b27c, tie:0xffd43b }, idle:['Welcome to my castle!','A king needs brave helpers.'] },
    { id:'lance', name:'Knight Lance', x:-14, z:-4, yaw:0.8, cfg:{ cap:'helmet', hoodie:0x9ca3af, pants:0x6b7280, skin:SKIN2 }, idle:['For the kingdom!','My armor is heavy.'] },
    { id:'merlin', name:'Wizard Merlin', x:16, z:-4, yaw:-0.8, cfg:{ cap:'wizard', hoodie:0x4a2a8a, pants:0x312e81, beard:0xe5e7eb, hair:0xe5e7eb }, idle:['Abracadabra!','Magic needs potions.'] },
    { id:'guin', name:'Lady Guin', x:-6, z:10, yaw:0.3, cfg:{ dress:true, hoodie:0xff6fae, hair:0xf59e0b, hairStyle:'long', cap:null }, idle:['What a lovely day!','I wrote a letter for the King.'] },
    { id:'smith', name:'Blacksmith Bo', x:20, z:16, yaw:-1, cfg:{ apron:0x7a4b24, hoodie:0x374151, pants:0x1f2937, beard:0x3a2a1a, skin:SKIN3 }, idle:['Clang! Clang!','Swords need sharpening.'] },
    { id:'owl', name:'Professor Owl', x:-20, z:18, yaw:0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Castle words!'] },
    { id:'tom', name:'Teacher Tom', x:10, z:26, yaw:-0.5, cfg:{ hoodie:0x374151, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:null }, idle:['Word problems, level up!'] },
    { id:'rex2', name:'Max the Hound', x:-16, z:28, yaw:1, cfg:{ animal:'dog', noCollide:true }, idle:['Woof!'] },
    { id:'finn', name:'Captain Finn', x:0, z:62, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['A castle by the sea!'] },
  ],
  quests: [
    { id:'shields', npc:'lance', main:true, title:'Lost Shields', type:'collect', item:'shield', count:5, reward:{coins:120, word:'knight'}, lines:{ offer:["Greetings! I am Knight Lance.","After the tournament, 5 shields are missing.","Please find them around the castle walls."], accept:["They are blue with a golden cross."], progress:["Five shields, squire!"], done:["All shields found! You are a true squire!"] } },
    { id:'potions', npc:'merlin', main:true, title:'Magic Potions', type:'collect', item:'potion', count:4, reward:{coins:130, word:'potion'}, lines:{ offer:["I am Merlin the wizard.","I need 4 purple potions for a spell.","They glow in the dark forest and near the towers."], accept:["Don't drink them! They turn you into a frog."], progress:["Four potions, apprentice."], done:["The spell is ready! Abracadabra!"] } },
    { id:'letter2', npc:'guin', main:true, title:'A Royal Letter', type:'deliver', target:'arthur', reward:{coins:90, word:'royal'}, lines:{ offer:["Hello! I'm Lady Guin.","Please deliver this letter to King Arthur in the castle."], accept:["The King is in the great hall, north of here."], progress:["Find King Arthur!"], done:["A letter from Lady Guin! Wonderful news!","Thank you, messenger!"] } },
    { id:'swords', npc:'smith', main:true, title:'Three Swords', type:'collect', item:'sword', count:3, reward:{coins:110, word:'sword'}, lines:{ offer:["I'm Bo the blacksmith.","The knights left 3 swords on the training field and the walls.","Bring them back for sharpening."], accept:["Careful, they are sharp!"], progress:["Three swords!"], done:["Perfect! Now they shine again!"] } },
    { id:'quiz4', npc:'owl', main:true, title:'Word Quiz: Castle & Jobs', type:'quiz', sets:['castle','jobs','desert'], count:8, reward:{coins:120, word:'kingdom'}, lines:{ offer:["Hoot! Castle words today!"], accept:["Let's begin!"], progress:["Ready?"], done:["Hoot! Excellent!"] } },
    { id:'math5', npc:'tom', main:true, title:'Math Class: Level Up', type:'quiz', math:5, count:8, reward:{coins:170, word:'area'}, lines:{ offer:["Teacher Tom at the castle!","Distance, area, rounding... real-life math!","8 questions."], accept:["You can do it!"], progress:["Ready?"], done:["Outstanding! You are a math knight!"] } },
    { id:'bone5', npc:'rex2', main:false, title:'Hound\'s Bone', type:'collect', item:'bone', count:1, reward:{coins:40, word:'hound'}, lines:{ offer:["Woof! (The bone is near the dragon's cave.)"], accept:["(Max wags his tail.)"], progress:["Woof..."], done:["WOOF!"] } },
    { id:'dragon', npc:'finn', main:true, requires:['shields'], title:'The Dragon Run', type:'course', target:'dragon', reward:{coins:220, word:'dragon'}, lines:{ offer:["The Dragon Run waits in the east!","Spinning bars, pistons... reach the FINISH gate!"], accept:["Be brave!"], progress:["Reach the FINISH gate on the Dragon Run."], done:["The dragon is impressed! Next stop: the Space Station!"] } },
  ],
  chests: [ {id:'c_tower', x:-30, z:-40, y:11, coins:200, word:'tower'}, {id:'c_cave', x:50, z:-40, coins:120, word:'cave'}, {id:'c_hall', x:0, z:-30, coins:100, word:'hall'} ],
  build(){ const T = theme;
    ground(0,0,150,130); ground(0,56,150,18,2,T.sand,T.sand);
    // castle
    castleWall(-30,-50,30,-50); castleWall(-30,-50,-30,-24); castleWall(30,-50,30,-24); castleWall(-30,-24,-10,-24); castleWall(10,-24,30,-24);
    tower(-30,-50,10,3); tower(30,-50,10,3); tower(-30,-24,8,2.5); tower(30,-24,8,2.5); plateau(-30,10,-40,6,6,1,T.rock,T.rock);
    house(0,-36,0,0xd9c7a3,0x7c3aed,14,10,6); path(0,-10,6,30); flagpole(0,-30,0x7c3aed); lamp(-6,-20); lamp(6,-20);
    house(-16,12,0.5,0xfff1d6,0xe74c3c,6,5,3); house(18,10,-0.5,0xfde68a,0x2563eb,6,5,3); stall(22,18,-1,0x374151); fountain(0,4); bench(-6,-2,0.6); sign(4,20,'Castle Town',0.2);
    for (let i=0;i<30;i++) tree(-72+R()*50, -58+R()*110, 0, 0.9+R()*0.6); for (let i=0;i<10;i++) tree(40+R()*30, 0+R()*50, 0, 0.9+R()*0.6);
    for (let i=0;i<5;i++) spawnItem('shield', -40+R()*80, -60+R()*20, 0.5); for (let i=0;i<4;i++) spawnItem('potion', -70+R()*40, -50+R()*80); for (let i=0;i<3;i++) spawnItem('sword', 40+R()*25, -10+R()*40);
    // dragon cave
    plateau(50,3,-40,16,12,3,T.rock,T.rock); rock(44,-48,3,1.6); rock(56,-48,3,1.4); const dr = new THREE.Group(); dr.position.set(50,3,-40); world.add(dr); const dm = mat(0x16a34a); const body = sphere(2.2,dm,0,1.2,0,dr,16); body.scale.set(1.6,0.9,1); const head = sphere(1.2,dm,3.2,1.6,0,dr,14); [-0.5,0.5].forEach(ez => { sphere(0.25,mat(0xffd43b,{emissive:0xffaa00,emissiveIntensity:0.8}),4.1,1.9,ez,dr,8); cone(0.2,0.6,mat(0xfff1d6),3.4,2.6,ez*0.6,dr,6); }); for (let i=0;i<5;i++) cone(0.3,0.8,mat(0xef4444),-2+i*1,2.3,0,dr,5); const tail = cone(0.5,3,dm,-4,1,0,dr,8); tail.rotation.z = Math.PI/2; [[-1,1.5],[1,1.5]].forEach(([x,z]) => { const w = mesh(rgeo(2.5,0.15,1.6,0.3), mat(0x15803d), x,2.2,z*1.4, dr); w.rotation.x = z>0?-0.5:0.5; }); solid(50,4.2,-40,7,2.4,4); spawnItem('bone', 40, -32, 3); sign(40,-28,'Dragon cave',0.5);
    kart(8,30,0,0x7c3aed); kart(12,30,0,0xffd43b); sign(16,30,'Karts',0); ramp(-20,46,8,0.3,4);
    pier(0,66,12,Math.PI); boat(0,82,0);
    bridge(83,20,16,Math.PI/2); course('dragon', 95, 0, 26, [['gaps',{n:6,gap:3.2}],['pistons',{n:4,len:22,period:2.2}],['spinner',{speed:2.4}],['pads',{n:3,dist:13}],['movers',{n:4}],['shrink',{n:8,gap:3.6}]]); sign(70,17,'Dragon Run ➜',1.5);
    for (let i=0;i<30;i++) spawnItem('coin', -70+R()*140, -60+R()*120);
  } },
{ id:5, theme:'space', name:'Space Station', spawn:{x:0,z:30}, intro:"Welcome to the Space Station! Low gravity: you can jump very high!",
  npcs: [
    { id:'nova', name:'Commander Nova', x:0, z:-12, yaw:0, cfg:{ cap:'helmet', hoodie:0xffffff, pants:0x374151, hair:0x3a2a1a, hairStyle:'bun', tie:0x00f5d4 }, idle:['Welcome aboard!','Gravity is low here, careful!'] },
    { id:'zed', name:'Alien Zed', x:-16, z:4, yaw:0.8, cfg:{ cap:'antenna', hoodie:0x9b5de5, pants:0x4a2a8a, skin:0x7fe04a, hair:0x5fbf3a, eyes:0x111111, scale:0.9 }, idle:['Greetings, earthling!','Zorp zorp!'] },
    { id:'quark', name:'Dr. Quark', x:16, z:4, yaw:-0.8, cfg:{ hoodie:0xffffff, pants:0x374151, glasses:true, hair:0xe5e7eb, hairStyle:'spiky', cap:null }, idle:['Science!','My batteries are gone!'] },
    { id:'bolt', name:'Bolt', x:10, z:18, yaw:-0.5, cfg:{ animal:'robot' }, idle:['Bzzt! Home at last!'] },
    { id:'owl', name:'Professor Owl', x:-14, z:-24, yaw:0.6, cfg:{ animal:'owl' }, y:1.0, idle:['Hoot! Space words!'] },
    { id:'tom', name:'Teacher Tom', x:14, z:-24, yaw:-0.8, cfg:{ hoodie:0x374151, pants:0x1f2937, tie:0xef4444, glasses:true, hair:0x3a2a1a, cap:'helmet' }, idle:['Space math!'] },
    { id:'pilot', name:'Pilot Pip', x:-8, z:22, yaw:0.5, cfg:{ cap:0x00bbf9, hoodie:0x00bbf9, pants:0x1f2937, sunglasses:true }, idle:['Ready for take-off!'] },
    { id:'finn', name:'Captain Finn', x:0, z:60, yaw:Math.PI, cfg:{ cap:'sailor', hoodie:0x1e3a8a, pants:0xffffff, beard:0x4a3a2a, skin:SKIN2 }, idle:['A boat in space? Why not!'] },
  ],
  quests: [
    { id:'moonrocks', npc:'zed', main:true, title:'Moon Rocks', type:'collect', item:'moonrock', count:5, reward:{coins:130, word:'gravity'}, lines:{ offer:["Zorp! I am Zed from planet Zog.","I collect moon rocks. Five of them are near the craters.","Can you get them? You can jump high here!"], accept:["Jump, jump! Low gravity is fun!"], progress:["Five moon rocks, earthling."], done:["Zorp zorp! My collection is complete!"] } },
    { id:'batteries', npc:'quark', main:true, title:'Power Up', type:'collect', item:'battery', count:4, reward:{coins:130, word:'energy'}, lines:{ offer:["I'm Dr. Quark. The station is losing power!","Find 4 batteries on the platforms and bring them here."], accept:["Green batteries. Look on the high platforms!"], progress:["Four batteries!"], done:["Power restored! You saved the station!"] } },
    { id:'letter3', npc:'pilot', main:true, title:'Flight Plan', type:'deliver', target:'nova', reward:{coins:90, word:'launch'}, lines:{ offer:["Hi! I'm Pip, the pilot.","Deliver this flight plan to Commander Nova, please."], accept:["She is at the command deck, north."], progress:["Find Commander Nova!"], done:["The flight plan! Thank you, cadet!"] } },
    { id:'quiz5', npc:'owl', main:true, title:'Word Quiz: Space & Science', type:'quiz', sets:['space','science','weather'], count:8, reward:{coins:130, word:'science'}, lines:{ offer:["Hoot! Space and science words!"], accept:["Let's go!"], progress:["Ready?"], done:["Hoot! You are a space scientist!"] } },
    { id:'spell2', npc:'owl', main:true, requires:['quiz5'], title:'Spelling Test: Space', type:'quiz', spell:true, sets:['space','animals','school'], count:6, reward:{coins:150, word:'astronaut'}, lines:{ offer:["Hoot! Now TYPE the words!","6 words. Spell them right!"], accept:["Careful with every letter!"], progress:["Ready to spell?"], done:["Hoot hoot! Perfect!"] } },
    { id:'math6', npc:'tom', main:true, title:'Math Class: Space Mission', type:'quiz', math:5, count:10, reward:{coins:200, word:'mission'}, lines:{ offer:["Teacher Tom in space!","10 questions. The final math mission!"], accept:["3... 2... 1... go!"], progress:["Ready?"], done:["MISSION COMPLETE! Math genius!"] } },
    { id:'orbit', npc:'finn', main:true, requires:['moonrocks'], title:'The Orbit Run', type:'course', target:'orbit', reward:{coins:250, word:'orbit'}, lines:{ offer:["The last track: the Orbit Run!","Low gravity, big jumps. Reach the FINISH gate!"], accept:["Fly, hero!"], progress:["Reach the FINISH gate on the Orbit Run."], done:["YOU FINISHED EVERYTHING! You are the GALAXY HERO!"] } },
  ],
  chests: [ {id:'s_deck', x:0, z:-40, y:8, coins:250, word:'deck'}, {id:'s_crater', x:-50, z:-30, coins:100, word:'crater'}, {id:'s_lab', x:40, z:20, coins:100, word:'laboratory'} ],
  build(){ const T = theme;
    ground(0,0,150,130,2,T.dirt,T.grass); 
    spacePad(0,0,8); spacePad(0,30,5); for (let i=0;i<8;i++) crater(-60+R()*120, -55+R()*110, 3+R()*4);
    house(-16,-10,0.4,0xd1d5db,0x00bbf9,6,5,3); house(16,-10,-0.4,0xd1d5db,0xf15bb5,6,5,3); house(40,20,-1.2,0xd1d5db,0x9b5de5,8,6,3.5); path(0,0,5,60,0x4a5070); path(0,0,60,5,0x4a5070);
    // command deck tower (floating platforms)
    plateau(0,3,-30,16,10,1,T.rock,T.rock); plateau(0,6,-36,10,8,1,T.rock,T.rock); plateau(0,8,-40,6,6,1,T.rock,T.rock); for (let i=0;i<4;i++) spawnItem('battery', -40+R()*80, -50+R()*20, [3,6,8,3][i]);
    for (let i=0;i<5;i++) spawnItem('moonrock', -60+R()*120, -55+R()*110);
    for (let i=0;i<24;i++) tree(-70+R()*140, -58+R()*110); lamp(5,5); lamp(-5,-5); sign(4,22,'Station Alpha',0.2);
    kart(8,40,0,0x00f5d4); kart(12,40,0,0xf15bb5); sign(16,40,'Karts',0); ramp(-20,46,8,0.3,4);
    pier(0,66,12,Math.PI); boat(0,82,0);
    bridge(83,20,16,Math.PI/2); course('orbit', 95, 0, 26, [['gaps',{n:6,gap:4.5,size:3}],['pads',{n:3,dist:16}],['spinner',{speed:2.6}],['movers',{n:4}],['pistons',{n:4,len:24,period:2}],['shrink',{n:8,gap:5}]]); sign(70,17,'Orbit Run ➜',1.5);
    for (let i=0;i<30;i++) spawnItem('coin', -70+R()*140, -60+R()*120);
  } },
];
