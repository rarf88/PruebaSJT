// sjt_logo_swap_30_pure.js — móvil/tablet: no tocar barra; swap de logo y tamaño 30% al reducir
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var docEl = document.documentElement, body = document.body;
    var THRESHOLD = 10;
    var header = null, primary = null, secondary = null;
    var baseLogoH = null;
    var headerH0 = null;

    function pickHeader(){
      var list = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!list.length) return null;
      for(var i=0;i<list.length;i++){
        var el = list[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return list[0];
    }
    function findPrimary(scope){
      if(!scope) return null;
      var q = 'img.logo,.logo img,img[alt*="logo" i],img[src*="logo" i],svg[aria-label*="logo" i]';
      var nodes = scope.querySelectorAll(q);
      if(!nodes || !nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.tagName === 'IMG' || n.tagName === 'SVG') return n;
      }
      return nodes[0];
    }
    function rectH(el){
      try{ return Math.round((el.getBoundingClientRect().height)||0); }catch(e){ return 0; }
    }
    function ensureSecondary(){
      // Use an existing second node if present; else clone primary
      var candidates = header.querySelectorAll('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], svg[aria-label*="logo" i]');
      for(var i=0;i<candidates.length;i++){
        var n = candidates[i];
        if(n !== primary){ secondary = n; break; }
      }
      if(!secondary && primary){
        secondary = primary.cloneNode(true);
        secondary.setAttribute('aria-hidden','true');
        // remove fixed size attributes to allow max-height control
        if(secondary.removeAttribute){ secondary.removeAttribute('height'); secondary.removeAttribute('width'); }
        try{ primary.parentNode.insertBefore(secondary, primary.nextSibling); }catch(e){}
      }
      if(secondary){
        // Start hidden; we'll show it only when shrunk
        secondary.style.display = 'none';
        try{
          secondary.style.height = 'auto'; secondary.style.width = 'auto';
          secondary.style.objectFit = 'contain';
        }catch(e){}
      }
    }
    function measureBase(){
      header = pickHeader();
      primary = findPrimary(header);
      if(!header || !primary) return false;
      if(headerH0 === null) headerH0 = rectH(header);
      if(baseLogoH === null) baseLogoH = rectH(primary);
      return !!(headerH0 && baseLogoH);
    }
    function isShrunk(){
      var y = window.scrollY || docEl.scrollTop || body.scrollTop || 0;
      if(y > THRESHOLD) return true;
      var hNow = rectH(header);
      if(headerH0 && hNow && (hNow < headerH0 - 4)) return true;
      return false;
    }
    function apply(){
      if(!measureBase()) return;
      if(!secondary) ensureSecondary();
      if(!secondary) return;

      if(isShrunk()){
        // Hide primary, show secondary at 30% of base
        primary.style.display = 'none';
        var target = Math.max(10, Math.round(baseLogoH * 0.30));
        secondary.style.display = 'block';
        secondary.style.setProperty('max-height', target+'px', 'important');
        secondary.style.height = 'auto';
        secondary.style.width = 'auto';
        secondary.style.objectFit = 'contain';
      }else{
        // Restore primary, hide secondary
        primary.style.display = '';
        secondary.style.display = 'none';
        // do not touch primary sizing (keeps original behavior intact)
      }
    }
    function boot(){
      apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; apply(); }, 80); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; apply(); }, 120); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; apply(); }, 50); });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){
    console && console.warn && console.warn('sjt_logo_swap_30_pure error:', e);
  }
})();
