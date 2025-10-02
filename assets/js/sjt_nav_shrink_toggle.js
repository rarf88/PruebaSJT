// sjt_nav_shrink_toggle.js — añade/quita 'sjt-shrink' según scroll (móvil/tablet)
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;
    var root = document.documentElement;
    var TH = 10;
    function apply(){
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(y > TH){ root.classList.add('sjt-shrink'); } else { root.classList.remove('sjt-shrink'); }
    }
    window.addEventListener('scroll', apply, {passive:true});
    window.addEventListener('resize', function(){ setTimeout(apply, 60); });
    window.addEventListener('orientationchange', function(){ setTimeout(apply, 100); });
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  }catch(e){}
})();
