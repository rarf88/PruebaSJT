// Close on "X" with FORCE fallback — preserves original UI & layout.
(function(){
  function qsa(sel){ try { return Array.from(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function getTogglers(){
    var inHeader = qsa('header .navbar-toggler, header .hamburger, header .menu-toggle, header #sjt-hamburger');
    if (inHeader.length) return inHeader;
    return qsa('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls]');
  }
  function getMenus(){
    return qsa('.mobile-menu, #mobile-menu, [data-mobile-menu], .sjt-menu, .sjt-hamburger-menu, .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar');
  }
  function getOverlays(){
    return qsa('.menu-overlay, .backdrop, .overlay, .offcanvas-backdrop');
  }
  function forceClose(){
    getTogglers().forEach(function(btn){
      try {
        if (btn.getAttribute('aria-expanded') === 'true') btn.click();
        btn.setAttribute('aria-expanded','false');
        btn.classList.remove('is-open','open','active','is-active','show');
      } catch(e){}
    });
    ['open','is-open','active','show','visible','in'].forEach(function(cn){
      getMenus().forEach(function(el){ try { el.classList.remove(cn); } catch(e){} });
      getOverlays().forEach(function(ov){ try { ov.classList.remove(cn); } catch(e){} });
      try { document.body.classList.remove(cn); } catch(e){}
      try { document.documentElement.classList.remove(cn); } catch(e){}
    });
    getMenus().forEach(function(el){
      try {
        el.setAttribute('aria-hidden','true');
        if (el.style) {
          el.style.removeProperty('display');
          el.style.removeProperty('visibility');
          el.style.removeProperty('opacity');
          el.style.removeProperty('transform');
        }
      } catch(e){}
    });
    getOverlays().forEach(function(ov){
      try {
        ov.setAttribute('aria-hidden','true');
        if (ov.style) {
          ov.style.removeProperty('display');
          ov.style.removeProperty('visibility');
          ov.style.removeProperty('opacity');
        }
      } catch(e){}
    });
    ['menu-open','nav-open','drawer-open','no-scroll','overflow-hidden','offcanvas-open','modal-open'].forEach(function(c){
      try { document.body.classList.remove(c); } catch(e){}
      try { document.documentElement.classList.remove(c); } catch(e){}
    });
  }

  document.addEventListener('click', function(ev){
    var x = ev.target && ev.target.closest('.icon-x, .x, .menu-close, .btn-close, [data-close], [aria-label*="close" i], [aria-label*="cerrar" i]');
    if (!x) return;
    ev.preventDefault();
    ev.stopPropagation();
    var tgs = getTogglers();
    if (tgs.length) {
      try { tgs[0].click(); } catch(e){}
    }
    forceClose();
  }, true);
})();
