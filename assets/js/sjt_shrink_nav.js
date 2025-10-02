// sjt_shrink_nav.js — Added by automation on 2025-10-02
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
          if(!root.classList.contains('sjt-shrink')) root.classList.add('sjt-shrink');
        }else{
          if(root.classList.contains('sjt-shrink')) root.classList.remove('sjt-shrink');
        }
        ticking = false;
      });
    }
    document.addEventListener('scroll', onScroll, {passive:true});
    // Initialize on load
    onScroll();
  }catch(e){
    console && console.warn && console.warn('sjt_shrink_nav error:', e);
  }
})();
