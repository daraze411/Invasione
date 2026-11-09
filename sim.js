const E=require('./engine.js'),B=require('./bot.js');
const kinds={
 rnd:s=>Math.floor(Math.random()*s.pend.opts.length),
 norm:s=>B.choose(s,.1),
 hard:s=>B.hardChoose(s,{K:+process.env.K||6,R:+process.env.R||10}),
};
function play(seed,k0,k1,fac){const s=E.newGame({seed,fac,nl:true});let n=0;
 while(!s.over){const pd=s.pend;if(!pd)throw new Error('no pend');const f=pd.p===0?kinds[k0]:kinds[k1];E.answer(s,f(s));if(++n>4000)throw new Error('loop');}
 return s;}
const [a,b,N]=[process.argv[2],process.argv[3],+process.argv[4]||200];
let w=[0,0,0],pv=[0,0],t0=Date.now(),firstWins=[0,0],facW={T:0,A:0};
for(let g=0;g<N;g++){
 const fac=g%2?['A','T']:['T','A'];
 const s=play(1000+g,a,b,fac);
 w[s.winner+1]++;pv[0]+=s.pv[0];pv[1]+=s.pv[1];
 if(s.winner>=0)facW[fac[s.winner]]++;
}
console.log(a+' (P0) vs '+b+' (P1):','P0 vince',w[1],'P1 vince',w[2],'pari',w[0],'| PV medi',(pv[0]/N).toFixed(2),(pv[1]/N).toFixed(2),'| vittorie Terrestri',facW.T,'Alieni',facW.A,'|',((Date.now()-t0)/N).toFixed(0)+'ms/partita');
