// === SJT Index Gap Fix v11 (no flicker + overlap) ===
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function setVar(name, px){ try{ document.documentElement.style.setProperty(name, (Math.max(0, Math.round(px||0)) + 'px')); }catch(e){} }
  function debounce(fn, ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }

  function firstVisibleTop(root, fallbackTop){
    try{
      var els = root.querySelectorAll('*');
      var minTop = (fallbackTop != null) ? fallbackTop : (rect(root) ? rect(root).top : 0);
      for (var i=0;i<els.length;i++){
        var el = els[i];
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity||'1') < 0.01) continue;
        var r = rect(el);
        if (!r || r.height < 1 || r.width < 1) continue;
        if (r.top < minTop) minTop = r.top;
      }
      return minTop;
    }catch(e){ return fallbackTop || 0; }
  }

  function measure(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider){ setVar('--sjt-gap', 0); setVar('--sjt-gap-next', 0); return; }

    var rh = rect(header), rs = rect(slider);
    var innerTopSlider = firstVisibleTop(slider, rs ? rs.top : 0);
    var gap = (rh && innerTopSlider!=null) ? Math.max(0, innerTopSlider - rh.bottom) : 0;
    setVar('--sjt-gap', gap);

    var next = slider.nextElementSibling;
    if (next){
      var rs2 = rect(slider), rn = rect(next);
      var innerTopNext = firstVisibleTop(next, rn ? rn.top : 0);
      var gap2 = (rs2 && innerTopNext!=null) ? Math.max(0, innerTopNext - rs2.bottom) : 0;
      setVar('--sjt-gap-next', gap2);
      var fh = next.querySelector('h1, .h1, h2, .h2'); if (fh) fh.style.marginTop = '0px';
    } else {
      setVar('--sjt-gap-next', 0);
    }
  }

  var run = debounce(measure, 100);

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', run); } else { run(); }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('resize', run, {passive:true});
  window.addEventListener('orientationchange', run, {passive:true});
})();
