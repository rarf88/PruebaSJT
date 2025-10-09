// === SJT Index Gap Fix v13 (offsetTop) ===
// Compute layout gaps using offsetTop (not getBoundingClientRect), apply once via `top` and negative margin.
(function(){
  function $(q){ return document.querySelector(q); }
  function getTop(el){
    var top = 0;
    while (el){
      top += el.offsetTop || 0;
      el = el.offsetParent;
    }
    return top;
  }
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
  function run(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider) return;

    // 1) Compute doc-space gap between header bottom and slider top
    var headerBottom = getTop(header) + (header.offsetHeight || 0);
    var sliderTop = getTop(slider);
    var gap = sliderTop - headerBottom; // >0 means white space
    if (gap !== 0){
      var shift = clamp(-gap, -32, 0); // pull up at most 32px (sane bound)
      slider.style.top = shift + 'px';
    }

    // 2) Compute gap between slider bottom and next block's first content
    var next = slider.nextElementSibling;
    if (next){
      var sliderBottom = getTop(slider) + (slider.offsetHeight || 0) + (parseInt(slider.style.top||0) || 0);
      var nextTop = getTop(next);
      var gap2 = nextTop - sliderBottom;
      if (gap2 > 0){
        next.style.marginTop = (-clamp(gap2, 0, 32)) + 'px';
      }
      var h = next.querySelector('h1, .h1, h2, .h2');
      if (h){ h.style.marginTop = '0px'; }
    }
  }
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('orientationchange', run, {passive:true});
  window.addEventListener('resize', function(){ setTimeout(run, 80); }, {passive:true});
})();
