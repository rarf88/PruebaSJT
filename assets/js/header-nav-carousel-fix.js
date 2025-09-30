(function(){function ready(fn){if(document.readyState!='loading'){fn()}else document.addEventListener('DOMContentLoaded',fn);}ready(function(){
  var header=document.querySelector('header, .navbar, .site-header'); if(!header) return;
  if(!document.getElementById('sjt-hamburger')){
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

// v17c: force logo visible on mobile/tablet with inline styles and fallback image if needed
(function(){
  function setImp(el, prop, val){ try{ el && el.style && el.style.setProperty(prop, val, 'important'); }catch(e){} }
  function ensureLogo(){
    var mq = window.matchMedia('(max-width: 1024px)');
    if(!mq.matches) return;
    var header = document.querySelector('header.site-header');
    if(!header) return;
    var nav = header.querySelector('.nav') || header;
    var logoA = nav.querySelector('a.logo');
    var logoImg = logoA && (logoA.querySelector('img.brand-sjt') || logoA.querySelector('img'));
    if(logoA){
      ['display','visibility','opacity','height','alignItems','zIndex','position'].forEach(function(k){});
      setImp(logoA,'display','flex'); setImp(logoA,'align-items','center'); setImp(logoA,'height','100%');
      setImp(logoA,'visibility','visible'); setImp(logoA,'opacity','1'); setImp(logoA,'z-index','10002'); setImp(logoA,'position','relative');
    }
    if(!logoImg){
      // inject a fallback image (desktop asset)
      var img = document.createElement('img');
      img.src = 'assets/img/sjt-logo-transparent.png';
      img.alt = 'SJT';
      img.className = 'brand-sjt';
      if(logoA) logoA.appendChild(img);
      logoImg = img;
    }
    if(logoImg){
      setImp(logoImg,'display','block'); setImp(logoImg,'height','100%'); setImp(logoImg,'width','auto');
      var headerIsShrink = header.classList.contains('shrink') || header.classList.contains('is-scrolled');
      setImp(logoImg,'max-height', headerIsShrink ? '46px' : '64px');
      setImp(logoImg,'mix-blend-mode','normal'); setImp(logoImg,'filter','none'); setImp(logoImg,'opacity','1'); setImp(logoImg,'visibility','visible');
    }
  }
  document.addEventListener('DOMContentLoaded', ensureLogo);
  window.addEventListener('load', ensureLogo);
  window.addEventListener('resize', ensureLogo, {passive:true});
  window.addEventListener('scroll', ensureLogo, {passive:true});
})();
