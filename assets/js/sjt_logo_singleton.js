// sjt_logo_singleton.js — 2025-10-02
(function(){
  try{
    var mq = window.matchMedia('(max-width: 1024px)');
    if(!mq.matches){ return; } // only mobile/tablet

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      // Prefer a container that actually holds a logo-like node
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')){
          return el;
        }
      }
      return nodes[0];
    }

    function logoCandidates(scope){
      return Array.prototype.slice.call(scope.querySelectorAll([
        'img.logo','header .logo img','nav .logo img','.navbar .logo img','.topbar .logo img',
        'img[alt*="logo" i]','img[src*="logo" i]','.logo svg','.logo'
      ].join(',')));
    }

    function ensureSingleton(){
      var header = pickHeader();
      if(!header) return;

      var logos = logoCandidates(header).filter(Boolean);
      if(!logos.length) return;

      // Choose the "primary" logo: first visible IMG/SVG; otherwise first .logo div
      var primary = null;
      for(var i=0;i<logos.length;i++){
        var n = logos[i];
        var cs = window.getComputedStyle(n);
        var vis = cs && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
        if((n.tagName === 'IMG' || n.tagName === 'SVG') && vis){ primary = n; break; }
      }
      if(!primary) primary = logos[0];

      // Remove every other logo node from the DOM (hard remove to avoid overlay)
      logos.forEach(function(n){
        if(n !== primary){
          try{ n.parentNode && n.parentNode.removeChild(n); }catch(e){}
        }
      });

      // Clean inline constraints on the survivor
      if(primary){
        try{
          if(primary.tagName === 'IMG' || primary.tagName === 'SVG'){
            primary.removeAttribute('height'); primary.removeAttribute('width');
            primary.style.height = 'auto'; primary.style.width = 'auto';
            primary.style.objectFit = 'contain'; primary.style.display = 'block';
          }else{
            // if container with background-image
            primary.style.backgroundSize = 'contain';
            primary.style.backgroundRepeat = 'no-repeat';
            primary.style.backgroundPosition = 'center';
          }
        }catch(e){}
      }

      // Bind logo visual height strictly to header height
      try{
        var h = header.getBoundingClientRect().height || 64;
        var inner = Math.max(24, h - 6);
        if(primary){
          if(primary.tagName === 'IMG' || primary.tagName === 'SVG'){
            primary.style.maxHeight = inner + 'px';
          }else{
            primary.style.height = h + 'px';
            primary.style.lineHeight = h + 'px';
          }
        }
      }catch(e){}
    }

    // Initial run and observers to catch late inserts/clones
    function boot(){
      ensureSingleton();
      // re-run on scroll/resize/orientation
      window.addEventListener('scroll', ensureSingleton, {passive:true});
      window.addEventListener('resize', ensureSingleton);
      window.addEventListener('orientationchange', function(){ setTimeout(ensureSingleton, 80); });
      // MutationObserver on header area
      var root = document.body || document.documentElement;
      try{
        var mo = new MutationObserver(function(muts){ ensureSingleton(); });
        mo.observe(root, { childList:true, subtree:true, attributes:false });
      }catch(e){}
    }

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', boot);
    }else{
      boot();
    }
  }catch(e){
    console && console.warn && console.warn('sjt_logo_singleton error:', e);
  }
})();
