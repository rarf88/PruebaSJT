// sjt_logo_only_shrink_30.js — móvil/tablet: NO tocar la barra; solo reducir el logo al 30% en scroll
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var docEl = document.documentElement, body = document.body;
    var THRESHOLD = 10; // píxeles
    var header = null, logo = null;
    var baseLogoH = null;       // altura natural del logo al inicio
    var baseMaxHeight = null;   // valor original de max-height del logo (si existía)
    var headerH0 = null;        // altura inicial del header (solo para detectar shrink nativo)

    function pickHeader(){
      var list = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!list.length) return null;
      // priorizar el que contenga algo que parezca logo
      for(var i=0;i<list.length;i++){
        var el = list[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return list[0];
    }
    function pickPrimaryLogo(scope){
      if(!scope) return null;
      var q = 'img.logo,.logo img,img[alt*="logo" i],img[src*="logo" i],.logo svg';
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
    function measureBase(){
      header = pickHeader();
      logo   = pickPrimaryLogo(header);
      if(!header || !logo) return false;

      // Guardar el max-height original (si hubiera)
      try{ baseMaxHeight = (logo.style && logo.style.maxHeight) ? logo.style.maxHeight : null; }catch(e){ baseMaxHeight = null; }

      // Medir alturas de referencia sin tocar nada
      headerH0 = rectH(header) || headerH0;
      baseLogoH = rectH(logo)   || baseLogoH;
      return !!(headerH0 && baseLogoH);
    }
    function setLogoHeight(px){
      if(!logo || !px) return;
      var target = Math.max(10, Math.round(px));
      if(logo.tagName === 'IMG' || logo.tagName === 'SVG'){
        logo.style.setProperty('max-height', target+'px', 'important');
        logo.style.setProperty('height', 'auto', 'important');
        logo.style.setProperty('width', 'auto', 'important');
        logo.style.setProperty('object-fit', 'contain', 'important');
      }else{
        // contenedor .logo con background
        logo.style.setProperty('height', target+'px', 'important');
        logo.style.setProperty('line-height', target+'px', 'important');
        logo.style.setProperty('background-size', 'contain', 'important');
      }
    }
    function restoreLogo(){
      if(!logo) return;
      // Restaurar su max-height original (si existía); si no, limpiar el nuestro
      if(baseMaxHeight && baseMaxHeight.length){
        logo.style.setProperty('max-height', baseMaxHeight, 'important');
      }else{
        logo.style.removeProperty('max-height');
      }
      // No tocar height/width del logo
    }
    function isShrunk(){
      // el sitio puede ya reducir la barra: detectamos por scroll o por menor altura del header
      var y = window.scrollY || docEl.scrollTop || body.scrollTop || 0;
      if(y > THRESHOLD) return true;
      var hNow = rectH(header);
      if(headerH0 && hNow && (hNow < headerH0 - 4)) return true;
      return false;
    }
    function apply(){
      if(!logo || !header){ if(!measureBase()) return; }
      if(isShrunk()){
        setLogoHeight(baseLogoH * 0.30); // 30% del original
      }else{
        restoreLogo();
      }
    }
    function boot(){
      if(!measureBase()) return;
      apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; measureBase(); apply(); }, 80); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; measureBase(); apply(); }, 120); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ headerH0=null; baseLogoH=null; measureBase(); apply(); }, 50); });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){
    console && console.warn && console.warn('sjt_logo_only_shrink_30 error:', e);
  }
})();
