// === SJT Hamburger Guard (cierre garantizado en la X/overlay) ===
(function(){
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.from(document.querySelectorAll(sel)); }
  function isOpen(el){
    if(!el) return false;
    const cs = getComputedStyle(el);
    return el.classList.contains('open') || el.classList.contains('show') || el.classList.contains('active') ||
           el.getAttribute('aria-hidden') === 'false' ||
           (cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity||'1') > 0.01);
  }

  const btn = $('#sjt-hamburger') || $('.navbar-toggler') || $('.hamburger') || $('.menu-toggle') || $('[data-menu-toggle]') || $('button[aria-controls]');
  const drawer = $('#sjt-mobile-drawer') || $('.navbar-collapse') || $('.offcanvas') || $('.nav-drawer') || $('.drawer') || $('.sjt-hamburger-menu');
  const scrim  = $('#sjt-scrim') || $('.menu-overlay') || $('.offcanvas-backdrop') || $('.backdrop') || $('.overlay') || $('.modal-backdrop');

  function mark(open){
    if(!btn) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.classList.toggle('is-open', !!open);
    btn.classList.remove('is-active','active','open','show');
  }

  function hardClose(){
    try { if (btn && btn.getAttribute('aria-expanded') === 'true') btn.click(); } catch(e){}

    const OPEN = ['open','is-open','active','show','visible','in'];
    if (drawer){
      OPEN.forEach(c => drawer.classList.remove(c));
      drawer.setAttribute('aria-hidden','true');
      if (drawer.style){
        drawer.style.removeProperty('display');
        drawer.style.removeProperty('visibility');
        drawer.style.removeProperty('opacity');
        drawer.style.removeProperty('transform');
      }
    }
    if (scrim){
      OPEN.forEach(c => scrim.classList.remove(c));
      scrim.setAttribute('aria-hidden','true');
      if (scrim.style){
        scrim.style.removeProperty('display');
        scrim.style.removeProperty('visibility');
        scrim.style.removeProperty('opacity');
      }
    }
    ['menu-open','nav-open','drawer-open','no-scroll','overflow-hidden','offcanvas-open','modal-open']
      .forEach(c => { document.body.classList.remove(c); document.documentElement.classList.remove(c); });
    mark(false);
  }

  document.addEventListener('click', function(ev){
    const closer = ev.target && ev.target.closest('.btn-close, .menu-close, .icon-x, .x, [data-close], [aria-label*="cerrar" i], [aria-label*="close" i]');
    if (!closer) return;
    ev.preventDefault();
    ev.stopPropagation();
    hardClose();
  }, true);

  if (scrim){
    scrim.addEventListener('click', function(ev){
      if (ev.target === scrim){ hardClose(); }
    }, true);
  }

  document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape' && isOpen(drawer)) hardClose(); });

  if (btn){
    btn.addEventListener('click', function(){
      const willOpen = drawer ? !isOpen(drawer) : !(btn.getAttribute('aria-expanded') === 'true');
      mark(willOpen);
    }, true);
  }
})();
