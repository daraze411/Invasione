const INV=(function(){
'use strict';
const FR=['Spazio Profondo','Atmosfera','Superficie Terrestre'];
const EVN={1:'Solo dadi pari',2:'Solo dadi dispari',3:'Solo 1, 2 e 3',4:'Solo 4, 5 e 6',5:'Scala',6:'Stesso valore',7:'Combattimento',8:'Paga 1 € a dado · vittoria 2 PV',9:'Spazi azione (lato B)',10:'Dal più alto al più basso',11:'Dopo un dado, modifica di 1 un altro tuo dado',12:'Nessun effetto'};
const EVD={1:'Si piazzano solo 2, 4, 6.',2:'Si piazzano solo 1, 3, 5.',3:'Si piazzano solo 1, 2, 3.',4:'Si piazzano solo 4, 5, 6.',5:'Dadi consecutivi senza buchi, min. 2. Si estende da entrambi i lati.',6:'Il primo dado fissa il valore dei successivi (per fazione). Min. 2 dadi.',7:'Ogni nuovo dado attacca una nave avversaria: i due valori si sottraggono a vicenda in contemporanea. Chi ha il valore maggiore resta con la differenza, l\'altro è eliminato; a parità sono eliminate entrambe. Max 1 PV sul Fronte.',8:'Ogni piazzamento costa 1 €. Il vincitore prende 2 PV.',9:'Nessuna battaglia. Ogni dado occupa uno spazio azione (4, esclusivi).',10:'Ogni nuovo dado ≤ del precedente.',11:'Dopo ogni piazzamento modifica di ±1 un tuo altro dado.',12:'Nessuna limitazione.'};
const CN={M:'Valore massimo',DH:'Più dadi (parità: somma alta)',DL:'Più dadi (parità: somma bassa)',B:'Bersaglio 12'};
const SPN=[['Scarta una Tecnologia, +2 €','Paga 1 €, pesca una Tecnologia','Paga 4 €, gioca una nave extra','Paga 2 €, ruba una Tecnologia'],['+2 €','Pesca una Tecnologia','Paga 1 €, sposta una tua nave','Paga 2 €, sposta una nave avversaria'],['+1 €','Scarta una Tecnologia e pescane un\'altra','Paga 1 €, ±1 a una tua nave','Paga 2 €, ±1 a una nave avversaria']];
const TECH={
1:{k:'modSelf2',v:[1,6],t:'Aggiungi o sottrai 1 o 2 a una tua nave'},
2:{k:'modOpp2',v:[2,5],t:'Aggiungi o sottrai 1 o 2 a una nave avversaria'},
3:{k:'modSelf1',v:[3,4],t:'Aggiungi o sottrai 1 a una tua nave OPPURE paga 1 € e scegli il valore'},
4:{k:'modOpp1',v:[4,3],t:'Aggiungi o sottrai 1 a una nave avversaria OPPURE paga 1 € e scegli il valore'},
5:{k:'reroll',v:[5,2],t:'Guadagna 1 € e rilancia una tua nave'},
6:{k:'reroll',v:[6,1],t:'Guadagna 1 € e rilancia una tua nave'},
7:{k:'reroll',v:[1,6],t:'Guadagna 1 € e rilancia una tua nave'},
8:{k:'moveOpp',v:[2,5],t:'Spendi 1 € e sposta una nave avversaria'},
17:{k:'moveOpp',v:[5,2],t:'Spendi 1 € e sposta una nave avversaria'},
9:{k:'trade',v:[3,4],t:'Spendi 2 € e 2 Tecnologie: guadagni 1 PV e 1 Virus'},
21:{k:'trade',v:[3,4],t:'Spendi 2 € e 2 Tecnologie: guadagni 1 PV e 1 Virus'},
10:{k:'resp',v:[4,3],t:'Spendi 1 € e respingi un attacco avversario'},
11:{k:'resp',v:[5,2],t:'Spendi 1 € e respingi un attacco avversario'},
12:{k:'gain2',v:[6,1],t:'Guadagna 2 €'},
13:{k:'gain2',v:[1,6],t:'Guadagna 2 €'},
14:{k:'freeze',v:[2,5],t:'Congela una tua nave: non può essere spostata o modificata'},
15:{k:'swapCond',v:[3,4],t:'Spendi 3 € e scambia due Token Condizione'},
16:{k:'peek',v:[4,3],t:'Rimuovi 1 Virus e guarda una Tecnologia avversaria'},
18:{k:'fac',v:[6,1],t:'Esclusiva'},
19:{k:'fac',v:[1,6],t:'Esclusiva'},
25:{k:'fac',v:[],t:'Iniziale'},
26:{k:'fac',v:[],t:'Iniziale'},
20:{k:'jolly',v:[1,2,3,4,5,6],t:'Carta jolly (solo per i valori)'},
22:{k:'special',v:[4,3],t:'Esclusiva'},
23:{k:'regrow',v:[5,2],t:'Spendi 1 €: scegli una carta dagli scarti e mettila in mano'},
24:{k:'wipe',v:[6,1],t:'Spendi 2 € e guadagna 1 Virus: scarta tutti i dadi da un fronte'},
27:{k:'skipG',v:[6,1],t:'L\'avversario salta un turno, ma guadagna 1 €'},
28:{k:'skipV',v:[1,6],t:'L\'avversario salta un turno, ma rimuove 1 Virus'}};
const WORTH={modSelf2:.9,modOpp2:.9,modSelf1:.8,modOpp1:.8,reroll:.5,moveOpp:.8,trade:.5,resp:.7,gain2:.4,freeze:.3,swapCond:.4,peek:.2,reinf:.6,mobil:.7,contagion:.6,mutate:.8,vacc:.3,rerollR:.3,mimic:.3,spore:.3,jolly:.6,steal:.8,swapShips:.9,regrow:.3,wipe:.7,skipG:.5,skipV:.6};
const VIRN={1:'Scarta una tua nave per questo round',2:'L\'avversario rilancia una tua nave',3:'Il round termina (o il contatore va al turno 5)',4:'Paga 1 € o elimina 2 Tecnologie dal mazzo',5:'Fino a fine round ogni Virus vale doppio',6:'Ritira una tua nave da un fronte e rilanciala',7:'L\'avversario guadagna 1 €'};
const FX={18:{T:'reinf',A:'contagion'},19:{T:'mobil',A:'mutate'},22:{T:'steal',A:'swapShips'},25:{T:'vacc',A:'mimic'},26:{T:'rerollR',A:'spore'}};
const FT={steal:'Ruba 2 Tecnologie dalla mano dell\'avversario e conservane una',swapShips:'Scambia una tua nave con una nave avversaria',
 reinf:'Rinforzi: recupera una tua nave eliminata o scartata in questo round, rilanciala e rimettila in riserva',
 mobil:'Mobilitazione: schiera 2 navi con una sola azione',
 contagion:'Contagio: paga 1 €, l\'avversario prende 1 Virus',
 mutate:'Mutazione: paga 1 €, capovolgi una nave, tua o avversaria. Se colpisce una nave avversaria può essere respinta',
 vacc:'Vaccino: rimuovi 1 segnalino Virus e guadagna 1 €',
 rerollR:'Rilancio tattico: rilancia fino a 2 tue navi in riserva',
 mimic:'Mimetismo: modifica di ±1 una tua nave in riserva, senza prendere Virus',
 spore:'Spore: fino a fine round, ogni volta che l\'avversario prende un Virus guadagni 1 €'};
/* le carte aliene hanno id +100: una carta resta la stessa anche quando cambia mano */
const cb=id=>id%100,cf=id=>id>100?'A':'T';
function tk(s,p,id){const x=FX[cb(id)];return x?x[cf(id)]:TECH[cb(id)].k;}
function tt(s,p,id){const x=FX[cb(id)];return x?FT[x[cf(id)]]:TECH[cb(id)].t;}
function isStart(id){return cb(id)===25||cb(id)===26;}
function worth(s,p,id){return WORTH[tk(s,p,id)]||.3;}
/* rng */
function rnd(s){s.rs=(s.rs+0x6D2B79F5)|0;let t=Math.imul(s.rs^s.rs>>>15,1|s.rs);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
function ri(s,n){return Math.floor(rnd(s)*n);}
function shuffle(s,a){for(let i=a.length-1;i>0;i--){const j=ri(s,i+1);const x=a[i];a[i]=a[j];a[j]=x;}return a;}
function clone(s){const lg=s.log;s.log=[];const t=JSON.parse(JSON.stringify(s));s.log=lg;return t;}
function log(s,t,to){if(!s.nl)s.log.push({t,to:to===undefined?null:to});}
function qev(s,o){if(!s.nl)s.q.push(o);}
function fn(s,p){return s.fac[p]==='T'?'Terrestri':'Alieni';}
function gain(s,p,n){s.co[p]=Math.min(5,s.co[p]+n);}
function drawT(s,p){if(s.hand[p].length<5&&s.deck[p].length){s.hand[p].push(s.deck[p].pop());return true;}return false;}
function rem(a,x){const i=a.indexOf(x);if(i>=0)a.splice(i,1);}
function uniq(a){return a.filter((x,i)=>a.indexOf(x)===i);}
/* ships */
function onFront(s,f,p){return s.dice[p].filter(d=>d.loc==='F'&&d.f===f).sort((a,b)=>a.ord-b.ord);}
function ladder(sh){const by={};sh.forEach(d=>{if(!by[d.v])by[d.v]=d;});let best=[],bs=-1;
 for(let a=1;a<=6;a++){if(!by[a]||by[a-1])continue;const run=[];let b=a;while(by[b]){run.push(by[b]);b++;}const sm=run.reduce((x,d)=>x+d.v,0);if(run.length>best.length||(run.length===best.length&&sm>bs)){best=run;bs=sm;}}
 return best;}
function validShips(s,f,p){const fr=s.fr[f];if(fr.flip)return[];const sh=onFront(s,f,p);
 switch(fr.ev){
 case 1:return sh.filter(d=>d.v%2===0);
 case 2:return sh.filter(d=>d.v%2===1);
 case 3:return sh.filter(d=>d.v<=3);
 case 4:return sh.filter(d=>d.v>=4);
 case 5:{const L=ladder(sh);return L.length>=2?L:[];}
 case 6:{if(!sh.length)return[];const m=sh.filter(d=>d.v===sh[0].v);return m.length>=2?m:[];}
 case 10:{let last=99;const o=[];for(const d of sh){if(d.v<=last){o.push(d);last=d.v;}}return o;}
 default:return sh;}}
function sumv(a){let x=0;for(const d of a)x+=d.v;return x;}
function placeOk(s,p,d,f){const fr=s.fr[f];if(fr.flip||d.loc!=='R')return false;if(fr.ev===8&&s.co[p]<1)return false;
 const sh=onFront(s,f,p),v=d.v;
 switch(fr.ev){case 1:if(v%2)return false;break;case 2:if(!(v%2))return false;break;case 3:if(v>3)return false;break;case 4:if(v<4)return false;break;
 case 5:if(sh.length){const L=ladder(sh);if(v!==L[0].v-1&&v!==L[L.length-1].v+1)return false;}break;
 case 6:if(sh.length&&v!==sh[0].v)return false;break;
 case 10:if(sh.length&&v>sh[sh.length-1].v)return false;break;}
 if(fr.cond==='B'){const o=[d.loc,d.f,d.ord];d.loc='F';d.f=f;d.ord=1e9;const sm=sumv(validShips(s,f,p));d.loc=o[0];d.f=o[1];d.ord=o[2];if(sm>12)return false;}
 return true;}
function dlab(s,d){if(d.loc==='R')return 'dado '+d.v+' in riserva';if(d.loc==='F'){const nul=!validShips(s,d.f,d.p).includes(d);return 'dado '+d.v+' su '+FR[d.f]+(nul?' (nullo)':'')+(d.fz?' ❄':'');}return 'dado '+d.v;}
function pm(s,m){const u=[];for(const e of m){const tg=e.fr!==undefined?s.fr[e.fr]:s.dice[e.o][e.i];const old={};for(const k in e.set){old[k]=tg[k];tg[k]=e.set[k];}u.push([tg,old]);}return u;}
function um(u){for(let i=u.length-1;i>=0;i--)Object.assign(u[i][0],u[i][1]);}
function okOwn(s,d,nv){if(d.loc!=='F')return true;const was=validShips(s,d.f,d.p).includes(d);if(!was)return true;const o=d.v;d.v=nv;const now=validShips(s,d.f,d.p).includes(d);d.v=o;return now;}
function modOpts(s,p,owner,deltas,allowSet,self){const out=[],seen={};
 for(const d of s.dice[owner]){if(d.fz||(d.loc!=='R'&&d.loc!=='F'))continue;
  if(d.loc==='R'){const k=d.v;if(seen[k])continue;seen[k]=1;}
  for(const dl of deltas){const nv=d.v+dl;if(nv<1||nv>6)continue;if(self&&!okOwn(s,d,nv))continue;out.push({l:dlab(s,d)+' → '+nv,v:{o:owner,i:d.i,nv,c:0},m:[{o:owner,i:d.i,set:{v:nv}}]});}
  if(allowSet&&s.co[p]>=1)for(let nv=1;nv<=6;nv++){if(nv===d.v)continue;if(self&&!okOwn(s,d,nv))continue;out.push({l:dlab(s,d)+' → '+nv+' (−1 €)',v:{o:owner,i:d.i,nv,c:1},m:[{o:owner,i:d.i,set:{v:nv}}]});}}
 return out;}
function moveOpts(s,owner){const out=[];for(const d of s.dice[owner]){if(d.loc!=='F'||d.fz||s.fr[d.f].flip)continue;for(let g=0;g<3;g++){if(g===d.f||s.fr[g].flip)continue;out.push({l:dlab(s,d)+' → '+FR[g],v:{o:owner,i:d.i,to:g},m:[{o:owner,i:d.i,set:{f:g,ord:1e9}}]});}}return out;}
function ownDice(s,p,hint){const out=[],seen={};for(const d of s.dice[p]){if(d.fz||(d.loc!=='R'&&d.loc!=='F'))continue;if(d.loc==='R'){if(seen[d.v])continue;seen[d.v]=1;}
 let h=0;if(hint){if(d.loc==='F'){const val=validShips(s,d.f,p).includes(d);h=val?(3.5-d.v)*.4-.3:2;}else h=(3.5-d.v)*.5;}
 out.push({l:dlab(s,d),v:{o:p,i:d.i},h});}return out;}
function placeOpts(s,p){const out=[],seen={};for(const d of s.dice[p]){if(d.loc!=='R')continue;const k0=d.v+'/'+d.fz;for(let g=0;g<3;g++){const k=k0+'/'+g;if(seen[k])continue;if(placeOk(s,p,d,g)){seen[k]=1;out.push({l:'Dado '+d.v+' → '+FR[g]+(s.fr[g].ev===8?' (−1 €)':''),v:{t:'place',d:d.i,f:g},m:[{o:p,i:d.i,set:{loc:'F',f:g,ord:1e9}}]});}}}return out;}
function tplan(s,p,id){const k=tk(s,p,id),q=1-p,co=s.co[p];let opts=null,ok=true;
 switch(k){
 case'modSelf2':opts=modOpts(s,p,p,[-2,-1,1,2],false,true);ok=opts.length>0;break;
 case'modSelf1':opts=modOpts(s,p,p,[-1,1],true,true);ok=opts.length>0;break;
 case'modOpp2':opts=modOpts(s,p,q,[-2,-1,1,2],false,false);ok=opts.length>0;break;
 case'modOpp1':opts=modOpts(s,p,q,[-1,1],true,false);ok=opts.length>0;break;
 case'reroll':opts=ownDice(s,p,true);ok=opts.length>0;break;
 case'moveOpp':ok=co>=1;opts=ok?moveOpts(s,q):[];ok=ok&&opts.length>0;break;
 case'trade':ok=co>=2&&s.hand[p].length>=3;break;
 case'gain2':case'skipG':case'skipV':break;
 case'reinf':{opts=[];const seen={};for(const d of s.dice[p]){if(d.loc!=='X')continue;opts.push({l:'Nave eliminata ('+(d.v>0?'era '+d.v:'distrutta')+')',v:{o:p,i:d.i},h:0});}ok=opts.length>0;break;}
 case'mobil':opts=placeOpts(s,p);ok=opts.length>0;break;
 case'contagion':ok=co>=1;break;
 case'mutate':{opts=[];if(co>=1)for(const o of[p,q]){const seen={};for(const d of s.dice[o]){if(d.fz||(d.loc!=='R'&&d.loc!=='F'))continue;if(d.loc==='R'){if(seen[d.v])continue;seen[d.v]=1;}const nv=7-d.v;if(nv<1||nv>6)continue;opts.push({l:(o===p?'Tua: ':'Avversaria: ')+dlab(s,d)+' → '+nv,v:{o,i:d.i,nv},m:[{o,i:d.i,set:{v:nv}}]});}}ok=opts.length>0;break;}
 case'vacc':break;
 case'rerollR':opts=ownDice(s,p,true).filter(o=>s.dice[p][o.v.i].loc==='R');ok=opts.length>0;break;
 case'mimic':opts=modOpts(s,p,p,[-1,1],false,true).filter(o=>s.dice[p][o.v.i].loc==='R');ok=opts.length>0;break;
 case'spore':ok=!(s.spore&&s.spore[p]);break;
 case'freeze':opts=ownDice(s,p,false);ok=opts.length>0;break;
 case'swapCond':{opts=[];if(co>=3)for(let a=0;a<3;a++)for(let b=a+1;b<3;b++){if(s.fr[a].flip||s.fr[b].flip)continue;opts.push({l:FR[a]+' ⇄ '+FR[b],v:{a,b},m:[{fr:a,set:{cond:s.fr[b].cond}},{fr:b,set:{cond:s.fr[a].cond}}]});}ok=opts.length>0;break;}
 case'peek':ok=s.hand[q].length>0;break;
 case'steal':ok=s.hand[q].length>0;break;
 case'swapShips':{opts=[];for(const a of s.dice[p]){if(a.loc!=='F'||a.fz||s.fr[a.f].flip)continue;for(const b of s.dice[q]){if(b.loc!=='F'||b.fz||s.fr[b.f].flip)continue;opts.push({l:dlab(s,a)+' ⇄ '+dlab(s,b),v:{a:a.i,b:b.i},m:[{o:p,i:a.i,set:{v:b.v}},{o:q,i:b.i,set:{v:a.v}}]});}}ok=opts.length>0;break;}
 case'regrow':ok=co>=1&&s.disc[p].length>0;break;
 case'wipe':{opts=[];if(co>=2)for(let f=0;f<3;f++){if(s.fr[f].flip)continue;const ds=[];for(let pp=0;pp<2;pp++)for(const d of s.dice[pp])if(d.loc==='F'&&d.f===f)ds.push(d);if(ds.length)opts.push({l:'Svuota '+FR[f],v:{f},m:ds.map(d=>({o:d.p,i:d.i,set:{loc:'X'}}))});}ok=opts.length>0;break;}
 default:ok=false;}
 return{k,ok,opts};}
/* ask / run */
const FN={},TASK={};
function ask(s,p,ctx,opts){if(!opts||!opts.length)return;
 if(opts.length===1&&ctx.then!=='main'&&ctx.then!=='resp'&&!ctx.noauto){FN[ctx.then](s,ctx,opts[0].v);return;}
 s.pend={p,ctx,opts};}
function push(s){for(let i=arguments.length-1;i>=1;i--)s.st.push(arguments[i]);}
function run(s){let g=0;while(!s.pend&&!s.over&&g++<20000){if(s.endNow){s.endNow=false;s.st=[{k:'resolve'}];}const t=s.st.pop();if(!t)throw new Error('stack vuoto');TASK[t.k](s,t);}return s;}
function answer(s,idx){const pd=s.pend;s.pend=null;FN[pd.ctx.then](s,pd.ctx,pd.opts[idx].v);run(s);return s;}
/* setup */
function newGame(o){o=o||{};const s={cap:!!o.cap,bonus:!!o.bonus,karUsed:[false,false],rs:(o.seed||Date.now())|0,fac:o.fac||['T','A'],rd:0,turn:0,slot:0,first:0,order:[0,1],pv:[0,0],co:[1,1],hand:[[],[]],deck:[[],[]],disc:[[],[]],vir:[0,0],dbl:[false,false],skip:[false,false],pass:[false,false],vdeck:[],vdisc:[],evdeck:[],fr:[],dice:[[],[]],ord:0,st:[],pend:null,log:[],over:false,endNow:false,res:null,hold:o.hold,nl:o.nl,winner:-2,q:[]};
 const ids=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].concat(o.bonus?[27,28]:[]);
 for(let p=0;p<2;p++)s.deck[p]=shuffle(s,ids.map(i=>s.fac[p]==='A'?i+100:i));
 s.evdeck=shuffle(s,[1,2,3,4,5,7,8,9,10,11,12]);
 for(let i=1;i<=7;i++){s.vdeck.push(i);if(i!==3)s.vdeck.push(i);}shuffle(s,s.vdeck);
 s.st=[{k:'init'}];run(s);return s;}
TASK.init=s=>{push(s,{k:'uni',p:0},{k:'uni',p:1},{k:'draw3',p:0},{k:'draw3',p:1},{k:'roundStart'});};
TASK.uni=(s,t)=>{ask(s,t.p,{then:'uni',p:t.p,ttl:'Scegli la tua Tecnologia univoca. L\'altra viene eliminata.',noauto:true},[25,26].map(c=>s.fac[t.p]==='A'?c+100:c).map(c=>({l:tt(s,t.p,c),v:c,h:worth(s,t.p,c)})));};
FN.uni=(s,c,id)=>{s.hand[c.p].push(id);};
TASK.draw3=(s,t)=>{const got=s.deck[t.p].splice(s.deck[t.p].length-3,3);ask(s,t.p,{then:'keep1',p:t.p,got,ttl:'Hai pescato 3 Tecnologie: quale tieni?',noauto:true},got.map((c,i)=>({l:tt(s,t.p,c),v:i,h:worth(s,t.p,c)})));};
FN.keep1=(s,c,i)=>{const p=c.p,rest=c.got.filter((x,j)=>j!==i);s.hand[p].push(c.got[i]);ask(s,p,{then:'back',p,rest,ttl:'Quale rimetti nel mazzo? L\'altra viene eliminata.',noauto:true},rest.map((x,j)=>({l:tt(s,p,x),v:j,h:worth(s,p,x)})));};
FN.back=(s,c,j)=>{const p=c.p;s.deck[p].push(c.rest[j]);shuffle(s,s.deck[p]);};
TASK.roundStart=s=>{s.rd++;
 if(s.rd>=2)for(let p=0;p<2;p++){if(s.vir[p]>0)s.vir[p]--;gain(s,p,1);drawT(s,p);}
 push(s,{k:'setup'});
 if(s.rd===1){s.first=ri(s,2);}
 else{const dec=s.pv[0]<s.pv[1]?0:s.pv[1]<s.pv[0]?1:s.first;
  ask(s,dec,{then:'first',ttl:'Chi muove per primo nel round '+s.rd+'?'},[{l:'Muovo per primo',v:dec},{l:'Lascio la prima mossa all\'avversario',v:1-dec}]);}};
FN.first=(s,c,v)=>{s.first=v;};
TASK.setup=s=>{s.order=[s.first,1-s.first];s.turn=1;s.slot=0;s.pass=[false,false];s.skip=[false,false];s.dbl=[false,false];s.spore=[false,false];s.endNow=false;
 for(let p=0;p<2;p++){s.dice[p]=[];for(let i=0;i<7;i++){s.dice[p].push({i,p,v:1+ri(s,6),loc:'R',f:-1,x:-1,ord:0,fz:0});}}
 if(!s.cdeck)s.cdeck=shuffle(s,['M','M','M','M','B','B','B','B','DH','DH','DL','DL']);
 s.fr=[];for(let f=0;f<3;f++){const ev=s.evdeck.pop();s.fr.push({ev,cond:ev===9?null:s.cdeck.pop(),flip:ev===9,sp:ev===9?[null,null,null,null]:[]});}
 log(s,'— Round '+s.rd+' — apre: '+fn(s,s.first));push(s,{k:'next'});};
function askMain(s,p,extra){ask(s,p,{then:'main',p,extra,ttl:extra?'Azione extra':'Tocca a te'},legalMain(s,p,extra));}
TASK.next=s=>{const p=s.order[s.slot];push(s,{k:'endSlot'});if(s.skip[p]){s.skip[p]=false;log(s,fn(s,p)+' salta il turno');return;}askMain(s,p,false);};
TASK.askExtra=(s,t)=>{askMain(s,t.p,true);};
TASK.endSlot=s=>{s.slot++;
 if(s.slot>=2){if(s.pass[0]&&s.pass[1]){log(s,'Entrambi passano: il round termina.');push(s,{k:'resolve'});return;}
  s.turn++;s.slot=0;s.pass=[false,false];if(s.turn>10){push(s,{k:'resolve'});return;}}
 push(s,{k:'next'});};
/* azioni */
function spaceOk(s,p,d,f,x){const fr=s.fr[f];if(!fr.flip||fr.sp[x]!==null||d.loc!=='R')return false;const q=1-p,co=s.co[p],o=d.loc;d.loc='S';let r=false;
 if(f===0){if(x===0)r=s.hand[p].length>=1;else if(x===1)r=co>=1&&s.hand[p].length<5&&s.deck[p].length>0;
  else if(x===2){if(co>=4){s.co[p]-=4;r=s.dice[p].some(e=>e.loc==='R'&&[0,1,2].some(g=>placeOk(s,p,e,g)));s.co[p]+=4;}}
  else r=co>=2&&s.hand[q].length>=1&&s.hand[p].length<5;}
 else if(f===1){if(x<2)r=true;else if(x===2)r=co>=1&&moveOpts(s,p).length>0;else r=co>=2&&moveOpts(s,q).length>0;}
 else{if(x===0)r=true;else if(x===1)r=s.hand[p].length>=1;else if(x===2)r=co>=1&&modOpts(s,p,p,[-1,1],false,true).length>0;else r=co>=2&&modOpts(s,p,q,[-1,1],false,false).length>0;}
 d.loc=o;return r;}
function legalMain(s,p,extra){const o=[],q=1-p,seen={};
 for(const d of s.dice[p]){if(d.loc!=='R')continue;
  for(let f=0;f<3;f++){const fr=s.fr[f];
   if(fr.flip){for(let x=0;x<4;x++){const k=d.v+'/'+d.fz+'/'+f+'/'+x;if(seen[k])continue;if(spaceOk(s,p,d,f,x)){seen[k]=1;o.push({l:'Dado '+d.v+' → '+FR[f]+': '+SPN[f][x],v:{t:'place',d:d.i,f,x}});}}}
   else{const k=d.v+'/'+d.fz+'/'+f;if(seen[k])continue;if(placeOk(s,p,d,f)){seen[k]=1;o.push({l:'Dado '+d.v+' → '+FR[f],v:{t:'place',d:d.i,f},m:[{o:p,i:d.i,set:{loc:'F',f,ord:1e9}}]});}}}}
 const hs=s.hand[p],ids=uniq(hs);
 if(hs.length)for(const c of ids)o.push({l:'Vendi (+1 €): '+tt(s,p,c),v:{t:'sell',c}});
 if(s.co[p]>=2&&hs.length<5&&s.deck[p].length){o.push({l:'Compra una Tecnologia (−2 €)',v:{t:'buy'}});if(s.cap&&s.fac[p]==='A'&&!s.karUsed[p])o.push({l:'Kar Am Oh: compra scegliendo fra 5 carte (−2 €, una volta per partita)',v:{t:'kar'}});}
 if(hs.length&&s.co[p]>=1&&s.deck[p].length)for(const c of ids){o.push({l:'Vendi e compra: '+tt(s,p,c),v:{t:'sellbuy',c}});if(s.cap&&s.fac[p]==='A'&&!s.karUsed[p])o.push({l:'Vendi e compra con Kar Am Oh (scegli fra 5): '+tt(s,p,c),v:{t:'karsb',c}});}
 for(const c of ids){const k=tk(s,p,c);if(k==='jolly'||k==='resp')continue;if(tplan(s,p,c).ok)o.push({l:'Gioca: '+tt(s,p,c),v:{t:'play',c}});}
 const rd={};for(const d of s.dice[p]){if(d.loc==='R'&&!d.fz&&!rd[d.v])rd[d.v]=d;}
 for(const c of ids)for(const v of TECH[cb(c)].v)for(const k in rd){const d=rd[k];o.push({l:'Usa il valore '+v+' di una carta sul dado '+d.v+' (+1 Virus)',v:{t:'val',c,v,d:d.i},m:[{o:p,i:d.i,set:{v}}]});}
 for(let n=1;n<=5-s.co[p];n++)o.push({l:'Prendi '+n+' Virus → +'+n+' €',v:{t:'vcoins',n}});
 if(!extra)o.push({l:'Prendi 1 Virus per un\'azione extra',v:{t:'vextra'}});
 o.push(extra?{l:'Nessuna azione extra',v:{t:'none'}}:{l:'Passa',v:{t:'pass'}});
 return o;}
function doPlace(s,p,a){const d=s.dice[p][a.d],fr=s.fr[a.f];
 if(fr.flip){d.loc='S';d.f=a.f;d.x=a.x;fr.sp[a.x]={o:p,i:d.i};log(s,fn(s,p)+' occupa: '+FR[a.f]+' — '+SPN[a.f][a.x]);push(s,{k:'space',p,f:a.f,x:a.x});return;}
 if(fr.ev===8)s.co[p]--;
 d.loc='F';d.f=a.f;d.ord=++s.ord;log(s,fn(s,p)+' schiera un '+d.v+' su '+FR[a.f]);
 if(fr.ev===7)push(s,{k:'combat',p,d:d.i,f:a.f});else if(fr.ev===11)push(s,{k:'ev11',p,d:d.i});}
FN.main=(s,c,a)=>{const p=c.p,q=1-p;
 switch(a.t){
 case'pass':s.pass[p]=true;log(s,fn(s,p)+' passa');break;
 case'none':break;
 case'place':doPlace(s,p,a);break;
 case'sell':rem(s.hand[p],a.c);s.disc[p].push(a.c);gain(s,p,1);log(s,fn(s,p)+' vende una Tecnologia');break;
 case'buy':s.co[p]-=2;drawT(s,p);log(s,fn(s,p)+' compra una Tecnologia');break;
 case'karsb':rem(s.hand[p],a.c);s.disc[p].push(a.c);gain(s,p,1);log(s,fn(s,p)+' vende una Tecnologia');
 case'kar':{s.co[p]-=2;s.karUsed[p]=true;const n=Math.min(5,s.deck[p].length);const got=s.deck[p].splice(s.deck[p].length-n,n);log(s,fn(s,p)+' usa Kar Am Oh: guarda 5 Tecnologie e ne compra una');ask(s,p,{then:'kar',p,got,ttl:'Kar Am Oh: quale Tecnologia compri? Le altre vanno in fondo al mazzo.',noauto:true},got.map((c,i)=>({l:tt(s,p,c),v:i,h:worth(s,p,c)})));break;}
 case'sellbuy':rem(s.hand[p],a.c);s.disc[p].push(a.c);gain(s,p,1);s.co[p]-=2;drawT(s,p);log(s,fn(s,p)+' vende e compra una Tecnologia');break;
 case'play':playTech(s,p,a.c);break;
 case'val':{rem(s.hand[p],a.c);s.disc[p].push(a.c);s.dice[p][a.d].v=a.v;log(s,fn(s,p)+' usa il valore '+a.v+' di una Tecnologia');push(s,{k:'vtake',p,n:1});break;}
 case'vcoins':gain(s,p,a.n);log(s,fn(s,p)+' prende '+a.n+' Virus per '+a.n+' €');push(s,{k:'vtake',p,n:a.n});break;
 case'vextra':log(s,fn(s,p)+' prende un Virus per un\'azione extra');push(s,{k:'vtake',p,n:1},{k:'askExtra',p});break;}};
/* tecnologie */
function pairsDiscard(s,p){const h=s.hand[p],out=[],seen={};for(let i=0;i<h.length;i++)for(let j=i+1;j<h.length;j++){const k=Math.min(h[i],h[j])+'/'+Math.max(h[i],h[j]);if(seen[k])continue;seen[k]=1;out.push({l:'Scarta: '+tt(s,p,h[i])+' + '+tt(s,p,h[j]),v:[i,j],h:-(worth(s,p,h[i])+worth(s,p,h[j]))});}return out;}
function handOpts(s,p,pile,ex){const out=[];const src=pile==='hand'?s.hand[p]:s.disc[p].slice(0,ex===undefined?undefined:ex);for(const c of uniq(src))out.push({l:tt(s,p,c),v:c,h:worth(s,p,c)});return out;}
function playTech(s,p,id){const plan=tplan(s,p,id),q=1-p;rem(s.hand[p],id);s.disc[p].push(id);log(s,fn(s,p)+' gioca: '+tt(s,p,id));
 switch(plan.k){
 case'modSelf2':case'modSelf1':case'modOpp2':case'modOpp1':ask(s,p,{then:'techMod',p,ttl:'Scegli la nave e il nuovo valore'},plan.opts);break;
 case'reroll':gain(s,p,1);ask(s,p,{then:'reroll',p,ttl:'Quale nave rilanci?'},plan.opts);break;
 case'moveOpp':s.co[p]--;ask(s,p,{then:'techMove',p,ttl:'Quale nave avversaria sposti, e dove?'},plan.opts);break;
 case'trade':s.co[p]-=2;ask(s,p,{then:'trade',p,ttl:'Scegli 2 Tecnologie da scartare'},pairsDiscard(s,p));break;
 case'gain2':gain(s,p,2);log(s,fn(s,p)+' guadagna 2 €');break;
 case'skipG':s.skip[q]=true;gain(s,q,1);log(s,fn(s,q)+' salta il prossimo turno e guadagna 1 €');break;
 case'skipV':s.skip[q]=true;if(s.vir[q]>0){s.vir[q]--;log(s,fn(s,q)+' salta il prossimo turno e rimuove 1 Virus');}else log(s,fn(s,q)+' salta il prossimo turno');break;
 case'freeze':ask(s,p,{then:'freeze',p,ttl:'Quale nave congeli?'},plan.opts);break;
 case'swapCond':s.co[p]-=3;ask(s,p,{then:'swapCond',p,ttl:'Quali Fronti scambiano la Condizione?'},plan.opts);break;
 case'peek':{log(s,fn(s,p)+' guarda una Tecnologia avversaria');if(s.vir[p]>0)s.vir[p]--;if(s.hand[q].length){const c=s.hand[q][ri(s,s.hand[q].length)];log(s,'Vedi una Tecnologia avversaria: '+tt(s,q,c),p);}break;}
 case'steal':{log(s,fn(s,p)+' pesca 2 Tecnologie dalla mano avversaria e ne tiene una');const h=s.hand[q];const n=Math.min(2,h.length);const got=[];for(let i=0;i<n;i++)got.push(h.splice(ri(s,h.length),1)[0]);log(s,'Peschi dalla mano avversaria: '+got.map(c=>tt(s,q,c)).join(' / '),p);
  ask(s,p,{then:'steal',p,got,ttl:'Quale Tecnologia conservi?'},got.map((c,i)=>({l:tt(s,p,c),v:i,h:worth(s,p,c)})));break;}
 case'reinf':ask(s,p,{then:'reinf',p,ttl:'Quale nave recuperi?'},plan.opts);break;
 case'mobil':push(s,{k:'mob',p,n:2});break;
 case'contagion':s.co[p]--;log(s,fn(s,q)+' prende 1 Virus');push(s,{k:'vtake',p:q,n:1});break;
 case'mutate':s.co[p]--;ask(s,p,{then:'mutate',p,ttl:'Quale nave capovolgi?'},plan.opts);break;
 case'vacc':if(s.vir[p]>0)s.vir[p]--;gain(s,p,1);log(s,fn(s,p)+' rimuove 1 Virus e guadagna 1 €');break;
 case'rerollR':push(s,{k:'rr',p,n:2});break;
 case'mimic':ask(s,p,{then:'spMod',p,ttl:'Quale nave in riserva modifichi?'},plan.opts);break;
 case'spore':if(!s.spore)s.spore=[false,false];s.spore[p]=true;log(s,fn(s,p)+': Spore attive fino a fine round');break;
 case'swapShips':ask(s,p,{then:'techSwap',p,ttl:'Quali navi scambi?'},plan.opts);break;
 case'regrow':s.co[p]--;log(s,fn(s,p)+' recupera una Tecnologia dagli scarti');ask(s,p,{then:'regrow',p,ttl:'Recupera una Tecnologia dagli scarti'},handOpts(s,p,'disc',s.disc[p].length-1));break;
 case'wipe':s.co[p]-=2;push(s,{k:'vtake',p,n:1});ask(s,p,{then:'wipe',p,ttl:'Quale Fronte svuoti?'},plan.opts);break;}}
FN.kar=(s,c,i)=>{const p=c.p;s.hand[p].push(c.got[i]);const rest=shuffle(s,c.got.filter((x,j)=>j!==i));s.deck[p].unshift(...rest);};
FN.reinf=(s,c,v)=>{const d=s.dice[v.o][v.i];d.loc='R';d.f=-1;d.x=-1;d.fz=0;d.v=1+ri(s,6);log(s,fn(s,v.o)+' recupera una nave: dado '+d.v+' in riserva');};
FN.mutate=(s,c,v)=>{const e={e:'setV',o:v.o,i:v.i,nv:v.nv};if(v.o===c.p)execEff(s,e);else targeted(s,c.p,e,[{o:v.o,i:v.i,set:{v:v.nv}}]);};
TASK.mob=(s,t)=>{const o=placeOpts(s,t.p);if(!o.length)return;if(t.n<2)o.push({l:'Non schierare altre navi',v:null,h:0});ask(s,t.p,{then:'mob',p:t.p,n:t.n,ttl:t.n===2?'Mobilitazione: schiera la prima nave':'Mobilitazione: schiera la seconda nave'},o);};
FN.mob=(s,c,v)=>{if(!v)return;if(c.n>1)push(s,{k:'mob',p:c.p,n:c.n-1});doPlace(s,c.p,v);};
TASK.rr=(s,t)=>{const done=t.done||[],seen={},o=[];for(const d of s.dice[t.p]){if(d.loc!=='R'||d.fz||done.includes(d.i)||seen[d.v])continue;seen[d.v]=1;o.push({l:'dado '+d.v+' in riserva',v:{o:t.p,i:d.i}});}
 if(!o.length)return;if(t.n<2)o.push({l:'Basta così',v:null,h:0});ask(s,t.p,{then:'rr',p:t.p,n:t.n,done,ttl:t.n===2?'Rilancio tattico: prima nave da rilanciare':'Rilancio tattico: seconda nave (facoltativa)'},o);};
FN.rr=(s,c,v)=>{if(!v)return;const d=s.dice[v.o][v.i],b=d.v;d.v=1+ri(s,6);log(s,fn(s,v.o)+' rilancia: dado '+b+' in riserva → '+d.v);
 qev(s,{k:'msg',p:c.p,title:'Rilancio tattico',lines:['Hai rilanciato il '+b+': ora vale '+d.v+'.'+(d.v===b?' Stesso numero: capita una volta su sei.':'')]});
 if(c.n>1)push(s,{k:'rr',p:c.p,n:c.n-1,done:(c.done||[]).concat(d.i)});};
function targeted(s,atk,eff,m){const q=1-atk;
 if((s.hand[q].includes(10)||s.hand[q].includes(11))&&s.co[q]>=1)ask(s,q,{then:'resp',atk,eff,m,ttl:'Respingi l\'attacco?'},[{l:'Respingi (−1 €)',v:true},{l:'Lascia passare',v:false}]);
 else execEff(s,eff);}
function execEff(s,e){
 if(e.e==='setV'){const d=s.dice[e.o][e.i];if(d.fz){log(s,fn(s,e.o)+': '+dlab(s,d)+' è congelato, nessun effetto');return;}
  const b=dlab(s,d);d.v=e.nv;const nul=d.loc==='F'&&!validShips(s,d.f,d.p).includes(d);log(s,fn(s,e.o)+': '+b+' → '+d.v+(nul?' (nullo)':''));}
 else if(e.e==='move'){const d=s.dice[e.o][e.i];if(d.fz){log(s,fn(s,e.o)+': '+dlab(s,d)+' è congelato, nessun effetto');return;}
  const b=dlab(s,d);d.f=e.to;d.ord=++s.ord;const nul=!validShips(s,d.f,d.p).includes(d);log(s,fn(s,e.o)+': '+b+' → spostato su '+FR[e.to]+(nul?' (nullo)':''));}
 else if(e.e==='swap'){const a=s.dice[e.pa][e.a],b=s.dice[1-e.pa][e.b];
  if(a.fz||b.fz){log(s,'Scambio impossibile: nave congelata');return;}
  const la=dlab(s,a),lb=dlab(s,b),t=a.v;a.v=b.v;b.v=t;
  const na=a.loc==='F'&&!validShips(s,a.f,a.p).includes(a)?' (nullo)':'',nb=b.loc==='F'&&!validShips(s,b.f,b.p).includes(b)?' (nullo)':'';
  log(s,'Scambio dei valori: '+fn(s,e.pa)+' '+la+' → '+a.v+na+' · '+fn(s,1-e.pa)+' '+lb+' → '+b.v+nb);}}
FN.resp=(s,c,v)=>{const q=1-c.atk;if(v){s.co[q]--;const id=s.hand[q].includes(10)?10:11;rem(s.hand[q],id);s.disc[q].push(id);log(s,fn(s,q)+' respinge l\'attacco!');}else execEff(s,c.eff);};
FN.techMod=(s,c,v)=>{if(v.c)s.co[c.p]-=v.c;const e={e:'setV',o:v.o,i:v.i,nv:v.nv};if(v.o===c.p)execEff(s,e);else targeted(s,c.p,e,[{o:v.o,i:v.i,set:{v:v.nv}}]);};
FN.reroll=(s,c,v)=>{const d=s.dice[v.o][v.i],b=dlab(s,d);d.v=1+ri(s,6);const nul=d.loc==='F'&&!validShips(s,d.f,d.p).includes(d);log(s,fn(s,v.o)+' rilancia: '+b+' → '+d.v+(nul?' (nullo)':''));};
FN.techMove=(s,c,v)=>{targeted(s,c.p,{e:'move',o:v.o,i:v.i,to:v.to},[{o:v.o,i:v.i,set:{f:v.to,ord:1e9}}]);};
FN.techSwap=(s,c,v)=>{const a=s.dice[c.p][v.a],b=s.dice[1-c.p][v.b];targeted(s,c.p,{e:'swap',pa:c.p,a:v.a,b:v.b},[{o:c.p,i:v.a,set:{v:b.v}},{o:1-c.p,i:v.b,set:{v:a.v}}]);};
FN.trade=(s,c,v)=>{const p=c.p;const cs=[s.hand[p][v[0]],s.hand[p][v[1]]];rem(s.hand[p],cs[0]);rem(s.hand[p],cs[1]);s.disc[p].push(cs[0],cs[1]);s.pv[p]++;log(s,fn(s,p)+' guadagna 1 PV');push(s,{k:'vtake',p,n:1});};
FN.freeze=(s,c,v)=>{const d=s.dice[v.o][v.i];d.fz=1;log(s,fn(s,v.o)+' congela: '+dlab(s,d));};
FN.swapCond=(s,c,v)=>{const t=s.fr[v.a].cond;s.fr[v.a].cond=s.fr[v.b].cond;s.fr[v.b].cond=t;log(s,'Token Condizione scambiati: '+FR[v.a]+' ⇄ '+FR[v.b]);};
FN.steal=(s,c,i)=>{const p=c.p,q=1-p;s.hand[p].push(c.got[i]);for(let j=0;j<c.got.length;j++)if(j!==i)s.hand[q].push(c.got[j]);};
FN.regrow=(s,c,id)=>{rem(s.disc[c.p],id);s.hand[c.p].push(id);};
FN.wipe=(s,c,v)=>{for(let p=0;p<2;p++)for(const d of s.dice[p])if(d.loc==='F'&&d.f===v.f)d.loc='X';log(s,'Fronte svuotato: '+FR[v.f]);};
FN.ack=()=>{};
/* combattimento / evento 11 */
function fight(a,b){return{a:Math.max(0,a-b),b:Math.max(0,b-a)};}
TASK.combat=(s,t)=>{const a=s.dice[t.p][t.d];if(a.loc!=='F')return;const tg=onFront(s,t.f,1-t.p);if(!tg.length)return;
 ask(s,t.p,{then:'combat',p:t.p,d:t.d,ttl:'Combattimento: quale nave attacchi?'},tg.map(b=>{const r=fight(a.v,b.v);return{l:'Attacca il '+b.v+' → esito: tuo '+r.a+', suo '+r.b,v:b.i,m:[{o:t.p,i:a.i,set:{v:r.a,loc:r.a<=0?'X':'F'}},{o:1-t.p,i:b.i,set:{v:r.b,loc:r.b<=0?'X':'F'}}]};}));};
FN.combat=(s,c,bi)=>{const a=s.dice[c.p][c.d],b=s.dice[1-c.p][bi];const av=a.v,bv=b.v;const r=fight(av,bv);a.v=r.a;b.v=r.b;if(r.a<=0)a.loc='X';if(r.b<=0)b.loc='X';
 const st=(who,o,n)=>fn(s,who)+': '+o+' → '+(n<=0?'eliminato':n);
 log(s,'Combattimento: '+st(c.p,av,r.a)+' · '+st(1-c.p,bv,r.b));};
TASK.ev11=(s,t)=>{const p=t.p;let pool=s.dice[p].filter(d=>d.loc==='F'&&d.i!==t.d&&!d.fz);if(!pool.length)pool=s.dice[p].filter(d=>d.loc==='R'&&!d.fz);
 const out=[],seen={};for(const d of pool){if(d.loc==='R'){if(seen[d.v])continue;seen[d.v]=1;}for(const dl of[-1,1]){const nv=d.v+dl;if(nv<1||nv>6)continue;out.push({l:dlab(s,d)+' → '+nv,v:{o:p,i:d.i,nv},m:[{o:p,i:d.i,set:{v:nv}}]});}}
 ask(s,p,{then:'ev11',p,ttl:'Evento: modifica di 1 un tuo altro dado'},out);};
FN.ev11=(s,c,v)=>{const d=s.dice[v.o][v.i],b=dlab(s,d);d.v=v.nv;const nul=d.loc==='F'&&!validShips(s,d.f,d.p).includes(d);log(s,fn(s,v.o)+' (Evento): '+b+' → '+d.v+(nul?' (nullo)':''));};
/* spazi azione */
TASK.space=(s,t)=>{const p=t.p,q=1-p,f=t.f,x=t.x;
 if(f===0){
  if(x===0)ask(s,p,{then:'spDisc',p,gain:2,draw:0,ttl:'Scarta una Tecnologia (+2 €)'},handOpts(s,p,'hand').map(o=>(o.h=-o.h,o)));
  else if(x===1){s.co[p]--;drawT(s,p);}
  else if(x===2){s.co[p]-=4;const out=[],seen={};for(const d of s.dice[p]){if(d.loc!=='R'||seen[d.v])continue;seen[d.v]=1;for(let g=0;g<3;g++)if(placeOk(s,p,d,g))out.push({l:'Dado '+d.v+' → '+FR[g],v:{t:'place',d:d.i,f:g},m:[{o:p,i:d.i,set:{loc:'F',f:g,ord:1e9}}]});}
   ask(s,p,{then:'spExtra',p,ttl:'Nave extra: dove la schieri?'},out);}
  else{s.co[p]-=2;const h=s.hand[q];if(h.length&&s.hand[p].length<5){const c=h.splice(ri(s,h.length),1)[0];s.hand[p].push(c);log(s,'Hai rubato: '+tt(s,p,c),p);log(s,fn(s,p)+' ruba una Tecnologia');}}}
 else if(f===1){
  if(x===0)gain(s,p,2);else if(x===1)drawT(s,p);
  else if(x===2){s.co[p]--;ask(s,p,{then:'spMove',p,ttl:'Quale tua nave sposti?'},moveOpts(s,p));}
  else{s.co[p]-=2;ask(s,p,{then:'spMove',p,ttl:'Quale nave avversaria sposti?'},moveOpts(s,q));}}
 else{
  if(x===0)gain(s,p,1);
  else if(x===1)ask(s,p,{then:'spDisc',p,gain:0,draw:1,ttl:'Scarta una Tecnologia e pescane un\'altra'},handOpts(s,p,'hand').map(o=>(o.h=-o.h,o)));
  else if(x===2){s.co[p]--;ask(s,p,{then:'spMod',p,ttl:'Quale tua nave modifichi?'},modOpts(s,p,p,[-1,1],false,true));}
  else{s.co[p]-=2;ask(s,p,{then:'spMod',p,ttl:'Quale nave avversaria modifichi?'},modOpts(s,p,q,[-1,1],false,false));}}};
FN.spDisc=(s,c,id)=>{rem(s.hand[c.p],id);s.disc[c.p].push(id);if(c.gain)gain(s,c.p,c.gain);if(c.draw)drawT(s,c.p);};
FN.spExtra=(s,c,v)=>{doPlace(s,c.p,v);};
FN.spMove=(s,c,v)=>{execEff(s,{e:'move',o:v.o,i:v.i,to:v.to});};
FN.spMod=(s,c,v)=>{execEff(s,{e:'setV',o:v.o,i:v.i,nv:v.nv});};
/* virus */
TASK.vtake=(s,t)=>{if(t.n<=0)return;const p=t.p;if(s.spore&&s.spore[1-p]){gain(s,1-p,1);log(s,fn(s,1-p)+' guadagna 1 € (Spore)');}push(s,{k:'vunit',p,c:s.dbl[p]?2:1},{k:'vtake',p,n:t.n-1});};
TASK.vunit=(s,t)=>{if(t.c<=0)return;const p=t.p,rest={k:'vunit',p,c:t.c-1};
 if(s.vir[p]>=3){s.vir[p]=0;log(s,fn(s,p)+': quarto Virus! Riavvio del sistema, 2 carte Virus.');qev(s,{k:'reboot',p});push(s,{k:'vcard',p},{k:'vcard',p},rest);}
 else{s.vir[p]++;push(s,{k:'vcard',p},rest);}};
TASK.vcard=(s,t)=>{const p=t.p,q=1-p;if(!s.vdeck.length){s.vdeck=shuffle(s,s.vdisc);s.vdisc=[];}
 const c=s.vdeck.pop();s.vdisc.push(c);log(s,'☣ Virus ('+fn(s,p)+'): '+VIRN[c]);qev(s,{k:'virus',p,c});
 switch(c){
 case 1:{const o=ownDiceAny(s,p);ask(s,p,{then:'v1',p,ttl:'Virus: quale tua nave scarti?'},o.map(e=>(e.m=[{o:p,i:e.v.i,set:{loc:'X'}}],e)));break;}
 case 2:{const o=ownDice(s,p,false).map(e=>{const d=s.dice[p][e.v.i];e.h=d.loc==='F'?((validShips(s,d.f,p).includes(d)?1:-1)+(d.v-3)*.3):-.2;return e;});ask(s,q,{then:'v2',p,ttl:'Virus avversario: quale sua nave rilanci?'},o);break;}
 case 3:if(s.turn>5){s.endNow=true;}else s.turn=5;break;
 case 4:{const o=[];if(s.co[p]>=1)o.push({l:'Paga 1 €',v:'pay',h:s.co[p]>=2?.6:.2});o.push({l:'Elimina 2 Tecnologie dal mazzo',v:'elim',h:.3});ask(s,p,{then:'v4',p,ttl:'Virus: come paghi?'},o);break;}
 case 5:s.dbl[p]=true;break;
 case 6:{const o=[];for(const d of s.dice[p]){if(d.loc==='F'&&!d.fz&&validShips(s,d.f,p).includes(d))o.push({l:dlab(s,d),v:{o:p,i:d.i},h:(3.5-d.v)*.3});}ask(s,p,{then:'v6',p,ttl:'Virus: quale nave ritiri e rilanci?'},o);break;}
 case 7:gain(s,q,1);break;}};
function ownDiceAny(s,p){const out=[],seen={};for(const d of s.dice[p]){if(d.loc!=='R'&&d.loc!=='F')continue;if(d.loc==='R'){if(seen[d.v])continue;seen[d.v]=1;}out.push({l:dlab(s,d),v:{o:p,i:d.i}});}return out;}
FN.v1=(s,c,v)=>{const d=s.dice[v.o][v.i];log(s,fn(s,v.o)+' scarta per questo round: '+dlab(s,d));d.loc='X';};
FN.v2=(s,c,v)=>{const d=s.dice[v.o][v.i],b=dlab(s,d);d.v=1+ri(s,6);const nul=d.loc==='F'&&!validShips(s,d.f,d.p).includes(d);log(s,fn(s,v.o)+' (Virus): '+b+' rilanciato → '+d.v+(nul?' (nullo)':''));};
FN.v4=(s,c,v)=>{if(v==='pay')s.co[c.p]--;else s.deck[c.p].splice(0,2);};
FN.v6=(s,c,v)=>{const d=s.dice[v.o][v.i],b=dlab(s,d);d.loc='R';d.f=-1;d.v=1+ri(s,6);log(s,fn(s,v.o)+' (Virus): '+b+' ritirato e rilanciato → '+d.v+' in riserva');};
/* risoluzione */
function winner(s,f){const fr=s.fr[f];const A=validShips(s,f,0),B=validShips(s,f,1);const sa=sumv(A),sb=sumv(B);const cmp=(a,b)=>a>b?0:b>a?1:-1;
 switch(fr.cond){
 case'M':return cmp(sa,sb);
 case'DH':return A.length!==B.length?cmp(A.length,B.length):cmp(sa,sb);
 case'DL':return A.length!==B.length?cmp(A.length,B.length):cmp(sb,sa);
 case'B':{const da=sa>12?99:12-sa,db=sb>12?99:12-sb;if(da===99&&db===99)return -1;return cmp(db,da);}}
 return -1;}
TASK.resolve=s=>{const gp=[0,0];s.res=[];
 for(let f=0;f<3;f++){const fr=s.fr[f];if(fr.flip){s.res.push({f,flip:true});continue;}
  const cnt=[onFront(s,f,0).length,onFront(s,f,1).length],g=[0,0],w=winner(s,f);
  if(w>=0){g[w]+=fr.ev===8?2:1;drawT(s,1-w);}
  for(let p=0;p<2;p++)if(cnt[p]===0&&!(s.cap&&s.fac[p]==='T'))g[1-p]+=1;
  if(fr.ev===7){g[0]=Math.min(g[0],1);g[1]=Math.min(g[1],1);}
  gp[0]+=g[0];gp[1]+=g[1];
  s.res.push({f,ev:fr.ev,cond:fr.cond,sum:[sumv(validShips(s,f,0)),sumv(validShips(s,f,1))],cnt,w,g,vc:[validShips(s,f,0).length,validShips(s,f,1).length],tb:(fr.cond==='DH'||fr.cond==='DL')&&w>=0&&validShips(s,f,0).length===validShips(s,f,1).length});
  log(s,FR[f]+': '+(w<0?'pareggio':'vince '+fn(s,w))+' (+'+g[0]+' / +'+g[1]+' PV)');}
 s.pv[0]+=gp[0];s.pv[1]+=gp[1];s.resRd=s.rd;
 if(s.rd>=3){finish(s);return;}
 if(s.stopAtEnd){s.rdOver=true;s.over=true;return;}
 push(s,{k:'roundStart'});
 if(s.hold!==undefined)ask(s,s.hold,{then:'ack',noauto:true,ttl:'Round '+s.rd+' concluso'},[{l:'Prosegui',v:0}]);};
function finish(s){s.over=true;const[a,b]=s.pv;let w=-1,why=null;
 if(a!==b)w=a>b?0:1;
 else{const ra=s.co[0]+s.hand[0].length,rb=s.co[1]+s.hand[1].length;
  if(ra!==rb){w=ra>rb?0:1;why={k:'res',v:[ra,rb]};}
  else if(s.vir[0]!==s.vir[1]){w=s.vir[0]<s.vir[1]?0:1;why={k:'vir',v:[s.vir[0],s.vir[1]],r:[ra,rb]};}
  else why={k:'cantina',v:[ra,rb]};}
 s.winner=w;s.why=why;log(s,'Partita conclusa.');}
return{cb,cf,isStart,FX,FT,placeOk,FR,EVN,EVD,CN,SPN,TECH,VIRN,newGame,run,answer,clone,legalMain,validShips,onFront,sumv,tk,tt,worth,rnd,ri,shuffle,pm,um,tplan,winner,fn,finish};
})();
if(typeof module!=='undefined')module.exports=INV;
