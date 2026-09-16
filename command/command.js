const milestones=[
 ['2026-09-17T08:00:00','8:00 AM','Venue open. Tracy window 8-10'],
 ['2026-09-17T10:00:00','10:00 AM','Setup Lead + 3 dressers arrive. Tracy on site.'],
 ['2026-09-17T14:00:00','2:00 PM','Band load-in — you tell us'],
 ['2026-09-17T15:00:00','3:00 PM','All volunteers and leads on site'],
 ['2026-09-17T16:30:00','4:30 PM','SOUND CHECK'],
 ['2026-09-17T17:00:00','5:00 PM','Dinner doors — concert-only stay in cars'],
 ['2026-09-17T17:30:00','5:30 PM','Buffet opens'],
 ['2026-09-17T17:45:00','5:45 PM','David starts'],
 ['2026-09-17T18:15:00','6:15 PM','Acoustic wraps / transition'],
 ['2026-09-17T18:30:00','6:30 PM','Concert doors — concert-only come in'],
 ['2026-09-17T18:45:00','6:45 PM','Hard checkpoint'],
 ['2026-09-17T19:00:00','7:00 PM','Concert starts'],
 ['2026-09-17T20:45:00','8:45 PM','Show may end / strike begins'],
 ['2026-09-17T21:15:00','9:15 PM','Load-out well underway'],
 ['2026-09-17T21:45:00','9:45 PM','Final cleanup / walkthrough'],
 ['2026-09-17T22:00:00','10:00 PM','Building cleared / secured']
];
const areas=[
 ['Venue','Confirm access, room layout, exits and public flow.','Setup'],
 ['Food / BBQ','Ben food and service supply list confirmed.','Ben / BBQ'],
 ['Setup','8 tables to dress. ~90 min. Then 3 dressers become floaters + campaign.','Setup'],
 ['Volunteers','16 volunteers: 10 night + 3 arrival + 3 muscle. Ben leads the line. He does not plate. Water is separate.','Volunteers'],
 ['Tickets','Ticket station, payment procedure and reconciliation.','Tickets & Money'],
 ['Campaign','30 min merch set. Pull-ups, push cards, buttons, candy, foldovers.','Campaign & Merch'],
 ['Food & Drinks','8 gal unsweet tea, 6 gal lemonade, 120 bottles water, 12 bags ice. One ice chest + scoop for tea and lemonade.','Food & Drinks'],
 ['Production','Tracy arrives 8-10 with a complete lights and sound system. Band loads in at 2:00.','Sound & Show'],
 ['Breakdown','Same 7 people. Venue furniture stays. 45–60 min.','Breakdown']
];
const state=JSON.parse(localStorage.getItem('ggs-command-v1')||'{}');
const prepState=(window.GGSPrepStore?window.GGSPrepStore.readCache():JSON.parse(localStorage.getItem('ggs-prep-2026-09-17-v2')||'{}'));
function pctForPrefix(prefix){const rows=Object.entries(prepState).filter(([k])=>k.startsWith(prefix+':'));if(!rows.length)return 0;return Math.round(rows.filter(([,v])=>v.done).length/rows.length*100)}
function renderStatus(){const el=document.getElementById('statusGrid');if(!el) return;el.innerHTML=areas.map(([name,desc,tab])=>{const p=pctForPrefix(tab==='Tickets & Money'?'tickets':tab==='Campaign & Merch'?'campaign':tab==='Sound & Show'?'production':tab==='Food & Drinks'?'food':tab==='Ben / BBQ'?'ben':tab.toLowerCase());const cls=p>=80?'is-ready':p<40?'is-alert':'';return `<article class="status-card ${cls}"><h3>${name}</h3><p class="muted">${desc}</p><div class="status-line"><span>${p}% complete</span><strong>${p>=80?'READY':p?'IN PROGRESS':'NEEDS OWNER'}</strong></div><div class="status-bar"><div style="width:${p}%"></div></div></article>`}).join('')}
function tabToId(tab){return {'Ben / BBQ':'ben','Setup':'setup','Volunteers':'volunteers','Tickets & Money':'tickets','Campaign & Merch':'campaign','Food & Drinks':'food','Sound & Show':'production','Breakdown':'breakdown'}[tab]||tab.toLowerCase()}
function renderTimeline(){
  const el=document.getElementById('timeline');
  if(!el) return;
  const now=new Date();
  el.innerHTML=milestones.map(function(m){
    const t=new Date(m[0]);
    const diff=t-now;
    const cls=diff<0?'past':(diff<3600000&&diff>=0?'current':'');
    const stateLabel=diff<0?'passed':cls?'next':'upcoming';
    return '<div class="timeline-row '+cls+'"><div class="time">'+m[1]+'</div><div><strong>'+m[2]+'</strong><small>'+timeDistance(diff)+'</small></div><div class="state">'+stateLabel+'</div></div>';
  }).join('');
}
function timeDistance(ms){if(ms<0){const n=Math.abs(ms);if(n<60000)return 'just passed';if(n<3600000)return `${Math.floor(n/60000)} min ago`;return `${Math.floor(n/3600000)} hr ago`}if(ms<60000)return 'in less than a minute';if(ms<3600000)return `in ${Math.floor(ms/60000)} min`;return `in ${Math.floor(ms/3600000)} hr ${Math.floor((ms%3600000)/60000)} min`}
function paintNext(){
  if(!window.GGSNextAction) return;
  const roster=(window.GGSPrepStore&&window.GGSPrepStore.readDoc('volunteers'))||{strike:[]};
  window.GGSNextAction.paint(prepState,roster);
}
function houseNow(){
  const now=new Date();
  const y=now.getFullYear();
  const m=String(now.getMonth()+1).padStart(2,'0');
  const d=String(now.getDate()).padStart(2,'0');
  if(y+'-'+m+'-'+d==='2026-09-17') return now;
  const mapped=new Date('2026-09-17T00:00:00');
  mapped.setHours(now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds());
  return mapped;
}
function houseAt(t){
  const p=String(t||'').split(':');
  const d=houseNow();
  d.setSeconds(0,0);
  d.setHours(Number(p[0])||0,Number(p[1])||0,0,0);
  return d;
}
function houseLive(list){
  const now=houseNow();
  let current=list[0];
  let next=list[1]||null;
  list.forEach(function(row,i){
    if(now>=houseAt(row.t)){
      current=row;
      next=list[i+1]||null;
    }
  });
  return {now:now,current:current,next:next};
}
function houseUpcoming(list,lane){
  const now=houseNow();
  return list.find(function(row){return row.lane===lane&&now<houseAt(row.t);})||null;
}
function houseRowHtml(show,row,here){
  const cls=[
    here.now>=houseAt(row.t)&&row.t!==here.current.t?'is-past':'',
    here.current&&row.t===here.current.t?'is-now':'',
    here.next&&row.t===here.next.t?'is-next':''
  ].filter(Boolean).join(' ');
  return '<li class="'+cls+'"><b>'+show.hm(row.t)+'</b><div><small>'+row.who+'</small><span>'+row.text+'</span></div></li>';
}
function hm(t){
  const p=String(t||'').split(':');
  const h=Number(p[0]);
  const m=p[1]||'00';
  if(!Number.isFinite(h)) return t;
  return (h%12||12)+':'+m+' '+(h>=12?'PM':'AM');
}
function rowText(row){
  return ((row&&row.querySelector('span'))||{}).textContent||'';
}
function paintSeat(){
  const kicker=document.getElementById('seatKicker');
  const title=document.getElementById('seatTitle');
  const who=document.getElementById('whoSeat');
  let name='';
  try{
    name=(window.GGSSignIn&&window.GGSSignIn.identity().name)||JSON.parse(localStorage.getItem('ggs-prep-v3-prefs')||'{}').me||'';
  }catch(err){ name=''; }
  const person=window.GGSPeople&&(window.GGSPeople.uniquePerson(name)||window.GGSPeople.findPerson(name));
  if(person) name=person.name;
  const job=window.GGSLeadDuties&&window.GGSLeadDuties.jobFor?window.GGSLeadDuties.jobFor(name):null;
  if(job){
    if(kicker) kicker.textContent='YOUR SEAT · '+job.title.toUpperCase();
    if(title) title.textContent=job.title;
    if(who) who.textContent=(name||'This seat')+' · arrive '+job.arrival+' · '+job.owns;
  }else if(name){
    if(kicker) kicker.textContent='THURSDAY CLOCK';
    if(title) title.textContent=name;
    if(who) who.textContent='Thursday, September 17, 2026. Your jobs follow this clock.';
  }
}
function renderHouseRos(){
  const el=document.getElementById('houseRos');
  const label=document.getElementById('clockLabel');
  const nowTitle=document.getElementById('nowPlainTitle');
  const nowNext=document.getElementById('nowPlainNext');
  if(!el) return;
  const rows=Array.prototype.slice.call(el.querySelectorAll('[data-t]'));
  if(!rows.length) return;
  const now=houseNow();
  const firstT=rows[0].getAttribute('data-t');
  const lastT=rows[rows.length-1].getAttribute('data-t');
  const started=now>=houseAt(firstT);
  const ended=now>=houseAt(lastT);
  let current=rows[0];
  let next=rows[1]||null;
  if(started){
    rows.forEach(function(row,i){
      if(now>=houseAt(row.getAttribute('data-t'))){
        current=row;
        next=rows[i+1]||null;
      }
    });
  }
  const nowT=current.getAttribute('data-t');
  const nextT=next?next.getAttribute('data-t'):'';
  rows.forEach(function(row){
    const t=row.getAttribute('data-t');
    row.classList.toggle('is-past', started&&now>=houseAt(t)&&t!==nowT);
    row.classList.toggle('is-now', started&&!ended&&t===nowT);
    row.classList.toggle('is-next', !started?t===firstT:(!!nextT&&t===nextT&&t!==nowT));
  });
  if(!started){
    if(label) label.textContent='Thursday has not started on this clock yet.';
    if(nowTitle) nowTitle.textContent='Thursday has not started';
    if(nowNext) nowNext.textContent='First move is 8:00 AM Tracy. Setup Lead and dressers walk in at 10:00 AM.';
    return;
  }
  if(ended){
    if(label) label.textContent='10:00 PM. Building should be clear.';
    if(nowTitle) nowTitle.textContent='Building clear';
    if(nowNext) nowNext.textContent='Event Lead leaves last.';
    return;
  }
  const text=rowText(current);
  const nxt=rowText(next);
  if(label) label.textContent=hm(nowT)+' — '+text;
  if(nowTitle) nowTitle.textContent=text;
  if(nowNext) nowNext.textContent=next?('Next · '+hm(nextT)+' — '+nxt):'Hard stop 10:00 PM.';
  if(!window.__houseDidScroll&&current){
    window.__houseDidScroll=true;
    current.scrollIntoView({block:'center'});
  }
}
function tick(){
  const now=new Date();
  const face=document.getElementById('clock');
  if(face) face.textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  const modeTime=document.getElementById('modeTime');
  if(modeTime) modeTime.textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  const d=new Date('2026-09-17T20:45:00');
  const modeTitle=document.getElementById('modeTitle');
  const modeNext=document.getElementById('modeNext');
  if(modeTitle) modeTitle.textContent=now>=d?'STRIKE MODE':'Event operations';
  if(modeNext) modeNext.textContent=now>=d?'Strike immediately. Building must be clear by 10:00 PM.':'Use the full checklist for assignments, owners and completion.';
  renderHouseRos();
  renderTimeline();
  paintNext();
}
function readiness(){
  const num=document.getElementById('readiness');
  const bar=document.getElementById('readinessBar');
  const detail=document.getElementById('readinessDetail');
  if(!num&&!bar&&!detail) return;
  const vals=areas.map(function(a){return pctForPrefix(tabToId(a[2]));});
  const p=Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length);
  if(num) num.textContent=p+'%';
  if(bar) bar.style.width=p+'%';
  if(detail) detail.textContent=vals.filter(function(x){return x>=80;}).length+' of '+vals.length+' command areas at 80%+ completion.';
}
function bind(){
  const open=document.getElementById('eventModeBtn');
  const overlay=document.getElementById('modeOverlay');
  const close=document.getElementById('closeMode');
  if(open&&overlay) open.onclick=function(){overlay.hidden=false;};
  if(close&&overlay) close.onclick=function(){overlay.hidden=true;};
  document.querySelectorAll('[data-jump]').forEach(function(b){
    b.onclick=function(){location.href='/prep/#'+b.dataset.jump;};
  });
}
function nextActions(){
  const critical=/teardown|strike|event captain|tracy|ben|ticket|10–12|10-12|load-out|photographer|cooler/i;
  return Object.entries(prepState)
    .filter(([k,v])=>k.indexOf('_doc:')!==0 && v && !v.done && !(v.owner||'').trim())
    .map(([k,v])=>({key:k,owner:v.owner||'',section:k.split(':')[0]}))
    .sort((a,b)=>Number(critical.test(a.key))-Number(critical.test(b.key)))
    .reverse();
}
function renderGaps(){
  const rows=nextActions();
  const gap=document.getElementById('gapCount');
  if(gap) gap.textContent=String(rows.length);
  const list=document.getElementById('nextList');
  if(!list){
    paintNext();
    return;
  }
  const labels={overview:'Overview',ben:'Ben / BBQ',setup:'Setup',volunteers:'People',tickets:'Tickets',campaign:'Campaign',food:'Food',production:'Tracy / show',timeline:'Timeline',breakdown:'Strike',final:'Final sweep'};
  const counts={};
  rows.forEach((r)=>{counts[r.section]=(counts[r.section]||0)+1});
  const order=['volunteers','breakdown','ben','production','tickets','setup','campaign','food','overview','timeline','final'];
  const items=order.filter((id)=>counts[id]).map((id)=>`<li><a href="/prep/#${id}">${labels[id]} — ${counts[id]} unassigned</a></li>`);
  list.innerHTML=items.join('')||'<li>Every open task has a name.</li>';
  paintNext();
}
function applyNight(on){
  document.documentElement.classList.toggle('night',on);
  const btn=document.getElementById('nightBtn');
  if(btn) btn.textContent=on?'Day mode':'Night mode';
  localStorage.setItem('ggs-command-night',on?'1':'0');
}
function renderCrewCall(){
  const el=document.getElementById('crewCall');
  if(!el||!window.GGSCrewSlice) return;
  const store=window.GGSPrepStore;
  const slice=window.GGSCrewSlice;
  const roster=(store&&store.readDoc('volunteers'))||{setup:[],event:[],strike:[]};
  const people=slice.peopleFrom(prepState,roster,window.GGS_PREP_SECTIONS||[]);
  const book=slice.readContacts(store);
  el.innerHTML=people.length?people.map((name)=>'<div class="crew-call-row">'+slice.contactHtml(name,slice.phoneFor(name,book))+'</div>').join(''):'<p class="muted">Names and numbers land here as people add them.</p>';
}
function applyPrep(data){Object.keys(prepState).forEach((k)=>delete prepState[k]);Object.assign(prepState,data||{});renderStatus();readiness();renderGaps();renderCrewCall();paintNext()}
if(window.GGSLeadDuties&&window.GGSLeadDuties.seedDefaults){
  try{window.GGSLeadDuties.seedDefaults();}catch(err){/* keep */}
}
paintSeat();
window.addEventListener('ggs-signed-in',paintSeat);
window.addEventListener('ggs-prep-loaded',paintSeat);
renderStatus();readiness();renderGaps();renderCrewCall();bind();tick();setInterval(()=>{tick();readiness();renderGaps();renderCrewCall();paintSeat()},15000);
const nightOn=localStorage.getItem('ggs-command-night')==='1';
applyNight(nightOn);
const nightBtn=document.getElementById('nightBtn');
if(nightBtn) nightBtn.onclick=()=>applyNight(!document.documentElement.classList.contains('night'));
if(window.GGSPrepStore){
  window.addEventListener('ggs-prep-loaded',(e)=>applyPrep(e.detail));
  window.addEventListener('ggs-prep-status',(e)=>{
    const el=document.getElementById('syncStatus');
    if(!el) return;
    el.textContent=e.detail==='saving'?'Saving to every device…':e.detail==='offline'?'Shared board unreachable — this phone only until it reconnects.':'Shared across every device.';
    el.dataset.state=e.detail||'ok';
  });
  if (window.GGSRadioFeed) {
    window.GGSRadioFeed.mount({
      feed: "#radioFeed",
      input: "#radioInput",
      send: "#radioSend",
      getName: function () {
        try {
          return JSON.parse(localStorage.getItem("ggs-prep-v3-prefs") || "{}").me || "";
        } catch (err) {
          return "";
        }
      },
    });
  }
  window.GGSPrepStore.startSync();
}
