(function(){
  function hideDrawerLogos(){
    var drawer = document.getElementById('sjt-mobile-drawer');
    if(!drawer) return;
    var logoSelectors = [
      '.logo', '.brand', '.site-logo', '.navbar-brand', 'a.logo', 'a.brand',
      'img[alt*="logo" i]', 'picture img[alt*="logo" i]'
    ];
    logoSelectors.forEach(function(sel){
      drawer.querySelectorAll(sel).forEach(function(el){
        // Skip potential small icons
        var isIcon = el.tagName === 'IMG' && (/(icon|sprite)/i.test(el.src || '') || el.width <= 32 || el.height <= 32);
        if (isIcon) return;
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
      });
    });
    // Also collapse possible wrappers
    drawer.querySelectorAll('.logo-wrap, .brand-wrap').forEach(function(el){
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('height','0','important');
      el.style.setProperty('overflow','hidden','important');
    });
  }
  document.addEventListener('DOMContentLoaded', hideDrawerLogos);
  var mo = new MutationObserver(hideDrawerLogos);
  mo.observe(document.documentElement, { subtree:true, childList:true, attributes:true });
  window.addEventListener('resize', hideDrawerLogos);
})();