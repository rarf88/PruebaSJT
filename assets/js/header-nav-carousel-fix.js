(function(){function ready(fn){if(document.readyState!='loading'){fn()}else document.addEventListener('DOMContentLoaded',fn);}ready(function(){
  var header=document.querySelector('header, .navbar, .site-header'); if(!header) return;
  if(!document.getElementById('sjt-hamburger')){
    var btn=document.createElement('button'); btn.id='sjt-hamburger'; btn.setAttribute('aria-label','Abrir menú');
    btn.innerHTML='<span class="bar"></span><span class="bar"></span><span class="bar"></span>'; header.appendChild(btn);
    var drawer=document.createElement('nav'); drawer.id='sjt-mobile-drawer'; document.body.appendChild(drawer);
    var scrim=document.createElement('div'); scrim.id='sjt-mobile-scrim'; document.body.appendChild(scrim);
    var navUL=document.querySelector('header nav ul, .navbar nav ul, .main-menu ul, nav ul, header nav, nav');
    if(navUL){drawer.innerHTML='<h3 style="margin:0 0 10px 0;font-weight:700;">Menú</h3>'; navUL.querySelectorAll('a').forEach(function(a){var cl=a.cloneNode(true);cl.removeAttribute('class');/* SJT: strip any possible logos/brands from the cloned mobile drawer */
    (function(pr){
      try{
        var selectors = ['.logo','.brand','.site-logo','.navbar-brand','a.logo','a.brand','img[alt*="logo" i]','picture img[alt*="logo" i]'];
        selectors.forEach(function(sel){
          pr.querySelectorAll(sel).forEach(function(node){
            if (node.tagName === 'IMG' && (node.width <= 32 || node.height <= 32)) return;
            if (node && node.parentNode) node.parentNode.removeChild(node);
          });
        });
        pr.querySelectorAll('.logo-wrap, .brand-wrap, h1.logo, h2.logo, h3.logo').forEach(function(w){
          if (w && w.parentNode) w.parentNode.removeChild(w);
        });
      }catch(e){}
    })(cl);
    drawer.appendChild(cl);});}
    function open(){drawer.classList.add('open');scrim.classList.add('show');}
    function close(){drawer.classList.remove('open');scrim.classList.remove('show');}
    btn.addEventListener('click',open); scrim.addEventListener('click',close); drawer.addEventListener('click',function(e){if(e.target.tagName==='A') close();});
  }
  // v3 hide stray short nav text (e.g. PRODUC) on mobile
  function hideStray(){if(window.matchMedia('(max-width: 991px)').matches){var h=document.querySelector('header, .navbar, .site-header'); if(!h) return; h.querySelectorAll('*').forEach(function(el){var t=(el.textContent||'').trim(); if(t && t.length<=10 && /PRODUC|PRODU|SERVI|MENU/i.test(t)){el.style.display='none';}});}}
  hideStray(); window.addEventListener('resize', hideStray);
});})();