const products=[{"name": "iPhone 17 Pro Max Blue", "price": 700000, "img": "iphone-17-pro-max-blue.svg", "hint": "Игровой товар · Синяя версия"}, {"name": "iPhone 17 Pro Max Orange", "price": 800000, "img": "iphone-17-pro-max-orange.svg", "hint": "Игровой товар · Оранжевая версия"}, {"name": "iPhone 15 Pro Max", "price": 15000, "img": "iphone-15-pro-max.svg", "hint": "Игровой товар"}, {"name": "iPhone 14 Pro Max", "price": 50000, "img": "iphone-14-pro-max.svg", "hint": "Новый товар в каталоге"}, {"name": "iPhone 13 Blue", "price": 12000, "img": "iphone-13-blue.svg", "hint": "Игровой товар · Синий"}, {"name": "iPhone 13 Pink", "price": 13000, "img": "iphone-13-pink.svg", "hint": "Игровой товар · Розовый"}, {"name": "iPhone XS Max", "price": 10000, "img": "iphone-xs-max.svg", "hint": "Игровой товар"}, {"name": "iPhone 12", "price": 9000, "img": "iphone-12.svg", "hint": "Игровой товар"}, {"name": "iPhone 5", "price": 3000, "img": "iphone-5.svg", "hint": "Игровой товар"}, {"name": "AirPods", "price": 7000, "img": "airpods.svg", "hint": "Игровой товар"}, {"name": "AirPods Pro", "price": 9000, "img": "airpods-pro.svg", "hint": "Игровой товар"}, {"name": "Power Adapter", "price": 3000, "img": "power-adapter.svg", "hint": "Игровой товар"}, {"name": "Apple Watch SE", "price": 12000, "img": "apple-watch-se.svg", "hint": "Игровой товар"}, {"name": "iPad Air", "price": 14000, "img": "ipad-air.svg", "hint": "Игровой товар"}, {"name": "MacBook Pro", "price": 20000, "img": "macbook-pro.svg", "hint": "Игровой товар"}, {"name": "iPad", "price": 300000, "img": "ipad.svg", "hint": "Игровой товар"}, {"name": "Apple Pencil", "price": 20000, "img": "apple-pencil.svg", "hint": "Игровой товар"}].map((p,id)=>({...p,id}));
// Extra Apple models for a more complete historical catalog.
// Existing store prices remain unchanged. New products have no invented price.
const extraProducts=["iPhone Duo","iPhone 18 Pro Max","iPhone 18 Pro","iPhone 17 Pro","iPhone 17e","iPhone 17","iPhone Air","iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 16e","iPhone 15 Pro","iPhone 15 Plus","iPhone 15","iPhone 14 Pro","iPhone 14 Plus","iPhone 14","iPhone 13 Pro Max","iPhone 13 Pro","iPhone 13 mini","iPhone 13","iPhone SE (3rd generation)","iPhone 12 Pro Max","iPhone 12 Pro","iPhone 12 mini","iPhone 11 Pro Max","iPhone 11 Pro","iPhone 11","iPhone SE (2nd generation)","iPhone XR","iPhone XS","iPhone X","iPhone 8 Plus","iPhone 8","iPhone 7 Plus","iPhone 7","iPhone 6s Plus","iPhone 6s","iPhone 6 Plus","iPhone 6","iPhone SE (1st generation)","iPhone 5s","iPhone 5c","iPhone 4s","iPhone 4","iPhone 3GS","iPhone 3G","iPhone (1st generation)","AirPods 2","AirPods 3","AirPods 4","AirPods 4 with ANC","AirPods 5","AirPods Pro 2","AirPods Pro 3","AirPods Max","AirPods Max 2","MagSafe Charger","MagSafe Battery","USB-C Charge Cable","Lightning Cable","USB-C to Lightning Cable","20W USB-C Power Adapter","30W USB-C Power Adapter","35W Dual USB-C Power Adapter","iPhone Silicone Case","iPhone Clear Case","iPhone Wallet with MagSafe","AirTag","AirTag Loop","Apple Pencil USB-C","Apple Pencil Pro","Apple Pencil (2nd generation)","Magic Keyboard","Magic Mouse","Magic Trackpad","Smart Folio","Apple Watch Sport Band","Apple Watch Magnetic Fast Charger"];
const extraIllustration=name=>/AirPods/i.test(name)?'airpods.svg':/Pencil/i.test(name)?'apple-pencil.svg':/Watch|Band/i.test(name)?'apple-watch-se.svg':/Cable|MagSafe|Adapter|Charger/i.test(name)?'power-adapter.svg':/Keyboard|Mouse|Trackpad/i.test(name)?'macbook-pro.svg':/AirTag|Case|Wallet|Folio|Loop/i.test(name)?'iphone-12.svg':'iphone-12.svg';
for(const name of extraProducts)if(!products.some(p=>p.name.toLowerCase()===name.toLowerCase()))products.push({id:products.length,name,price:null,img:extraIllustration(name),hint:'Дополнительный товар · Иллюстрация условная · Цена не назначена'});
const priceText=p=>p.price==null?'Цена не назначена':fmt(p.price);

// Game prices (not Apple's official prices). Keep every item in 1,000–90,000 ₽.
const excludedNames=new Set(['AirTag Loop','Smart Folio','iPhone 18 Pro Max','iPhone 18 Pro','AirPods 5','AirPods Max 2']);
for(let i=products.length-1;i>=0;i--)if(excludedNames.has(products[i].name))products.splice(i,1);
// Stable IDs matter for saved carts and training, so do not renumber existing products.
const allById=new Map(products.map(p=>[p.id,p]));
function gamePrice(p){
 if(p.name==='iPhone Duo')return 90000;
 if(p.price!=null)return Math.max(1000,Math.min(90000,p.price));
 if(/^iPhone /i.test(p.name)){
   const n=Number((p.name.match(/iPhone\s+(\d+)/i)||[])[1])||0;
   const base=n>=17?78000:n>=16?68000:n>=15?54000:n>=14?40000:n>=13?29000:n>=12?22000:n>=11?17000:n>=8?12000:6000;
   return Math.min(90000,base+(/Pro Max/i.test(p.name)?12000:/Pro/i.test(p.name)?8000:/Plus/i.test(p.name)?5000:0));
 }
 if(/AirPods Max/i.test(p.name))return 25000;
 if(/AirPods Pro/i.test(p.name))return 13000;
 if(/AirPods/i.test(p.name))return 7000;
 if(/MacBook/i.test(p.name))return 80000;
 if(/iPad/i.test(p.name))return 40000;
 if(/Watch/i.test(p.name))return 15000;
 return 3000;
}
products.forEach(p=>{if(p.name==='iPhone Duo'){p.img='iphone-duo.svg';p.hint='Складной iPhone · Игровая цена';}p.price=gamePrice(p);if(p.hint?.includes('Цена не назначена'))p.hint='Игровая цена · Фото может отличаться от модели'});
// Only show real Commons photos when the exact iPhone model is named in metadata.
// Other products keep their existing illustrations until a verified photo exists.
const photoLookupCache=new Map();
async function realPhonePhoto(name){
 if(photoLookupCache.has(name))return photoLookupCache.get(name);
 const job=(async()=>{
  const query=name.replace(/\s+(Blue|Orange|Pink)$/i,'');
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  u.search=new URLSearchParams({action:'query',generator:'search',gsrsearch:'filetype:bitmap "'+query+'"',gsrnamespace:'6',gsrlimit:'10',prop:'imageinfo',iiprop:'url|mime',iiurlwidth:'500',format:'json',origin:'*'}).toString();
  try{
   const r=await fetch(u.toString());if(!r.ok)return null;
   const data=await r.json();
   const normalized=query.toLowerCase().replace(/[^a-z0-9]/g,'');
   const page=Object.values(data.query?.pages||{}).find(p=>{
    const title=p.title.toLowerCase().replace(/[^a-z0-9]/g,'');
    const info=p.imageinfo?.[0];
    return title.includes(normalized)&&info?.thumburl?.startsWith('https://')&&/^image\/(jpeg|png|webp)$/.test(info.mime);
   });
   return page?.imageinfo?.[0]?.thumburl||null;
  }catch{return null}
 })();
 photoLookupCache.set(name,job);return job;
}
const phonePhotoObserver=('IntersectionObserver'in window)?new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){
  phonePhotoObserver.unobserve(entry.target);
  const img=entry.target;
  realPhonePhoto(img.dataset.phone).then(src=>{if(src&&img.isConnected){img.onerror=()=>{img.onerror=null;img.src=img.dataset.fallback};img.src=src}});
 }
},{rootMargin:'350px'}):null;

const $=id=>document.getElementById(id),fmt=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const read=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))??def}catch{return def}},save=(k,x)=>{try{localStorage.setItem(k,JSON.stringify(x));return true}catch{return false}};
let cart=read('miniCart',{}),samples=read('miniSamples',[]),stream=null,lastMatch=null;const product=id=>allById.get(Number(id));
function tab(page){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.page===page));['scan','catalog','cart','learn','ai'].forEach(p=>$(p+'Page').classList.toggle('hidden',p!==page));if(page==='cart')renderCart();if(page==='learn')renderTrained();if(page==='ai')$('chatInput').focus();if(page!=='scan')stopCamera()};document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>tab(b.dataset.page));
function add(id){if(!product(id)||product(id).price==null){toast('Сначала назначь цену этому товару.');return;}cart[id]=(cart[id]||0)+1;save('miniCart',cart);$('count').textContent='Корзина: '+Object.values(cart).reduce((a,b)=>a+b,0);renderCart();toast('Добавлено в корзину ✓')};function toast(t){$('scanMessage').textContent=t};
function renderCatalog(){let query=$('search').value.toLowerCase().trim();$('products').replaceChildren(...products.filter(p=>p.name.toLowerCase().includes(query)).map(p=>{let el=document.createElement('div');el.className='product';let img=document.createElement('img');img.className='productImage';img.src=p.img;img.alt=p.name;img.loading='lazy';if(p.name.startsWith('iPhone ')){img.dataset.phone=p.name;img.dataset.fallback=p.img;if(phonePhotoObserver)phonePhotoObserver.observe(img);else realPhonePhoto(p.name).then(src=>{if(src&&img.isConnected)img.src=src})}let title=document.createElement('h3');title.textContent=p.name;let note=document.createElement('small');note.textContent=p.hint||'Игровой товар';let row=document.createElement('div');row.className='row';let price=document.createElement('b');price.textContent=priceText(p);let btn=document.createElement('button');btn.textContent=p.price==null?'Нет цены':'+ Добавить';btn.disabled=p.price==null;btn.onclick=()=>add(p.id);row.append(price,btn);el.append(img,title,note,row);return el}))};$('search').oninput=renderCatalog;
function total(){return Object.entries(cart).reduce((sum,[id,n])=>sum+(product(id)?.price||0)*n,0)}function renderCart(){let target=$('cartItems');target.replaceChildren();if(!Object.keys(cart).length){let p=document.createElement('p');p.textContent='Корзина пока пустая';target.append(p)}Object.entries(cart).forEach(([id,n])=>{let p=product(id),el=document.createElement('div');el.className='row item';let left=document.createElement('div');let name=document.createElement('strong');name.textContent=p.name;let price=document.createElement('div');price.className='hint';price.textContent=p.price==null?'Цена не назначена':fmt(p.price*n);left.append(name,price);let controls=document.createElement('div');controls.className='qty';let minus=document.createElement('button');minus.textContent='−';minus.onclick=()=>changeQty(id,-1);let count=document.createElement('span');count.textContent=n;let plus=document.createElement('button');plus.textContent='+';plus.onclick=()=>changeQty(id,1);controls.append(minus,count,plus);el.append(left,controls);target.append(el)});$('total').textContent=fmt(total());$('count').textContent='Корзина: '+Object.values(cart).reduce((a,b)=>a+b,0);renderChange()};function changeQty(id,n){cart[id]=(cart[id]||0)+n;if(cart[id]<=0)delete cart[id];save('miniCart',cart);renderCart()};function renderChange(){let paid=$('cash').value,t=total(),el=$('change');el.className='notice';if(paid===''){el.textContent='Введи сумму оплаты, чтобы посчитать сдачу.';return}let diff=Number(paid)-t;if(diff<0){el.textContent='Не хватает: '+fmt(-diff)}else{el.textContent='Сдача: '+fmt(diff);el.classList.add('success')}}$('cash').value=read('miniCash','');$('cash').oninput=()=>{save('miniCash',$('cash').value);renderChange()};$('clearCart').onclick=()=>{if(confirm('Очистить корзину?')){cart={};save('miniCart',cart);$('cash').value='';save('miniCash','');renderCart()}};$('checkout').onclick=()=>{if(!total())return alert('Сначала добавь товар');if($('cash').value===''||Number($('cash').value)<total())return alert('Введи достаточную сумму оплаты');alert('Покупка завершена! 🎉\nИтого: '+fmt(total())+'\nСдача: '+fmt(Number($('cash').value)-total()));cart={};save('miniCart',cart);$('cash').value='';save('miniCash','');renderCart()};
function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;$('snap').disabled=true;$('cameraPlaceholder').classList.remove('hidden')}}$('startCam').onclick=async()=>{try{stopCamera();stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280}}});$('video').srcObject=stream;$('cameraPlaceholder').classList.add('hidden');$('snap').disabled=false;toast('Наведи камеру на коробку и нажми «Распознать».')}catch(e){toast('Камера недоступна: открой приложение по HTTPS в Safari и разреши доступ. Можно выбрать фото из галереи.')}};
// Fixed 16x16 grayscale layout + colored 4x4 grid. Uses simple normalized features; not semantic AI.
function features(canvas){const c=document.createElement('canvas');c.width=32;c.height=32;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(canvas,0,0,32,32);let d=x.getImageData(0,0,32,32).data,g=[],rgb=[];for(let i=0;i<d.length;i+=4){g.push(.299*d[i]+.587*d[i+1]+.114*d[i+2]);rgb.push([d[i],d[i+1],d[i+2]])}let mean=g.reduce((a,b)=>a+b,0)/g.length,sd=Math.sqrt(g.reduce((a,b)=>a+(b-mean)**2,0)/g.length)||1;let feat=[];for(let y=0;y<16;y++)for(let xx=0;xx<16;xx++){let k=(y*2)*32+xx*2;feat.push((g[k]+g[k+1]+g[k+32]+g[k+33]-4*mean)/(4*sd))}for(let y=0;y<4;y++)for(let xx=0;xx<4;xx++){let sums=[0,0,0];for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){let p=rgb[(y*8+dy)*32+xx*8+dx];p.forEach((v,i)=>sums[i]+=v)}sums.forEach(v=>feat.push(v/(64*255)))}return feat};
async function canvasFromFile(file){return new Promise((resolve,reject)=>{const img=new Image(),url=URL.createObjectURL(file);img.onload=()=>{const c=document.createElement('canvas');const m=640,scale=Math.min(1,m/Math.max(img.naturalWidth,img.naturalHeight));c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);resolve(c)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Не удалось открыть фото'))};img.src=url})};

// Built-in price list is the reference catalog. Read printed text from a box
// with an on-device OCR library (downloaded on first use), then match model.
// Product drawings in the catalog are illustrations, NOT real box training data.
let ocrLoader=null;
function loadOCR(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  if(ocrLoader)return ocrLoader;
  ocrLoader=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
    script.onload=()=>window.Tesseract?resolve(window.Tesseract):reject(Error('Модуль чтения текста недоступен'));
    script.onerror=()=>reject(Error('Не удалось загрузить модуль чтения текста'));
    document.head.appendChild(script);
  }).catch(e=>{ocrLoader=null;throw e});
  return ocrLoader;
}
function lookupExpandedBoxLabel(raw){
 const t=String(raw||'').toLowerCase().replace(/[^a-z0-9а-яё]+/g,' ').replace(/\s+/g,' ').trim();
 if(!t)return null;
 // First try complete, distinctive model names; partial names are not enough.
 const matches=products.filter(p=>{
   const n=p.name.toLowerCase().replace(/[^a-z0-9а-яё]+/g,' ').trim();
   if(n==='iphone'||n==='ipad')return false;
   return t.includes(n);
 }).sort((a,b)=>b.name.length-a.name.length);
 return matches.length?matches[0].id:null;
}
function productFromBoxText(raw){
 const t=String(raw||'').toLowerCase().replace(/[^a-z0-9а-яё]+/g,' ').replace(/\s+/g,' ').trim();
 const has=re=>re.test(t);
 const expanded=lookupExpandedBoxLabel(raw);if(expanded!==null)return expanded;
 // Only match an adapter if the printed PRODUCT is an adapter. Labels on
 // iPads/iPhones also mention a power adapter, so this must be last.
 if(has(/\bipad\b|ip[a4]d|айпад/))return has(/\bair\b|эйр|a1r/)?13:15;
 if(has(/\biphone\b|iph[o0]ne|айфон/)){
   if(has(/\b17\b/))return has(/orange|оранж/)?1:has(/blue|син|голуб/)?0:null;
   if(has(/\b15\b/))return 2;
   if(has(/\b14\b/))return 3;
   if(has(/\b13\b/))return has(/pink|розов/)?5:has(/blue|син|голуб/)?4:null;
   if(has(/\b12\b/))return 7;
   if(has(/\bxs\b|\bx\s*s\b/))return 6;
   if(has(/\b5\b/))return 8;
   return null;
 }
 if(has(/air\s*pods|аирподс|эйрподс/))return has(/\bpro\b|про/)?10:9;
 if(has(/mac\s*book|макбук/))return 14;
 if(has(/apple\s*watch|watch\s*se|вотч/))return 12;
 if(has(/apple\s*pencil|карандаш/))return 16;
 if(has(/power\s*adapter|usb.c\s*power\s*adapter|адаптер\s*питан/))return 11;
 return null;
}
function rotatedCanvas(src,degrees){
 const dst=document.createElement('canvas');const sideways=degrees%180!==0;
 dst.width=sideways?src.height:src.width;dst.height=sideways?src.width:src.height;
 const x=dst.getContext('2d');x.translate(dst.width/2,dst.height/2);
 x.rotate(degrees*Math.PI/180);x.drawImage(src,-src.width/2,-src.height/2);
 return dst;
}
async function recognizePrintedText(canvas){
 const t=await loadOCR();
 // Many box labels are printed sideways. Try four rotations, and stop when
 // the catalog model is unambiguous. Never silently guess a color.
 let best='';
 for(const angle of [0,90,270,180]){
   const c=angle?rotatedCanvas(canvas,angle):canvas;
   const result=await t.recognize(c,'eng');
   const value=result?.data?.text||'';
   if(value.length>best.length)best=value;
   if(productFromBoxText(value)!==null)return value;
 }
 return best;
}
async function imageMatch(c){
if(endpoint){try{toast('ИИ анализирует фотографию…');const data=await cloudRequest({mode:'vision',imageDataUrl:c.toDataURL('image/jpeg',0.72),products:products.map(p=>({id:p.id,name:p.name,price:p.price}))});if(Number.isInteger(data.productId)&&product(data.productId)){lastMatch=data.productId;let p=product(lastMatch);$('matchName').textContent=p.name;$('matchPrice').textContent=priceText(p);$('confidence').textContent='🤖 ИИ: '+(data.explanation||'Предположительное распознавание')+' — проверь коробку';$('scanResult').classList.remove('hidden');toast('Результат ИИ. Проверь модель перед покупкой.');return}toast('ИИ не смог определить модель. Попробуем по образцам.')}catch(e){toast('Не удалось связаться с ИИ: '+e.message+'. Проверяем по образцам.')}}try{
 toast('Читаем наклейку на задней стороне коробки (включая повёрнутый текст)… Первый запуск требует интернета.');
 const printed=await recognizePrintedText(c);
 const id=productFromBoxText(printed);
 if(id!==null){
   lastMatch=id;const p=product(id);
   $('matchName').textContent=p.name;
   $('matchPrice').textContent=priceText(p);
   $('confidence').textContent='📄 Модель прочитана с наклейки коробки. Проверь совпадение.';
   $('scanResult').classList.remove('hidden');
   toast('Найдена модель из прайс-листа. Проверь товар перед добавлением.');
   return;
 }
 toast('Надпись не распознана или не определён цвет. Проверяем сохранённые фотографии.');
}catch(e){toast('Чтение надписей недоступно: '+e.message+'. Проверяем сохранённые образцы.')}
if(samples.length===0){
 lastMatch=null;$('scanResult').classList.add('hidden');
 toast('Не удалось узнать модель по верхней картинке: нет фотографий настоящих коробок. Добавь фото в «Обучение» или выбери модель вручную.');
 return;
}
const f=features(c);
const scores=samples.filter(s=>product(s.id)&&Array.isArray(s.f)&&s.f.length===f.length)
 .map(s=>({id:s.id,score:Math.sqrt(f.reduce((sum,v,i)=>{const d=v-s.f[i];return sum+d*d},0)/f.length)}))
 .sort((a,b)=>a.score-b.score);
if(!scores.length){lastMatch=null;$('scanResult').classList.add('hidden');toast('Сохранённые фотографии повреждены. Добавь новые фото коробок.');return;}
const byId=[];for(const item of scores)if(!byId.some(x=>x.id===item.id))byId.push(item);
const best=byId[0],runnerUp=byId[1];
const confident=best.score<0.25&&(!runnerUp||runnerUp.score-best.score>0.09);
if(!confident){
 lastMatch=null;$('scanResult').classList.add('hidden');
 const top=byId.slice(0,3).map(x=>product(x.id).name).join(', ');
 toast('⚠️ Нет надёжного совпадения. Возможные модели: '+top+'. Не буду подставлять случайную цену. Добавь фото верхней стороны коробки в «Обучение» или выбери вручную.');
 return;
}
lastMatch=best.id;const p=product(best.id);
$('matchName').textContent=p.name;$('matchPrice').textContent=priceText(p);
$('confidence').textContent='📷 Совпало с сохранённым образцом. Проверь модель перед оплатой.';
$('scanResult').classList.remove('hidden');
toast('Нашли похожую коробку среди '+samples.length+' сохранённых фото.');}
$('snap').onclick=async()=>{if(!$('video').videoWidth)return;let c=document.createElement('canvas');c.width=$('video').videoWidth;c.height=$('video').videoHeight;c.getContext('2d').drawImage($('video'),0,0);imageMatch(c)};$('uploadScan').onclick=()=>$('scanFile').click();$('scanFile').onchange=async e=>{let f=e.target.files?.[0];if(f){try{imageMatch(await canvasFromFile(f))}catch(err){toast(err.message)}}e.target.value=''};$('addMatch').onclick=()=>{if(lastMatch!=null)add(lastMatch)};$('otherMatch').onclick=()=>tab('catalog');
products.forEach(p=>{let opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name;$('learnSelect').append(opt)});$('learnButton').onclick=()=>$('learnFile').click();$('learnFile').onchange=async e=>{let f=e.target.files?.[0];if(f){try{let c=await canvasFromFile(f);let id=Number($('learnSelect').value);samples.push({id,f:features(c)});if(!save('miniSamples',samples)){samples.pop();$('learnNote').textContent='Хранилище устройства заполнено.'}else{$('learnNote').textContent='Фото для '+product(id).name+' добавлено ✓'}renderTrained()}catch(err){$('learnNote').textContent=err.message}}e.target.value=''};function renderTrained(){let el=$('trained');el.replaceChildren();let title=document.createElement('strong');title.textContent='Сохранённые образцы: '+samples.length;el.append(title);products.forEach(p=>{let n=samples.filter(s=>s.id===p.id).length;if(!n)return;let div=document.createElement('div');div.className='row item';let name=document.createElement('span');name.textContent=p.name+' — '+n+' фото';let btn=document.createElement('button');btn.className='btn secondary';btn.textContent='Удалить';btn.onclick=()=>{samples=samples.filter(s=>s.id!==p.id);save('miniSamples',samples);renderTrained()};div.append(name,btn);el.append(div)})}$('resetTraining').onclick=()=>{if(confirm('Удалить все обучающие образцы?')){samples=[];save('miniSamples',samples);renderTrained()}};renderCatalog();renderCart();renderTrained();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});



// Bluetooth HID scanners type characters into the focused input and often send Enter.
const barcodeInput=$('barcodeInput'),barcodeStatus=$('barcodeStatus');
let barcodeMap=read('miniBarcodes',{}),currentBarcode='',matchedBarcodeId=null;
// Built-in demo codes printed on Mini Store label sheet.
const builtInBarcodes={
 '100014500001':'iPhone 14 Pro Max',
 '100014000002':'iPad Air',
 '100009000003':'AirPods Pro',
 '100012000004':'Apple Watch SE',
 '100020000005':'MacBook Pro',
 '100003000006':'Power Adapter',
 '100090000007':'iPhone Duo',
 '100009000008':'iPhone 12'
};
for(const [code,name] of Object.entries(builtInBarcodes)){
 const p=products.find(p=>p.name===name);
 if(p&&barcodeMap[code]===undefined)barcodeMap[code]=p.id;
}
save('miniBarcodes',barcodeMap);

const barcodeValid=code=>/^[0-9A-Za-z-]{4,64}$/.test(code);
const barcodeNormalize=value=>String(value||'').trim();
const barcodeProduct=$('barcodeProduct');
products.forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.name;barcodeProduct.append(o)});
function clearBarcodeResult(){
 matchedBarcodeId=null;$('barcodeFound').classList.add('hidden');$('barcodeUnknown').classList.add('hidden');
}
function lookupBarcode(){
 const code=barcodeNormalize(barcodeInput.value);currentBarcode=code;clearBarcodeResult();
 if(!barcodeValid(code)){barcodeStatus.textContent='Нужен штрихкод длиной от 4 до 64 символов. Попробуй ещё раз.';return;}
 const id=barcodeMap[code],p=product(id);
 if(p){
  matchedBarcodeId=p.id;
  $('barcodeName').textContent=p.name;$('barcodePrice').textContent=priceText(p);
  $('barcodeFound').classList.remove('hidden');
  barcodeStatus.textContent='✅ Код найден. Проверь товар и добавь в корзину.';
 }else{
  $('barcodeUnknown').classList.remove('hidden');
  barcodeStatus.textContent='Этот штрихкод пока неизвестен. Выбери товар и привяжи его к коду (один раз).';
 }
}
$('barcodeCheck').onclick=lookupBarcode;
$('barcodeFocus').onclick=()=>{barcodeInput.focus();barcodeInput.select();barcodeStatus.textContent='🔫 Сканируй код — пикалка введёт цифры сюда.'};
barcodeInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();lookupBarcode()}});
$('barcodeBind').onclick=()=>{
 const code=currentBarcode;
 if(!barcodeValid(code)){barcodeStatus.textContent='Сначала считай штрихкод.';return;}
 const p=product(barcodeProduct.value);
 if(!p)return;
 if(barcodeMap[code]!==undefined&&!confirm('Этот код уже привязан. Заменить товар?'))return;
 const previous={...barcodeMap};barcodeMap[code]=p.id;
 if(!save('miniBarcodes',barcodeMap)){barcodeMap=previous;barcodeStatus.textContent='Не получилось сохранить штрихкод.';return;}
 lookupBarcode();
};
$('barcodeAdd').onclick=()=>{
 if(matchedBarcodeId==null)return;
 const p=product(matchedBarcodeId);
 if(!p)return;
 add(p.id);barcodeStatus.textContent='✅ '+p.name+' добавлен в корзину. Сканируй следующий код.';
 barcodeInput.value='';clearBarcodeResult();barcodeInput.focus();
};
$('barcodeManage').onclick=()=>{
 const panel=$('barcodeManagePanel');panel.classList.toggle('hidden');if(panel.classList.contains('hidden'))return;
 panel.replaceChildren();const title=document.createElement('strong');title.textContent='Мои штрихкоды ('+Object.keys(barcodeMap).length+')';panel.append(title);
 Object.entries(barcodeMap).forEach(([code,id])=>{
  const p=product(id),line=document.createElement('div');line.className='row item';
  const t=document.createElement('span');t.textContent=code+' — '+(p?.name||'Неизвестный товар');
  const b=document.createElement('button');b.textContent='Удалить';b.className='btn secondary';
  b.onclick=()=>{if(confirm('Удалить привязку кода '+code+'?')){delete barcodeMap[code];save('miniBarcodes',barcodeMap);$('barcodeManage').click()}};
  line.append(t,b);panel.append(line);
 });
};

// Offline store commands and optional secure cloud AI. No API keys are placed in this app.
let endpoint=read('miniEndpoint',''),voiceOn=read('miniVoice',false),recognition=null;
const safeEndpoint=(s)=>{try{let u=new URL(s.trim());return u.protocol==='https:'?u.href.replace(/\/$/,''):''}catch{return ''}};
async function cloudRequest(payload){if(!endpoint)throw Error('ИИ-сервер не подключён');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});if(!r.ok)throw Error('сервер вернул '+r.status);const data=await r.json();if(data.error)throw Error(String(data.error));return data}finally{clearTimeout(timer)}}
function statusAI(){const el=$('aiStatus');el.textContent=endpoint?'Режим: облачный ИИ + локальные команды':'Режим: локальный помощник · без облачного ИИ';el.classList.toggle('ok',!!endpoint);$('apiEndpoint').value=endpoint;$('speakToggle').textContent='🔈 Ответы голосом: '+(voiceOn?'вкл':'выкл')}
function bubble(text,who='ai'){let d=document.createElement('div');d.className='bubble '+who;d.textContent=text;$('chatLog').append(d);$('chatLog').scrollTop=$('chatLog').scrollHeight}
function speak(text){if(!voiceOn||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replaceAll('₽',' рублей'));u.lang='ru-RU';u.rate=1;speechSynthesis.speak(u)}
const norm=t=>t.toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function findItems(message){const q=norm(message);const names=products.filter(p=>q.includes(norm(p.name)));if(names.length)return names.sort((a,b)=>b.name.length-a.name.length).filter((p,_,arr)=>!arr.some(other=>other!==p&&norm(other.name).includes(norm(p.name))));
const mapping=[[/эйрподс про|аирподс про|airpods pro/,10],[/эйрподс|аирподс|airpods/,9],[/айфон 17.*оранж|iphone 17 pro max orange/,1],[/айфон 17.*син|iphone 17 pro max blue/,0],[/айфон 15|iphone 15/,2],[/айфон 14|iphone 14/,3],[/айфон 13 роз|iphone 13 pink/,5],[/айфон 13 син|iphone 13 blue/,4],[/айфон xs|iphone xs/,6],[/айфон 12|iphone 12/,7],[/айфон 5|iphone 5/,8],[/макбук|macbook/,14],[/карандаш|pencil/,16],[/эпл вотч|apple watch|часы/,12],[/айпад эйр|ipad air/,13],[/айпад|ipad/,15],[/адаптер|зарядк|power adapter/,11]];return mapping.filter(([re])=>re.test(message.toLowerCase())).map(([,id])=>product(id)).filter(Boolean)}
function offlineReply(message){const q=norm(message),items=findItems(message),sum=total();if(/помощ|что уме|команд/.test(q))return 'Могу назвать цену, найти самый дешёвый или дорогой товар, добавить товар в корзину, показать сумму и рассчитать сдачу. Например: «Добавь AirPods Pro», «Сколько стоит iPad Air?»';
if(/корзин|касс|итог|сдач|оплат/.test(q)&&!(/добав|полож|убери|удали/.test(q))){let paid=Number($('cash').value);return 'В корзине '+Object.values(cart).reduce((a,b)=>a+b,0)+' шт. На сумму '+fmt(sum)+'. '+($('cash').value!==''?(paid>=sum?'Сдача '+fmt(paid-sum)+'.':'Не хватает '+fmt(sum-paid)+'.'):'Введи сумму оплаты на вкладке «Корзина», чтобы получить сдачу.')}
if(/очисти корзин|удали все из корзин/.test(q)){cart={};save('miniCart',cart);renderCart();return 'Корзина очищена.'}
if(/добав|полож|купи|возьми|в корзин/.test(q)&&items.length){const m=q.match(/(?:^|\s)([1-9])\s*(?:шт|штук|штуки|единиц)/),n=m?Math.min(9,Number(m[1])):1;for(const p of items)for(let k=0;k<n;k++)add(p.id);return 'Добавлено: '+items.map(p=>p.name+' × '+n).join(', ')+'. Итого: '+fmt(total())+'.'}
if(/убери|удали|минус/.test(q)&&items.length){items.forEach(p=>{delete cart[p.id]});save('miniCart',cart);renderCart();return 'Убрал из корзины: '+items.map(p=>p.name).join(', ')+'.'}
if(/дешев|недорог|дорог|самый/.test(q)){let list=/айфон|iphone/.test(q)?products.filter(p=>p.name.startsWith('iPhone')):products;let max=/дорог|максим/.test(q);let p=[...list].sort((a,b)=>max?b.price-a.price:a.price-b.price)[0];return (max?'Самый дорогой':'Самый дешёвый')+(list.length===products.length?' товар':' iPhone')+': '+p.name+' — '+priceText(p)+'.'}
if(items.length)return items.map(p=>p.name+' — '+priceText(p)).join('\n')+'.';
if(/список|каталог|все товар|прайс/.test(q))return products.map(p=>p.name+' — '+priceText(p)).join('\n');
const cashMatch=q.match(/(?:дал|дали|оплата|внес|наличн)\s+(\d+)/);if(cashMatch){$('cash').value=cashMatch[1];save('miniCash',$('cash').value);renderChange();return 'Покупатель дал '+fmt(Number(cashMatch[1]))+'. '+$('change').textContent}
return 'Я знаю цены товаров с назначенными ценами и умею управлять корзиной. Попробуй: «Сколько стоит iPhone 13 Pink?», «Добавь AirPods Pro», «Какая сдача?»';}
let busy=false;
async function messageAI(message){message=message.trim();if(!message||busy)return;bubble(message,'me');$('chatInput').value='';busy=true;$('sendChat').disabled=true;let answer;try{const local=offlineReply(message);if(endpoint){try{const out=await cloudRequest({mode:'chat',message,products:products.map(p=>({id:p.id,name:p.name,price:p.price})),cart:Object.entries(cart).map(([id,quantity])=>({id:Number(id),quantity})),paid:$('cash').value});answer=out.reply||local}catch(e){answer=local+'\n\n(Облачный ИИ недоступен: '+e.message+')'}}else answer=local;bubble(answer);speak(answer)}finally{busy=false;$('sendChat').disabled=false}}
$('sendChat').onclick=() =>messageAI($('chatInput').value);$('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')messageAI($('chatInput').value)});document.querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>messageAI(b.dataset.prompt));
$('openSettings').onclick=()=>$('settings').classList.toggle('hidden');$('saveEndpoint').onclick=()=>{let v=safeEndpoint($('apiEndpoint').value);if(!v){alert('Введи HTTPS-адрес своего ИИ-сервера');return}endpoint=v;save('miniEndpoint',endpoint);statusAI();bubble('Адрес ИИ-сервера сохранён. Проверь, что сервер настроен и разрешает запросы с этого сайта.')};$('removeEndpoint').onclick=()=>{endpoint='';save('miniEndpoint',endpoint);statusAI();bubble('Облачный ИИ отключён. Локальный режим продолжает работать.')};$('speakToggle').onclick=()=>{voiceOn=!voiceOn;save('miniVoice',voiceOn);statusAI();if(!voiceOn&&'speechSynthesis'in window)speechSynthesis.cancel()};
function listen(onResult){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Голосовой ввод не поддерживается этим браузером. Попробуй Safari на актуальной iOS или вводи текст.');return}if(recognition){recognition.stop();recognition=null;return}const rec=new SR();recognition=rec;rec.lang='ru-RU';rec.interimResults=false;rec.maxAlternatives=1;rec.onresult=e=>onResult(e.results[0][0].transcript);rec.onerror=e=>{bubble('Микрофон: '+e.error+'. Разреши доступ или введи текст.')};rec.onend=()=>{recognition=null;$('mic').textContent='🎙️'};try{rec.start();$('mic').textContent='🔴'}catch(e){recognition=null;alert(e.message)}}
$('mic').onclick=()=>listen(text=>messageAI(text));$('cashVoice').onclick=()=>listen(text=>{const n=text.replace(/\s/g,'').match(/\d+/);if(!n)return alert('Не удалось распознать сумму. Введи цифры вручную.');$('cash').value=n[0];save('miniCash',$('cash').value);renderChange()});$('smartPay').onclick=()=>{renderChange();const s=total(),v=$('cash').value;const result=!s?'Корзина пуста. Добавь товары.':v===''?'К оплате '+fmt(s)+'. Введи сумму, которую дал покупатель.':$('change').textContent;alert('✨ Умная касса\n'+result);speak(result)};
statusAI();bubble('Привет! Я помощник Mini Store 🤖 Спроси цену или скажи «Добавь AirPods Pro в корзину». Включи облачный ИИ в настройках для более свободного общения.');


// Public Wikimedia Commons images, fetched only when requested. Images remain
// their authors' property and are NOT bundled in the ZIP. Credits link to file pages.
const commonsSearch = async (name) => {
  const q = name.replace(/ Blue$| Orange$| Pink$/i,'').replace('Power Adapter','Apple power adapter');
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.search = new URLSearchParams({action:'query',generator:'search',gsrsearch:`filetype:bitmap ${q}`,gsrnamespace:'6',gsrlimit:'16',prop:'imageinfo',iiprop:'url|mime|extmetadata',iiurlwidth:'420',format:'json',origin:'*'}).toString();
  const response = await fetch(u.toString());
  if (!response.ok) throw new Error('Поиск временно недоступен');
  const data = await response.json();
  return Object.values(data.query?.pages||{}).filter(p=>p.imageinfo?.[0]?.thumburl && /^image\/(jpeg|png|webp)$/.test(p.imageinfo[0].mime) && p.imageinfo[0].thumburl.startsWith('https://')).slice(0,12);
};
const canvasFromInternet = (url) => new Promise((resolve,reject)=>{
  const img = new Image(); img.crossOrigin='anonymous'; img.referrerPolicy='no-referrer';
  img.onload = ()=>{
    try {const c=document.createElement('canvas');let k=Math.min(1,640/Math.max(img.naturalWidth,img.naturalHeight));c.width=Math.max(1,Math.round(img.naturalWidth*k));c.height=Math.max(1,Math.round(img.naturalHeight*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c)}
    catch(e){reject(new Error('Сайт изображения запрещает анализ. Сохрани фото и добавь через галерею.'))}
  };
  img.onerror = ()=>reject(new Error('Не удалось загрузить фото. Попробуй другое.'));
  img.src = url;
});
$('searchInternet').onclick=async()=>{
  const id=Number($('learnSelect').value),p=product(id),status=$('internetStatus'),target=$('internetResults');
  status.textContent='Ищем фотографии для '+p.name+'…';target.replaceChildren();$('searchInternet').disabled=true;
  try{
    const imgs=await commonsSearch(p.name);
    if(!imgs.length){status.textContent='Для модели не нашлось изображений. Добавь своё фото коробки.';return}
    status.textContent='Найдено '+imgs.length+' фото. Проверь модель и выбери нужное. Для поиска нужен интернет.';
    for(const data of imgs){const info=data.imageinfo[0],card=document.createElement('div');card.className='internetCard';
      const im=document.createElement('img');im.src=info.thumburl;im.alt=data.title;im.loading='lazy';
      const title=document.createElement('small');title.textContent=data.title.replace(/^File:/,'');title.title=data.title;
      const credit=document.createElement('a');credit.href=info.descriptionurl||'https://commons.wikimedia.org';credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent='Источник / лицензия';
      const btn=document.createElement('button');btn.textContent='＋ В обучение';btn.onclick=async()=>{
        btn.disabled=true;btn.textContent='Добавляем…';
        try{let c=await canvasFromInternet(info.thumburl);let sample={id,f:features(c),source:'Wikimedia Commons',url:info.descriptionurl||'',title:data.title};samples.push(sample);
          if(!save('miniSamples',samples)){samples.pop();throw Error('Не хватает памяти. Экспортируй сохранение и удали лишние образцы.')}
          renderTrained();$('learnNote').textContent='Добавлено интернет-фото для '+p.name+' ✓';btn.textContent='✓ Сохранено';
        }catch(e){btn.disabled=false;btn.textContent='＋ В обучение';$('learnNote').textContent=e.message}
      };
      card.append(im,title,credit,btn);target.append(card);
    }
  }catch(e){status.textContent='Не удалось найти фотографии: '+e.message+'. Используй свои фото.'}
  finally{$('searchInternet').disabled=false}
};
$('learnSelect').onchange=()=>{$('internetResults').replaceChildren();$('internetStatus').textContent='';};
$('exportSave').onclick=()=>{
 const data={format:'mini-store-save',version:3,date:new Date().toISOString(),samples,cart,barcodes:barcodeMap,cash:$('cash').value,voiceOn};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='mini-store-save.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);$('backupStatus').textContent='Файл сохранения готов. Сохрани его в «Файлы» на iPhone или iPad.';
};
$('importSave').onclick=()=>$('importSaveFile').click();
$('importSaveFile').onchange=async e=>{
 const f=e.target.files?.[0];if(!f)return;
 try{
  if(f.size>3000000)throw Error('Слишком большой файл');
  const d=JSON.parse(await f.text());if(d.format!=='mini-store-save'||!Array.isArray(d.samples)||typeof d.cart!=='object'||!d.cart)throw Error('Это не сохранение Mini Store');
  if(d.samples.length>300)throw Error('Слишком много образцов');
  if(!d.samples.every(s=>products.some(p=>p.id===s.id)&&Array.isArray(s.f)&&s.f.length===304&&s.f.every(n=>typeof n==='number'&&Number.isFinite(n))))throw Error('Повреждены данные обучения');
  const newCart={};for(const [key,value] of Object.entries(d.cart)){if(!product(key)||!Number.isInteger(value)||value<0||value>999)throw Error('Неверные данные корзины');if(value)newCart[key]=value;}
  if(!confirm('Заменить текущие данные данными из файла?'))return;
  if(!save('miniSamples',d.samples))throw Error('Не хватает памяти для образцов');
  samples=d.samples;cart=newCart;if(d.barcodes&&typeof d.barcodes==='object'&&!Array.isArray(d.barcodes)){const safe={};for(const [code,id] of Object.entries(d.barcodes)){if(barcodeValid(code)&&product(id))safe[code]=Number(id);}barcodeMap=safe;save('miniBarcodes',barcodeMap);}save('miniCart',cart);$('cash').value=String(d.cash||'');save('miniCash',$('cash').value);
  renderTrained();renderCart();$('backupStatus').textContent='Сохранение восстановлено: '+samples.length+' образцов ✓';
 }catch(err){$('backupStatus').textContent='Ошибка: '+err.message}finally{e.target.value=''}
};
