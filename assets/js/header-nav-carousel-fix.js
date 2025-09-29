(function(){
  function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    // Create hamburger button in header if not exists
    var header = document.querySelector('header, .navbar, .site-header');
    if(!header) return;
    if(!document.getElementById('sjt-hamburger')){
      var btn = document.createElement('button');
      btn.id = 'sjt-hamburger';
      btn.setAttribute('aria-label','Abrir menú');
      btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
      // insert at end of header brand row
      header.insertBefore(btn, header.firstChild);
    }
    // Build drawer
    if(!document.getElementById('sjt-mobile-drawer')){
      var drawer = document.createElement('nav');
      drawer.id = 'sjt-mobile-drawer';
      var scrim = document.createElement('div'); scrim.id = 'sjt-mobile-scrim';
      document.body.appendChild(drawer); document.body.appendChild(scrim);
      // clone first nav ul found
      var navUL = document.querySelector('header nav ul, .navbar nav ul, .main-menu ul, nav ul');
      if(navUL){
        drawer.innerHTML = '<h3 style="margin:0 0 10px 0; font-weight:700;">Menú</h3>';
        var links = navUL.querySelectorAll('a');
        links.forEach(function(a){
          var cl = a.cloneNode(true);
          cl.removeAttribute('class');
          drawer.appendChild(cl);
        });
      }
      function open(){ drawer.classList.add('open'); scrim.classList.add('show'); }
      function close(){ drawer.classList.remove('open'); scrim.classList.remove('show'); }
      document.getElementById('sjt-hamburger').addEventListener('click', open);
      scrim.addEventListener('click', close);
      drawer.addEventListener('click', function(e){ if(e.target.tagName==='A') close(); });
    }
  });
})();