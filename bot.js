const BOT=(function(E){
'use strict';
const T=Math.tanh;
const SPV=[[.25,.1,.1,.3],[.3,.25,.15,.3],[.12,.1,.12,.2]];
function cnt(s,f,p){return E.onFront(s,f,p).length;}
function evalS(s,p){
 const q=1-p;let v=0,rp=0,rq=0;
 for(const d of s.dice[p])if(d.loc==='R')rp++;for(const d of s.dice[q])if(d.loc==='R')rq++;
 const late=s.turn>=8;
 for(let f=0;f<3;f++){const fr=s.fr[f];if(fr.flip)continue;
  const A=E.validShips(s,f,p),B=E.validShips(s,f,q),sa=E.sumv(A),sb=E.sumv(B);let x=0;
  switch(fr.cond){
   case'M':x=T((sa-sb)/5);break;
   case'DH':x=(A.length-B.length)*.6+T((sa-sb)/6)*.3;break;
   case'DL':x=(A.length-B.length)*.6-T((sa-sb)/6)*.3;break;
   case'B':{const da=sa>12?9:12-sa,db=sb>12?9:12-sb;x=T((db-da)/3);break;}}
  x=Math.max(-1.2,Math.min(1.2,x));
  let t=x*(fr.ev===8?2:fr.ev===7?.6:1);
  if(fr.ev!==7){const np=cnt(s,f,p),nq=cnt(s,f,q);
   if(!np&&!(s.cap&&s.fac[p]==='T'))t-=(rp>0&&!late)?.7:1;
   if(!nq&&!(s.cap&&s.fac[q]==='T'))t+=(rq>0&&!late)?.7:1;}
  v+=t;}
 v+=s.pv[p]-s.pv[q];
 v+=.12*(s.co[p]-s.co[q])+.1*(s.hand[p].length-s.hand[q].length)-.22*(s.vir[p]-s.vir[q]);
 return v;}
function gainPlace(s,p,d){let best=0;const b0=evalS(s,p);
 for(let f=0;f<3;f++){if(s.fr[f].flip||!E.placeOk(s,p,d,f))continue;
  const u=E.pm(s,[{o:p,i:d.i,set:{loc:'F',f,ord:1e9}}]);const g=evalS(s,p)-b0;E.um(u);if(g>best)best=g;}
 return best;}
function optGain(s,p,o,b){
 const u=E.pm(s,o.m);let g=evalS(s,p)-b,g1=0,d=null;const e=o.m[0];
 if(e&&e.o===p&&e.i!==undefined&&e.set&&e.set.v!==undefined){d=s.dice[p][e.i];if(d.loc==='R')g1=gainPlace(s,p,d);else d=null;}
 E.um(u);
 if(d)g+=g1-gainPlace(s,p,d);
 return g;}
function bestOpt(s,p,plan,b){let m=-9;for(const o of plan.opts||[]){let g=optGain(s,p,o,b);if(o.v&&o.v.c)g-=.12*o.v.c;if(g>m)m=g;}return m;}
function playValue(s,p,c,b){
 const plan=E.tplan(s,p,c),k=plan.k,hn=s.hand[p].length,CC=.18;
 switch(k){
  case'modSelf2':case'modSelf1':case'modOpp2':case'modOpp1':case'moveOpp':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-CC-(k==='moveOpp'?.12:0);}
  case'swapCond':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-CC-.36;}
  case'swapShips':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-CC;}
  case'wipe':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-CC-.49;}
  case'reroll':return .05;
  case'trade':return hn>=4?.12:-.15;
  case'gain2':return s.co[p]<=3?.12:-.2;
  case'freeze':return -.12;
  case'peek':return -.15;
  case'steal':return .22;
  case'skipG':case'skipV':return .08;
  case'regrow':return .0;
  case'reinf':return .3;
  case'mobil':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m+.12-CC;}
  case'contagion':return (s.vir[1-p]>=3?.4:.22)-.12;
  case'mutate':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-CC-.12;}
  case'vacc':return s.vir[p]>0?.2:.02;
  case'rerollR':{const r=s.dice[p].filter(d=>d.loc==='R');const avg=r.reduce((x,d)=>x+d.v,0)/Math.max(1,r.length);return avg<3?.08:-.08;}
  case'mimic':{const m=bestOpt(s,p,plan,b);return m<=-9?-9:m-.08;}
  case'spore':return s.turn<=4?.1:-.1;
  default:return -.1;}}
function scoreMain(s,p,opts,extra){
 const q=1-p,b=evalS(s,p),co=s.co[p],hn=s.hand[p].length;
 return opts.map(o=>{const a=o.v;let sc=0;
  switch(a.t){
  case'place':{const fr=s.fr[a.f];
   if(fr.flip){sc=SPV[a.f][a.x]+.04;}
   else{const u=E.pm(s,o.m);sc=evalS(s,p)-b;E.um(u);sc+=.03;
    if(fr.ev===8)sc-=.15;
    if(fr.ev===11)sc-=.08;
    if(fr.ev===7){const d=s.dice[p][a.d],tg=E.onFront(s,a.f,q);if(tg.length){const mn=Math.min.apply(null,tg.map(t=>t.v));sc+=d.v>mn?.5:d.v===mn?-.05:-.4;}}}
   break;}
  case'sell':{const w=E.worth(s,p,a.c);sc=hn>=4?.18-w*.3:.05-w*.4;if(co>=4)sc-=.1;break;}
  case'buy':sc=(hn<=2?.2:hn===3?.1:-.1)-(co<=2?.1:0);break;
  case'kar':sc=(hn<=2?.32:hn===3?.22:-.05)-(co<=2?.1:0)+(s.rd>=2?.05:0);break;
  case'sellbuy':{const w=E.worth(s,p,a.c);sc=.12-w*.45+(hn<=3?.05:0);break;}
  case'karsb':{const w=E.worth(s,p,a.c);sc=.22-w*.45+(hn<=3?.05:0)+(s.rd>=2?.05:0);break;}
  case'play':sc=playValue(s,p,a.c,b);break;
  case'val':{const d=s.dice[p][a.d];const g0=gainPlace(s,p,d);const u=E.pm(s,o.m);const g1=gainPlace(s,p,d);E.um(u);sc=g1-g0-.45;break;}
  case'vcoins':sc=a.n*(co<=1?.15:.02)-a.n*.28;break;
  case'vextra':sc=-.35;break;
  case'pass':sc=0;break;
  case'none':sc=0;break;}
  return sc;});}
function scoreGeneric(s,p,pd){const c=pd.ctx;
 if(c.then==='keep')return pd.opts.map(o=>-E.worth(s,p,s.hand[p][o.v]));
 if(c.then==='first')return[.01,0];
 if(c.then==='uni'||c.then==='keep1'||c.then==='back'||c.then==='kar')return pd.opts.map(o=>o.h||0);
 const b=evalS(s,p);
 if(c.then==='resp'){const u=E.pm(s,c.m);const d=evalS(s,p)-b;E.um(u);return d<-.35?[1,0]:[0,1];}
 return pd.opts.map(o=>{let sc=o.h||0;if(o.m){sc+=optGain(s,p,o,b);if(o.v&&o.v.c)sc-=.12;}return sc;});}
function pick(sc,noise){let bi=0,bv=-1e9;for(let i=0;i<sc.length;i++){const v=sc[i]+(Math.random()-.5)*2*noise;if(v>bv){bv=v;bi=i;}}return bi;}
function choose(s,noise){const pd=s.pend;if(noise===undefined)noise=.1;
 if(pd.opts.length===1)return 0;
 const sc=pd.ctx.then==='main'?scoreMain(s,pd.p,pd.opts,pd.ctx.extra):scoreGeneric(s,pd.p,pd);
 return pick(sc,noise);}
/* difficile */
function determinize(c,p){const q=1-p,full=[];for(let i=1;i<=24;i++)full.push(i);
 const pq=full.filter(id=>c.disc[q].indexOf(id)<0);E.shuffle(c,pq);
 const hn=c.hand[q].length,dn=c.deck[q].length;c.hand[q]=pq.slice(0,hn);c.deck[q]=pq.slice(hn,hn+dn);
 const po=full.filter(id=>c.disc[p].indexOf(id)<0&&c.hand[p].indexOf(id)<0);E.shuffle(c,po);c.deck[p]=po.slice(0,c.deck[p].length);}
function value(c,p){const q=1-p;let v=c.pv[p]-c.pv[q];
 if(c.rd>=3&&c.winner!==-2)v+=c.winner===p?2.5:c.winner===q?-2.5:0;
 else v+=.12*(c.co[p]-c.co[q])+.1*(c.hand[p].length-c.hand[q].length)-.2*(c.vir[p]-c.vir[q]);
 return v;}
function sim(s,p,i,label,seed){
 const c=E.clone(s);c.nl=true;c.rs=seed|0;c.stopAtEnd=true;c.hold=undefined;determinize(c,p);
 let k=c.pend.opts.findIndex(o=>o.l===label);if(k<0)k=i;
 E.answer(c,k);let g=0;
 while(!c.over&&c.pend&&g++<400)E.answer(c,choose(c,.12));
 return value(c,p);}
function hardChoose(s,opt){opt=opt||{};const K=opt.K||8,R=opt.R||24;const pd=s.pend;
 if(pd.ctx.then!=='main'||pd.opts.length<=1)return choose(s,.02);
 const p=pd.p,sc=scoreMain(s,p,pd.opts,pd.ctx.extra);
 let idx=sc.map((v,i)=>i).sort((a,b)=>sc[b]-sc[a]).slice(0,K);
 const pi=pd.opts.findIndex(o=>o.v.t==='pass'||o.v.t==='none');if(pi>=0&&idx.indexOf(pi)<0)idx.push(pi);
 if(idx.length===1)return idx[0];
 const tot=idx.map(()=>0),base=(Math.random()*1e9)|0;
 for(let r=0;r<R;r++)for(let j=0;j<idx.length;j++)tot[j]+=sim(s,p,idx[j],pd.opts[idx[j]].l,base+r*7919);
 let bi=0,bv=-1e9;for(let j=0;j<idx.length;j++){const v=tot[j]/R+.15*sc[idx[j]];if(v>bv){bv=v;bi=j;}}
 return idx[bi];}
return{evalS,choose,hardChoose,scoreMain};
})(typeof INV!=='undefined'?INV:require('./engine.js'));
if(typeof module!=='undefined')module.exports=BOT;
