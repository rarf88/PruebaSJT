(function(){
function centerLogo(){
if (window.innerWidth > 1024) return;
var nav = document.querySelector('header.site-header nav.nav');
if(!nav) return;
var logo = nav.querySelector('.logo');
if(!logo) return;
var toggler = nav.querySelector('.navbar-toggler, .hamburger, #sjt-hamburger, .menu-toggle, button.navbar-toggler');
var leftPad = 88, rightPad = 88;
if (toggler){
var rect = toggler.getBoundingClientRect();
if (rect.width){
rightPad = Math.max(88, Math.ceil(rect.width + 48));
}
}
nav.style.paddingLeft = leftPad + 'px';
nav.style.paddingRight = rightPad + 'px';
nav.style.position = 'relative';
logo.style.position = 'absolute';
logo.style.left = '50%';
logo.style.top = '50%';
logo.style.transform = 'translate(-50%, -50%)';
logo.style.margin = '0';
logo.style.zIndex = '2';
if (toggler){
toggler.style.position = 'absolute';
toggler.style.right = '10px';
toggler.style.top = '50%';
toggler.style.transform = 'translateY(-50%)';
toggler.style.zIndex = '3';
}
}
window.addEventListener('DOMContentLoaded', centerLogo);
window.addEventListener('resize', centerLogo);
window.addEventListener('orientationchange', centerLogo);
})();