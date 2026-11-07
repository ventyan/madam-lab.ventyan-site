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
const fb=async(p,m,b)=>{const r=await fetch(FB+'/'+p+'.json',{method:m||'GET',cache:'no-store',body:b===undefined?undefined:JSON.stringify(b)});if(!r.ok)throw new Error('fb '+r.status);return r.json()};
const CACHE={};
async function all(c){let db={};try{db=await fb(PFX+c)||{}}catch(e){toast('Нет связи с базой — показаны стартовые данные')}
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
/* ===== [РАЗДЕЛ: оболочка страницы] шапка, меню, окно, дождь ===== */
const ST=document.createElement('style');ST.textContent='#rain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:var(--rain,.2);background:repeating-linear-gradient(105deg,transparent 0 14px,#9cc4ee55 14px 15px);animation:rn .6s linear infinite}@keyframes rn{to{background-position:-30px 60px}}#rain.off{display:none}.zn{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}.zn button{border:1.5px solid var(--ln);background:var(--li);color:var(--ink);border-radius:var(--r);padding:14px 8px;font:600 14px Onest;cursor:pointer}.zn button.on{border-color:var(--p)}.sp3{border:1.5px dashed var(--p);background:var(--li);color:var(--ink);border-radius:14px;padding:12px;width:100%;cursor:pointer;font:600 14px Onest}.fl{display:flex;gap:8px;flex-wrap:wrap}.ad{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.k{display:block;margin:8px 0}.k input,.k textarea,.k select{width:100%}';document.head.appendChild(ST);
function shell(){document.body.insertAdjacentHTML('beforeend','<div id="rain" class="'+(localStorage.getItem('pl_rain')=='0'?'off':'')+'"></div><header><button class="gear" id="usr" aria-label="Профиль">👤</button><button class="gear" id="rb" style="right:66px" aria-label="Дождь">🌧</button><div class="w"><h1 id="ttl">🦇 Пэлле и Вася</h1><p id="sub">Вампиры, оборотни и вечность</p></div></header><nav><div class="w" id="nav" role="tablist"></div></nav><div class="w"><main id="m"></main></div><dialog id="dlg"><div class="mh"><b id="dt"></b><button class="btn x" id="dx" aria-label="Закрыть">✕</button></div><div id="mb" style="padding:14px 18px 20px"></div></dialog><div id="toast"></div>');
 $('#dx').onclick=closeD;$('#usr').onclick=userD;$('#rb').onclick=()=>{const r=$('#rain');r.classList.toggle('off');localStorage.setItem('pl_rain',r.classList.contains('off')?'0':'1')}}
const openD=(t,h)=>{$('#dt').textContent=t;$('#mb').innerHTML=h;const d=$('#dlg');d.open||d.showModal()},closeD=()=>{const d=$('#dlg');d.open&&d.close()};
async function navDraw(){let pg=[];try{pg=await all('pages')}catch{}
 $('#nav').innerHTML=[...SECTIONS.map(s=>[s[0]+'.html',s[1],s[2],s[0]==PAGE]),...pg.filter(p=>!p.del).map(p=>['page.html?id='+p.id,p.e||'📄',p.t,PAGE=='page'&&new URLSearchParams(location.search).get('id')==p.id])].map(([h,i,n,on])=>`<a class="t" href="${h}" ${on?'aria-current=page':''} title="${esc(n)}"><span class="ti">${i}</span><span class="tl">${esc(n)}</span></a>`).join('')}
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
function userD(){if(!me)return openD('Вход','<p class="mu">Войдите аккаунтом с сайта про новеллу.</p><div class="fl"><input id="ln" placeholder="Логин"><input id="lp" type="password" placeholder="Пароль"></div><p><button class="btn" id="lg">Войти</button></p>'),$('#lg').onclick=()=>login($('#ln').value.trim(),$('#lp').value);
 openD('👤 '+me.n,`<p class="mu">${me.adm?'Администратор':'Читатель'}</p>${me.adm?`<p><button class="btn" id="em">${ED()?'✔ Режим редактора включён — выключить':'✏ Включить режим редактора'}</button></p><p><button class="btn s" id="se">🎨 Редактор сайта: название, цвета, новый раздел</button></p>`:''}<p><button class="btn s" id="lo">Выйти</button></p>`);
 $('#lo').onclick=()=>{localStorage.removeItem('pl_me');sessionStorage.removeItem('pl_ed');location.reload()};
 if(me.adm){$('#em').onclick=()=>{sessionStorage.setItem('pl_ed',ED()?'0':'1');location.reload()};$('#se').onclick=siteD}}
async function siteD(){let c={};try{c=await fb(PFX+'cfg/main')||{}}catch{}
 openD('🎨 Редактор сайта',`<label class="k">Название<input id="ct" value="${esc(c.t||'')}"></label><label class="k">Подзаголовок<input id="cs" value="${esc(c.s||'')}"></label><div class="fl"><label>Акцент <input type="color" id="cp" value="${c.p||'#c01a3a'}"></label><label>Второй <input type="color" id="co" value="${c.o||'#6f92b8'}"></label><label>Фон <input type="color" id="cb" value="${c.bg||'#0a1017'}"></label></div><p><button class="btn" id="cv">Сохранить оформление</button></p><hr><p><button class="btn s" id="np">+ Новый раздел сайта</button></p>`);
 $('#cv').onclick=async()=>{await fb(PFX+'cfg/main','PUT',{t:$('#ct').value,s:$('#cs').value,p:$('#cp').value,o:$('#co').value,bg:$('#cb').value});toast('Сохранено');location.reload()};$('#np').onclick=()=>editD('pages','')}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;const d=b.dataset;
 if(d.a=='ed')editD(d.c,d.id);
 if(d.a=='hd'){const o=(CACHE[d.c]||[]).find(x=>x.id==d.id);if(o&&o.del)await fb(PFX+d.c+'/'+d.id,'PATCH',{del:null});else await delRec(d.c,d.id);show()}
 if(VA[d.a])VA[d.a](b)});
async function applyCfg(){let c={};try{c=await fb(PFX+'cfg/main')||{}}catch{}const s=document.documentElement.style;if(c.t)$('#ttl').textContent=c.t;if(c.s)$('#sub').textContent=c.s;if(c.p)s.setProperty('--p',c.p);if(c.o)s.setProperty('--o',c.o);if(c.bg)s.setProperty('--bg',c.bg)}
/* ===== [РАЗДЕЛ: запуск] ===== */
const show=async()=>{$('#m').innerHTML=await VIEWS[PAGE]();VA.after&&VA.after()};
function boot2(){const u=$('#usr');u.textContent=me?(ED()?'✏':'👤'):'👤';show()}
async function boot(){shell();boot2();navDraw();applyCfg()}
