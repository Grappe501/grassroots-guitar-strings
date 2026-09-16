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
 ['Setup','Tables, chairs, buffet, lobby, beverages and campaign display.','Setup'],
 ['Volunteers','Setup, event crew and 10–12+ teardown crew assigned.','Volunteers'],
 ['Tickets','Ticket station, payment procedure and reconciliation.','Tickets & Money'],
 ['Campaign','Literature, signs, QR displays and merchandise.','Campaign & Merch'],
 ['Food & Drinks','Tea, lemonade, water, glass containers, ice and coolers.','Food & Drinks'],
 ['Production','Tracy, sound, lights and David acoustic setup.','Sound & Show'],
 ['Breakdown','Strike Teams A–E and load-out map.','Breakdown']
];
const state=JSON.parse(localStorage.getItem('ggs-command-v1')||'{}');
const prepState=(window.GGSPrepStore?window.GGSPrepStore.readCache():JSON.parse(localStorage.getItem('ggs-prep-2026-09-17-v2')||'{}'));
function pctForPrefix(prefix){const rows=Object.entries(prepState).filter(([k])=>k.startsWith(prefix+':'));if(!rows.length)return 0;return Math.round(rows.filter(([,v])=>v.done).length/rows.length*100)}
function renderStatus(){const el=document.getElementById('statusGrid');el.innerHTML=areas.map(([name,desc,tab])=>{const p=pctForPrefix(tab==='Tickets & Money'?'tickets':tab==='Campaign & Merch'?'campaign':tab==='Sound & Show'?'production':tab==='Food & Drinks'?'food':tab==='Ben / BBQ'?'ben':tab.toLowerCase());const cls=p>=80?'is-ready':p<40?'is-alert':'';return `<article class="status-card ${cls}"><h3>${name}</h3><p class="muted">${desc}</p><div class="status-line"><span>${p}% complete</span><strong>${p>=80?'READY':p?'IN PROGRESS':'NEEDS OWNER'}</strong></div><div class="status-bar"><div style="width:${p}%"></div></div><a class="text-link" href="/prep/#${tabToId(tab)}">Open →</a></article>`}).join('')}
function tabToId(tab){return {'Ben / BBQ':'ben','Setup':'setup','Volunteers':'volunteers','Tickets & Money':'tickets','Campaign & Merch':'campaign','Food & Drinks':'food','Sound & Show':'production','Breakdown':'breakdown'}[tab]||tab.toLowerCase()}
function renderTimeline(){const now=new Date();document.getElementById('timeline').innerHTML=milestones.map((m,i)=>{const t=new Date(m[0]);const diff=t-now;const cls=diff<0?'past':(diff<3600000&&diff>=0?'current':'');const stateLabel=diff<0?'passed':cls?'next':'upcoming';return `<div class="timeline-row ${cls}"><div class="time">${m[1]}</div><div><strong>${m[2]}</strong><small>${timeDistance(diff)}</small></div><div class="state">${stateLabel}</div></div>`}).join('')}
function timeDistance(ms){if(ms<0){const n=Math.abs(ms);if(n<60000)return 'just passed';if(n<3600000)return `${Math.floor(n/60000)} min ago`;return `${Math.floor(n/3600000)} hr ago`}if(ms<60000)return 'in less than a minute';if(ms<3600000)return `in ${Math.floor(ms/60000)} min`;return `in ${Math.floor(ms/3600000)} hr ${Math.floor((ms%3600000)/60000)} min`}
function tick(){const now=new Date();document.getElementById('clock').textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});const event=new Date('2026-09-17T19:00:00');const diff=event-now;document.getElementById('clockLabel').textContent=diff>0?`Concert starts ${timeDistance(diff)}`:'Event day — use the live timeline';document.getElementById('modeTime').textContent=now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});const d=new Date('2026-09-17T20:45:00');document.getElementById('modeTitle').textContent=now>=d?'STRIKE MODE':'Event operations';document.getElementById('modeNext').textContent=now>=d?'Strike immediately. Building must be clear by 10:00 PM.':'Use the full checklist for assignments, owners and completion.';renderTimeline()}
function readiness(){const vals=areas.map(a=>pctForPrefix(tabToId(a[2])));const p=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);document.getElementById('readiness').textContent=p+'%';document.getElementById('readinessBar').style.width=p+'%';document.getElementById('readinessDetail').textContent=`${vals.filter(x=>x>=80).length} of ${vals.length} command areas at 80%+ completion.`}
function bind(){document.getElementById('eventModeBtn').onclick=()=>document.getElementById('modeOverlay').hidden=false;document.getElementById('closeMode').onclick=()=>document.getElementById('modeOverlay').hidden=true;document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>location.href=`/prep/#${b.dataset.jump}`)}
function applyPrep(data){Object.keys(prepState).forEach((k)=>delete prepState[k]);Object.assign(prepState,data||{});renderStatus();readiness()}
renderStatus();readiness();bind();tick();setInterval(()=>{tick();readiness()},30000);
if(window.GGSPrepStore){window.addEventListener('ggs-prep-loaded',(e)=>applyPrep(e.detail));window.GGSPrepStore.startSync()}
