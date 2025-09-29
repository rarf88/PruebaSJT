document.addEventListener('DOMContentLoaded', function(){
  const labels = ['Solicitar demo','Solicitar demo »','Hablar con un asesor','Hablar con un asesor »'];
  const targets = Array.from(document.querySelectorAll('a,button')).filter(el => labels.includes((el.textContent||'').trim()));
  if (targets.length) {
    const candidate = targets[0].closest('.card, .cta, .cta-panel, .sticky-cta, .legacy-cta-card, .col, .container, div');
    if (candidate) candidate.remove();
    else targets.forEach(t=>t.remove());
  }
});