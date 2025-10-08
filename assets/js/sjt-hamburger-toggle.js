// Mobile-only: keep button position; reuse site's native click to open/close.
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;

    // Find an existing hamburger without moving it
    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;

    // Ensure it has 3 bars but don't remove existing children that may be needed
    if (!btn.querySelector('.bar')) {
      btn.insertAdjacentHTML('beforeend','<span class="bar"></span><span class="bar"></span><span class="bar"></span>');
    }

    // Detect drawer open state heuristically
    function isOpen(){
      var drawer = document.getElementById('sjt-mobile-drawer') ||
                   document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer');
      if(drawer) return drawer.classList.contains('open') || drawer.classList.contains('show');
      // Fall back to body/html flags
      return document.documentElement.classList.contains('nav-open') || document.body.classList.contains('nav-open');
    }
    function paint(){
      if(isOpen()) btn.classList.add('is-open'); else btn.classList.remove('is-open');
    }
    paint();

    // Observe changes to reflect X/☰ without altering layout
    var obsTargets = [document.body, document.documentElement];
    var drawer = document.getElementById('sjt-mobile-drawer') ||
                 document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer');
    if(drawer) obsTargets.push(drawer);
    var mo = new MutationObserver(paint);
    obsTargets.forEach(function(t){ if(t) mo.observe(t, {attributes:true, attributeFilter:['class']}); });

    // On tap: first try to call the site's native click (this element itself),
    // which should open/close the menu; then repaint icon.
    btn.addEventListener('click', function(){
      // Defer paint so native handlers run first
      setTimeout(paint, 30);
    });
  });
})();