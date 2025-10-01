
(function(){
  function enforce(){
    try{
      if (window.innerWidth > 1024) return;
      var nav = document.querySelector('header.site-header nav.nav'); if(!nav) return;
      var logo = nav.querySelector('.logo'); if(!logo) return;
      var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');

      if (nav.firstElementChild !== logo){ nav.insertBefore(logo, nav.firstElementChild); }
      if (toggler){ nav.appendChild(toggler); }
      var links = nav.querySelector('.nav-links, ul'); if (links){ links.style.display = 'none'; }
    }catch(e){}
  }
  window.addEventListener('DOMContentLoaded', enforce);
  window.addEventListener('resize', enforce);
  window.addEventListener('orientationchange', enforce);
})();
