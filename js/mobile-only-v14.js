
/* v14 — MOBILE/TABLET ONLY runtime. Desktop remains untouched. */
(function(){
  const mq = matchMedia('(max-width:991px)');
  if(!mq.matches) return; // Guard: only mobile/tablet

  // Build header/menu entirely at runtime (so desktop DOM stays pristine)
  const body = document.body;
  const header = document.createElement('div'); header.id = 'mobi-header';
  const brand = document.createElement('a'); brand.className = 'brand'; brand.href = 'index.html';
  const logo  = document.createElement('img'); logo.id = 'mobi-logo'; logo.alt = 'Grupo AAA Asesores';
  // Force known desktop logo path; adjust if your build uses a different file
  logo.src = 'img/header_logo_nav.webp';
  brand.appendChild(logo);
  const burger = document.createElement('button'); burger.id = 'mobi-burger'; burger.setAttribute('aria-label','Abrir menú');
  const bar = document.createElement('span'); burger.appendChild(bar);
  header.appendChild(brand); header.appendChild(burger);
  body.prepend(header);
  body.classList.add('mobi-has-header');

  const menu = document.createElement('nav'); menu.id = 'mobi-menu'; menu.setAttribute('role','menu'); menu.setAttribute('aria-label','Menú móvil');
  const items = [['index.html','INICIO'],['productos.html','PRODUCTOS'],['servicios.html','SERVICIOS'],['nosotros.html','NOSOTROS'],['casos-de-exito.html','CASOS DE ÉXITO'],['index.html#contacto','CONTÁCTENOS']];
  items.forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  body.appendChild(menu);

  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0; menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.scrollWidth); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function openMenu(){ menu.style.display='inline-block'; fitMenuWidth(); body.classList.add('mobi-menu-open'); }
  function closeMenu(){ menu.style.display='none'; body.classList.remove('mobi-menu-open'); }
  function toggleMenu(e){ e && (e.preventDefault(), e.stopPropagation()); (getComputedStyle(menu).display!=='none') ? closeMenu() : openMenu(); }

  burger.addEventListener('click', toggleMenu, true);
  document.addEventListener('click', (e)=>{ if(e.target.closest('#mobi-menu')||e.target.closest('#mobi-burger')) return; closeMenu(); }, true);
  addEventListener('resize', ()=>{ if(mq.matches){ fitMenuWidth(); } }, {passive:true});

  // Safety: neutralize old headers/menus on mobile only
  ['click','touchstart'].forEach(evt=>{
    window.addEventListener(evt, function(e){
      if(e.target.closest('.site-header, header, .navbar, .mobile-menu, .menu-mobile, .drawer, .nav-drawer')){
        e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault();
      }
    }, true);
  });
})();
