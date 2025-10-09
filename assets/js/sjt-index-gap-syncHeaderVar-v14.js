// === SJT Index Gap Fix v14 ===
// Sync --header-height so body padding-top (via --header-offset) matches the real header height.
(function(){
  function $(q){ return document.querySelector(q); }
  function setVar(name, value){ document.documentElement.style.setProperty(name, value); }
  function apply(){
    var header = $('header, .site-header, .navbar, .topbar');
    if (!header) return;
    var h = header.offsetHeight || header.clientHeight || 0;
    // Update the variable that sjt-mobile-header-sticky.css uses:
    setVar('--header-height', (Math.round(h) + 'px'));
  }
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply, {passive:true});
  window.addEventListener('resize', function(){ setTimeout(apply, 80); }, {passive:true});
  window.addEventListener('orientationchange', function(){ setTimeout(apply, 80); }, {passive:true});
})();
