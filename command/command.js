const milestones=[
 ['2026-09-17T08:00:00','8:00 AM','Venue access + setup'],
 ['2026-09-17T10:00:00','10:00 AM','Infrastructure / production check'],
 ['2026-09-17T16:30:00','4:30 PM','Shift setup → event mode'],
 ['2026-09-17T17:00:00','5:00 PM','Event crew in position'],
 ['2026-09-17T17:30:00','5:30 PM','BBQ / social hour'],
 ['2026-09-17T17:45:00','5:45 PM','David acoustic set'],
 ['2026-09-17T18:15:00','6:15 PM','Acoustic wraps / transition'],
 ['2026-09-17T18:30:00','6:30 PM','Concert doors'],
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
 ['Food & Drinks','8 gal unsweet tea, 6 gal lemonade, 120 bottles water, 12 bags ice.','Food & Drinks'],
 ['Production','Tracy, sound, lights and David acoustic setup.','Sound & Show'],
 ['Breakdown','Same 7 people. Venue furniture stays. 45–60 min.','Breakdown']
];
const state=JSON.parse(localStorage.getItem('ggs-command-v1')||'{}');
const prepState=(window.GGSPrepStore?window.GGSPrepStore.readCache():JSON.parse(localStorage.getItem('ggs-prep-2026-09-17-v2')||'{}'));
function pctForPrefix(prefix){const rows=Object.entries(prepState).filter(([k])=>k.startsWith(prefix+':'));if(!rows.length)return 0;return Math.round(rows.filter(([,v])=>v.done).length/rows.length*100)}
function renderStatus(){const el=document.getElementById('statusGrid');el.innerHTML=areas.map(([name,desc,tab])=>{const p=pctForPrefix(tab==='Tickets & Money'?'tickets':tab==='Campaign & Merch'?'campaign':tab==='Sound & Show'?'production':tab==='Food & Drinks'?'food':tab==='Ben / BBQ'?'ben':tab.toLowerCase());const cls=p>=80?'is-ready':p<40?'is-alert':'';return `<article class="status-card ${cls}"><h3>${name}</h3><p class="muted">${desc}</p><div class="status-line"><span>${p}% complete</span><strong>${p>=80?'READY':p?'IN PROGRESS':'NEEDS OWNER'}</strong></div><div class="status-bar"><div style="width:${p}%"></div></div><a class="text-link" href="/prep/#${tabToId(tab)}">Open →</a></article>`}).join('')}
function tabToId(tab){return {'Ben / BBQ':'ben','Setup':'setup','Volunteers':'volunteers','Tickets & Money':'tickets','Campaign & Merch':'campaign','Food & Drinks':'food','Sound & Show':'production','Breakdown':'breakdown'}[tab]||tab.toLowerCase()}
function renderTimeline(){const now=new Date();document.getElementById('timeline').innerHTML=milestones.map((m,i)=>{const t=new Date(m[0]);const diff=t-now;const cls=diff<0?'past':(diff<3600000&&diff>=0?'current':'');const stateLabel=diff<0?'passed':cls?'next':'upcoming';return `<div class="timeline-row ${cls}"><div class="time">${m[1]}</div><div><strong>${m[2]}</strong><small>${timeDistance(diff)}</small></div><div class="state">${stateLabel}</div></div>`}).join('')}
function timeDistance(ms){if(ms<0){const n=Math.abs(ms);if(n<60000)return 'just passed';if(n<3600000)return `${Math.floor(n/60000)} min ago`;return `${Math.floor(n/3600000)} hr ago`}if(ms<60000)return 'in less than a minute';if(ms<3600000)return `in ${Math.floor(ms/60000)} min`;return `in ${Math.floor(ms/3600000)} hr ${Math.floor((ms%3600000)/60000)} min`}
function paintNext(){
  if(!window.GGSNextAction) return;
  const roster=(window.GGSPrepStore&&window.GGSPrepStore.readDoc('volunteers'))||{strike:[]};
  window.GGSNextAction.paint(prepState,roster);
}
function tick(){const now=new Date();document.getElementById('clock').textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});const event=new Date('2026-09-17T19:00:00');const diff=event-now;document.getElementById('clockLabel').textContent=diff>0?`Concert starts ${timeDistance(diff)}`:'Event day — use the live timeline';document.getElementById('modeTime').textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});const d=new Date('2026-09-17T20:45:00');document.getElementById('modeTitle').textContent=now>=d?'STRIKE MODE':'Event operations';document.getElementById('modeNext').textContent=now>=d?'Strike immediately. Building must be clear by 10:00 PM.':'Use the full checklist for assignments, owners and completion.';renderTimeline();paintNext()}
function readiness(){const vals=areas.map(a=>pctForPrefix(tabToId(a[2])));const p=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);document.getElementById('readiness').textContent=p+'%';document.getElementById('readinessBar').style.width=p+'%';document.getElementById('readinessDetail').textContent=`${vals.filter(x=>x>=80).length} of ${vals.length} command areas at 80%+ completion.`}
function bind(){document.getElementById('eventModeBtn').onclick=()=>document.getElementById('modeOverlay').hidden=false;document.getElementById('closeMode').onclick=()=>document.getElementById('modeOverlay').hidden=true;document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>location.href=`/prep/#${b.dataset.jump}`)}
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
  if(!list) return;
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
renderStatus();readiness();renderGaps();renderCrewCall();bind();tick();setInterval(()=>{tick();readiness();renderGaps();renderCrewCall()},15000);
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
