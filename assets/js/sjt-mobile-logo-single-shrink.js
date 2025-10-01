
(function(){
  // Start shrinking only after 110px; unshrink when scrolled back above - i.e., below 50px
  var DOWN_THRESHOLD = 110;
  var UP_THRESHOLD   = 50;

  function isMobile(){ return window.innerWidth <= 1024; }

  function tick(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    var nav = header.querySelector('nav');
    if (nav && nav.style && nav.style.minHeight){
      // neutralize any inline min-heights set by older scripts
      nav.style.minHeight = '';
    }

    var y = window.scrollY || window.pageYOffset || 0;
    var scrolled = header.classList.contains('is-scrolled');

    if (!scrolled && y > DOWN_THRESHOLD){
      header.classList.add('is-scrolled');
    } else if (scrolled && y < UP_THRESHOLD){
      header.classList.remove('is-scrolled');
    }
  }

  function rafTick(){
    tick();
    requestAnimationFrame(rafTick);
  }

  window.addEventListener('DOMContentLoaded', function(){
    // kick immediately then maintain via rAF (smooth + resilient to URL bar/jank)
    tick();
    requestAnimationFrame(rafTick);
  });

  window.addEventListener('orientationchange', tick);
  window.addEventListener('resize', tick);
})();
