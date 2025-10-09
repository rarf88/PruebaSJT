(function(){
  const DESKTOP_MIN = 1025;
  function applyBodyOffset(){
    if(window.innerWidth >= DESKTOP_MIN){
      document.body.classList.add('has-fixed-nav');
      // measure first header-ish element
      const hdr = document.querySelector('header, .navbar, .navbar-desktop, header.site-header, header.header, .topbar');
      if(hdr){
        document.body.style.paddingTop = hdr.getBoundingClientRect().height + 'px';
      }
    }else{
      document.body.classList.remove('has-fixed-nav');
      document.body.style.paddingTop = '';
      document.documentElement.classList.remove('nav-scrolled');
    }
  }
  function onScroll(){
    if(window.innerWidth < DESKTOP_MIN) return;
    if(window.scrollY > 6){
      document.documentElement.classList.add('nav-scrolled');
    }else{
      document.documentElement.classList.remove('nav-scrolled');
    }
    applyBodyOffset();
  }
  window.addEventListener('load', function(){
    applyBodyOffset();
    onScroll();
  });
  window.addEventListener('resize', applyBodyOffset);
  window.addEventListener('scroll', onScroll);
})();