
// sjt_logo_singleton_safe.js — keep exactly one visible logo on mobile/tablet (non-destructive)
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return nodes[0];
    }

    function candidates(scope){
      return Array.prototype.slice.call(scope.querySelectorAll([
        'header .logo img','nav .logo img','.navbar .logo img','.topbar .logo img',
        'img.logo','img[alt*="logo" i]','img[src*="logo" i]','.logo svg','.logo'
      ].join(',')));
    }

    function ensureOneVisible(){
      var header = pickHeader();
      if(!header) return;
      var nodes = candidates(header);
      if(!nodes.length) return;

      // Choose primary: prefer IMG/SVG centered/visible
      var primary = null;
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.tagName === 'IMG' || n.tagName === 'SVG'){ primary = n; break; }
      }
      if(!primary) primary = nodes[0];

      // Make primary visible and reset styles
      try{
        if(primary.tagName === 'IMG' || primary.tagName === 'SVG'){
          primary.style.removeProperty('display');
          primary.style.removeProperty('visibility');
          primary.style.opacity = '';
          primary.style.height = 'auto';
          primary.style.width  = 'auto';
          primary.style.objectFit = 'contain';
          primary.style.display = 'block';
        }else{
          primary.style.removeProperty('display');
          primary.style.removeProperty('visibility');
          primary.style.opacity = '';
        }
      }catch(e){}

      // Hide duplicates (non-destructive): images/SVGs go display:none; containers use visibility hidden to preserve layout if needed
      nodes.forEach(function(n){
        if(n === primary) return;
        try{
          if(n.tagName === 'IMG' || n.tagName === 'SVG'){
            n.style.setProperty('display','none','important');
          }else{
            n.style.setProperty('visibility','hidden','important');
            n.style.setProperty('pointer-events','none','important');
          }
        }catch(e){}
      });
    }

    function boot(){
      ensureOneVisible();
      window.addEventListener('scroll', ensureOneVisible, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(ensureOneVisible, 50); });
      window.addEventListener('orientationchange', function(){ setTimeout(ensureOneVisible, 80); });
      try{
        var mo = new MutationObserver(function(){ ensureOneVisible(); });
        mo.observe(document.documentElement, {childList:true, subtree:true});
      }catch(e){}
    }

    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){}
})();
