
// === SJT Index Gap Visual Aligner v8 ===
// Finds the first visible pixel inside the slider, aligns it to header's bottom,
// and removes any top gap before the first text block after the slider.
(function(){
  function q(sel, root){ return (root||document).querySelector(sel); }
  function qa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
  function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
  function isVisible(el){
    if (!el) return false;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity||'1') < 0.01) return false;
    var r = rect(el);
    return r && r.width > 0 && r.height > 0;
  }
  function firstVisibleDescendantTop(root){
    var stack = qa('*', root);
    var minTop = Infinity;
    for (var i=0;i<stack.length;i++){
      var el = stack[i];
      if (!isVisible(el)) continue;
      var r = rect(el);
      if (!r) continue;
      if (r.top < minTop) minTop = r.top;
    }
    if (!isFinite(minTop)) {
      var rr = rect(root);
      return rr ? rr.top : null;
    }
    return minTop;
  }
  function killIndexGaps(){
    var header = q('header, .site-header, .navbar, .topbar');
    var slider = q('section.slider');
    if (!header || !slider) return;
    // 1) Align slider's first visible content to header's bottom
    var rh = rect(header);
    var rs = rect(slider);
    if (rh && rs){
      var innerTop = firstVisibleDescendantTop(slider);
      if (innerTop != null){
        var gap = innerTop - rh.bottom; // positive if there's white space
        if (gap > 0){
          var shift = -Math.round(gap);
          slider.style.top = shift + 'px';        // pull slider up
        } else if (gap < -2){
          // Too overlapped, push down at most 2px
          slider.style.top = Math.min(0, -Math.round(gap + 2)) + 'px';
        } else {
          slider.style.top = '0px';
        }
      }
    }
    // 2) Remove gap before the block right after slider
    var next = slider.nextElementSibling;
    if (next){
      // Zero margins/paddings inline
      next.style.marginTop = '0px';
      next.style.paddingTop = '0px';
      next.style.borderTopWidth = '0px';
      // First visible descendant in next
      var nTop = (function(){
        var cand = qa('*', next).filter(isVisible);
        var mt = Infinity;
        cand.forEach(function(el){
          var r = rect(el);
          if (r && r.top < mt) mt = r.top;
        });
        return isFinite(mt) ? mt : (rect(next) ? rect(next).top : null);
      })();
      var rs2 = rect(slider);
      if (nTop != null && rs2){
        var gap2 = nTop - rs2.bottom;
        if (gap2 > 0){
          next.style.marginTop = (-Math.round(gap2)) + 'px'; // pull next up exact gap
        }
      }
      // Also nuke first heading margin
      var fh = q('h1, .h1, h2, .h2', next);
      if (fh) { fh.style.marginTop = '0px'; }
    }
  }
  function schedule(){
    var delays = [30, 120, 240, 480, 960, 1600, 2600];
    delays.forEach(function(t){ setTimeout(killIndexGaps, t); });
  }
  ['DOMContentLoaded','load','resize','orientationchange'].forEach(function(evt){
    window.addEventListener(evt, schedule, {passive:true});
  });
  schedule();
})();

