
/* vR1 — Mobile/Tablet runtime only */
(function(){
  const mq = matchMedia('(max-width:991px)');
  if(!mq.matches) return;

  // Build fresh header/menu
  const body = document.body;
  if(document.getElementById('r1-header')) return; // avoid duplicates

  const header = document.createElement('div'); header.id = 'r1-header';
  const brand = document.createElement('a'); brand.className = 'brand'; brand.href = 'index.html';
  const logo  = document.createElement('img'); logo.id = 'r1-logo'; logo.alt = 'Grupo AAA Asesores';
  logo.src = 'img/header_logo_nav.webp';
  logo.onerror = function(){
    const fb = document.querySelector('img[src*="logo"], img[alt*="logo" i]');
    if(fb){ logo.src = fb.currentSrc || fb.src; }
  };
  brand.appendChild(logo);
  const burger = document.createElement('button'); burger.id = 'r1-burger'; burger.setAttribute('aria-label','Abrir menú');
  const bar = document.createElement('span'); burger.appendChild(bar);
  header.appendChild(brand); header.appendChild(burger);
  body.prepend(header);
  body.classList.add('r1-has-header');

  const menu = document.createElement('nav'); menu.id = 'r1-menu'; menu.setAttribute('role','menu'); menu.setAttribute('aria-label','Menú móvil');
  [['index.html','INICIO'],['productos.html','PRODUCTOS'],['servicios.html','SERVICIOS'],['nosotros.html','NOSOTROS'],['casos-de-exito.html','CASOS DE ÉXITO'],['index.html#contacto','CONTÁCTENOS']]
    .forEach(([href,text])=>{ const a=document.createElement('a'); a.href=href; a.textContent=text; menu.appendChild(a); });
  body.appendChild(menu);

  function syncHeader(){
    const h = Math.round(header.getBoundingClientRect().height || 72);
    document.documentElement.style.setProperty('--r1h', h + 'px');
    body.style.paddingTop = h + 'px';
    menu.style.top = h + 'px';
    logo.style.maxHeight = (h - 10) + 'px';
    logo.style.width = 'auto';
  }
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let max = 0; menu.querySelectorAll('a').forEach(a=>{ max = Math.max(max, a.getBoundingClientRect().width); });
    menu.style.width = Math.min(Math.ceil(max + 28), vw - 24) + 'px';
  }
  function openMenu(){ menu.style.display='inline-block'; fitMenuWidth(); body.classList.add('r1-menu-open'); }
  function closeMenu(){ menu.style.display='none'; body.classList.remove('r1-menu-open'); }
  function toggleMenu(e){ e && (e.preventDefault(), e.stopPropagation()); (getComputedStyle(menu).display!=='none') ? closeMenu() : openMenu(); }
  burger.addEventListener('click', toggleMenu, true);
  document.addEventListener('click', (e)=>{ if(e.target.closest('#r1-menu')||e.target.closest('#r1-burger')) return; closeMenu(); }, true);

  // Productos: "Ver módulos" -> scroll a #modulos/#modules con offset header
  function scrollToModules(){
    const anchor = document.querySelector('#modulos, #modules');
    if(!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--r1h')) || 72;
    const y = rect.top + window.scrollY - (h + 8);
    window.scrollTo({ top:y, behavior:'smooth' });
  }
  document.addEventListener('click', (e)=>{
    const t = e.target; if(!t) return;
    const text = (t.textContent||'').trim().toLowerCase();
    if(text.includes('ver módulo') || text.includes('ver modulos') || text.includes('ver módulos')){
      e.preventDefault(); e.stopPropagation(); scrollToModules();
    }
    if(t.matches('.chip, .entity, .chip-pill, .entidad-chip, [data-entidad]')){
      setTimeout(scrollToModules, 60);
    }
  }, true);

  // Recalc on viewport/orientation changes
  function recalc(){ syncHeader(); fitMenuWidth(); }
  requestAnimationFrame(recalc);
  addEventListener('resize', ()=>{ if(mq.matches){ recalc(); } }, {passive:true});
  if(window.visualViewport){
    visualViewport.addEventListener('resize', recalc, {passive:true});
    visualViewport.addEventListener('scroll', recalc, {passive:true});
  }
})();
