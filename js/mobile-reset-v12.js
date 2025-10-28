
(function(){
  if(!matchMedia('(max-width:991px)').matches) return;

  // 1) Disable old responsive stylesheets to avoid conflicts
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link=>{
    const m = (link.media||'').toLowerCase();
    if(m.includes('max-width') || m.includes('handheld') || m.includes('mobile')){
      try{ link.disabled = true; }catch(e){}
    }
  });

  // 2) Build clean mobile header & menu
  const mh = document.getElementById('mobi-header'), mm = document.getElementById('mobi-menu');
  if(mh) mh.style.display = 'flex';

  // 2a) Logo: take first desktop brand logo
  const logo = document.querySelector('.site-header img, header img, .navbar img, img[src*="logo"], img[alt*="logo" i]');
  const mobiLogo = document.getElementById('mobi-logo');
  if(logo && mobiLogo && !mobiLogo.src){ mobiLogo.src = logo.currentSrc || logo.src; }

  // 2b) Menu links: clone from existing nav OR fallback to standard list
  function addLink(href, text){ const a=document.createElement('a'); a.href=href; a.textContent=text; mm.appendChild(a); }
  (function hydrateMenu(){
    const nav = document.querySelector('nav, .menu, .site-nav, .navbar nav');
    const links = nav ? Array.from(nav.querySelectorAll('a')) : [];
    const uniq = new Set();
    links.forEach(a=>{
      const href=a.getAttribute('href')||'#', text=(a.textContent||'').trim();
      if(!text || uniq.has(text+href)) return;
      uniq.add(text+href); addLink(href, text);
    });
    if(mm.childElementCount===0){
      addLink('/', 'INICIO'); addLink('/productos.html','PRODUCTOS'); addLink('/servicios.html','SERVICIOS');
      addLink('/nosotros.html','NOSOTROS'); addLink('/casos-de-exito.html','CASOS DE ÉXITO'); addLink('/contacto.html','CONTÁCTENOS');
    }
  })();

  // 2c) Burger toggle
  const burger = document.getElementById('mobi-burger');
  burger && burger.addEventListener('click', ()=>{
    const open = getComputedStyle(mm).display!=='none';
    mm.style.display = open ? 'none' : 'inline-block';
  });

  // 3) Products: force scroll to modules on click and prevent "jump back"
  (function(){
    const mod = document.getElementById('modulos-grid') || document.getElementById('modulos') || document.querySelector('.productos-modulos-below');
    const ent = document.getElementById('entidades') || document.querySelector('.entidades, .entidades-wrap');
    function goModules(targetId){
      if(ent){ ent.style.display='none'; ent.classList.add('hidden'); }
      if(targetId){
        document.querySelectorAll('.bloque-modulos').forEach(b=>b.classList.add('hidden'));
        const t = document.querySelector(targetId);
        if(t){ t.classList.remove('hidden'); t.style.display='block'; }
      }
      if(mod){
        mod.style.display='block';
        const y = mod.getBoundingClientRect().top + pageYOffset - (64 + 8);
        setTimeout(()=>{ scrollTo({ top:y, behavior:'smooth' }); }, 30);
        try{ history.replaceState(null,'','#modulos'); }catch(e){}
      }
    }
    document.addEventListener('click', (ev)=>{
      const a = ev.target.closest('.gestion-item, .btn-gestion, .ver-modulos, .link-ver-modulos, a[href^="#modulos"], a[data-target^="#modulos"]');
      if(!a) return;
      ev.preventDefault(); ev.stopPropagation();
      goModules(a.getAttribute('data-target') || (a.getAttribute('href')||'').match(/^#.+/)?.[0]);
    }, true);
  })();

  // 4) Slider (Slick): remove center paddings if present
  try{ if(window.$ && $('.slider').slick){ $('.slider').slick('slickSetOption',{centerMode:false,centerPadding:'0px'},true); } }catch(e){}
})();



// v12.r2 runtime additions
(function(){
  if(!matchMedia('(max-width:991px)').matches) return;

  // 0) Safe-area aware header height
  const mh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mh')) || 64;

  // 1) Menu toggle -> lock body scroll & auto-fit width
  const menu  = document.getElementById('mobi-menu');
  const burger = document.getElementById('mobi-burger');
  function fitMenuWidth(){
    if(!menu) return;
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth||0);
    let maxW = 0;
    menu.querySelectorAll('a').forEach(a=>{ maxW = Math.max(maxW, a.scrollWidth); });
    menu.style.width = Math.min(Math.ceil(maxW + 32), vw - 24) + 'px';
  }
  if(burger && menu){
    burger.addEventListener('click', ()=>{
      const isOpen = getComputedStyle(menu).display !== 'none';
      if(isOpen){
        menu.style.display = 'none';
        document.body.classList.remove('mobi-menu-open');
      }else{
        menu.style.display = 'inline-block';
        fitMenuWidth();
        document.body.classList.add('mobi-menu-open');
      }
    });
  }
  addEventListener('resize', ()=>{ if(matchMedia('(max-width:991px)').matches){ fitMenuWidth(); } }, {passive:true});

  // 2) Slider (Slick) hard reset options if present
  try{ if(window.$ && $('.slider').slick){ $('.slider').slick('slickSetOption',{centerMode:false,centerPadding:'0px',arrows:false,dots:true},true); } }catch(e){}

  // 3) Productos: make entities->modules robust
  (function(){
    const mod = document.getElementById('modulos-grid') || document.getElementById('modulos') || document.querySelector('.productos-modulos-below');
    const ent = document.getElementById('entidades') || document.querySelector('.entidades, .entidades-wrap');
    function goModules(targetId){
      if(ent){ ent.style.display='none'; ent.classList.add('hidden'); }
      if(targetId){
        document.querySelectorAll('.bloque-modulos').forEach(b=>b.classList.add('hidden'));
        const t = document.querySelector(targetId); if(t){ t.classList.remove('hidden'); t.style.display='block'; }
      }
      if(mod){
        mod.style.display='block';
        const y = mod.getBoundingClientRect().top + pageYOffset - (mh + 8);
        setTimeout(()=>{ scrollTo({ top:y, behavior:'smooth' }); }, 10);
        try{ history.replaceState(null,'','#modulos'); }catch(e){}
      }
    }
    document.addEventListener('click', (ev)=>{
      const a = ev.target.closest('.gestion-item, .btn-gestion, .ver-modulos, .link-ver-modulos, a[href^="#modulos"], a[data-target^="#modulos"], .entity, .entidad-chip');
      if(!a) return;
      const href = a.getAttribute('href') || '';
      if(href.startsWith('#modulos') || a.classList.contains('ver-modulos') || a.classList.contains('link-ver-modulos') || a.classList.contains('gestion-item') || a.classList.contains('btn-gestion') || a.classList.contains('entity') || a.classList.contains('entidad-chip')){
        ev.preventDefault(); ev.stopPropagation();
        goModules(a.getAttribute('data-target') || (href.match(/^#.+/)||[])[0]);
      }
    }, true);
  })();

  // 4) Header color & logo visibility enforcement
  (function enforceHeader(){
    const header = document.getElementById('mobi-header');
    if(header){ header.style.background = '#106374'; }
    const logo = document.getElementById('mobi-logo');
    if(logo && !logo.src){
      const srcLogo = document.querySelector('.site-header img, header img, .navbar img, img[src*="logo"], img[alt*="logo" i]');
      if(srcLogo){ logo.src = srcLogo.currentSrc || srcLogo.src; }
    }
  })();
})();
