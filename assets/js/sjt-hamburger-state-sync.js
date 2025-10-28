(function(){
function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
ready(function(){
if (!window.matchMedia('(max-width: 991px)').matches) return;
var btn = document.getElementById('sjt-hamburger') ||
document.querySelector('.hamburger, .menu-toggle, button[aria-label*="menú" i], button[aria-label*="menu" i]');
if(!btn) return;
function drawer(){
return document.getElementById('sjt-mobile-drawer') ||
document.querySelector('.navbar-collapse, .offcanvas, .mobile-drawer, .nav-drawer, .menu-mobile');
}
function isOpen(){
var d = drawer();
if(d) return d.classList.contains('open') || d.classList.contains('show') || d.classList.contains('in');
return document.body.classList.contains('nav-open') || document.documentElement.classList.contains('nav-open');
}
function paint(){
if(isOpen()) btn.classList.add('is-open');
else btn.classList.remove('is-open');
}
paint();
var mo = new MutationObserver(paint);
[document.body, document.documentElement, drawer()].forEach(function(n){ if(n) mo.observe(n,{attributes:true, attributeFilter:['class']}); });
});
})();