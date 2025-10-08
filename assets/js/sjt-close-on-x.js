// Minimal fix: si se pulsa la X, disparar el mismo toggler para cerrar.
(function(){
  function qsa(sel){ try { return Array.from(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function getToggler(){
    // Prioriza botones en el header
    var inHeader = document.querySelector('header .navbar-toggler, header .hamburger, header .menu-toggle, header #sjt-hamburger');
    if (inHeader) return inHeader;
    return document.querySelector('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls]');
  }
  // Cerrar al click en X
  document.addEventListener('click', function(ev){
    var x = ev.target && ev.target.closest('.icon-x, .x, .menu-close, .btn-close, [data-close], [aria-label*="close" i], [aria-label*="cerrar" i]');
    if (x) {
      var tg = getToggler();
      if (tg) {
        ev.preventDefault();
        ev.stopPropagation();
        try { tg.click(); } catch(e){}
      }
    }
  }, true);

  // Añadir/remover .is-open al toggler para que el CSS pueda ocultar las barras
  function anyOpen(){
    var candidates = qsa('.mobile-menu, #mobile-menu, [data-mobile-menu], .nav-drawer, .drawer, .offcanvas, .navbar-collapse, .menu-panel, .sidebar');
    for (var i=0;i<candidates.length;i++){
      var el = candidates[i];
      if (!el) continue;
      var cs = window.getComputedStyle(el);
      if (el.classList.contains('open') || el.classList.contains('show') || el.classList.contains('active') ||
          el.getAttribute('aria-hidden') === 'false' ||
          (cs && cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity||'1') > 0.01)) return true;
    }
    return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open');
  }
  function mark(){
    var tg = getToggler();
    if (!tg) return;
    if (anyOpen()) {
      tg.classList.add('is-open');
      tg.setAttribute('aria-expanded','true');
    } else {
      tg.classList.remove('is-open');
      tg.setAttribute('aria-expanded','false');
    }
  }
  var mo = new MutationObserver(mark);
  try {
    mo.observe(document.documentElement, {attributes:true, subtree:true, attributeFilter:['class','style','aria-hidden']});
  } catch(e){}
  window.addEventListener('resize', mark, {passive:true});
  window.addEventListener('scroll', mark, {passive:true});
  document.addEventListener('DOMContentLoaded', mark);
  setTimeout(mark, 200);
})();