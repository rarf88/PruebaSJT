
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $$all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  function ensureOverlay(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var overlay = nav.querySelector('.sjt-mobile-logo-overlay');
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className = 'sjt-mobile-logo-overlay';
      nav.appendChild(overlay);
    }
    var a = overlay.querySelector('a');
    if (!a){ a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); overlay.appendChild(a); }
    var img = overlay.querySelector('img');
    if (!img){ img = document.createElement('img'); a.appendChild(img); }
    img.src = 'assets/img/logo_sjt_integrado.png';
    if (!img.alt) img.alt = 'SJT';
  }

  function setRightPad(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var t = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    var w = 56;
    if (t){ var r = t.getBoundingClientRect(); w = Math.max(56, Math.ceil(r.width)+16); }
    nav.style.setProperty('--pad-right', w + 'px');
  }

  function purgeStrayNavMedia(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    $$all('img, picture, svg, .logo, .site-logo, .brand', nav).forEach(function(n){
      if (n.closest('.sjt-mobile-logo-overlay')) return;
      if (n.closest('button')) return;
      try{ n.remove(); }catch(e){}
    });
  }

  function onScroll(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var y = window.scrollY || 0, on = header.classList.contains('is-scrolled');
    if (!on && y>110) header.classList.add('is-scrolled');
    else if (on && y<60) header.classList.remove('is-scrolled');
  }

  window.addEventListener('DOMContentLoaded', function(){ ensureOverlay(); setRightPad(); purgeStrayNavMedia(); onScroll(); });
  window.addEventListener('resize', function(){ setRightPad(); purgeStrayNavMedia(); onScroll(); });
  window.addEventListener('orientationchange', function(){ setRightPad(); purgeStrayNavMedia(); onScroll(); });
  window.addEventListener('scroll', onScroll, {passive:true});
})();
