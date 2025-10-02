
// sjt_second_logo_relative.js — mobile/tablet: first logo untouched; second logo smaller
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    var root = document.documentElement;
    var THRESHOLD = 10;
    var baseHeight = null; // first logo natural height
    var header = null, firstLogo = null, secondLogo = null;

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')) return el;
      }
      return nodes[0];
    }
    function findLogos(scope){
      if(!scope) return [];
      var q = 'img.logo,.logo img,img[alt*=\"logo\" i],img[src*=\"logo\" i],.logo svg';
      return Array.prototype.slice.call(scope.querySelectorAll(q));
    }
    function visibleHeight(node){
      try{
        var r = node.getBoundingClientRect();
        return Math.round(r.height || 0);
      }catch(e){ return 0; }
    }
    function cleanupSecondInline(){
      if(!secondLogo) return;
      try{
        if(secondLogo.tagName === 'IMG' || secondLogo.tagName === 'SVG'){
          secondLogo.removeAttribute('height'); secondLogo.removeAttribute('width');
          secondLogo.style.height=''; secondLogo.style.width='';
        }else{
          // container with background-image
          secondLogo.style.removeProperty('height');
          secondLogo.style.removeProperty('line-height');
          secondLogo.style.backgroundSize='contain';
          secondLogo.style.backgroundRepeat='no-repeat';
          secondLogo.style.backgroundPosition='center';
        }
      }catch(e){}
    }
    function measureBase(){
      if(baseHeight) return;
      if(!firstLogo) return;
      // temporarily clear any constraints that our previous scripts might have applied to FIRST
      var h = visibleHeight(firstLogo);
      if(h && h > 10){ baseHeight = h; return; }
      // As fallback, use header height
      if(header){
        var hh = 0;
        try{ hh = Math.round(header.getBoundingClientRect().height || 0); }catch(e){}
        if(hh && hh > 10){ baseHeight = hh; }
      }
    }
    function apply(){
      if(!mq.matches) return;
      if(!header) header = pickHeader();
      if(!header) return;
      if(!firstLogo || !secondLogo){
        var logos = findLogos(header);
        if(!logos.length) return;
        firstLogo = logos[0] || null;
        secondLogo = logos[1] || null;
      }
      if(!firstLogo || !secondLogo) return;
      if(!baseHeight || baseHeight < 10) measureBase();
      if(!baseHeight || baseHeight < 10) return;

      var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var shrink = y > THRESHOLD;

      // FIRST LOGO: untouched — do not set sizes on it at all

      // SECOND LOGO: smaller ratios
      cleanupSecondInline();
      var ratio = shrink ? 0.35 : 0.5; // much smaller on shrink
      var target = Math.max(12, Math.round(baseHeight * ratio));
      if(secondLogo.tagName === 'IMG' || secondLogo.tagName === 'SVG'){
        secondLogo.style.setProperty('max-height', target+'px', 'important');
        secondLogo.style.setProperty('height', 'auto', 'important');
        secondLogo.style.setProperty('width', 'auto', 'important');
        secondLogo.style.setProperty('object-fit', 'contain', 'important');
        secondLogo.style.removeProperty('display');
        secondLogo.style.removeProperty('visibility');
        secondLogo.style.opacity = '';
      }else{
        secondLogo.style.setProperty('height', target+'px', 'important');
        secondLogo.style.setProperty('line-height', target+'px', 'important');
        secondLogo.style.setProperty('background-size', 'contain', 'important');
      }
    }
    function boot(){
      apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(function(){ baseHeight=null; apply(); }, 60); });
      window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseHeight=null; apply(); }, 90); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(function(){ baseHeight=null; apply(); }, 30); });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){
    console && console.warn && console.warn('sjt_second_logo_relative error:', e);
  }
})();
