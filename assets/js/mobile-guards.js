
// v16 guards to ensure desktop menu never shows on mobile/tablet
(function(){
  const mq = window.matchMedia('(max-width:1024px)');
  function nukeDesktopNav(){
    if(!mq.matches) return;
    ['.nav-links','.nav','.nav-inline','.navbar-nav','header nav','.menu','.menu--desktop','.top-menu','.main-menu']
      .forEach(sel => document.querySelectorAll(sel).forEach(el=>{
        el.style.display='none'; el.style.visibility='hidden'; el.style.pointerEvents='none';
        el.style.width='0'; el.style.height='0'; el.style.overflow='hidden';
      }));
    const drawer = document.getElementById('sjt-mobile-drawer');
    if (drawer) drawer.classList.remove('open','is-open');
    const hdr = document.querySelector('header');
    if (hdr) hdr.classList.remove('shrink','is-scrolled');
  }
  nukeDesktopNav();
  mq.addEventListener('change', nukeDesktopNav);
  window.addEventListener('scroll', nukeDesktopNav, {passive:true});
})();

// v9: force mobile header styling inline to defeat any cascade
document.addEventListener('DOMContentLoaded', function(){
  try{
    var mq = window.matchMedia('(max-width: 1024px)');
    if(!mq.matches) return;
    var header = document.querySelector('header.site-header');
    var nav = header ? header.querySelector('.nav') : null;
    var logo = header ? header.querySelector('.logo img.brand-sjt') : null;
    var green = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg') || '#376777';
    if(header){ header.style.setProperty('background', green.trim(), 'important'); }
    if(nav){
      nav.style.setProperty('background', green.trim(), 'important');
      nav.style.setProperty('height', (header.classList.contains('shrink') ? '46px' : '64px'), 'important');
      nav.style.setProperty('display','flex','important');
      nav.style.setProperty('align-items','center','important');
    }
    if(logo){
      logo.style.setProperty('display','block','important');
      logo.style.setProperty('height','100%','important');
      logo.style.setProperty('max-height', (header && header.classList.contains('shrink') ? '46px' : '64px'), 'important');
      logo.style.setProperty('mix-blend-mode','normal','important');
      logo.style.setProperty('filter','none','important');
      logo.style.setProperty('opacity','1','important');
      logo.style.setProperty('visibility','visible','important');
    }
  }catch(e){}
});


// v12: Force mobile/tablet logo visible & same height as bar (inline + !important) and keep other links hidden
(function(){
  function setImp(el, prop, val){
    try{ el && el.style && el.style.setProperty(prop, val, "important"); }catch(e){}
  }
  function fixLogo(){
    var mq = window.matchMedia('(max-width: 1024px)'); if(!mq.matches) return;
    var header = document.querySelector('header.site-header'); if(!header) return;
    var nav = header.querySelector('.nav') || header;
    var logoA = nav.querySelector('a.logo');
    var logoImg = logoA ? logoA.querySelector('img') : null;
    // Header on top
    setImp(header, 'position', 'sticky'); setImp(header, 'top', '0'); setImp(header, 'z-index', '10000');
    // Green bar and heights
    var green = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg') || '#376777';
    setImp(header, 'background', green.trim()); setImp(nav, 'height', header.classList.contains('shrink') ? '46px' : '64px');
    setImp(nav, 'display', 'flex'); setImp(nav, 'align-items', 'center'); setImp(nav, 'position', 'relative');
    // Show only logo anchor; keep other nav links hidden
    if (logoA){
      setImp(logoA, 'display', 'flex');
      setImp(logoA, 'align-items', 'center');
      setImp(logoA, 'height', '100%');
      setImp(logoA, 'visibility', 'visible');
      setImp(logoA, 'pointer-events', 'auto');
      setImp(logoA, 'z-index', '10001');
    }
    if (logoImg){
      setImp(logoImg, 'display', 'block');
      setImp(logoImg, 'height', '100%');
      setImp(logoImg, 'max-height', header.classList.contains('shrink') ? '46px' : '64px');
      setImp(logoImg, 'width', 'auto');
      setImp(logoImg, 'mix-blend-mode', 'normal');
      setImp(logoImg, 'filter', 'none');
      setImp(logoImg, 'opacity', '1');
      setImp(logoImg, 'visibility', 'visible');
    }
    // Hide non-logo links in nav (just in case something shows them)
    Array.prototype.forEach.call(nav.querySelectorAll(':scope > a:not(.logo), .nav-links a'), function(a){
      setImp(a, 'display', 'none');
    });
    // Ensure no scrim overlays header
    var scrim = document.getElementById('sjt-mobile-scrim');
    if (scrim){ setImp(scrim, 'pointer-events', 'none'); setImp(scrim, 'opacity', '0'); }
  }
  document.addEventListener('DOMContentLoaded', fixLogo);
  window.addEventListener('load', fixLogo);
  window.addEventListener('resize', fixLogo, {passive:true});
  window.addEventListener('scroll', fixLogo, {passive:true});
})();
