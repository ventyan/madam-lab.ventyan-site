/* ===== ЯДРО САЙТА: инструменты, данные, темы, роли, вход, синхронизация, окно настроек, кнопки (разделы 1–14 старого index.html) ===== */
/* ============================================================
   1. БАЗОВЫЕ ИНСТРУМЕНТЫ  [КОД: служебное] — короткие помощники (esc, даты, размеры)
   ============================================================ */
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const U=n=>window.claude?window.claude.use(n).catch(()=>null):Promise.resolve(null);
const fd=t=>new Date(t).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}),sz=n=>n>1e6?(n/1e6).toFixed(1)+' МБ':Math.ceil(n/1e3)+' КБ';
/* ============================================================
   2. ДАННЫЕ САЙТА  [КОД: хранилище] — всё, что сайт запоминает (записи, пользователи, отметки, стена…)
   ============================================================ */
const S={pages:[],seen:{},wall:{},marks:{},builds:[],diary:[],cal:{},vault:[],users:[],cfg:{vis:['diary','script','rev'],tabs:{},ban:'',foot:''},forum:[],stk:[],adm:{},
 script:{chars:[{id:'n',n:'Рассказчик',v:'',c:'#6a2fd0'},{id:'c1',n:'Вентян',v:'v',c:'#ff4fa3'}],rows:[{s:'c1',t:''}]},
 theme:{p:'rose',f:'Unbounded',r:24,title:'звёздная новелла',ov:{},bf:'Onest',fs:16,w:980,hp:44,hi:'',css:'',sub:'Дневник разработки визуальной новеллы «История бездарной куклы»'}};
/* ============================================================
   3. ТЕМЫ ОФОРМЛЕНИЯ  [КОД: темы] — готовые цветовые наборы
   ============================================================ */
const PRE={rose:{n:'Розовый рассвет',bg:'#1e0b2e',sf:'#2c1745',ink:'#fbeaf5',mu:'#c9aedc',li:'#3d2263',ln:'#4a2a73',p:'#ff4fa3',o:'#b23fe0',v:'#6a2fd0'},
night:{n:'Сливовая ночь',bg:'#140720',sf:'#241238',ink:'#fbeaf5',mu:'#c3a6d8',li:'#35205a',ln:'#442a6b',p:'#ff6fb5',o:'#c05cf0',v:'#7c4dff'},
lav:{n:'Лаванда',bg:'#15132b',sf:'#211e42',ink:'#ece8ff',mu:'#b0a8dc',li:'#342f66',ln:'#3d3877',p:'#9b7bff',o:'#7b5cf0',v:'#4b3fc4'},
cher:{n:'Вишня',bg:'#2a0c18',sf:'#3a1424',ink:'#ffe8ee',mu:'#d9a5b8',li:'#5a1f38',ln:'#6a2a45',p:'#ff3d6e',o:'#d02a6a',v:'#8a1f66'},
mint:{n:'Мята и слива',bg:'#0d2420',sf:'#153530',ink:'#eafff8',mu:'#9fcfc2',li:'#1f4a42',ln:'#285a50',p:'#2cc8a0',o:'#7a4fd0',v:'#5b2fa0'}};
/* ============================================================
   4. ВКЛАДКИ САЙТА  [КОД: вкладки] — список: [ключ, значок, название]. Новая вкладка = строка здесь + функция в разделе 11
   ============================================================ */
const TABS=[['home','🏠','Главная'],['diary','📔','Дневник'],['arch','📡','Архив'],['cast','👥','Персонажи'],['mus','🎵','Музыка'],['polls','🗳','Решают читатели'],['forum','💬','Форум'],['vault','🗂','Хранилище'],['script','📜','Сценарий'],['rev','⭐','Отзывы'],['ach','🏅','Достижения'],['top','🏆','Рейтинг'],['fun','🎲','Игры'],['profile','👤','Профиль']],FN=['Unbounded','Comfortaa','Playfair Display','Onest','Nunito','Caveat','Pacifico'];
const tn=k=>{const d=TABS.find(t=>t[0]==k)||[k,'📄','Раздел'],o=S.cfg.tabs[k]||{};return (o.i||d[1])+' '+(o.n||d[2])},vis=k=>ed||k=='profile'||(k.startsWith('c:')?pgOK(k):S.cfg.vis.includes(k));
let mt='prof',ft=false;
const BN=['linear-gradient(120deg,#ff4fa3,#6a2fd0)','linear-gradient(120deg,#ffb02e,#ff4fa3)','linear-gradient(120deg,#27b6a0,#4aa3ff)','linear-gradient(120deg,#4aa3ff,#b23fe0)','linear-gradient(120deg,#ff3d6e,#ffb02e)'],BNN=['Закат','Золото','Мята','Космос','Огонь'];
const FORT=['Сегодня кукла улыбнётся тебе в самый неожиданный момент 🎎','Новый спрайт уже рисуется, жди сюрприз ✨','Лучше сохраниться перед важным выбором 💾','Звёзды говорят: напиши отзыв, автору будет приятно ⭐','Одна из концовок скрыта там, где ты не ищешь 🗝','Сегодня удачный день для чтения дневника 📔','Кукла не бездарна, она просто ещё не нашла свою сцену 🎭','Тебя ждёт тёплый комментарий от автора 💌','Не бойся плохой концовки: из неё родится лучшая 🌙','Музыка из будущей главы уже звучит где-то рядом 🎵'];
const stat=n=>({l:S.diary.filter(p=>(p.lk||[]).includes(n)).length,c:S.diary.reduce((a,p)=>a+(p.cm||[]).filter(c=>c.a==n).length,0)+S.forum.reduce((a,p)=>a+(p.r||[]).filter(r=>r.a==n).length,0),f:S.forum.filter(p=>p.a==n).length});


/* ============================================================
   5. РОЛИ И ПОЛНОМОЧИЯ  [КОД: роли]
   owner = Владелец (вы), admin = Администратор, mod = Модератор, user = обычный
   Менять роли может только Владелец (вкладка «Люди и роли» в администрировании).
   ============================================================ */
const ROLES={owner:['👑','Владелец сайта','всё: роли, пароль, резервные копии и все права администратора'],admin:['🛡','Администратор','редактирование сайта: записи, вкладки, оформление, хранилище, сценарий'],mod:['🔨','Модератор','удаление сообщений на форуме и комментариев'],user:['🙂','Пользователь','лайки, комментарии, форум, отзывы, профиль, игры']};
const rl=n=>n==AN?'owner':((S.users.find(u=>u.n==n)||{}).role||'user');
function sync(){if(typeof syncCustom=='function')syncCustom();const g=document.querySelector('.gear[data-a=gear]'),bl=document.querySelector('.gear.bell');if(g){g.hidden=!me;if(bl)bl.style.right=me?'':'16px'}const r=me?rl(me.n):'user';ed=r=='owner'||r=='admin';mod=ed||r=='mod';own=r=='owner'}  /* пересчёт прав: ed = может редактировать сайт, mod = может модерировать, own = Владелец */
/* ============================================================
   [КОД: дневник] категории записей, фильтр, поиск, реакции, спойлеры
   ============================================================ */
const DC=[['all','Все'],['code','💻 Код'],['art','🎨 Арт'],['story','📜 Сюжет'],['snd','🎵 Музыка'],['game','🎮 Игра'],['idea','💡 Идея'],['news','📢 Новости'],['rel','🚀 Релиз'],['life','🌙 Разное']],DCK=Object.fromEntries(DC.map(c=>[c[0],c[1]])),RXE=['🔥','🥰','😂','😭','👏','🤔'];
let dfc='all',dq='';
const rt=t=>Math.max(1,Math.round(String(t||'').split(/\s+/).length/200));
const mdx=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/~~(.+?)~~/g,'<s>$1</s>').replace(/\|\|(.+?)\|\|/g,'<span class="sp" data-a="sp">$1</span>');
const DLIST=()=>S.diary.map((p,i)=>({p,i})).filter(({p})=>(dfc=='all'||p.k==dfc)&&(!dbm||bmo('d'+p.t))&&(!dq||(p.ti+' '+p.tx).toLowerCase().includes(dq.toLowerCase()))).sort((a,b)=>(b.p.pin?1:0)-(a.p.pin?1:0));
const streak=()=>{let best=0,cur=0,prev=null;Object.keys(S.cal).sort().forEach(k=>{const t=Date.parse(k);cur=prev&&t-prev==864e5?cur+1:1;prev=t;best=Math.max(best,cur)});return best};
const DFILT=()=>`<div class="c"><div class="f">${DC.map(c=>`<button class="btn ${dfc==c[0]?'':'s'}" data-a="dfc" data-v="${c[0]}">${c[1]}</button>`).join('')}</div><div class="f"><input id="dqs" value="${esc(dq)}" placeholder="🔎 Поиск по дневнику (Enter)"></div><p class="mu" style="margin:0">📔 записей: ${S.diary.length} · ✍️ слов: ${S.diary.reduce((a,p)=>a+String(p.tx||'').split(/\s+/).filter(Boolean).length,0)} · 🔥 лучшая серия рабочих дней: ${streak()}</p></div>`;
const RX=(p,i)=>`<div class="f">${RXE.map(e=>{const l=(p.rx||{})[e]||[];return `<button class="btn s rx ${me&&l.includes(me.n)?'on':''}" data-a="rx" data-i="${i}" data-v="${e}">${e} ${l.length||''}</button>`}).join('')}</div>`;
/* ============================================================
   [КОД: профиль] рамки аватара, день рождения, окно просмотра чужого профиля (PV)
   ============================================================ */
const FR=[['','без рамки'],['gold','золотая'],['rainbow','радужная'],['neon','неон'],['pink','розовое сияние']];
const eg=u=>u.eggs||(u.eg?['ttl']:[]);
const bdn=b=>{if(!b)return null;const t=new Date(),T=new Date(t.getFullYear(),t.getMonth(),t.getDate()),d=new Date(b+'T00:00'),n=new Date(T.getFullYear(),d.getMonth(),d.getDate());if(n<T)n.setFullYear(T.getFullYear()+1);return Math.round((n-T)/864e5)};
const PV=(n,self)=>{const full=self||(!!me&&isFr(me.n,n)),u=UI(n),fc=S.script.chars.find(c=>c.id==u.fc),ea=earned(n),xp=xpOf(n),mx=u.lv>=MAXL,hb=u.hb||[],ht=u.ht||[],r=ROLES[rl(n)],bd=bdn(u.bd),w=(S.wall||{})[n]||[],
 fo=FORT[(+dk(Date.now()).replace(/-/g,'')+[...n].reduce((a,c)=>a+c.charCodeAt(0),0))%FORT.length],ch=(i,x)=>x?`<span class="tag">${i} ${x}</span>`:'',
 bl=BG.map((b,i)=>({b,i})).filter(o=>full?true:ea[o.i]&&!hb.includes(o.i)),tl=TT.map((t,i)=>({t,i})).filter(o=>tOK(n,o.i)&&(full||!ht.includes(o.i)));
 return `<div class="c" style="padding:0;overflow:hidden"><div style="aspect-ratio:4/1;min-height:90px;background:${u.bi?`url(${esc(u.bi)}) center/cover`:BN[u.bn||0]}"></div><div style="padding:0 20px 20px;margin-top:-42px;text-align:center">${AV(u.av).replace('class="av"',`class="av${u.fr?' fr-'+u.fr:''}" style="width:84px;height:84px;font-size:44px;margin:0;border:4px solid var(--sf)"`)}<h3 style="color:${esc(u.c||'inherit')}">${esc(n)} ${esc(u.md||'')}</h3><p style="margin:4px 0"><span class="tag">${r[0]} ${r[1]}</span><span class="tag">${tt(n)}</span></p>${u.st?`<p style="margin:4px 0">${esc(u.st)}</p>`:''}<p class="mu">${esc(u.bio||'Пока без описания')}</p>${u.qt?`<blockquote class="qt">«${esc(u.qt)}»</blockquote>`:''}
 <div>${ch('🎧',u.ms&&esc(u.ms))}${ch('💞',fc&&'Любимый персонаж: '+esc(fc.n))}${ch('🎂',u.bd&&fd(u.bd+'T12:00'))}${bd==null?'':ch('⏳',bd?`до дня рождения ${bd} дн.`:'сегодня день рождения! 🎉')}${ch('📅',u.t&&'С нами с '+fd(u.t))}${ch('📆','заходов: '+(u.vc||0))}${u.lk&&/^https?:\/\//.test(u.lk)?`<a class="tag" href="${esc(u.lk)}" target="_blank" rel="noopener">🔗 ссылка</a>`:''}</div>
 <div>${(u.it||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,8).map(x=>`<span class="tag">#${esc(x)}</span>`).join('')}</div>
 <p class="mu" style="margin-bottom:2px">${mx?`Уровень MAX · ${MAXL} ✨`:`Уровень ${u.lv} · опыт ${xp%5}/5 (лайк +1, комментарий +2, тема +3, отметка +1, предсказание +1; не больше '+XCAP+' опыта в сутки)`}</p><progress max="5" value="${mx?5:xp%5}" style="width:70%;accent-color:var(--p)"></progress><p>💖 ${u.s.l} · 💬 ${u.s.c} · ✍️ ${u.s.f} · 📍 ${u.m}</p>${self?'':FRB(n)}${FRL(n,self,full)}
 ${self?`<div class="f" style="justify-content:center"><button class="btn" data-a="go" data-v="prof">Настройки профиля</button><button class="btn s" data-a="fort">🔮 Предсказание куклы</button><button class="btn x" data-a="logout">Выйти</button></div>${ft?`<p style="background:var(--li);border-radius:16px;padding:12px">${fo}</p>`:''}`:''}</div></div>
 <div class="c"><h3>🏅 Значки: ${full?ea.filter(Boolean).length+'/'+BG.length:bl.length}</h3><div class="bgr">${bl.map(({b,i})=>`<div class="bd ${ea[i]?'':'lock'} ${self&&hb.includes(i)?'off':''}" title="${b[2]}"><span>${b[0]}</span><b>${b[1]}</b>${self&&hb.includes(i)?'<small>🙈 скрыт</small>':''}</div>`).join('')||'<p class="mu">Открытых значков пока нет</p>'}</div><h3 style="margin-top:12px">🎖 Титулы</h3><div>${tl.map(({t})=>`<span class="tag">${t[1]} ${t[2]}</span>`).join('')}</div></div>
 <div class="c"><h3>🧱 Стена гостей</h3><div class="f"><input maxlength="200" placeholder="Написать ${self?'себе':esc(n)}…"><button class="btn s" data-a="addW" data-v="${esc(n)}">Отправить</button></div>${w.slice(0,30).map((m,i)=>`<div class="rp">${who(m.a)} <span class="mu">${fd(m.t)}</span><div>${esc(m.x)}</div>${LKB(m,'w',n,i)}${me&&(mod||me.n==m.a||me.n==n)?`<button class="btn x" data-a="delW" data-v="${esc(n)}" data-i="${i}">Удалить</button>`:''}</div>`).join('')}</div>`};
const SHOW=()=>{const u=UI(me.n),ea=earned(me.n),hb=u.hb||[],ht=u.ht||[];return `<div class="c"><h3>🙈 Витрина значков и титулов</h3><p class="mu">Нажмите, чтобы скрыть или показать. Другие люди увидят в вашем профиле только то, что со знаком ✅.</p><div class="bgr">${BG.map((b,i)=>ea[i]?`<button class="bd ${hb.includes(i)?'off':''}" data-a="tgb" data-k="b" data-i="${i}" title="${b[2]}"><span>${b[0]}</span><b>${b[1]}</b><small>${hb.includes(i)?'🙈 скрыт':'✅ виден'}</small></button>`:'').join('')}</div><div>${TT.map((t,i)=>tOK(me.n,i)?`<button class="btn ${ht.includes(i)?'x':'s'}" style="margin:3px" data-a="tgb" data-k="t" data-i="${i}">${t[1]} ${t[2]} ${ht.includes(i)?'🙈':'✅'}</button>`:'').join('')}</div></div>`};
const PERM=()=>{const r=ROLES[rl(me.n)];return `<div class="c"><h3>${r[0]} Ваша роль: ${r[1]}</h3><p class="mu">Полномочия: ${r[2]}.</p></div>`};
/* ============================================================
   [КОД: пасхалки] 6 секретов: title (7 кликов по названию), sub (3 клика по подзаголовку),
   konami (↑↑↓↓←→←→BA), word (набрать «кукла»), night (зайти в 3 часа ночи), gear (резерв)
   ============================================================ */
function egg(id,msg){boom();toast(msg);if(!me)return;const u=S.users.find(x=>x.n==me.n);if(!u)return;const a=u.eggs=eg(u).slice();if(!a.includes(id)){a.push(id);save('users')}}

/* ============================================================
   5б. УРОВНИ, ЗНАЧКИ, ТИТУЛЫ  [КОД: достижения]
   ============================================================ */
const MAXL=99,MY=()=>{try{return JSON.parse(localStorage.getItem('sn_my'))||{}}catch{return{}}},SMY=m=>localStorage.setItem('sn_my',JSON.stringify(m));
const XCAP=40;/* КОД: лимит опыта — не больше XCAP очков в сутки (остаток засчитывается в следующие дни) */
const xpOf=n=>{const t=stat(n),u=S.users.find(x=>x.n==n)||{},c=t.l+t.c*2+t.f*3+Object.keys((S.marks||{})[n]||{}).length+(u.fo||0);if(me&&n==me.n&&u.n){const td=dk(Date.now());let ch=0;if(u.xm==null){u.xm=c;ch=1}if(u.xd!=td){u.xd=td;u.xg=0;ch=1}const take=Math.min(c-u.xm,XCAP-(u.xg||0));if(take>0){u.xm+=take;u.xg=(u.xg||0)+take;ch=1}if(ch)save('users')}return (u.xm==null?c:u.xm)+(u.xb||0)},/* КОД: опыт = максимум, который игрок когда-либо набрал (xm) + выданный владельцем (xb) */lvl=n=>n==AN?MAXL:Math.min(MAXL,Math.floor(xpOf(n)/5)+1);
const UI=n=>{const u=S.users.find(x=>x.n==n)||{};return{...u,n,s:stat(n),m:Object.keys((S.marks||{})[n]||{}).length,lv:lvl(n),dy:u.t?(Date.now()-u.t)/864e5:0}};
const BG=[['🌱','Новичок','Зарегистрироваться',u=>1],['💖','Первая симпатия','Поставить лайк',u=>u.s.l>=1],['💬','Болтушка','3 комментария',u=>u.s.c>=3],['🗣','Душа компании','15 комментариев',u=>u.s.c>=15],['🌟','Фанат','10 лайков',u=>u.s.l>=10],['💝','Сердце сайта','50 лайков',u=>u.s.l>=50],['✍️','Автор тем','Создать тему на форуме',u=>u.s.f>=1],['📚','Писатель','5 тем на форуме',u=>u.s.f>=5],['🕰','Старожил','Неделя с нами',u=>u.dy>=7],['🏛','Легенда','100 дней с нами',u=>u.dy>=100],['📍','Планировщик','Первая личная отметка',u=>u.m>=1],['🗓','Хронист','10 личных отметок',u=>u.m>=10],['🔮','Гадалка','Предсказание куклы',u=>(u.fo||0)>=1],['🎴','Мистик','10 предсказаний',u=>(u.fo||0)>=10],['🎭','Поклонник','Выбрать любимого персонажа',u=>!!u.fc],['🖼','Модник','Своя аватарка',u=>(u.av||'').startsWith('data:')],['🎂','Именинник','Указать день рождения',u=>!!u.bd],['🔗','Общительный','Добавить ссылку',u=>!!u.lk],['📝','Рассказчик','Заполнить «О себе»',u=>!!u.bio],['🎞','Режиссёр','Свой баннер профиля',u=>!!u.bi],['🎮','Игрок','Сыграть в мини-игру',u=>(u.g||0)>=1],['🧠','Мастер памяти','Выиграть в «Память»',u=>(u.gm||0)>=1],['⭐','Звёздный кликер','50 очков в кликере',u=>(u.gc||0)>=50],['🥚','Пасхалка','Найти секрет на сайте',u=>eg(u).length>=1],['🔝','Уровень 10','Достичь 10 уровня',u=>u.lv>=10],['🚀','Уровень 25','Достичь 25 уровня',u=>u.lv>=25],['💎','Уровень 50','Достичь 50 уровня',u=>u.lv>=50],['👑','Автор сайта','Только создатель',u=>u.n==AN],['📅','Постоянный гость','7 дней заходов',u=>(u.vc||0)>=7],['🏕','Завсегдатай','30 дней заходов',u=>(u.vc||0)>=30],['🧱','Автор стены','Написать на стене в чужом профиле',u=>(u.wl||0)>=1],['🕵','Охотник за секретами','Найти 3 пасхалки',u=>eg(u).length>=3],['🧿','Король пасхалок','Найти все 6 пасхалок',u=>eg(u).length>=6],['💬','Цитатник','Цитата в профиле',u=>!!u.qt],['🎧','Меломан','Указать, что слушаете',u=>!!u.ms],['🏷','Знаток интересов','Указать интересы',u=>!!u.it],['🪞','Рамка','Выбрать рамку аватара',u=>!!u.fr],['🛡','Страж','Роль модератора и выше',u=>['mod','admin','owner'].includes(rl(u.n))],['🌐','Знакомство','Оставить сообщение на стене',u=>(u.wl||0)>=3]];
const earned=n=>{const u=UI(n);return BG.map(b=>n==AN||!!b[3](u))};
const TT=[[1,'🧸','Плюшевый новичок'],[3,'🎀','Подруга куклы'],[5,'🍓','Ягодка'],[8,'🪄','Юный волшебник'],[10,'🎭','Актёр второго плана'],[15,'🦋','Мотылёк сцены'],[20,'🌙','Лунный зритель'],[25,'💫','Звёздный странник'],[30,'🪞','Хранитель зеркал'],[40,'🌈','Радужный рассказчик'],[50,'👸','Принцесса сюжета'],[60,'🗝','Ключник тайн'],[75,'🔮','Оракул кукольного театра'],[99,'👑','Легенда новеллы'],[99,'🎬','Режиссёр судеб',1],[99,'🪄','Повелитель звёзд',1],[99,'🎎','Создатель кукол',1],[99,'🧵','Кукловод',1],[1,'🕵','Охотник за секретами',0,u=>eg(u).length>=3],[1,'🦉','Ночная сова',0,u=>eg(u).includes('night')]];
const tOK=(n,i)=>TT[i][0]<=lvl(n)&&(!TT[i][3]||n==AN)&&(!TT[i][4]||TT[i][4](UI(n))),tdef=n=>{let r=0;TT.forEach((t,i)=>{if(tOK(n,i)&&!t[4])r=i});return r},tt=n=>{const u=S.users.find(x=>x.n==n)||{};let i=u.ti;if(i==null||!TT[i]||!tOK(n,i))i=tdef(n);return TT[i][1]+' '+TT[i][2]};
/* ============================================================
   6. ЭМОДЗИ-ПАЛИТРА, ЛИЧНЫЕ ОТМЕТКИ, ЭФФЕКТЫ, МИНИ-ИГРЫ  [КОД: эмодзи/игры]
   ============================================================ */
const EC=[['😊','😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 😶 😐 😑 😬 🙄 😯 😮 😲 🥱 😴 🤤 😪 😵 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👻 💀 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾'],['❤️','❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 👍 👎 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✋ 🤚 🖐 👋 🤝 🙏 👏 🙌 🤲 💪 ✍️ 💅 🫶 🫰 🫡 🫠'],['🌸','🌸 💮 🌹 🌺 🌻 🌼 🌷 🌱 🌿 🍀 🍁 🍂 🌈 ☀️ 🌙 ⭐ 🌟 ✨ 💫 ⚡ 🔥 ❄️ ☃️ 🌊 🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦄 🐝 🦋 🐌 🐞 🐙 🐬 🐳 🍎 🍓 🍒 🍑 🍉 🍌 🍍 🥝 🍩 🍪 🎂 🍰 🧁 🍫 🍬 🍭 🍿 ☕ 🧋 🍵 🍕 🍔 🍟 🍣 🍜'],['🎨','🎨 🎵 🎶 🎤 🎧 🎹 🎸 🥁 🎬 🎮 👾 🕹 🎲 🧩 🎭 🪄 🔮 🧸 🎀 🎁 🎈 🎉 🎊 🏆 🥇 🏅 📔 📖 📚 ✏️ 🖊 🖌 📝 💻 🖥 📱 ⌨️ 💾 📷 🔑 🗝 💡 🔔 📌 📎 ✂️ 🧪 🧿 💎 👑 💍 👗 🎒 🚀 🛸 🌍 🏠 ⏰ 📅 ✅ ❌ ❓ ❗ 💤 💬 💭']];
const EP=(id,tg)=>`<button class="btn s" data-a="ept" data-v="${id}" type="button">😊 Эмодзи</button><div class="ep" id="ep${id}" hidden><div class="ept">${EC.map((c,i)=>`<button type="button" data-a="epc" data-v="${i}" data-id="${id}">${c[0]}</button>`).join('')}</div>${EC.map((c,i)=>`<div class="epg" data-g="${i}" ${i?'hidden':''}>${c[1].split(' ').map(e=>`<button type="button" data-a="epe" data-v="${e}" data-t="${tg}">${e}</button>`).join('')}</div>`).join('')}</div>`;
const FP=()=>`<div class="fpk">${EP('g','text')}</div>`;
const MK=()=>{if(!me)return '';const m=(S.marks||{})[me.n]||{};return `<div class="c"><h3>📍 Мои отметки</h3><p class="mu">Личные пометки на календаре — видите только вы.</p><div class="f"><input type="date" id="mdt" value="${dk(Date.now())}"><span id="mkp" style="font-size:26px">${mke}</span>${EP('m','mark')}</div><div class="f"><input id="mtx" maxlength="80" placeholder="Что отметить? Например: дедлайн спрайтов"><button class="btn" data-a="addM">Добавить</button></div>${Object.keys(m).sort().reverse().map(d=>`<div class="f"><span>${m[d].e} <b>${fd(d+'T12:00')}</b> — ${esc(m[d].t)}</span><button class="btn x" data-a="delM" data-v="${d}">×</button></div>`).join('')}</div>`};
const LKP=()=>{const my=MY();return `<div class="c"><h3>Тема только для вас</h3><p class="mu">Видна только вам — остальным сайт не меняется.</p>${Object.entries(PRE).map(([k,p])=>`<label class="sw"><input type="radio" name="pp" data-a="mypre" data-v="${k}" ${(my.p||S.theme.p)==k?'checked':''}><span style="background:linear-gradient(135deg,${p.p},${p.v})"></span>${p.n}</label>`).join('')}</div><div class="c"><h3>Размер текста</h3><input type="range" data-my="fs" min="13" max="22" value="${my.fs||S.theme.fs||16}"></div><div class="c"><h3>Эффекты</h3><label><input type="checkbox" data-my="stars" ${my.stars?'checked':''}> ✨ звёздопад на фоне</label><div><button class="btn x" data-a="myx">сбросить мои настройки</button></div></div>`};
function fx(){let c=$('#fx');if(!MY().stars||ed){c&&c.remove();return}if(c)return;c=document.createElement('div');c.id='fx';c.innerHTML=Array.from({length:24},(_,i)=>`<i style="left:${Math.random()*100}%;animation-duration:${6+Math.random()*8}s;animation-delay:-${Math.random()*10}s;font-size:${10+Math.random()*14}px">${['✨','⭐','💫','🌸'][i%4]}</i>`).join('');document.body.append(c)}
function boom(){const c=document.createElement('div');c.className='fxb';c.innerHTML=Array.from({length:40},(_,i)=>`<i style="left:${Math.random()*100}%;animation-duration:${2+Math.random()*2}s;font-size:${16+Math.random()*18}px">${['🎉','✨','🌸','💖','⭐','🎀'][i%6]}</i>`).join('');document.body.append(c);setTimeout(()=>c.remove(),4500)}
const rec=(k,v)=>{if(!me)return;const u=S.users.find(x=>x.n==me.n);if(!u)return;u[k]=k=='gc'?Math.max(u[k]||0,v):(u[k]||0)+1;save('users')};
let mem=null,run=0;const MS=['🧸','🎀','🌸','🦋','🍓','🔮'],BALL=['Да, и кукла улыбается 🎎','Звёзды говорят «нет» 🌑','Спроси после следующей главы 📖','Определённо да ✨','Не стоит рисковать 🗝','Возможно, но сохранись заранее 💾','Кукла загадочно молчит 🤫','Скорее да, чем нет 🌸'];
const memNew=()=>{mem={c:[...MS,...MS].sort(()=>Math.random()-.5),o:[],m:[],mv:0}},memHTML=()=>{if(!mem)memNew();return mem.c.map((e,i)=>{const sh=mem.o.includes(i)||mem.m.includes(i);return `<button class="mc ${sh?'on':''}" data-a="mc" data-i="${i}">${sh?e:'❔'}</button>`}).join('')};
function memDraw(){const g=$('#mg');if(g)g.innerHTML=memHTML();const m=$('#mi');if(m)m.textContent='Ходов: '+mem.mv}
const DEV=()=>{const C=S.cfg,pr=C.pr||{};if(!C.rel&&!Object.values(pr).some(v=>v))return '';const rel=C.rel?Math.ceil((new Date(C.rel+'T00:00')-Date.now())/864e5):null;
 return `<div class="c"><h3>🚀 Состояние разработки</h3>${rel!=null?`<p>${rel>0?`До релиза: <b>${rel}</b> дн. 🎉`:'Релиз состоялся! 🎉'}</p>`:''}${CAT.map(k=>`<div class="mu">${k}: ${pr[k]||0}%</div><progress max="100" value="${pr[k]||0}" style="width:100%;accent-color:var(--p)"></progress>`).join('')}</div>`};
const ACT=[{k:'any',n:'Работала',c:'#ff4fa3'},{k:'code',n:'Код',c:'#6a2fd0'},{k:'art',n:'Рисование',c:'#ffb02e'},{k:'story',n:'Сценарий',c:'#27b6a0'},{k:'snd',n:'Звук',c:'#4aa3ff'}];
const CAT=['Спрайты','Фоны','Музыка','Сценарий','Другое'];
const AN='ventyan',AH='5f4a6a741666883124dc5d3371004d486f35ad00b5f6c75abf5f6664f3a06d96',AS='sn-salt-v1',EMO=['😊','🥰','😴','😭','🔥','✨','💪','🤔','🎨','🎵','💻','🌙'],STK=['🌸','💖','⭐','🎀','🧸','🪄','🍓','👾','🎭','🦋','🌈','💫','😂','😡','🥺','👍'];
const sha=async x=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(AS+x)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const dk=t=>{const x=new Date(t);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')},pk=p=>p.d||dk(p.t);
const rz=(f,m,ty)=>new Promise(r=>{const i=new Image;i.onload=()=>{const k=Math.min(1,m/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL(ty,.78))};i.onerror=()=>r(null);i.src=URL.createObjectURL(f)});
function san(h){const d=new DOMParser().parseFromString(h||'','text/html'),ok='B I U S STRIKE STRONG EM BR DIV P SPAN IMG'.split(' ');(function w(n){[...n.childNodes].forEach(c=>{if(c.nodeType==3)return;if(c.nodeType!=1||/^(SCRIPT|STYLE)$/.test(c.tagName))return c.remove();w(c);if(!ok.includes(c.tagName))return c.replaceWith(...c.childNodes);[...c.attributes].forEach(a=>{if(!(c.tagName=='IMG'&&a.name=='src'))c.removeAttribute(a.name)});if(c.tagName=='IMG'){const u=c.getAttribute('src')||'';if(!/^(data:image\/(png|jpeg|webp);|https:)/.test(u))c.remove();else c.className='stk'==c.dataset.k?'stk':''}})})(d.body);return d.body.innerHTML}
/* ============================================================
   7. ПОЛЬЗОВАТЕЛЬ И ВХОД  [КОД: аккаунт] — me = текущий человек; ed/mod/own = права
   ============================================================ */
let me=null,mk=false,emo='',rg,ae,mke='📌',lf,mod=false,own=false,vpn='';const can=a=>me&&(mod||me.n==a);
function setMe(){try{me=JSON.parse(localStorage.getItem('sn_me'))}catch{me=null}sync()}
const AV=a=>a&&a.startsWith('data:')?`<img class="av" src="${a}" alt="">`:`<span class="av">${esc(a||'🙂')}</span>`;
const who=n=>{const u=S.users.find(x=>x.n==n)||{n};return `<span>${AV(u.av)}${dot(n)}<b class="nm" data-a="vp" data-v="${esc(n)}" style="color:${esc(u.c||'inherit')}">${esc(n)}</b>${rl(n)!='user'?` <span class="tag">${ROLES[rl(n)][0]} ${ROLES[rl(n)][1]}</span>`:''} <small class="mu">${u.at?'@'+esc(u.at)+' · ':''}${tt(n)}</small></span>`};
let db,assets,dl,user,ed=false,R=[],tab=PAGEKEY,cm=new Date(),br='any',vc='Спрайты';
function toast(m){const t=$('#toast');($('#dlg').open?$('#dlg'):document.body).append(t);t.textContent=m;t.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.opacity=0,2600)}
const tm={},PN={},BASE={},BAD={},J=JSON.stringify;let STALE=0;
/* [КОД: онлайн] Как работает синхронизация.
   BASE[k] — последняя версия раздела, которую мы видели в базе. Перед записью берём свежую версию из базы и СЛИВАЕМ три версии
   (то, что было / что стало у вас / что лежит в базе сейчас), поэтому лайки, комментарии и ответы разных людей больше не затирают друг друга. */
const idk=o=>o&&typeof o=='object'&&!Array.isArray(o)?(o.h!==undefined&&o.n!==undefined?'u:'+o.n:(o.id??o.t??o.n??o.k??null)):null;
function mrg(b,l,r){
 if(J(l)===J(b))return r;
 if(J(r)===J(b)||J(l)===J(r))return l;
 const A=Array.isArray;
 if(A(l)&&A(r)){
  const base=A(b)?b:[],all=[...l,...r,...base];
  if(all.every(x=>idk(x)!==null)){
   const mp=a=>new Map(a.map(x=>[idk(x),x])),L=mp(l),Rm=mp(r),B=mp(base),out=[];
   for(const x of r){const k=idk(x);if(L.has(k))out.push(mrg(B.get(k),L.get(k),x));else if(!B.has(k))out.push(x)}
   const nw=l.filter(x=>!Rm.has(idk(x))&&!B.has(idk(x)));
   return l.length&&nw.includes(l[0])?[...nw,...out]:[...out,...nw]}
  if(all.every(x=>typeof x!='object')){
   const add=l.filter(x=>!base.includes(x)),del=base.filter(x=>!l.includes(x));
   return [...r.filter(x=>!del.includes(x)),...add.filter(x=>!r.includes(x))]}
  return l}
 if(l&&r&&typeof l=='object'&&typeof r=='object'&&!A(l)&&!A(r)){
  const bb=b&&typeof b=='object'&&!A(b)?b:{},o={...r};
  for(const k of Object.keys(l))o[k]=mrg(bb[k],l[k],r[k]);
  for(const k of Object.keys(bb))if(!(k in l))delete o[k];
  return o}
 return l}
const pj=v=>v?JSON.parse(v):undefined;
async function ld(k){try{let c=null;if(VER[k]){try{c=JSON.parse(sessionStorage.getItem('sn_c_'+k))}catch{}}/* КОД: кэш — если версия раздела в базе не изменилась, берём копию из этой вкладки браузера */
 if(c&&c.ver===VER[k]&&c.v){BASE[k]=c.v;S[k]=JSON.parse(c.v);delete BAD[k];return 1}
 const d=await db.doc('site/'+k).get();BASE[k]=d.exists?d.data().v:'';if(d.exists)S[k]=JSON.parse(BASE[k]);delete BAD[k];try{if(VER[k]&&d.exists)sessionStorage.setItem('sn_c_'+k,JSON.stringify({ver:VER[k],v:BASE[k]}))}catch{}return 1}catch{BAD[k]=1;return 0}}
function save(k){if(!me)return;if(k=='users')ensId();clearTimeout(tm[k]);PN[k]=1;tm[k]=setTimeout(()=>flush(k),400)}
async function flush(k){
 try{
  if(db&&BAD[k]){const d=await db.doc('site/'+k).get(),rv=d.exists?d.data().v:'';S[k]=rv?mrg(undefined,S[k],pj(rv)):S[k];BASE[k]=rv;delete BAD[k]}/* КОД: раньше при сбое загрузки раздела сохранение молча пропускалось — отсюда «баганые» аккаунты, пропавший опыт и карточки */
   if(!db){localStorage.setItem('sn_'+k,J(S[k]));delete PN[k];return}
  const d=await db.doc('site/'+k).get(),rv=d.exists?d.data().v:'',mine=J(S[k]),m=mrg(pj(BASE[k]),S[k],pj(rv)),v=J(m);
  if(v!==rv)await db.doc('site/'+k).set({v});
  S[k]=J(S[k])===mine?m:mrg(JSON.parse(mine),S[k],m);BASE[k]=v;try{if(VER[k])sessionStorage.setItem('sn_c_'+k,J({ver:VER[k],v}))}catch{}if(v!==mine)STALE=1;
  delete PN[k]
 }catch{toast('Нет связи с базой, попробую сохранить ещё раз');setTimeout(()=>flush(k),5000)}}
/* ============================================================
   8. ЗАПУСК САЙТА  [КОД: старт] — загрузка данных и первая отрисовка
   ============================================================ */
async function init(){
 [db,assets,dl,user]=await Promise.all(['db','assets','downloads','user'].map(U));
 db=await fbInit();assets=null;if(!db)setTimeout(()=>toast('Нет связи с базой: данные сохраняются только в этом браузере'),1500);
 setMe();
 if(db){try{Object.assign(VER,await FBX('ver')||{})}catch{}const bad=(await Promise.all(Object.keys(S).map(ld))).filter(x=>!x).length;if(bad)toast('Часть данных не загрузилась, обновляю…')}else for(const k of Object.keys(S)){let v;try{v=JSON.parse(localStorage.getItem('sn_'+k))}catch{}if(v!=null)S[k]=v}
 sync();if(me){const u=S.users.find(x=>x.n==me.n),t=dk(Date.now());if(u&&u.vl!=t){u.vl=t;u.vc=(u.vc||0)+1;save('users')}}
 if(!S.cfg.v2){S.cfg.v2=1;['ach','top','fun'].forEach(k=>S.cfg.vis.includes(k)||S.cfg.vis.push(k))}
 if(!db&&!localStorage.getItem('sn_theme')&&matchMedia('(prefers-color-scheme:dark)').matches)S.theme.p='night';
 if(!S.cfg.noTest&&!S.users.some(u=>u.n=='test'))S.users.push({n:'test',h:'f55ee4a89a045409f6783d86d9eafc535284113d6e97bf53205e23eb35ce106c',av:'🧸',c:'#ff4fa3',bio:'Тестовый аккаунт',role:'user'});
 seedNew();rtSync();await loadR();bootHooks();theme();fx();render();afterBoot();if(me&&new Date().getHours()==3)setTimeout(()=>egg('night','🦉 Ночная сова: сейчас 3 часа ночи!'),1500)}
async function loadR(){try{R=db?(await db.collection('reviews').get()).docs.map(d=>({id:d.id,...d.data()})):JSON.parse(localStorage.getItem('sn_rev')||'[]')}catch{R=[]}R.sort((a,b)=>b.t-a.t)}
/* ============================================================
   9. ПРИМЕНЕНИЕ ТЕМЫ  [КОД: оформление] — цвета, шрифты, шапка
   ============================================================ */
function theme(){const T=S.theme,s=document.documentElement.style,my=ed?{}:MY();
 for(const[k,v]of Object.entries({...(PRE[my.p||T.p]||PRE.rose),...(my.p?{}:T.ov||{})}))if(k!='n')s.setProperty('--'+k,v);
 s.setProperty('--r',T.r+'px');s.setProperty('--hf',"'"+T.f+"'");s.setProperty('--bf',"'"+(T.bf||'Onest')+"','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji'");s.setProperty('--fs',(my.fs||T.fs||16)+'px');s.setProperty('--w',(T.w||980)+'px');
 const h=$('header');h.style.background=T.hi?`linear-gradient(#0005,#0005),url("${T.hi}") center/cover`:'';h.style.padding=`${T.hp||44}px 0 ${(T.hp||44)+26}px`;
 let c=$('#cu');if(!c){c=document.createElement('style');c.id='cu';document.head.append(c)}c.textContent=T.css||'';
 $('#ttl').textContent=T.title;$('#sub').textContent=T.sub;document.title=pageTitle()}
async function upl(f,cat){
 if(assets){try{const r=await assets.upload(f);return{id:r.id,n:f.name,ty:f.type,sz:f.size}}catch(e){toast('Облако не принимает такой тип файла. Используйте ссылку.');return null}}
 if(f.size>9e5){toast('Без облака принимаются файлы до 900 КБ');return null}
 return new Promise(r=>{const fr=new FileReader();fr.onload=()=>r({data:fr.result,n:f.name,ty:f.type,sz:f.size});fr.readAsDataURL(f)})}
const gd=u=>{u=String(u||'').trim();const m=u.match(/drive\.google\.com\/file\/(?:u\/\d+\/)?d\/([\w-]+)/)||u.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]+)/)||u.match(/docs\.google\.com\/uc\?(?:[^#]*&)?id=([\w-]+)/)||u.match(/lh3\.googleusercontent\.com\/d\/([\w-]+)/);return m?'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1600':u};/* КОД: Google Диск — обычную ссылку «поделиться» превращаем в ссылку на саму картинку */
const fu=f=>f.id?'/_blob/'+f.id:f.data||gd(f.link);
/* ============================================================
   10. ОТРИСОВКА  [КОД: страница] — собирает меню и содержимое выбранной вкладки
   ============================================================ */
function render(){if(!vis(tab)&&tab!='c:?'){const f=TABS.find(t=>vis(t[0]));if(f&&f[0]!=tab)return void location.replace(pageUrl(f[0]))}
 $('#nav').innerHTML=TABS.filter(t=>vis(t[0])).map(t=>`<a class="t" role="tab" href="${pageUrl(t[0])}" ${t[0]==tab?'aria-current=page':''} title="${esc((S.cfg.tabs[t[0]]||{}).n||t[2])}"><span class="ti">${esc((S.cfg.tabs[t[0]]||{}).i||t[1])}</span><span class="tl">${esc((S.cfg.tabs[t[0]]||{}).n||t[2])}</span></a>`).join('');
 $('#m').innerHTML=(S.cfg.ban?`<div class="c">${esc(S.cfg.ban)}</div>`:'')+PGB()+(V[tab]||V.custom)()+(tab=='diary'&&me?FP():'')+(S.cfg.foot?`<p class="mu" style="text-align:center">${esc(S.cfg.foot)}</p>`:'')}
/* ============================================================
   11. ВКЛАДКИ САЙТА (V)  [КОД: вкладки] — каждая функция ниже = одна вкладка
   ============================================================ */
/* ===== [КОД: вкладки] объект V наполняют файлы из папки views/ — по одному на страницу ===== */
const V={};
const inp=(k,v,p)=>`<input data-c="${k}" value="${esc(v)}" placeholder="${p}" style="width:100%">`;
/* ============================================================
   12. ОКНО НАСТРОЕК (M)  [КОД: настройки] — view: чужой профиль · prof: настройки профиля
       look: оформление · site/usr/data: администрирование сайта
   ============================================================ */
const M={view(){return PV(vpn,false)+(ed&&me&&vpn!=me.n?GIVE():'')+COLL(vpn,false)},prof(){if(!me)return `<div class="c"><h3>Вход и регистрация</h3><div class="f"><input id="ln" placeholder="Логин" autocomplete="username"><input id="lp" type="password" placeholder="Пароль (от 6 символов)" autocomplete="current-password"></div><div class="f"><label class="k">🎂 Дата рождения (нужна при регистрации, сайт 16+) <input type="date" id="lb" min="1900-01-01" max="${bdMax()}"></label></div><div class="f"><button class="btn" data-a="login">Войти</button><button class="btn s" data-a="reg">Зарегистрироваться</button></div></div>`;
 const u=S.users.find(x=>x.n==me.n)||{};return `<div class="c"><h3>${AV(u.av)}${esc(me.n)}</h3><div class="f"><input id="pa" value="${u.av&&!u.av.startsWith('data:')?esc(u.av):''}" maxlength="4" placeholder="Эмодзи-аватар" style="max-width:150px"><input type="file" id="pf" accept="image/*"><label>цвет имени <input type="color" id="pc" value="${u.c||'#b23fe0'}"></label></div><div class="f"><input id="ps" value="${esc(u.st||'')}" maxlength="60" placeholder="Статус, например «ждём новую главу»"></div><div class="f"><select id="pf2"><option value="">Любимый персонаж…</option>${S.script.chars.filter(c=>c.id!='n').map(c=>`<option value="${c.id}" ${u.fc==c.id?'selected':''}>${esc(c.n)}</option>`).join('')}</select><select id="pn">${BNN.map((n,i)=>`<option value="${i}" ${(u.bn||0)==i?'selected':''}>Баннер: ${n}</option>`).join('')}</select><label>🎂 <input type="date" id="pd" value="${u.bd||''}" min="1900-01-01" max="${bdMax()}" title="Сайт для тех, кому 16+"></label></div><div class="f"><select id="pti">${TT.map((t,i)=>tOK(me.n,i)?`<option value="${i}" ${(u.ti!=null&&tOK(me.n,u.ti)?u.ti:tdef(me.n))==i?'selected':''}>${t[1]} ${t[2]} (ур. ${t[0]})</option>`:'').join('')}</select></div><div class="f"><label class="k">Свой баннер профиля — 1200×300 px (4:1), JPG/WebP<input type="file" id="pbi" accept="image/*"></label>${u.bi?'<button class="btn x" data-a="biX">убрать баннер</button>':''}</div><div class="f"><input id="pl" value="${esc(u.lk||'')}" placeholder="Ссылка (https://…)"></div><div class="f"><input id="pmd" value="${esc(u.md||'')}" maxlength="4" placeholder="Настроение 😊" style="max-width:150px"><input id="pms" value="${esc(u.ms||'')}" maxlength="60" placeholder="🎧 Сейчас слушаю"><select id="pfr">${FR.map(f=>`<option value="${f[0]}" ${(u.fr||'')==f[0]?'selected':''}>Рамка: ${f[1]}</option>`).join('')}</select></div><div class="f"><input id="pqt" value="${esc(u.qt||'')}" maxlength="120" placeholder="Любимая цитата"><input id="pit" value="${esc(u.it||'')}" maxlength="80" placeholder="Интересы через запятую: арт, музыка"></div><textarea id="pb" placeholder="О себе">${esc(u.bio||'')}</textarea><div class="f"><button class="btn" data-a="saveP">Сохранить</button><button class="btn s" data-a="logout">Выйти</button></div></div>${SHOW()}${PERM()}`},/* ▶ НАСТРОЙКИ ОФОРМЛЕНИЯ [КОД: настройки] */

look(){if(!ed)return LKP();const T=S.theme,P={...PRE[T.p],...(T.ov||{})},sl=k=>`<select data-t="${k}">${FN.map(f=>`<option ${f==(T[k]||'Onest')?'selected':''}>${f}</option>`).join('')}</select>`,rg=(k,a,b,d)=>`<input type="range" data-t="${k}" data-n="1" min="${a}" max="${b}" value="${T[k]||d}">`;
 return `<div class="c"><h3>Тема</h3>${Object.entries(PRE).map(([k,p])=>`<label class="sw"><input type="radio" name="pp" data-a="pre" data-v="${k}" ${T.p==k?'checked':''}><span style="background:linear-gradient(135deg,${p.p},${p.v})"></span>${p.n}</label>`).join('')}</div>
 <div class="c"><h3>Любые цвета</h3>${[['bg','Фон'],['sf','Карточки'],['ink','Текст'],['mu','Подписи'],['li','Плашки'],['ln','Рамки'],['p','Розовый'],['o','Сиреневый'],['v','Фиолетовый']].map(([k,n])=>`<label class="k">${n}<input type="color" data-ov="${k}" value="${P[k]}"></label>`).join('')}<div><button class="btn x" data-a="ovx">сбросить цвета</button></div></div>
 <div class="c"><h3>Шрифты и размеры</h3><div class="f">Заголовки ${sl('f')} Текст ${sl('bf')}</div><label class="k">Размер текста<br>${rg('fs',13,22,16)}</label><label class="k">Ширина сайта${rg('w',640,1300,980)}</label><label class="k">Скругление${rg('r',0,40,24)}</label><label class="k">Высота шапки${rg('hp',16,120,44)}</label></div>
 <div class="c"><h3>Шапка</h3><p class="mu">Размер баннера шапки: <b>1600×400 px</b> (JPG/WebP). Шапка тянется на всю ширину и обрезается по высоте — важное держите в центральной полосе ≈1600×250. Баннер профиля — <b>1200×300 px</b> (4:1).</p><div class="f"><input type="file" id="hf" accept="image/*">${T.hi?'<button class="btn x" data-a="hiX">убрать картинку</button>':''}</div></div>
 <div class="c"><h3>Свой CSS (полный контроль)</h3><textarea data-t="css" placeholder="Например: .c{box-shadow:0 0 20px #f0f5} body{background:url(...)}" style="font-family:monospace">${esc(T.css||'')}</textarea></div>`},/* ▶ АДМИНИСТРИРОВАНИЕ → Сайт (название, вкладки, релиз) [КОД: админ] */

site(){const T=S.theme,C=S.cfg;return `<div class="c"><h3>Название</h3><div class="f"><input data-t="title" value="${esc(T.title)}"></div><div class="f"><input data-t="sub" value="${esc(T.sub)}"></div><h3>Объявление сверху</h3>${inp('ban',C.ban,'Текст объявления (пусто — скрыто)')}<h3 style="margin-top:10px">Подвал</h3>${inp('foot',C.foot,'Например: © ventyan')}</div>
 <div class="c"><h3>Вкладки: значок, название, видимость для пользователей</h3>${TABS.filter(t=>!t[0].startsWith('c:')).map(t=>{const o=C.tabs[t[0]]||{};return `<div class="f"><input data-tk="${t[0]}" data-tf="i" value="${esc(o.i||t[1])}" maxlength="4" style="width:64px"><input data-tk="${t[0]}" data-tf="n" value="${esc(o.n||t[2])}" style="flex:1"><label><input type="checkbox" data-a="vis" data-v="${t[0]}" ${t[0]=='profile'?'checked disabled':''} ${C.vis.includes(t[0])?'checked':''}> видна</label></div>`}).join('')}</div>`},/* ▶ АДМИНИСТРИРОВАНИЕ → Люди и роли [КОД: админ] */

usr(){return `<div class="c"><h3>👥 Роли и полномочия</h3><p class="mu">${own?'Роли меняете только вы (Владелец).':'Роли может менять только Владелец сайта.'}</p>${Object.values(ROLES).map(r=>`<p style="margin:4px 0">${r[0]} <b>${r[1]}</b> — <span class="mu">${r[2]}</span></p>`).join('')}</div><div class="c"><h3>Пользователи</h3>${S.users.filter(u=>u.n!=AN).map(u=>`<div class="f">${AV(u.av)}<b>${esc(u.n)}</b><select data-rl="${esc(u.n)}" ${own?'':'disabled'}>${['user','mod','admin'].map(r=>`<option value="${r}" ${(u.role||'user')==r?'selected':''}>${ROLES[r][0]} ${ROLES[r][1]}</option>`).join('')}</select><span class="mu" style="flex:1">${esc(u.bio||'')}</span><button class="btn x" data-a="delU" data-v="${esc(u.n)}">Удалить</button></div>`).join('')||'<p class="mu">Пока никого.</p>'}</div>`},/* ▶ АДМИНИСТРИРОВАНИЕ → Данные и пароль (только Владелец) [КОД: админ] */

data(){return `<div class="c"><h3>Резервная копия</h3><p class="mu">Весь сайт одним файлом: храните его, чтобы не потерять записи.</p><div class="f"><button class="btn" data-a="bak">Скачать копию</button><input type="file" id="imf" accept=".json"></div></div><div class="c"><h3>Пароль администратора</h3><div class="f"><input id="np" type="password" placeholder="Новый пароль"><button class="btn" data-a="admPw">Сменить</button></div></div>`}};
/* [КОД: настройки] сборка окна: заголовок, вкладки администрирования, содержимое */
function rm(){const AD=[['site','🧩 Сайт'],['pg','📑 Разделы'],['usr','👥 Люди и роли'],...(own?[['data','💾 Данные']]:[])];if(['site','pg','usr','data','chr','mus','pol','arc','hom'].includes(mt)&&!AD.some(x=>x[0]==mt))mt=ed?'site':'prof';const ad=AD.some(x=>x[0]==mt);
 $('#dtl').textContent=mt=='prof'?'👤 Настройки профиля':mt=='look'?'🎨 Настройки оформления':mt=='view'?'👤 '+vpn:mt=='nt'?'🔔 Уведомления':'🛠 Администрирование сайта';
 $('#mtb').innerHTML=ad?AD.map(x=>`<button class="btn ${x[0]==mt?'':'s'}" data-a="mtab" data-v="${x[0]}">${x[1]}</button>`).join(''):'';$('#mb').innerHTML=M[mt]()}
/* ============================================================
   13. ДЕЙСТВИЯ КНОПОК (A)  [КОД: действия] — имя функции = значение data-a="…" у кнопки
   ============================================================ */
const A={

vp(b){vpn=b.dataset.v;mt='view';$('#gm').hidden=true;const d=$('#dlg');if(!d.open)d.showModal();rm()},
tgb(b){const k=b.dataset.k=='b'?'hb':'ht',u=S.users.find(x=>x.n==me.n),a=u[k]=u[k]||[],i=+b.dataset.i,j=a.indexOf(i);j<0?a.push(i):a.splice(j,1);save('users');rm()},
addW(b){if(!me)return toast('Войдите, чтобы писать на стене');const i=b.closest('.c').querySelector('input'),x=i.value.trim().slice(0,200),v=b.dataset.v;if(!x)return;((S.wall=S.wall||{})[v]=S.wall[v]||[]).unshift({a:me.n,x,t:Date.now()});if(v!=me.n)rec('wl');save('wall');render()},
delW(b){S.wall[b.dataset.v].splice(+b.dataset.i,1);save('wall');render()},
dfc(b){dfc=b.dataset.v;render()},pinD(b){const p=S.diary[+b.dataset.i];p.pin=!p.pin;save('diary');render()},sp(b){b.classList.toggle('show')},
rx(b){if(!me)return toast('Войдите, чтобы реагировать');const p=S.diary[+b.dataset.i],r=p.rx=p.rx||{},l=r[b.dataset.v]=r[b.dataset.v]||[],k=l.indexOf(me.n);k<0?l.push(me.n):l.splice(k,1);save('diary');render()},
gear(){const m=$('#gm');if(!m.hidden){m.hidden=true;return}m.innerHTML=`<button data-a="go" data-v="prof">👤 Настройки профиля</button><button data-a="go" data-v="look">🎨 Настройки оформления</button>${ed?'<button data-a="go" data-v="site">🛠 Администрирование сайта</button><button data-a="go" data-v="pg">📑 Разделы сайта</button>':''}`;m.hidden=false},
go(b){$('#gm').hidden=true;if(!me&&['prof','look'].includes(b.dataset.v)){goto('profile','Сначала создайте аккаунт или войдите');return}mt=b.dataset.v;$('#dlg').showModal();rm()},cl(){$('#dlg').close()},mtab(b){mt=b.dataset.v;rm()},
mypre(b){const m=MY();m.p=b.dataset.v;SMY(m);theme();rm()},myx(){localStorage.removeItem('sn_my');theme();fx();rm()},
biX(){const u=S.users.find(x=>x.n==me.n);delete u.bi;save('users');rm()},
ept(b){const p=$('#ep'+b.dataset.v);p.hidden=!p.hidden},epc(b){$('#ep'+b.dataset.id).querySelectorAll('.epg').forEach(g=>g.hidden=g.dataset.g!=b.dataset.v)},
epe(b){const v=b.dataset.v,t=b.dataset.t;if(t=='icon'){emo=emo==v?'':v;$('#emp').textContent=emo||'—';return}if(t=='mark'){mke=v;$('#mkp').textContent=v;return}
 const e=lf&&document.body.contains(lf)?lf:null;if(!e)return toast('Сначала нажмите в поле, куда вставить эмодзи');const p=e.selectionStart??e.value.length;e.value=e.value.slice(0,p)+v+e.value.slice(e.selectionEnd??p);e.focus();e.selectionStart=e.selectionEnd=p+v.length;e.dispatchEvent(new Event('input',{bubbles:true}))},
addM(){const d=$('#mdt').value,t=$('#mtx').value.trim().slice(0,80);if(!d)return;((S.marks=S.marks||{})[me.n]=S.marks[me.n]||{})[d]={e:mke,t:t||'Отметка'};save('marks');render();toast('Отметка добавлена')},
delM(b){delete S.marks[me.n][b.dataset.v];save('marks');render()},
ball(){if(!$('#bq').value.trim())return toast('Сначала задай вопрос');$('#ba').textContent=BALL[Math.random()*BALL.length|0]},
mnew(){memNew();memDraw()},
mc(b){const i=+b.dataset.i;if(mem.o.length>=2||mem.o.includes(i)||mem.m.includes(i))return;mem.o.push(i);if(mem.o.length==2){mem.mv++;const[a,c]=mem.o;if(mem.c[a]==mem.c[c]){mem.m.push(a,c);mem.o=[];if(mem.m.length==12){rec('gm');rec('g');boom();toast(`Победа за ${mem.mv} ходов! 🎉`)}}else setTimeout(()=>{mem.o=[];memDraw()},800)}memDraw()},
cks(){if(run)return;run=1;let sc=0;const k=$('#ck');k.dataset.a='ckc';k.textContent='⭐';$('#cs').textContent=0;A.ckc=()=>{sc++;$('#cs').textContent=sc;k.style.marginLeft=Math.random()*60+'%'};
 setTimeout(()=>{run=0;A.ckc=null;const e=$('#ck');if(e){e.dataset.a='cks';e.textContent='Старт';e.style.marginLeft=0}rec('g');rec('gc',sc);toast(`Время! Набрано: ${sc} ⭐`)},15000)},
fort(){ft=true;if(me){const u=S.users.find(x=>x.n==me.n);if(u){u.fo=(u.fo||0)+1;save('users')}}render()},/* — дневник: лайки и комментарии — */

lk(b){if(!me)return toast('Войдите, чтобы ставить лайки');const p=S.diary[+b.dataset.i],l=p.lk=p.lk||[],i=l.indexOf(me.n);i<0?l.push(me.n):l.splice(i,1);save('diary');render()},
cmt(b){if(!me)return toast('Войдите, чтобы комментировать');const i=+b.dataset.i,x=$('#cm'+i).value.trim();if(!x)return;(S.diary[i].cm=S.diary[i].cm||[]).push({a:me.n,x,t:Date.now()});save('diary');render()},
delCm(b){S.diary[+b.dataset.i].cm.splice(+b.dataset.j,1);save('diary');render()},
vis(b){const v=S.cfg.vis,k=b.dataset.v,i=v.indexOf(k);b.checked?i<0&&v.push(k):i>=0&&v.splice(i,1);save('cfg')},
hiX(){S.theme.hi='';save('theme');theme();rm()},ovx(){S.theme.ov={};save('theme');theme();rm()},
bak(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='star-novel-backup.json';a.click()},
tab(b){goto(b.dataset.v)},
async addB(){const v=$('#bv').value.trim(),l=$('#bl').value.trim();if(!v||!l)return toast('Нужны версия и ссылка');S.builds.unshift({v,l,p:$('#bp').value,nt:$('#bn').value,t:Date.now()});save('builds');render()},
delB(b){S.builds.splice(+b.dataset.i,1);save('builds');render()},
addD(){return(async()=>{const ti=$('#dt').value.trim(),tx=$('#dx').value.trim(),f=$('#di').files[0];if(!ti&&!tx)return;let im=null;if(f){im=await upl(f);if(!im)return}S.diary.unshift({ti,tx,im,em:emo,k:$('#dk').value,pin:$('#dpn').checked,d:$('#dd').value,t:Date.now()});emo='';save('diary');render()})()},
emo(b){emo=emo==b.dataset.v?'':b.dataset.v;render()},mk(b){mk=b.checked;render()},
day(b){const k=b.dataset.v;if(ed&&mk){const a=S.cal[k]||[],i=a.indexOf(br);i<0?a.push(br):a.splice(i,1);a.length?S.cal[k]=a:delete S.cal[k];save('cal');return render()}
 const p=S.diary.find(p=>pk(p)==k);const pm=me&&((S.marks||{})[me.n]||{})[k];if(!p)return toast(pm?pm.e+' '+pm.t:'В этот день записей нет');if(pm)toast(pm.e+' '+pm.t);const e=document.getElementById('p'+p.t);e.scrollIntoView({behavior:'smooth',block:'center'});e.style.outline='3px solid var(--o)';setTimeout(()=>e.style.outline='',1800)},/* — аккаунт: вход, регистрация, выход, сохранение профиля — */

async login(){const n=$('#ln').value.trim(),h=await sha($('#lp').value);if(n.toLowerCase()==AN){if(h!=(S.adm.h||AH))return toast('Неверный логин или пароль');if(!S.users.some(u=>u.n==AN))S.users.push({n:AN,role:'admin',av:'🌟',c:'#b23fe0',bio:''});me={n:AN,role:'admin'}}
 else{const u=S.users.find(u=>u.n.toLowerCase()==n.toLowerCase());if(!u||u.h!=h)return toast('Неверный логин или пароль');me={n:u.n,role:'user'}}localStorage.setItem('sn_me',JSON.stringify(me));sync();save('users');toast('Добро пожаловать!');render()},
async reg(){const n=$('#ln').value.trim(),p=$('#lp').value;if(n.length<2||p.length<6)return toast('Логин от 2 символов, пароль от 6');const bdv=($('#lb')||{}).value||'',be=bdErr(bdv);if(be)return toast(be);if(n.toLowerCase()==AN||S.users.some(u=>u.n.toLowerCase()==n.toLowerCase()))return toast('Этот логин занят');
 me={n,role:'user'};S.users.push({n,t:Date.now(),h:await sha(p),av:'🙂',c:'#b23fe0',bio:'',role:'user',bd:bdv});localStorage.setItem('sn_me',JSON.stringify(me));save('users');toast('Аккаунт создан');render()},
logout(){localStorage.removeItem('sn_me');me=null;sync();render()},
async saveP(){const u=S.users.find(x=>x.n==me.n),f=$('#pf').files[0],bd0=$('#pd').value;if(bd0&&bd0!=u.bd){const e=bdErr(bd0);if(e)return toast(e)}u.c=$('#pc').value;u.bio=$('#pb').value.slice(0,200);u.st=$('#ps').value.slice(0,60);u.fc=$('#pf2').value;u.bd=$('#pd').value;u.lk=$('#pl').value.trim().slice(0,200);u.bn=+$('#pn').value;u.md=$('#pmd').value.trim().slice(0,4);u.ms=$('#pms').value.trim();u.fr=$('#pfr').value;u.qt=$('#pqt').value.trim();u.it=$('#pit').value.trim();u.ti=+$('#pti').value;const bf=$('#pbi').files[0];if(bf){const d=await rz(bf,1200,'image/jpeg');if(d)u.bi=d}const a=$('#pa').value.trim();if(a)u.av=a;if(f){const d=await rz(f,96,'image/jpeg');if(d)u.av=d}save('users');render();toast('Профиль сохранён')},
pm(b){b.checked?localStorage.setItem('sn_pm','night'):localStorage.removeItem('sn_pm');theme()},
acc(b){S.theme.acc=b.value;save('theme');theme()},accx(){S.theme.acc='';save('theme');theme();render()},
async addS(){const f=$('#sf').files[0];if(!f)return;const d=await rz(f,128,'image/png');if(d){S.stk.push(d);save('stk');render()}},
delS(b){S.stk.splice(+b.dataset.i,1);save('stk');render()},
delU(b){S.users=S.users.filter(u=>u.n!=b.dataset.v);if(b.dataset.v=='test'){S.cfg.noTest=1;save('cfg')}save('users');render()},
async admPw(){const p=$('#np').value;if(p.length<6)return toast('Минимум 6 символов');S.adm={h:await sha(p)};save('adm');toast('Пароль изменён')},/* — форум — */

fmt(b){document.execCommand(b.dataset.v)},
fimg(){$('#fi').click()},
stk(b){const e=document.activeElement.isContentEditable?document.activeElement:ae;if(!e)return toast('Сначала нажмите в поле текста');e.focus();if(rg){const s=getSelection();s.removeAllRanges();s.addRange(rg)}
 document.execCommand('insertHTML',false,b.dataset.u!=null?`<img class="stk" data-k="stk" src="${S.stk[+b.dataset.u]}">`:esc(b.dataset.v))},
addF(){const ti=$('#ft').value.trim(),h=san($('#fe').innerHTML);if(!ti||!$('#fe').textContent.trim()&&!h.includes('<img'))return toast('Нужны заголовок и текст');S.forum.unshift({id:Date.now(),k:$('#fk').value,ti,h,a:me.n,t:Date.now(),r:[]});save('forum');render()},
rep(b){const i=+b.dataset.i,e=$('#re'+i),h=san(e.innerHTML);if(!h.trim())return;(S.forum[i].r=S.forum[i].r||[]).push({a:me.n,h,t:Date.now()});save('forum');render()},
delF(b){S.forum.splice(+b.dataset.i,1);save('forum');render()},delRp(b){S.forum[+b.dataset.i].r.splice(+b.dataset.j,1);save('forum');render()},
delD(b){S.diary.splice(+b.dataset.i,1);save('diary');render()},
mo(b){cm=new Date(cm.getFullYear(),cm.getMonth()+ +b.dataset.v,1);render()},
br(b){br=b.dataset.v;render()},
vc(b){vc=b.dataset.v;render()},/* — хранилище — */

async addV(){const fs=[...$('#vf').files];for(const f of fs){const r=await upl(f);if(r)S.vault.push({...r,cat:vc})}save('vault');render()},
addVL(){const l=$('#vl').value.trim();if(!l)return;S.vault.push({n:$('#vn').value.trim()||l,link:l,cat:vc});save('vault');render()},
delV(b){S.vault.splice(+b.dataset.i,1);save('vault');render()},/* — сценарий — */

addC(){const n=$('#cn').value.trim();if(!n)return;S.script.chars.push({id:'c'+Date.now(),n,v:$('#cv').value.replace(/\W/g,''),c:$('#cc').value});save('script');render()},
delC(b){S.script.chars=S.script.chars.filter(c=>c.id!=b.dataset.v);S.script.rows.forEach(r=>{if(!S.script.chars.some(c=>c.id==r.s))r.s='n'});save('script');render()},
addR(){const l=S.script.rows[S.script.rows.length-1];S.script.rows.push({s:l?l.s:'n',t:''});save('script');render();const t=document.querySelectorAll('[data-sr]');t[t.length-1].focus()},
delR(b){S.script.rows.splice(+b.dataset.i,1);save('script');render()},
async exp(){const q=s=>s.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/%/g,'%%').replace(/\[/g,'[[');const C=S.script.chars;
 let o=C.filter(c=>c.v).map(c=>`define ${c.v} = Character("${q(c.n)}", color="${c.c}")`).join('\n')+'\n\nlabel start:\n';
 for(const r of S.script.rows){if(!r.t.trim())continue;const c=C.find(c=>c.id==r.s);o+=`    ${c&&c.v?c.v+' ':''}"${q(r.t)}"\n`}o+='    return\n';
 try{if(!dl)throw 0;await dl.save({filename:'script.rpy',data:o})}catch{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([o],{type:'text/plain'}));a.download='script.rpy';a.click()}},/* — отзывы — */

star(b){window.stars=+b.dataset.v;document.querySelectorAll('#rs button').forEach((x,i)=>x.classList.toggle('on',i<window.stars))},
async addRv(){const x=$('#rx').value.trim();if(!x)return toast('Напишите пару слов');const r={n:$('#rn').value.trim(),s:window.stars||0,x,t:Date.now()};r.id='r'+r.t.toString(36)+Math.random().toString(36).slice(2,5);
 try{if(db)await db.doc('reviews/'+r.id).set(r);else{R.push(r);localStorage.setItem('sn_rev',JSON.stringify(R))}}catch{return toast('Не удалось отправить отзыв')}window.stars=0;await loadR();render();toast('Спасибо за отзыв!')},
async delRv(b){try{if(db)await db.doc('reviews/'+b.dataset.v).delete();else{R=R.filter(r=>r.id!=b.dataset.v);localStorage.setItem('sn_rev',JSON.stringify(R))}}catch{}await loadR();render()},/* — оформление сайта — */

pre(b){S.theme.p=b.dataset.v;S.theme.ov={};save('theme');theme();rm()},
font(b){S.theme.f=b.dataset.v;save('theme');theme();render()},
rad(b){S.theme.r=+b.value;save('theme');theme()},
ttl(){S.theme.title=$('#tt').value;S.theme.sub=$('#ts').value;save('theme');theme();toast('Сохранено')}};
/* ============================================================
   14. ОБЩИЕ СЛУШАТЕЛИ СОБЫТИЙ И ПАСХАЛКИ  [КОД: события]
   ============================================================ */
document.addEventListener('mousedown',e=>{if(e.target.closest('.tb')){e.preventDefault();const a=document.activeElement;if(a&&a.isContentEditable){ae=a;const s=getSelection();rg=s.rangeCount?s.getRangeAt(0).cloneRange():null}}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&b.tagName=='A')e.preventDefault();if(b&&!['rad','pre','mk','vis'].includes(b.dataset.a))A[b.dataset.a]?.(b)});
document.addEventListener('change',async e=>{const b=e.target;if(b.dataset.rl&&own){const u=S.users.find(x=>x.n==b.dataset.rl);if(u){u.role=b.value;save('users');toast('Роль изменена')}}if(b.id=='dqs'){dq=b.value;render()}if(['mk','vis'].includes(b.dataset.a))A[b.dataset.a](b);if(b.id=='hf'&&b.files[0]){const d=await rz(b.files[0],1600,'image/jpeg');if(d){S.theme.hi=d;save('theme');theme();rm()}}if(b.id=='imf'&&b.files[0]){try{const j=JSON.parse(await b.files[0].text());for(const k of Object.keys(S))if(j[k]!=null){S[k]=j[k];save(k)}theme();render();toast('Импортировано')}catch{toast('Файл не подходит')}}if(b.id=='fi'&&b.files[0]){const d=await rz(b.files[0],800,'image/jpeg');b.value='';if(!d||!ae)return toast('Сначала нажмите в поле текста');ae.focus();if(rg){const s=getSelection();s.removeAllRanges();s.addRange(rg)}document.execCommand('insertHTML',false,`<img src="${d}">`)}if(b.dataset.a=='pre')A.pre(b);if(b.dataset.sp!=null){const i=+b.dataset.sp;S.script.rows[i].s=b.value;b.style.borderLeftColor=(S.script.chars.find(c=>c.id==b.value)||{}).c;save('script')}});
document.addEventListener('input',e=>{const b=e.target;if(b.dataset.t){S.theme[b.dataset.t]=b.dataset.n?+b.value:b.value;save('theme');theme()}if(b.dataset.ov){(S.theme.ov=S.theme.ov||{})[b.dataset.ov]=b.value;save('theme');theme()}if(b.dataset.pr){(S.cfg.pr=S.cfg.pr||{})[b.dataset.pr]=+b.value;save('cfg')}if(b.dataset.c){S.cfg[b.dataset.c]=b.value;save('cfg')}if(b.dataset.tk){const o=S.cfg.tabs[b.dataset.tk]=S.cfg.tabs[b.dataset.tk]||{};o[b.dataset.tf]=b.value;save('cfg')}if(b.dataset.a=='rad')A.rad(b);if(b.dataset.my){const m=MY();m[b.dataset.my]=b.type=='checkbox'?b.checked:+b.value;SMY(m);theme();fx()}if(b.dataset.sr!=null){S.script.rows[+b.dataset.sr].t=b.value;save('script');stats()}});
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&(e.ctrlKey||e.metaKey)&&e.target.dataset.sr!=null&&ed)A.addR()});
function stats(){const e=$('#sst');if(!e)return;const r=S.script.rows.filter(x=>x.t.trim());e.textContent=`Реплик: ${r.length}, слов: ${r.reduce((a,x)=>a+x.t.trim().split(/\s+/).length,0)}`}
const _r=render;render=function(){_r();stats();if($('#dlg').open)rm()};$('#dlg').addEventListener('close',()=>render());
document.addEventListener('click',e=>{if(!e.target.closest('#gm,.gear'))$('#gm').hidden=true});
document.addEventListener('focusin',e=>{const t=e.target;if(t.tagName=='TEXTAREA'||t.tagName=='INPUT'&&/^(text|search)$/.test(t.type))lf=t});
let egc=0,esc2=0,kb=[];const KS='38,38,40,40,37,39,37,39,66,65';let kw='';
$('#ttl').addEventListener('click',()=>{if(++egc<7)return;egc=0;egg('ttl','🥚 Секрет найден! Кукла подмигнула')});
$('#sub').addEventListener('click',()=>{if(++esc2<3)return;esc2=0;egg('sub','🌙 Подзаголовок тоже умеет подмигивать')});
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;kb=[...kb,e.keyCode].slice(-10);if(kb.join()==KS)egg('konami','🎮 Konami-код! +30 жизней кукле');kw=(kw+(e.key||'').toLowerCase()).slice(-5);if(kw=='кукла')egg('word','🎎 Ты назвал(а) имя куклы…')});
