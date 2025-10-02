
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s, r){ return (r||document).querySelector(s); }

  function ensureOverlay(){ 
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var overlay = $('.sjt-mobile-logo-overlay', nav);
    if (!overlay){ 
      overlay = document.createElement('div'); 
      overlay.className = 'sjt-mobile-logo-overlay';
      nav.insertBefore(overlay, nav.firstChild.nextSibling);
    }
    if (!overlay.querySelector('a')){ 
      var a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio');
      overlay.appendChild(a);
    }
    var a = overlay.querySelector('a');
    var img = overlay.querySelector('img');
    if (!img){ img = document.createElement('img'); a.appendChild(img); }
    img.src = 'assets/img/sjt-logo-transparent@2x.png';
    if (!img.alt) img.alt = 'SJT';
  }

  function syncGhostSpacer(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    var w = 44;
    if (toggler) {
      var r = toggler.getBoundingClientRect();
      w = Math.max(36, Math.ceil(r.width) + 8);
    }
    nav.style.setProperty('--toggler-w', w + 'px');
  }

  
  function setRightPadding(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
    var w = 44;
    if (toggler){
      var r = toggler.getBoundingClientRect();
      w = Math.max(44, Math.ceil(r.width) + 16); // add a little breathing room
    }
    nav.style.setProperty('--pad-right', w + 'px');
  }

  
  function purgeStrayNavMedia(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var nodes = nav.querySelectorAll('img, picture, svg');
    nodes.forEach(function(n){
      if (n.closest('.sjt-mobile-logo-overlay')) return;   // keep centered overlay
      if (n.closest('button')) return;                      // keep hamburger/icon inside buttons
      try{ n.remove(); }catch(e){}
    });
    // Also hide common wrappers if still present
    var wrappers = nav.querySelectorAll('.logo, .site-logo, .brand');
    wrappers.forEach(function(w){ try{ w.remove(); }catch(e){} });
  }

  function onScroll(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var y = window.scrollY || 0;
    if (y > 110) header.classList.add('is-scrolled');
    else if (y < 60) header.classList.remove('is-scrolled');
  }

  window.addEventListener('DOMContentLoaded', function(){ ensureOverlay();  onScroll(); setRightPadding(); purgeStrayNavMedia(); });
  window.addEventListener('resize', function(){ setRightPadding(); purgeStrayNavMedia();  onScroll(); setRightPadding(); purgeStrayNavMedia(); });
  window.addEventListener('orientationchange', function(){ setRightPadding(); purgeStrayNavMedia();  onScroll(); setRightPadding(); purgeStrayNavMedia(); });
  window.addEventListener('scroll', onScroll, {passive:true});
})();
