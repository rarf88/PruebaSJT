
(function(){
  var THRESH = 60; // px to start shrink; avoids early shrink on small scrolls/URL bar
  function isMobile(){ return window.innerWidth <= 1024; }
  function update(){
    if (!isMobile()) return;
    var header = document.querySelector('header.site-header');
    if (!header) return;
    var nav = header.querySelector('nav');
    if (nav){
      // neutralize any inline min-height left by previous scripts
      if (nav.style && nav.style.minHeight) nav.style.minHeight = '';
    }
    var scrolled = window.scrollY > THRESH;
    if (scrolled) header.classList.add('is-scrolled'); else header.classList.remove('is-scrolled');
  }
  window.addEventListener('DOMContentLoaded', update);
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
})();
