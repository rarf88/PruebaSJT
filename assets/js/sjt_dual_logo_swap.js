
// sjt_dual_logo_swap.js — primary stays normal; on shrink swap to a 30% secondary logo (mobile/tablet)
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var root = document.documentElement;
    var THRESHOLD = 10;
    var baseHeight = null;
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
    function ensureSecondary(){
      var logos = logoNodes(header);
      if(!logos.length) return;

      // pick primary
      var primaryCandidate = null;
      for(var i=0;i<logos.length;i++){
        var n = logos[i];
        if(n.classList && (n.classList.contains('sjt-primary-logo') || n.classList.contains('sjt-secondary-logo'))) continue;
        if(n.tagName === 'IMG' || n.tagName === 'SVG'){ primaryCandidate = n; break; }
      }
      primary = primaryCandidate || logos[0];
      if(primary && primary.classList) primary.classList.add('sjt-primary-logo');

      // find/create secondary
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
    function visibleHeight(el){
      try{ return Math.round((el.getBoundingClientRect().height)||0); }catch(e){ return 0; }
    }
    function measureBase(){
      if(baseHeight) return;
      if(!primary) return;
      var wasShrink = root.classList.contains('sjt-shrink');
      if(wasShrink) root.classList.remove('sjt-shrink');
      if(primary.tagName === 'IMG' || primary.tagName === 'SVG'){
        primary.removeAttribute('height'); primary.removeAttribute('width');
        primary.style.height=''; primary.style.width=''; primary.style.maxHeight='';
      }
      baseHeight = visibleHeight(primary);
      if(wasShrink) root.classList.add('sjt-shrink');
    }
    function sizeSecondaryTo(percent){
      if(!secondary || !baseHeight) return;
      var target = Math.max(10, Math.round(baseHeight * percent));
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
    function toggleState(){
      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var shrink = y > THRESHOLD;
      if(shrink){
        root.classList.add('sjt-shrink');
        sizeSecondaryTo(0.30); // 30% on shrink
      }else{
        root.classList.remove('sjt-shrink');
      }
    }
    function init(){
      header = pickHeader();
      if(!header) return;
      ensureSecondary();
      measureBase();
      toggleState();
      window.addEventListener('scroll', toggleState, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ baseHeight=null; measureBase(); toggleState(); }, 60); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseHeight=null; measureBase(); toggleState(); }, 100); }};
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ baseHeight=null; measureBase(); toggleState(); }, 30); });
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  }catch(e){}
})();
