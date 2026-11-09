const E=require('./engine.js');
let ok=0,bad=0,stats={w:[0,0,0],pv:0,turns:0};
const errs={};
for(let g=0;g<3000;g++){
  try{
    const s=E.newGame({seed:g+1,nl:true});
    let n=0;
    while(!s.over){
      if(!s.pend){throw new Error('no pend e non over');}
      const pd=s.pend;
      const i=Math.floor(E.rnd(s)*pd.opts.length);
      E.answer(s,i);
      if(++n>5000)throw new Error('loop infinito');
    }
    ok++;stats.w[s.winner+1]++;stats.pv+=s.pv[0]+s.pv[1];
  }catch(e){bad++;const k=e.message.split('\n')[0];errs[k]=(errs[k]||0)+1;if(bad<4)console.log(e.stack.split('\n').slice(0,4).join('\n'));}
}
console.log({ok,bad,stats,errs});
