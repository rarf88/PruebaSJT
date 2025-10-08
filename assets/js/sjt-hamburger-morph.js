// Sync ☰ ↔ ✕ and close on X without replacing existing menu logic
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;

    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;

    // Ensure bars exist (do not disturb existing content)
    if(!btn.querySelector('.bar')){
      btn.insertAdjacentHTML('beforeend','<span class="bar"></span><span class="bar"></span><span class="bar"></span>');
    }

    function drawer(){ 
      return document.getElementById('sjt-mobile-drawer') || 
             document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer, .navbar-collapse, .menu-mobile');
    }
    function scrim(){
      return document.getElementById('sjt-mobile-scrim') || 
             document.querySelector('.backdrop, .offcanvas-backdrop, .nav-scrim, .modal-backdrop');
    }
    function isOpen(){
      var d = drawer();
      if(d) return d.classList.contains('open') || d.classList.contains('show') || d.classList.contains('in');
      return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open');
    }
    function paint(){ if(isOpen()) btn.classList.add('is-open'); else btn.classList.remove('is-open'); }

    // Close helpers (used when X is pressed)
    function closeMenu(){
      var d = drawer(), s = scrim();
      if(d){ d.classList.remove('open','show','in'); }
      if(s){ s.classList.remove('show'); s.style.opacity='0'; s.style.pointerEvents='none'; }
      document.body.classList.remove('nav-open'); document.documentElement.classList.remove('nav-open');
      paint();
    }

    // Click behavior:
    // - If menú está cerrado: dejamos actuar al handler nativo (abre).
    // - Si está abierto (✕): cerramos nosotros inmediatamente.
    btn.addEventListener('click', function(ev){
      if(isOpen()){
        ev.preventDefault(); ev.stopPropagation();
        closeMenu();
      }else{
        // menú cerrado -> permitir que el click nativo lo abra, solo pintamos luego
        setTimeout(paint, 80);
      }
    }, {passive:false});

    // Cerrar al tocar fuera (scrim)
    var s = scrim();
    if(s){ s.addEventListener('click', closeMenu); }

    // Mantener icono sincronizado si otras rutinas abren/cierran
    var mo = new MutationObserver(paint);
    [document.body, document.documentElement, drawer()].forEach(function(n){ if(n) mo.observe(n,{attributes:true,attributeFilter:['class']}); });
    paint();
  });
})();