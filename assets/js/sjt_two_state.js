
// sjt_two_state.js
(function(){
  try{
    var THRESHOLD=10, H_NORMAL=64, H_SHRINK=36;
    var mq=window.matchMedia('(max-width:1024px)');
    var navEl=null, logoImg=null, logoDiv=null;

    function pickNav(){
      var arr=[].slice.call(document.querySelectorAll('header,.header,.navbar,.topbar,nav[role="navigation"]'));
      if(!arr.length) return null;
      for(var i=0;i<arr.length;i++){
        var el=arr[i];
        if(el.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i], .logo, svg[aria-label*="logo" i]'))
          return el;
      }
      return arr[0];
    }
    function pickLogo(){
      if(!navEl) return;
      logoImg = navEl.querySelector('img.logo, .logo img, img[alt*="logo" i], img[src*="logo" i]') || null;
      logoDiv = navEl.querySelector('.logo') || null;
      [logoImg, logoDiv].forEach(function(n){
        if(!n) return;
        try{
          if(n.tagName==='IMG' || n.tagName==='SVG'){
            n.removeAttribute('height'); n.removeAttribute('width');
            if(n.style){ n.style.height=''; n.style.width=''; n.style.maxHeight=''; }
          }else if(n.style){
            n.style.height=''; n.style.lineHeight=''; n.style.backgroundSize='';
          }
        }catch(e){}
      });
    }
    function setBar(px){
      if(!navEl) return;
      navEl.style.setProperty('height', px+'px', 'important');
      navEl.style.setProperty('min-height', px+'px', 'important');
      navEl.style.setProperty('transition', 'none', 'important');
      navEl.style.setProperty('padding-top', '0px', 'important');
      navEl.style.setProperty('padding-bottom', '0px', 'important');
      var inner = px-4; if(inner<20) inner=px;
      if(logoImg){
        logoImg.style.setProperty('max-height', inner+'px', 'important');
        logoImg.style.setProperty('height', 'auto', 'important');
        logoImg.style.setProperty('width', 'auto', 'important');
        logoImg.style.setProperty('object-fit', 'contain', 'important');
        logoImg.style.setProperty('display', 'block', 'important');
      }
      if(logoDiv){
        logoDiv.style.setProperty('height', px+'px', 'important');
        logoDiv.style.setProperty('line-height', px+'px', 'important');
        logoDiv.style.setProperty('background-size', 'contain', 'important');
      }
    }
    function applyState(){
      if(!mq.matches) return;
      var y=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0;
      setBar(y>THRESHOLD?H_SHRINK:H_NORMAL);
    }
    function init(){
      navEl=pickNav(); if(!navEl) return;
      pickLogo(); applyState();
      window.addEventListener('scroll', applyState, {passive:true});
      window.addEventListener('resize', function(){ if(mq.matches) applyState(); });
      window.addEventListener('orientationchange', function(){ setTimeout(applyState,60); });
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
  }catch(e){}
})();
