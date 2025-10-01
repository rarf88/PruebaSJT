
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s, r){ return (r||document).querySelector(s); }
  function $all(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function isOverlay(el){ try{ return !!(el && el.closest && el.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
  function isToggler(el){
    return !!(el && (el.matches('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler')
      || (el.closest && el.closest('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler'))));
  }
  function isVisible(el){
    var r = el.getBoundingClientRect();
    return r.width>1 && r.height>1;
  }
  function looksLogo(el){
    if (!el || el.nodeType!==1) return false;
    if (isOverlay(el) || isToggler(el)) return false;
    var cls=(el.className||'').toString().toLowerCase();
    var id =(el.id||'').toString().toLowerCase();
    var alt=(el.getAttribute&& (el.getAttribute('alt')||'')).toLowerCase();
    var tit=(el.getAttribute&& (el.getAttribute('title')||'')).toLowerCase();
    var src=(el.getAttribute&& (el.getAttribute('src')||'')).toLowerCase();
    var html=(el.outerHTML||'').toLowerCase();
    if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
    if (alt.includes('logo') || alt.includes('brand') || tit.includes('logo') || tit.includes('brand')) return true;
    if (src.includes('logo')) return true;
    if (html.includes('logo') || html.includes('site-logo') || html.includes('isologo')) return true;
    // Heuristic: big img/picture/svg area
    return (['IMG','PICTURE','SVG'].indexOf(el.tagName) >= 0);
  }
  function hasLogoBg(el){
    try{ var bg=getComputedStyle(el).backgroundImage||''; return /logo/i.test(bg); }catch(e){ return false; }
  }

  function removeRightLogoPrecise(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;

    // Compute rightmost active zone (120px from right edge of nav)
    var nr = nav.getBoundingClientRect();
    var zoneStart = Math.max(nr.left, nr.right - 120); // left boundary of right zone

    // Pass 1: remove any explicit .logo node in nav (safe because overlay keeps the approved logo)
    var hard = nav.querySelector('.logo');
    if (hard && !isOverlay(hard)){
      try{ hard.remove(); }catch(e){}
    }

    // Pass 2: remove any visible candidate in the rightmost zone
    var nodes = $all('*', nav);
    nodes.forEach(function(el){
      if (isOverlay(el) || isToggler(el)) return;
      if (!isVisible(el)) return;
      var r = el.getBoundingClientRect();
      var onRight = (r.left >= zoneStart) || ((r.left + r.width/2) >= zoneStart);
      if (!onRight) return;
      if (looksLogo(el) || hasLogoBg(el)){
        try{ (el.closest && el.closest('a')) ? el.closest('a').remove() : el.remove(); }catch(e){}
      }
    });
  }

  function observe(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    if (nav.__sjt_precise_obs) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(n){
          if (n && n.nodeType===1){ removeRightLogoPrecise(); }
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__sjt_precise_obs = mo;
  }

  function init(){
    if (!isMobile()) return;
    removeRightLogoPrecise();
    // extra passes to catch late insertions
    for (var i=1;i<=6;i++){ setTimeout(removeRightLogoPrecise, i*120); }
    observe();
  }

  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', init);
  window.addEventListener('orientationchange', init);
})();
