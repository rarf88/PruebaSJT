
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function isOverlay(el){ try{ return !!(el && el.closest && el.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
  function isToggler(el){
    return !!(el && (el.matches('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler')
      || (el.closest && el.closest('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler'))));
  }
  function looksLogo(el){
    if (!el || el.nodeType !== 1) return false;
    if (isOverlay(el) || isToggler(el)) return false;
    var cls=(el.className||'').toString().toLowerCase();
    var id =(el.id||'').toString().toLowerCase();
    var alt=(el.getAttribute && (el.getAttribute('alt')||'')).toLowerCase();
    var tit=(el.getAttribute && (el.getAttribute('title')||'')).toLowerCase();
    var src=(el.getAttribute && (el.getAttribute('src')||'')).toLowerCase();
    var html=(el.outerHTML||'').toLowerCase();
    if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
    if (alt.includes('logo') || alt.includes('brand')) return true;
    if (tit.includes('logo') || tit.includes('brand')) return true;
    if (src.includes('logo')) return true;
    if (html.includes('logo') || html.includes('site-logo') || html.includes('isologo')) return true;
    return (el.tagName === 'IMG' || el.tagName === 'PICTURE' || el.tagName === 'SVG');
  }
  function hasLogoBg(el){
    try{ var bg = window.getComputedStyle(el).backgroundImage || ''; return /logo/i.test(bg); }catch(e){ return false; }
  }
  function removeRightLogo(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var rect = nav.getBoundingClientRect();
    var rightHalf = rect.left + rect.width * 0.55;
    var removed = false;
    var nodes = $all('a, img, picture, svg, div, span', nav);
    nodes.forEach(function(el){
      if (removed) return;
      if (isOverlay(el) || isToggler(el)) return;
      var r; try{ r = el.getBoundingClientRect(); }catch(e){ r = null; }
      if (!r) return;
      var centerX = r.left + r.width/2;
      var isRight = centerX > rightHalf;
      if (!isRight) return;
      var kill = looksLogo(el) || hasLogoBg(el);
      if (kill){
        var a = el.closest && el.closest('a');
        try{ (a || el).remove(); removed = true; }catch(e){}
      }
    });
    if (removed){ setTimeout(removeRightLogo, 0); }
  }
  function observe(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var nav = header.querySelector('nav'); if (!nav) return;
    if (nav.__sjt_rm_mo) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(node){
          if (node && node.nodeType === 1){ removeRightLogo(); }
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__sjt_rm_mo = mo;
  }
  function init(){ if (!isMobile()) return; removeRightLogo(); observe(); }
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', init);
  window.addEventListener('orientationchange', init);
})();
