
/* v16 — Minimal mobile/tablet JS. Desktop jamás ejecuta. */
(function(){
  const mq = matchMedia('(max-width:991px)');
  if(!mq.matches) return;

  // No tocamos headers/menus existentes; solo añadimos uno por encima, sin romper nada.
  const body = document.body;

  // Evitar duplicados si se recarga/inyecta otra vez
  if(document.getElementById('m16-header')) return;

  const header = document.createElement('div'); header.id = 'm16-header';
  const brand = document.createElement('a'); brand.className = 'm16-brand'; brand.href = 'index.html';
  const logo  = document.createElement('img'); logo.id = 'm16-logo'; logo.alt = 'Grupo AAA Asesores';
  // Intentar usar el logo oficial; si falla, buscar cualquier <img> con "logo"
  logo.src = 'img/header_logo_nav.webp';
  logo.onerror = function(){
    const fallback = document.querySelector('img[src*=\"logo\"], img[alt*=\"logo\" i]');
    if(fallback){ logo.src = fallback.currentSrc || fallback.src; }
  };
  brand.appendChild(logo);
  const burger = document.createElement('button'); burger.id = 'm16-burger'; burger.setAttribute('aria-label','Abrir menú');
  const bar = document.createElement('span'); burger.appendChild(bar);
  header.appendChild(brand); header.appendChild(burger);
  body.prepend(header);
  body.classList.add('m16-has-header');

  const menu = document.createElement('nav'); menu.id = 'm16-menu'; menu.setAttribute('role','menu'); menu.setAttribute('aria-label','Menú móvil');
  [['index.html','INICIO'],['productos.html','PRODUCTOS'],['servicios.html','SERVICIOS'],['nosotros.html','NOSOTROS'],['casos-de-exito.html','CASOS DE ÉXITO'],['index.html#contacto','CONTÁCTENOS']]
    .forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  body.appendChild(menu);

  function syncHeader(){
    const h = Math.round(header.getBoundingClientRect().height || 72);
    document.documentElement.style.setProperty('--m16h', h + 'px');
    body.style.paddingTop = h + 'px';
    menu.style.top = h + 'px';
    logo.style.maxHeight = (h - 10) + 'px';
    logo.style.width = 'auto';
  }
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0;
    menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.getBoundingClientRect().width); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function openMenu(){ menu.style.display='inline-block'; fitMenuWidth(); body.classList.add('m16-menu-open'); }
  function closeMenu(){ menu.style.display='none'; body.classList.remove('m16-menu-open'); }
  function toggleMenu(e){ e && (e.preventDefault(), e.stopPropagation()); (getComputedStyle(menu).display!=='none') ? closeMenu() : openMenu(); }

  burger.addEventListener('click', toggleMenu, true);
  document.addEventListener('click', (e)=>{ if(e.target.closest('#m16-menu')||e.target.closest('#m16-burger')) return; closeMenu(); }, true);

  // Recalcular ante cambios de viewport
  function recalc(){ syncHeader(); fitMenuWidth(); }
  requestAnimationFrame(recalc);
  addEventListener('resize', ()=>{ if(mq.matches){ recalc(); } }, {passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize', recalc, {passive:true});
    visualViewport.addEventListener('scroll', recalc, {passive:true});
  }
})();
