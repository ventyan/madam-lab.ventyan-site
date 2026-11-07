/* ===== [ВКЛАДКА] ОТЗЫВЫ (rev.html) =====
   Подключается на своей странице: <script src="views/rev.js">. Общие помощники лежат в js/core.js и js/features.js. */
Object.assign(V,{rev(){return `<div class="c"><h3>Оставить отзыв</h3><div class="f"><input id="rn" placeholder="Ваше имя"><span class="rt" id="rs">${[1,2,3,4,5].map(n=>`<button data-a="star" data-v="${n}" aria-label="${n}">★</button>`).join('')}</span></div><textarea id="rx" placeholder="Что понравилось, что сломалось, чего не хватает?"></textarea><div class="f"><button class="btn" data-a="addRv">Отправить</button></div></div>`+
 (R.length?`<p class="mu">Средняя оценка: ${(R.reduce((a,r)=>a+(r.s||0),0)/R.length).toFixed(1)} из 5, отзывов: ${R.length}</p>`:'')+
 R.map(r=>`<div class="c"><b>${esc(r.n||'Аноним')}</b> <span style="color:var(--p)">${'★'.repeat(r.s||0)}</span> <span class="mu">${fd(r.t)}</span><p style="white-space:pre-wrap;margin:6px 0">${esc(r.x)}</p>${ed?`<button class="btn x" data-a="delRv" data-v="${r.id}">Удалить</button>`:''}</div>`).join('')},/* ▶ ВКЛАДКА «Форум» [КОД: вкладка] */
});
