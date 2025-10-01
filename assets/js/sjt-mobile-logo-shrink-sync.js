
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }

  function updateHeights(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    var nav = header && header.querySelector('nav');
    var overlay = header && header.querySelector('.sjt-mobile-logo-overlay');
    if (!header || !nav || !overlay) return;

    // Toggle scrolled state
    if (window.scrollY > 8){ header.classList.add('is-scrolled'); }
    else { header.classList.remove('is-scrolled'); }

    // After class update, compute overlay height and sync nav min-height
    requestAnimationFrame(function(){
      var oh = overlay.getBoundingClientRect().height || 56;
      nav.style.minHeight = Math.ceil(oh) + 'px';
      // ensure hamburger stays vertically centered
      var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
      if (toggler){
        toggler.style.position = 'absolute';
        toggler.style.top = '50%';
        toggler.style.transform = 'translateY(-50%)';
        toggler.style.right = (toggler.style.right || '10px');
        toggler.style.zIndex = '5';
      }
    });
  }

  function init(){
    if (!isMobile()) return;
    updateHeights();
  }

  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('scroll', updateHeights, {passive:true});
  window.addEventListener('resize', updateHeights);
  window.addEventListener('orientationchange', updateHeights);
})();
