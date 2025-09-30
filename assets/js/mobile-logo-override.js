
// v41: Inject a dedicated mobile logo element and size it with the header height
(function(){ 
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var header = document.querySelector('header.site-header'); if(!header) return;
    var nav = header.querySelector('.nav') || header;
    if(!document.querySelector('.sjt-mobile-logo-override')){
      var a = document.createElement('a');
      a.href = '/'; a.className = 'sjt-mobile-logo-override'; a.setAttribute('aria-label','Inicio');
      var img = document.createElement('img');
      img.src = 'assets/img/sjt-logo.png'; img.alt = 'Logo';
      a.appendChild(img);
      header.appendChild(a);
    }
    var img = document.querySelector('.sjt-mobile-logo-override img');
    function resize(){
      var h = (nav.getBoundingClientRect().height||72);
      img.style.height = (h>64?72:56) + 'px';
    }
    resize();
    new ResizeObserver(resize).observe(nav);
    window.addEventListener('scroll', resize, {passive:true});
    window.addEventListener('orientationchange', function(){ setTimeout(resize, 150); });
  });
})();
