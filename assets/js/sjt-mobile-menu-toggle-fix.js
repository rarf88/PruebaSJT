
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  function resolveTarget(btn){
    var sel = btn.getAttribute('aria-controls') || btn.getAttribute('data-bs-target') || btn.getAttribute('data-target') || btn.getAttribute('href');
    if (sel && sel.startsWith('#')){
      var el = document.querySelector(sel);
      if (el) return el;
    }
    var header = $('header.site-header'); if (!header) return null;
    // Priority: explicit collapse/offcanvas inside header; then common custom classes
    return header.querySelector('.navbar-collapse, .offcanvas, .mobile-menu, .menu, .drawer, [class*="menu"], [class*="drawer"], [class*="offcanvas"]');
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
    el.style.display = 'block';
    el.setAttribute('aria-hidden','false');
    if (btn){ btn.setAttribute('aria-expanded','true'); }
    document.body.classList.add('menu-open');
  }
  }

  function closeMenu(el, btn){
    if (!el) return;
    el.classList.remove('show'); el.classList.remove('open');
    el.style.display = 'none';
    el.setAttribute('aria-hidden','true');
    if (btn){ btn.setAttribute('aria-expanded','false'); }
    document.body.classList.remove('menu-open');
  }
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

  // Close on menu link click
  document.addEventListener('click', function(e){
    if (!isMobile()) return;
    var a = e.target.closest('.navbar-collapse a, .offcanvas a, .mobile-menu a, [class*="menu"] a, [class*="drawer"] a, [class*="offcanvas"] a');
    if (a){
      var header = $('header.site-header'); if (!header) return;
      var menu = header.querySelector('.navbar-collapse, .offcanvas, .mobile-menu, .menu, .drawer, [class*="menu"], [class*="drawer"], [class*="offcanvas"]');
      var btn  = header.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
      if (menu) closeMenu(menu, btn);
    }
  }, true);

  // Close when clicking outside the menu if open
  document.addEventListener('click', function(e){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var menu = header.querySelector('.navbar-collapse, .offcanvas, .mobile-menu, .menu, .drawer, [class*="menu"], [class*="drawer"], [class*="offcanvas"]');
    var btn  = header.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    if (!menu || !btn) return;
    var open = menu.classList.contains('show') || menu.classList.contains('open') || window.getComputedStyle(menu).display !== 'none';
    if (!open) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeMenu(menu, btn);
  }, true);
