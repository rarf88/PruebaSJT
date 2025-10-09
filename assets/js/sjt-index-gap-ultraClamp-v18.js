// === SJT Index Gap Fix v18 (ultra clamp) ===
// Walks the DOM between header→slider and slider→next to remove any top spacing contributors
// (margins/paddings <= 32px), then places slider with a tiny overlap to kill hairlines.
// Runs a few times with debounce; no continuous loops → no flicker.
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try{ return el.getBoundingClientRect(); }catch(e){ return null; } }
  function clampTopSpacing(el){
    if (!el) return;
    var cs = getComputedStyle(el);
    var mt = parseInt(cs.marginTop||'0',10)||0;
    var pt = parseInt(cs.paddingTop||'0',10)||0;
    var btw = parseInt(cs.borderTopWidth||'0',10)||0;
    // Clamp small top spacings that typically cause the white band
    if (mt > 0 && mt <= 32) el.style.marginTop = '0px';
    if (pt > 0 && pt <= 32) el.style.paddingTop = '0px';
    if (btw > 0 && btw <= 2) el.style.borderTopWidth = '0px';
  }
  function chainClamp(fromEl, toEl){
    var el = toEl;
    while (el && el !== fromEl && el !== document.body){
      clampTopSpacing(el);
      el = el.parentElement;
    }
  }
  function apply(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider) return;

    // 1) Remove top spacing along the chain from slider up to header/body
    chainClamp(header, slider);

    // 2) Place slider exactly under header with a tiny overlap
    var headerH = Math.round(header.offsetHeight || 0);
    var overlap = 4; // px: erase hairline
    slider.style.marginTop = Math.max(0, headerH - overlap) + 'px';

    // 3) Correct any residual delta after layout
    setTimeout(function(){
      var rh = rect(header), rs = rect(slider);
      if (rh && rs){
        var delta = Math.round(rs.top - rh.bottom);
        if (delta !== 0){
          var current = parseInt(getComputedStyle(slider).marginTop||'0',10)||0;
          slider.style.marginTop = (current - delta) + 'px';
        }
      }

      // 4) Next block: clamp own top spacing and overlap 2px if needed
      var next = slider.nextElementSibling;
      if (next){
        clampTopSpacing(next);
        var rs2 = rect(slider), rn = rect(next);
        if (rs2 && rn){
          var gap2 = Math.round(rn.top - rs2.bottom);
          if (gap2 > 0){
            next.style.marginTop = (-gap2 - 2) + 'px'; // include micro-overlap
          }else if (gap2 < -4){
            next.style.marginTop = (parseInt(getComputedStyle(next).marginTop||'0',10) - (gap2 + 4)) + 'px';
          }else{
            // ensure at least 0 or tiny negative for hairline
            var mt = parseInt(getComputedStyle(next).marginTop||'0',10) || 0;
            if (mt > -2) next.style.marginTop = '-2px';
          }
        }
        var h1 = next.querySelector('h1, .h1, h2, .h2'); if (h1) h1.style.marginTop = '0px';
      }
    }, 40);
  }
  function debounce(fn, ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }
  var run = debounce(apply, 80);

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('orientationchange', run, {passive:true});
  window.addEventListener('resize', run, {passive:true});
})();
