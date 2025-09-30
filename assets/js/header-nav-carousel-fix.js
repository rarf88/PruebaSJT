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

// v18: runtime safety — force logo visible on mobile/tablet and inject fallback if missing
(function(){
  function imp(el, p, v){ try{ el && el.style && el.style.setProperty(p, v, 'important'); }catch(e){} }
  function fixLogo(){
    var mq = window.matchMedia('(max-width:1024px)'); if(!mq.matches) return;
    var header = document.querySelector('header.site-header'); if(!header) return;
    var nav = header.querySelector('.nav') || header;
    var aLogo = nav.querySelector('a.logo') || header.querySelector('a.logo');
    if(aLogo){
      imp(aLogo,'display','flex'); imp(aLogo,'align-items','center'); imp(aLogo,'height','100%');
      imp(aLogo,'visibility','visible'); imp(aLogo,'opacity','1'); imp(aLogo,'z-index','10002'); imp(aLogo,'position','relative');
      var img = aLogo.querySelector('img');
      if(!img){
        img = document.createElement('img');
        img.src = 'assets/img/sjt-logo-transparent.png';
        img.alt = 'SJT';
        aLogo.appendChild(img);
      }
      var isShrink = header.classList.contains('shrink') || header.classList.contains('is-scrolled');
      imp(img,'display','block'); imp(img,'height','100%'); imp(img,'width','auto'); imp(img,'max-height', isShrink ? '46px' : '64px');
      imp(img,'mix-blend-mode','normal'); imp(img,'filter','none'); imp(img,'opacity','1'); imp(img,'visibility','visible');
    }
  }
  document.addEventListener('DOMContentLoaded', fixLogo);
  window.addEventListener('load', fixLogo);
  window.addEventListener('resize', fixLogo, {passive:true});
  window.addEventListener('scroll', fixLogo, {passive:true});
})();
