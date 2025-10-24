(function(){
function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
ready(function(){
var header = document.querySelector('header.site-header'); if(!header) return;
var nav = header.querySelector('.nav') || header;
var desktopLogo = header.querySelector('a.logo, .logo a, a.brand, .brand a');
var targetHref = 'index.html';
if (desktopLogo) {
var h = desktopLogo.getAttribute('href');
if (h && h.trim() && !/^javascript:/i.test(h)) targetHref = h;
}
var prev = document.querySelector('.sjt-mobile-logo-override');
if (prev) prev.remove();
var a = document.createElement('a');
a.href = targetHref;
a.className = 'sjt-mobile-logo-override';
a.setAttribute('aria-label','Inicio');
var img = document.createElement('img');
var src = '';
if (desktopLogo) {
var img0 = desktopLogo.querySelector('img');
if (img0 && img0.getAttribute('src')) src = img0.getAttribute('src');
else {
var source = desktopLogo.querySelector('picture source');
if (source && source.getAttribute('srcset')) {
src = source.getAttribute('srcset').split(',')[0].trim().split(' ')[0];
}
}
}
if (!src) src = 'assets/img/logo.svg';
img.src = src; img.alt = 'Logo'; img.style.background = 'transparent';
a.appendChild(img);
header.appendChild(a);
function applyShrink(){
var y = window.pageYOffset || document.documentElement.scrollTop || 0;
if (y > 10) header.classList.add('shrink'); else header.classList.remove('shrink');
}
function syncHeight(){
img.style.height = (header.classList.contains('shrink') ? '56px' : '72px');
}
applyShrink(); syncHeight();
window.addEventListener('scroll', function(){ applyShrink(); syncHeight(); }, {passive:true});
new ResizeObserver(function(){ syncHeight(); }).observe(nav);
window.addEventListener('orientationchange', function(){ setTimeout(function(){ applyShrink(); syncHeight(); }, 150); });
});
})();