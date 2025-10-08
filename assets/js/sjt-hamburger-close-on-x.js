
// Mobile-only: close the menu when pressing the button IN open state (X), and on outside click.
(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;

    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;

    function drawer(){
      return document.getElementById('sjt-mobile-drawer') ||
             document.querySelector('.navbar-collapse, .offcanvas, .mobile-drawer, .nav-drawer, .menu-mobile');
    }
    function scrim(){
      return document.getElementById('sjt-mobile-scrim') ||
             document.querySelector('.backdrop, .offcanvas-backdrop, .nav-scrim, .modal-backdrop');
    }
    function isOpen(){
      var d = drawer();
      if(d) return d.classList.contains('open') || d.classList.contains('show') || d.classList.contains('in');
      return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open') ||
             btn.classList.contains('is-open') || btn.getAttribute('aria-expanded') === 'true';
    }
    function paint(){
      // Optional icon sync if another script manages .is-open
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(function(){
        if(isOpen()){ btn.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
        else { btn.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
      });
    }
    function closeMenu(){
      var d = drawer(), s = scrim();
      if(d){ d.classList.remove('open','show','in'); d.style.removeProperty('display'); }
      if(s){ s.classList.remove('show'); s.style.opacity='0'; s.style.pointerEvents='none'; }
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
      paint();
    }

    // If menu is open (X visible), clicking the same button closes it and returns to ☰
    btn.addEventListener('click', function(ev){
      if(isOpen()){
        ev.preventDefault();
        ev.stopPropagation();
        closeMenu();
      }
      // else: allow native opener to run (we don't open here)
      setTimeout(paint, 80);
    }, {passive:false});

    // Clicking outside (scrim/backdrop) closes
    var s = scrim();
    if(s){ s.addEventListener('click', closeMenu); }

    // Keep icon state in sync if other code changes menu state
    var mo = new MutationObserver(paint);
    [document.body, document.documentElement, drawer()].forEach(function(n){ if(n) mo.observe(n,{attributes:true, attributeFilter:['class']}); });
    paint();
  });
})();
