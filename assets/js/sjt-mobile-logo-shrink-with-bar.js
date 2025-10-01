
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function onScroll(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    if (window.scrollY > 8){ header.classList.add('is-scrolled'); }
    else { header.classList.remove('is-scrolled'); }
  }
  window.addEventListener('DOMContentLoaded', onScroll);
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  window.addEventListener('orientationchange', onScroll);
})();
