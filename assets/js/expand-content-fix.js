document.addEventListener('click', function(e){
  const t = e.target.closest('[data-toggle="collapse"], .accordion-toggle, .module-tile, .service-tile');
  if (!t) return;
  window.setTimeout(function(){
    document.querySelectorAll('.collapse, .accordion-content, .toggle-content, .module-detail, .service-detail').forEach(function(el){
      if (getComputedStyle(el).display !== 'none') {
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
        el.style.height = 'auto';
      }
    });
  }, 200);
});