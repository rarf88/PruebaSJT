
/* FINAL v8 — INLINE MOBILE/TABLET BEHAVIOR */
(function(){
  if(!window.matchMedia || !window.matchMedia("(max-width: 991px)").matches) return;
  const root = document.documentElement;
  const header = document.querySelector('.site-header, header, .navbar');

  function setHeaderH(){
    if(!header) return;
    const h = Math.round(header.getBoundingClientRect().height || 64);
    root.style.setProperty('--headerH', h + 'px');
    try{ header.style.background = '#106374'; }catch(e){}
  }
  setHeaderH();
  let raf=null;
  addEventListener('scroll', ()=>{ if(!raf){ raf=requestAnimationFrame(()=>{ setHeaderH(); raf=null; }); } }, {passive:true});
  addEventListener('resize', ()=>{ if(matchMedia("(max-width:991px)").matches){ setHeaderH(); placeMenu(); fitMenuWidth(); }}, {passive:true});

  // MENU
  const menus = Array.from(document.querySelectorAll('.mobile-menu, .menu-mobile, .drawer, .nav-drawer, .site-header .mobile, nav[role="menu"], [data-mobile-menu="true"]'));
  function placeMenu(){
    const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    menus.forEach(m=>{ m.style.top = h + 'px'; m.style.maxHeight = `calc(100vh - ${h}px - 16px)`; m.style.background='#106374'; m.style.color='#fff'; });
  }
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, innerWidth||0);
    menus.forEach(m=>{
      const items = m.querySelectorAll('a, .menu-item, li');
      let max = 0; items.forEach(el=>{ max = Math.max(max, el.scrollWidth); });
      m.style.width = Math.min(Math.ceil(max + 32), vw - 32) + 'px';
    });
  }
  placeMenu(); fitMenuWidth();
  document.querySelectorAll('.mobile-menu-overlay, .menu-backdrop, .nav-overlay, .drawer-overlay, .backdrop, .overlay, .mask')
    .forEach(el=>{ el.style.display='none'; el.style.pointerEvents='none'; });

  // SLIDER (si usa Slick)
  try{ if(window.$ && typeof $==='function' && $('.slider').slick){ $('.slider').slick('slickSetOption', { centerMode:false, centerPadding:'0px' }, true); } }catch(e){}

  // PRODUCTOS: “Ver módulos” -> mostrar módulos y bajar
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

    document.addEventListener('click', (ev)=>{
      const a = ev.target.closest('.gestion-item, .btn-gestion, .ver-modulos, .link-ver-modulos, a[href^="#modulos"], a[data-target^="#modulos"]');
      if(!a) return;
      ev.preventDefault(); ev.stopPropagation();
      const targetId = a.getAttribute('data-target') || (a.getAttribute('href')||'').match(/^#.+/)?.[0];
      showModules(targetId);
    }, true);

    const mo = new MutationObserver(()=>{
      if(mod && mod.offsetParent !== null && ent){
        ent.classList.add('hidden'); ent.style.display='none';
      }
    });
    mo.observe(document.body, {childList:true, subtree:true});
  })();
})();
