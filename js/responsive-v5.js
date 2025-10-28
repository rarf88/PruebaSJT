
/* responsive-v5.js — radical mobile/tablet ONLY */
(function(){
  if(!window.matchMedia || !window.matchMedia("(max-width: 991px)").matches) return;
  const root = document.documentElement;
  const header = document.querySelector('.site-header, header, .navbar');

  function setHeaderH(){
    if(!header) return;
    const h = Math.round(header.getBoundingClientRect().height || 64);
    root.style.setProperty('--headerH', h + 'px');
  }
  setHeaderH();

  let raf = null;
  window.addEventListener('scroll', ()=>{
    if(!raf){ raf = requestAnimationFrame(()=>{ setHeaderH(); raf=null; }); }
  }, {passive:true});
  window.addEventListener('resize', ()=>{
    if(!window.matchMedia("(max-width: 991px)").matches) return;
    setHeaderH(); placeMenu(); fitMenuWidth();
  });

  function scrollToWithOffset(el){
    if(!el) return;
    const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (h + 8);
    window.scrollTo({ top:y, behavior:'smooth' });
  }
  window.scrollToWithOffset = scrollToWithOffset;

  const menus = Array.from(document.querySelectorAll('.mobile-menu, .menu-mobile, .drawer, .nav-drawer, .site-header .mobile, nav[role="menu"], [data-mobile-menu="true"]'));
  function placeMenu(){
    const h = parseInt(getComputedStyle(root).getPropertyValue('--headerH')) || 70;
    menus.forEach(menu=>{
      menu.style.top = h + 'px';
      menu.style.maxHeight = `calc(100vh - ${h}px - 16px)`;
    });
  }
  function fitMenuWidth(){
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    menus.forEach(menu=>{
      const items = menu.querySelectorAll('a, .menu-item, li');
      let max = 0;
      items.forEach(el=>{ max = Math.max(max, el.scrollWidth); });
      menu.style.width = Math.min(Math.ceil(max + 32), vw - 32) + 'px';
    });
  }
  placeMenu(); fitMenuWidth();

  Array.from(document.querySelectorAll('.mobile-menu-overlay, .menu-backdrop, .nav-overlay, .drawer-overlay, .backdrop'))
    .forEach(el=>{ el.style.display='none'; el.style.pointerEvents='none'; });

  try{
    if(window.$ && typeof $==='function' && $('.slider').slick){
      $('.slider').slick('slickSetOption', { centerMode:false, centerPadding:'0px' }, true);
    }
  }catch(e){}

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
      scrollToWithOffset(mod);
    }

    document.querySelectorAll('.gestion-item, .btn-gestion, .ver-modulos, .link-ver-modulos, a[data-target^="#modulos"]').forEach(el=>{
      el.addEventListener('click', (ev)=>{
        ev.preventDefault(); ev.stopPropagation();
        const targetId = el.getAttribute('data-target') || (el.getAttribute('href')||'').match(/^#.+/)?.[0];
        showModules(targetId);
      }, true);
    });

    const mo = new MutationObserver(()=>{
      if(mod && mod.offsetParent !== null && ent){
        ent.classList.add('hidden'); ent.style.display='none';
      }
    });
    mo.observe(document.body, {childList:true, subtree:true});
  })();
})();
