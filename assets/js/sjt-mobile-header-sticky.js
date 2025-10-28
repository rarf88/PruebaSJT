(function(){
function ready(fn){ if(document.readyState!='loading'){fn()} else document.addEventListener('DOMContentLoaded',fn); }
if (!window.matchMedia('(max-width: 991px)').matches) return;
ready(function(){
var header = document.querySelector('header, .navbar, .site-header');
if(!header) return;
function setOffset(){
var h = header.getBoundingClientRect().height || 64;
document.body.style.setProperty('--sjt-header-offset', h+'px');
}
setOffset(); window.addEventListener('resize', setOffset);
var last=0;
window.addEventListener('scroll', function(){
var y = window.scrollY || window.pageYOffset;
if (y > 30 && !header.classList.contains('sjt-shrink')) header.classList.add('sjt-shrink');
if (y <= 30 && header.classList.contains('sjt-shrink')) header.classList.remove('sjt-shrink');
last=y;
}, {passive:true});
});
})();