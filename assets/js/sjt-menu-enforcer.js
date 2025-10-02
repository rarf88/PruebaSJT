
(function(){
  function isMobile(){ return window.innerWidth <= 1024; }
  function $(s,r){ return (r||document).querySelector(s); }
  function $all(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function resolveMenu(){ var h=$('header.site-header'); if(!h) return null; return h.querySelector('.navbar-collapse, .offcanvas, .mobile-menu'); }
  function ensureMenuLogo(){ if(!isMobile()) return; var m=resolveMenu(); if(!m) return; var b=m.querySelector('.sjt-menu-logo'); if(!b){ b=document.createElement('div'); b.className='sjt-menu-logo'; m.insertBefore(b,m.firstChild);} var img=b.querySelector('img'); if(!img){ img=document.createElement('img'); img.alt='SJT'; img.src='assets/img/sjt-logo.png'; b.appendChild(img);} }
  function openMenu(m,btn){ if(!m) return; m.classList.add('show','open'); m.style.display='block'; document.body.classList.add('sjt-menu-open'); if(btn) btn.setAttribute('aria-expanded','true'); }
  function closeMenu(m,btn){ if(!m) return; m.classList.remove('show','open'); m.style.display='none'; document.body.classList.remove('sjt-menu-open'); if(btn) btn.setAttribute('aria-expanded','false'); }
  function isOpen(m){ return m.classList.contains('show')||m.classList.contains('open')||window.getComputedStyle(m).display!=='none'; }
  var __lock=false,__t=null;
  function toggleHandler(e){ if(!isMobile()) return; e.preventDefault(); e.stopPropagation(); if(__lock) return; __lock=true; clearTimeout(__t); __t=setTimeout(function(){__lock=false;},200); var h=$('header.site-header'); var m=resolveMenu(); if(!m) return; var btn=e.currentTarget; if(isOpen(m)) closeMenu(m,btn); else openMenu(m,btn); }
  function bindToggle(){ if(!isMobile()) return; var h=$('header.site-header'); if(!h) return; $all('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler',h).forEach(function(b){ if(b._bound) return; b.addEventListener('click',toggleHandler,true); b._bound=true; if(!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded','false'); }); }
  document.addEventListener('click',function(e){ if(!isMobile()) return; var a=e.target.closest('.navbar-collapse a, .offcanvas a, .mobile-menu a'); if(!a) return; var h=$('header.site-header'); var m=resolveMenu(); var btn=h&&h.querySelector('.navbar-toggler'); if(m) closeMenu(m,btn); },true);
  document.addEventListener('click',function(e){ if(!isMobile()) return; var h=$('header.site-header'); if(!h) return; var m=resolveMenu(); var btn=h&&h.querySelector('.navbar-toggler'); if(!m||!btn) return; if(!isOpen(m)) return; if(m.contains(e.target)||btn.contains(e.target)) return; closeMenu(m,btn); },true);
  function hardResizeGuard(){ if(window.innerWidth>=1025){ var h=document.querySelector('header.site-header'); var m=resolveMenu(); var btn=h&&h.querySelector('.navbar-toggler'); if(m){ m.classList.remove('show','open'); m.style.display=''; } document.body.classList.remove('sjt-menu-open'); if(btn) btn.setAttribute('aria-expanded','false'); } }
  window.addEventListener('DOMContentLoaded',function(){ensureMenuLogo();bindToggle();hardResizeGuard();});
  window.addEventListener('resize',function(){ensureMenuLogo();bindToggle();hardResizeGuard();});
  window.addEventListener('orientationchange',function(){ensureMenuLogo();bindToggle();hardResizeGuard();});
})();
