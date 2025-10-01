
(function(){
  function overlayCenter(){
    if (window.innerWidth > 1024) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    // avoid duplicates
    if (header.querySelector('.sjt-mobile-logo-overlay')) return;
    var nav = header.querySelector('nav');
    if (!nav) return;
    var logo = nav.querySelector('.logo');
    if (!logo) return;
    var overlay = document.createElement('div');
    overlay.className = 'sjt-mobile-logo-overlay';
    overlay.innerHTML = logo.innerHTML; // clone picture/img
    header.appendChild(overlay);
  }
  window.addEventListener('DOMContentLoaded', overlayCenter);
  window.addEventListener('resize', overlayCenter);
  window.addEventListener('orientationchange', overlayCenter);
})();
