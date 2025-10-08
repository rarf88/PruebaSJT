// Mobile-only: ☰ opens (only), ✕ or scrim closes. No timers, no double toggles.
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

    function drawerEl(){
      return document.getElementById('sjt-mobile-drawer') ||
             document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer, .navbar-collapse, .menu-mobile, nav[role="navigation"]');
    }
    function scrimEl(){
      return document.getElementById('sjt-mobile-scrim') ||
             document.querySelector('.backdrop, .offcanvas-backdrop, .nav-scrim, .modal-backdrop');
    }
    function isOpen(){
      var d = drawerEl();
      if(d) return d.classList.contains('open') || d.classList.contains('show') || d.classList.contains('in');
      return document.documentElement.classList.contains('nav-open') || document.body.classList.contains('nav-open') ||
             btn.classList.contains('is-open') || btn.getAttribute('aria-expanded') === 'true';
    }
    function paint(){
      if(isOpen()){ btn.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
      else { btn.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
    }

    function openMenu(){
      var d = drawerEl(), s = scrimEl();
      if(d){ d.classList.add('open','show','in'); d.style.removeProperty('display'); }
      if(s){ s.classList.add('show'); s.style.opacity='1'; s.style.pointerEvents='auto'; }
      document.documentElement.classList.add('nav-open'); document.body.classList.add('nav-open');
      paint();
    }
    function closeMenu(){
      var d = drawerEl(), s = scrimEl();
      if(d){ d.classList.remove('open','show','in'); }
      if(s){ s.classList.remove('show'); s.style.opacity='0'; s.style.pointerEvents='none'; }
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
      paint();
    }

    // Click on the button: if closed -> OPEN; if open -> CLOSE (acts as X)
    btn.addEventListener('click', function(ev){
      ev.preventDefault(); ev.stopPropagation();
      if(isOpen()){ closeMenu(); } else { openMenu(); }
    }, {passive:false});

    // Click outside (scrim) closes
    var scrim = scrimEl();
    if(scrim){ scrim.addEventListener('click', function(){ closeMenu(); }); }

    // Keep icon synced if other scripts toggle classes
    var mo = new MutationObserver(paint);
    [document.body, document.documentElement, drawerEl()].forEach(function(t){ if(t) mo.observe(t, {attributes:true, attributeFilter:['class']}); });
    paint();
  });
})();