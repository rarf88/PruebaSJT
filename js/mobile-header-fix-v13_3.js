
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
