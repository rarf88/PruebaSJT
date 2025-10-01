
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
    var a=document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); a.innerHTML=logo.innerHTML; overlay.appendChild(a);
    header.appendChild(overlay);
  }
  window.addEventListener('DOMContentLoaded', overlayCenter);
  window.addEventListener('resize', overlayCenter);
  window.addEventListener('orientationchange', overlayCenter);
})();


(function(){
  function onScroll(){
    if (window.innerWidth > 1024) return;
    var header = document.querySelector('header.site-header');
    if(!header) return;
    if (window.scrollY > 8){ header.classList.add('is-scrolled'); }
    else { header.classList.remove('is-scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('DOMContentLoaded', onScroll);
})();


(function(){
  function removeOriginalLogo(){
    if (window.innerWidth > 1024) return;
    var nav = document.querySelector('header.site-header nav.nav');
    if(!nav) return;
    var orig = nav.querySelector('.logo');
    if (orig && orig.parentElement){
      try{ orig.parentElement.removeChild(orig); }catch(e){ /* noop */ }
    }
  }
  window.addEventListener('DOMContentLoaded', removeOriginalLogo);
  window.addEventListener('resize', removeOriginalLogo);
  window.addEventListener('orientationchange', removeOriginalLogo);
})();


// v62 additions
(function(){
  function nukeExtraLogos(){
    if (window.innerWidth > 1024) return;
    var nav = document.querySelector('header.site-header nav');
    if (!nav) return;
    // Candidates for "logo-like" elements (keep overlay)
    var candidates = nav.querySelectorAll('.logo, .site-logo, .brand, picture, img');
    candidates.forEach(function(el){
      try{
        // skip overlay content
        if (el.closest('.sjt-mobile-logo-overlay')) return;
        // likely a logo src/alt/class
        var txt = (el.outerHTML || '').toLowerCase();
        var looksLogo = txt.includes('logo') || txt.includes('brand') || txt.includes('isologo');
        if (looksLogo){
          el.remove();
        }
      }catch(e){}
    });
  }

  var lastScale = 1;
  function applyShrink(){
    if (window.innerWidth > 1024) return;
    var header = document.querySelector('header.site-header');
    var overlay = document.querySelector('.sjt-mobile-logo-overlay');
    if (!header || !overlay) return;
    // Toggle is-scrolled class (already exists) and compute scale
    var scrolled = window.scrollY > 8;
    var targetScale = scrolled ? 0.86 : 1.0; // smooth, no cropping
    if (Math.abs(targetScale - lastScale) > 0.005){
      overlay.style.transform = 'scale(' + targetScale + ')';
      lastScale = targetScale;
    }
    // Keep overlay centered vertically in the current header height
    var h = scrolled ? 56 : 64;
    overlay.style.height = h + 'px';
  }

  function initV62(){
    if (window.innerWidth > 1024) return;
    nukeExtraLogos();
    applyShrink();
  }

  window.addEventListener('DOMContentLoaded', initV62);
  window.addEventListener('resize', initV62);
  window.addEventListener('orientationchange', initV62);
  window.addEventListener('scroll', applyShrink, {passive:true});
})();
