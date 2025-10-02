
// sjt_logo_half_on_shrink.js — mobile/tablet: primary logo = 50% when bar shrinks
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var root = document.documentElement;
    var THRESHOLD = 10;
    var baseHeight = null;
    var header = null;
    var logo = null;

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return nodes[0];
    }
    function pickPrimaryLogo(scope){
      if(!scope) return null;
      var q = 'img.logo,.logo img,img[alt*=\"logo\" i],img[src*=\"logo\" i],.logo svg';
      var nodes = scope.querySelectorAll(q);
      if(!nodes || !nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var n = nodes[i];
        if(n.tagName === 'IMG' || n.tagName === 'SVG') return n;
      }
      return nodes[0];
    }
    function measureBase(){
      if(baseHeight) return;
      if(!header || !logo) return;
      var wasShrink = root.classList.contains('sjt-shrink');
      if(wasShrink) root.classList.remove('sjt-shrink');
      try{
        // remove inline constraints
        if(logo.tagName === 'IMG' || logo.tagName === 'SVG'){
          logo.removeAttribute('height'); logo.removeAttribute('width');
          logo.style.height=''; logo.style.width=''; logo.style.maxHeight='';
        }
      }catch(e){}
      try{
        var h = logo.getBoundingClientRect().height;
        if(h && h > 10) baseHeight = Math.round(h);
      }catch(e){}
      if(wasShrink) root.classList.add('sjt-shrink');
    }
    function setPrimaryLogoHeight(px){
      if(!logo || !px) return;
      var target = Math.max(12, Math.round(px));
      if(logo.tagName === 'IMG' || logo.tagName === 'SVG'){
        logo.style.setProperty('max-height', target+'px', 'important');
        logo.style.setProperty('height', 'auto', 'important');
        logo.style.setProperty('width', 'auto', 'important');
        logo.style.setProperty('object-fit', 'contain', 'important');
      }else{
        logo.style.setProperty('height', target+'px', 'important');
        logo.style.setProperty('line-height', target+'px', 'important');
        logo.style.setProperty('background-size', 'contain', 'important');
      }
    }
    function apply(){
      if(!mq.matches) return;
      if(!header) header = pickHeader();
      if(!header) return;
      if(!logo) logo = pickPrimaryLogo(header);
      if(!logo) return;
      if(!baseHeight) measureBase();

      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var shrink = y > THRESHOLD;
      if(shrink){
        setPrimaryLogoHeight(baseHeight * 0.5);
        root.classList.add('sjt-shrink');
      }else{
        setPrimaryLogoHeight(baseHeight);
        root.classList.remove('sjt-shrink');
      }
    }
    function boot(){
      header = pickHeader();
      logo   = pickPrimaryLogo(header);
      measureBase();
      apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ baseHeight=null; measureBase(); apply(); }, 60); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseHeight=null; measureBase(); apply(); }, 100); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ baseHeight=null; measureBase(); apply(); }, 30); });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){}
})();
