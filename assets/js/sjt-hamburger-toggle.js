// Mobile-only: keep button position; reuse site's native click to open/close.
// If native doesn't change state, we toggle common drawers/scrims as fallback.
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;

    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;

    if (!btn.querySelector('.bar')) {
      btn.insertAdjacentHTML('beforeend','<span class="bar"></span><span class="bar"></span><span class="bar"></span>');
    }

    function findDrawer(){
      return document.getElementById('sjt-mobile-drawer') ||
             document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer, .navbar-collapse, .menu-mobile');
    }
    function findScrim(){
      return document.getElementById('sjt-mobile-scrim') ||
             document.querySelector('.backdrop, .offcanvas-backdrop, .nav-scrim, .modal-backdrop');
    }

    function isOpen(){
      var drawer = findDrawer();
      if(drawer) return drawer.classList.contains('open') || drawer.classList.contains('show') || drawer.classList.contains('in');
      return document.documentElement.classList.contains('nav-open') || document.body.classList.contains('nav-open') ||
             btn.classList.contains('is-open') || btn.getAttribute('aria-expanded') === 'true';
    }

    function paint(){
      if(isOpen()){ btn.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
      else { btn.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
    }
    paint();

    // Observe to repaint icon when external code toggles classes
    var observerTargets = [document.body, document.documentElement];
    var drawer = findDrawer();
    if(drawer) observerTargets.push(drawer);
    var mo = new MutationObserver(paint);
    observerTargets.forEach(function(t){ if(t) mo.observe(t, {attributes:true, attributeFilter:['class']}); });

    function openFallback(){
      var drawer = findDrawer(), scrim = findScrim();
      btn.classList.add('is-open');
      if(drawer){ drawer.classList.add('open'); drawer.classList.add('show'); drawer.classList.add('in'); drawer.style.removeProperty('display'); }
      if(scrim){ scrim.classList.add('show'); scrim.style.opacity = '1'; scrim.style.pointerEvents = 'auto'; }
      document.documentElement.classList.add('nav-open'); document.body.classList.add('nav-open');
    }
    function closeFallback(){
      var drawer = findDrawer(), scrim = findScrim();
      btn.classList.remove('is-open');
      if(drawer){ drawer.classList.remove('open'); drawer.classList.remove('show'); drawer.classList.remove('in'); }
      if(scrim){ scrim.classList.remove('show'); scrim.style.opacity = '0'; scrim.style.pointerEvents = 'none'; }
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
    }

    btn.addEventListener('click', function(ev){
      // Let native handlers run first (Bootstrap/plantilla, etc.)
      var wasOpen = isOpen();
      // Do not preventDefault; we want native to handle it
      setTimeout(function(){
        var nowOpen = isOpen();
        if (wasOpen === nowOpen){
          // Native didn't toggle; we fallback
          if(nowOpen){ closeFallback(); } else { openFallback(); }
        }
        paint();
      }, 120);
    });
  });
})();