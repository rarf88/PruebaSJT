// === SJT Index Gap Force v7 (transform-based, repeated checks) ===
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function roundpx(v){ return Math.round(v); }

  function fix(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if(!header || !slider) return;

    // 1) Header -> Slider gap by transform
    var rh = rect(header), rs = rect(slider);
    if(rh && rs){
      var gap = rs.top - rh.bottom; // positive means white space
      var shift = 0;
      if (gap > 0) {
        shift = -roundpx(gap);
      } else if (gap < -2) {
        // If overlapping too much, allow a tiny positive downshift (max 2px)
        shift = clamp(-roundpx(gap + 2), -2, 0);
      }
      slider.style.transform = 'translate3d(0,' + shift + 'px,0)';
    }

    // 2) Slider -> Next block gap: eliminate top margin/padding and ensure 0
    var next = slider.nextElementSibling;
    if (next){
      // Zero out top spacing aggressively
      next.style.marginTop = '0px';
      next.style.paddingTop = '0px';
      next.style.borderTopWidth = '0px';
      var h = next.querySelector('h1, .h1, h2, .h2');
      if (h) { h.style.marginTop = '0px'; }

      // If still a gap appears due to subpixel layout, pull next up
      var rs2 = rect(slider), rn = rect(next);
      if (rs2 && rn){
        var gap2 = rn.top - rs2.bottom;
        if (gap2 > 0) {
          // Pull next up exactly the gap (negative margin)
          next.style.marginTop = (-roundpx(gap2)) + 'px';
        }
      }
    }
  }

  function schedule(){
    // run multiple times to catch late style/layout shifts
    var times = [30, 120, 240, 480, 960, 1600];
    times.forEach(function(t){ setTimeout(fix, t); });
  }

  ['DOMContentLoaded','load','resize','orientationchange'].forEach(function(evt){
    window.addEventListener(evt, schedule, {passive:true});
  });
  schedule();
})();
