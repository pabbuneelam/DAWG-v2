(()=>{"use strict";
const KEY="lifestyle_state",PREV_KEY="dawg_v4_state",OLD_KEY="dawg_v3_state";

// Radar order runs clockwise from the top, matching the Progress layout.
const CATEGORIES={
  physical:{name:"Physical",icon:"💪",color:"#2fd08f",desc:"Movement, fitness and taking care of your body",ideas:["Work out for 45 minutes", "Go for a 30 minute walk", "Stretch for 15 minutes", "Hit 10,000 steps", "Do 50 push-ups", "Run 3 km", "Drink 3 litres of water", "Eat a vegetable with every meal", "No sugary drinks today", "Do a 20 minute yoga session", "Take the stairs everywhere", "Sleep 8 hours", "Do a 5 minute plank challenge", "Cook a healthy meal at home", "Go for a bike ride", "Do 100 squats", "Foam roll for 10 minutes", "Hit my protein target", "Play a sport for 30 minutes", "No junk food today", "Take a cold shower", "Walk after dinner for 15 minutes", "Do a full mobility routine", "Swim for 20 minutes"]},
  social:{name:"Social",icon:"🤝",color:"#3f7bff",desc:"Relationships, communication and community",ideas:["Call or text a friend", "Talk to someone new", "Spend intentional time with family", "Reach out to someone I have not talked to recently", "Compliment someone sincerely", "Eat a meal with someone, no phones", "Ask a friend how they are really doing", "Thank someone who helped me", "Plan a hangout for this week", "Join a group conversation in class or at work", "Send a voice note to a family member", "Help someone without being asked", "Introduce two people who should know each other", "Listen more than I talk in one conversation", "Message a mentor or teacher", "Say yes to an invitation", "Write a thank-you note", "Call a grandparent or relative", "Check in on a friend who has gone quiet", "Hold eye contact and smile at strangers", "Give someone my full attention for 20 minutes", "Apologise for something I owe an apology for", "Make plans with a new friend", "Volunteer for 30 minutes"]},
  discipline:{name:"Discipline",icon:"⚡",color:"#ff4436",desc:"Doing what you said you would do",ideas:["Wake up at my planned time", "Less than 2 hours of screen time", "Finish my hardest task first", "No unnecessary scrolling during work", "Make my bed right after waking up", "Phone out of the bedroom tonight", "No social media before noon", "Go to bed by 11 PM", "Keep my room/workspace organized", "Do one thing I have been putting off", "No snoozing the alarm", "Stick to my planned schedule", "Delete one distracting app for the day", "Do the dishes right after eating", "No YouTube Shorts, Reels or TikTok today", "Spend 0 money on things I do not need", "Follow through on one promise I made", "Set out tomorrow's clothes tonight", "Work 90 minutes with my phone in another room", "No complaining for the whole day", "Clear my inbox to zero", "Review my day before bed", "Turn off all non-essential notifications", "Finish what I start today"]},
  mental:{name:"Mental",icon:"🧠",color:"#e8c41a",desc:"Mindset, reflection and emotional balance",ideas:["Meditate for 10 minutes", "Journal for 10 minutes", "Write down 3 things I am grateful for", "Take 15 minutes away from my phone", "Spend 20 minutes outside in daylight", "Do 5 minutes of deep breathing", "Write down what is stressing me and one next step", "Go for a walk without headphones", "Read something that calms me", "Name one win from today", "Have a no-news day", "Visualise how I want tomorrow to go", "Do a 10 minute body scan", "Listen to music with no distractions", "Write a kind note to myself", "Take a 20 minute nap or rest", "Do a digital detox hour", "Practise saying no to one thing", "Spend 10 minutes in silence", "Write down one worry and let it go", "Stretch and breathe before bed", "Notice and label my emotions 3 times today", "Do something creative for fun", "Reflect on what I learned this week"]},
  intellect:{name:"Intellect",icon:"📚",color:"#ff7d22",desc:"Learning, studying and building knowledge",ideas:["Read 20 pages", "Study for 2 hours", "Learn one new concept", "Work on a class or personal project", "Watch an educational video and take notes", "Practise a language for 15 minutes", "Do 30 minutes of focused revision", "Write a summary of something I read", "Solve 5 practice problems", "Listen to an educational podcast", "Learn 10 new words", "Teach someone what I learned today", "Read one long-form article", "Do flashcards for 20 minutes", "Take an online lesson", "Research a topic I am curious about", "Practise an instrument for 30 minutes", "Write 300 words about an idea", "Review my notes from this week", "Read the news from two different sources", "Learn a new keyboard shortcut or tool", "Do a puzzle or brain game for 15 minutes", "Ask one good question in class or at work", "Finish one chapter of a book"]},
  ambition:{name:"Ambition",icon:"🚀",color:"#9257ff",desc:"Goals, career, projects and future growth",ideas:["Work 30 minutes on my biggest goal", "Build something for my portfolio", "Apply to an opportunity", "Plan tomorrow's top 3 priorities", "Write down my 1-year goal and read it", "Update my CV or LinkedIn", "Reach out to someone in my target field", "Spend an hour on my side project", "Set three goals for this week", "Track every expense today", "Save a set amount of money", "Learn one skill that helps my career", "Pitch or share my work with someone", "Read about someone I admire", "Break a big goal into small steps", "Finish one task that moves my career forward", "Research a job or course I want", "Post or publish something I made", "Ask for feedback on my work", "Review progress on my goals", "Practise for an interview", "Write a plan for my next 90 days", "Attend an event or meetup", "Do one thing that scares me professionally"]}
};
const CATS=Object.keys(CATEGORIES);

// Ranks: 9 tiers × 3 divisions, 3 levels per division, then Legend.
const TIERS=[["Iron","#8d8d98"],["Bronze","#c98b5a"],["Silver","#cfd4de"],["Gold","#f0c75e"],["Platinum","#5fd8c8"],["Diamond","#6fa8ff"],["Master","#e0384a"],["Ascendant","#f5c542"],["Immortal","#8f5bff"]];
const ROMAN=["I","II","III"],LVLS_PER_RANK=3,RANK_COUNT=TIERS.length*3+1;
function rankByIndex(i){
  if(i>=RANK_COUNT-1)return{idx:RANK_COUNT-1,name:"Legend",tier:"Legend",div:"★",color:"#ffffff",start:(RANK_COUNT-1)*LVLS_PER_RANK+1,end:Infinity};
  const t=TIERS[Math.floor(i/3)];
  return{idx:i,name:`${t[0]} ${ROMAN[i%3]}`,tier:t[0],div:ROMAN[i%3],color:t[1],start:i*LVLS_PER_RANK+1,end:(i+1)*LVLS_PER_RANK};
}
function rankAt(level){return rankByIndex(Math.min(RANK_COUNT-1,Math.floor((level-1)/LVLS_PER_RANK)))}

// Each level needs a bit more XP than the last.
const xpFor=l=>100+20*(l-1);
function levelInfo(xp=state.xp){let l=1,rem=xp;while(rem>=xpFor(l)){rem-=xpFor(l);l++}return{level:l,into:rem,need:xpFor(l)}}

const DAILY=[
  {name:"The Stoic",task:"Meditate for 10 minutes in silence",category:"mental"},
  {name:"The Monk",task:"No social media for the whole day",category:"discipline"},
  {name:"The Scholar",task:"Read 30 pages of a book",category:"intellect"},
  {name:"The Early Riser",task:"Be out of bed before 7:00 AM",category:"discipline"},
  {name:"The Spartan",task:"Do 100 push-ups across the day",category:"physical"},
  {name:"The Connector",task:"Start a real conversation with 3 people",category:"social"},
  {name:"The Architect",task:"Write your top 3 goals for the week and the first step for each",category:"ambition"},
  {name:"The Cold Plunge",task:"Finish your shower with 60 seconds of cold water",category:"physical"},
  {name:"The Builder",task:"Spend 1 focused hour on a side project",category:"ambition"},
  {name:"The Wanderer",task:"Walk 10,000 steps",category:"physical"},
  {name:"The Writer",task:"Fill one full page in your journal",category:"mental"},
  {name:"The Minimalist",task:"Declutter one room, drawer or desk completely",category:"discipline"},
  {name:"The Gentleman",task:"Do something kind for someone without being asked",category:"social"},
  {name:"The Strategist",task:"Learn one new skill from a tutorial and practise it",category:"intellect"}
];
const WEEKLY=[
  {name:"Perfect Week",desc:"Complete every goal on 5 days this week",target:5,count:days=>days.filter(d=>state.history[d]?.completed).length},
  {name:"Deep Worker",desc:"Finish 5 focus sessions this week",target:5,count:days=>days.reduce((n,d)=>n+(state.focus[d]||0),0)},
  {name:"The Reflector",desc:"Write a journal entry on 4 days this week",target:4,count:days=>days.filter(d=>state.journal[d]?.text).length},
  {name:"Challenge Hunter",desc:"Complete 4 daily challenges this week",target:4,count:days=>days.filter(d=>state.daily[d]).length},
  {name:"Body Builder",desc:"Complete 10 Physical goals this week",target:10,count:days=>days.reduce((n,d)=>n+catDoneOn("physical",d),0)}
];
const METRICS=[
  {key:"water",label:"Water",unit:"glasses",step:1,icon:"💧"},
  {key:"sleep",label:"Sleep",unit:"hours",step:0.5,icon:"🌙"},
  {key:"workout",label:"Workout",unit:"min",step:5,icon:"🏋️"},
  {key:"steps",label:"Steps",unit:"steps",step:500,icon:"👟"},
  {key:"calories",label:"Calories",unit:"kcal",step:50,icon:"🔥"},
  {key:"protein",label:"Protein",unit:"g",step:5,icon:"🥩"}
];
const MOODS=["😞","😕","😐","🙂","😄"];

const $=id=>document.getElementById(id),uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad=n=>String(n).padStart(2,"0"),ds=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>ds(new Date());
const parse=k=>new Date(k+"T12:00:00");
function addDays(k,n){const d=parse(k);d.setDate(d.getDate()+n);return ds(d)}
const daysBetween=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate=(k,o={month:"short",day:"numeric",year:"numeric"})=>parse(k).toLocaleDateString(undefined,o);
function weekStart(k=today()){const d=parse(k),off=(d.getDay()+6)%7;return addDays(k,-off)}

function fresh(){return{name:"",goals:[],log:{},xp:0,bestStreak:0,history:{},journal:{},program:null,challenges:[],daily:{},weekly:{},focus:{},metrics:{},todos:[],rankDates:{0:today()},firstDay:today()}}
function migrate(old){
  const s=fresh();
  s.goals=(old.goals||[]).map(g=>({id:g.id||uid(),name:g.name,category:CATEGORIES[g.category]?g.category:"discipline",xp:g.xp||10}));
  s.log[today()]=(old.goals||[]).filter(g=>g.done).map(g=>g.id);
  s.xp=old.xp||0;s.bestStreak=old.bestStreak||0;s.history=old.history||{};
  Object.entries(old.journal||{}).forEach(([k,v])=>{if(v)s.journal[k]={text:String(v),mood:null}});
  const keys=Object.keys(s.history).sort();if(keys.length)s.firstDay=keys[0];
  return s;
}
function load(){
  for(const k of[KEY,PREV_KEY])try{const x=JSON.parse(localStorage.getItem(k));if(x&&Array.isArray(x.goals))return{...fresh(),...x}}catch(e){}
  try{const o=JSON.parse(localStorage.getItem(OLD_KEY));if(o&&Array.isArray(o.goals))return migrate(o)}catch(e){}
  return fresh();
}
let state=load(),labTab="focusTab",progWeek=null,mood=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast("Could not save on this device.")}}

/* ---------- derived data ---------- */
const active=()=>state.goals.filter(g=>!g.archived);
const goalById=id=>state.goals.find(g=>g.id===id);
const doneOn=k=>state.log[k]||[];
const isDone=id=>doneOn(today()).includes(id);
const catGoals=c=>active().filter(g=>g.category===c);
function catDoneOn(c,k){return doneOn(k).filter(id=>goalById(id)?.category===c).length+(state.daily[k]&&dailyFor(k).category===c?1:0)}
function catLifetime(c){return[...new Set([...Object.keys(state.log),...Object.keys(state.daily)])].reduce((n,k)=>n+catDoneOn(c,k),0)}
function totalDone(){return Object.values(state.log).reduce((n,a)=>n+a.length,0)}
function syncToday(){
  const k=today(),act=active();
  if(!act.length&&!state.history[k])return;
  const ids=new Set(act.map(g=>g.id)),done=doneOn(k).filter(id=>ids.has(id)).length;
  state.history[k]={done,total:act.length,score:act.length?Math.round(done/act.length*100):0,completed:act.length>0&&done===act.length};
}
function streak(){let k=today();if(!state.history[k]?.completed)k=addDays(k,-1);let n=0;while(state.history[k]?.completed){n++;k=addDays(k,-1)}return n}
function statScore(c){
  const n=catGoals(c).length;if(!n&&!catLifetime(c))return 0;
  const from=daysBetween(state.firstDay,today())>13?addDays(today(),-13):state.firstDay,span=daysBetween(from,today())+1;
  let done=0;for(let i=0;i<span;i++)done+=catDoneOn(c,addDays(from,i));
  const rate=n?Math.min(1,done/(span*n)):0;
  return Math.min(100,Math.round(rate*80+Math.min(20,catLifetime(c)/3)));
}
const ovr=()=>Math.round(CATS.reduce((n,c)=>n+statScore(c),0)/CATS.length);
const dailyFor=k=>DAILY[((daysBetween("2024-01-01",k)%DAILY.length)+DAILY.length)%DAILY.length];
const weeklyFor=k=>WEEKLY[((Math.floor(daysBetween("2024-01-01",weekStart(k))/7)%WEEKLY.length)+WEEKLY.length)%WEEKLY.length];

function gainXP(n,msg){
  const before=levelInfo().level;state.xp=Math.max(0,state.xp+n);const after=levelInfo().level;
  if(after>before){
    const rb=rankAt(before),ra=rankAt(after);
    for(let i=rb.idx+1;i<=ra.idx;i++)if(!state.rankDates[i])state.rankDates[i]=today();
    toast(ra.idx!==rb.idx?`Rank up → ${ra.name}`:`Level up → LVL ${after}`);
  }else if(msg)toast(msg);
}

/* ---------- visuals ---------- */
const hex=(c,cls="")=>`<span class="hex ${cls}" style="--c:${c}"></span>`;
function badge(r,{size=56,locked=false}={}){
  const c=locked?"#3b3b45":r.color;
  return `<svg class="badge${locked?" locked":""}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true" style="--c:${c}">
    <path d="M50 4 L88 18 V48 C88 72 72 88 50 97 C28 88 12 72 12 48 V18 Z" fill="${c}" fill-opacity=".16" stroke="${c}" stroke-width="3"/>
    <path d="M50 14 L78 25 V48 C78 66 66 78 50 85 C34 78 22 66 22 48 V25 Z" fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="1.5"/>
    <path d="M50 24 L68 36 L62 58 H38 L32 36 Z" fill="${c}" fill-opacity="${locked?.25:.9}"/>
    <path d="M50 24 L68 36 L50 42 L32 36 Z" fill="#fff" fill-opacity="${locked?.05:.35}"/>
    <text x="50" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="${c}" font-family="Georgia,serif">${esc(r.div)}</text>
    ${locked?'<g transform="translate(14 68)"><rect x="0" y="8" width="16" height="13" rx="3" fill="#5a5a66"/><path d="M4 8 V5 a4 4 0 0 1 8 0 V8" fill="none" stroke="#5a5a66" stroke-width="2.5"/></g>':""}
  </svg>`;
}

/* ---------- render ---------- */
function render(){
  syncToday();
  const s=streak();if(s>state.bestStreak)state.bestStreak=s;
  const li=levelInfo(),r=rankAt(li.level),h=state.history[today()]||{done:0,total:0,score:0};
  $("heroBadge").innerHTML=badge(r,{size:96});document.querySelector(".hero").style.setProperty("--c",r.color);
  $("rank").textContent=r.name;$("level").textContent="Level "+li.level;
  $("xpText").textContent=`${li.into} / ${li.need} XP · ${li.need-li.into} XP to next level`;
  $("xpBar").style.width=li.into/li.need*100+"%";
  $("streak").textContent=s+" 🔥";$("today").textContent=`${h.done}/${h.total}`;$("ovrMini").textContent=ovr();
  $("score").textContent=h.score+"%";$("scoreBar").style.width=h.score+"%";
  $("scoreMessage").textContent=h.score===100?"Perfect day.":h.score>=60?"Finish strong.":h.score?"Momentum is building.":"Start with one.";
  $("todayLabel").textContent=fmtDate(today(),{weekday:"short",month:"short",day:"numeric"}).toUpperCase();
  const name=state.name.trim(),hour=new Date().getHours();
  $("greeting").textContent=(hour<12?"GOOD MORNING":hour<18?"GOOD AFTERNOON":"GOOD EVENING")+(name?", "+name.toUpperCase():"");
  renderWeek();renderGoals();renderHomeChallenge();renderManager();
  const page=document.querySelector(".page.active")?.id;
  if(page==="program"){renderProgram();renderChallenges()}
  if(page==="progress")renderProgress();
  if(page==="lab")renderLab();
  if(page==="profile")renderProfile();
  save();
}
function renderWeek(){
  const start=weekStart(),t=today();
  $("weekStrip").innerHTML=Array.from({length:7},(_,i)=>{
    const k=addDays(start,i),h=state.history[k],cls=k===t?"today":k>t?"future":h?.completed?"done":h?.score>0?"partial":"";
    return `<div class="wk ${cls}"><span>${parse(k).toLocaleDateString(undefined,{weekday:"narrow"})}</span><i>${h?.completed?"✓":""}</i></div>`;
  }).join("");
}
function renderGoals(){
  const el=$("habitList");el.innerHTML="";
  if(!active().length){el.innerHTML='<div class="empty">No goals yet. Tap ＋ to add your first one.</div>';return}
  CATS.forEach(c=>catGoals(c).forEach(g=>{
    const done=isDone(g.id),r=document.createElement("button");
    r.type="button";r.className="task"+(done?" done":"");r.style.setProperty("--c",CATEGORIES[c].color);
    r.innerHTML=`${hex(CATEGORIES[c].color)}<span class="task-name"></span><span class="xp">+${g.xp}</span><span class="box">${done?"✓":""}</span>`;
    r.querySelector(".task-name").textContent=g.name;
    r.addEventListener("click",()=>toggle(g.id));el.append(r);
  }));
}
function renderHomeChallenge(){
  const d=dailyFor(today()),done=!!state.daily[today()],c=CATEGORIES[d.category];
  $("homeChallenge").style.setProperty("--c",c.color);
  $("homeChallenge").innerHTML=`<div class="section-head"><div><span class="label">DAILY CHALLENGE</span><h2>${esc(d.name)}</h2></div>${hex(c.color,"lg")}</div><p class="muted">${esc(d.task)}</p><button class="ghost wide" type="button">${done?"✓ Completed · +25 XP":"View challenge"}</button>`;
  $("homeChallenge").querySelector("button").addEventListener("click",()=>nav("program"));
}
function renderManager(){
  const el=$("categoryManager");el.innerHTML="";
  CATS.forEach(c=>{
    const gs=catGoals(c),box=document.createElement("div");box.className="manager-category";box.style.setProperty("--c",CATEGORIES[c].color);
    box.innerHTML=`<div class="category-title"><span>${hex(CATEGORIES[c].color)} <strong>${CATEGORIES[c].name}</strong></span><span class="count ${gs.length?"valid":""}">${gs.length} goal${gs.length===1?"":"s"}</span></div><small>${CATEGORIES[c].desc}</small>`;
    gs.forEach(g=>{
      const row=document.createElement("div");row.className="manage-row";
      row.innerHTML=`<div class="manage-goal"></div><span class="xp">+${g.xp} XP</span><button class="delete" type="button">Delete</button>`;
      row.querySelector(".manage-goal").textContent=g.name;
      row.querySelector(".delete").addEventListener("click",()=>removeGoal(g.id));box.append(row);
    });
    const add=document.createElement("button");add.type="button";add.className="setup-add";add.textContent="＋ Add to "+CATEGORIES[c].name;
    add.addEventListener("click",()=>openGoal(c));box.append(add);el.append(box);
  });
}

function renderProgram(){
  const el=$("programCard"),p=state.program,t=today();
  if(!p){
    el.innerHTML=`<span class="label">60-DAY PROGRAM</span><h2 class="prog-title">Become unrecognizable in 60 days</h2><div class="hex-ring">${CATS.map(c=>hex(CATEGORIES[c].color,"lg")).join("")}<b>60</b></div><p class="muted">Complete every one of your daily goals for 60 days. Each perfect day fills a slot. Miss a day and it stays empty, so keep going.</p><button id="startProgram" class="primary wide" type="button">Start my 60-day program</button>`;
    $("startProgram").addEventListener("click",()=>{state.program={start:t};progWeek=0;render();toast("Day 1. Let's go.")});
    return;
  }
  const day=daysBetween(p.start,t)+1,finished=day>60,dayN=Math.min(60,day),weeks=Math.ceil(60/7);
  if(progWeek===null)progWeek=Math.min(weeks-1,Math.floor((dayN-1)/7));
  const perfect=Array.from({length:Math.min(60,day)},(_,i)=>addDays(p.start,i)).filter(k=>state.history[k]?.completed).length;
  const days=[];for(let i=progWeek*7;i<Math.min(60,progWeek*7+7);i++){
    const k=addDays(p.start,i),h=state.history[k],st=k>t?"future":k===t?(h?.completed?"done today":"today"):h?.completed?"done":h?.score>0?"partial":"missed";
    days.push(`<div class="pday ${st}"><span>Day ${i+1}</span><small>${fmtDate(k,{weekday:"short",month:"short",day:"numeric"})}</small><b>${h?.completed?"✓":st==="future"?"":st==="today"?(h?.score||0)+"%":h?.score?h.score+"%":"✕"}</b></div>`);
  }
  el.innerHTML=`<div class="section-head"><div><span class="label">60-DAY PROGRAM</span><h2>${finished?"Program complete":"Your program is running"}</h2></div><span class="pill">${perfect}/60 perfect</span></div>
    <div class="hex-ring">${CATS.map(c=>hex(CATEGORIES[c].color,"lg")).join("")}<b>${finished?"✓":"Day "+dayN}</b></div>
    <div class="progress"><i style="width:${perfect/60*100}%"></i></div>
    <div class="week-tabs">${Array.from({length:weeks},(_,i)=>`<button type="button" class="chip${i===progWeek?" active":""}" data-w="${i}">Week ${i+1}</button>`).join("")}</div>
    <div class="label week-range">WEEK ${progWeek+1}: ${fmtDate(addDays(p.start,progWeek*7),{month:"short",day:"numeric"}).toUpperCase()} – ${fmtDate(addDays(p.start,Math.min(59,progWeek*7+6)),{month:"short",day:"numeric"}).toUpperCase()}</div>
    <div class="pdays">${days.join("")}</div>
    ${finished?'<button id="restartProgram" class="primary wide" type="button">Start a new 60 days</button>':'<button id="restartProgram" class="ghost wide" type="button">Restart program</button>'}`;
  el.querySelectorAll("[data-w]").forEach(b=>b.addEventListener("click",()=>{progWeek=Number(b.dataset.w);renderProgram()}));
  $("restartProgram").addEventListener("click",()=>{if(finished||confirm("Restart your 60-day program from Day 1?")){state.program={start:t};progWeek=0;render()}});
}
function renderChallenges(){
  const t=today(),d=dailyFor(t),c=CATEGORIES[d.category],done=!!state.daily[t];
  $("dailyDate").textContent=fmtDate(t,{weekday:"long",month:"short",day:"numeric"});
  $("dailyChallenge").innerHTML=`<div class="daily-card" style="--c:${c.color}"><span class="daily-tag">${hex(c.color)} ${c.name.toUpperCase()}</span><h3>${esc(d.name)}</h3><p>${esc(d.task)}</p><button id="dailyBtn" class="${done?"ghost":"primary"} wide" type="button">${done?"✓ Completed · Undo":"Mark complete · +25 XP"}</button></div>`;
  $("dailyBtn").addEventListener("click",()=>{if(state.daily[t]){delete state.daily[t];gainXP(-25,"Challenge unmarked.")}else{state.daily[t]=true;gainXP(25,"+25 XP · "+d.name)}render()});

  const wk=weekStart(t),w=weeklyFor(t),wdays=Array.from({length:7},(_,i)=>addDays(wk,i)).filter(k=>k<=t),cnt=Math.min(w.target,w.count(wdays)),claimed=!!state.weekly[wk];
  $("weeklyChallenge").innerHTML=`<h3 class="w-name">${esc(w.name)}</h3><p class="muted">${esc(w.desc)}</p><div class="progress"><i style="width:${cnt/w.target*100}%"></i></div><div class="w-foot"><span class="tiny">${cnt} / ${w.target}</span><span class="tiny">Resets Monday</span></div>${claimed?'<button class="ghost wide" type="button" disabled>✓ Reward claimed</button>':cnt>=w.target?'<button id="claimWeekly" class="primary wide" type="button">Claim +100 XP</button>':""}`;
  $("claimWeekly")?.addEventListener("click",()=>{state.weekly[wk]=true;gainXP(100,"+100 XP · "+w.name);render()});

  const list=$("challengeList");list.innerHTML="";
  if(!state.challenges.length){list.innerHTML='<div class="empty">Start a Winter Arc, a 30-day reset or any challenge of your own.</div>';return}
  state.challenges.forEach(ch=>{
    const col=CATEGORIES[ch.category].color,elapsed=daysBetween(ch.start,t),ended=elapsed>=ch.days,checked=ch.checkins.includes(t);
    const card=document.createElement("div");card.className="arc";card.style.setProperty("--c",col);
    card.innerHTML=`<div class="arc-head"><h3></h3><span class="countdown" data-end="${addDays(ch.start,ch.days)}"></span></div><p class="muted arc-task"></p>
      <div class="arc-stats"><div><b>${ch.checkins.length}</b><small>CHECK-INS</small></div><div><b>${Math.min(ch.days,elapsed+1)}/${ch.days}</b><small>DAY</small></div><div><b>+${ch.checkins.length*15}</b><small>XP EARNED</small></div></div>
      <div class="progress"><i style="width:${ch.checkins.length/ch.days*100}%"></i></div>
      <div class="arc-actions">${ended?'<span class="tiny">Finished</span>':`<button class="${checked?"ghost":"primary"} check-in" type="button">${checked?"✓ Checked in today":"Check in · +15 XP"}</button>`}<button class="delete" type="button">${ended?"Remove":"Quit"}</button></div>`;
    card.querySelector("h3").textContent=ch.name;card.querySelector(".arc-task").textContent=ch.task||CATEGORIES[ch.category].name;
    card.querySelector(".check-in")?.addEventListener("click",()=>{
      if(ch.checkins.includes(t)){ch.checkins=ch.checkins.filter(x=>x!==t);gainXP(-15,"Check-in removed.")}else{ch.checkins.push(t);gainXP(15,"+15 XP · "+ch.name)}render();
    });
    card.querySelector(".delete").addEventListener("click",()=>{if(ended||confirm(`Quit "${ch.name}"? Your XP is kept.`)){state.challenges=state.challenges.filter(x=>x.id!==ch.id);render()}});
    list.append(card);
  });
  tickCountdowns();
}
function tickCountdowns(){
  document.querySelectorAll(".countdown").forEach(e=>{
    const ms=new Date(e.dataset.end+"T00:00:00")-Date.now();
    if(ms<=0){e.textContent="ENDED";return}
    const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);
    e.textContent=`${pad(d)}D ${pad(h)}H ${pad(m)}M`;
  });
}

function renderProgress(){
  const li=levelInfo(),r=rankAt(li.level),scores=CATS.map(statScore);
  drawRadar(scores,ovr());
  // Tiles in pairs, same order as the reference layout.
  const order=["social","physical","intellect","discipline","mental","ambition"];
  $("categoryStats").innerHTML=order.map(c=>`<div class="cat-tile" style="--c:${CATEGORIES[c].color}">${hex(CATEGORIES[c].color,"xl")}<div><strong>${statScore(c)}</strong><small>${CATEGORIES[c].name}</small></div></div>`).join("");
  $("progressLevel").textContent="LVL "+li.level;
  const next=rankByIndex(r.idx+1),left=r.idx===RANK_COUNT-1?0:next.start-li.level;
  $("ladderHead").innerHTML=r.idx===RANK_COUNT-1?"You reached <b>Legend</b>":`<b>${left} more level${left===1?"":"s"}</b> until the next rank`;
  const from=Math.max(0,r.idx-2),to=Math.min(RANK_COUNT-1,r.idx+2),rows=[];
  for(let i=from;i<=to;i++){
    const x=rankByIndex(i),cur=i===r.idx,locked=i>r.idx;
    if(i>from)rows.push(`<div class="ladder-dots ${i<=r.idx?"lit":""}">${"<i></i>".repeat(LVLS_PER_RANK)}</div>`);
    const meta=cur?`<span class="cur-label">Current Rank</span>`:locked?"":`<span class="achieved">Achieved ${state.rankDates[i]?fmtDate(state.rankDates[i]):"earlier"}</span>`;
    const lv=locked?`UNLOCKS AT LVL ${x.start}`:x.end===Infinity?`LVL ${x.start}+`:`LVL ${x.start} – ${x.end}`;
    rows.push(`<div class="rung ${cur?"current":locked?"locked":"passed"}" style="--c:${x.color}">${badge(x,{size:cur?84:56,locked})}<div>${meta}<h3>${x.name}</h3><small>${lv}</small></div></div>`);
  }
  $("ladder").innerHTML=rows.join("");
  const hist=Object.values(state.history);
  $("totalXP").textContent=state.xp;$("bestStreak").textContent=state.bestStreak+" 🔥";
  $("daysDone").textContent=hist.filter(x=>x.completed).length;
  $("avgScore").textContent=(hist.length?Math.round(hist.reduce((a,x)=>a+(x.score||0),0)/hist.length):0)+"%";
}
function drawRadar(values,overall){
  const canvas=$("radar"),ctx=canvas.getContext("2d"),dpr=window.devicePixelRatio||1,size=320;
  canvas.width=size*dpr;canvas.height=size*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size);
  const cx=160,cy=160,r=100,n=6,pt=(i,f)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+Math.cos(a)*r*f,cy+Math.sin(a)*r*f]};
  const poly=f=>{ctx.beginPath();for(let i=0;i<n;i++){const[x,y]=pt(i,typeof f==="function"?f(i):f);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()};
  ctx.lineWidth=1;ctx.strokeStyle="rgba(255,255,255,.14)";
  [1,.66,.33].forEach(f=>{poly(f);ctx.stroke()});
  poly(i=>Math.max(.06,values[i]/100));
  ctx.fillStyle="rgba(190,190,200,.42)";ctx.fill();
  ctx.save();ctx.shadowColor="rgba(255,255,255,.85)";ctx.shadowBlur=16;ctx.lineWidth=2.5;ctx.strokeStyle="#fff";ctx.stroke();ctx.restore();
  ctx.textAlign="center";ctx.font="600 12px system-ui";
  CATS.forEach((c,i)=>{const[x,y]=pt(i,1.24);ctx.fillStyle=CATEGORIES[c].color;ctx.fillText(CATEGORIES[c].name,x,y+4)});
  ctx.save();ctx.shadowColor="rgba(0,0,0,.6)";ctx.shadowBlur=10;ctx.fillStyle="#fff";ctx.font="800 54px system-ui";ctx.fillText(String(overall),cx,cy+14);ctx.restore();
  ctx.fillStyle="rgba(255,255,255,.8)";ctx.font="600 10px ui-monospace,Menlo,monospace";ctx.fillText("OVR RATING",cx,cy+32);
}

/* ---------- lab ---------- */
let timerLen=1500,timerEnd=null,timerLeft=1500,timerId=null;
function renderLab(){
  document.querySelectorAll(".seg").forEach(b=>b.classList.toggle("active",b.dataset.lab===labTab));
  document.querySelectorAll(".lab-tab").forEach(x=>x.classList.toggle("active",x.id===labTab));
  const f=state.focus[today()]||0;$("focusCount").textContent=f?`${f} session${f===1?"":"s"} finished today`:"";
  renderJournal();renderMetrics();renderTodos();
}
function updateTimer(){const s=Math.max(0,Math.round(timerLeft));$("timer").textContent=pad(Math.floor(s/60))+":"+pad(s%60)}
function stopTimer(){clearInterval(timerId);timerId=null;timerEnd=null}
function renderJournal(){
  const j=state.journal[today()];
  if(mood===null)mood=j?.mood??null;
  if(document.activeElement!==$("journalText"))$("journalText").value=j?.text||"";
  $("moodPicker").innerHTML=MOODS.map((m,i)=>`<button type="button" class="mood${mood===i+1?" active":""}" data-mood="${i+1}" aria-label="Mood ${i+1} of 5">${m}</button>`).join("");
  $("moodPicker").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{mood=Number(b.dataset.mood);renderJournal()}));
  const past=Object.keys(state.journal).filter(k=>k!==today()&&state.journal[k]?.text).sort().reverse().slice(0,14);
  $("journalHistory").innerHTML=past.length?past.map(k=>{const e=state.journal[k];return`<details class="entry"><summary><span>${e.mood?MOODS[e.mood-1]:"📝"}</span><b>${fmtDate(k,{weekday:"short",month:"short",day:"numeric"})}</b><small>${esc(e.text.slice(0,60))}${e.text.length>60?"…":""}</small></summary><p>${esc(e.text)}</p></details>`}).join(""):'<div class="empty">Past reflections will show up here.</div>';
}
function renderMetrics(){
  const t=today(),m=state.metrics[t]||{},week=Array.from({length:7},(_,i)=>addDays(t,i-6));
  $("metrics").innerHTML=METRICS.map(x=>{
    const vals=week.map(k=>Number(state.metrics[k]?.[x.key])||0),max=Math.max(...vals,1);
    return`<div class="metric"><div class="metric-head"><span>${x.icon} <b>${x.label}</b></span><small>${x.unit}</small></div>
      <div class="stepper"><button type="button" data-k="${x.key}" data-d="-1">−</button><input type="number" inputmode="decimal" min="0" step="${x.step}" data-k="${x.key}" value="${m[x.key]??""}" placeholder="0"><button type="button" data-k="${x.key}" data-d="1">＋</button></div>
      <div class="spark">${vals.map((v,i)=>`<i style="height:${Math.max(4,v/max*100)}%" class="${i===6?"now":""}" title="${v}"></i>`).join("")}</div></div>`;
  }).join("");
  const setM=(k,v)=>{(state.metrics[t]||(state.metrics[t]={}))[k]=Math.max(0,Math.round(v*10)/10);save()};
  $("metrics").querySelectorAll("button[data-d]").forEach(b=>b.addEventListener("click",()=>{const x=METRICS.find(y=>y.key===b.dataset.k);setM(x.key,(Number(state.metrics[t]?.[x.key])||0)+x.step*Number(b.dataset.d));renderMetrics()}));
  $("metrics").querySelectorAll("input").forEach(i=>i.addEventListener("change",()=>{setM(i.dataset.k,Number(i.value)||0);renderMetrics()}));
}
function renderTodos(){
  const el=$("todoList");
  if(!state.todos.length){el.innerHTML='<div class="empty">Dump everything on your mind. No XP, no pressure.</div>';return}
  el.innerHTML="";
  state.todos.forEach(td=>{
    const row=document.createElement("div");row.className="todo"+(td.done?" done":"");
    row.innerHTML='<button class="todo-check" type="button"></button><span></span><button class="delete" type="button">✕</button>';
    row.querySelector("span").textContent=td.text;row.querySelector(".todo-check").textContent=td.done?"✓":"";
    row.querySelector(".todo-check").addEventListener("click",()=>{td.done=!td.done;save();renderTodos()});
    row.querySelector(".delete").addEventListener("click",()=>{state.todos=state.todos.filter(x=>x.id!==td.id);save();renderTodos()});
    el.append(row);
  });
}

/* ---------- profile ---------- */
function achievements(){
  const perfect=Object.values(state.history).filter(x=>x.completed).length,focus=Object.values(state.focus).reduce((a,b)=>a+b,0);
  const journal=Object.values(state.journal).filter(x=>x?.text).length,daily=Object.keys(state.daily).length;
  const prog=state.program?Array.from({length:Math.min(60,daysBetween(state.program.start,today())+1)},(_,i)=>addDays(state.program.start,i)).filter(k=>state.history[k]?.completed).length:0;
  return[
    ["Iron Will","🔥","Longest streak",state.bestStreak,[3,14,30]],
    ["Grinder","⚒️","Goals completed",totalDone(),[25,100,500]],
    ["Perfectionist","💎","Perfect days",perfect,[1,10,30]],
    ["Early Bird","🌅","Daily challenges",daily,[3,15,50]],
    ["Deep Work","◷","Focus sessions",focus,[5,25,100]],
    ["The Reflector","✎","Journal entries",journal,[3,15,50]],
    ["The Athlete","💪","Physical goals",catLifetime("physical"),[10,50,150]],
    ["The Connector","🤝","Social goals",catLifetime("social"),[10,50,150]],
    ["The Scholar","📚","Intellect goals",catLifetime("intellect"),[10,50,150]],
    ["Sixty Strong","⬡","60-day program days",prog,[10,30,60]]
  ].map(([name,icon,what,val,steps])=>{const tier=steps.filter(s=>val>=s).length;return{name,icon,what,val,steps,tier,next:steps[tier]}});
}
function renderProfile(){
  const li=levelInfo(),r=rankAt(li.level);
  $("profileBadge").innerHTML=badge(r,{size:110});
  if(document.activeElement!==$("nameInput"))$("nameInput").value=state.name;
  $("profileRank").textContent=`${r.name} · Level ${li.level} · ${state.xp} XP`;
  const row=[];for(let i=Math.max(0,r.idx-2);i<=Math.min(RANK_COUNT-1,r.idx+2);i++){const x=rankByIndex(i);row.push(`<div class="rr ${i===r.idx?"current":""}">${badge(x,{size:i===r.idx?54:40,locked:i>r.idx})}<small>${x.name}</small></div>`)}
  $("rankRow").innerHTML=row.join("");
  const tierColors=["#3b3b45","#c98b5a","#cfd4de","#f0c75e"],a=achievements();
  $("achCount").textContent=`${a.reduce((n,x)=>n+x.tier,0)} / ${a.length*3}`;
  $("achievements").innerHTML=a.map(x=>`<div class="ach ${x.tier?"":"locked"}" style="--c:${tierColors[x.tier]}"><div class="ach-badge"><span>${x.icon}</span></div><strong>${esc(x.name)} ${x.tier?ROMAN[x.tier-1]:""}</strong><small>${x.next?`${Math.min(x.val,x.next)} / ${x.next} ${x.what.toLowerCase()}`:"Maxed out"}</small></div>`).join("");
}

/* ---------- actions ---------- */
function toggle(id){
  const g=goalById(id),k=today();if(!g)return;
  const arr=state.log[k]||(state.log[k]=[]),was=state.history[k]?.completed;
  if(arr.includes(id)){state.log[k]=arr.filter(x=>x!==id);gainXP(-g.xp,"Goal unchecked.")}
  else{arr.push(id);gainXP(g.xp,"+"+g.xp+" XP · "+CATEGORIES[g.category].name)}
  syncToday();
  if(!was&&state.history[k]?.completed)toast(`Perfect day. Streak ${streak()} 🔥`);
  render();
}
function removeGoal(id){
  const g=goalById(id);if(!g)return;
  if(isDone(id)){state.log[today()]=doneOn(today()).filter(x=>x!==id);state.xp=Math.max(0,state.xp-g.xp)}
  g.archived=true;render();toast("Goal removed.");
}
// Guess difficulty from the wording: time, amounts, early wake-ups, limits and tell-tale phrases. 1 easy, 2 medium, 3 hard.
const HARD_RE=/\b(no (social media|sugar|junk|phone|youtube|tiktok|reels|shorts|complaining|caffeine|alcohol)\b|whole day|all day|entire day|cold (shower|plunge|water)|fasting|marathon|inbox to zero|interview|apply|publish|pitch|scares|spend 0|finish one chapter|90 days)/;
const EASY_RE=/\b(text|call|message|voice note|thank|compliment|smile|make my bed|drink|stretch|grateful|gratitude|breath|breathing|note|hug|set out|name one|notice|listen to music|nap|say yes)\b/;
const MEDIUM_RE=/(work ?out|\brun\b|study|practi[sc]e|revis|research|build|cook|plan|meditat|journal|read|learn|write|clean|organi[sz]e|declutter|walk|swim|bike|yoga|volunteer|project|apologi|someone new|meetup|event|track|review|teach|save)/;
function estimateDifficulty(text){
  const t=" "+text.toLowerCase().replace(/(\d),(\d)/g,"$1$2")+" ",n=parseFloat;let lvl=0,rest=t;
  const bump=x=>{lvl=Math.max(lvl,x)};
  const lim=t.match(/(?:less than|under|max(?:imum)?|at most|no more than)\s+(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?)\b/);
  if(lim){const h=/^h/.test(lim[2])?n(lim[1]):n(lim[1])/60;bump(h<=1?3:h<=2?2:1);rest=t.replace(lim[0]," ")}
  let mins=0;
  for(const m of rest.matchAll(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/g))mins+=n(m[1])*60;
  for(const m of rest.matchAll(/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)\b/g))mins+=n(m[1]);
  if(/\b(an|one) hour\b/.test(rest))mins+=60;if(/half an hour/.test(rest))mins+=30;
  // Sleep hours are rest, not effort.
  if(mins&&!/\bsleep\b/.test(rest))bump(mins>=90?3:mins>=30?2:1);
  const amt=(re,med,hard,scale=1)=>{const m=rest.match(re);if(m){const v=n(m[1])*(m[2]?scale:1);bump(v>=hard?3:v>=med?2:1)}};
  amt(/(\d+)\s*pages?/,15,40);
  amt(/(\d+)\s*(?:push-?ups?|squats?|sit-?ups?|burpees?|pull-?ups?|lunges?|reps?|crunches)/,40,100);
  amt(/(\d+(?:\.\d+)?)\s*(k)?\s*steps/,8000,15000,1000);
  amt(/(\d+(?:\.\d+)?)\s*(?:km|kilomet)/,2,5);
  amt(/(\d+(?:\.\d+)?)\s*(miles?)/,2,5,1.6);
  amt(/(\d+(?:\.\d+)?)\s*(?:litres?|liters?|l)\b/,2,4);
  amt(/(\d+)\s*words/,300,1000);
  const wake=rest.match(/(?:wake|wake up|up|out of bed|rise)\D{0,15}?(?:at|before|by)\s*(\d{1,2})(?::(\d\d))?/);
  if(wake){const h=n(wake[1])+(wake[2]?n(wake[2])/60:0);bump(h<6?3:h<7.5?2:1)}
  if(HARD_RE.test(t))bump(3);
  if(lvl)return lvl;
  return EASY_RE.test(t)?1:MEDIUM_RE.test(t)?2:2;
}
const DIFF=["","Easy","Medium","Hard"],xpForDiff=d=>d*10;
function autoDifficulty(){
  const v=$("goalInput").value.trim();
  const d=v?estimateDifficulty(v):0;
  $("goalDiff").className="diff-display"+(d?" d"+d:"");
  $("goalDiff").textContent=d?`${DIFF[d]} · +${xpForDiff(d)} XP`:"Set automatically from your goal";
}
function openGoal(category){
  $("goalModal").classList.remove("hidden");
  $("goalCategory").innerHTML=CATS.map(c=>`<option value="${c}">${CATEGORIES[c].icon} ${CATEGORIES[c].name}</option>`).join("");
  if(category)$("goalCategory").value=category;
  $("goalInput").value="";autoDifficulty();$("ideaList").classList.add("hidden");$("goalInput").focus();
}
function closeGoal(){$("goalModal").classList.add("hidden")}
function addGoal(){
  const name=$("goalInput").value.trim(),category=$("goalCategory").value;
  if(!name){toast("Enter a goal first.");return}
  state.goals.push({id:uid(),name,category,xp:xpForDiff(estimateDifficulty(name))});
  closeGoal();render();toast("Goal added to "+CATEGORIES[category].name+".");
}
// Show a few ideas at a time, skipping ones already set as goals; refresh cycles through the rest of the list.
let ideaSeen=new Set();
function showIdeas(fresh=false){
  const c=$("goalCategory").value,el=$("ideaList"),have=new Set(active().map(g=>g.name.toLowerCase()));
  if(fresh)ideaSeen=new Set();
  let pool=CATEGORIES[c].ideas.filter(x=>!have.has(x.toLowerCase())&&!ideaSeen.has(x));
  if(pool.length<4){ideaSeen=new Set(el.querySelectorAll("[data-idea]").length?[...el.querySelectorAll("[data-idea]")].map(b=>b.dataset.idea):[]);pool=CATEGORIES[c].ideas.filter(x=>!have.has(x.toLowerCase())&&!ideaSeen.has(x))}
  const pick=pool.sort(()=>Math.random()-.5).slice(0,4);pick.forEach(x=>ideaSeen.add(x));
  el.innerHTML=`<div class="idea-head"><span class="label">IDEAS FOR ${CATEGORIES[c].name.toUpperCase()}</span><button type="button" class="idea-refresh">↻ New ideas</button></div>`+(pick.length?pick.map(x=>{const d=estimateDifficulty(x);return`<button type="button" data-idea="${esc(x)}">${esc(x)}<span class="idea-diff d${d}">${DIFF[d]} +${xpForDiff(d)}</span></button>`}).join(""):'<div class="empty">You already have every idea for this area. Write your own!</div>');
  el.classList.remove("hidden");
  el.querySelector(".idea-refresh").addEventListener("click",()=>showIdeas());
  el.querySelectorAll("[data-idea]").forEach(b=>b.addEventListener("click",()=>{$("goalInput").value=b.dataset.idea;autoDifficulty();el.classList.add("hidden")}));
}
function toast(s){const e=$("toast");e.textContent=s;clearTimeout(toast.t);toast.t=setTimeout(()=>e.textContent="",2200)}
function nav(page){
  document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===page));
  document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
  if(page==="program")renderProgram(),renderChallenges();
  if(page==="progress")renderProgress();
  if(page==="lab")renderLab();
  if(page==="profile")renderProfile();
  window.scrollTo({top:0,behavior:"instant"});
}

/* ---------- wiring ---------- */
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.back)));
$("topProfile").addEventListener("click",()=>nav("profile"));
$("editGoals").addEventListener("click",()=>nav("goals"));
$("manageGoals").addEventListener("click",()=>nav("goals"));
$("addGoalBtn").addEventListener("click",()=>openGoal());$("addGoalBtn2").addEventListener("click",()=>openGoal());
$("closeGoal").addEventListener("click",closeGoal);$("saveGoal").addEventListener("click",addGoal);
$("goalInput").addEventListener("keydown",e=>{if(e.key==="Enter")addGoal()});
$("goalInput").addEventListener("input",autoDifficulty);
$("ideasBtn").addEventListener("click",()=>showIdeas(true));$("goalCategory").addEventListener("change",()=>{if(!$("ideaList").classList.contains("hidden"))showIdeas(true)});

$("newChallenge").addEventListener("click",()=>{
  $("chCategory").innerHTML=CATS.map(c=>`<option value="${c}">${CATEGORIES[c].icon} ${CATEGORIES[c].name}</option>`).join("");
  $("chName").value="";$("chTask").value="";$("challengeModal").classList.remove("hidden");$("chName").focus();
});
$("closeChallenge").addEventListener("click",()=>$("challengeModal").classList.add("hidden"));
$("saveChallenge").addEventListener("click",()=>{
  const name=$("chName").value.trim();if(!name){toast("Give your challenge a name.");return}
  state.challenges.push({id:uid(),name,task:$("chTask").value.trim(),category:$("chCategory").value,days:Number($("chDays").value),start:today(),checkins:[]});
  $("challengeModal").classList.add("hidden");render();toast(name+" started.");
});

document.querySelectorAll(".seg").forEach(b=>b.addEventListener("click",()=>{labTab=b.dataset.lab;renderLab()}));
document.querySelectorAll(".chip[data-min]").forEach(b=>b.addEventListener("click",()=>{
  if(timerId)return toast("Reset the timer to change length.");
  document.querySelectorAll(".chip[data-min]").forEach(x=>x.classList.toggle("active",x===b));
  timerLen=Number(b.dataset.min)*60;timerLeft=timerLen;updateTimer();$("startTimer").textContent="Start";
}));
$("startTimer").addEventListener("click",()=>{
  if(timerId){timerLeft=(timerEnd-Date.now())/1000;stopTimer();$("startTimer").textContent="Resume";return}
  timerEnd=Date.now()+timerLeft*1000;$("startTimer").textContent="Pause";
  timerId=setInterval(()=>{
    timerLeft=(timerEnd-Date.now())/1000;updateTimer();
    if(timerLeft<=0){stopTimer();timerLeft=timerLen;const k=today();state.focus[k]=(state.focus[k]||0)+1;gainXP(10,"Focus session complete · +10 XP");$("startTimer").textContent="Start";updateTimer();render()}
  },250);
});
$("resetTimer").addEventListener("click",()=>{stopTimer();timerLeft=timerLen;updateTimer();$("startTimer").textContent="Start"});

$("saveJournal").addEventListener("click",()=>{
  const text=$("journalText").value.trim();
  if(!text&&!mood){toast("Write something first.");return}
  state.journal[today()]={text,mood};save();renderJournal();
  $("journalSaved").textContent="Saved.";setTimeout(()=>$("journalSaved").textContent="",1600);
});
$("todoForm").addEventListener("submit",e=>{e.preventDefault();const v=$("todoInput").value.trim();if(!v)return;state.todos.unshift({id:uid(),text:v,done:false});$("todoInput").value="";save();renderTodos()});
$("clearTodos").addEventListener("click",()=>{state.todos=state.todos.filter(x=>!x.done);save();renderTodos()});

$("nameInput").addEventListener("change",()=>{state.name=$("nameInput").value.trim();render()});
$("exportBtn").addEventListener("click",()=>{
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));
  a.download=`lifestyle-backup-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
$("resetBtn").addEventListener("click",()=>{if(confirm("Reset all LIFESTYLE progress, goals and journal entries?")){state=fresh();progWeek=null;mood=null;render();nav("home");toast("System reset.")}});

// Roll over at midnight while the app is open, and keep countdowns live.
let lastDay=today();
setInterval(()=>{if(today()!==lastDay){lastDay=today();mood=null;progWeek=null;render()}tickCountdowns()},30000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&today()!==lastDay){lastDay=today();render()}});
window.addEventListener("resize",()=>{if($("progress").classList.contains("active"))renderProgress()});

updateTimer();render();
// Check for a new version on every launch and resume; reload once it takes over, but never while someone is typing.
if("serviceWorker"in navigator){
  const hadController=!!navigator.serviceWorker.controller;let pendingReload=false,reloaded=false;
  const reload=()=>{if(reloaded)return;if(document.activeElement?.matches("input,textarea")){pendingReload=true;return}reloaded=true;location.reload()};
  navigator.serviceWorker.addEventListener("controllerchange",()=>{if(hadController)reload()});
  navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(reg=>{
    reg.update().catch(()=>{});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)return;if(pendingReload)reload();else reg.update().catch(()=>{})});
  }).catch(()=>{});
}
})();
