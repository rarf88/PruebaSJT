
(function(){
  function onReady(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  onReady(function(){
    var mq = window.matchMedia('(max-width: 1024px)');
    if(!mq.matches) return; // desktop intact

    var header = document.querySelector('header.site-header');
    if(!header) return;
    var nav = header.querySelector('.nav') || header;

    if(!document.getElementById('sjt-hamburger')){
      var btn = document.createElement('button');
      btn.id = 'sjt-hamburger';
      btn.setAttribute('aria-label','Abrir menú');
      btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
      nav.appendChild(btn);

      var drawer = document.getElementById('sjt-mobile-drawer');
      if(!drawer){ drawer = document.createElement('nav'); drawer.id='sjt-mobile-drawer'; document.body.appendChild(drawer); }
      var scrim = document.getElementById('sjt-mobile-scrim');
      if(!scrim){ scrim = document.createElement('div'); scrim.id='sjt-mobile-scrim'; document.body.appendChild(scrim); }

      // Collect links from desktop list if present
      var linkList = header.querySelector('.nav-links, header nav ul') || header.querySelector('nav ul') || null;
      drawer.innerHTML = '<h3 style="margin:0 0 10px 0;font:700 18px/1.2 system-ui,Arial">Menú</h3>';
      if(linkList){
        var tmp = document.createElement('div');
        tmp.innerHTML = linkList.outerHTML;
        tmp.querySelectorAll('*').forEach(function(el){ el.removeAttribute('class'); });
        tmp.querySelectorAll('a').forEach(function(a){ drawer.appendChild(a); });
      } else {
        header.querySelectorAll('a').forEach(function(a){
          if(!a.classList.contains('logo')){
            var clone = a.cloneNode(true); clone.removeAttribute('class'); drawer.appendChild(clone);
          }
        });
      }

      function open(){ drawer.classList.add('open'); scrim.classList.add('show'); }
      function close(){ drawer.classList.remove('open'); scrim.classList.remove('show'); }
      btn.addEventListener('click', open);
      scrim.addEventListener('click', close);
      drawer.addEventListener('click', function(e){ if(e.target.tagName==='A') close(); });
      window.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
    }
  });
})();
