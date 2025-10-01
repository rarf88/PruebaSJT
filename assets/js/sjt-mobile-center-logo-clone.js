
(function(){
  function centerClone(){
    if (window.innerWidth > 1024) return; // solo mobile/tablet
    var nav = document.querySelector('header.site-header nav.nav');
    if(!nav) return;
    // si ya existe, no duplicar
    if (nav.querySelector('.sjt-mobile-centered-logo')) return;
    var srcLogo = nav.querySelector('.logo');
    if(!srcLogo) return;
    // crear contenedor
    var wrap = document.createElement('div');
    wrap.className = 'sjt-mobile-centered-logo';
    // clonar contenido del logo (picture/img) para mantener el mismo arte
    wrap.innerHTML = srcLogo.innerHTML;
    nav.appendChild(wrap);
  }
  window.addEventListener('DOMContentLoaded', centerClone);
  window.addEventListener('resize', centerClone);
  window.addEventListener('orientationchange', centerClone);
})();
