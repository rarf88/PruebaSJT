
/* v13.3 — HEADER FIX ONLY runtime */
(function(){
  if(!matchMedia('(max-width:991px)').matches) return;

  // Force-hide any legacy headers/menus (double safety with CSS)
  document.querySelectorAll('.site-header, header, .navbar').forEach(el=>{
    el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0';
    el.style.pointerEvents='none'; el.style.position='static'; el.style.height='0'; el.style.overflow='hidden';
  });
  document.querySelectorAll('.mobile-menu, .menu-mobile, .drawer, .nav-drawer, .mobile-menu-overlay, .menu-backdrop, .nav-overlay, .drawer-overlay').forEach(el=>{
    el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; el.style.pointerEvents='none';
  });

  // Ensure logo present (fallback: try to reuse any logo image present in DOM)
  const logo = document.getElementById('mobi-logo');
  if(logo && !logo.src){
    const candidate = document.querySelector('img[src*="logo"], img[alt*="logo" i]');
    if(candidate){ logo.src = candidate.currentSrc || candidate.src; }
  }

  // Build menu links if empty
  const menu = document.getElementById('mobi-menu');
  if(menu && menu.childElementCount === 0){
    const items = [
      ['index.html','INICIO'],
      ['productos.html','PRODUCTOS'],
      ['servicios.html','SERVICIOS'],
      ['nosotros.html','NOSOTROS'],
      ['casos-de-exito.html','CASOS DE ÉXITO'],
      ['index.html#contacto','CONTÁCTENOS']
    ];
    items.forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  }

  // Burger toggle
  const burger = document.getElementById('mobi-burger');
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let maxW = 0; menu.querySelectorAll('a').forEach(a=>{ maxW = Math.max(maxW, a.scrollWidth); });
    menu.style.width = Math.min(Math.ceil(maxW + 32), vw - 24) + 'px';
  }
  if(burger && menu){
    burger.addEventListener('click', ()=>{
      const open = getComputedStyle(menu).display !== 'none';
      if(open){
        menu.style.display='none'; document.body.classList.remove('mobi-menu-open');
      }else{
        menu.style.display='inline-block'; fitMenuWidth(); document.body.classList.add('mobi-menu-open');
      }
    });
  }
})();



/* v13.4 — header height sync + explicit logo + menu width fit */
(function(){
  if(!matchMedia('(max-width:991px)').matches) return;

  const header = document.getElementById('mobi-header');
  const menu   = document.getElementById('mobi-menu');
  const burger = document.getElementById('mobi-burger');

  // 1) Sincroniza padding-top con la altura real del header (Chrome visualViewport)
  function syncHeaderPadding(){
    if(!header) return;
    const h = Math.round(header.getBoundingClientRect().height || 72);
    document.body.style.paddingTop = h + 'px';
    if(menu){ menu.style.top = h + 'px'; }
  }
  syncHeaderPadding();
  addEventListener('resize', ()=>{ if(matchMedia('(max-width:991px)').matches){ syncHeaderPadding(); fitMenuWidth(); } }, {passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize', syncHeaderPadding, {passive:true});
    visualViewport.addEventListener('scroll', syncHeaderPadding, {passive:true});
  }

  // 2) Fuerza el logo del escritorio si el src está vacío o dice "logo"
  (function ensureLogo(){
    const img = document.getElementById('mobi-logo');
    if(!img) return;
    const invalid = !img.src || /(^$|^data:|logo$|\/logo$|=logo$)/i.test(img.src) || (img.getAttribute('src')||'').trim()==='' ;
    if(invalid){
      // Ruta conocido del logo de escritorio (ajústala si tu build usa otra)
      img.src = 'img/header_logo_nav.webp';
    }
  })();

  // 3) Menú: ancho máximo al item más largo
  function fitMenuWidth(){
    if(!menu) return;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0;
    menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.scrollWidth); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function toggleMenu(){
    const open = getComputedStyle(menu).display !== 'none';
    if(open){
      menu.style.display = 'none';
      document.body.classList.remove('mobi-menu-open');
    }else{
      menu.style.display = 'inline-block';
      fitMenuWidth();
      document.body.classList.add('mobi-menu-open');
    }
  }
  burger && burger.addEventListener('click', toggleMenu);
  addEventListener('orientationchange', ()=>{ setTimeout(()=>{ syncHeaderPadding(); fitMenuWidth(); }, 50); }, {passive:true});

  // 4) Si el menú está vacío, rehidratar
  if(menu && menu.childElementCount===0){
    const items = [
      ['index.html','INICIO'],
      ['productos.html','PRODUCTOS'],
      ['servicios.html','SERVICIOS'],
      ['nosotros.html','NOSOTROS'],
      ['casos-de-exito.html','CASOS DE ÉXITO'],
      ['index.html#contacto','CONTÁCTENOS']
    ];
    items.forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
    fitMenuWidth();
  }
})();
