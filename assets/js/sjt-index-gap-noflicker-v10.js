// === SJT Index Gap Fix v10 (no flicker) ===
// Computes gaps once (and on orientationchange/resize with debounce) and applies via CSS vars.
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function setVar(name, px){ try{ document.documentElement.style.setProperty(name, (Math.max(0, Math.round(px||0)) + 'px')); }catch(e){} }
  function debounce(fn, ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }

  function measureAndApply(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider){ setVar('--sjt-gap', 0); setVar('--sjt-gap-next', 0); return; }

    var rh = rect(header), rs = rect(slider);
    if (rh && rs){
      // distance from first visible content inside slider to header bottom
      var innerTop = (function(){
        var els = slider.querySelectorAll('*');
        var minTop = rs.top;
        for (var i=0;i<els.length;i++){
          var el = els[i];
          var cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity||'1') < 0.01) continue;
          var r = rect(el); if (!r) continue;
          if (r.height < 1 || r.width < 1) continue;
          if (r.top < minTop) minTop = r.top;
        }
        return minTop;
      })();

      var gap = Math.max(0, innerTop - rh.bottom);
      setVar('--sjt-gap', gap);
    } else {
      setVar('--sjt-gap', 0);
    }

    var next = slider.nextElementSibling;
    if (next){
      var rn = rect(next), rs2 = rect(slider);
      if (rn && rs2){
        var innerTopNext = (function(){
          var els = next.querySelectorAll('*');
          var minTop = rn.top;
          for (var i=0;i<els.length;i++){
            var el = els[i];
            var cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity||'1') < 0.01) continue;
            var r = rect(el); if (!r) continue;
            if (r.height < 1 || r.width < 1) continue;
            if (r.top < minTop) minTop = r.top;
          }
          return minTop;
        })();
        var gap2 = Math.max(0, innerTopNext - rs2.bottom);
        setVar('--sjt-gap-next', gap2);
      } else {
        setVar('--sjt-gap-next', 0);
      }
      // Ensure first heading isn't adding top space
      var fh = next.querySelector('h1, .h1, h2, .h2'); if (fh) fh.style.marginTop = '0px';
    } else {
      setVar('--sjt-gap-next', 0);
    }
  }

  var run = debounce(measureAndApply, 100);

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  window.addEventListener('load', run, {passive:true});
  window.addEventListener('resize', run, {passive:true});
  window.addEventListener('orientationchange', run, {passive:true});
})();
