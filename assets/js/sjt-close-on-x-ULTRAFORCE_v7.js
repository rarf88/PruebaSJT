// ULTRAFORCE v7: Top-right fixed click-layer to guarantee close on "X" area.
// No visual changes. Activates only while a mobile menu appears open.
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

  function getTogglers(){
    var inHeader = qsa('header .navbar-toggler, header .hamburger, header .menu-toggle, header #sjt-hamburger');
    if (inHeader.length) return inHeader;
    return qsa('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls]');
  }

  function forceClose(){
    // Natural toggle
    getTogglers().forEach(function(btn){
      try {
        if (btn.getAttribute('aria-expanded') === 'true') btn.click();
      } catch(e){}
    });
    // Hard cleanup
    var OPEN = ['open','is-open','active','show','visible','in'];
    qsa('.mobile-menu, #mobile-menu, [data-mobile-menu], .sjt-menu, .sjt-hamburger-menu, .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar').forEach(function(el){
      try{ OPEN.forEach(function(c){ el.classList.remove(c); }); el.setAttribute('aria-hidden','true'); if(el.style){ el.style.removeProperty('display'); el.style.removeProperty('visibility'); el.style.removeProperty('opacity'); el.style.removeProperty('transform'); } }catch(e){}
    });
    qsa('.menu-overlay, .backdrop, .overlay, .offcanvas-backdrop, .modal-backdrop').forEach(function(ov){
      try{ OPEN.forEach(function(c){ ov.classList.remove(c); }); ov.setAttribute('aria-hidden','true'); if(ov.style){ ov.style.removeProperty('display'); ov.style.removeProperty('visibility'); ov.style.removeProperty('opacity'); } }catch(e){}
    });
    ['menu-open','nav-open','drawer-open','no-scroll','overflow-hidden','offcanvas-open','modal-open'].forEach(function(c){
      try { document.body.classList.remove(c); } catch(e){}
      try { document.documentElement.classList.remove(c); } catch(e){}
    });
    getTogglers().forEach(function(btn){
      try { btn.setAttribute('aria-expanded','false'); btn.classList.remove('is-open','open','active','is-active','show'); } catch(e){}
    });
  }

  // Fixed top-right click layer
  var layer = document.createElement('div');
  layer.id = 'sjt-close-topright-layer';
  layer.style.cssText = [
    'position:fixed',
    'top:0',
    'right:0',
    'width:180px',
    'height:140px',
    'z-index:2147483647',
    'background:transparent',
    'pointer-events:auto',
    'touch-action:manipulation',
    'cursor:pointer',
    'display:none'
  ].join(';');
  document.addEventListener('DOMContentLoaded', function(){
    try { document.body.appendChild(layer); } catch(e){}
  });

  function syncLayer(){
    layer.style.display = anyOpen() ? 'block' : 'none';
  }
  document.addEventListener('click', function(){ setTimeout(syncLayer, 0); }, true);
  window.addEventListener('resize', syncLayer, {passive:true});
  window.addEventListener('scroll', syncLayer, {passive:true});
  document.addEventListener('DOMContentLoaded', syncLayer);

  ['click','pointerdown','touchstart'].forEach(function(evt){
    layer.addEventListener(evt, function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      forceClose();
      syncLayer();
    }, true);
  });
})();
