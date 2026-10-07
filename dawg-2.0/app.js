(()=>{"use strict";
const KEY="dawg_v2_state", DEFAULT=[
{id:"workout",name:"Workout",xp:20},{id:"study",name:"Study for 2 hours",xp:20},
{id:"read",name:"Read 20 minutes",xp:10},{id:"goals",name:"Work on my goals",xp:20},
{id:"scroll",name:"No unnecessary scrolling",xp:10}];
const $=id=>document.getElementById(id), today=()=>new Date().toISOString().slice(0,10);
function fresh(){return{habits:DEFAULT.map(h=>({...h,done:false})),xp:0,streak:0,bestStreak:0,lastCompletedDay:null,history:{},journal:{}}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));return x&&Array.isArray(x.habits)?{...fresh(),...x}:fresh()}catch(e){return fresh()}}
let state=load(), timer=1500, timerId=null;
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function offset(n){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function rank(l){return l<3?"Rookie":l<6?"Disciplined":l<10?"Relentless":l<15?"Elite":"DAWG"}
function render(){
 const done=state.habits.filter(h=>h.done).length,total=state.habits.length,score=total?Math.round(done/total*100):0,l=Math.floor(state.xp/100)+1,into=state.xp%100;
 $("level").textContent=l;$("rank").textContent=rank(l);$("xpText").textContent=`${into} / 100 XP`;$("xpBar").style.width=into+"%";
 $("streak").textContent=state.streak+" 🔥";$("today").textContent=`${done}/${total}`;$("score").textContent=score+"%";$("scoreMini").textContent=score+"%";$("scoreBar").style.width=score+"%";
 $("scoreMessage").textContent=score===100?"Perfect day.":score>=60?"Finish strong.":score?"Momentum is building.":"Start with one.";
 const list=$("habitList");list.innerHTML="";
 if(!total)list.innerHTML='<div class="muted intro">No habits yet. Add your first one below.</div>';
 state.habits.forEach(h=>{const r=document.createElement("div");r.className="habit";const b=document.createElement("button");b.type="button";b.className="check"+(h.done?" done":"");b.textContent=h.done?"✓":"";b.addEventListener("click",()=>toggle(h.id));
 const i=document.createElement("div");i.className="habit-info";i.innerHTML='<div class="habit-name"></div><div class="habit-meta"></div>';i.querySelector(".habit-name").textContent=h.name;i.querySelector(".habit-meta").textContent=h.done?"Completed today":"Daily habit";
 const x=document.createElement("span");x.className="xp";x.textContent="+"+h.xp+" XP";r.append(b,i,x);list.append(r)});
 renderManage();renderProgress();renderHistory();
}
function renderManage(){const el=$("manageHabits");el.innerHTML="";state.habits.forEach(h=>{const r=document.createElement("div");r.className="manage-row";const d=document.createElement("div");d.innerHTML='<div class="habit-name"></div><div class="habit-meta"></div>';d.querySelector(".habit-name").textContent=h.name;d.querySelector(".habit-meta").textContent="+"+h.xp+" XP";
const b=document.createElement("button");b.type="button";b.className="delete";b.textContent="Delete";b.addEventListener("click",()=>{state.habits=state.habits.filter(x=>x.id!==h.id);save();render();toast("Habit deleted.")});r.append(d,b);el.append(r)})}
function renderHistory(){const el=$("history");el.innerHTML="";for(let i=-6;i<=0;i++){const k=offset(i),item=state.history[k],d=new Date(k+"T12:00:00"),r=document.createElement("div");r.className="day";r.innerHTML=`<div class="day-name">${d.toLocaleDateString(undefined,{weekday:"short"})}</div>`;const b=document.createElement("div");b.className="day-box";if(item?.score===100){b.classList.add("done");b.textContent="✓"}else if(item?.score>0){b.classList.add("partial");b.textContent=item.score+"%"}else b.textContent="—";r.append(b);el.append(r)}}
function renderProgress(){const vals=Object.values(state.history),days=vals.filter(x=>x.completed).length,avg=vals.length?Math.round(vals.reduce((a,x)=>a+x.score,0)/vals.length):0;$("totalXP").textContent=state.xp;$("bestStreak").textContent=state.bestStreak+" 🔥";$("daysDone").textContent=days;$("avgScore").textContent=avg+"%";
const a=[["🔥","First Step","Complete your first day",days>=1],["⚡","7 Day Warrior","Reach a 7 day streak",state.bestStreak>=7],["🏆","Level 5","Reach level 5",Math.floor(state.xp/100)+1>=5],["💪","Consistent","Complete 10 days",days>=10]];$("achievements").innerHTML=a.map(x=>`<div class="achievement ${x[3]?"":"locked"}"><div class="icon">${x[0]}</div><div><strong>${x[1]}</strong><small>${x[2]}</small></div></div>`).join("")}
function toggle(id){const h=state.habits.find(x=>x.id===id);if(!h)return;if(h.done){h.done=false;state.xp=Math.max(0,state.xp-h.xp);toast("Habit unchecked.")}else{h.done=true;state.xp+=h.xp;toast("+"+h.xp+" XP")}save();render()}
function add(name){const n=name.trim();if(!n){toast("Enter a habit first.");return}if(state.habits.length>=12){toast("Maximum 12 habits.");return}state.habits.push({id:"custom-"+Date.now(),name:n,xp:10,done:false});save();render();$("habitInput").value="";toast("Habit added.")}
function complete(){const total=state.habits.length,done=state.habits.filter(h=>h.done).length;if(!total){toast("Add a habit first.");return}if(done<total){toast("Finish every habit first.");return}const k=today();if(state.history[k]?.completed){toast("Today is already completed.");return}state.streak=state.lastCompletedDay===offset(-1)?state.streak+1:1;state.bestStreak=Math.max(state.bestStreak,state.streak);state.lastCompletedDay=k;state.history[k]={completed:true,score:100};save();render();toast("Day completed. Streak +1 🔥")}
function toast(s){const e=$("toast");e.textContent=s;clearTimeout(toast.t);toast.t=setTimeout(()=>e.textContent="",1800)}
function nav(page){document.querySelectorAll(".page").forEach(x=>x.classList.toggle("active",x.id===page));document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page))}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.page)));
$("habitForm").addEventListener("submit",e=>{e.preventDefault();add($("habitInput").value)});
$("completeDay").addEventListener("click",complete);
$("resetBtn").addEventListener("click",()=>{if(confirm("Reset all DAWG progress?")){state=fresh();save();render();toast("Progress reset.")}});
$("saveJournal").addEventListener("click",()=>{state.journal[today()]=$("journalText").value;save();$("journalSaved").textContent="Saved.";setTimeout(()=>$("journalSaved").textContent="",1600)});
function loadJournal(){$("journalText").value=state.journal[today()]||""}
$("startTimer").addEventListener("click",()=>{if(timerId)return;$("startTimer").textContent="Pause";timerId=setInterval(()=>{timer--;updateTimer();if(timer<=0){clearInterval(timerId);timerId=null;toast("Focus session complete.");$("startTimer").textContent="Start";}},1000)});
$("resetTimer").addEventListener("click",()=>{clearInterval(timerId);timerId=null;timer=1500;updateTimer();$("startTimer").textContent="Start"});
function updateTimer(){const m=Math.floor(timer/60),s=timer%60;$("timer").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")}
const hour=new Date().getHours();$("greeting").textContent=hour<12?"GOOD MORNING":hour<18?"GOOD AFTERNOON":"GOOD EVENING";updateTimer();loadJournal();render();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
})();