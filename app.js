const $=s=>document.querySelector(s),app=$('#app');
const byId=Object.fromEntries(LIB.items.map(i=>[i.id,i]));
const era=id=>LIB.eras.find(e=>e.id===id);
const TY={event:'Event',battle:'Battle',person:'Personality',fort:'Fort',place:'Place',warrior:'Mawale & warriors'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const root=document.documentElement;
try{root.dataset.theme=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
const row=i=>`<a class="row" href="#/item/${i.id}"><span class="yr">${i.year}</span><span><small>${TY[i.type]} · ${era(i.era).name} · ${esc(i.place)}</small><b>${esc(i.title)}</b><em>${esc(i.summary)}</em></span></a>`;
const hay=i=>[i.title,i.summary,i.sig,i.place,i.year,i.date,TY[i.type],era(i.era).name].join(' ').toLowerCase();
function search(q,type,eraId,sort){
  const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
  let r=LIB.items.filter(i=>(!type||i.type===type||(type==='warrior'&&i.w))&&(!eraId||i.era===eraId)&&terms.every(t=>hay(i).includes(t)));
  r.sort(sort==='az'?(a,b)=>a.title.localeCompare(b.title):sort==='desc'?(a,b)=>b.year-a.year:(a,b)=>a.year-b.year);
  return r;
}
function browse(p){
  app.innerHTML=`<h1>Browse the library</h1><div class="ctl">
  <input id="q" list="sg" placeholder="Search…" value="${esc(p.get('q')||'')}">
  <select id="t"><option value="">All types</option>${Object.entries(TY).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
  <select id="e"><option value="">All periods</option>${LIB.eras.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select>
  <select id="s"><option value="asc">Oldest first</option><option value="desc">Newest first</option><option value="az">A–Z</option></select></div>
  <div class="count" id="n"></div><div id="list"></div>`;
  $('#t').value=p.get('type')||'';$('#e').value=p.get('era')||'';
  const run=()=>{const r=search($('#q').value,$('#t').value,$('#e').value,$('#s').value);
    $('#n').textContent=r.length+' result'+(r.length===1?'':'s');
    $('#list').innerHTML=r.map(row).join('')||'<p>No entries match. Try a year, a place or a name.</p>'};
  ['q','t','e','s'].forEach(id=>$('#'+id).addEventListener('input',run));run();
}
const card=i=>`<a class="card" href="#/item/${i.id}"><div class="ph">${esc(i.img.type)}</div><small>${TY[i.type]} · ${i.year}</small><b>${esc(i.title)}</b><span>${esc(i.summary)}</span></a>`;
const feat=(t,ids,l)=>`<h2 class="sec">${t}${l?` <a class="more" href="${l}">View all →</a>`:''}</h2><div class="cards">${ids.map(x=>card(byId[x])).join('')}</div>`;
function home(){
  const mini=['birth','oath','torna','pratapgad','coronation','sambhajiend','palkhed','panipat','end1818'].map(x=>byId[x]);
  app.innerHTML=`<section class="hero2"><svg class="fortsil" viewBox="0 0 600 120" aria-hidden="true"><path d="M0 120V80l60-25 40 20 70-45 60 40 50-25 80 35 70-50 60 45 70-20 40 25v60z" fill="currentColor"/></svg><div class="hin"><svg class="flag" width="34" height="40" viewBox="0 0 26 30" aria-hidden="true"><path d="M3 2h20l-6 7 6 7H3z" fill="#B84324"/><rect x="1" y="1" width="2.5" height="28" fill="#D6B77A"/></svg>
  <h1>The Maratha Empire</h1><p>A digital historical library of Swarajya and the Maratha state, from the Deccan before Shivaji to 1818.</p>
  <form class="search" id="hs"><input id="hq" list="sg" placeholder="Search people, forts, battles, years…" aria-label="Search"><button class="btn">Search</button></form>
  <a class="btn" href="#/browse">Explore the History</a> <a class="btn alt" href="#/map">Open Historical Map</a></div></section>
  <h2 class="sec">Introduction</h2><p>Swarajya, or self-rule, was the state Shivaji built from the 1640s in the western Deccan, around hill forts, a formal council of ministers and a coastal navy. Under his successors and the Peshwas, Maratha power grew across central and northern India until the Third Anglo-Maratha War ended it in 1818. This library is organised as linked articles; entries marked as traditional or approximate say so.</p>
  <h2 class="sec">Historical periods</h2><div class="eras">${LIB.eras.map(e=>`<a href="#/browse?era=${e.id}"><b>${e.name}</b><span>${e.span}</span></a>`).join('')}</div>
  ${feat('Featured personalities',['shivaji','sambhaji','tarabai','bajirao','tanaji','netaji'],'#/browse?type=person')}
  ${feat('Featured forts',['raigad','torna','rajgad','shivneri','purandarfort','panhala'],'#/browse?type=fort')}
  ${feat('Battles and events',['pratapgad','salher','coronation','palkhed','panipat','ashtapradhan'],'#/browse?type=battle')}
  <h2 class="sec">Timeline preview <a class="more" href="#/timeline">Full timeline →</a></h2><div class="tl">${mini.map(i=>`<a href="#/item/${i.id}"><b>${i.year}</b>${esc(i.title)}</a>`).join('')}</div>
  <h2 class="sec">Explore the library</h2><div class="eras">${[['Personalities','#/browse?type=person'],['Mawale & commanders','#/warriors'],['Forts','#/browse?type=fort'],['Battles','#/browse?type=battle'],['Events','#/browse?type=event'],['Administration','#/ashtapradhan'],['Rulers','#/browse?q=Chhatrapati'],['Places','#/browse?type=place'],['Archive','#/archive']].map(([n,h])=>`<a href="${h}"><b>${n}</b></a>`).join('')}</div>
  <p class="count">${LIB.items.length} entries.</p>`;
  $('#hs').onsubmit=e=>{e.preventDefault();location.hash='#/browse?q='+encodeURIComponent($('#hq').value)};
}
function timeline(){
  app.innerHTML=`<h1>Timeline</h1><div class="ctl"><select id="te"><option value="">All periods</option>${LIB.eras.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select><select id="tt"><option value="">All categories</option>${Object.entries(TY).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div><div class="tl" id="tl"></div>`;
  const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})):null;
  const run=()=>{$('#tl').innerHTML=LIB.eras.filter(e=>!$('#te').value||e.id===$('#te').value).map(e=>{const l=search('',$('#tt').value,e.id,'asc');return l.length?`<h3>${e.name} <small>(${e.span})</small></h3>${l.map(i=>`<a class="ti" href="#/item/${i.id}"><b>${i.year}</b>${esc(i.title)} <small>· ${TY[i.type]}</small></a>`).join('')}`:''}).join('')||'<p>No entries.</p>';
    document.querySelectorAll('.ti').forEach(a=>io?io.observe(a):a.classList.add('in'))};
  ['te','tt'].forEach(id=>$('#'+id).addEventListener('input',run));run();
}
function item(id){
  const i=byId[id];if(!i){app.innerHTML='<h1>Entry not found</h1>';return}
  const chips=i.rel.map(r=>`<a href="#/item/${r}">${esc(byId[r].title)}</a>`).join('');
  const S=[['overview','Overview',`<p>${esc(i.summary)}</p>`],...(i.s||[]).map((x,k)=>['s'+k,x[0],`<p>${esc(x[1])}</p>`]),['sig','Historical significance',`<p>${esc(i.sig)}</p>`]];
  if(chips)S.push(['rel','Related entries',`<div class="chips">${chips}</div>`]);
  S.push(['src','Sources and further reading',`<p><a href="${W(i.wiki)}" target="_blank" rel="noopener">Wikipedia article</a> (link not individually checked). No academic citation has been attached to this entry yet; see the <a href="#/sources">Sources page</a> for recommended works that have not yet been consulted.</p>`]);
  const ty=LIB.items.filter(x=>x.type===i.type&&x.id!==i.id);const idx=LIB.items.indexOf(i);
  app.innerHTML=`<div class="crumb"><a href="#/">Library</a> › <a href="#/browse?type=${i.type}">${TY[i.type]}</a> › ${esc(i.title)}</div>
  <div class="art"><nav class="toc"><b>Contents</b>${S.map(x=>`<button data-s="${x[0]}">${x[1]}</button>`).join('')}</nav>
  <article><small class="count">${TY[i.type]} · ${era(i.era).name}</small><h1>${esc(i.title)}</h1>${S.map(x=>`<section id="sec-${x[0]}"><h2>${x[1]}</h2>${x[2]}</section>`).join('')}
  <div class="pn">${idx>0?`<a href="#/item/${LIB.items[idx-1].id}">← ${esc(LIB.items[idx-1].title)}</a>`:'<span></span>'}${idx<LIB.items.length-1?`<a href="#/item/${LIB.items[idx+1].id}">${esc(LIB.items[idx+1].title)} →</a>`:''}</div></article>
  <aside class="info"><details open><summary>Quick facts</summary><div class="ph">${esc(i.img.type)} — image pending</div><dl><dt>Type</dt><dd>${TY[i.type]}</dd><dt>Date</dt><dd>${esc(i.date)}</dd><dt>Place</dt><dd>${esc(i.place)}</dd><dt>Period</dt><dd>${era(i.era).name} (${era(i.era).span})</dd>${i.w?'<dt>Category</dt><dd>Mawale &amp; warriors</dd>':''}</dl></details></aside></div>`;
  document.querySelectorAll('.toc button').forEach(b=>b.onclick=()=>$('#sec-'+b.dataset.s).scrollIntoView({behavior:'smooth'}));
}
const AP=[['Peshwa (Pantpradhan)','Prime minister; head of general administration.','Moropant Pingle'],['Amatya','Finance and accounts.','Ramchandra Nilkanth'],['Sachiv (Surnis)','Royal correspondence and records.','Annaji Datto'],['Mantri (Waknis)','Internal affairs and the king\'s records.','Dattaji Trimbak'],['Senapati (Sarnaubat)','Commander of the army.','Hambirrao Mohite (at the 1674 coronation); Prataprao Gujar earlier'],['Sumant (Dabir)','Foreign affairs and diplomacy.','Ramchandra Trimbak'],['Nyayadhish','Justice.','Niraji Raoji'],['Panditrao','Religious affairs and charity.','Raghunath Pandit']];
function ashta(){app.innerHTML=`<h1>Ashtapradhan Mandal</h1><p>The Ashtapradhan Mandal was the council of eight ministers around Shivaji, formalised around his 1674 coronation. See <a href="#/item/ashtapradhan">the entry</a> and <a href="#/item/coronation">the coronation</a>.</p><div class="cards">${AP.map(a=>`<div class="card"><small>Minister</small><b>${a[0]}</b><span>${a[1]}</span><span><i>Commonly listed holder: ${a[2]}</i></span></div>`).join('')}</div><p class="count">Role descriptions and holders follow the commonly cited list; holders changed over time, and this page has not yet been checked against academic sources.</p>`}
const GC=[['all','All'],['maharaja','Maharajas'],['warrior','Mawale & warriors'],['peshwa','Peshwas'],['fort','Forts'],['painting','Paintings'],['manuscript','Manuscripts']];
const MAH=['shivaji','sambhaji','rajaram','tarabai','shahu'],PESH=['balaji','bajirao','madhavrao','bajirao2'];
const MSS=[{k:'sabhasad',t:'Sabhasad Bakhar',per:'Traditionally dated c. 1697',role:'Chronicle (bakhar) of Shivaji',bio:'A Marathi prose chronicle on the life of Shivaji, traditionally attributed to Krishnaji Anant Sabhasad.',ach:'It is one of the early narrative sources for Shivaji\'s career and is widely consulted, but later chronicles differ and its details need cross-checking.'},
{k:'jedhe',t:'Jedhe Shakavali',per:'Family chronicle; dating to be verified',role:'Chronicle of the Jedhe family',bio:'A chronological record kept by the Jedhe family of Rohidkhore, who were early supporters of Shivaji.',ach:'It is used as a source for the early Swarajya period; authorship and dating details are still to be verified here.'}];
const galItems=()=>[...LIB.items.filter(i=>i.type==='person'||i.type==='fort'||i.img.type==='painting').map(i=>({k:i.id,t:i.title,i,c:[MAH.includes(i.id)&&'maharaja',PESH.includes(i.id)&&'peshwa',i.w&&'warrior',i.type==='fort'&&'fort',i.img.type==='painting'&&'painting'].filter(Boolean),per:era(i.era).name+' · '+i.date})),...MSS.map(m=>({k:m.k,t:m.t,m,c:['manuscript'],per:m.per}))];
function gallery(){
  app.innerHTML=`<h1>Gallery &amp; archive</h1><p class="count">Every figure opens an archive record. No verified image has been added yet; entries show a labelled placeholder rather than an unreliable picture. Real images need a source URL and licence in <code>data.js</code> before they display.</p>
  <div class="ctl"><input id="gq" list="sg" placeholder="Search the archive…"><div class="pills" id="gc">${GC.map(c=>`<button class="pill${c[0]==='all'?' on':''}" data-c="${c[0]}">${c[1]}</button>`).join('')}</div></div><div class="count" id="gn"></div><div class="cards gal" id="gg"></div>`;
  let cat='all';const all=galItems();
  const run=()=>{const q=$('#gq').value.toLowerCase(),r=all.filter(g=>(cat==='all'||g.c.includes(cat))&&(g.t+' '+g.per).toLowerCase().includes(q));
    $('#gn').textContent=r.length+' record'+(r.length===1?'':'s');
    $('#gg').innerHTML=r.map(g=>`<button class="card gcard" data-k="${g.k}"><div class="ph">${esc(g.i?g.i.img.type:'manuscript')} — image pending</div><b>${esc(g.t)}</b><span>${esc(g.per)}</span></button>`).join('')||'<p>No records match.</p>';
    document.querySelectorAll('.gcard').forEach(b=>b.onclick=()=>openArchive(all.find(g=>g.k===b.dataset.k)))};
  $('#gq').oninput=run;document.querySelectorAll('#gc .pill').forEach(b=>b.onclick=()=>{cat=b.dataset.c;document.querySelectorAll('#gc .pill').forEach(x=>x.classList.toggle('on',x===b));run()});run();
}
function openArchive(g){
  const i=g.i,m=g.m,im=i&&i.img;
  const fig=im&&im.src?`<figure><img src="${esc(im.src)}" alt="${esc(g.t)}"><figcaption>${esc(im.type)} · ${im.source?`<a href="${esc(im.source)}" target="_blank" rel="noopener">source</a>`:'source not recorded'} · ${esc(im.license||'licence not recorded')}</figcaption></figure>`:`<div class="ph big">${esc(im?im.type:'manuscript')}<br>No verified image yet. Source and licence fields are empty.</div>`;
  const rel=i?i.rel.filter(r=>['event','battle'].includes(byId[r].type)).map(r=>`<a href="#/item/${r}">${esc(byId[r].title)}</a>`).join(''):'';
  const body=i?`<h3>Role</h3><p>${TY[i.type]} · ${esc(i.place)}</p><h3>Biography</h3><p>${esc(i.summary)}</p>${(i.s||[]).map(x=>`<p><b>${esc(x[0])}.</b> ${esc(x[1])}</p>`).join('')}<h3>Achievements and significance</h3><p>${esc(i.sig)}</p>${rel?`<h3>Related events</h3><div class="chips">${rel}</div>`:''}<h3>Sources</h3><p><a href="${W(i.wiki)}" target="_blank" rel="noopener">Wikipedia</a> (link not individually checked). No academic source has been attached yet; see <a href="#/sources">Sources</a>.</p><a class="btn" href="#/item/${i.id}">Open full article</a>`
   :`<h3>Role</h3><p>${esc(m.role)}</p><h3>Description</h3><p>${esc(m.bio)}</p><h3>Significance</h3><p>${esc(m.ach)}</p><h3>Sources</h3><p>Listed on the <a href="#/sources">Sources page</a> as a recommended primary source; not consulted for this build.</p>`;
  const o=document.createElement('div');o.className='ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML=`<div class="ovb"><button class="x" aria-label="Close">×</button><div class="ovg">${fig}<div><small class="count">Archive record</small><h2>${esc(g.t)}</h2><p class="count">${esc(g.per)}</p>${body}</div></div></div>`;
  const close=()=>{o.remove();document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')close()};
  o.onclick=e=>{if(e.target===o||e.target.closest('.x')||e.target.closest('a[href^="#/"]'))close()};
  document.addEventListener('keydown',kd);document.body.appendChild(o);o.querySelector('.x').focus();
}
const pb=$('#pb'),up=$('#up');addEventListener('scroll',()=>{const h=document.documentElement,m=h.scrollHeight-h.clientHeight;pb.style.width=(m>0?h.scrollTop/m*100:0)+'%';up.hidden=h.scrollTop<600},{passive:true});up.onclick=()=>scrollTo({top:0,behavior:'smooth'});
document.body.insertAdjacentHTML('beforeend',`<datalist id="sg">${LIB.items.map(i=>`<option value="${esc(i.title)}">`).join('')}</datalist>`);
function sources(){
  app.innerHTML=`<h1>Sources &amp; further reading</h1><ul>${LIB.sources.map(s=>`<li>${s.u?`<a href="${s.u}" target="_blank" rel="noopener">${s.t}</a>`:s.t} — ${s.n}</li>`).join('')}</ul>
  <p>Wikipedia links on entry pages use standard article titles and have not been individually checked. Dates marked “c.” are approximate, and sources sometimes disagree.</p>`;
}
function route(){
  const [path,qs]=location.hash.slice(1).split('?'),p=new URLSearchParams(qs||''),parts=(path||'/').split('/');
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')===location.hash));
  ({'':home,'browse':()=>browse(p),'timeline':timeline,'map':()=>renderMap(app,p),'sources':sources,'warriors':()=>browse(new URLSearchParams('type=warrior')),'ashtapradhan':ashta,'gallery':gallery,'archive':gallery,'item':()=>item(parts[2])}[parts[1]]||home)();
  scrollTo(0,0);
}
addEventListener('hashchange',route);route();
