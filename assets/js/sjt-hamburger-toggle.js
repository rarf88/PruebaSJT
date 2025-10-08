// Mobile-only: robust hamburger toggle (bars<->X) and open/close drawer
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;

    // Try to find an existing hamburger button
    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;

    // Ensure it has 3 bars markup for animation if empty
    if (!btn.querySelector('.bar')) {
      btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    }

    // Find likely drawer and scrim
    function findDrawer(){
      return document.getElementById('sjt-mobile-drawer') ||
             document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer, header nav, nav[role="navigation"]');
    }
    function findScrim(){
      return document.getElementById('sjt-mobile-scrim') ||
             document.querySelector('.backdrop, .offcanvas-backdrop, .nav-scrim');
    }

    function openMenu(drawer, scrim){
      btn.classList.add('is-open');
      if(drawer){ drawer.classList.add('open'); drawer.classList.add('show'); drawer.style.transform = 'translateX(0)'; }
      if(scrim){ scrim.classList.add('show'); scrim.style.opacity = '1'; scrim.style.pointerEvents = 'auto'; }
      btn.setAttribute('aria-expanded','true');
      document.documentElement.classList.add('nav-open'); document.body.classList.add('nav-open');
    }
    function closeMenu(drawer, scrim){
      btn.classList.remove('is-open');
      if(drawer){ drawer.classList.remove('open'); drawer.classList.remove('show'); drawer.style.removeProperty('transform'); }
      if(scrim){ scrim.classList.remove('show'); scrim.style.opacity = '0'; scrim.style.pointerEvents = 'none'; }
      btn.setAttribute('aria-expanded','false');
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
    }

    // Toggle on click
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var drawer = findDrawer();
      var scrim = findScrim();
      var isOpen = btn.classList.contains('is-open') ||
                   (drawer && (drawer.classList.contains('open') || drawer.classList.contains('show')));
      if(isOpen){ closeMenu(drawer, scrim); } else { openMenu(drawer, scrim); }
    });

    // Close when clicking scrim
    var scrim = findScrim();
    if(scrim){
      scrim.addEventListener('click', function(){ closeMenu(findDrawer(), scrim); });
    }
  });
})();