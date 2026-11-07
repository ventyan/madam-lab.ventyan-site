/* ===== [РАЗДЕЛ: окно входа сайта «Звёздная новелла»] =====
   Появляется один раз за визит, когда данные загрузились и человек ещё не вошёл. «Войти»/«Регистрация» открывают обычное окно профиля сайта,
   «Продолжить гостем» просто закрывает. Для другого сайта своё окно живёт в его core.js (так у каждой вселенной свой стиль). */
(function(){
 var KEY='sn_welcomed';try{if(sessionStorage.getItem(KEY))return}catch(e){}
 var tries=0,t=setInterval(function(){tries++;
  var n=document.getElementById('net'),ready=n&&/онлайн|нет связи/.test(n.textContent);
  if(!ready&&tries<40)return;clearInterval(t);
  if(typeof me==='undefined'||me)return;
  try{sessionStorage.setItem(KEY,'1')}catch(e){}
  var st=document.createElement('style');st.textContent='#wl{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:#0b0414cc;backdrop-filter:blur(6px);padding:18px;animation:wi .4s}@keyframes wi{from{opacity:0}}'+
   '#wl .b{width:min(400px,100%);text-align:center;padding:30px 24px;border-radius:28px;color:#fff;background:linear-gradient(150deg,#ff4fa3,#6a2fd0);box-shadow:0 30px 70px -20px #000}#wl h2{margin:0 0 6px;font-size:22px}#wl p{margin:0 0 18px;opacity:.9;font-size:14px}'+
   '#wl button{display:block;width:100%;margin:8px 0;padding:13px;border:0;border-radius:999px;font:600 15px Onest,system-ui;cursor:pointer}#wl .a{background:#fff;color:#6a2fd0}#wl .c{background:#fff3;color:#fff}#wl .g{background:none;color:#fff;opacity:.8;font-size:13px}';
  document.head.appendChild(st);
  var w=document.createElement('div');w.id='wl';
  w.innerHTML='<div class="b" role="dialog" aria-label="Вход"><div style="font-size:44px">✦</div><h2>«Звёздная» новелла</h2><p>Войдите или создайте аккаунт — тогда сохранятся ваш профиль, опыт и значки.</p><button class="a" data-w="in">Войти</button><button class="c" data-w="reg">Регистрация</button><button class="g" data-w="x">Продолжить гостем</button></div>';
  document.body.appendChild(w);
  w.onclick=function(e){var b=e.target.closest('[data-w]');if(!b&&e.target!==w)return;w.remove();if(b&&b.dataset.w!='x')try{A.go({dataset:{v:'prof'}})}catch(x){}};
 },300);
})();
