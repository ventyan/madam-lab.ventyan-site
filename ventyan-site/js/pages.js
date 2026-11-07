/* ============================================================
   25. РАЗДЕЛЫ-КОНСТРУКТОР  [КОД: разделы]
   Админ создаёт новый раздел сайта прямо в браузере: ⚙ → «Разделы сайта» → «Создать».
   Раздел хранится в базе (site/pages) и открывается через page.html?s=имя. Менять файлы не нужно.
   Раздел = набор БЛОКОВ (текст, картинка, галерея, кнопки, цитата, отсчёт, вопросы, лента, видео, готовый виджет сайта).
   Новый тип блока: 1) строка в PGT  2) поля в BF  3) функция в BR.
   ============================================================ */
const pgBy=k=>S.pages.find(p=>'c:'+p.id==k);
const pageUrl=k=>k=='home'?'home.html':k.startsWith('c:')?'page.html?s='+encodeURIComponent((pgBy(k)||{}).slug||k.slice(2)):k+'.html';
const pgOK=k=>{const p=pgBy(k);return !!p&&!p.hide&&p.acc!='adm'&&!(p.acc=='users'&&!me)&&!(p.until&&p.until>dk(Date.now()))};
function syncCustom(){for(let i=TABS.length-1;i>=0;i--)if(TABS[i][0].startsWith('c:'))TABS.splice(i,1);const at=TABS.findIndex(t=>t[0]=='profile');S.pages.forEach((p,n)=>TABS.splice(at+n,0,['c:'+p.id,p.i||'📄',p.n||'Раздел']))}
function resolveCustom(){if(document.body.dataset.page!='custom')return;const s=new URLSearchParams(location.search).get('s')||'',p=S.pages.find(x=>(x.slug||x.id)==s)||S.pages.find(x=>x.id==s);tab=p?'c:'+p.id:'c:?'}
const pageTitle=()=>{const T=S.theme.title,p=pgBy(tab),d=TABS.find(x=>x[0]==tab),t=p?p.n:d&&tab!='home'?((S.cfg.tabs[tab]||{}).n||d[2]):'';return t?T+' · '+t:T};
/* переход на другую страницу: сначала дописываем несохранённое, потому что страница перезагрузится */
const flushAll=()=>Promise.all(Object.keys(PN).map(k=>{clearTimeout(tm[k]);return flush(k)})).catch(()=>{});
async function goto(k,flash,extra){if(k==tab&&!extra){render();flash&&toast(flash);return}await flushAll();if(flash)sessionStorage.setItem('sn_flash',flash);location.href=pageUrl(k)+(extra||'')}
document.addEventListener('click',e=>{const a=e.target.closest('a.t');if(a&&Object.keys(PN).length){e.preventDefault();flushAll().then(()=>location.href=a.href)}});
/* после загрузки: открыть персонажа / показать сообщение / вернуть музыку / прокрутить к якорю */
function bootHooks(){resolveCustom();if(tab=='cast'){const c=sessionStorage.getItem('sn_cid');if(c){cid=c;sessionStorage.removeItem('sn_cid')}}}
function afterBoot(){const f=sessionStorage.getItem('sn_flash');if(f){sessionStorage.removeItem('sn_flash');setTimeout(()=>toast(f),300)}
 if(sessionStorage.getItem('sn_edit')){sessionStorage.removeItem('sn_edit');if(ed){pgo[tab]=true;render()}}
 plUp();plResume();if(location.hash.length>1)setTimeout(()=>{const e=document.getElementById(decodeURIComponent(location.hash.slice(1)));e&&e.scrollIntoView({behavior:'smooth',block:'center'})},250)}
/* музыка не обрывается при переходе между страницами: запоминаем трек и секунду, а продолжаем (если браузер разрешит) */
addEventListener('pagehide',()=>{try{const a=au();if(qi>=0&&Q[qi]&&a.src)sessionStorage.setItem('sn_pl',J({id:Q[qi].id,t:a.currentTime,p:!a.paused,v:a.volume}))}catch{}});
function plResume(){let s;try{s=JSON.parse(sessionStorage.getItem('sn_pl'))}catch{}if(!s)return;Q=trk();qi=Q.findIndex(t=>t.id==s.id);if(qi<0)return;const a=au();a.preload='metadata';plLoad(true);a.volume=s.v==null?.7:s.v;$('#plv').value=a.volume*100;
 a.addEventListener('loadedmetadata',()=>{a.currentTime=s.t||0;if(s.p)a.play().catch(()=>{})},{once:true})}

/* ---- типы блоков ---- */
const PGT=[['text','📝 Текст'],['head','🔠 Заголовок'],['image','🖼 Картинка'],['gallery','🖼 Галерея'],['links','🔗 Кнопки-ссылки'],['quote','❝ Цитата'],['count','⏳ Обратный отсчёт'],['faq','❓ Вопросы и ответы'],['time','🕰 Лента событий'],['video','▶ Видео YouTube'],['widget','🧩 Готовый виджет сайта']];
const WID=[['dev','🚀 Состояние разработки'],['goals','🎯 Цели'],['hero','🌟 Большой блок главной'],['home','🏠 Главная целиком'],['cast','👥 Персонажи'],['mus','🎵 Музыка'],['polls','🗳 Опросы'],['arch','📡 Архив'],['diary','📔 Дневник'],['forum','💬 Форум'],['vault','🗂 Хранилище'],['script','📜 Сценарий'],['rev','⭐ Отзывы'],['ach','🏅 Достижения'],['top','🏆 Рейтинг'],['fun','🎲 Игры']];
const BF={text:[['x','Текст (**жирный**, ~~зачёркнутый~~, ||спойлер||, ссылки сами станут кликабельными)','a']],head:[['x','Заголовок'],['s','Подпись под ним (необязательно)']],
 image:[['u','Картинка','i'],['cap','Подпись']],gallery:[['us','Ссылки на картинки — каждая с новой строки','ln']],links:[['ls','Кнопки: «Название|ссылка», по строке на кнопку','ln']],
 quote:[['x','Цитата','a'],['a','Автор']],count:[['x','Что отсчитываем'],['d','Дата','d'],['e','Что написать, когда день настал']],faq:[['q','«Вопрос|Ответ» — по строке','ln']],
 time:[['tl','«Дата|событие» — по строке','ln']],video:[['u','Ссылка на видео YouTube']],widget:[['w','Какой виджет','s',WID]]};
const sUrl=u=>{u=String(u||'').trim();return /^(https?:\/\/|#|[\w-]+\.html)/i.test(u)?u:''};
const ytId=u=>{const m=String(u||'').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/))([\w-]{11})/);return m?m[1]:''};
const WG={dev:()=>DEV(),goals:()=>GOALS(),hero:()=>HERO()};
const BR={
 text:b=>`<div class="c post"><p>${ln(b.x||'')}</p></div>`,
 head:b=>`<h2 style="margin:22px 4px 6px">${esc(b.x||'')}</h2>${b.s?`<p class="mu" style="margin:0 4px 10px">${esc(b.s)}</p>`:''}`,
 image:b=>b.u?`<div class="c" style="text-align:center"><img src="${esc(gd(b.u))}" alt="" loading="lazy" style="max-width:100%;border-radius:16px">${b.cap?`<p class="mu" style="margin:8px 0 0">${esc(b.cap)}</p>`:''}</div>`:'',
 gallery:b=>(b.us||[]).length?`<div class="c"><div class="ag">${b.us.map(u=>`<img src="${esc(gd(u))}" alt="" loading="lazy">`).join('')}</div></div>`:'',
 links:b=>(b.ls||[]).length?`<div class="c"><div class="f">${b.ls.map(l=>{const[t,...r]=l.split('|'),u=sUrl(r.join('|'));return u?`<a class="btn s" href="${esc(u)}" ${/^https?:/i.test(u)?'target="_blank" rel="noopener"':''}>${esc(t)}</a>`:''}).join('')}</div></div>`:'',
 quote:b=>`<div class="c"><blockquote class="qt" style="margin:0">${ln(b.x||'')}</blockquote>${b.a?`<p class="mu" style="text-align:right;margin:6px 0 0">— ${esc(b.a)}</p>`:''}</div>`,
 count:b=>{const n=b.d?Math.ceil((new Date(b.d+'T00:00')-Date.now())/864e5):null;return `<div class="c" style="text-align:center"><div class="mu">${esc(b.x||'До события')}</div><div style="font:700 46px var(--hf),sans-serif">${n==null?'—':n>0?n:'🎉'}</div><div class="mu">${n==null?'укажите дату':n>0?'дн.':esc(b.e||'Уже наступило!')}</div></div>`},
 faq:b=>(b.q||[]).map(l=>{const[q,...r]=l.split('|');return `<details class="c"><summary><b>${esc(q)}</b></summary><p style="margin:8px 0 0">${ln(r.join('|'))}</p></details>`}).join(''),
 time:b=>(b.tl||[]).length?`<div class="c"><div class="tlc">${b.tl.map(l=>{const[d,...r]=l.split('|');return `<div style="margin:12px 0"><b>${esc(d)}</b><div>${ln(r.join('|'))}</div></div>`}).join('')}</div></div>`:'',
 video:b=>{const id=ytId(b.u);return id?`<div class="c"><div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${id}" loading="lazy" allowfullscreen title="Видео"></iframe></div></div>`:''},
 widget:b=>{const f=WG[b.w||'dev']||V[b.w];return f?f():'<div class="c mu">Виджет не найден</div>'}};
V.custom=()=>{const p=pgBy(tab);if(!p)return `<div class="c"><h3>🔍 Раздел не найден</h3><p class="mu">Он скрыт, ещё не открыт или удалён.</p><a class="btn" href="index.html">На главную</a></div>`;
 return `<h2 style="margin:0 4px 12px">${esc(p.i||'')} ${esc(p.n||'')}</h2>${p.d?`<p class="mu" style="margin:-6px 4px 14px">${esc(p.d)}</p>`:''}`+((p.blocks||[]).map(b=>(BR[b.t]||(()=>''))(b)).join('')||`<div class="c"><p class="mu">Здесь пока пусто.${ed?' Нажмите ⚙ вверху страницы и добавьте блоки.':''}</p></div>`)};
/* ---- редактор блоков (⚙ на странице раздела; виден только админам) ---- */
const CPG=k=>k&&k.startsWith('c:')&&pgBy(k)?()=>pgEd(k):null;
const pgOpts=[['all','Всем'],['users','Только вошедшим'],['adm','Только админам']];
const pgEd=k=>{const i=S.pages.findIndex(p=>'c:'+p.id==k),p=S.pages[i],F=(f,l,ty,op)=>`<label class="k" style="width:100%">${l}${EF('pages.'+i+'.'+f,p[f],ty,op)}</label>`;
 return `<div class="c"><h3>Сам раздел</h3><div class="f">${F('i','Значок')}${F('n','Название')}</div>${F('d','Описание под названием')}<div class="f">${F('slug','Адрес (латиница, например lore)')}${F('acc','Кто видит','s',pgOpts)}${F('until','Открыть с даты (до неё скрыт)','d')}</div><p class="mu">Ссылка: <b>${esc(pageUrl(k))}</b></p></div>`
 +(p.blocks||[]).map((b,j)=>`<div class="c"><div class="f"><b>${esc((PGT.find(t=>t[0]==b.t)||[0,b.t])[1])}</b><span style="flex:1"></span><button class="btn s" data-a="bMv" data-v="${p.id}" data-j="${j}" data-d="-1">↑</button><button class="btn s" data-a="bMv" data-v="${p.id}" data-j="${j}" data-d="1">↓</button><button class="btn x" data-a="bDel" data-v="${p.id}" data-j="${j}">🗑</button></div>${(BF[b.t]||[]).map(([f,l,ty,op])=>`<label class="k" style="width:100%">${l}${EF('pages.'+i+'.blocks.'+j+'.'+f,b[f],ty,op)}</label>`).join('')}</div>`).join('')
 +`<div class="c"><h3>➕ Добавить блок</h3><div class="f">${PGT.map(t=>`<button class="btn s" data-a="bAdd" data-v="${p.id}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div></div>`};
MKN.pages=()=>({id:ID(),n:'Новый раздел',i:'📄',d:'',slug:'',acc:'all',until:'',blocks:[]});
const PTPL={blank:{n:'Пустой раздел',i:'📄',blocks:[]},
 news:{n:'Новости',i:'📢',blocks:[{t:'head',x:'Последние новости',s:'Что происходит в проекте'},{t:'time',tl:['1 января|Первая новость','15 января|Вторая новость']},{t:'text',x:'Подписывайтесь, чтобы не пропустить обновления!'}]},
 lore:{n:'Мир и лор',i:'🌌',blocks:[{t:'head',x:'О мире',s:'Всё, что нужно знать читателю'},{t:'text',x:'Опишите мир, его правила и историю.'},{t:'faq',q:['Где происходит действие?|Опишите место.','Кто главные герои?|Коротко о героях.']},{t:'widget',w:'cast'}]},
 about:{n:'О проекте',i:'💫',blocks:[{t:'head',x:'О проекте'},{t:'text',x:'Расскажите, что это за проект и зачем он.'},{t:'count',x:'До релиза',d:'',e:'Релиз состоялся!'},{t:'links',ls:['Telegram|https://t.me/']}]}};
Object.assign(M,{pg(){return `<div class="c"><h3>➕ Новый раздел сайта</h3><p class="mu">Раздел появится в меню и получит свою страницу. Блоки (текст, картинки, готовые виджеты вроде опросов, музыки, персонажей) добавляются на самой странице через ⚙ вверху.</p><div class="f"><select id="pt">${Object.entries(PTPL).map(([k,t])=>`<option value="${k}">${t.i} ${t.n}</option>`).join('')}</select><button class="btn" data-a="pnew">Создать раздел</button></div></div>`
 +(S.pages.map((p,i)=>`<div class="c"><div class="f"><b>${esc(p.i||'📄')} ${esc(p.n)}</b>${p.hide?'<span class="tag">скрыт</span>':''}${p.acc&&p.acc!='all'?`<span class="tag">${p.acc=='adm'?'только админам':'только вошедшим'}</span>`:''}<span style="flex:1"></span><a class="btn s" href="${esc(pageUrl('c:'+p.id))}">Открыть и править</a></div><div class="f"><label class="k">Значок${EF('pages.'+i+'.i',p.i)}</label><label class="k" style="flex:1">Название${EF('pages.'+i+'.n',p.n)}</label></div><div class="f"><button class="btn s" data-a="emv" data-v="pages" data-i="${i}" data-d="-1">↑</button><button class="btn s" data-a="emv" data-v="pages" data-i="${i}" data-d="1">↓</button><button class="btn s" data-a="etg" data-v="pages" data-i="${i}" data-f="hide">👁 Скрыть/показать</button><button class="btn x" data-a="edel" data-v="pages" data-i="${i}">🗑 Удалить</button></div></div>`).join('')||'<p class="mu">Своих разделов пока нет.</p>')}});
Object.assign(A,{
 bAdd(b){const p=S.pages.find(x=>x.id==b.dataset.v);if(!p)return;(p.blocks=p.blocks||[]).push({id:ID(),t:b.dataset.t,...(b.dataset.t=='widget'?{w:'dev'}:{})});save('pages');render()},
 bMv(b){const p=S.pages.find(x=>x.id==b.dataset.v),i=+b.dataset.j,j=i+ +b.dataset.d;if(!p||j<0||j>=p.blocks.length)return;[p.blocks[i],p.blocks[j]]=[p.blocks[j],p.blocks[i]];save('pages');render()},
 bDel(b){cf(b,()=>{const p=S.pages.find(x=>x.id==b.dataset.v);p.blocks.splice(+b.dataset.j,1);save('pages');render()})},
 async pnew(){const t=PTPL[($('#pt')||{}).value]||PTPL.blank,p={...MKN.pages(),n:t.n,i:t.i,blocks:t.blocks.map(x=>({...x,id:ID()}))};S.pages.push(p);syncCustom();save('pages');await flushAll();sessionStorage.setItem('sn_edit','1');$('#dlg').open&&$('#dlg').close();goto('c:'+p.id)}});
document.addEventListener('change',e=>{const d=e.target.dataset;if(d&&d.e&&d.e.startsWith('pages.'))setTimeout(render,0)});
{const f=render;render=function(){syncCustom();f();document.title=pageTitle()}}
