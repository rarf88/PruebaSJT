(function(){
var DOWN=110, UP=60;
function isMobile(){ return window.innerWidth <= 1024; }
function tick(){
if (!isMobile()) return;
var header=document.querySelector('header.site-header'); if(!header) return;
var y=window.scrollY||0, on=header.classList.contains('is-scrolled');
if(!on && y>DOWN) header.classList.add('is-scrolled');
else if(on && y<UP) header.classList.remove('is-scrolled');
}
window.addEventListener('DOMContentLoaded', tick);
window.addEventListener('scroll', tick, {passive:true});
window.addEventListener('resize', tick);
window.addEventListener('orientationchange', tick);
})();