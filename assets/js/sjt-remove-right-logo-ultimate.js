
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function isOverlay(el){ try{ return !!(el && el.closest && el.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
  function isToggler(el){
    return !!(el && (el.matches('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler')
      || (el.closest && el.closest('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler'))));
  }

  // Identify if node is a likely logo
  function looksLogo(el){
    if (!el || el.nodeType !== 1) return false;
    if (isOverlay(el) || isToggler(el)) return false;
    var tag = el.tagName;
    var cls = (el.className || '').toString().toLowerCase();
    var id  = (el.id || '').toString().toLowerCase();
    var alt = (el.getAttribute && (el.getAttribute('alt')||'')).toLowerCase();
    var tit = (el.getAttribute && (el.getAttribute('title')||'')).toLowerCase();
    var src = (el.getAttribute && (el.getAttribute('src')||'')).toLowerCase();
    var html= (el.outerHTML || '').toLowerCase();
    if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
    if (alt.includes('logo') || alt.includes('brand') || tit.includes('logo') || tit.includes('brand')) return true;
    if (src.includes('logo')) return true;
    if (html.includes('logo') || html.includes('site-logo') || html.includes('isologo')) return true;
    return (tag === 'IMG' || tag === 'PICTURE' || tag === 'SVG');
  }

  function hasLogoBg(el){
    try{
      var bg = window.getComputedStyle(el).backgroundImage || '';
      return /logo/i.test(bg);
    }catch(e){ return false; }
  }

  function inRightHalf(el, nav){
    try{
      var nr = nav.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      var mid = nr.left + nr.width * 0.55;
      return (er.left + er.width/2) > mid;
    }catch(e){ return false; }
  }

  function removeRightLogoPass(){
    if (!isMobile()) return false;
    var header = $('header.site-header'); if (!header) return false;
    var nav = $('nav', header); if (!nav) return false;

    var removedAny = false;
    var targets = $all('a, img, picture, svg, div, span', nav);
    targets.forEach(function(el){
      if (isOverlay(el) || isToggler(el)) return;
      if (!inRightHalf(el, nav)) return;
      var kill = looksLogo(el) || hasLogoBg(el);
      if (kill){
        try{
          var a = el.closest && el.closest('a');
          (a || el).remove();
          removedAny = true;
        }catch(e){}
      }
    });
    return removedAny;
  }

  // Patch DOM methods to block future insertions on the right half
  function patch(el){
    if (!el || el.__sjt_ultra_patched) return;
    var ap=el.appendChild, ib=el.insertBefore, rp=el.replaceChild;
    function blocker(child){
      try{
        if (!child || child.nodeType !== 1) return child;
        var header = $('header.site-header'); if (!header) return child;
        var nav = $('nav', header); if (!nav) return child;
        if (isOverlay(child) || isToggler(child)) return child;
        if (inRightHalf(child, nav) && (looksLogo(child) || hasLogoBg(child))) return null;
      }catch(e){}
      return child;
    }
    el.appendChild = function(c){ var x=blocker(c); if(!x) return c; return ap.call(this, x); };
    el.insertBefore = function(c, r){ var x=blocker(c); if(!x) return c; return ib.call(this, x, r); };
    el.replaceChild = function(n, o){ var x=blocker(n); if(!x) return o; return rp.call(this, x, o); };
    el.__sjt_ultra_patched = true;
  }

  function observe(nav){
    if (nav.__sjt_ultra_observed) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(n){
          if (n && n.nodeType === 1){
            removeRightLogoPass();
          }
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__sjt_ultra_observed = true;
  }

  function runMultiPasses(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;

    // Initial passes
    for (var i=0;i<5;i++){ setTimeout(removeRightLogoPass, i*30); }

    // Short interval to catch late insertions (stop after ~3s)
    var count = 0;
    var it = setInterval(function(){
      removeRightLogoPass();
      if (++count > 60) clearInterval(it);
    }, 50);

    // Patch & observe
    patch(nav); patch(header); patch(document.body);
    observe(nav);
  }

  function init(){
    if (!isMobile()) return;
    runMultiPasses();
  }

  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', init);
  window.addEventListener('orientationchange', init);
})();
