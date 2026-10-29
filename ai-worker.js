// Optional Cloudflare Worker backend. Store OPENAI_API_KEY as a Worker secret.
// Set ALLOWED_ORIGIN to your exact GitHub Pages origin (e.g. https://example.github.io).
export default {
 async fetch(request,env){
  const allowed=env.ALLOWED_ORIGIN||'';
  const origin=request.headers.get('Origin')||'';
  const cors={'Access-Control-Allow-Origin':allowed,'Vary':'Origin','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json; charset=utf-8'};
  const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
  if(!allowed||origin!==allowed)return response({error:'Origin not allowed'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(request.method!=='POST')return response({error:'POST only'},405);
  if(!env.OPENAI_API_KEY)return response({error:'Server API key is not configured'},503);
  const length=Number(request.headers.get('content-length')||0);
  if(length>1600000)return response({error:'Image too large'},413);
  let body;try{body=await request.json()}catch{return response({error:'Invalid JSON'},400)}
  if(!['vision','chat'].includes(body.mode))return response({error:'Invalid mode'},400);
  const products=Array.isArray(body.products)?body.products.slice(0,25).filter(p=>Number.isInteger(p.id)&&typeof p.name==='string'&&Number.isFinite(p.price)):[];
  const priceList=JSON.stringify(products);
  let messages;
  if(body.mode==='vision'){
    if(typeof body.imageDataUrl!=='string'||!/^data:image\/(jpeg|png|webp);base64,/.test(body.imageDataUrl)||body.imageDataUrl.length>1500000)return response({error:'Invalid image'},400);
    messages=[{role:'system',content:'You identify a product box for a pretend shop. Return ONLY a JSON object: {"productId": integer or null, "explanation": short Russian string}. Choose productId only from provided list. If ambiguous, return null. Colors and model distinctions matter. No assumptions. Products: '+priceList},{role:'user',content:[{type:'text',text:'Какая коробка изображена на фото? Не угадывай, если не уверен.'},{type:'image_url',image_url:{url:body.imageDataUrl,detail:'low'}}]}];
  }else{
    if(typeof body.message!=='string'||body.message.length>1000)return response({error:'Invalid message'},400);
    messages=[{role:'system',content:'Ты дружелюбный консультант игрового магазина Mini Store. Общайся по-русски, коротко. Все деньги игровые, рубли. Ни в коем случае не изменяй цены и не придумывай товары. Только эти товары и цены: '+priceList+'. Корзина сейчас: '+JSON.stringify(body.cart||[])+'. Покупатель дал: '+String(body.paid||'не указано')+'. Ты можешь отвечать и советовать; НЕ утверждай, что ты выполнил добавление/удаление товаров в приложении, так как у тебя нет доступа к действиям. Для изменения корзины попроси воспользоваться локальной командой.'},{role:'user',content:body.message}];
  }
  try{
    const upstream=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4.1-mini',messages,max_tokens:220,...(body.mode==='vision'?{response_format:{type:'json_object'}}:{})})});
    if(!upstream.ok)return response({error:'AI service request failed'},502);
    const out=await upstream.json();const result=out.choices?.[0]?.message?.content||'';
    if(body.mode==='chat')return response({reply:result});
    let parsed;try{parsed=JSON.parse(result)}catch{return response({productId:null,explanation:'Не удалось определить модель'})}
    const id=parsed.productId;
    return response({productId:Number.isInteger(id)&&products.some(p=>p.id===id)?id:null,explanation:String(parsed.explanation||'').slice(0,180)});
  }catch{return response({error:'AI service unavailable'},502)}
 }
};
