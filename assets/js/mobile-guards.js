(function(){
const mq = window.matchMedia('(max-width:1024px)');
function nukeDesktopNav(){
if(!mq.matches) return;
['.nav-links','.nav','.nav-inline','.navbar-nav','header nav','.menu','.menu--desktop','.top-menu','.main-menu']
.forEach(sel => document.querySelectorAll(sel).forEach(el=>{
el.style.display='none'; el.style.visibility='hidden'; el.style.pointerEvents='none';
el.style.width='0'; el.style.height='0'; el.style.overflow='hidden';
}));
const drawer = document.getElementById('sjt-mobile-drawer');
if (drawer) drawer.classList.remove('open','is-open');
const hdr = document.querySelector('header');
if (hdr) hdr.classList.remove('shrink','is-scrolled');
}
nukeDesktopNav();
mq.addEventListener('change', nukeDesktopNav);
window.addEventListener('scroll', nukeDesktopNav, {passive:true});
})();