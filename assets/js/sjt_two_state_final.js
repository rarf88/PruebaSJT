
// sjt_two_state_final.js — two states (mobile/tablet), class toggle only
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    function apply(){
      if(!mq.matches) return;
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var root = document.documentElement;
      if(y > 10){ root.classList.add('sjt-shrink'); } else { root.classList.remove('sjt-shrink'); }
    }
    window.addEventListener('scroll', apply, {passive:true});
    window.addEventListener('resize', function(){ setTimeout(apply, 50); });
    window.addEventListener('orientationchange', function(){ setTimeout(apply, 80); });
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  }catch(e){}
})();
