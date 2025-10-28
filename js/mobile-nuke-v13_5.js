
/* v13.5 — FULL NUKE runtime */
(function(){
  if(!matchMedia('(max-width:991px)').matches) return;

  // Kill legacy handlers on capture phase
  ['click','touchstart'].forEach(evt=>{
    window.addEventListener(evt, function(e){
      if(e.target.closest('.site-header, header, .navbar, .mobile-menu, .menu-mobile, .drawer, .nav-drawer')){
        e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault();
      }
    }, true);
  });
  // Hard hide legacy
  document.querySelectorAll('.site-header, header, .navbar, .topbar, .site-nav, .nav, .main-nav').forEach(el=>{
    el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; el.style.pointerEvents='none';
    el.style.height='0'; el.style.overflow='hidden'; el.style.position='static';
  });
  document.querySelectorAll('.mobile-menu, .menu-mobile, .drawer, .nav-drawer, .offcanvas, [class*="offcanvas"], .overlay, .mask, .backdrop, .mobile-menu-overlay, .menu-backdrop, .nav-overlay, .drawer-overlay, [class*="backdrop"]').forEach(el=>{
    el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; el.style.pointerEvents='none';
  });

  // Force logo src + link
  const brandLink = document.querySelector('#mobi-header .brand');
  const logo = document.getElementById('mobi-logo');
  if(brandLink) brandLink.setAttribute('href', 'index.html');
  if(logo){
    if(!logo.src || /(^$|^data:|logo$|\/logo$|=logo$)/i.test(logo.src)){ logo.src = 'img/header_logo_nav.webp'; }
    logo.alt = 'Grupo AAA Asesores';
  }

  // Build menu if empty
  const menu = document.getElementById('mobi-menu');
  if(menu && menu.childElementCount===0){
    [['index.html','INICIO'],['productos.html','PRODUCTOS'],['servicios.html','SERVICIOS'],['nosotros.html','NOSOTROS'],['casos-de-exito.html','CASOS DE ÉXITO'],['index.html#contacto','CONTÁCTENOS']]
      .forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  }

  // Burger toggle + width fit
  const burger = document.getElementById('mobi-burger');
  function fitMenuWidth(){
    if(!menu) return;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0; menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.scrollWidth); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function toggleMenu(e){
    e && (e.preventDefault(), e.stopPropagation());
    const open = getComputedStyle(menu).display !== 'none';
    if(open){ menu.style.display='none'; document.body.classList.remove('mobi-menu-open'); }
    else{ menu.style.display='inline-block'; fitMenuWidth(); document.body.classList.add('mobi-menu-open'); }
  }
  burger && burger.addEventListener('click', toggleMenu, true);
  document.addEventListener('click', (e)=>{ if(e.target.closest('#mobi-menu') || e.target.closest('#mobi-burger')) return; menu.style.display='none'; document.body.classList.remove('mobi-menu-open'); }, true);
  addEventListener('resize', ()=>{ if(matchMedia('(max-width:991px)').matches){ fitMenuWidth(); } }, {passive:true});
})();
