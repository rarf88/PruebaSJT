
// v21: ensure hamburger + drawer on mobile/tablet without touching desktop
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var mq = window.matchMedia('(max-width:1024px)'); if(!mq.matches) return;
    var header=document.querySelector('header.site-header'); if(!header) return;
    var nav=header.querySelector('.nav')||header;
    if(!document.getElementById('sjt-hamburger')){
      var btn=document.createElement('button'); btn.id='sjt-hamburger'; btn.setAttribute('aria-label','Abrir menú');
      btn.innerHTML='<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
      nav.appendChild(btn);
      var drawer=document.getElementById('sjt-mobile-drawer'); if(!drawer){ drawer=document.createElement('nav'); drawer.id='sjt-mobile-drawer'; document.body.appendChild(drawer); }
      var scrim=document.getElementById('sjt-mobile-scrim'); if(!scrim){ scrim=document.createElement('div'); scrim.id='sjt-mobile-scrim'; document.body.appendChild(scrim); }
      function open(){ drawer.classList.add('open'); scrim.classList.add('show'); }
      function close(){ drawer.classList.remove('open'); scrim.classList.remove('show'); }
      btn.addEventListener('click', open); scrim.addEventListener('click', close);
      drawer.addEventListener('click', function(e){ if(e.target.tagName==='A') close(); });
      window.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
    }
  });
})();
