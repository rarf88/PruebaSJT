
(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    // Try to find an existing hamburger
    var btn = document.getElementById('sjt-hamburger') ||
              document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú"], button[aria-label*="menu"]');
    if(!btn){
      // Optionally, do nothing if there's no hamburger. We won't create one to avoid desktop impact.
      return;
    }
    // Normalize initial bars (if inner not set, create)
    function setBars(){
      btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    }
    function setX(){
      btn.innerHTML = '<span class="xline"></span><span class="xline"></span>';
      var s1 = btn.querySelectorAll('.xline')[0];
      var s2 = btn.querySelectorAll('.xline')[1];
      if(s1){ s1.style.display='block'; s1.style.width='24px'; s1.style.height='2px'; s1.style.transform='rotate(45deg)'; s1.style.margin='0 auto'; }
      if(s2){ s2.style.display='block'; s2.style.width='24px'; s2.style.height='2px'; s2.style.transform='rotate(-45deg) translateY(-2px)'; s2.style.margin='-2px auto 0'; }
    }
    // Determine current open state by common hooks
    function isOpen(){
      var drawer = document.getElementById('sjt-mobile-drawer') || document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer');
      if(drawer) return drawer.classList.contains('open') || drawer.classList.contains('show');
      return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open');
    }
    function update(){
      if(isOpen()) setX(); else setBars();
    }
    // Initial paint
    update();
    // Observe mutations to react when some other script opens/closes the menu
    var observer = new MutationObserver(update);
    observer.observe(document.body, {attributes:true, attributeFilter:['class']});
    var drawer = document.getElementById('sjt-mobile-drawer') || document.querySelector('.mobile-drawer, .offcanvas, .nav-drawer');
    if(drawer) observer.observe(drawer, {attributes:true, attributeFilter:['class']});
    // Also update on click
    btn.addEventListener('click', function(){ setTimeout(update, 50); });
  });
})();
