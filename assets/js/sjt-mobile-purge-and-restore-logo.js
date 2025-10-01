
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s, r){ return (r||document).querySelector(s); }
  function $all(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function isOverlay(el){ try{ return !!(el && el.closest && el.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
  function looksLogo(el){
    if (!el || el.nodeType!==1) return false;
    if (isOverlay(el)) return false;
    var cls=(el.className||'').toString().toLowerCase();
    var id=(el.id||'').toString().toLowerCase();
    var alt=(el.getAttribute&& (el.getAttribute('alt')||'')).toLowerCase();
    var tit=(el.getAttribute&& (el.getAttribute('title')||'')).toLowerCase();
    var src=(el.getAttribute&& (el.getAttribute('src')||'')).toLowerCase();
    var html=(el.outerHTML||'').toLowerCase();
    if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
    if (alt.includes('logo')||alt.includes('brand')||tit.includes('logo')||tit.includes('brand')) return true;
    if (src.includes('logo')) return true;
    if (html.includes('logo')||html.includes('site-logo')||html.includes('isologo')) return true;
    return (el.tagName==='IMG'||el.tagName==='PICTURE'||el.tagName==='SVG');
  }
  function clearBgIfLogo(el){
    try{
      var cs = getComputedStyle(el);
      if (cs && /logo/i.test(cs.backgroundImage||'')){
        el.style.backgroundImage='none';
      }
    }catch(e){}
  }
  function captureOriginalMarkup(nav){
    // Prefer the existing .logo markup
    var src = nav && nav.querySelector('.logo');
    if (src && src.innerHTML.trim()) return src.innerHTML;
    // Fallback: try to find any <img> in header that mentions 'logo'
    var header = nav && nav.closest('header');
    var cand = header && header.querySelector('img[src*="logo" i], picture img');
    if (cand){
      var alt = cand.getAttribute('alt') || 'Logo';
      return '<img src="'+cand.getAttribute('src')+'" alt="'+alt+'">';
    }
    // Last resort: text
    return '<span style="font-weight:600">LOGO</span>';
  }
  function purgeAllLogos(nav){
    if (!nav) return;
    // remove logo-like elements
    $all('a, img, picture, svg, div, span', nav).forEach(function(el){
      if (isOverlay(el)) return;
      if (looksLogo(el)){
        try{ (el.closest && el.closest('a')) ? el.closest('a').remove() : el.remove(); }catch(e){}
      }else{
        clearBgIfLogo(el);
      }
    });
  }
  function restoreCentered(header, savedHTML){
    if (!header) return;
    var overlay = header.querySelector('.sjt-mobile-logo-overlay');
    if (overlay){ // replace its content with saved logo to ensure it's the approved one
      overlay.innerHTML = '';
    }else{
      overlay = document.createElement('div');
      overlay.className = 'sjt-mobile-logo-overlay';
      header.appendChild(overlay);
    }
    var a = document.createElement('a');
    a.href = 'index.html'; a.setAttribute('aria-label','Inicio');
    a.innerHTML = savedHTML;
    overlay.appendChild(a);
  }
  function keepClean(nav){
    if (!nav || nav.__sjt_purge_obs) return;
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(n){
          if (!(n && n.nodeType===1)) return;
          // If a new node looks like a logo, remove it
          if (looksLogo(n)){ try{ n.remove(); }catch(e){} return; }
          // Check descendants
          n.querySelectorAll && n.querySelectorAll('*').forEach(function(c){
            if (looksLogo(c)){ try{ c.remove(); }catch(e){} }
          });
        });
      });
    });
    mo.observe(nav, {childList:true, subtree:true});
    nav.__sjt_purge_obs = mo;
  }
  function init(){
    if (!isMobile()) return;
    var header = $('header.site-header'); if (!header) return;
    var nav = $('nav', header); if (!nav) return;
    var saved = captureOriginalMarkup(nav);
    purgeAllLogos(nav);
    restoreCentered(header, saved);
    keepClean(nav);
    // extra passes
    for (var i=1;i<=6;i++){ setTimeout(function(){ purgeAllLogos(nav); }, i*120); }
  }
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', init);
  window.addEventListener('orientationchange', init);
})();
