(function(){
function overlayCenter(){
if (window.innerWidth > 1024) return;
var header = document.querySelector('header.site-header');
if (!header) return;
if (header.querySelector('.sjt-mobile-logo-overlay')) return;
var nav = header.querySelector('nav');
if (!nav) return;
var logo = nav.querySelector('.logo');
if (!logo) return;
var overlay = document.createElement('div');
overlay.className = 'sjt-mobile-logo-overlay';
var a=document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); a.innerHTML=logo.innerHTML; overlay.appendChild(a);
header.appendChild(overlay);
}
window.addEventListener('DOMContentLoaded', overlayCenter);
window.addEventListener('resize', overlayCenter);
window.addEventListener('orientationchange', overlayCenter);
})();