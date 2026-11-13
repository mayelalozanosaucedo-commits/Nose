'use strict';
// Cuboverso Alpha: servidor privado HTTP + WebSocket, sin dependencias npm.
// Node.js 18+, LAN and cloud. Serve from HTTPS reverse proxy (e.g. Railway) for online play.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const PORT=Number(process.env.PORT||3000);
const HOST=process.env.HOST||'0.0.0.0';
const ROOT=__dirname;
const DATA_DIR=path.resolve(process.env.DATA_DIR||process.env.RAILWAY_VOLUME_MOUNT_PATH||ROOT);
fs.mkdirSync(DATA_DIR,{recursive:true});
const WORLDS_FILE=path.join(DATA_DIR,'mundos_servidor.json');
const ACCESS_KEY=String(process.env.ACCESS_KEY||'');
const MAX_ROOMS=Number(process.env.MAX_ROOMS||100);
const MAX_CONNECTIONS=Number(process.env.MAX_CONNECTIONS||80);
let connectedSockets=0;
function verifyKey(key){if(!ACCESS_KEY)return true;const a=crypto.createHash('sha256').update(String(key||'')).digest();const b=crypto.createHash('sha256').update(ACCESS_KEY).digest();return crypto.timingSafeEqual(a,b);}
function roomCode(){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return [...crypto.randomBytes(8)].map(b=>alphabet[b%alphabet.length]).join('');}
const rooms=new Map();
let dataOnDisk={};
try { dataOnDisk=JSON.parse(fs.readFileSync(WORLDS_FILE,'utf8')); } catch(e) { dataOnDisk={}; }
for(const [code,room] of Object.entries(dataOnDisk)){
 if(!/^[A-Z0-9]{6,8}$/.test(code)||!room||!room.seedText)continue;
 rooms.set(code,{code,seedText:String(room.seedText),mode:room.mode==='creative'?'creative':'survival',worldName:String(room.worldName||'Mundo Alpha').slice(0,32),changes:new Map(Array.isArray(room.changes)?room.changes.filter(x=>Array.isArray(x)&&x.length===4).map(x=>[x.slice(0,3).join(','),x]):[]),furnaces:room.furnaces||{},playerData:room.playerData||{},connections:new Set(),clock:room.clock??.23,daysPassed:room.daysPassed||1});
}
let saveTimer=null;
function persist(){const obj={};for(const [code,r] of rooms){obj[code]={seedText:r.seedText,mode:r.mode,worldName:r.worldName,changes:[...r.changes.values()],furnaces:r.furnaces,playerData:r.playerData,clock:r.clock,daysPassed:r.daysPassed};}
 const tmp=WORLDS_FILE+'.tmp';try{fs.writeFileSync(tmp,JSON.stringify(obj));fs.renameSync(tmp,WORLDS_FILE);}catch(e){console.error('Error guardando mundos:',e.message);}}
function scheduleSave(){if(saveTimer)return;saveTimer=setTimeout(()=>{saveTimer=null;persist();},1500);saveTimer.unref?.();}
function frame(payload,opcode=1){let b=Buffer.isBuffer(payload)?payload:Buffer.from(String(payload),'utf8');let h;if(b.length<126){h=Buffer.from([0x80|opcode,b.length]);}else if(b.length<65536){h=Buffer.alloc(4);h[0]=0x80|opcode;h[1]=126;h.writeUInt16BE(b.length,2);}else{h=Buffer.alloc(10);h[0]=0x80|opcode;h[1]=127;h.writeBigUInt64BE(BigInt(b.length),2);}return Buffer.concat([h,b]);}
function send(c,msg){if(c.closed||c.socket.destroyed)return;try{c.socket.write(frame(JSON.stringify(msg)));}catch(e){c.closed=true;}}
function broadcast(room,msg,exclude=null){for(const c of room.connections)if(c!==exclude)send(c,msg);}
function fail(c,message){send(c,{type:'error',message});}
function getRoom(c){return c.room;}
function cleanName(name){return String(name||'Jugador').replace(/[^\p{L}\p{N} _.-]/gu,'').trim().slice(0,18)||'Jugador';}
function enter(c,r,name,playerId){if(c.room)return fail(c,'Ya estás dentro de una sala.');if(r.connections.size>=12)return fail(c,'Sala llena (máximo 12 jugadores).');
 const lower=name.toLowerCase();if([...r.connections].some(o=>o.name.toLowerCase()===lower))return fail(c,'Ese nombre ya está en uso en esta sala. Elige otro.');
 c.room=r;c.name=name;c.playerKey=(typeof playerId==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(playerId))?'id:'+playerId:'name:'+name;c.id=crypto.randomBytes(6).toString('hex');c.host=r.connections.size===0;c.x=48;c.y=25;c.z=48;c.yaw=0;c.armor=r.playerData[c.playerKey]?.armor||r.playerData[name]?.armor||{};
 const players=[...r.connections].map(o=>({id:o.id,name:o.name,x:o.x,y:o.y,z:o.z,yaw:o.yaw,armor:o.armor}));r.connections.add(c);
 send(c,{type:'welcome',room:r.code,seedText:r.seedText,mode:r.mode,worldName:r.worldName,changes:[...r.changes.values()],furnaces:r.furnaces,clock:r.clock,daysPassed:r.daysPassed,player:r.playerData[c.playerKey]||r.playerData[name]||null,players,host:c.host});
 broadcast(r,{type:'joined',id:c.id,name:c.name,player:{id:c.id,name:c.name,x:c.x,y:c.y,z:c.z,yaw:c.yaw,armor:c.armor}},c);
 console.log(`${name} entró a ${r.code}. Jugadores: ${r.connections.size}`);
}
function onMessage(c,msg){if(!msg||typeof msg!=='object'||!msg.type)return;
 if(msg.type==='create'||msg.type==='join'){
  if(c.room)return fail(c,'Ya estás dentro de una sala.');if(!verifyKey(msg.accessKey))return fail(c,'Contraseña del servidor incorrecta.');
  if((c.authAttempts=(c.authAttempts||0)+1)>8){c.socket.destroy();return;}const name=cleanName(msg.name);
  if(msg.type==='create'){if(rooms.size>=MAX_ROOMS)return fail(c,'Límite de mundos alcanzado en este servidor.');let code;do{code=roomCode();}while(rooms.has(code));
   let r={code,seedText:String(msg.seedText||Date.now()).slice(0,32),mode:msg.mode==='creative'?'creative':'survival',worldName:String(msg.worldName||'Mundo de amigos').slice(0,32),changes:new Map(),furnaces:{},playerData:{},connections:new Set(),clock:.23,daysPassed:1};rooms.set(code,r);scheduleSave();enter(c,r,name,msg.playerId);
  }else{const code=String(msg.code||'').replace(/[^A-Z0-9]/gi,'').toUpperCase();let r=rooms.get(code);if(!r)return fail(c,'No existe esa sala. Pide el código al anfitrión.');enter(c,r,name,msg.playerId);}
  return;
 }
 const r=getRoom(c);if(!r)return fail(c,'Primero entra a una sala.');
 switch(msg.type){
 case 'move':{
  if(Date.now()-(c.lastMove||0)<65)break;c.lastMove=Date.now();const {x,y,z,yaw}=msg;
  if(![x,y,z,yaw].every(Number.isFinite)||x<0||x>96||z<0||z>96||y<0||y>60)break;
  c.x=x;c.y=y;c.z=z;c.yaw=yaw;c.armor=safeArmor(msg.armor);
  broadcast(r,{type:'move',id:c.id,name:c.name,x,y,z,yaw,armor:c.armor},c);break;}
 case 'block':{
  const {x,y,z,t}=msg;if(![x,y,z,t].every(Number.isInteger)||x<0||x>=96||z<0||z>=96||y<1||y>=44||t<0||t>27)break;
  if(r.changes.size>250000)return fail(c,'Este mundo alcanzó el máximo de modificaciones.');r.changes.set(`${x},${y},${z}`,[x,y,z,t]);broadcast(r,{type:'block',x,y,z,t},c);scheduleSave();break;}
 case 'chat':{
  const now=Date.now();if(now-(c.lastChat||0)<700)break;c.lastChat=now;const text=String(msg.text||'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,160);
  if(text)broadcast(r,{type:'chat',name:c.name,text});break;}
 case 'save':{
  if(!msg.player||typeof msg.player!=='object')break;
  const v=msg.player;let inv=v.inv&&typeof v.inv==='object'?Object.fromEntries(Object.entries(v.inv).slice(0,200).filter(([k,n])=>typeof k==='string'&&k.length<40&&Number.isFinite(n)&&n>=0&&n<=9999)):{};
  const p={inv,hotbar:Array.isArray(v.hotbar)?v.hotbar.slice(0,9):[],selected:Number.isInteger(v.selected)?v.selected:0,health:Number.isFinite(v.health)?Math.max(0,Math.min(100,v.health)):100,hunger:Number.isFinite(v.hunger)?Math.max(0,Math.min(100,v.hunger)):100,armor:safeArmor(v.armor),pos:Array.isArray(v.pos)?v.pos.slice(0,3).map(n=>Number.isFinite(n)?n:48):[48,25,48],yaw:Number.isFinite(v.yaw)?v.yaw:0,pitch:Number.isFinite(v.pitch)?v.pitch:0};
  r.playerData[c.playerKey]=p;scheduleSave();break;}
 case 'armor':{c.armor=safeArmor(msg.armor);broadcast(r,{type:'armor',id:c.id,name:c.name,armor:c.armor},c);break;}
 case 'furnace':{
  const key=String(msg.key||'');if(!/^\d{1,2},\d{1,2},\d{1,2}$/.test(key))break;
  if(msg.state===null){delete r.furnaces[key];broadcast(r,{type:'furnace',key,state:null},c);scheduleSave();break;}
  if(!msg.state||typeof msg.state!=='object')break;
  const st=msg.state;const validId=v=>v===null||typeof v==='string'&&/^[a-z_]{1,40}$/.test(v);if(!['input','fuel','out'].every(k=>validId(st[k+'Id'])&&Number.isFinite(st[k+'Count'])&&st[k+'Count']>=0&&st[k+'Count']<=9999))break;
  if(st.owner!==c.name)break;r.furnaces[key]=st;broadcast(r,{type:'furnace',key,state:st},c);scheduleSave();break;}
 }
}
function safeArmor(a){let o={};if(!a||typeof a!=='object')return o;for(const k of ['head','chest','legs','feet']){const v=a[k];if(typeof v==='string'&&/^(leather|iron|gold|diamond)_(helmet|chest|legs|boots)$/.test(v))o[k]=v;}return o;}
function leave(c){if(c.closed)return;c.closed=true;const r=c.room;if(!r)return;r.connections.delete(c);broadcast(r,{type:'left',id:c.id,name:c.name});if(c.host&&r.connections.size){const first=r.connections.values().next().value;first.host=true;send(first,{type:'host',host:true});broadcast(r,{type:'chat',name:'Sistema',text:`${first.name} ahora administra la sala.`});}console.log(`${c.name} salió de ${r.code}`);}
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost').pathname;
 if(u==='/'||u==='/index.html'||u==='/cuboverso_alpha_1_0.html'){
  try{const file=fs.readFileSync(path.join(ROOT,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(file);}catch(e){res.writeHead(500);res.end('No se encontró index.html');}return;
 }
 if(u==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,rooms:rooms.size,players:[...rooms.values()].reduce((n,r)=>n+r.connections.size,0)}));return;}
 res.writeHead(404,{'Content-Type':'text/plain'});res.end('No encontrado');
});
server.on('upgrade',(req,socket,head)=>{
 if(connectedSockets>=MAX_CONNECTIONS){socket.end('HTTP/1.1 503 Service Unavailable\r\n\r\n');return;}
 const origin=req.headers.origin,host=req.headers.host;
 if(origin&&origin!=='null'){try{if(new URL(origin).host!==host) {socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');return;}}catch(e){socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');return;}}
 const key=req.headers['sec-websocket-key'];if(!key||req.headers.upgrade?.toLowerCase()!=='websocket'||req.url?.split('?')[0]!=='/'){
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');return;}
 const accept=crypto.createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
 socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');
 connectedSockets++;const c={socket,buffer:Buffer.alloc(0),closed:false,room:null,name:'',host:false};
 const processFrames=(chunk)=>{
  c.buffer=Buffer.concat([c.buffer,chunk]);if(c.buffer.length>2_000_000){socket.destroy();return;}
  while(c.buffer.length>=2){const b=c.buffer;const fin=!!(b[0]&0x80),opcode=b[0]&15,masked=!!(b[1]&0x80);let len=b[1]&127,ofs=2;
   if(len===126){if(b.length<4)return;len=b.readUInt16BE(2);ofs=4;}else if(len===127){if(b.length<10)return;const n=b.readBigUInt64BE(2);if(n>1_000_000n){socket.destroy();return;}len=Number(n);ofs=10;}
   if(!masked||len>1_000_000){socket.destroy();return;}if(b.length<ofs+4+len)return;
   const mask=b.subarray(ofs,ofs+4),buf=b.subarray(ofs+4,ofs+4+len);const payload=Buffer.allocUnsafe(len);for(let i=0;i<len;i++)payload[i]=buf[i]^mask[i%4];c.buffer=b.subarray(ofs+4+len);
   if(opcode===8){socket.end(frame(Buffer.alloc(0),8));return;}if(opcode===9){socket.write(frame(payload,10));continue;}if(opcode===10)continue;
   if(opcode!==1||!fin){socket.destroy();return;}
   try{onMessage(c,JSON.parse(payload.toString('utf8')));}catch(e){fail(c,'Mensaje inválido');}
  }
 };
 socket.on('data',processFrames);if(head?.length)processFrames(head);
 socket.on('end',()=>leave(c));socket.on('close',()=>{leave(c);connectedSockets=Math.max(0,connectedSockets-1);});socket.on('error',()=>leave(c));
});
server.listen(PORT,HOST,()=>{console.log('CUBOVERSO ALPHA MULTIJUGADOR');console.log(`Servidor activo en http://localhost:${PORT}`);console.log('Para compartir dentro de tu WiFi, abre http://IP-DE-TU-PC:'+PORT+' desde otro dispositivo.');console.log('Salas privadas por código, sin directorio público.');console.log('Carpeta de mundos:',DATA_DIR);console.log('Contraseña de acceso:',ACCESS_KEY?'activada':'desactivada (configura ACCESS_KEY para publicar)');});
process.on('SIGINT',()=>{persist();process.exit(0);});process.on('SIGTERM',()=>{persist();process.exit(0);});
