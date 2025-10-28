(function(){function ready(fn){if(document.readyState!='loading'){fn()}else document.addEventListener('DOMContentLoaded',fn);}ready(function(){
var header=document.querySelector('header, .navbar, .site-header'); if(!header) return;
if(!document.getElementById('sjt-hamburger')){
var btn=document.createElement('button'); btn.id='sjt-hamburger'; btn.setAttribute('aria-label','Abrir menú');
btn.innerHTML='<span class="bar"></span><span class="bar"></span><span class="bar"></span>'; header.appendChild(btn);
var drawer=document.createElement('nav'); drawer.id='sjt-mobile-drawer'; document.body.appendChild(drawer);
var scrim=document.createElement('div'); scrim.id='sjt-mobile-scrim'; document.body.appendChild(scrim);
var navUL=document.querySelector('header nav ul, .navbar nav ul, .main-menu ul, nav ul, header nav, nav');
if(navUL){drawer.innerHTML='<h3 style="margin:0 0 10px 0;font-weight:700;">Menú</h3>'; navUL.querySelectorAll('a').forEach(function(a){var cl=a.cloneNode(true);cl.removeAttribute('class');drawer.appendChild(cl);});}
function open(){drawer.classList.add('open');scrim.classList.add('show');}
function close(){drawer.classList.remove('open');scrim.classList.remove('show');}
btn.addEventListener('click', function(ev){ ev.preventDefault(); ev.stopPropagation(); if(drawer.classList.contains('open')){ close(); btn.setAttribute('aria-expanded','false'); btn.classList.remove('is-open'); } else { open(); btn.setAttribute('aria-expanded','true'); btn.classList.add('is-open'); } });; scrim.addEventListener('click', function(){ close(); btn.setAttribute('aria-expanded','false'); btn.classList.remove('is-open'); });; drawer.addEventListener('click',function(e){if(e.target.tagName==='A') close();});
}
function hideStray(){if(window.matchMedia('(max-width: 991px)').matches){var h=document.querySelector('header, .navbar, .site-header'); if(!h) return; h.querySelectorAll('*').forEach(function(el){var t=(el.textContent||'').trim(); if(t && t.length<=10 && /PRODUC|PRODU|SERVI|MENU/i.test(t)){el.style.display='none';}});}}
hideStray(); window.addEventListener('resize', hideStray);
; document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ close(); btn.setAttribute('aria-expanded','false'); btn.classList.remove('is-open'); } });});})();