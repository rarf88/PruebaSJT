
// v40: Force the logo to render correctly on mobile/tablet even if CSS fights it.
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var header = document.querySelector('header.site-header'); if(!header) return;
    var nav = header.querySelector('.nav') || header;
    var a = header.querySelector('a.logo, .logo a, a.brand, .brand a');

    // If there's no <img>, inject one using the known logo asset
    if(a && !a.querySelector('img')){
      var img = document.createElement('img');
      img.alt = 'Logo';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.src = 'assets/img/sjt-logo.png';
      a.appendChild(img);
    }

    var imgEl = a && (a.querySelector('img') || a.querySelector('svg'));
    if(!imgEl) return;

    function force(){
      // compute current bar height
      var h = (nav.getBoundingClientRect().height || 70);
      // clear classes that may hide it
      a.style.setProperty('text-indent','0','important');
      a.style.setProperty('clip','auto','important');
      a.style.setProperty('clip-path','none','important');
      a.style.setProperty('visibility','visible','important');
      a.style.setProperty('opacity','1','important');
      a.style.setProperty('height','100%','important');
      a.style.setProperty('display','flex','important');
      a.style.setProperty('align-items','center','important');

      imgEl.style.setProperty('height', h + 'px', 'important');
      imgEl.style.setProperty('max-height', h + 'px', 'important');
      imgEl.style.setProperty('width','auto','important');
      imgEl.style.setProperty('display','block','important');
      imgEl.style.setProperty('object-fit','contain','important');
    }

    force();
    var ro = new ResizeObserver(force); ro.observe(nav);
    var mo = new MutationObserver(force); mo.observe(header, {attributes:true, attributeFilter:['class']});
    window.addEventListener('scroll', force, {passive:true});
    window.addEventListener('orientationchange', function(){ setTimeout(force,200); });
  });
})();
