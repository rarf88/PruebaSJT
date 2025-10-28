
/* v14.1 — MOBILE/TABLET ONLY runtime. Desktop no se toca. */
(function(){
  const mq = matchMedia('(max-width:991px)');
  if(!mq.matches) return;

  // Construir header/menu en tiempo de ejecución (DOM desktop limpio)
  const body = document.body;
  const header = document.createElement('div'); header.id = 'mobi-header';
  const brand = document.createElement('a'); brand.className = 'brand'; brand.href = 'index.html';
  const logo  = document.createElement('img'); logo.id = 'mobi-logo'; logo.alt = 'Grupo AAA Asesores'; logo.src = 'img/header_logo_nav.webp';
  brand.appendChild(logo);
  const burger = document.createElement('button'); burger.id = 'mobi-burger'; burger.setAttribute('aria-label','Abrir menú');
  const bar = document.createElement('span'); burger.appendChild(bar);
  header.appendChild(brand); header.appendChild(burger);
  body.prepend(header);
  body.classList.add('mobi-has-header');

  const menu = document.createElement('nav'); menu.id = 'mobi-menu'; menu.setAttribute('role','menu'); menu.setAttribute('aria-label','Menú móvil');
  [['index.html','INICIO'],['productos.html','PRODUCTOS'],['servicios.html','SERVICIOS'],['nosotros.html','NOSOTROS'],['casos-de-exito.html','CASOS DE ÉXITO'],['index.html#contacto','CONTÁCTENOS']]
    .forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  body.appendChild(menu);

  function ensureHeaderPadding(){
    const h = Math.round(header.getBoundingClientRect().height || 72);
    body.style.paddingTop = h + 'px';
    menu.style.top = h + 'px';
    logo.style.maxHeight = (h - 10) + 'px';
  }
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
  addEventListener('resize', ()=>{ if(mq.matches){ ensureHeaderPadding(); fitMenuWidth(); } }, {passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize', ensureHeaderPadding, {passive:true});
    visualViewport.addEventListener('scroll', ensureHeaderPadding, {passive:true});
  }

  // Neutralizar headers/menús antiguos solo en móvil
  ['click','touchstart'].forEach(evt=>{
    window.addEventListener(evt, function(e){
      if(e.target.closest('.site-header, header, .navbar, .mobile-menu, .menu-mobile, .drawer, .nav-drawer')){
        e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault();
      }
    }, true);
  });

  // Primera verificación
  requestAnimationFrame(()=>{ ensureHeaderPadding(); fitMenuWidth(); });
})();
