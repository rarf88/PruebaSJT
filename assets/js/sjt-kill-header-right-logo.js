
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
    return r.width>2 && r.height>2;
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
    return (['IMG','PICTURE','SVG'].indexOf(el.tagName)>=0);
  }
  function hasLogoBg(el){
    try{ var bg=getComputedStyle(el).backgroundImage||''; return /logo/i.test(bg); }catch(e){ return false; }
  }
  function rightZone(header){
    var hr = header.getBoundingClientRect();
    var w = Math.max(100, Math.min(160, Math.round(hr.width*0.35))); // up to 35% right side
    var start = hr.right - w;
    return {left:start, right:hr.right, top:hr.top, bottom:hr.bottom};
  }
  function inRightZone(el, zone){
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width/2;
    return (cx >= zone.left && cx <= zone.right && r.top < zone.bottom && (r.bottom||r.top) > zone.top);
  }
  function killRightSideLogos(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var zone = rightZone(header);
    var nodes = $all('a, img, picture, svg, div, span', header);
    nodes.forEach(function(el){
      if (isOverlay(el) || isToggler(el)) return;
      if (!isVisible(el)) return;
      if (!inRightZone(el, zone)) return;
      var kill = looksLogo(el) || hasLogoBg(el);
      if (kill){
        try{ (el.closest && el.closest('a')) ? el.closest('a').remove() : el.remove(); }catch(e){}
      }
    });
    // remove background-image logos in right zone wrappers
    nodes.forEach(function(el){
      if (!inRightZone(el, zone)) return;
      if (hasLogoBg(el)) { try{ el.style.backgroundImage='none'; }catch(e){} }
    });
  }
  function observe(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    if (header.__sjt_hdr_obs) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(n){
          if (n && n.nodeType===1){ killRightSideLogos(); }
        });
      });
    });
    mo.observe(header, {childList:true, subtree:true});
    header.__sjt_hdr_obs = mo;
  }
  function init(){
    if (!isMobile()) return;
    // initial passes
    for (var i=0;i<8;i++){ setTimeout(killRightSideLogos, i*90); }
    observe();
  }
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', init);
  window.addEventListener('orientationchange', init);
})();
