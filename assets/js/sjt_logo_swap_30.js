// sjt_logo_swap_30.js — primer logo intacto; en reducido mostrar uno al 30% del original
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var root = document.documentElement;
    var baseHeight = null;  // altura original del primer logo
    var header = null, primary = null, secondary = null;

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return nodes[0];
    }
    function logoNodes(scope){
      if(!scope) return [];
      var q = 'img.logo,.logo img,img[alt*=\"logo\" i],img[src*=\"logo\" i],.logo svg,.logo';
      return Array.prototype.slice.call(scope.querySelectorAll(q));
    }
    function visibleHeight(el){
      try{ return Math.round((el.getBoundingClientRect().height)||0); }catch(e){ return 0; }
    }
    function ensureLogos(){
      var logos = logoNodes(header);
      if(!logos.length) return;
      // primario: primer IMG/SVG visible; sino el primer .logo
      for(var i=0;i<logos.length;i++){
        var n = logos[i];
        if(n.tagName === 'IMG' || n.tagName === 'SVG'){ primary = n; break; }
      }
      primary = primary || logos[0];
      if(primary && primary.classList) primary.classList.add('sjt-primary-logo');

      // secundario: otro nodo; si no existe, clonar el primario
      for(var j=0;j<logos.length;j++){
        var m = logos[j];
        if(m === primary) continue;
        secondary = m; break;
      }
      if(!secondary && primary){
        secondary = primary.cloneNode(true);
        secondary.setAttribute('aria-hidden','true');
        if(secondary.removeAttribute){ secondary.removeAttribute('height'); secondary.removeAttribute('width'); }
        try{ primary.parentNode.insertBefore(secondary, primary.nextSibling); }catch(e){}
      }
      if(secondary && secondary.classList) secondary.classList.add('sjt-secondary-logo');
    }
    function measureBase(){
      if(baseHeight) return;
      if(!primary) return;
      // NO tocamos el primario; medimos su altura tal cual
      baseHeight = visibleHeight(primary);
      if(!baseHeight || baseHeight < 10){
        try{
          var h = (header && header.getBoundingClientRect().height) || 0;
          baseHeight = Math.round(h);
        }catch(e){}
      }
    }
    function sizeSecondary(){
      if(!secondary || !baseHeight) return;
      var target = Math.max(10, Math.round(baseHeight * 0.30)); // 30%
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
    function update(){
      if(!header) header = pickHeader();
      if(!header) return;
      if(!primary || !secondary) ensureLogos();
      if(!primary || !secondary) return;
      if(!baseHeight || baseHeight < 10) measureBase();
      if(!baseHeight || baseHeight < 10) return;
      // En reducido, se mostrará el secundario por CSS; aquí solo fijamos su tamaño
      sizeSecondary();
    }
    function boot(){
      update();
      window.addEventListener('resize', function(){ setTimeout(function(){ baseHeight=null; update(); }, 80); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseHeight=null; update(); }, 120); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ baseHeight=null; update(); }, 40); });
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  }catch(e){}
})();
