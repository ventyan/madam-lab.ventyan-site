/* ===== [РАЗДЕЛ: настройки] ===== */
const FB='https://star-novel-6c2f2-default-rtdb.firebaseio.com'; /* та же база, что у сайта про новеллу */
const PFX='pelle/';                                              /* все данные этого сайта лежат под pelle/ */
const AS='sn-salt-v1',AN='ventyan',AH='5f4a6a741666883124dc5d3371004d486f35ad00b5f6c75abf5f6664f3a06d96'; /* вход пользователей — как на сайте про новеллу */
const PAGE=document.body.dataset.page||'index';
/* ===== [РАЗДЕЛ: МЕНЮ] — один массив. Новый раздел-файл = одна строка: [имя файла без .html, значок, название] ===== */
const SECTIONS=[['index','🦇','Главная'],['world','🌊','Мир и виды'],['chars','👥','Персонажи'],['diary','📔','Дневник'],['gallery','🖼','Галерея']];
/* ===== [РАЗДЕЛ: помощники] ===== */
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),ID=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const gd=u=>{const m=/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=|thumbnail\?id=)([\w-]+)/.exec(u||'');return m?'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1600':u}; /* ссылки Google Диска → картинка */
const sha=async x=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(AS+x)))].map(b=>b.toString(16).padStart(2,'0')).join('');
function toast(m){const t=$('#toast');t.textContent=m;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,2600)}
/* ===== [РАЗДЕЛ: база pelle/] каждая запись — отдельный адрес pelle/<коллекция>/<id>; общих больших блоков нет ===== */
const fb=async(p,m,b)=>{try{const r=await fetch(FB+'/'+p+'.json',{method:m||'GET',cache:'no-store',body:b===undefined?undefined:JSON.stringify(b)});if(!r.ok)throw new Error('fb '+r.status);const j=await r.json();netSet(true);return j}catch(e){netSet(false);throw e}};
const CACHE={};
let QUICK=false; /* QUICK=true — первый быстрый кадр: рисуем из стартовых данных, не ждём базу */
async function all(c){let db={};if(!QUICK){try{db=await fb(PFX+c)||{}}catch(e){toast('Нет связи с базой — показаны стартовые данные')}}
 const sd=(DATA[c]||[]).map((s,i)=>({o:i,...s,...(db[s.id]||{})})),ids=new Set(sd.map(s=>s.id)),ex=Object.entries(db).filter(([id])=>!ids.has(id)).map(([id,v])=>({...v,id}));
 return CACHE[c]=[...sd,...ex].filter(x=>ED()||!x.del).sort((a,b)=>(a.o??99)-(b.o??99))}
const put=(c,o)=>fb(PFX+c+'/'+o.id,'PUT',o);
const delRec=async(c,id)=>{(DATA[c]||[]).some(s=>s.id==id)?await fb(PFX+c+'/'+id,'PATCH',{del:1}):await fb(PFX+c+'/'+id,'DELETE')};
/* ===== [РАЗДЕЛ: пользователи] общая база пользователей сайта про новеллу (site/users), пароль проверяется тем же способом ===== */
let me=null;try{me=JSON.parse(localStorage.getItem('pl_me'))}catch{}
const ED=()=>!!(me&&me.adm&&sessionStorage.getItem('pl_ed')=='1');
async function login(n,p){const h=await sha(p);let U=[];try{const d=await fb('site/users');U=d&&d.v?JSON.parse(d.v):[]}catch{toast('Нет связи с базой');return}
 if(n.toLowerCase()==AN){let ah=AH;try{const a=await fb('site/adm');if(a&&a.v)ah=JSON.parse(a.v).h||AH}catch{}if(h!=ah)return toast('Неверный логин или пароль');me={n:AN,adm:1}}
 else{const u=U.find(x=>x.n==n);if(!u||u.h!=h)return toast('Неверный логин или пароль');me={n,adm:['admin','owner'].includes(u.role)?1:0}}
 localStorage.setItem('pl_me',JSON.stringify(me));closeD();boot2()}
/* ===== [РАЗДЕЛ: индикатор «онлайн» и «в сети: N»] как на сайте про новеллу: связь с базой + отметки присутствия site/pres/<имя> ===== */
let ONL=0;
function netSet(ok){const n=document.getElementById('net');if(!n)return;n.className=ok?'ok':'bad';n.textContent=ok?'● онлайн'+(ONL?' · в сети: '+ONL:''):'● нет связи';n.title='Нажмите, чтобы проверить связь заново'}
const pk=n=>n.replace(/[.$#\[\]\/]/g,'_');
async function presTick(){if(me){try{await fb('site/pres/'+encodeURIComponent(pk(me.n)),'PUT',Date.now())}catch{}}
 try{const P=await fb('site/pres')||{};ONL=Object.values(P).filter(t=>Date.now()-t<90000).length;netSet(true)}catch{}}
/* ===== [РАЗДЕЛ: окно «войти или зарегистрироваться»] своё для этого сайта; аккаунты общие с сайтом про новеллу (site/users) ===== */
async function loadUsers(){const d=await fb('site/users');return d&&d.v?JSON.parse(d.v):[]}
async function register(n,p){n=n.trim();if(n.length<2||p.length<6)return toast('Логин от 2 символов, пароль от 6');
 let U;try{U=await loadUsers()}catch{return toast('Нет связи с базой')}
 if(n.toLowerCase()==AN||U.some(u=>u.n.toLowerCase()==n.toLowerCase()))return toast('Этот логин занят');
 U.push({id:Math.max(1000,...U.map(u=>u.id||0))+1,n,t:Date.now(),h:await sha(p),av:'🙂',c:'#b23fe0',bio:'',role:'user'});
 try{await fb('site/users','PUT',{v:JSON.stringify(U)});await fb('ver/users','PUT',Date.now()+'.'+ID().slice(-4))}catch{return toast('Не удалось создать аккаунт')}
 me={n,adm:0};localStorage.setItem('pl_me',JSON.stringify(me));closeD();boot2();toast('Аккаунт создан. Добро пожаловать!')}
const authHTML=()=>`<p class="mu">Один аккаунт на все вселенные Madam Labs.</p><div class="fl"><button class="btn" id="tl">Войти</button><button class="btn s" id="tr">Регистрация</button></div><div class="fl" style="margin-top:10px"><input id="ln" placeholder="Логин"><input id="lp" type="password" placeholder="Пароль (от 6 символов)"></div><p><button class="btn" id="lg">Войти</button> <button class="btn s" id="gs">Продолжить гостем</button></p>`;
function authBind(){let rg=0;const set=r=>{rg=r;$('#lg').textContent=r?'Создать аккаунт':'Войти';$('#tl').className='btn'+(r?' s':'');$('#tr').className='btn'+(r?'':' s')};
 $('#tl').onclick=()=>set(0);$('#tr').onclick=()=>set(1);$('#gs').onclick=closeD;$('#lg').onclick=()=>rg?register($('#ln').value,$('#lp').value):login($('#ln').value.trim(),$('#lp').value)}
function welcome(){if(me||sessionStorage.getItem('pl_wel')||$('#dlg').open)return;sessionStorage.setItem('pl_wel','1');openD('🦇 Добро пожаловать в мир Пэлле',authHTML());authBind()}
/* ===== [РАЗДЕЛ: оболочка страницы] шапка, меню, окно, дождь ===== */
const ST=document.createElement('style');ST.textContent='#rain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:var(--rain,.2);background:repeating-linear-gradient(105deg,transparent 0 14px,#9cc4ee55 14px 15px);animation:rn .6s linear infinite}@keyframes rn{to{background-position:-30px 60px}}#rain.off{display:none}.zn{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}.zn button{border:1.5px solid var(--ln);background:var(--li);color:var(--ink);border-radius:var(--r);padding:14px 8px;font:600 14px Onest;cursor:pointer}.zn button.on{border-color:var(--p)}.sp3{border:1.5px dashed var(--p);background:var(--li);color:var(--ink);border-radius:14px;padding:12px;width:100%;cursor:pointer;font:600 14px Onest}.fl{display:flex;gap:8px;flex-wrap:wrap}.ad{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.k{display:block;margin:8px 0}.k input,.k textarea,.k select{width:100%}';document.head.appendChild(ST);
function shell(){document.body.insertAdjacentHTML('beforeend','<div id="rain" class="'+(localStorage.getItem('pl_rain')=='0'?'off':'')+'"></div><header><button class="gear" id="usr" aria-label="Профиль">👤</button><button class="gear" id="rb" style="right:66px" aria-label="Дождь">🌧</button><div class="w"><h1 id="ttl">🦇 Пэлле и Вася</h1><p id="sub">Вампиры, оборотни и вечность</p></div></header><nav><div class="w" id="nav" role="tablist"></div></nav><div class="w"><main id="m"></main></div><dialog id="dlg"><div class="mh"><b id="dt"></b><button class="btn x" id="dx" aria-label="Закрыть">✕</button></div><div id="mb" style="padding:14px 18px 20px"></div></dialog><div id="toast"></div><div id="net" class="wait" role="status">● подключаюсь…</div>');
 $('#dx').onclick=closeD;$('#usr').onclick=userD;$('#rb').onclick=()=>{const r=$('#rain');r.classList.toggle('off');localStorage.setItem('pl_rain',r.classList.contains('off')?'0':'1')}}
const openD=(t,h)=>{$('#dt').textContent=t;$('#mb').innerHTML=h;const d=$('#dlg');d.open||d.showModal()},closeD=()=>{const d=$('#dlg');d.open&&d.close()};
let CFG={}; /* настройки сайта из базы (pelle/cfg/main): название, тема, вкладки */
async function navDraw(){let pg=[];try{pg=await all('pages')}catch{}const T=CFG.tabs||{},cur=new URLSearchParams(location.search).get('id');
 const L=[...SECTIONS.map((s,i)=>({k:s[0],h:s[0]+'.html',i:s[1],n:s[2],on:s[0]==PAGE,o:i})),...pg.filter(x=>!x.del).map((x,i)=>({k:'p:'+x.id,h:'page.html?id='+x.id,i:x.e||'📄',n:x.t,on:PAGE=='page'&&cur==x.id,o:50+(x.o??i)}))]
  .map(x=>{const t=T[x.k]||{};return{...x,i:t.i||x.i,n:t.n||x.n,o:t.o??x.o,hid:!!t.h&&x.k!='index'}}).filter(x=>!x.hid||ED()).sort((a,b)=>a.o-b.o);
 $('#nav').innerHTML=L.map(x=>`<a class="t" href="${x.h}" ${x.on?'aria-current=page':''} title="${esc(x.n)}" ${x.hid?'style="opacity:.45"':''}><span class="ti">${x.i}</span><span class="tl">${esc(x.n)}</span></a>`).join('')}
/* ===== [РАЗДЕЛ: редактор сайта] кнопки админа, универсальная форма, оформление ===== */
const FIELDS={chars:[['n','Имя'],['role','Роль'],['sp','Вид'],['e','Эмодзи-портрет'],['img','Портрет (ссылка, можно с Google Диска)'],['d','Описание','a'],['f','Подробности: «Метка: текст» на каждой строке','a'],['q','Цитата'],['o','Порядок (число)','n']],
 species:[['n','Название'],['e','Значок'],['place','Где живут'],['t','Описание','a'],['secret','Скрытое (спойлер)','a'],['o','Порядок','n']],
 diary:[['t','Заголовок'],['d','Дата','d'],['cat','Рубрика'],['x','Текст','a'],['img','Картинка (ссылка)']],
 gallery:[['u','Картинка (ссылка, можно с Google Диска)'],['c','Подпись']],
 pages:[['t','Название раздела'],['e','Значок'],['x','Текст','a'],['o','Порядок в меню','n']]};
const adm=(c,o)=>ED()?`<div class="ad"><button class="btn s" data-a="ed" data-c="${c}" data-id="${o.id}">✏</button><button class="btn s" data-a="hd" data-c="${c}" data-id="${o.id}">${o.del?'👁 вернуть':'🗑 убрать'}</button></div>`:'';
const addBtn=c=>ED()?`<div class="c"><button class="btn" data-a="ed" data-c="${c}" data-id="">+ Добавить</button></div>`:'';
function editD(c,id){const o=(CACHE[c]||[]).find(x=>x.id==id)||{id:ID()};
 openD(id?'Правка':'Новая запись',FIELDS[c].map(([k,l,t])=>`<label class="k">${l}${t=='a'?`<textarea data-f="${k}" rows="4">${esc(o[k]||'')}</textarea>`:`<input data-f="${k}" type="${t=='n'?'number':t=='d'?'date':'text'}" value="${esc(o[k]??'')}">`}</label>`).join('')+`<button class="btn" id="sv">Сохранить</button>`);
 $('#sv').onclick=async()=>{const v={};document.querySelectorAll('[data-f]').forEach(i=>v[i.dataset.f]=i.type=='number'?(i.value===''?null:+i.value):i.value);v.del=null;const n={...o,...v};delete n.del;try{await put(c,n);closeD();toast('Сохранено');show()}catch{toast('Не удалось сохранить (правила базы)')}}}
function userD(){if(!me)return openD('🦇 Вход в мир Пэлле',authHTML()),authBind();
 openD('👤 '+me.n,`<p class="mu">${me.adm?'Администратор':'Читатель'}</p>${me.adm?`<p><button class="btn" id="em">${ED()?'✔ Режим редактора включён — выключить':'✏ Включить режим редактора'}</button></p><p><button class="btn s" id="se">🛠 Админка сайта: оформление, вкладки, люди, доступ</button></p>`:''}<p><button class="btn s" id="lo">Выйти</button></p>`);
 $('#lo').onclick=()=>{localStorage.removeItem('pl_me');sessionStorage.removeItem('pl_ed');location.reload()};
 if(me.adm){$('#em').onclick=()=>{sessionStorage.setItem('pl_ed',ED()?'0':'1');location.reload()};$('#se').onclick=()=>adminD()}}
/* ===== [РАЗДЕЛ: админка сайта] 4 вкладки: оформление, вкладки меню, люди, доступ и копия данных ===== */
const PRES={fog:['Туманный берег',{bg:'#0a1017',sf:'#121b26',ink:'#e8eef5',mu:'#8ea2b8',li:'#1c2a3a',ln:'#26384d',p:'#c01a3a',o:'#6f92b8',v:'#25405e'}],
 blood:['Кровь и сталь',{bg:'#12060a',sf:'#1e0b12',ink:'#f6e9ec',mu:'#b99aa3',li:'#2d1119',ln:'#3d1a25',p:'#e0243f',o:'#8a1f3a',v:'#4a0f1f'}],
 moon:['Лунный лес',{bg:'#08130f',sf:'#102019',ink:'#e8f5ee',mu:'#8fb3a2',li:'#183226',ln:'#21443a',p:'#7fd1a8',o:'#4f9a86',v:'#1f5a4a'}],
 dusk:['Фиолетовые сумерки',{bg:'#120a1f',sf:'#1c1230',ink:'#efe8fb',mu:'#a99bc9',li:'#2a1d47',ln:'#38275c',p:'#a56bff',o:'#6f92b8',v:'#3b2a7a'}],
 pale:['Бледный рассвет',{bg:'#eef2f6',sf:'#ffffff',ink:'#1b2430',mu:'#5b6b7d',li:'#e0e8f0',ln:'#c9d5e1',p:'#b3122f',o:'#4f7399',v:'#25405e'}]};
/* применить настройки к странице (c — объект настроек; без аргумента берём из базы) */
async function applyCfg(c){if(!c){try{c=await fb(PFX+'cfg/main')||{}}catch{c={}}CFG=c}
 const s=document.documentElement.style,pr=PRES[c.pr]?c.pr:'fog',V=PRES[pr][1];for(const k in V)s.setProperty('--'+k,V[k]);
 if(pr!='fog')s.setProperty('--g',`linear-gradient(120deg,${V.p}cc,${V.v} 60%,${V.bg})`);else s.removeProperty('--g');
 if(c.p)s.setProperty('--p',c.p);if(c.o)s.setProperty('--o',c.o);if(c.bg)s.setProperty('--bg',c.bg);
 if(c.r!=null)s.setProperty('--r',c.r+'px');if(c.f)s.setProperty('--hf',"'"+c.f+"'");if(c.rain!=null)s.setProperty('--rain',c.rain);
 if(c.t)$('#ttl').textContent=c.t;if(c.s)$('#sub').textContent=c.s;
 const h=document.querySelector('header');if(h){h.style.backgroundImage=c.hi?`linear-gradient(#0009,#0009),url("${gd(c.hi).replace(/"/g,'')}")`:'';h.style.backgroundSize='cover';h.style.backgroundPosition='center'}
 let u=$('#pcu');if(!u){u=document.createElement('style');u.id='pcu';document.head.appendChild(u)}u.textContent=c.css||''}
async function adminD(t){t=t||'look';const NV=[['look','🎨 Оформление'],['tabs','🗂 Вкладки'],['usr','👥 Люди'],['data','💾 Доступ и копия']];
 openD('🛠 Админка Пэлле',`<div class="fl">${NV.map(([k,l])=>`<button class="btn ${k==t?'':'s'}" data-t="${k}">${l}</button>`).join('')}</div><div id="ab" style="margin-top:12px">загрузка…</div>`);
 document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>adminD(b.dataset.t));
 try{CFG=await fb(PFX+'cfg/main')||{}}catch{}
 ({look:adminLook,tabs:adminTabs,usr:adminUsers,data:adminData})[t](CFG)}
const saveCfg=async c=>{await fb(PFX+'cfg/main','PUT',c);CFG=c};
function adminLook(c){const pr=PRES[c.pr]?c.pr:'fog',V=PRES[pr][1],F=['Playfair Display','Onest','Georgia'];
 $('#ab').innerHTML=`<h3>Готовые темы</h3><div class="zn">${Object.entries(PRES).map(([k,v])=>`<button data-pr="${k}" class="${k==pr?'on':''}">${v[0]}</button>`).join('')}</div>
 <label class="k">Название<input id="ct" value="${esc(c.t||'')}" placeholder="🦇 Пэлле и Вася"></label><label class="k">Подзаголовок<input id="cs" value="${esc(c.s||'')}"></label>
 <div class="fl"><label>Акцент <input type="color" id="cp" value="${c.p||V.p}"></label><label>Второй <input type="color" id="co" value="${c.o||V.o}"></label><label>Фон <input type="color" id="cb" value="${c.bg||V.bg}"></label></div>
 <label class="k">Шрифт заголовков<select id="cf">${F.map(f=>`<option ${c.f==f?'selected':''}>${f}</option>`).join('')}</select></label>
 <label class="k">Скругление углов<input type="range" id="cr" min="4" max="32" value="${c.r??16}"></label>
 <label class="k">Дождь на фоне (0 — выключен)<input type="range" id="cn" min="0" max="60" value="${Math.round((c.rain??.22)*100)}"></label>
 <label class="k">Картинка в шапке (ссылка, можно с Google Диска)<input id="ch" value="${esc(c.hi||'')}"></label>
 <label class="k">Свой CSS (для продвинутых)<textarea id="cc" rows="3">${esc(c.css||'')}</textarea></label>
 <div class="fl"><button class="btn" id="sv2">Сохранить</button><button class="btn s" id="rs">Сбросить оформление</button></div>`;
 const rd=()=>({...c,pr,t:$('#ct').value,s:$('#cs').value,p:$('#cp').value!=V.p?$('#cp').value:null,o:$('#co').value!=V.o?$('#co').value:null,bg:$('#cb').value!=V.bg?$('#cb').value:null,f:$('#cf').value,r:+$('#cr').value,rain:+$('#cn').value/100,hi:$('#ch').value.trim(),css:$('#cc').value});
 $('#ab').oninput=()=>applyCfg(rd());
 document.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{const n={...rd(),pr:b.dataset.pr,p:null,o:null,bg:null};applyCfg(n);adminLook(n)});
 $('#sv2').onclick=async()=>{try{await saveCfg(rd());toast('Оформление сохранено')}catch{toast('Не удалось сохранить (правила базы)')}};
 $('#rs').onclick=async()=>{if(!confirm('Сбросить оформление к стартовому?'))return;await saveCfg({tabs:c.tabs||{}});location.reload()}}
async function adminTabs(c){let pg=[];try{pg=await all('pages')}catch{}const T=c.tabs||{};
 const rows=[...SECTIONS.map((s,i)=>({k:s[0],i:s[1],n:s[2],o:i,fixed:s[0]=='index'})),...pg.map((x,i)=>({k:'p:'+x.id,i:x.e||'📄',n:x.t,o:50+(x.o??i),pid:x.id}))];
 $('#ab').innerHTML=`<p class="mu">Скрытая вкладка пропадает из меню у всех (в режиме редактора вы видите её бледной). Порядок — по возрастанию числа. Свои разделы можно удалить совсем (🗑).</p>${rows.map(r=>{const t=T[r.k]||{};return `<div class="fl" data-k="${r.k}" style="align-items:center;margin:6px 0"><input class="ti2" style="width:56px" value="${esc(t.i||r.i)}"><input class="tn2" style="flex:1;min-width:120px" value="${esc(t.n||r.n)}"><input class="to2" type="number" style="width:70px" value="${t.o??r.o}">${r.fixed?'<span class="mu">всегда</span>':`<label><input type="checkbox" class="th2" ${t.h?'checked':''}> скрыть</label>`}${r.pid?`<button class="btn s" data-del="${r.pid}">🗑</button>`:''}</div>`}).join('')}<div class="fl"><button class="btn s" id="np">+ Новый раздел</button><button class="btn" id="svt">Сохранить вкладки</button></div>`;
 $('#np').onclick=()=>{closeD();editD('pages','')};
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(!confirm('Удалить раздел?'))return;await delRec('pages',b.dataset.del);adminD('tabs');navDraw()});
 $('#svt').onclick=async()=>{const tabs={};document.querySelectorAll('[data-k]').forEach(r=>{const h=r.querySelector('.th2');tabs[r.dataset.k]={i:r.querySelector('.ti2').value,n:r.querySelector('.tn2').value,o:+r.querySelector('.to2').value,h:h&&h.checked?1:null}});
  try{await saveCfg({...c,tabs});toast('Вкладки сохранены');navDraw()}catch{toast('Не удалось сохранить')}}}
async function adminUsers(){let U=[],P={};try{U=await loadUsers();P=await fb('site/pres')||{}}catch{}
 $('#ab').innerHTML=`<p class="mu">Аккаунты общие со всеми вселенными. Роли (модератор, администратор) выдаются в админке сайта про новеллу.</p>${U.map(u=>`<div class="fl" style="margin:6px 0"><b style="flex:1">${esc(u.n)}</b><span class="tag">${esc(u.role||'user')}</span><span class="mu">${Date.now()-(P[pk(u.n)]||0)<90000?'🟢 в сети':''}</span></div>`).join('')||'<p class="mu">Пока никого.</p>'}`}
async function adminData(){let open=0;try{open=await fb(PFX+'cfg/open')}catch{}
 $('#ab').innerHTML=`<h3>🔓 Доступ</h3><p class="mu">Сейчас вход ${open?'<b>открыт для всех</b> (пароль не спрашивается)':'<b>закрыт паролем</b>'}. Пароль на статическом сайте — «дверь для своих», а не настоящая защита.</p><button class="btn" id="op">${open?'Закрыть паролем':'Открыть для всех'}</button><hr><h3>💾 Копия данных Пэлле</h3><div class="fl"><button class="btn s" id="ex">Скачать копию</button><label class="btn s">Восстановить из файла<input type="file" id="im" accept=".json" hidden></label></div>`;
 $('#op').onclick=async()=>{try{await fb(PFX+'cfg/open','PUT',open?0:1);toast(open?'Вход закрыт паролем':'Сайт открыт для всех');adminData()}catch{toast('Не удалось сохранить')}};
 $('#ex').onclick=async()=>{const d=await fb(PFX.replace(/\/$/,'')),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d||{})],{type:'application/json'}));a.download='pelle-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click()};
 $('#im').onchange=async e=>{const f=e.target.files[0];if(!f||!confirm('Заменить все данные Пэлле содержимым файла?'))return;try{await fb(PFX.replace(/\/$/,''),'PUT',JSON.parse(await f.text()));toast('Восстановлено');setTimeout(()=>location.reload(),800)}catch{toast('Файл не подошёл')}}}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const d=b.dataset;
 if(d.a=='ed')editD(d.c,d.id);
 if(d.a=='hd'){const o=(CACHE[d.c]||[]).find(x=>x.id==d.id);if(o&&o.del)await fb(PFX+d.c+'/'+d.id,'PATCH',{del:null});else await delRec(d.c,d.id);show()}
 if(VA[d.a])VA[d.a](b)});
/* ===== [РАЗДЕЛ: запуск] ===== */
const show=async q=>{if(q){QUICK=true;try{$('#m').innerHTML=await VIEWS[PAGE]()}catch{}QUICK=false}$('#m').innerHTML=await VIEWS[PAGE]();VA.after&&VA.after()};
function boot2(q){const u=$('#usr');u.textContent=me?(ED()?'✏':'👤'):'👤';return show(q)}
async function boot(){shell();$('#net').onclick=presTick;const first=boot2(true);applyCfg().then(navDraw);presTick();setInterval(presTick,30000);await first;setTimeout(welcome,500)}
