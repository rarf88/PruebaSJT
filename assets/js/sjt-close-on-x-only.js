// Close on "X" ONLY — no style or position changes.
(function(){
  function qsa(sel){ try { return Array.from(document.querySelectorAll(sel)); } catch(e){ return []; } }
  function getToggler(){
    // Prefer a toggler inside header; fallback to any candidate
    return document.querySelector('header .navbar-toggler, header .hamburger, header .menu-toggle, header #sjt-hamburger')
        || document.querySelector('.navbar-toggler, .hamburger, .menu-toggle, #sjt-hamburger, [data-menu-toggle], button[aria-controls]');
  }
  document.addEventListener('click', function(ev){
    var x = ev.target && ev.target.closest('.icon-x, .x, .menu-close, .btn-close, [data-close], [aria-label*="close" i], [aria-label*="cerrar" i]');
    if (!x) return;
    var tg = getToggler();
    if (!tg) return;
    ev.preventDefault();
    ev.stopPropagation();
    try { tg.click(); } catch(e){}
  }, true);
})();
