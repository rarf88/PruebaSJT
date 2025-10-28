
/* v15 — MOBILE/TABLET ONLY runtime */
(function(){
  const mq = matchMedia('(max-width:991px)');
  if(!mq.matches) return; // No corre en desktop

  // 0) Matar handlers de menús/headers antiguos en captura (no vuelven interferir)
  ['click','touchstart'].forEach(evt=>{
    window.addEventListener(evt, function(e){
      if(e.target.closest('.site-header, header, .navbar, .mobile-menu, .menu-mobile, .drawer, .nav-drawer')){
        e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault();
      }
    }, true);
  });

  // 1) Construir nuestro header y menú
  const body = document.body;
  const header = document.createElement('div'); header.id = 'mobi-header';
  const brand = document.createElement('a'); brand.className = 'brand'; brand.href = 'index.html';
  const logo  = document.createElement('img'); logo.id = 'mobi-logo'; logo.alt = 'Grupo AAA Asesores';
  // Ruta de logo: fuerza la de escritorio; si falla, usa el primer <img> que contenga "logo"
  const fallback = (document.querySelector('img[src*="logo"], img[alt*="logo" i]')||{});
  logo.src = 'img/header_logo_nav.webp';
  logo.onerror = function(){ if(fallback && (fallback.currentSrc||fallback.src)) logo.src = fallback.currentSrc || fallback.src; };
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

  function syncHeader(){
    const h = Math.round(header.getBoundingClientRect().height || 72);
    document.documentElement.style.setProperty('--mobi-h', h + 'px');
    body.style.paddingTop = h + 'px';
    menu.style.top = h + 'px';
    logo.style.maxHeight = (h - 10) + 'px';
  }
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0;
    menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.getBoundingClientRect().width); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function openMenu(){ menu.style.display='inline-block'; fitMenuWidth(); body.classList.add('mobi-menu-open'); }
  function closeMenu(){ menu.style.display='none'; body.classList.remove('mobi-menu-open'); }
  function toggleMenu(e){ e && (e.preventDefault(), e.stopPropagation()); (getComputedStyle(menu).display!=='none') ? closeMenu() : openMenu(); }

  burger.addEventListener('click', toggleMenu, true);
  document.addEventListener('click', (e)=>{ if(e.target.closest('#mobi-menu')||e.target.closest('#mobi-burger')) return; closeMenu(); }, true);

  // 2) Productos: “Ver módulos” baja a #modulos (compensa header)
  function scrollToModules(){
    const anchor = document.querySelector('#modulos, #modules');
    if(!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const y = rect.top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobi-h'))||72) - 8;
    window.scrollTo({ top:y, behavior:'smooth' });
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(!t) return;
    const text = (t.textContent||'').trim().toLowerCase();
    if(text.includes('ver módulo') || text.includes('ver modulos') || text.includes('ver módulos')){
      e.preventDefault(); e.stopPropagation(); scrollToModules();
    }
    if(t.matches('.chip, .entity, .chip-pill, .entidad-chip, [data-entidad]')){
      // si chips disparan módulos
      setTimeout(scrollToModules, 60);
    }
  }, true);

  // 3) Slider: quitar paddings/óvalos residuales (si hay librerías, respeta sus APIs)
  try{
    if(window.$ && typeof $ === 'function'){
      if($('.slider').slick){ $('.slider').slick('slickSetOption',{ arrows:true, dots:true }, true); }
    }
  }catch(_){}

  // 4) Recalcular en cambios de viewport/orientación (Chrome/Safari)
  function recalc(){ syncHeader(); fitMenuWidth(); }
  requestAnimationFrame(recalc);
  addEventListener('resize', ()=>{ if(mq.matches){ recalc(); } }, {passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize', recalc, {passive:true});
    visualViewport.addEventListener('scroll', recalc, {passive:true});
  }
})();
