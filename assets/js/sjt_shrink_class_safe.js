// sjt_shrink_class_safe.js — toggles two-state class only (mobile/tablet)
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    var root = document.documentElement;
    function apply(){
      if(!mq.matches) return; // desktop untouched
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(y > 10){ root.classList.add('sjt-shrink'); } else { root.classList.remove('sjt-shrink'); }
    }
    window.addEventListener('scroll', apply, {passive:true});
    window.addEventListener('resize', function(){ setTimeout(apply, 60); });
    window.addEventListener('orientationchange', function(){ setTimeout(apply, 100); });
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  }catch(e){}
})();
