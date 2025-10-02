// sjt_shrink_nav.js — v3 (2025-10-02)
(function(){
  try{
    var threshold = 10;
    var root = document.documentElement;

    // Candidate scroll containers to observe
    var candidates = [
      window,
      document,
      document.scrollingElement,
      document.documentElement,
      document.body
    ];

    // Add common app wrappers that sometimes control scrolling
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

    // De-dup
    candidates = candidates.filter(Boolean).filter(function(x, i, a){ return a.indexOf(x) === i; });

    function setShrink(active){
      if(active){
        if(!root.classList.contains('sjt-shrink')) root.classList.add('sjt-shrink');
      }else{
        if(root.classList.contains('sjt-shrink')) root.classList.remove('sjt-shrink');
      }
    }

    function checkAnyScroll(){
      var yWindow = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if(yWindow > threshold){ setShrink(true); return; }
      for(var i=0;i<candidates.length;i++){
        var el = candidates[i];
        var y = 0;
        if(el === window || el === document){
          continue;
        }else{
          try{ y = el.scrollTop || 0; }catch(e){ y = 0; }
        }
        if(y > threshold){ setShrink(true); return; }
      }
      setShrink(false);
    }

    // Normalize any inline sizes on logo images that might block CSS overrides
    function normalizeLogoNodes(){
      var q = [
        'header .logo img','nav .logo img','.navbar .logo img','.topbar .logo img',
        'img.logo','img[alt*="logo" i]','img[src*="logo" i]','.logo svg','header .logo','nav .logo'
      ].join(',');
      document.querySelectorAll(q).forEach(function(node){
        try{
          // Remove hardcoded inline constraints
          if(node.tagName === 'IMG' || node.tagName === 'SVG'){
            node.removeAttribute('height');
            node.removeAttribute('width');
            if(node.style){
              node.style.height = '';
              node.style.width  = '';
              node.style.maxHeight = 'var(--sjt-nav-height)';
            }
          }else{
            // background logo container
            if(node.style){
              node.style.backgroundSize = 'contain';
              node.style.backgroundRepeat = 'no-repeat';
              node.style.backgroundPosition = 'center';
              node.style.height = 'var(--sjt-nav-height)';
              node.style.lineHeight = 'var(--sjt-nav-height)';
            }
          }
        }catch(e){}
      });
    }

    // Attach scroll listeners
    function bind(){
      candidates.forEach(function(el){
        try{
          if(el === window || el === document){
            (el === window ? window : document).addEventListener('scroll', checkAnyScroll, {passive:true});
          }else{
            el.addEventListener('scroll', checkAnyScroll, {passive:true});
          }
        }catch(e){}
      });
      checkAnyScroll();
    }

    // Init
    normalizeLogoNodes();
    bind();

    // Re-evaluate on resize/orientation (mobile behavior)
    window.addEventListener('resize', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 60); });
    window.addEventListener('orientationchange', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 120); });

    // Safety: also run after content-loaded (SPAs might swap header late)
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ normalizeLogoNodes(); checkAnyScroll(); }, 50); });
  }catch(e){
    console && console.warn && console.warn('sjt_shrink_nav v3 error:', e);
  }
})();
