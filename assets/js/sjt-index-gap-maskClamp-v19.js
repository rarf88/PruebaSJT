// === SJT Index Gap Fix v19 (mask + clamp + exact place) ===
// 1) Place slider exactly under header using margin-top = header offsetHeight.
// 2) Clamp any top spacing up the ancestor chain.
// 3) Set header background color into CSS var for the visual mask (slider::before).
// 4) Correct tiny residual deltas once after paint. No loops → no flicker.
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try{ return el.getBoundingClientRect(); }catch(e){ return null; } }
  function clampTop(el){
    if (!el) return;
    var cs = getComputedStyle(el);
    var mt = parseInt(cs.marginTop||'0',10)||0;
    var pt = parseInt(cs.paddingTop||'0',10)||0;
    var bt = parseInt(cs.borderTopWidth||'0',10)||0;
    if (mt && mt > 0 && mt <= 32) el.style.marginTop = '0px';
    if (pt && pt > 0 && pt <= 32) el.style.paddingTop = '0px';
    if (bt && bt > 0 && bt <= 2) el.style.borderTopWidth = '0px';
    // Also clamp gaps in flex/grid
    if (cs.gap && cs.gap !== '0px') el.style.gap = '0px';
    if (cs.rowGap && cs.rowGap !== '0px') el.style.rowGap = '0px';
  }
  function climbClamp(fromEl, toEl){
    var el = toEl;
    while (el && el !== fromEl && el !== document.body){
      clampTop(el);
      el = el.parentElement;
    }
  }
  function apply(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider) return;

    // 0) Set header bg -> CSS var for the visual mask
    var hb = getComputedStyle(header).backgroundColor || '#fff';
    document.documentElement.style.setProperty('--_sjt-header-bg', hb);

    // 1) Clamp chain between header and slider
    climbClamp(header, slider);

    // 2) Place slider exactly after header
    var H = Math.round(header.offsetHeight || 0);
    slider.style.marginTop = H + 'px';

    // 3) After paint, correct tiny delta and ensure next block is flush
    setTimeout(function(){
      var rh = rect(header), rs = rect(slider);
      if (rh && rs){
        var delta = Math.round(rs.top - rh.bottom); // +gap, -overlap
        if (delta){
          var current = parseInt(getComputedStyle(slider).marginTop||'0',10)||0;
          slider.style.marginTop = (current - delta) + 'px';
        }
      }
      // Next block flush
      var next = slider.nextElementSibling;
      if (next){
        clampTop(next);
        var rs2 = rect(slider), rn = rect(next);
        if (rs2 && rn){
          var gap2 = Math.round(rn.top - rs2.bottom);
          if (gap2 > 0){
            next.style.marginTop = (-gap2) + 'px';
          }
        }
        var h1 = next.querySelector('h1, .h1, h2, .h2'); if (h1) h1.style.marginTop = '0px';
      }
    }, 40);
  }
  function debounce(fn,ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }
  var run = debounce(apply, 80);
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('orientationchange', run, {passive:true});
  window.addEventListener('resize', run, {passive:true});
})();
