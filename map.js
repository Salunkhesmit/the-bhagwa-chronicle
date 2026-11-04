// Schematic historical map. Coordinates are [lon,lat]; shapes are APPROXIMATE, drawn by hand for illustration, not surveyed borders.
const PX=ll=>[(ll[0]-68)*25,(35-ll[1])*25];
const OUT=[[68.2,23.7],[70.2,20.8],[72.8,21.2],[72.9,19],[73.8,15.5],[74.9,12.8],[76.2,9.9],[77.5,8.1],[78.2,8.9],[79.8,10.3],[80.3,13.1],[80.2,15.8],[82.3,16.9],[84.8,19.3],[86.9,21.5],[88.5,22],[89,26],[92,27],[92,28.5],[88,27.5],[84,28.2],[80,30.5],[78.5,32.5],[79,35],[75,35],[74.5,32],[74,31],[72.5,28.5],[70.5,26.5],[69,24.5]];
const P=(n,ll,k,d,t,e)=>({n,ll,k,d,t,e});
const PLACES={
shivneri:P('Shivneri',[73.86,19.2],'fort','1630','Hill fort near Junnar, traditionally the birthplace of Shivaji.','shivneri'),
pune:P('Pune',[73.86,18.52],'city','1630s–1818','Shahaji\'s jagir seat and Shivaji\'s early base; later the Peshwa capital.','pune'),
torna:P('Torna',[73.62,18.28],'fort','c. 1646','Taken by Shivaji around 1646; sources differ on the exact year.','torna'),
rajgad:P('Rajgad',[73.68,18.25],'fort','from c. 1647','Built up as Shivaji\'s seat before Raigad.','rajgad'),
raigad:P('Raigad',[73.44,18.23],'fort','1656–1674','Taken 1656; capital and coronation site in 1674.','raigad'),
sinhagad:P('Sinhagad',[73.76,18.37],'battle','Feb 1670','Recaptured from a Mughal garrison; Tanaji Malusare died in the assault.','sinhagad'),
purandar:P('Purandar',[73.98,18.28],'fort','1665','Defended by Murarbaji in 1665; the Treaty of Purandar (11 June 1665) is named for it.','purandarfort'),
pratapgad:P('Pratapgad',[73.58,17.93],'battle','10 Nov 1659','Fort built c. 1656–58; the Afzal Khan encounter took place below it.','pratapgad'),
panhala:P('Panhala',[74.11,16.81],'fort','1660','Besieged in 1660; Shivaji escaped toward Vishalgad.','panhala'),
pavan:P('Pavan Khind',[73.9,16.87],'battle','July 1660','Baji Prabhu\'s stand. Position approximate on this map.','pavankhind'),
vishalgad:P('Vishalgad',[73.72,16.9],'fort','1660','Reached by Shivaji after the Pavan Khind stand.',null),
surat:P('Surat',[72.83,21.17],'battle','Jan 1664','Mughal port raided by Maratha forces (again in 1670).','surat'),
agra:P('Agra',[78.01,27.18],'city','1666','Shivaji at Aurangzeb\'s court; escape in August 1666.','agra'),
jinji:P('Jinji',[79.42,12.25],'fort','1690s','Southern resistance base under Rajaram.','jinji'),
satara:P('Satara',[74.0,17.69],'city','from c. 1708','Shahu\'s capital.',null),
sang:P('Sangameshwar',[73.55,17.19],'battle','Feb 1689','Sambhaji was captured near here.','sambhajiend'),
vasai:P('Vasai',[72.83,19.35],'battle','May 1739','Taken from the Portuguese by Chimaji Appa.','vasai'),
palkhed:P('Palkhed',[73.9,20.0],'battle','28 Feb 1728','Victory over Nizam-ul-Mulk. Position approximate.','palkhed'),
delhi:P('Delhi',[77.21,28.61],'city','1737','Reached by Bajirao I\'s expedition in 1737.','delhi'),
bhopal:P('Bhopal',[77.41,23.26],'battle','Dec 1737 / Jan 1738','Battle against Nizam-ul-Mulk; sources differ on the date.',null),
panipat:P('Panipat',[76.97,29.39],'battle','14 Jan 1761','Defeat by Ahmad Shah Durrani\'s coalition.','panipat'),
indore:P('Indore',[75.86,22.72],'city','18th century','Holkar seat.','malhar'),
baroda:P('Baroda',[73.18,22.31],'city','18th century','Gaekwad seat.',null),
nagpur:P('Nagpur',[79.09,21.15],'city','18th century','Seat of the Bhonsles of Nagpur.',null),
assaye:P('Assaye',[75.9,20.1],'battle','23 Sep 1803','Defeat of Scindia and Bhonsle forces by the British. Position approximate.','assaye'),
koregaon:P('Koregaon Bhima',[74.0,18.65],'battle','1 Jan 1818','Company troops vs Peshwa forces.','koregaon'),
bijapur:P('Bijapur',[75.71,16.83],'city','to 1686','Adil Shahi capital.',null),
golconda:P('Golconda',[78.4,17.38],'city','to 1687','Qutb Shahi capital.',null),
ahmadnagar:P('Ahmadnagar',[74.74,19.09],'city','to 1630s','Nizam Shahi capital; the sultanate was collapsing by the 1630s.',null)};
const R=(n,c,r,k)=>({n,c,r,k});
const PERIODS=[
{t:'Before Shivaji\'s birth',y:'to 1630',d:'The Deccan was split between the Bijapur, Golconda and Ahmadnagar sultanates, while the Mughals pressed south from the north. Ahmadnagar was collapsing, and Shahaji served in its politics.',p:['bijapur','golconda','ahmadnagar'],r:[R('Bijapur (Adil Shahi)',[75.5,16.5],[2.5,2],'influence'),R('Golconda (Qutb Shahi)',[79,17.5],[2.3,1.8],'influence'),R('Ahmadnagar',[74.8,19.2],[1.5,1.2],'disputed'),R('Mughal reach (Khandesh)',[76,21.2],[2,1.1],'influence')]},
{t:'Birth and early life',y:'1630–1645',d:'Shivaji was born at Shivneri; Shahaji\'s jagir around Pune was the family base.',p:['shivneri','pune'],r:[R('Shahaji\'s Pune jagir',[74,18.5],[1,0.6],'influence')]},
{t:'Beginning of Swarajya',y:'c. 1645',d:'Tradition places the oath of Swarajya near Pune; the early base was the Maval hill country.',p:['pune','torna'],r:[R('Maval core (early)',[73.7,18.3],[0.7,0.6],'core')]},
{t:'Capture of Torna',y:'c. 1646',d:'Torna is the first major fort recorded for Shivaji; the exact year is disputed. Rajgad followed nearby.',p:['torna','rajgad'],r:[R('Torna–Rajgad area',[73.65,18.27],[0.45,0.4],'core')]},
{t:'Early fort expansion',y:'c. 1646–1658',d:'Forts around Pune and the western ghats came under Shivaji, including Raigad (1656) and Pratapgad.',p:['torna','rajgad','sinhagad','purandar','raigad','pratapgad'],r:[R('Swarajya core',[73.8,18.0],[0.9,0.9],'core')]},
{t:'Major campaigns and battles',y:'1659–1670',d:'Pratapgad, Panhala and Pavan Khind, the Surat raid, Purandar and Agra, then recovery of forts such as Sinhagad.',p:['pratapgad','panhala','pavan','vishalgad','surat','agra','sinhagad','purandar'],r:[R('Swarajya core',[74,17.8],[1.2,1.6],'core')]},
{t:'Coronation',y:'1674',d:'Shivaji was crowned at Raigad. The territory shown is approximate; the southern conquests came in 1677–78, after the coronation.',p:['raigad','satara'],r:[R('Swarajya core',[73.9,17.8],[1.2,2.4],'core'),R('Konkan holdings',[73.3,17.8],[0.5,1.5],'core')]},
{t:'Sambhaji\'s reign',y:'1680–1689',d:'Maratha forces fought the Mughals across the Konkan and western Deccan. Sambhaji was captured near Sangameshwar in 1689.',p:['raigad','sang','jinji'],r:[R('Swarajya (contested)',[73.9,17.8],[1.3,2.4],'disputed'),R('Southern holdings (from c. 1677–78)',[79.4,12.3],[1.2,1.5],'influence')]},
{t:'Rajaram and Tarabai',y:'1689–1707',d:'Resistance shifted to Jinji in the south and mobile campaigns in Maharashtra while the Mughals held many forts.',p:['jinji','satara','panhala'],r:[R('Maharashtra (contested)',[74,17.6],[1.5,2.4],'disputed'),R('Jinji region',[79.4,12.3],[0.9,0.9],'influence')]},
{t:'Shahu and the rise of the Peshwas',y:'1707–1720',d:'Shahu ruled from Satara, with Balaji Vishwanath as Peshwa from 1713. Maratha influence began to extend beyond the Deccan.',p:['satara','pune'],r:[R('Shahu\'s core',[74,17.6],[1.8,2.5],'core'),R('Deccan rights (chauth)',[76,18.5],[2.5,2],'influence')]},
{t:'Bajirao I and expansion',y:'1720–1761',d:'Campaigns reached Malwa, Gujarat and Bundelkhand, and a raid to Delhi in 1737. Boundaries shown are influence zones, not fixed borders.',p:['pune','palkhed','delhi','bhopal','vasai','panipat'],r:[R('Peshwa/Satara core',[74,18.5],[1.8,2.5],'core'),R('Malwa',[75.5,23],[2.5,1.5],'influence'),R('Gujarat',[72.5,22],[1.5,1.5],'influence'),R('Bundelkhand',[79,25],[1.5,1.2],'influence')]},
{t:'Later empire and 1818',y:'1761–1818',d:'After Panipat the empire became a confederacy of the Peshwa, Scindia, Holkar, Gaekwad and Bhonsle. After the Third Anglo-Maratha War the Peshwa\'s territories were annexed by the East India Company in 1818.',p:['pune','panipat','assaye','koregaon','indore','baroda','nagpur','delhi'],r:[R('Peshwa territory',[74.5,18.5],[2,2.5],'core'),R('Holkar (Malwa)',[75.8,22.7],[1.3,1],'influence'),R('Gaekwad (Gujarat)',[73,22.3],[1.2,1],'influence'),R('Bhonsle (Nagpur)',[79,21],[1.5,1.2],'influence'),R('Scindia (north)',[77.5,26],[1.8,1.8],'influence')]}];
['pavan','palkhed','assaye'].forEach(k=>PLACES[k].ap=1);
function renderMap(app,q){
 app.innerHTML=`<h1>Historical map</h1><div class="ctl"><select id="mp"><option value="">All periods</option>${PERIODS.map((p,k)=>`<option value="${k}">${k+1}. ${p.t} (${p.y})</option>`).join('')}</select><select id="mk"><option value="">All place types</option><option value="fort">Forts</option><option value="battle">Battles / campaigns</option><option value="city">Cities</option></select><input id="ms" placeholder="Search places…"></div>
 <div class="count" id="mn"></div><div id="lmap"></div>
 <div class="leg"><span><i class="s fort"></i>Fort</span><span><i class="s city"></i>City</span><span><i class="s battle"></i>Battle / campaign</span></div>
 <p class="count">Marker positions are modern coordinates of each site, entered from memory and not yet independently verified; popups say "approximate" where the exact spot is uncertain. No historical borders are drawn. Map data © OpenStreetMap contributors.</p><a class="btn" href="#/gallery">Continue to the Gallery →</a>`;
 if(typeof L==='undefined'){$('#lmap').innerHTML='<p>The map library (Leaflet) could not load. An internet connection is needed for the map and its tiles.</p>';return}
 const map=L.map('lmap').setView([18.5,74.5],7);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 const g=L.layerGroup().addTo(map),col={fort:'#B84324',city:'#D6B77A',battle:'#7B241C'};
 if(q&&q.get('p'))$('#mp').value=q.get('p');
 const draw=()=>{g.clearLayers();const pk=$('#mp').value,k=$('#mk').value,s=$('#ms').value.toLowerCase();
  const pts=Object.entries(PLACES).filter(([id,p])=>(pk===''||PERIODS[+pk].p.includes(id))&&(!k||p.k===k)&&p.n.toLowerCase().includes(s));
  pts.forEach(([id,p])=>L.circleMarker([p.ll[1],p.ll[0]],{radius:8,color:'#25231F',weight:1.5,fillColor:col[p.k],fillOpacity:.9}).bindPopup(`<b>${p.n}</b><br><small>${p.k} · ${p.d}</small><p>${p.t}${p.ap?' <i>(position approximate)</i>':''}</p>${p.e?`<a href="#/item/${p.e}">Open library entry →</a>`:'<i>No library entry yet</i>'}`).addTo(g));
  $('#mn').textContent=pts.length+' place'+(pts.length===1?'':'s')+(pk!==''?' · '+PERIODS[+pk].d:'');
  if(pts.length)map.fitBounds(pts.map(([,p])=>[p.ll[1],p.ll[0]]),{padding:[30,30],maxZoom:10})};
 ['mp','mk','ms'].forEach(id=>$('#'+id).addEventListener('input',draw));draw();setTimeout(()=>map.invalidateSize(),100)}
