(function(){
function isMobile(){ return window.innerWidth <= 1024; }
function $(s, r){ return (r||document).querySelector(s); }
function $all(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function isOverlay(e){ try{ return !!(e && e.closest && e.closest('.sjt-mobile-logo-overlay')); }catch(e){ return false; } }
function isToggler(e){ return !!(e && (e.matches('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler') || (e.closest && e.closest('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler')))); }
function ensureOverlay(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var overlay = $('.sjt-mobile-logo-overlay', header);
if (overlay) return;
var nav = $('nav', header); if (!nav) return;
var srcLogo = nav.querySelector('.logo'); if (!srcLogo) return;
overlay = document.createElement('div');
overlay.className = 'sjt-mobile-logo-overlay';
var a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio'); a.innerHTML = srcLogo.innerHTML;
overlay.appendChild(a);
header.appendChild(overlay);
}
function looksLogo(el){
if (!el || el.nodeType!==1) return false;
if (isOverlay(el) || isToggler(el)) return false;
var cls=(el.className||'').toString().toLowerCase();
var id=(el.id||'').toString().toLowerCase();
var alt=(el.getAttribute && (el.getAttribute('alt')||'')).toLowerCase();
var tit=(el.getAttribute && (el.getAttribute('title')||'')).toLowerCase();
var src=(el.getAttribute && (el.getAttribute('src')||'')).toLowerCase();
var html=(el.outerHTML||'').toLowerCase();
if (/(^|\b)(logo|site-logo|brand|isologo)(\b|$)/.test(cls+' '+id)) return true;
if (alt.includes('logo') || alt.includes('brand') || tit.includes('logo') || tit.includes('brand')) return true;
if (src.includes('logo')) return true;
if (html.includes('logo') || html.includes('site-logo') || html.includes('isologo')) return true;
return (el.tagName==='IMG' || el.tagName==='PICTURE' || el.tagName==='SVG');
}
function inRightHalf(el, nav){
try{
var nr = nav.getBoundingClientRect();
var er = el.getBoundingClientRect();
var mid = nr.left + nr.width*0.55;
return (er.left + er.width/2) > mid;
}catch(e){ return false; }
}
function nukeRight(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
var l = nav.querySelector('.logo'); if (l && !isOverlay(l)){ try{ l.remove(); }catch(e){} }
var nodes = $all('a, img, picture, svg, div, span', nav);
nodes.forEach(function(el){
if (isOverlay(el) || isToggler(el)) return;
if (!inRightHalf(el, nav)) return;
if (looksLogo(el)){
try{ (el.closest && el.closest('a')) ? el.closest('a').remove() : el.remove(); }catch(e){}
}
});
}
function observe(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
if (nav.__sjt_kill_v3) return;
var mo = new MutationObserver(function(muts){
muts.forEach(function(m){
m.addedNodes && Array.prototype.forEach.call(m.addedNodes, function(n){
if (n && n.nodeType===1){ nukeRight(); }
});
});
});
mo.observe(nav, {childList:true, subtree:true});
nav.__sjt_kill_v3 = mo;
}
function init(){
if (!isMobile()) return;
ensureOverlay();
nukeRight();
observe();
for (var i=0;i<5;i++){ setTimeout(nukeRight, (i+1)*80); }
}
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', init);
window.addEventListener('orientationchange', init);
})();