
(function(){
  var DOWN_TH = 110, UP_TH = 60;
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }

  
  function prepare(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var overlay = header.querySelector('.sjt-mobile-logo-overlay');

    // If overlay doesn't exist, create it
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className = 'sjt-mobile-logo-overlay';
      header.appendChild(overlay);
    }

    // Ensure it lives inside the nav
    if (overlay.parentElement !== nav){
      try{ nav.appendChild(overlay); }catch(e){}
    }

    // If overlay has no content, try to find a logo image anywhere in the doc
    var hasImg = overlay.querySelector('img, picture, svg');
    if (!hasImg){
      // 1) Prefer any image with 'logo' in its src anywhere
      var docLogo = document.querySelector('img[src*="logo" i]');
      // 2) fallback: any picture that likely contains logo
      if (!docLogo){
        var pic = document.querySelector('picture img');
        if (pic && /logo/i.test(pic.getAttribute('src')||'')) docLogo = pic;
      }
      // 3) fallback: any svg in header that might be a logo
      var docSvg = !docLogo ? document.querySelector('header svg') : null;

      var a = document.createElement('a');
      a.href='index.html'; a.setAttribute('aria-label','Inicio');

      if (docLogo){
        var img = document.createElement('img');
        img.src = docLogo.getAttribute('src');
        img.alt = docLogo.getAttribute('alt') || 'Logo';
        a.appendChild(img);
      } else if (docSvg){
        a.appendChild(docSvg.cloneNode(true));
      } else {
        // 4) last resort: simple text placeholder
        var span = document.createElement('span');
        span.textContent = 'SJT';
        span.style.fontWeight = '700';
        span.style.fontSize = '20px';
        a.appendChild(span);
      }
      overlay.innerHTML = '';
      overlay.appendChild(a);
    }

    // Ensure overlay exists and contains the approved logo (hard-wired)
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className = 'sjt-mobile-logo-overlay';
      header.appendChild(overlay);
    }
    if (overlay.parentElement !== nav) {
      try{ nav.appendChild(overlay); }catch(e){}
    }
    var a = overlay.querySelector('a');
    var img = overlay.querySelector('img');
    if (!a) {
      a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); overlay.appendChild(a);
    }
    if (!img) {
      img = document.createElement('img'); a.appendChild(img);
    }
    img.src = 'assets/img/sjt-logo.png';
    if (!img.alt) img.alt = 'SJT';

  // Remove any other nav .logo nodes (keep only overlay)
    var extra = nav.querySelectorAll('.logo, .site-logo, .brand');
    extra.forEach(function(n){ if (!n.closest('.sjt-mobile-logo-overlay')){ try{ n.remove(); }catch(e){} } });
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
