/* ===== [ВКЛАДКА] СЦЕНАРИЙ (script.html): реплики персонажей =====
   Подключается на своей странице: <script src="views/script.js">. Общие помощники лежат в js/core.js и js/features.js. */
Object.assign(V,{script(){const C=S.script.chars,Rw=S.script.rows,col=id=>(C.find(c=>c.id==id)||C[0]).c;
 return `<div class="c"><h3>Персонажи</h3><div>${C.map(c=>`<span class="tag" style="background:${esc(c.c)}33">${esc(c.n)}${c.v?' · '+esc(c.v):''}${ed&&c.id!='n'?` <button class="btn x" style="padding:0 4px" data-a="delC" data-v="${c.id}">×</button>`:''}</span>`).join('')}</div>
 ${ed?`<div class="f"><input id="cn" placeholder="Имя"><input id="cv" placeholder="Переменная (v, ami)" style="max-width:150px"><input type="color" id="cc" value="#ff4fa3"><button class="btn s" data-a="addC">Добавить</button></div>`:''}</div>
 <div class="c"><div id="sst" class="mu"></div><div id="rows">${Rw.map((r,i)=>`<div class="sr"><select data-sp="${i}" style="border-left-color:${col(r.s)}" ${ed?'':'disabled'}>${C.map(c=>`<option value="${c.id}" ${c.id==r.s?'selected':''}>${esc(c.n)}</option>`).join('')}</select><textarea data-sr="${i}" placeholder="Реплика" ${ed?'':'readonly'}>${esc(r.t)}</textarea>${ed?`<button class="btn x" data-a="delR" data-i="${i}" title="Удалить">×</button>`:''}</div>`).join('')}</div>
 ${ed?`<div class="f"><button class="btn" data-a="addR">+ Реплика</button><button class="btn s" data-a="exp">Экспорт для Ren'Py (.rpy)</button></div><p class="mu">Ctrl+Enter в реплике добавляет следующую строку.</p>`:''}</div>`},/* ▶ ВКЛАДКА «Отзывы» [КОД: вкладка] */
});
