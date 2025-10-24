(function(){
function $(q){ return document.querySelector(q); }
function rect(el){ try{ return el.getBoundingClientRect(); }catch(e){ return null; } }
function place(){
var header = $('header, .site-header, .navbar, .topbar');
var slider = $('section.slider');
if(!header || !slider) return;
var h = Math.round(header.offsetHeight || 0);
slider.style.marginTop = h + 'px';
setTimeout(function(){
var rh = rect(header), rs = rect(slider);
if (rh && rs){
var delta = Math.round(rs.top - rh.bottom);
if (delta !== 0){
var current = parseInt(getComputedStyle(slider).marginTop || '0', 10) || 0;
slider.style.marginTop = (current - delta) + 'px';
}
}
var next = slider.nextElementSibling;
if (next){
next.style.marginTop = '0px';
next.style.paddingTop = '0px';
var rs2 = rect(slider), rn = rect(next);
if (rs2 && rn){
var gap2 = Math.round(rn.top - rs2.bottom);
if (gap2 > 0){
next.style.marginTop = (-gap2) + 'px';
}
}
var h1 = next.querySelector('h1, .h1, h2, .h2');
if (h1){ h1.style.marginTop = '0px'; }
}
}, 40);
}
if (document.readyState === 'loading'){
document.addEventListener('DOMContentLoaded', place);
} else {
place();
}
window.addEventListener('load', place, {passive:true});
window.addEventListener('orientationchange', function(){ setTimeout(place, 100); }, {passive:true});
window.addEventListener('resize', function(){ setTimeout(place, 100); }, {passive:true});
})();