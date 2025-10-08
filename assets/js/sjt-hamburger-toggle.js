// Mobile-only: rely on native click first; if no state change is detected within 220ms, apply a single fallback.
// Prevents the "abre y cierra de una vez" effect.
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
             document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer, .navbar-collapse, .menu-mobile');
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
    paint();

    // Observe state changes to update icon
    var obsTargets = [document.body, document.documentElement];
    var d = drawerEl(); if(d) obsTargets.push(d);
    var mo = new MutationObserver(function(){ paint(); });
    obsTargets.forEach(function(t){ if(t) mo.observe(t, {attributes:true, attributeFilter:['class']}); });

    function openFallback(){
      var d = drawerEl(), s = scrimEl();
      if(d){ d.classList.add('open','show','in'); d.style.removeProperty('display'); }
      if(s){ s.classList.add('show'); s.style.opacity='1'; s.style.pointerEvents='auto'; }
      document.documentElement.classList.add('nav-open'); document.body.classList.add('nav-open');
    }
    function closeFallback(){
      var d = drawerEl(), s = scrimEl();
      if(d){ d.classList.remove('open','show','in'); }
      if(s){ s.classList.remove('show'); s.style.opacity='0'; s.style.pointerEvents='none'; }
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
    }

    btn.addEventListener('click', function(ev){
      // Let the site's own click run first
      var before = isOpen();
      var fellBack = false;
      var timer = setTimeout(function(){
        var after = isOpen();
        if (after === before){
          // No change -> fallback once
          fellBack = true;
          if(after){ closeFallback(); } else { openFallback(); }
          paint();
        }
      }, 220); // allow native animations/Bootstrap to toggle classes

      // Safety: if mutation happens, cancel fallback
      var cancelFallback = new MutationObserver(function(){
        clearTimeout(timer);
        paint();
      });
      var targets = [document.body, document.documentElement, drawerEl()];
      targets.forEach(function(t){ if(t) cancelFallback.observe(t, {attributes:true, attributeFilter:['class']}); });

      // Cleanup after ~1s to avoid observers piling up
      setTimeout(function(){ try{ cancelFallback.disconnect(); }catch(e){} }, 1000);
    });
  });
})();