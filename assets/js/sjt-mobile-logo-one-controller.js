
(function(){
  var DOWN_THRESHOLD = 120; // start shrink when user scrolls past this
  var UP_THRESHOLD   = 60;  // unshrink when above this (hysteresis)
  function isMobile(){ return window.innerWidth <= 1024; }

  function tick(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    var y = window.scrollY || 0;
    var sc = header.classList.contains('is-scrolled');
    if (!sc && y > DOWN_THRESHOLD) header.classList.add('is-scrolled');
    else if (sc && y < UP_THRESHOLD) header.classList.remove('is-scrolled');
  }

  window.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('scroll', tick, {passive:true});
  window.addEventListener('resize', tick);
  window.addEventListener('orientationchange', tick);
})();
