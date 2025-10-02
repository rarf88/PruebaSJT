
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  function resolveTarget(btn){
    // Bootstrap: aria-controls or data-bs-target; else data-target; else href hash
    var sel = btn.getAttribute('aria-controls') || btn.getAttribute('data-bs-target') || btn.getAttribute('data-target') || btn.getAttribute('href');
    if (sel && sel.startsWith('#')){
      return document.querySelector(sel);
    }
    // Fallbacks: common containers in header
    var header = $('header.site-header');
    if (!header) return null;
    return header.querySelector('.navbar-collapse, .offcanvas, .mobile-menu, [class*="menu"], [class*="drawer"], [class*="offcanvas"]');
  }

  function isOpen(el){
    if (!el) return false;
    if (el.classList.contains('show') || el.classList.contains('open') || el.getAttribute('aria-expanded') === 'true') return true;
    // Some custom menus use inline styles
    var d = window.getComputedStyle(el).display;
    return (d && d !== 'none');
  }

  function openMenu(el, btn){
    if (!el) return;
    el.classList.add('show'); el.classList.add('open');
    el.setAttribute('aria-hidden','false');
    if (btn){ btn.setAttribute('aria-expanded','true'); }
  }

  function closeMenu(el, btn){
    if (!el) return;
    el.classList.remove('show'); el.classList.remove('open');
    el.setAttribute('aria-hidden','true');
    if (btn){ btn.setAttribute('aria-expanded','false'); }
  }

  function onToggleClick(e){
    if (!isMobile()) return;
    var btn = e.currentTarget;
    var target = resolveTarget(btn);
    if (!target) return;
    if (isOpen(target)) closeMenu(target, btn);
    else openMenu(target, btn);
    e.preventDefault();
    e.stopPropagation();
  }

  function bind(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var togglers = $all('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler', header);
    togglers.forEach(function(b){
      // Prevent duplicate bindings
      if (b._sjtBound) return;
      b.addEventListener('click', onToggleClick);
      b._sjtBound = true;
      // ensure proper ARIA
      if (!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded','false');
      b.setAttribute('aria-controls', b.getAttribute('aria-controls') || (b.getAttribute('data-bs-target')||'').replace('#','') );
    });
  }

  window.addEventListener('DOMContentLoaded', bind);
  window.addEventListener('resize', bind);
  window.addEventListener('orientationchange', bind);
})();
