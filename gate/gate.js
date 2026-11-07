/* ===== ВХОД КАК В WINDOWS: тёмная загрузка → заставка с профилем админа → пароль =====
   Подключение (сразу после <body>):
   <script src="../gate/gate.js" data-hash="SHA256_ПАРОЛЯ" data-name="Вентян" data-emoji="🌙" data-avatar=""></script>
   Хэш пароля получить на странице gate/make-hash.html.
   data-avatar — ссылка на картинку профиля (необязательно), data-remember="local" — не спрашивать пароль после закрытия вкладки. */
(function(){
  var s=document.currentScript,d=s.dataset;
  var C={hash:(d.hash||'').toLowerCase(),name:d.name||'Вентян',emoji:d.emoji||'🌙',avatar:d.avatar||'',
    store:d.remember==='local'?localStorage:sessionStorage,key:'gate_ok_'+(d.key||'family')};
  try{if(C.hash&&C.store.getItem(C.key)===C.hash)return}catch(e){}
  var css=`
  html.gl,html.gl body{overflow:hidden!important}
  #gate{position:fixed;inset:0;z-index:2147483647;background:#000;color:#fff;font-family:'Segoe UI','Onest',system-ui,sans-serif;user-select:none;transition:opacity .7s}
  #gate.out{opacity:0;pointer-events:none}
  #gate .scr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .6s}
  #gate .scr.hide{opacity:0;pointer-events:none}
  #gate .logo{font-size:64px;color:#c98bff;text-shadow:0 0 30px #a855f7}
  .gsp{margin-top:46px;width:34px;height:34px;position:relative}
  .gsp i{position:absolute;inset:0;animation:gsp 1.8s cubic-bezier(.4,.1,.6,.9) infinite}
  .gsp i:before{content:'';position:absolute;top:0;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#fff}
  .gsp i:nth-child(2){animation-delay:.12s}.gsp i:nth-child(3){animation-delay:.24s}.gsp i:nth-child(4){animation-delay:.36s}.gsp i:nth-child(5){animation-delay:.48s}
  @keyframes gsp{0%{transform:rotate(0)}70%{transform:rotate(360deg)}100%{transform:rotate(360deg);opacity:0}}
  #g-lock,#g-login,#g-welcome{background:radial-gradient(circle at 20% 20%,#6a2fd0aa,transparent 55%),radial-gradient(circle at 85% 85%,#ff4fa3aa,transparent 55%),#12061f}
  #g-lock{cursor:pointer;justify-content:flex-end;align-items:flex-start;padding:0 7vw 12vh}
  #g-lock .tm{font-size:clamp(64px,13vw,130px);font-weight:300;line-height:1}
  #g-lock .dt{font-size:clamp(18px,3vw,28px);margin-top:6px;opacity:.9}
  #g-lock .hn{position:absolute;bottom:4vh;left:0;right:0;text-align:center;font-size:14px;opacity:.6}
  .gav{border-radius:50%;background:linear-gradient(135deg,#ff4fa3,#6a2fd0) center/cover;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff3,0 10px 40px #0008}
  #g-login .gav{width:clamp(110px,28vw,170px);height:clamp(110px,28vw,170px);font-size:72px}
  #g-welcome .gav{width:110px;height:110px;font-size:56px}
  #g-login h2{font-size:28px;font-weight:400;margin:18px 0 4px}
  #g-login small{opacity:.65}
  #g-form{display:flex;margin-top:18px;width:min(300px,80vw);border:2px solid #fff8;border-radius:4px;background:#0006}
  #g-form:focus-within{border-color:#fff}
  #g-form input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font-size:16px;padding:10px 12px}
  #g-form button{border:0;background:#fff3;color:#fff;width:42px;font-size:20px;cursor:pointer}#g-form button:hover{background:#fff5}
  #g-err{color:#ff9ac8;margin-top:12px;min-height:20px;font-size:14px}
  .gsh{animation:gsh .4s}@keyframes gsh{25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
  #g-wel{font-size:26px;font-weight:300;margin-top:22px}`;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  document.documentElement.classList.add('gl');
  var spin='<div class="gsp"><i></i><i></i><i></i><i></i><i></i></div>';
  var av=C.avatar?'style="background-image:url(\''+C.avatar.replace(/['"<>]/g,'')+'\')"':'';
  var face=C.avatar?'':C.emoji, nm=C.name.replace(/</g,'&lt;');
  var g=document.createElement('div');g.id='gate';
  g.innerHTML='<div class="scr" id="g-boot"><div class="logo">✦</div>'+spin+'</div>'+
   '<div class="scr hide" id="g-lock"><div class="tm" id="g-tm"></div><div class="dt" id="g-dt"></div><div class="hn">Нажмите любую клавишу или кликните, чтобы войти</div></div>'+
   '<div class="scr hide" id="g-login"><div class="gav" '+av+'>'+face+'</div><h2>'+nm+'</h2><small>Администратор</small>'+
   '<form id="g-form" autocomplete="off"><input id="g-pw" type="password" placeholder="Пароль" autocomplete="off"><button type="submit" aria-label="Войти">→</button></form><div id="g-err"></div></div>'+
   '<div class="scr hide" id="g-welcome"><div class="gav" '+av+'>'+face+'</div><div id="g-wel">Добро пожаловать</div>'+spin+'</div>';
  document.body.appendChild(g);
  var $=function(i){return document.getElementById(i)};
  function show(id){['g-boot','g-lock','g-login','g-welcome'].forEach(function(x){$(x).classList.toggle('hide',x!==id)})}
  function tick(){var n=new Date();$('g-tm').textContent=n.toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'});
    $('g-dt').textContent=n.toLocaleDateString('ru',{weekday:'long',day:'numeric',month:'long'})}
  tick();var iv=setInterval(tick,10000);
  setTimeout(function(){show('g-lock')},2400);
  /* ===== [РАЗДЕЛ: сайт открыт для всех] если админка записала pelle/cfg/open = 1 — пароль не спрашиваем. Нет связи или значение пустое — вход закрыт ===== */
  try{fetch('https://star-novel-6c2f2-default-rtdb.firebaseio.com/'+(d.key||'family')+'/cfg/open.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(v){
    if(v===1||v===true){g.classList.add('out');document.documentElement.classList.remove('gl');clearInterval(iv);setTimeout(function(){g.remove()},800)}}).catch(function(){})}catch(e){}
  var opened=false;function open(){if(opened||$('g-lock').classList.contains('hide'))return;opened=true;show('g-login');setTimeout(function(){$('g-pw').focus()},400)}
  $('g-lock').onclick=open;addEventListener('keydown',open);
  function sha(t){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')})}
  $('g-form').onsubmit=function(e){e.preventDefault();
    if(!window.crypto||!crypto.subtle){$('g-err').textContent='Нужен https или localhost';return}
    sha($('g-pw').value).then(function(h){
      if(C.hash&&h===C.hash){try{C.store.setItem(C.key,C.hash)}catch(x){}
        $('g-wel').textContent='Добро пожаловать, '+C.name;show('g-welcome');
        setTimeout(function(){g.classList.add('out');document.documentElement.classList.remove('gl');clearInterval(iv);setTimeout(function(){g.remove()},800)},1600);
      }else{$('g-err').textContent='Неверный пароль';$('g-pw').value='';var f=$('g-form');f.classList.remove('gsh');void f.offsetWidth;f.classList.add('gsh')}
    })};
})();
