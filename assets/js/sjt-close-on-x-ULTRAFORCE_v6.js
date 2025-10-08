// ULTRAFORCE close on "X": covers checkbox/menu hacks, details/summary, offcanvas, overlays, and body flags.
(function(){
  function qsa(sel){ try { return Array.from(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function togglers(){
    var head = qsa('header .navbar-toggler, header .hamburger, header .menu-toggle, header #sjt-hamburger');
    if (head.length) return head;
    return qsa('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls], [aria-expanded="true"]');
  }
  function menus(){
    return qsa('.mobile-menu, #mobile-menu, [data-mobile-menu], .sjt-menu, .sjt-hamburger-menu, .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar, nav[role="navigation"]');
  }
  function overlays(){
    return qsa('.menu-overlay, .backdrop, .overlay, .offcanvas-backdrop, .modal-backdrop');
  }
  function forceUncheckCheckboxes(){
    // checkbox hacks usually live in header/nav
    qsa('header input[type="checkbox"], nav input[type="checkbox"], input[type="checkbox"][id*="menu" i], input[type="checkbox"][id*="nav" i]').forEach(function(cb){
      try{
        if (cb.checked) {
          cb.checked = false;
          cb.removeAttribute('checked');
          cb.dispatchEvent(new Event('input', {bubbles:true}));
          cb.dispatchEvent(new Event('change', {bubbles:true}));
        }
      }catch(e){}
    });
  }
  function forceCloseDetails(){
    qsa('header details[open], nav details[open], details[open][id*="menu" i]').forEach(function(d){
      try{
        d.open = false;
        d.removeAttribute('open');
        d.dispatchEvent(new Event('toggle', {bubbles:true}));
      }catch(e){}
    });
  }
  function forceClose(){
    // 0) Try natural toggle for frameworks
    togglers().forEach(function(btn){
      try {
        if (btn.getAttribute('aria-expanded') === 'true') btn.click();
        btn.setAttribute('aria-expanded','false');
        ['is-open','open','active','is-active','show','visible','in'].forEach(function(c){ btn.classList.remove(c); });
      } catch(e){}
    });

    // 1) Checkbox/menu hacks & details/summary
    forceUncheckCheckboxes();
    forceCloseDetails();

    // 2) Hard-close containers
    var OPEN = ['open','is-open','active','show','visible','in'];
    menus().forEach(function(el){
      try {
        OPEN.forEach(function(c){ el.classList.remove(c); });
        el.setAttribute('aria-hidden','true');
        if (el.style) {
          el.style.setProperty('display','none','important');
          el.style.removeProperty('visibility');
          el.style.removeProperty('opacity');
          el.style.removeProperty('transform');
          el.style.removeProperty('translate');
          el.style.removeProperty('left');
          el.style.removeProperty('right');
        }
      } catch(e){}
    });
    overlays().forEach(function(ov){
      try {
        OPEN.forEach(function(c){ ov.classList.remove(c); });
        ov.setAttribute('aria-hidden','true');
        if (ov.style) {
          ov.style.setProperty('display','none','important');
          ov.style.removeProperty('visibility');
          ov.style.removeProperty('opacity');
        }
      } catch(e){}
    });

    // 3) Body/html flags
    ['menu-open','nav-open','drawer-open','no-scroll','overflow-hidden','offcanvas-open','modal-open'].forEach(function(c){
      try { document.body.classList.remove(c); } catch(e){}
      try { document.documentElement.classList.remove(c); } catch(e){}
    });

    // 4) Dispatch Escape in case a lib listens for it
    try {
      var esc = new KeyboardEvent('keydown', {key:'Escape', keyCode:27, which:27, bubbles:true});
      document.dispatchEvent(esc);
    } catch(e){}
    
    // 5) After a tick, remove 'display:none' so re-abrir funciona normal
    setTimeout(function(){
      menus().forEach(function(el){ try { if (el.style) el.style.removeProperty('display'); } catch(e){} });
      overlays().forEach(function(ov){ try { if (ov.style) ov.style.removeProperty('display'); } catch(e){} });
    }, 120);
  }

  // Close on "X" click (capture to run before other handlers)
  document.addEventListener('click', function(ev){
    var x = ev.target && ev.target.closest('.icon-x, .x, .menu-close, .btn-close, [data-close], [aria-label*="close" i], [aria-label*="cerrar" i]');
    if (!x) return;
    ev.preventDefault();
    ev.stopPropagation();
    forceClose();
  }, true);
})();
