/* ===== [РАЗДЕЛ: страницы] VIEWS[имя страницы] возвращает HTML; VA — действия кнопок (data-a) ===== */
const VA={},byD=(a,b)=>(b.d||'')>(a.d||'')?1:-1,para=t=>esc(t).replace(/\n/g,'<br>');
const PT=o=>`<div class="pt big" ${o.img?`style="background-image:url(${esc(gd(o.img))})"`:''}>${o.img?'':esc(o.e||'🦇')}</div>`;
const facts=f=>(f||'').split('\n').filter(Boolean).map(l=>{const i=l.indexOf(':');return i>0?`<p style="margin:6px 0"><b>${esc(l.slice(0,i))}:</b> ${esc(l.slice(i+1).trim())}</p>`:`<p>${esc(l)}</p>`}).join('');
const SPC=s=>`<div class="c" id="${s.id}">${adm('species',s)}<h3>${s.e||''} ${esc(s.n)}</h3>${s.place?`<span class="tag">📍 ${esc(s.place)}</span>`:''}<p>${para(s.t||'Описание пока не написано.')}</p>${s.secret?`<button class="sp3" data-a="sec">🔒 Скрытое знание — нажмите, чтобы открыть</button><p hidden>${para(s.secret)}</p>`:''}</div>`;
const VIEWS={
/* ---- ГЛАВНАЯ: приветствие, герои, карта города, тест «Кто ты в этом городе?», последняя запись ---- */
async index(){const ch=await all('chars'),df=(await all('diary')).sort(byD)[0];
 return `<div class="c" style="text-align:center"><h2>🦇 Пэлле и Вася</h2><p style="max-width:36em;margin:10px auto">${esc(DATA.intro)}</p><div class="fl" style="justify-content:center"><a class="btn" href="world.html">🌊 Исследовать мир</a><a class="btn s" href="chars.html">👥 Персонажи</a></div></div>
 <div class="g">${ch.map(c=>`<a class="c" href="chars.html#${c.id}" style="text-decoration:none;color:inherit;text-align:center;margin:0">${PT(c)}<h3>${esc(c.n)}</h3><span class="mu">${esc(c.role||'')}</span></a>`).join('')}</div>
 <div class="c" style="margin-top:16px"><h3>🗺 Карта города</h3><p class="mu">Город чётко поделён между видами нечисти. Нажмите на район.</p><div class="zn">${DATA.zones.map((z,i)=>`<button data-a="zn" data-i="${i}">${z[0]}<br>${z[1]}</button>`).join('')}</div><p id="zi" class="mu" style="margin-top:10px"></p></div>
 <div class="c"><h3>🔮 Кто ты в этом городе?</h3>${DATA.quiz.map((q,i)=>`<p><b>${q[0]}</b></p>${q[1].map(o=>`<label style="display:block;margin:4px 0"><input type="radio" name="q${i}" value="${o[1]}"> ${o[0]}</label>`).join('')}`).join('')}<p><button class="btn" data-a="quiz">Узнать</button></p><div id="qr"></div></div>
 ${df?`<div class="c"><h3>📔 Последняя запись дневника</h3><b>${esc(df.t)}</b><p class="mu">${esc((df.x||'').slice(0,160))}</p><a class="btn s" href="diary.html">Читать</a></div>`:''}
 <p class="mu" style="text-align:center"><span data-a="eye" style="cursor:pointer">👁</span></p>`},
/* ---- МИР И ВИДЫ ---- */
async world(){return DATA.world.map(w=>`<div class="c"><h3>${w[0]} ${w[1]}</h3><p>${esc(w[2])}</p></div>`).join('')+`<h2 style="margin:18px 0 10px">Виды нечисти</h2>`+addBtn('species')+(await all('species')).map(SPC).join('')},
/* ---- ПЕРСОНАЖИ ---- */
async chars(){return addBtn('chars')+(await all('chars')).map(c=>`<div class="c" id="${c.id}" style="${c.del?'opacity:.5':''}"><div class="fl" style="align-items:center;gap:18px">${PT(c)}<div><h2>${esc(c.n)}</h2><span class="tag">${esc(c.role||'')}</span>${c.sp?`<span class="tag">${esc(c.sp)}</span>`:''}</div></div><p>${para(c.d||'Описание пока не написано.')}</p>${facts(c.f)}<blockquote class="qt">${c.q?'«'+esc(c.q)+'»':'<span class="mu">Цитата пока не написана.</span>'}</blockquote>${adm('chars',c)}</div>`).join('')},
/* ---- ДНЕВНИК РАЗРАБОТКИ (лайки и комментарии: отдельная запись на каждого человека) ---- */
async diary(){const L=(await all('diary')).sort(byD);let lk={},cm={};try{lk=await fb(PFX+'likes')||{};cm=await fb(PFX+'comments')||{}}catch{}
 return addBtn('diary')+L.map(p=>{const l=lk[p.id]||{},cs=Object.entries(cm[p.id]||{}).sort((a,b)=>a[1].t-b[1].t);
 return `<div class="c post"><h3>${esc(p.t)}</h3><div class="mu">${p.d||''} ${p.cat?`<span class="tag">${esc(p.cat)}</span>`:''}</div><p>${para(p.x)}</p>${p.img?`<img src="${esc(gd(p.img))}" alt="" style="max-width:100%;border-radius:14px">`:''}
 <div class="fl"><button class="btn s" data-a="lk" data-id="${p.id}">${me&&l[me.n]?'❤':'🤍'} ${Object.keys(l).length||''}</button></div>
 ${cs.map(([k,c])=>`<div class="rp"><b>${esc(c.a)}</b> <span class="mu">${new Date(c.t).toLocaleDateString('ru')}</span><div>${esc(c.x)}</div>${me&&(me.adm||me.n==c.a)?`<button class="btn x" data-a="dcm" data-id="${p.id}" data-k="${k}">удалить</button>`:''}</div>`).join('')}
 ${me?`<div class="fl"><input id="cm${p.id}" placeholder="Комментарий…" style="flex:1"><button class="btn s" data-a="cm" data-id="${p.id}">Отправить</button></div>`:'<p class="mu">Войдите (👤), чтобы ставить ❤ и комментировать.</p>'}${adm('diary',p)}</div>`}).join('')},
/* ---- ГАЛЕРЕЯ ---- */
async gallery(){const L=await all('gallery');return addBtn('gallery')+`<div class="g">${L.map(g=>`<div class="c" style="margin:0"><img src="${esc(gd(g.u))}" alt="" loading="lazy">${g.c?`<p class="mu">${esc(g.c)}</p>`:''}${adm('gallery',g)}</div>`).join('')||[1,2,3].map(()=>'<div class="c" style="margin:0;text-align:center"><div style="font-size:48px">🖼</div><p class="mu">Заглушка: здесь будет арт</p></div>').join('')}</div>`},
/* ---- РАЗДЕЛ, СОЗДАННЫЙ В РЕДАКТОРЕ САЙТА ---- */
async page(){const id=new URLSearchParams(location.search).get('id'),p=(await all('pages')).find(x=>x.id==id);if(!p)return '<div class="c"><p>Раздел не найден.</p></div>';document.title=p.t;return `<div class="c"><h2>${p.e||''} ${esc(p.t)}</h2><p>${para(p.x)}</p>${adm('pages',p)}</div>`}};
Object.assign(VA,{
sec(b){b.hidden=true;b.nextElementSibling.hidden=false},
zn(b){const z=DATA.zones[+b.dataset.i];document.querySelectorAll('.zn button').forEach(x=>x.classList.toggle('on',x==b));$('#zi').innerHTML=`<b>${z[0]} ${z[1]} — ${z[2]}.</b> ${z[3]}`},
async quiz(){const c={};DATA.quiz.forEach((q,i)=>{const r=document.querySelector(`[name=q${i}]:checked`);r&&(c[r.value]=(c[r.value]||0)+1)});const k=Object.keys(c).sort((a,b)=>c[b]-c[a])[0];if(!k)return toast('Ответьте хотя бы на один вопрос');const s=(await all('species')).find(x=>x.id==k)||DATA.species.find(x=>x.id==k);$('#qr').innerHTML=`<div class="c" style="background:var(--bg)"><h3>${s.e} ${esc(s.n)}</h3><p>${esc(s.t)}</p></div>`},
eye(){VA.n=(VA.n||0)+1;if(VA.n>=5){VA.n=0;toast('Зрачки сужаются в тонкие щепки… 🐍')}},
async lk(b){if(!me)return toast('Войдите, чтобы ставить ❤');const u=encodeURIComponent(me.n),p=PFX+'likes/'+b.dataset.id+'/'+u,cur=await fb(p);cur?await fb(p,'DELETE'):await fb(p,'PUT',1);show()},
async cm(b){const x=$('#cm'+b.dataset.id).value.trim();if(!x)return;await fb(PFX+'comments/'+b.dataset.id+'/'+ID(),'PUT',{a:me.n,x:x.slice(0,500),t:Date.now()});show()},
async dcm(b){await fb(PFX+'comments/'+b.dataset.id+'/'+b.dataset.k,'DELETE');show()}});
