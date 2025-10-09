// === SJT Index Gap Fix v12 ===
// 1) Sync --sjt-header-offset with ACTUAL header height (root cause of white bar)
// 2) Compute exact gaps to slider and next block, set CSS vars (no flicker)
(function(){
  function $(q){ return document.querySelector(q); }
  function rect(el){ try{ return el.getBoundingClientRect(); }catch(e){ return null; } }
  function setVar(name, v){ document.documentElement.style.setProperty(name, (Math.max(0, Math.round(v||0)) + 'px')); }
  function debounce(fn, ms){ var t=null; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }
  function firstVisibleTop(root, fallback){
    var nodes = root.querySelectorAll('*'); var minTop = fallback || (rect(root)||{}).top || 0;
    for (var i=0;i<nodes.length;i++){
      var el = nodes[i], cs = getComputedStyle(el); if (cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity||'1')<0.01) continue;
      var r = rect(el); if (!r || r.height<1 || r.width<1) continue; if (r.top < minTop) minTop = r.top;
    }
    return minTop;
  }
  function run(){
    var header = $('header, .site-header, .navbar, .topbar');
    var slider = $('section.slider');
    if (!header || !slider) return;
    var rh = rect(header), rs = rect(slider);
    // 1) Sync header offset to real height
    if (rh){ setVar('--sjt-header-offset', rh.height); }

    // 2) Compute slider gap vs header bottom
    var innerTop = firstVisibleTop(slider, rs ? rs.top : 0);
    var gap = Math.max(0, innerTop - (rh ? rh.bottom : 0));
    setVar('--sjt-gap', gap);

    // 3) Next block
    var next = slider.nextElementSibling;
    if (next){
      var rn = rect(next), rs2 = rect(slider);
      var innerTopNext = firstVisibleTop(next, rn ? rn.top : 0);
      var gap2 = Math.max(0, innerTopNext - (rs2 ? rs2.bottom : 0));
      setVar('--sjt-gap-next', gap2);
      var fh = next.querySelector('h1, .h1, h2, .h2'); if (fh) fh.style.marginTop = '0px';
    } else {
      setVar('--sjt-gap-next', 0);
    }
  }
  var apply = debounce(run, 80);
  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', apply); } else { apply(); }
  window.addEventListener('load', apply, {passive:true});
  window.addEventListener('resize', apply, {passive:true});
  window.addEventListener('orientationchange', apply, {passive:true});
})();
