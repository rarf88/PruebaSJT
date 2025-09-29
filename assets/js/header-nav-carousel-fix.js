(function(){function ready(fn){if(document.readyState!='loading'){fn()}else document.addEventListener('DOMContentLoaded',fn);}ready(function(){
  // ONLY_MOBILE_GUARD
  function isMobile(){return window.matchMedia('(max-width: 991px)').matches;}

  var header=document.querySelector('header, .navbar, .site-header'); if(!header) return;
  if(isMobile() && !document.getElementById('sjt-hamburger')){
    var btn=document.createElement('button'); btn.id='sjt-hamburger'; btn.setAttribute('aria-label','Abrir menú');
    btn.innerHTML='<span class="bar"></span><span class="bar"></span><span class="bar"></span>'; header.appendChild(btn);
    var drawer=document.createElement('nav'); drawer.id='sjt-mobile-drawer'; document.body.appendChild(drawer);
    var scrim=document.createElement('div'); scrim.id='sjt-mobile-scrim'; document.body.appendChild(scrim);
    var navUL=document.querySelector('header nav ul, .navbar nav ul, .main-menu ul, nav ul, header nav, nav');
    if(navUL){drawer.innerHTML='<h3 style="margin:0 0 10px 0;font-weight:700;">Menú</h3>'; navUL.querySelectorAll('a').forEach(function(a){var cl=a.cloneNode(true);cl.removeAttribute('class');drawer.appendChild(cl);});}
    function open(){drawer.classList.add('open');scrim.classList.add('show');}
    function close(){drawer.classList.remove('open');scrim.classList.remove('show');}
    btn.addEventListener('click',open); scrim.addEventListener('click',close); drawer.addEventListener('click',function(e){if(e.target.tagName==='A') close();});
  }
  // v3 hide stray short nav text (e.g. PRODUC) on mobile
  function hideStray(){if(window.matchMedia('(max-width: 991px)').matches){var h=document.querySelector('header, .navbar, .site-header'); if(!h) return; h.querySelectorAll('*').forEach(function(el){var t=(el.textContent||'').trim(); if(t && t.length<=10 && /PRODUC|PRODU|SERVI|MENU/i.test(t)){el.style.display='none';}});}}
  hideStray(); window.addEventListener('resize', hideStray);
});})();
  function ensureForViewport(){
    var ham=document.getElementById('sjt-hamburger');
    var dr=document.getElementById('sjt-mobile-drawer');
    var sc=document.getElementById('sjt-mobile-scrim');
    if(!isMobile()){ if(ham) ham.remove(); if(dr) dr.remove(); if(sc) sc.remove(); }
  }
  ensureForViewport(); window.addEventListener('resize', ensureForViewport);
