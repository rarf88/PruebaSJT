// === SJT Index Gap Enforcer v9 ===
// Recomputes and enforces zero gap continuously for a short period and on mutations.
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function round(v){ return Math.round(v); }

  var slider, header, next, ticking = false;

  function compute(){
    if(!header || !slider) return;
    var rh = rect(header), rs = rect(slider);
    if (rh && rs){
      var gap = (rs.top) - (rh.bottom);
      var shift = 0;
      if (gap > 0) shift = -round(gap);
      else if (gap < -2) shift = -round(gap + 2); // keep max 2px overlap guard
      slider.style.top = shift + 'px';
    }
    if (!next) next = slider && slider.nextElementSibling;
    if (next){
      // kill top spacing
      next.style.marginTop = '0px';
      next.style.paddingTop = '0px';
      next.style.borderTopWidth = '0px';
      var rs2 = rect(slider), rn = rect(next);
      if (rs2 && rn){
        var gap2 = rn.top - rs2.bottom;
        if (gap2 > 0){
          next.style.marginTop = (-round(gap2)) + 'px';
        }
      }
      var fh = next.querySelector('h1, .h1, h2, .h2');
      if (fh){ fh.style.marginTop = '0px'; }
    }
  }

  function rafTick(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      compute();
      ticking = false;
    });
  }

  function startLoops(){
    // fast loop for first 2s
    var t0 = Date.now();
    (function loop(){
      rafTick();
      if (Date.now() - t0 < 2000) setTimeout(loop, 16);
    })();
    // slower loop up to 6s
    var t1 = Date.now();
    (function loop2(){
      rafTick();
      if (Date.now() - t1 < 6000) setTimeout(loop2, 120);
    })();
  }

  function init(){
    header = $('header, .site-header, .navbar, .topbar');
    slider = $('section.slider');
    if (!header || !slider) return;
    slider.style.position = 'relative';
    slider.style.top = '0px';
    startLoops();

    // Observe mutations inside header/slider/next to re-apply
    var mo = new MutationObserver(rafTick);
    try{
      mo.observe(slider, {attributes:true, childList:true, subtree:true});
      mo.observe(document.body, {attributes:true, childList:false, subtree:false});
    }catch(e){}
    window.addEventListener('resize', rafTick, {passive:true});
    window.addEventListener('orientationchange', rafTick, {passive:true});
    window.addEventListener('load', rafTick);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
