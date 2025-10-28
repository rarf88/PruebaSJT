
/* FINAL v9 — ULTRA mobile/tablet self-healing runtime (desktop untouched) */
(function(){
  if(!window.matchMedia || !window.matchMedia("(max-width: 991px)").matches) return;
  const root = document.documentElement;
  const headerSel = '.site-header, header, .navbar';
  const header = document.querySelector(headerSel);

  function setH(){
    if(!header) return;
    const h = Math.round(header.getBoundingClientRect().height || 64);
    root.style.setProperty('--headerH', h + 'px');
    try{ header.style.background = '#106374'; }catch(e){}
  }
  setH();

  // Keep fixing on scroll/resize/hash changes
  let raf=null;
  addEventListener('scroll', ()=>{ if(!raf){ raf=requestAnimationFrame(()=>{ setH(); healMenu(); }); } }, {passive:true});
  addEventListener('resize', ()=>{ if(matchMedia("(max-width:991px)").matches){ setH(); healMenu(); }}, {passive:true});
  addEventListener('hashchange', ()=>{ setTimeout(setH, 0); }, {passive:true});

  // Heal menu positioning/width periodically (handles frameworks that re-render)
  function healMenu(){
    const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    document.querySelectorAll('.mobile-menu, .menu-mobile, .drawer, .nav-drawer, .site-header .mobile, nav[role="menu"], [data-mobile-menu="true"], [class*="offcanvas"], [class*="drawer"]').forEach(menu=>{
      Object.assign(menu.style, {
        position: 'fixed', top: h+'px', left:'0px', right:'auto', transform:'none', maxHeight: `calc(100vh - ${h}px - 16px)`,
        width: 'max-content', maxWidth: 'calc(100% - 32px)', background:'#106374', color:'#fff', display:'inline-block',
        padding:'12px 16px', borderRadius:'10px', zIndex: '9999'
      });
      // width fit to longest item
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
      let max = 0;
      menu.querySelectorAll('a, .menu-item, li').forEach(el=>{ max = Math.max(max, el.scrollWidth); });
      menu.style.width = Math.min(Math.ceil(max + 32), vw - 32) + 'px';
    });
    document.querySelectorAll('.mobile-menu-overlay, .menu-backdrop, .nav-overlay, .drawer-overlay, .backdrop, .overlay, .mask, [class*="offcanvas-backdrop"]').forEach(el=>{
      el.style.display='none'; el.style.pointerEvents='none'; el.style.opacity='0';
    });
  }
  healMenu();
  setInterval(healMenu, 500); // self-heal twice per second

  // Force hero/slider clean — remove pseudo-like overlays added dynamically
  function healHero(){
    document.querySelectorAll('.slider, .carousel, .hero-slider, .home-hero, .hero, .hero-section').forEach(el=>{
      el.style.marginTop = '0';
      el.style.paddingTop = '0';
      el.style.overflow = 'hidden';
    });
  }
  healHero();
  setInterval(healHero, 1000);

  // PRODUCTOS: ensure "Ver módulos" scrolls down and not up
  (function(){
    const mod = document.getElementById('modulos-grid') || document.getElementById('modulos') || document.querySelector('.productos-modulos-below');
    const ent = document.getElementById('entidades') || document.querySelector('.entidades, .entidades-wrap');
    if(!mod) return;

    function showModules(targetId){
      if(ent){ ent.classList.add('hidden'); ent.style.display='none'; }
      if(targetId){
        document.querySelectorAll('.bloque-modulos').forEach(b=>b.classList.add('hidden'));
        const t = document.querySelector(targetId);
        if(t){ t.classList.remove('hidden'); t.style.display=''; }
      }
      mod.classList.remove('hidden'); mod.style.display='';
      const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
      const y = mod.getBoundingClientRect().top + pageYOffset - (h + 8);
      scrollTo({ top:y, behavior:'smooth' });
      try{ history.replaceState(null, '', '#modulos'); }catch(e){}
    }

    // Capture clicks globally
    document.addEventListener('click', (ev)=>{
      const a = ev.target.closest('.gestion-item, .btn-gestion, .ver-modulos, .link-ver-modulos, a[href^="#modulos"], a[data-target^="#modulos"]');
      if(!a) return;
      ev.preventDefault(); ev.stopPropagation();
      const targetId = a.getAttribute('data-target') || (a.getAttribute('href')||'').match(/^#.+/)?.[0];
      showModules(targetId);
    }, true);

    // Keep entities hidden if modules already shown
    const mo = new MutationObserver(()=>{
      if(mod && mod.offsetParent !== null && ent){
        ent.classList.add('hidden'); ent.style.display='none';
      }
    });
    mo.observe(document.body, {childList:true, subtree:true});
  })();

  // Ensure logo never hidden by theme CSS
  function healLogo(){
    document.querySelectorAll('.site-header .logo, .site-header .logo-link, .logo, .logo-mobile, .brand, .brand-logo').forEach(el=>{
      el.style.display='block'; el.style.visibility='visible'; el.style.opacity='1';
      const img = el.querySelector('img');
      if(img){ img.style.maxHeight='46px'; img.style.height='auto'; img.style.width='auto'; img.style.objectFit='contain'; }
    });
  }
  healLogo();
  setInterval(healLogo, 800);
})();
