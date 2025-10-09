// === SJT Index Gap Fix v16 (shim + exact align) ===
// 1) Inserts a shim (div) right before the slider with height = real header height.
// 2) Ensures slider sticks exactly under that shim; removes hairlines by 1–2px if needed.
// 3) Neutralizes inner image whitespace in slider and next block's top gap.
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try{ return el.getBoundingClientRect(); }catch(e){ return null; } }
  function setVar(name, v){ document.documentElement.style.setProperty(name, (Math.max(0, Math.round(v||0)) + 'px')); }
  function debounce(fn, ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }

  function apply(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if(!header || !slider) return;

    // Create or reuse shim directly before slider
    var shim = slider.previousElementSibling;
    if (!shim || !shim.classList.contains('sjt-header-shim')){
      shim = document.createElement('div');
      shim.className = 'sjt-header-shim';
      slider.parentNode.insertBefore(shim, slider);
    }

    // Determine real header height and background
    var h = header.offsetHeight || header.clientHeight || 0;
    var hb = getComputedStyle(header).backgroundColor;
    var bb = getComputedStyle(document.body).backgroundColor;
    shim.style.setProperty('--sjt-shim-h', Math.round(h) + 'px');
    shim.style.height = Math.round(h) + 'px';
    shim.style.backgroundColor = (hb && hb !== 'rgba(0, 0, 0, 0)') ? hb : bb;

    // Place slider right under shim (margin already 0 in CSS)
    // Hairline kill: if visual rect shows any positive gap, add -1/-2 margin via helper class
    setTimeout(function(){
      var rs = rect(slider), rshim = rect(shim);
      if (rs && rshim){
        var gap = Math.round(rs.top - rshim.bottom);
        if (gap > 0){
          slider.classList.add('sjt-hairline-kill');
        } else if (gap < -2){
          // If overlapped too much, remove the extra class
          slider.classList.remove('sjt-hairline-kill');
        }
      }
      // Next block flush
      var next = slider.nextElementSibling;
      if (next){
        next.style.marginTop = '0px';
        next.style.paddingTop = '0px';
        next.style.borderTopWidth = '0px';
        var rs2 = rect(slider), rn = rect(next);
        if (rs2 && rn){
          var gap2 = Math.round(rn.top - rs2.bottom);
          if (gap2 > 0){
            next.style.marginTop = (-gap2) + 'px';
          }
        }
        var fh = next.querySelector('h1, .h1, h2, .h2');
        if (fh){ fh.style.marginTop = '0px'; }
      }
    }, 40);
  }

  var run = debounce(apply, 60);
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('resize', function(){ setTimeout(run, 80); }, {passive:true});
  window.addEventListener('orientationchange', function(){ setTimeout(run, 80); }, {passive:true});
})();
