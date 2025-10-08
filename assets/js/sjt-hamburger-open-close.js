
(function(){
  function ready(fn){ if(document.readyState!=='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    if (!window.matchMedia('(max-width: 991px)').matches) return;
    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
    if(!btn) return;
    function drawer(){
      return document.getElementById('sjt-mobile-drawer') ||
             document.querySelector('.navbar-collapse, .mobile-drawer, .nav-drawer, .offcanvas, .menu-mobile, header nav, nav[role="navigation"]');
    }
    function scrim(){
      return document.getElementById('sjt-mobile-scrim') || document.querySelector('.offcanvas-backdrop, .nav-scrim, .modal-backdrop, .backdrop');
    }
    function ensureScrim(){
      var s = scrim(); if(s) return s;
      s = document.createElement('div'); s.id='sjt-mobile-scrim';
      s.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .15s ease;z-index:9999;';
      document.body.appendChild(s); return s;
    }
    function isOpen(){ return btn.classList.contains('is-open'); }
    function openMenu(){
      var d = drawer(), s = ensureScrim();
      btn.classList.add('is-open'); btn.setAttribute('aria-expanded','true');
      if(d){ d.classList.add('open','show','in'); d.style.removeProperty('display'); }
      if(s){ s.style.opacity='1'; s.style.pointerEvents='auto'; }
      document.documentElement.classList.add('nav-open'); document.body.classList.add('nav-open');
    }
    function closeMenu(){
      var d = drawer(), s = scrim();
      btn.classList.remove('is-open'); btn.setAttribute('aria-expanded','false');
      if(d){ d.classList.remove('open','show','in'); }
      if(s){ s.style.opacity='0'; s.style.pointerEvents='none'; }
      document.documentElement.classList.remove('nav-open'); document.body.classList.remove('nav-open');
    }
    btn.addEventListener('click', function(ev){
      ev.preventDefault(); ev.stopPropagation();
      if(isOpen()) closeMenu(); else openMenu();
    }, {passive:false});
    document.addEventListener('click', function(ev){
      if(!isOpen()) return;
      var d = drawer();
      if(d && d.contains(ev.target)) return;
      if(btn.contains(ev.target)) return;
      closeMenu();
    }, {passive:true});
  });
})();
