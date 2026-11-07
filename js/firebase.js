/* ===== [КОД: онлайн-база] Firebase Realtime Database через обычные запросы (без SDK) =====
   Адрес базы — ваш. Сайт хранит данные в ветках: site/<раздел> и reviews/<id>; регистрации в форме — в site_users. */
const FBURL="https://star-novel-6c2f2-default-rtdb.firebaseio.com";
const VER={};
function netSet(ok,e){const n=document.getElementById('net');if(!n)return;n.className=ok?'ok':'bad';const c=e&&/\d+/.exec(e.message||''),code=c?+c[0]:0;
 n.textContent=ok?'● онлайн':'● нет связи'+(code==401||code==403?': базе запрещён доступ (правила)':code==402||code==429?': у Firebase закончился лимит трафика':code?' (код '+code+')':'');n.title='Нажмите, чтобы проверить связь заново'}
const FBX=async(p,m,b)=>{try{const [pp,q]=p.split('?'),r=await fetch(FBURL+'/'+pp+'.json'+(q?'?'+q:''),{method:m||'GET',cache:'no-store',body:b===undefined?undefined:JSON.stringify(b)});if(!r.ok)throw new Error('fb '+r.status);const j=await r.json();netSet(true);return j}catch(e){netSet(false,e);throw e}};
/* после каждой записи ставим маленькую «метку версии» ver/<раздел>: остальные проверяют только её (пара байт), а не качают всю базу с картинками */
const bumpV=async p=>{const k=p.startsWith('site/')?p.slice(5):p.split('/')[0],t=Date.now()+'.'+Math.random().toString(36).slice(2,6);try{await FBX('ver/'+k,'PUT',t);VER[k]=t}catch{}};
const FB={doc:p=>({id:p.split('/').pop(),
  async get(){const v=await FBX(p);return{id:p.split('/').pop(),exists:v!==null,data:()=>v}},
  async set(o){await FBX(p,'PUT',o);await bumpV(p)},async delete(){await FBX(p,'DELETE');await bumpV(p)}}),
 collection:p=>({async get(){const v=(await FBX(p))||{};return{docs:Object.entries(v).map(([id,o])=>({id,exists:true,data:()=>o}))}}})};
/* ===== [КОД: быстрый старт] сайт рисуется сразу из того, что есть в браузере, а не ждёт ответа базы; когда данные придут, страница обновится сама ===== */
function earlyPaint(){try{const n=document.getElementById('net');if(n){n.className='wait';n.textContent='● подключаюсь…'}setMe();theme();render()}catch(e){}}
async function fbInit(){earlyPaint();try{await FBX('site?shallow=true');return FB}catch{return null}}
document.addEventListener('click',e=>{
 const btn=e.target.closest('#regBtn');if(!btn)return;
 const name=document.getElementById('username')?.value.trim(),email=document.getElementById('useremail')?.value.trim(),st=document.getElementById('statusMsg');
 const say=(t,c)=>{if(st){st.innerText=t;st.style.color=c}};
 if(!name||!email)return say('❌ Пожалуйста, заполни все поля!','#ff4fa3');
 FBX('site_users','POST',{username:name,email,userAgent:navigator.userAgent,date:new Date().toLocaleString()})
  .then(()=>{say('🎉 Успешно! Данные сохранены в базе.','#b23fe0');document.getElementById('username').value='';document.getElementById('useremail').value=''})
  .catch(()=>say('Ошибка: не удалось записать в базу (проверьте правила в консоли Firebase)','#6a2fd0'));
});
