
(function(){
  var DOWN_TH = 110, UP_TH = 60;
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }

  function prepare(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var overlay = header.querySelector('.sjt-mobile-logo-overlay');
    if (!overlay){
      // Create overlay from existing .logo if needed
      var src = nav.querySelector('.logo');
      if (src){
        overlay = document.createElement('div');
        overlay.className = 'sjt-mobile-logo-overlay';
        var a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); a.innerHTML = src.innerHTML;
        overlay.appendChild(a);
        header.appendChild(overlay);
      }
    }
    if (overlay && overlay.parentElement !== nav){
      try{ nav.appendChild(overlay); }catch(e){}
    }
    // Remove any other logos inside nav
    var extras = nav.querySelectorAll('.logo, .site-logo, .brand, img, picture, svg');
    extras.forEach(function(n){
      if (!n.closest('.sjt-mobile-logo-overlay') && n.tagName !== 'BUTTON'){
        // don't remove hamburger svg inside button
        if (n.closest('button')) return;
        try{ n.remove(); }catch(e){}
      }
    });
  }

  function tick(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    var y = window.scrollY || 0;
    var on = header.classList.contains('is-scrolled');
    if (!on && y > 110) header.classList.add('is-scrolled');
    else if (on && y < 60) header.classList.remove('is-scrolled');
  }

  window.addEventListener('DOMContentLoaded', function(){
    prepare(); tick();
  });
  window.addEventListener('resize', function(){ prepare(); tick(); });
  window.addEventListener('orientationchange', function(){ prepare(); tick(); });
  window.addEventListener('scroll', tick, {passive:true});
})();
