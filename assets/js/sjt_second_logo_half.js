// sjt_second_logo_half.js — mobile/tablet: keep header visible; second logo = 50% of first
(function(){
  try{
    var mq = window.matchMedia('(max-width:1024px)');
    if(!mq.matches) return;

    function pickHeader(){
      var nodes = document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]');
      if(!nodes.length) return null;
      // Prefer the one that holds some logo-like node
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]')){
          return el;
        }
      }
      return nodes[0];
    }

    function logosIn(el){
      if(!el) return [];
      return Array.prototype.slice.call(el.querySelectorAll([
        'img.logo','.logo img','img[alt*="logo" i]','img[src*="logo" i]','.logo svg'
      ].join(',')));
    }

    function apply(){
      var header = pickHeader();
      if(!header) return;
      var logos = logosIn(header);
      if(logos.length < 2) return; // nothing to do; we only adjust the second
      var first = logos[0], second = logos[1];

      // compute reference height (prefer first logo's rendered height; fallback to header height)
      var h = 0;
      try{ h = first.getBoundingClientRect().height; }catch(e){ h = 0; }
      if(!h || h < 10){
        try{ h = header.getBoundingClientRect().height; }catch(e){}
      }
      if(!h || h < 10) return;

      var target = Math.max(12, Math.round(h * 0.5));

      // keep first untouched; enforce second to 50%
      try{
        if(second.tagName === 'IMG' || second.tagName === 'SVG'){
          second.style.setProperty('max-height', target + 'px', 'important');
          second.style.setProperty('height', 'auto', 'important');
          second.style.setProperty('width', 'auto', 'important');
          second.style.setProperty('object-fit', 'contain', 'important');
          second.style.removeProperty('display'); // ensure visible
          second.style.removeProperty('visibility');
          second.style.opacity = '';
        }else{
          // if it is a container .logo with background-image
          second.style.setProperty('height', target + 'px', 'important');
          second.style.setProperty('line-height', target + 'px', 'important');
          second.style.setProperty('background-size', 'contain', 'important');
          second.style.removeProperty('display');
          second.style.removeProperty('visibility');
          second.style.opacity = '';
        }
      }catch(e){}
    }

    // bind
    function boot(){
      apply();
      window.addEventListener('scroll', apply, {passive:true});
      window.addEventListener('resize', function(){ setTimeout(apply, 50); });
      window.addEventListener('orientationchange', function(){ setTimeout(apply, 80); });
      document.addEventListener('DOMContentLoaded', function(){ setTimeout(apply, 30); });
    }
    if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
  }catch(e){
    console && console.warn && console.warn('sjt_second_logo_half error:', e);
  }
})();
