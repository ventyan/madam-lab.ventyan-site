/* ===== [РАЗДЕЛ: возврат на главную] кнопка «Вернуться на главную страницу» → экран «Завершение работы» → страница выбора сайта =====
   Подключение: <script src="…/gate/exit.js" data-home="путь/к/index.html"></script>. Закрывает вход по паролю (gate), как «выход из системы». */
(function(){var home=document.currentScript.dataset.home||'index.html';
 var st=document.createElement('style');st.textContent='#xb{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:8px;z-index:50;border:0;border-radius:999px;padding:8px 14px;font:600 13px system-ui,sans-serif;background:#000a;color:#fff;cursor:pointer;backdrop-filter:blur(8px)}#xb:hover{background:#000d}'+
 '#xs{position:fixed;inset:0;z-index:2147483646;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;font:400 20px "Segoe UI",system-ui,sans-serif;opacity:0;transition:opacity .6s}#xs.on{opacity:1}'+
 '#xs i{width:34px;height:34px;border:4px solid #fff3;border-top-color:#fff;border-radius:50%;animation:xr 1s linear infinite}@keyframes xr{to{transform:rotate(360deg)}}';document.head.appendChild(st);
 var b=document.createElement('button');b.id='xb';b.textContent='⌂ Вернуться на главную страницу';document.body.appendChild(b);
 b.onclick=function(){var s=document.createElement('div');s.id='xs';s.innerHTML='<i></i><div id="xt">Завершение работы…</div>';document.body.appendChild(s);
  try{[sessionStorage,localStorage].forEach(function(S){Object.keys(S).forEach(function(k){if(k.indexOf('gate_ok_')==0)S.removeItem(k)})})}catch(e){}
  requestAnimationFrame(function(){s.classList.add('on')});
  setTimeout(function(){document.getElementById('xt').textContent='Работа завершена'},1800);
  setTimeout(function(){location.href=home},2800)}})();
