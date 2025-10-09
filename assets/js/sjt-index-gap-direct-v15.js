// === SJT Index Gap Fix v15 (direct margin control) ===
(function(){
  function q(s){ return document.querySelector(s); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function apply(){
    var header = q('header, .site-header, .navbar, .topbar');
    var slider = q('section.slider');
    if(!header || !slider) return;

    // 1) Place slider right under header using exact header height
    var h = header.offsetHeight || 0;
    slider.style.marginTop = h + 'px';

    // 2) Fine-correct: if there's any residual gap or overlap of up to 2px, adjust margin.
    //    We work with visual rects after the initial placement.
    setTimeout(function(){
      var rh = rect(header), rs = rect(slider);
      if (rh && rs){
        var delta = Math.round(rs.top - rh.bottom);
        if (delta !== 0){
          // Negative delta = overlap; Positive = gap
          var current = parseInt(getComputedStyle(slider).marginTop || '0', 10) || 0;
          var corrected = current - delta; // subtract the difference
          slider.style.marginTop = corrected + 'px';
        }
      }

      // 3) Ensure the next block is flush with the bottom of the slider
      var next = slider.nextElementSibling;
      if (next){
        next.style.marginTop = '0px';
        next.style.paddingTop = '0px';
        var rs2 = rect(slider), rn = rect(next);
        if (rs2 && rn){
          var gap2 = Math.round(rn.top - rs2.bottom);
          if (gap2 > 0){
            next.style.marginTop = (-gap2) + 'px';
          }
        }
        var h1 = next.querySelector('h1, .h1, h2, .h2');
        if (h1){ h1.style.marginTop = '0px'; }
      }
    }, 30);
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
  window.addEventListener('load', apply, {passive:true});
  window.addEventListener('orientationchange', function(){ setTimeout(apply, 80); }, {passive:true});
  window.addEventListener('resize', function(){ setTimeout(apply, 80); }, {passive:true});
})();
