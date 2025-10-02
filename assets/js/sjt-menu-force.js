
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $$all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  function resolveMenu(){
    var header = $('header.site-header'); if (!header) return null;
    return header.querySelector('.navbar-collapse, .offcanvas, .mobile-menu, .menu, .drawer, [class*="menu"], [class*="drawer"], [class*="offcanvas"]');
  }

  function ensureMenuLogo(){
    if (!isMobile()) return;
    var menu = resolveMenu(); if (!menu) return;
    var block = menu.querySelector('.sjt-menu-logo');
    if (!block){ block = document.createElement('div'); block.className='sjt-menu-logo'; menu.insertBefore(block, menu.firstChild); }
    var img = block.querySelector('img'); if (!img){ img=document.createElement('img'); img.alt='SJT'; block.appendChild(img); }
    img.src = 'assets/img/logo_sjt_integrado.png';
  }

  function openMenu(menu, btn){
    if (!menu) return;
    menu.classList.add('show'); menu.classList.add('open');
    menu.style.removeProperty('display'); menu.style.display = 'block';
    menu.setAttribute('aria-hidden','false');
    document.body.classList.add('sjt-menu-open');
    if (btn) btn.setAttribute('aria-expanded','true');
  }

  function closeMenu(menu, btn){
    if (!menu) return;
    menu.classList.remove('show'); menu.classList.remove('open');
    menu.style.display = 'none';
    menu.setAttribute('aria-hidden','true');
    document.body.classList.remove('sjt-menu-open');
    if (btn) btn.setAttribute('aria-expanded','false');
  }

  function toggleMenu(e){
    if (!isMobile()) return;
    var btn = e.currentTarget;
    var menu = resolveMenu(); if (!menu) return;
    var open = menu.classList.contains('show') || menu.classList.contains('open') || window.getComputedStyle(menu).display!=='none';
    if (open) closeMenu(menu, btn); else openMenu(menu, btn);
    e.preventDefault(); e.stopPropagation();
  }

  function bind(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    $$all('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler', header).forEach(function(b){
      if (b._sjtBound) return;
      b.addEventListener('click', toggleMenu, true);
      b.addEventListener('touchend', toggleMenu, {capture:true, passive:false});
      b._sjtBound = true;
      if (!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded','false');
    });
  }

  // Close when clicking a link within menu
  document.addEventListener('click', function(e){
    if (!isMobile()) return;
    var a = e.target.closest('.navbar-collapse a, .offcanvas a, .mobile-menu a, .menu a, .drawer a, [class*="menu"] a, [class*="drawer"] a, [class*="offcanvas"] a');
    if (!a) return;
    var menu = resolveMenu(); var header = $('header.site-header');
    var btn = header && header.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    if (menu) closeMenu(menu, btn);
  }, true);

  // Close on outside click
  document.addEventListener('click', function(e){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var menu = resolveMenu(); var btn = header.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    if (!menu || !btn) return;
    var open = menu.classList.contains('show') || menu.classList.contains('open') || window.getComputedStyle(menu).display!=='none';
    if (!open) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    closeMenu(menu, btn);
  }, true);

  function hardResizeGuard(){
    var w = window.innerWidth || document.documentElement.clientWidth;
    if (w >= 1025){
      var header = document.querySelector('header.site-header');
      if (!header) return;
      var menu = resolveMenu(); var btn = header.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
      if (menu){ menu.classList.remove('show'); menu.classList.remove('open'); menu.style.display = ''; menu.setAttribute('aria-hidden','true'); }
      document.body.classList.remove('sjt-menu-open');
      if (btn) btn.setAttribute('aria-expanded','false');
    }
  }

  window.addEventListener('DOMContentLoaded', function(){ ensureMenuLogo(); bind(); hardResizeGuard(); });
  window.addEventListener('resize', function(){ ensureMenuLogo(); bind(); hardResizeGuard(); });
  window.addEventListener('orientationchange', function(){ ensureMenuLogo(); bind(); hardResizeGuard(); });
})();
