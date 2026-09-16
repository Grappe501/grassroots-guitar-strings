(() => {
  const volunteerUrl='https://www.kellygrappe.com/get-involved';
  const websiteUrl='https://www.kellygrappe.com/';
  const donateUrl='https://goodchange.app/donate/commi-h8';
  const storageKey='ggs-prep-qr-v1';
  const store=window.GGSPrepStore;
  const state=store?store.readCache():JSON.parse(localStorage.getItem(storageKey)||'{}');
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const qr=url=>`https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=300&margin=2`;
  function addCard(sectionId,title,tasks){
    const section=document.querySelector(`[data-section="${sectionId}"] .grid`);
    if(!section || section.querySelector('[data-qr-card]')) return;
    const card=document.createElement('article');
    card.className='card'; card.dataset.qrCard='true';
    card.innerHTML=`<h3>${title}</h3><div class="task-list">${tasks.map((t,i)=>{const key=`qr:${sectionId}:${i}`,x=state[key]||{};return `<div class="task" data-qr-key="${key}"><label class="check"><input class="task-check" type="checkbox" ${x.done?'checked':''}><span class="checkmark"></span><span class="task-text">${esc(t[0])}</span></label><input class="owner" value="${esc(x.owner||'')}" placeholder="Assigned to…"><input class="when" value="${esc(x.when||'')}" placeholder="When…">${t[1]?`<div class="qr-meta"><img src="${qr(t[1])}" alt="QR code for ${esc(t[0])}"><a href="${esc(t[1])}" target="_blank" rel="noopener">${esc(t[1])}</a></div>`:''}</div>`}).join('')}</div>`;
    section.appendChild(card);
    card.querySelectorAll('.task').forEach(row=>row.addEventListener('input',()=>save(row)));
    card.querySelectorAll('.task').forEach(row=>row.addEventListener('change',()=>save(row)));
  }
  function save(row){const key=row.dataset.qrKey;state[key]={done:row.querySelector('.task-check').checked,owner:row.querySelector('.owner').value,when:row.querySelector('.when').value};if(store)store.saveOne(key,state[key]);else localStorage.setItem(storageKey,JSON.stringify(state));}
  function restoreQr(data){document.querySelectorAll('[data-qr-key]').forEach((row)=>{const x=(data||state)[row.dataset.qrKey];if(!x)return;row.querySelector('.task-check').checked=!!x.done;row.querySelector('.owner').value=x.owner||'';row.querySelector('.when').value=x.when||''});}
  function run(){
    addCard('setup','QR display materials',[
      ['Get 3 clear acrylic sign holders — 2 minimum, 3 preferred'],
      ['Assign one acrylic holder to Volunteer QR'],
      ['Assign one acrylic holder to Campaign Website QR'],
      ['Assign one acrylic holder to Donate QR'],
      ['Print QR cards on sturdy paper/cardstock'],
      ['Place QR signs where guests can scan without blocking traffic'],
      ['Test every QR code with at least two phones before doors'],
      ['Pack all acrylic holders and QR cards for teardown']
    ]);
    addCard('campaign','QR codes + acrylic stands',[
      ['Volunteer QR — https://www.kellygrappe.com/get-involved',volunteerUrl],
      ['Campaign Website QR — https://www.kellygrappe.com/',websiteUrl],
      ['Donate QR — https://goodchange.app/donate/commi-h8',donateUrl],
      ['Confirm 3 acrylic holders are on hand — 2 minimum'],
      ['Confirm each QR has a readable label below it'],
      ['Test volunteer QR'],
      ['Test website QR'],
      ['Test donate QR'],
      ['Assign QR station owner'],
      ['Place QR stations at ticket/lobby, campaign display and high-traffic guest area']
    ]);
  }
  window.addEventListener('ggs-prep-loaded',(e)=>restoreQr(e.detail));
  function boot(){run();if(window.GGSPrepApp&&window.GGSPrepApp.applyFilters)window.GGSPrepApp.applyFilters()}
  window.addEventListener('ggs-prep-rendered',boot);
  boot();
})();
