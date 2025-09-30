
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var demo = document.querySelector('#sjt-floating-demo, #floating-demo, .floating-demo, [data-fab="demo"]');
    var wa   = document.querySelector('#sjt-floating-whatsapp, #floating-whatsapp, .floating-whatsapp, [data-fab="whatsapp"], a[href*="wa.me"], a[href*="api.whatsapp.com"]');

    if(!demo){
      var a = document.createElement('a');
      a.id='sjt-floating-demo'; a.className='sjt-fab'; a.href='#'; a.setAttribute('aria-label','Solicitar demo');
      var s = document.createElement('span'); s.textContent='DEMO'; a.appendChild(s);
      document.body.appendChild(a);
    }
    if(!wa || !wa.id || wa.id!=='sjt-floating-whatsapp'){
      var a2 = document.createElement('a');
      a2.id='sjt-floating-whatsapp'; a2.className='sjt-fab'; a2.href='https://wa.me/'; a2.target='_blank'; a2.rel='noopener';
      var inner=document.createElement('div'); inner.className='inner';
      inner.innerHTML = '<img src="assets/img/whatsapp-official.svg" alt="WhatsApp" aria-hidden="true">';
      a2.appendChild(inner);
      if(wa && wa.parentNode){ wa.parentNode.replaceChild(a2, wa); } else { document.body.appendChild(a2); }
    }
  });
})();
