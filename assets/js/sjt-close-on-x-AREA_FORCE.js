// AREA-FORCE close: if menu is open and user clicks top-right "X region", force-close no matter what.
(function(){
  function qsa(sel){ try { return Array.from(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function anyOpen(){
    var sels = '.mobile-menu, #mobile-menu, [data-mobile-menu], .sjt-menu, .sjt-hamburger-menu, .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar';
    var nodes = qsa(sels);
    for (var i=0;i<nodes.length;i++){
      var el = nodes[i]; if (!el) continue;
      var cs = window.getComputedStyle(el);
      if (el.classList.contains('open') || el.classList.contains('show') || el.classList.contains('active') ||
          el.classList.contains('visible') || el.classList.contains('in') ||
          el.getAttribute('aria-hidden') === 'false' ||
          (cs && cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity||'1') > 0.01)) return true;
    }
    return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open')
           || document.body.classList.contains('offcanvas-open') || document.documentElement.classList.contains('offcanvas-open');
  }
  function forceClose(){
    // 1) Try click on any expanded toggler
    qsa('.navbar-toggler[aria-expanded="true"], .hamburger[aria-expanded="true"], .menu-toggle[aria-expanded="true"], #sjt-hamburger[aria-expanded="true"], [data-menu-toggle][aria-expanded="true"], button[aria-controls][aria-expanded="true"]').forEach(function(btn){
      try { btn.click(); } catch(e){}
    });
    // 2) Hard cleanup
    var OPEN = ['open','is-open','active','show','visible','in'];
    var sels = '.mobile-menu, #mobile-menu, [data-mobile-menu], .sjt-menu, .sjt-hamburger-menu, .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar';
    qsa(sels).forEach(function(el){
      try{
        OPEN.forEach(function(c){ el.classList.remove(c); });
        el.setAttribute('aria-hidden','true');
        if (el.style) { el.style.removeProperty('display'); el.style.removeProperty('visibility'); el.style.removeProperty('opacity'); el.style.removeProperty('transform'); }
      }catch(e){}
    });
    qsa('.menu-overlay, .backdrop, .overlay, .offcanvas-backdrop, .modal-backdrop').forEach(function(ov){
      try{
        OPEN.forEach(function(c){ ov.classList.remove(c); });
        ov.setAttribute('aria-hidden','true');
        if (ov.style) { ov.style.removeProperty('display'); ov.style.removeProperty('visibility'); ov.style.removeProperty('opacity'); }
      }catch(e){}
    });
    ['menu-open','nav-open','drawer-open','no-scroll','overflow-hidden','offcanvas-open','modal-open'].forEach(function(c){
      try { document.body.classList.remove(c); } catch(e){}
      try { document.documentElement.classList.remove(c); } catch(e){}
    });
    // Normalize togglers
    qsa('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls]').forEach(function(btn){
      try {
        btn.setAttribute('aria-expanded','false');
        btn.classList.remove('is-open','open','active','is-active','show');
      } catch(e){}
    });
  }

  // Click capture: top-right corner hit test
  document.addEventListener('click', function(ev){
    if (!anyOpen()) return;
    // Define a conservative top-right region (in CSS px). Tune as needed.
    var marginX = 140;  // width of hit zone
    var marginY = 120;  // height of hit zone
    var x = ev.clientX, y = ev.clientY, W = window.innerWidth;
    var inTopRight = (x >= W - marginX) && (y <= marginY);
    if (inTopRight) {
      ev.preventDefault();
      ev.stopPropagation();
      forceClose();
    }
  }, true);
})();
