// sjt_shrink_nav.js — v2 (2025-10-02)
(function(){
  try{
    var threshold = 10;
    var ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(function(){
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        var shouldShrink = y > threshold;
        var root = document.documentElement;
        if(shouldShrink){
          root.classList.add('sjt-shrink');
        }else{
          root.classList.remove('sjt-shrink');
        }
        ticking = false;
      });
    }
    document.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }catch(e){
    console && console.warn && console.warn('sjt_shrink_nav error:', e);
  }
})();
