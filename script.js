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
let frame = 0, rotation = 0, last = null;

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
  if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
}
function resume() {
  cancelAnimationFrame(frame); last = null;
  if (!document.hidden) frame = requestAnimationFrame(draw);
}
motion.addEventListener('change', resume);
document.addEventListener('visibilitychange', resume);
resume();


// Replay entrance effects for each page visit, including restored browser pages.
let revealObserver;
function initScrollReveals() {
  revealObserver?.disconnect();
  const targets = document.querySelectorAll('.exp-card, .media-panel, .quote-form, .genre-cloud span, .stat-row > div');
  document.documentElement.classList.remove('reveal-ready');
  targets.forEach(target => target.classList.remove('is-visible'));
  if (!('IntersectionObserver' in window) || motion.matches) return;
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, {threshold:.08, rootMargin:'0px 0px -24px 0px'});
  targets.forEach((target, index) => {
    target.setAttribute('data-reveal', '');
    target.style.setProperty('--reveal-delay', `${(index % 3) * 80}ms`);
    revealObserver.observe(target);
  });
  document.documentElement.classList.add('reveal-ready');
}
initScrollReveals();
window.addEventListener('pageshow', event => { if (event.persisted) initScrollReveals(); });
motion.addEventListener('change', initScrollReveals);
})();
