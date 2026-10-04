/* Animações do site do Auroris */
(() => {
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Coisas que surgem ao rolar a página ===== */
  const surgir = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visivel');
    surgir.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  // irmãos surgem um depois do outro
  document.querySelectorAll('.surge').forEach(el => {
    const irmaos = [...el.parentElement.children].filter(x => x.classList.contains('surge'));
    el.style.setProperty('--atraso', (irmaos.indexOf(el) * 90) + 'ms');
    surgir.observe(el);
  });

  /* ===== Vitrine: a janela do Auroris troca de tela sozinha ===== */
  const telas = [...document.querySelectorAll('#janela-telas img')], abas = [...document.querySelectorAll('#abas button')];
  const prog = document.getElementById('progresso'), TEMPO = 5000;
  let atual = 0, inicio = performance.now(), pausado = false, visivel = false;
  const mostrar = i => {
    atual = (i + telas.length) % telas.length;
    telas.forEach((t, k) => t.classList.toggle('ativa', k === atual));
    abas.forEach((a, k) => { a.classList.toggle('ativa', k === atual); a.setAttribute('aria-selected', k === atual); });
    inicio = performance.now();
  };
  abas.forEach((a, k) => a.addEventListener('click', () => mostrar(k)));
  const vit = document.getElementById('vitrine');
  vit.addEventListener('mouseenter', () => pausado = true);
  vit.addEventListener('mouseleave', () => { pausado = false; inicio = performance.now() - parseFloat(prog.style.width || 0) / 100 * TEMPO; });
  new IntersectionObserver(es => { visivel = es[0].isIntersecting; if (visivel) inicio = performance.now(); }, { threshold: .3 }).observe(vit);
  const ciclo = t => {
    if (visivel && !pausado && !calmo) {
      const p = (t - inicio) / TEMPO;
      prog.style.width = Math.min(100, p * 100) + '%';
      if (p >= 1) mostrar(atual + 1);
    }
    requestAnimationFrame(ciclo);
  };
  requestAnimationFrame(ciclo);
  // clicar na tela mostra ela grande
  const amp = document.getElementById('ampliada'), ampImg = amp.querySelector('img');
  document.getElementById('janela-telas').addEventListener('click', () => { ampImg.src = telas[atual].src; ampImg.alt = telas[atual].alt; amp.classList.add('aberta'); pausado = true; });
  amp.addEventListener('click', () => { amp.classList.remove('aberta'); pausado = false; });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { amp.classList.remove('aberta'); pausado = false; }
    if (amp.classList.contains('aberta') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { mostrar(atual + (e.key === 'ArrowRight' ? 1 : -1)); ampImg.src = telas[atual].src; }
  });

  /* ===== Cartões acompanham o mouse (brilho dourado onde o ponteiro está) ===== */
  document.querySelectorAll('.recurso, .passo').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));
})();
