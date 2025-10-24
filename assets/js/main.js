(function(){
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = document.querySelector('.dots');
let idx = 0, t;
if (dots && dots.childElementCount === 0) {
slides.forEach((_, i) => {
const b = document.createElement("button");
b.setAttribute("aria-label", "Ir al slide " + (i+1));
b.addEventListener("click", () => { show(i); restart(); });
dots.appendChild(b);
});
}
function show(i){
slides.forEach((s,si)=>s.classList.toggle('active', si===i));
if(dots){
dots.querySelectorAll('button').forEach((b,bi)=>b.classList.toggle('active', bi===i));
}
idx=i;
}
function next(){ show((idx+1)%slides.length); }
function prev(){ show((idx-1+slides.length)%slides.length); }
if(dots){
slides.forEach((_,i)=>{
const b=document.createElement('button');
b.setAttribute('aria-label','Ir al slide '+(i+1));
b.addEventListener('click',()=>{show(i);restart();});
dots.appendChild(b);
});
}
document.querySelector('.arrow.left').addEventListener('click', ()=>{prev();restart();});
document.querySelector('.arrow.right').addEventListener('click', ()=>{next();restart();});
function start(){
const sliderEl = document.querySelector(".slider");
const interval = parseInt(sliderEl?.dataset?.interval) || 12000;
t = setInterval(next, interval);
}
function stop(){ clearInterval(t); }
function restart(){ stop(); start(); }
const slider=document.querySelector('.slider');
slider.addEventListener('mouseenter', stop);
slider.addEventListener('mouseleave', start);
document.addEventListener('visibilitychange', ()=>{ if(document.hidden) { clearInterval(t); } else { clearInterval(t); start(); }});
show(0);
start();
})();