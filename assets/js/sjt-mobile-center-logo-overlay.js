
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

// v66: REMOVE ONLY the right-side (hamburger area) logo in mobile/tablet — aggressive root cause
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $$ (sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function isOverlay(el){ try{ return !!(el && el.closest && el.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
  function isToggler(el){ return !!(el && (el.matches('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler') || (el.closest && el.closest('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler')))); }
  function looksLogo(el){
    if (!el || el.nodeType!==1) return false;
    if (isOverlay(el) || isToggler(el)) return false;
    var cls=(el.className||'').toString().toLowerCase();
    var id =(el.id||'').toString().toLowerCase();
    var alt=(el.getAttribute&& (el.getAttribute('alt')||'')).toLowerCase();
    var tit=(el.getAttribute&& (el.getAttribute('title')||'')).toLowerCase();
    var src=(el.getAttribute&& (el.getAttribute('src')||'')).toLowerCase();
    var html=(el.outerHTML||'').toLowerCase();
    if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
    if (alt.includes('logo')||alt.includes('brand')||tit.includes('logo')||tit.includes('brand')||src.includes('logo')) return true;
    if (html.includes('logo')||html.includes('site-logo')||html.includes('isologo')) return true;
    // Heuristic: standalone IMG/PICTURE/SVG near right side
    if (el.tagName==='IMG'||el.tagName==='PICTURE'||el.tagName==='SVG') return true;
    return false;
  }
  function hasLogoBg(el){
    try{ var bg=getComputedStyle(el).backgroundImage||''; return /logo/i.test(bg); }catch(e){ return false; }
  }
  function killRightLogo(){
    if (!isMobile()) return;
    var header=$('header.site-header'); if(!header) return;
    var nav=$('nav', header); if(!nav) return;
    var rect=nav.getBoundingClientRect();
    var rightStart=rect.left + rect.width*0.55; // right half threshold
    var nodes=$$('img, picture, svg, a, div, span', nav);
    nodes.forEach(function(el){
      if (isOverlay(el) || isToggler(el)) return;
      var r; try{ r=el.getBoundingClientRect(); }catch(e){ r=null; }
      if (!r) return;
      var onRight=r.left>rightStart;
      if (!onRight) return;
      var remove=false;
      if (looksLogo(el)) remove=true;
      if (!remove && hasLogoBg(el)) remove=true;
      if (remove){
        var a=el.closest && el.closest('a');
        try{ (a||el).remove(); }catch(e){}
      }
    });
    // Also clear background-image on any right area wrappers (defensive)
    var wrappers=$$('div, span, a', nav);
    wrappers.forEach(function(el){
      if (isOverlay(el) || isToggler(el)) return;
      var r; try{ r=el.getBoundingClientRect(); }catch(e){ r=null; }
      if (!r) return;
      if (r.left>rightStart){
        if (hasLogoBg(el)){
          try{ el.style.backgroundImage='none'; }catch(e){}
        }
      }
    });
  }
  function observe(){
    if (!isMobile()) return;
    var header=$('header.site-header'); if(!header) return;
    var nav=$('nav', header); if(!nav) return;
    if (nav.__mo_v66) return;
    var mo=new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(node){
          if (!(node && node.nodeType===1)) return;
          killRightLogo();
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__mo_v66=mo;
  }
  function patchContainer(el){
    if (!el || el.__patched_v66) return;
    var ap=el.appendChild, ib=el.insertBefore, rp=el.replaceChild;
    function safe(child){
      try{
        if (!child || child.nodeType!==1) return child;
        var nav=el.closest && el.closest('nav');
        if (!nav) return child;
        var rect=nav.getBoundingClientRect();
        var rightStart=rect.left + rect.width*0.55;
        var r=child.getBoundingClientRect ? child.getBoundingClientRect(): null;
        if (r && r.left>rightStart){
          if (looksLogo(child)) return null;
        }
      }catch(e){}
      return child;
    }
    el.appendChild=function(c){ var x=safe(c); if(!x) return c; return ap.call(this,x); };
    el.insertBefore=function(c,ref){ var x=safe(c); if(!x) return c; return ib.call(this,x,ref); };
    el.replaceChild=function(n,o){ var x=safe(n); if(!x) return o; return rp.call(this,x,o); };
    el.__patched_v66=true;
  }
  function initV66(){
    if (!isMobile()) return;
    killRightLogo();
    observe();
    var header=$('header.site-header'); var nav=header && $('nav', header);
    if (nav){ patchContainer(nav); patchContainer(header); patchContainer(document.body); }
  }
  window.addEventListener('DOMContentLoaded', initV66);
  window.addEventListener('resize', initV66);
  window.addEventListener('orientationchange', initV66);
})();
