
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
