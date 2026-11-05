(()=>{'use strict';const menuButton=document.getElementById('menuButton'),menu=document.getElementById('menu');menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));document.getElementById('year').textContent=new Date().getFullYear();// WhatsApp receives a prefilled message; the visitor confirms sending it.
const date = document.getElementById('date');
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const form = document.getElementById('quoteForm');
const result = document.getElementById('formResult');
const msg = document.getElementById('preparedMessage');
const whatsappLink = document.getElementById('whatsappLink');
const nameInput = document.getElementById('name');
nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const read = key => String(data.get(key) || '').trim();
  const name = read('name');
  if (!name) {
    nameInput.setCustomValidity('Informe seu nome para preparar o orçamento.');
    nameInput.reportValidity();
    return;
  }
  const type = read('type');
  const intros = {
    'Casamento': 'Queremos uma trilha sonora especial para o nosso casamento e gostaríamos de conhecer as propostas da banda.',
    'Festa / Aniversário': 'Quero levar música ao vivo e muita energia para minha festa e gostaria de receber uma proposta.',
    'Evento corporativo': 'Estou organizando um evento corporativo e gostaria de uma proposta de música ao vivo para essa ocasião.',
    'Outro': 'Estou planejando um evento e gostaria de conhecer os formatos de show e receber uma proposta personalizada.'
  };
  const rawDate = read('date');
  const eventDate = rawDate ? rawDate.split('-').reverse().join('/') : 'A definir';
  msg.value = [
    'Olá, equipe Onstage Vision! Conheci a banda pelo site.',
    '', intros[type] || intros.Outro, '',
    '*INFORMAÇÕES DO EVENTO*',
    `*Nome:* ${name}`,
    `*Tipo de evento:* ${type}`,
    `*Data prevista:* ${eventDate}`,
    `*Cidade:* ${read('city') || 'A definir'}`,
    `*Mais detalhes:* ${read('details') || 'Gostaria de conversar para definir os detalhes.'}`,
    '',
    rawDate ? 'Podem verificar a disponibilidade para essa data e me ajudar com as opções de formação, repertório e orçamento?' : 'Podem me ajudar a escolher o formato de show, o repertório e as opções de orçamento?'
  ].join('\n');
  whatsappLink.href = `https://wa.me/5513991811006?text=${encodeURIComponent(msg.value)}`;
  result.hidden = false;
  document.getElementById('copyMessage').textContent = 'Copiar mensagem';
  whatsappLink.click();
});
document.getElementById('copyMessage').addEventListener('click', async event => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(msg.value);
    button.textContent = 'Mensagem copiada ✓';
  } catch {
    msg.focus(); msg.select();
    button.textContent = 'Selecione e copie o texto';
  }
});
// Reference globe: black sphere, silver graticule, stationary wordmark and
// an upper-right sweep of light. Only the spherical mesh rotates.
const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');
const grid = document.createElement('canvas');
grid.width = grid.height = 900;
const gridCtx = grid.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const TAU = Math.PI * 2, cx = 450, cy = 450, radius = 334;
const axis = -.2;
let frame = 0, rotation = 0, last = null, globeOnscreen = true;

function project(lat, lon) {
  const cl = Math.cos(lat), x = cl * Math.sin(lon + rotation);
  const y = Math.sin(lat), z = cl * Math.cos(lon + rotation);
  return {
    x: cx + radius * x,
    y: cy - radius * (y * Math.cos(axis) - z * Math.sin(axis)),
    z: y * Math.sin(axis) + z * Math.cos(axis)
  };
}
function drawCurve(curve, front) {
  gridCtx.beginPath();
  let connected = false;
  for (let i=0; i<=240; i++) {
    const p = curve(i/240);
    if ((p.z >= 0) !== front) { connected = false; continue; }
    if (connected) gridCtx.lineTo(p.x, p.y); else gridCtx.moveTo(p.x, p.y);
    connected = true;
  }
  gridCtx.strokeStyle = front ? 'rgba(190,190,190,.56)' : 'rgba(155,155,155,.17)';
  gridCtx.lineWidth = front ? 1.65 : 1.1;
  gridCtx.stroke();
}
function drawLight() {
  const ox = cx, oy = cy - .2 * radius;
  const end = -.77;
  const px = cx + radius * Math.cos(end), py = cy + radius * Math.sin(end);
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, radius-2, 0, TAU); ctx.clip();
  // Fan from the reference's light source to the upper-right rim.
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(cx, cy-radius);
  ctx.arc(cx, cy, radius, -Math.PI/2, end); ctx.closePath();
  const fan = ctx.createLinearGradient(cx, cy-radius, px, py);
  fan.addColorStop(0, 'rgba(255,255,255,0)');
  fan.addColorStop(.35, 'rgba(255,255,255,.025)');
  fan.addColorStop(.75, 'rgba(255,255,255,.13)');
  fan.addColorStop(1, 'rgba(255,255,255,.65)');
  ctx.fillStyle = fan; ctx.fill();
  // The tapered beam ends above the lettering and never crosses the logo.
  const edge = ctx.createLinearGradient(ox, oy, px, py);
  edge.addColorStop(0, 'rgba(255,255,255,.3)');
  edge.addColorStop(.8, 'rgba(255,255,255,.85)');
  edge.addColorStop(1, '#fff');
  ctx.strokeStyle = edge; ctx.lineWidth = 1.8;
  ctx.shadowColor = '#fff'; ctx.shadowBlur = 11;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(px, py); ctx.stroke();
  ctx.fillStyle = '#efefeb'; ctx.shadowBlur = 13;
  ctx.beginPath(); ctx.arc(ox, oy, 5.5, 0, TAU); ctx.fill();
  ctx.restore();
}
function draw(t) {
  frame = 0;
  const dt = last === null ? 0 : Math.min((t-last)/1000, .06);
  last = t;
  if (!motion.matches) rotation = (rotation + dt * TAU/28) % TAU;
  ctx.clearRect(0, 0, 900, 900);
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, radius-1, 0, TAU); ctx.clip();
  gridCtx.clearRect(0, 0, 900, 900);
  for (const front of [false, true]) {
    for (let i=-4; i<=4; i++) {
      const lat = i * Math.PI/10;
      drawCurve(u => project(lat, -Math.PI + u * TAU), front);
    }
    for (let i=0; i<16; i++) {
      const lon = i * Math.PI/8;
      drawCurve(u => project(-Math.PI/2 + u * Math.PI, lon), front);
    }
  }
  // Fade the mesh gently behind the lettering, retaining the reference's curves.
  gridCtx.save(); gridCtx.globalCompositeOperation = 'destination-out';
  const quiet = gridCtx.createLinearGradient(0, 408, 0, 555);
  quiet.addColorStop(0, 'rgba(0,0,0,0)');
  quiet.addColorStop(.22, 'rgba(0,0,0,.8)');
  quiet.addColorStop(.8, 'rgba(0,0,0,.8)');
  quiet.addColorStop(1, 'rgba(0,0,0,0)');
  gridCtx.fillStyle = quiet; gridCtx.fillRect(155, 408, 590, 147);
  gridCtx.restore(); ctx.drawImage(grid, 0, 0);
  ctx.restore();
  const rim = ctx.createLinearGradient(cx-radius, cy-radius, cx+radius, cy+radius);
  rim.addColorStop(0, '#909090'); rim.addColorStop(.3, '#545454');
  rim.addColorStop(.65, '#292929'); rim.addColorStop(1, '#686868');
  ctx.strokeStyle = rim; ctx.lineWidth = 3.2;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(190,190,190,.18)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, radius-4, 0, TAU); ctx.stroke();
  drawLight();
  if (!motion.matches && !document.hidden && globeOnscreen) frame = requestAnimationFrame(draw);
}
function resume() {
  cancelAnimationFrame(frame); last = null;
  if (!document.hidden && globeOnscreen) frame = requestAnimationFrame(draw);
}
motion.addEventListener('change', resume);
document.addEventListener('visibilitychange', resume);
resume();
// Suspend the canvas when visitors are reading lower sections on mobile.
if ('IntersectionObserver' in window) {
  const globeVisibility = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible !== globeOnscreen) { globeOnscreen = visible; resume(); }
  }, {rootMargin:'160px 0px'});
  globeVisibility.observe(canvas);
}

// A scene starts with its heading, followed by copy and staggered cards.
// Keep the published wording and tags intact while exposing each heading line.
let revealObserver, sceneObserver;
const previewSections = [...document.querySelectorAll('main > section')];
const revealSelector = '.exp-card, .media-panel, .quote-form, .genre-cloud span, .stat-row > div, .section-heading > p, .about-layout > div > p, .contact-copy > p';
function splitHeadingLines() {
  document.querySelectorAll('.hero h1, main > section h2').forEach(heading => {
    if (heading.dataset.motionSplit) return;
    heading.querySelectorAll('span').forEach(span => span.classList.add('original-heading-span'));
    const lines = heading.innerHTML.split(/<br\s*\/?>/i);
    heading.innerHTML = lines.map((line, i) => `<span class="motion-line"><span class="motion-line-inner" style="--line-index:${i}">${line}</span></span>`).join('');
    heading.dataset.motionSplit = 'true';
  });
}
function initScrollReveals() {
  revealObserver?.disconnect(); sceneObserver?.disconnect();
  const targets = [...document.querySelectorAll(revealSelector)];
  document.documentElement.classList.remove('reveal-ready', 'scene-ready');
  targets.forEach(target => target.classList.remove('is-visible'));
  previewSections.forEach(section => section.classList.remove('scene-active'));
  if (!('IntersectionObserver' in window) || motion.matches) return;
  splitHeadingLines();
  sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scene-active');
      sceneObserver.unobserve(entry.target);
    });
  }, {threshold:0, rootMargin:'0px 0px -12% 0px'});
  previewSections.forEach(section => sceneObserver.observe(section));
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {threshold:.12, rootMargin:'0px 0px -5% 0px'});
  targets.forEach(target => {
    target.setAttribute('data-reveal', '');
    const parent = target.parentElement;
    const siblings = [...parent.children].filter(node => node.matches(revealSelector));
    const index = Math.max(0, siblings.indexOf(target));
    const kind = target.matches('.exp-card') ? 'card' : target.matches('.media-panel,.quote-form') ? 'panel' : 'copy';
    target.dataset.revealKind = kind;
    target.style.setProperty('--reveal-delay', `${Math.min(index * 140, 420)}ms`);
    revealObserver.observe(target);
  });
  document.documentElement.classList.add('reveal-ready', 'scene-ready');
}
initScrollReveals();
window.addEventListener('pageshow', event => { if (event.persisted) initScrollReveals(); });
motion.addEventListener('change', initScrollReveals);
// Reversible depth introduction. Normal document scrolling drives a reversible
// transform on a shell; the approved canvas, wordmark and texture stay together.
(function initDepthIntroduction() {
  const hero = document.getElementById('inicio');
  const inner = hero.querySelector('.hero-inner');
  const globe = hero.querySelector('.sphere-wrap');
  const copy = hero.querySelector('.hero-copy');
  const hint = hero.querySelector('.scroll-indicator');
  const pin = document.createElement('div');
  pin.className = 'depth-pin';
  while (hero.firstChild) pin.append(hero.firstChild);
  hero.append(pin);
  const shell = document.createElement('div');
  shell.className = 'globe-depth-shell';
  globe.before(shell); shell.append(globe);
  const band = copy.querySelector('.eyebrow').cloneNode(true);
  band.classList.add('depth-band');
  band.setAttribute('aria-hidden', 'true');
  pin.append(band);
  let metrics = null, queued = false, lastProgress = -1, enabled = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => value * value * (3 - 2 * value);
  function render(force = false) {
    queued = false;
    if (!enabled || !metrics) return;
    const p = clamp((window.scrollY - metrics.top) / metrics.travel);
    if (!force && Math.abs(p - lastProgress) < .0001) return;
    lastProgress = p;
    const retreat = 1 - smooth(p);
    const copyVisible = smooth(clamp((p - .68) / .3));
    shell.style.setProperty('--depth-x', `${metrics.dx * retreat}px`);
    shell.style.setProperty('--depth-y', `${metrics.dy * retreat}px`);
    shell.style.setProperty('--depth-scale', String(1 + (metrics.scale - 1) * retreat));
    copy.style.setProperty('--depth-copy-opacity', String(copyVisible));
    copy.style.setProperty('--depth-copy-shift', `${26 * (1-copyVisible)}px`);
    copy.style.pointerEvents = copyVisible > .8 ? '' : 'none';
    band.style.opacity = String(1 - smooth(clamp((p - .12) / .32)));
    hint.style.opacity = String(1 - smooth(clamp((p - .08) / .3)));
  }
  function requestRender() {
    if (!queued && enabled) { queued = true; requestAnimationFrame(() => render()); }
  }
  function measure() {
    hero.classList.add('depth-measuring');
    // svh stays stable when mobile browser toolbars open and close.
    const viewport = parseFloat(getComputedStyle(pin).minHeight) || window.innerHeight;
    enabled = !motion.matches && viewport >= 560;
    hero.classList.toggle('depth-mode', enabled);
    if (!enabled) {
      metrics = null;
      copy.style.pointerEvents = '';
      hint.style.opacity = '';
      hero.style.removeProperty('--depth-total-height');
      hero.classList.remove('depth-measuring');
      return;
    }
    // Measure the shell without its own transform; restore it before paint.
    shell.style.transform = 'none';
    const rect = shell.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const headerHeight = document.querySelector('.header').getBoundingClientRect().height;
    const diameter = Math.max(180, Math.min(innerWidth * .94, viewport * .82, viewport-headerHeight-130));
    const centerY = Math.min(Math.max(viewport*.46, headerHeight+diameter/2+16), viewport-diameter/2-116);
    const travel = Math.round(viewport * .8);
    metrics = {
      top: hero.getBoundingClientRect().top + scrollY,
      travel,
      dx: innerWidth/2 - (rect.left + rect.width/2),
      dy: centerY - (rect.top-pinRect.top + rect.height/2),
      scale: diameter / (rect.width * (668/900))
    };
    hero.style.setProperty('--depth-total-height', `${inner.offsetHeight + travel}px`);
    hero.style.setProperty('--depth-viewport-height', `${viewport}px`);
    band.style.top = `${centerY + diameter/2 + 25}px`;
    shell.style.transform = '';
    hero.classList.remove('depth-measuring');
    lastProgress = -1;
    render(true);
  }
  let measureQueued = false;
  function requestMeasure() {
    if (measureQueued) return;
    measureQueued = true;
    requestAnimationFrame(() => { measureQueued = false; measure(); });
  }
  window.addEventListener('scroll', requestRender, {passive:true});
  window.addEventListener('resize', requestMeasure, {passive:true});
  window.addEventListener('pageshow', requestMeasure);
  motion.addEventListener('change', requestMeasure);
  copy.addEventListener('focusin', () => {
    if (enabled && metrics && lastProgress < .98) {
      window.scrollTo({top:metrics.top+metrics.travel, behavior:'instant'});
      render(true);
    }
  });
  measure();
  if (document.fonts) document.fonts.ready.then(requestMeasure);
})();

})();
