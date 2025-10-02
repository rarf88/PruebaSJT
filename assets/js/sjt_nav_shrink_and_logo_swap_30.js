// sjt_nav_shrink_and_logo_swap_30.js
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var root = document.documentElement;
    var THRESHOLD = 10;
    var header = null, primary = null, secondary = null;
    var H0 = null;        // altura original de la barra
    var baseLogo = null;  // altura original del primer logo

    function pickHeader(){
      var list = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!list.length) return null;
      for(var i=0;i<list.length;i++){
        var el = list[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return list[0];
    }

    function qLogos(scope){
      var q = 'img.logo,.logo img,img[alt*="logo" i],img[src*="logo" i],.logo svg,.logo';
      return Array.prototype.slice.call(scope.querySelectorAll(q));
    }

    function rectH(el){
      try{ return Math.round((el.getBoundingClientRect().height)||0); }catch(e){ return 0; }
    }

    function measure(){
      // asegurar estado normal para medir
      var wasShrink = root.classList.contains('sjt-shrink');
      if(wasShrink) root.classList.remove('sjt-shrink');

      header = pickHeader();
      if(!header) return;

      // medir barra
      H0 = rectH(header) || 64;

      // detectar logos y medir el primario
      var logos = qLogos(header);
      if(logos && logos.length){
        // preferimos IMG/SVG
        for(var i=0;i<logos.length;i++){
          if(logos[i].tagName === 'IMG' || logos[i].tagName === 'SVG'){ primary = logos[i]; break; }
        }
        primary = primary || logos[0];
        if(primary && primary.classList) primary.classList.add('sjt-primary-logo');

        // crear/encontrar secundario
        for(var j=0;j<logos.length;j++){
          if(logos[j] !== primary){ secondary = logos[j]; break; }
        }
        if(!secondary && primary){
          secondary = primary.cloneNode(true);
          secondary.setAttribute('aria-hidden','true');
          if(secondary.removeAttribute){ secondary.removeAttribute('height'); secondary.removeAttribute('width'); }
          try{ primary.parentNode.insertBefore(secondary, primary.nextSibling); }catch(e){}
        }
        if(secondary && secondary.classList) secondary.classList.add('sjt-secondary-logo');

        baseLogo = rectH(primary) || Math.round(H0 * 0.9);
      }

      // restaurar si estaba reducido
      if(wasShrink) root.classList.add('sjt-shrink');
    }

    function setHeaderHeight(px){
      if(!header || !px) return;
      header.style.setProperty('height', px+'px', 'important');
      header.style.setProperty('min-height', px+'px', 'important');
    }

    function sizeSecondaryTo(percent){
      if(!secondary || !baseLogo) return;
      var target = Math.max(10, Math.round(baseLogo * percent));
      if(secondary.tagName === 'IMG' || secondary.tagName === 'SVG'){
        secondary.style.setProperty('max-height', target+'px', 'important');
        secondary.style.setProperty('height', 'auto', 'important');
        secondary.style.setProperty('width', 'auto', 'important');
        secondary.style.setProperty('object-fit', 'contain', 'important');
      }else{
        secondary.style.setProperty('height', target+'px', 'important');
        secondary.style.setProperty('line-height', target+'px', 'important');
        secondary.style.setProperty('background-size', 'contain', 'important');
      }
    }

    function apply(){
      if(!header) measure();
      if(!header) return;

      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var shrink = y > THRESHOLD;

      if(shrink){
        root.classList.add('sjt-shrink');
        var H1 = Math.max(32, Math.round((H0||64) * 0.7));  // reduce barra ~30%
        setHeaderHeight(H1);
        sizeSecondaryTo(0.30); // logo secundario al 30% del original
      }else{
        root.classList.remove('sjt-shrink');
        setHeaderHeight(H0||64); // barra a tamaño original
        // el logo primario queda intacto (no se toca)
      }
    }

    function boot(){
      measure(); apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ H0=null; baseLogo=null; measure(); apply(); }, 80); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ H0=null; baseLogo=null; measure(); apply(); }, 120); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ H0=null; baseLogo=null; measure(); apply(); }, 50); });
    }

    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){
    console && console.warn && console.warn('sjt_nav_shrink_and_logo_swap_30 error:', e);
  }
})();
