
(function(){
  var DOWN = 110, UP = 60;
  function isMobile(){ return window.innerWidth <= 1024; }
  function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function tick(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var y = window.scrollY || 0;
    var on = header.classList.contains('is-scrolled');
    if (!on && y > DOWN) header.classList.add('is-scrolled');
    else if (on && y < UP) header.classList.remove('is-scrolled');

    // Remove stray logos inside nav (non-overlay)
    var nav = header.querySelector('nav'); if (!nav) return;
    $$('.logo, .site-logo, .brand, picture, img, svg', nav).forEach(function(n){
      if (!n.closest('.sjt-mobile-logo-overlay') && !n.closest('button')){
        try{ n.remove(); }catch(e){}
      }
    });
  }
  window.addEventListener('DOMContentLoaded', tick);
  window.addEventListener('scroll', tick, {passive:true});
  window.addEventListener('resize', tick);
  window.addEventListener('orientationchange', tick);
})();
