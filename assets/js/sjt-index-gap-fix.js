(function(){
function sel(q){ return document.querySelector(q); }
function rect(el){ try { return el.getBoundingClientRect(); } catch(e){ return null; } }
function px(n){ return (Math.round(n)||0) + 'px'; }
function killGaps(){
var header = sel('header, .site-header, .navbar, .topbar');
var slider = sel('section.slider');
if (!header || !slider) return;
var rh = rect(header), rs = rect(slider);
if (rh && rs){
var gap = rs.top - rh.bottom;
if (gap > 0){
slider.style.marginTop = px(-gap);
} else if (gap < -4) {
slider.style.marginTop = px(Math.min(0, -4 - gap));
}
}
var next = slider.nextElementSibling;
if (next){
var rn = rect(next), rs2 = rect(slider);
if (rn && rs2){
var gap2 = rn.top - rs2.bottom;
if (gap2 > 0){
next.style.marginTop = px(Math.max(0, next.offsetTop - gap2) || 0);
next.style.marginTop = '0px';
}
}
var fh = next.querySelector('h1, .h1, h2, .h2');
if (fh){
var cs = getComputedStyle(fh);
if (parseFloat(cs.marginTop||'0') > 0){
fh.style.marginTop = '0px';
}
}
}
}
['DOMContentLoaded','load','resize','orientationchange'].forEach(function(evt){
window.addEventListener(evt, function(){ setTimeout(killGaps, 50); }, {passive:true});
});
document.addEventListener('DOMContentLoaded', function(){ setTimeout(killGaps, 30); });
})();