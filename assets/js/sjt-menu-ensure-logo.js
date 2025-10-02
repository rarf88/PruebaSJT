
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function ensure(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var menu = header.querySelector('.navbar-collapse, .offcanvas');
    if (!menu) return;
    var block = menu.querySelector('.sjt-menu-logo');
    if (!block){ block = document.createElement('div'); block.className='sjt-menu-logo'; menu.insertBefore(block, menu.firstChild); }
  }
  window.addEventListener('DOMContentLoaded', ensure);
  window.addEventListener('resize', ensure);
  window.addEventListener('orientationchange', ensure);
})();
