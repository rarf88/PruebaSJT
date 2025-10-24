(function(){
function isMobile(){ return window.innerWidth <= 1024; }
function $(s, r){ return (r||document).querySelector(s); }
function ensureOverlay(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
var overlay = $('.sjt-mobile-logo-overlay', nav);
if (!overlay){
overlay = document.createElement('div');
overlay.className = 'sjt-mobile-logo-overlay';
nav.insertBefore(overlay, nav.firstChild.nextSibling);
}
if (!overlay.querySelector('a')){
var a = document.createElement('a'); a.href='index.html'; a.setAttribute('aria-label','Inicio');
overlay.appendChild(a);
}
var a = overlay.querySelector('a');
var img = overlay.querySelector('img');
if (!img){ img = document.createElement('img'); a.appendChild(img); }
img.src = 'assets/img/sjt-logo-transparent@2x.webp';
if (!img.alt) img.alt = 'SJT';
}
function syncGhostSpacer(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
var w = 44;
if (toggler) {
var r = toggler.getBoundingClientRect();
w = Math.max(36, Math.ceil(r.width) + 8);
}
nav.style.setProperty('--toggler-w', w + 'px');
}
function setRightPadding(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
var w = 44;
if (toggler){
var r = toggler.getBoundingClientRect();
w = Math.max(44, Math.ceil(r.width) + 16);
}
nav.style.setProperty('--pad-right', w + 'px');
}
function purgeStrayNavMedia(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header); if (!nav) return;
var nodes = nav.querySelectorAll('img, picture, svg');
nodes.forEach(function(n){
if (n.closest('.sjt-mobile-logo-overlay')) return; // keep centered overlay
if (n.closest('button')) return; // keep hamburger/icon inside buttons
try{ n.remove(); }catch(e){}
});
var wrappers = nav.querySelectorAll('.logo, .site-logo, .brand');
wrappers.forEach(function(w){ try{ w.remove(); }catch(e){} });
}
function isLogoNode(node){
try{
if (!node) return false;
if (node.closest && node.closest('.sjt-mobile-logo-overlay')) return false; // keep approved overlay
if (node.closest && node.closest('button')) return false; // keep icons inside buttons
var tag = (node.tagName||'').toLowerCase();
if (tag === 'img' || tag === 'picture' || tag === 'svg'){
var src = (node.getAttribute && node.getAttribute('src')) || '';
if (/logo/i.test(src)) return true;
return true;
}
var st = node.getAttribute && node.getAttribute('style') || '';
if (/background/i.test(st) && /logo/i.test(st)) return true;
var cls = (node.className || '').toString();
if (/logo|site-logo|brand/i.test(cls)) return true;
return false;
}catch(e){ return false; }
}
function purgeNow(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var nav = $('nav', header) || header; // scan nav primarily, then header
var nodes = nav.querySelectorAll('img, picture, svg, [style*="background"], [class*="logo" i]');
nodes.forEach(function(n){
if (n.closest && n.closest('.sjt-mobile-logo-overlay')) return;
if (n.closest && n.closest('button')) return;
if (isLogoNode(n)){
try{ n.remove(); }catch(e){}
}
});
}
var headerObserver = null;
function installObserver(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
if (headerObserver){ try{ headerObserver.disconnect(); }catch(e){} }
headerObserver = new MutationObserver(function(muts){
muts.forEach(function(m){
if (m.addedNodes && m.addedNodes.length){
m.addedNodes.forEach(function(n){
try{
if (isLogoNode(n)){ n.remove(); return; }
if (n.querySelectorAll){
var kids = n.querySelectorAll('img, picture, svg, [style*="background"], [class*="logo" i]');
kids.forEach(function(k){ if (isLogoNode(k)) try{k.remove();}catch(e){} });
}
}catch(e){}
});
}
});
});
headerObserver.observe(header, {childList:true, subtree:true});
}
function onScroll(){
if (!isMobile()) return;
var header = $('header.site-header'); if (!header) return;
var y = window.scrollY || 0;
if (y > 110) header.classList.add('is-scrolled');
else if (y < 60) header.classList.remove('is-scrolled');
}
window.addEventListener('DOMContentLoaded', function(){ ensureOverlay(); onScroll(); setRightPadding(); purgeNow(); installObserver(); purgeStrayNavMedia(); });
window.addEventListener('resize', function(){ setRightPadding(); purgeNow(); purgeStrayNavMedia(); onScroll(); setRightPadding(); purgeNow(); installObserver(); purgeStrayNavMedia(); });
window.addEventListener('orientationchange', function(){ setRightPadding(); purgeNow(); purgeStrayNavMedia(); onScroll(); setRightPadding(); purgeNow(); installObserver(); purgeStrayNavMedia(); });
window.addEventListener('scroll', onScroll, {passive:true});
})();