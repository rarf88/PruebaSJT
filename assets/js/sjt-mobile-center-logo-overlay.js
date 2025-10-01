
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


// v63: eliminación total de logos residuales (excepto overlay) en mobile/tablet
(function(){
  if (!('MutationObserver' in window)) return;

  function isLogoLike(el){
    try{
      if (!el) return false;
      if (el.closest('.sjt-mobile-logo-overlay')) return false; // mantener el centrado
      var s = (el.outerHTML || el.textContent || '').toLowerCase();
      if (s.includes('sjt-mobile-logo-overlay')) return false;
      // patrones comunes
      if (s.includes('logo') || s.includes('isologo') || s.includes('brand') || s.includes('site-logo')) return true;
      // alt/title
      var alt = (el.getAttribute && (el.getAttribute('alt')||'')).toLowerCase();
      var title = (el.getAttribute && (el.getAttribute('title')||'')).toLowerCase();
      if (alt.includes('logo') || alt.includes('brand') or title.includes('logo') or title.includes('brand')) return true;
      return false;
    }catch(e){ return false; }
  }

  function nukeHeaderLogos(){
    if (window.innerWidth > 1024) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var nav = header.querySelector('nav'); if (!nav) return;

    // Candidatos
    var sels = [
      '.logo', '.site-logo', '.brand', 'img', 'picture', 'a'
    ];
    var nodes = [];
    sels.forEach(function(sel){
      nav.querySelectorAll(sel).forEach(function(n){ nodes.push(n); });
    });
    nodes.forEach(function(n){
      try{
        if (n.closest('.sjt-mobile-logo-overlay')) return;
        if (isLogoLike(n)){
          n.remove();
        }
      }catch(e){}
    });
  }

  function startObserver(){
    if (window.innerWidth > 1024) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var nav = header.querySelector('nav'); if (!nav) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        if (m.addedNodes){
          m.addedNodes.forEach(function(node){
            try{
              if (!(node instanceof HTMLElement)) return;
              if (node.closest && node.closest('.sjt-mobile-logo-overlay')) return;
              if (isLogoLike(node)){
                node.remove();
                return;
              }
              // Revisar descendientes
              node.querySelectorAll && node.querySelectorAll('*').forEach(function(child){
                if (isLogoLike(child)) child.remove();
              });
            }catch(e){}
          });
        }
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
  }

  function initV63(){
    if (window.innerWidth > 1024) return;
    nukeHeaderLogos();
    startObserver();
  }

  window.addEventListener('DOMContentLoaded', initV63);
  window.addEventListener('resize', initV63);
  window.addEventListener('orientationchange', initV63);
})();


// v64: root-level eradication of any non-centered logos (mobile/tablet only)
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }

  function isOverlay(node){
    try { return !!(node && node.closest && node.closest('.sjt-mobile-logo-overlay')); } catch(e){ return false; }
  }

  function looksLogo(node){
    try{
      if (!node || node.nodeType !== 1) return false;
      if (isOverlay(node)) return false;
      var tag = node.tagName.toLowerCase();
      var cls = (node.className || '').toString().toLowerCase();
      var id  = (node.id || '').toString().toLowerCase();
      var html = (node.outerHTML || '').toLowerCase();
      var alt = (node.getAttribute && (node.getAttribute('alt')||'')).toLowerCase();
      var title = (node.getAttribute && (node.getAttribute('title')||'')).toLowerCase();
      var src = (node.getAttribute && (node.getAttribute('src')||'')).toLowerCase();

      var hit = false;
      if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls)) hit = true;
      if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(id)) hit = true;
      if (alt.includes('logo') || alt.includes('brand')) hit = true;
      if (title.includes('logo') || title.includes('brand')) hit = true;
      if (src.includes('logo')) hit = true;
      if (html.includes('logo') || html.includes('site-logo') || html.includes('isologo')) hit = true;

      if (!hit && (tag === 'img' || tag === 'picture' || tag === 'svg')) {
        // conservative: if image near the right side inside nav, consider it
        var nav = node.closest && node.closest('nav');
        if (nav) hit = true;
      }
      return hit;
    }catch(e){ return false; }
  }

  function shouldBlock(node){
    if (!isMobile()) return false;
    if (!node) return false;
    if (isOverlay(node)) return false;
    if (looksLogo(node)) return true;
    if (node.querySelector){
      var hit = node.querySelector('.logo, .site-logo, .brand, [alt*="logo" i], [alt*="brand" i], img[src*="logo" i]');
      if (hit && !isOverlay(hit)) return true;
    }
    return false;
  }

  function patchContainer(el){
    if (!el || el.__sjt_patched) return;
    var ap = el.appendChild;
    var ib = el.insertBefore;
    var rp = el.replaceChild;

    function safe(child){
      try{
        if (shouldBlock(child)){ return null; }
      }catch(e){}
      return child;
    }

    el.appendChild = function(child){
      var c = safe(child);
      if (!c) return child;
      return ap.call(this, c);
    };
    el.insertBefore = function(child, ref){
      var c = safe(child);
      if (!c) return child;
      return ib.call(this, c, ref);
    };
    el.replaceChild = function(newChild, oldChild){
      var c = safe(newChild);
      if (!c) return oldChild;
      return rp.call(this, c, oldChild);
    };
    el.__sjt_patched = true;
  }

  function nukeNow(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var nav = header.querySelector('nav'); if (!nav) return;
    // immediate removal
    nav.querySelectorAll('*').forEach(function(n){
      if (shouldBlock(n)) { try{ n.remove(); }catch(e){} }
    });
    // patch containers
    patchContainer(nav);
    patchContainer(header);
    patchContainer(document.body);
  }

  function observe(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header'); if (!header) return;
    var nav = header.querySelector('nav'); if (!nav) return;
    if (nav.__sjt_mo) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && m.addedNodes.forEach(function(node){
          if (node && node.nodeType === 1){
            if (shouldBlock(node)){ try{ node.remove(); }catch(e){}; return; }
            node.querySelectorAll && node.querySelectorAll('*').forEach(function(child){
              if (shouldBlock(child)){ try{ child.remove(); }catch(e){} }
            });
          }
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__sjt_mo = mo;
  }

  function initV64(){
    if (!isMobile()) return;
    // run after overlay has been created (0ms microtask)
    setTimeout(function(){
      nukeNow();
      observe();
    }, 0);
  }

  window.addEventListener('DOMContentLoaded', initV64);
  window.addEventListener('resize', initV64);
  window.addEventListener('orientationchange', initV64);
})();
