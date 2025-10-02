// sjt_shrink_nav.js — v4 (2025-10-02)
(function(){
  try{
    var threshold = 10;
    var root = document.documentElement;

    var candidates = [window, document, document.scrollingElement, document.documentElement, document.body];
    var extraSel = 'main,.main,.content,.page,.pages,.wrapper,.site,.app,.container,.layout';
    document.querySelectorAll(extraSel).forEach(function(el){
      try{
        var cs = getComputedStyle(el);
        var overflowY = cs.overflowY || cs.overflow || '';
        var scrollable = (overflowY.includes('auto') || overflowY.includes('scroll')) &&
                         (el.scrollHeight - el.clientHeight > 16);
        if(scrollable) candidates.push(el);
      }catch(e){}
    });
    candidates = candidates.filter(Boolean).filter(function(x, i, a){ return a.indexOf(x) === i; });

    function setShrink(active){
      if(active){ root.classList.add('sjt-shrink'); }
      else{ root.classList.remove('sjt-shrink'); }
    }

    function checkAnyScroll(){
      var yWindow = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(yWindow > threshold){ setShrink(true); return; }
      for(var i=0;i<candidates.length;i++){
        var el = candidates[i];
        if(el === window || el === document) continue;
        var y = 0;
        try{ y = el.scrollTop || 0; }catch(e){ y = 0; }
        if(y > threshold){ setShrink(true); return; }
      }
      setShrink(false);
    }

    function normalizeLogoNodes(){
      var q = [
        'header .logo img','nav .logo img','.navbar .logo img','.topbar .logo img',
        'img.logo','img[alt*="logo" i]','img[src*="logo" i]','.logo svg','header .logo','nav .logo'
      ].join(',');
      document.querySelectorAll(q).forEach(function(node){
        try{
          if(node.tagName === 'IMG' || node.tagName === 'SVG'){
            node.removeAttribute('height');
            node.removeAttribute('width');
            if(node.style){
              node.style.height = '';
              node.style.width  = '';
              node.style.maxHeight = 'calc(var(--sjt-bar-h) - 6px)';
            }
          }else{
            if(node.style){
              node.style.backgroundSize = 'contain';
              node.style.backgroundRepeat = 'no-repeat';
              node.style.backgroundPosition = 'center';
              node.style.height = 'var(--sjt-bar-h)';
              node.style.lineHeight = 'var(--sjt-bar-h)';
            }
          }
        }catch(e){}
      });
    }

    function bind(){
      candidates.forEach(function(el){
        try{
          var target = (el === window || el === document) ? window : el;
          target.addEventListener('scroll', checkAnyScroll, {passive:true});
        }catch(e){}
      });
      checkAnyScroll();
    }

    normalizeLogoNodes();
    bind();
    window.addEventListener('resize', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 60); });
    window.addEventListener('orientationchange', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 120); });
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 50); });
  }catch(e){
    console && console.warn && console.warn('sjt_shrink_nav v4 error:', e);
  }
})();
