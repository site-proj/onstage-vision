(()=>{'use strict';const menuButton=document.getElementById('menuButton'),menu=document.getElementById('menu');menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu')}));document.getElementById('year').textContent=new Date().getFullYear();const date=document.getElementById('date');date.min=new Date().toISOString().slice(0,10);const form=document.getElementById('quoteForm'),result=document.getElementById('formResult'),msg=document.getElementById('preparedMessage');form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);let d=String(data.get('date')||'');if(d){const p=d.split('-');d=`${p[2]}/${p[1]}/${p[0]}`}msg.value=`Olá, equipe Onstage Vision! Quero conversar sobre um orçamento.\n\nNome: ${data.get('name')}\nEvento: ${data.get('type')}\nData: ${d||'A definir'}\nCidade: ${data.get('city')||'A definir'}\nDetalhes: ${data.get('details')||'A definir'}`;result.hidden=false;result.scrollIntoView({behavior:'smooth',block:'nearest'})});document.getElementById('copyMessage').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(msg.value);e.currentTarget.textContent='Mensagem copiada ✓'}catch{msg.focus();msg.select();e.currentTarget.textContent='Selecione e copie o texto'}});
// All globe geometry uses one coordinate system. The rear orbit is occluded
// by the opaque sphere; the front orbit stays below the stationary wordmark.
const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');
const grid = document.createElement('canvas');
grid.width = grid.height = 900;
const gridCtx = grid.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0, rotation = .4, last = null;
const TAU = Math.PI * 2;
const cx = 450, cy = 450, radius = 334;

function orbitPoint(angle) {
  const x = 409 * Math.cos(angle), y = 140 * Math.sin(angle);
  const tilt = -.2;
  return {
    x: cx + x * Math.cos(tilt) - y * Math.sin(tilt),
    y: cy + 55 + x * Math.sin(tilt) + y * Math.cos(tilt)
  };
}
function drawOrbit(front) {
  const start = front ? 0 : Math.PI;
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= 180; i++) {
    const p = orbitPoint(start + i * Math.PI / 180);
    if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
  }
  const silver = ctx.createLinearGradient(40, 0, 860, 0);
  silver.addColorStop(0, '#969696');
  silver.addColorStop(.45, front ? '#e5e5e5' : '#909090');
  silver.addColorStop(.8, front ? '#fafafa' : '#b2b2b2');
  silver.addColorStop(1, '#969696');
  ctx.strokeStyle = silver;
  ctx.lineWidth = 2;
  ctx.globalAlpha = front ? .85 : .4;
  ctx.shadowColor = '#d8d8d8';
  ctx.shadowBlur = front ? 10 : 4;
  ctx.stroke();
  ctx.restore();
}
function project(lat, lon) {
  const cl = Math.cos(lat);
  const x = cl * Math.sin(lon + rotation);
  const z = cl * Math.cos(lon + rotation);
  const y = Math.sin(lat);
  // A slightly tilted axis gives the wireframe depth while it rotates.
  const tilt = .12;
  return {
    x: cx + radius * (x * Math.cos(tilt) - y * Math.sin(tilt)),
    y: cy - radius * (x * Math.sin(tilt) + y * Math.cos(tilt)), z
  };
}
function drawCurve(curve) {
  gridCtx.beginPath();
  let connected = false;
  for (let i = 0; i <= 240; i++) {
    const p = curve(i / 240);
    if (p.z < 0) { connected = false; continue; }
    if (connected) gridCtx.lineTo(p.x, p.y); else gridCtx.moveTo(p.x, p.y);
    connected = true;
  }
  gridCtx.strokeStyle = 'rgba(210,210,210,.34)';
  gridCtx.lineWidth = 1.5;
  gridCtx.stroke();
}
function draw(t) {
  frame = 0;
  const dt = last === null ? 0 : Math.min((t - last) / 1000, .06);
  last = t;
  if (!motion.matches) rotation = (rotation + dt * TAU / 28) % TAU;
  ctx.clearRect(0, 0, 900, 900);
  drawOrbit(false);
  const shade = ctx.createRadialGradient(cx-120, cy-180, 25, cx, cy, radius+22);
  shade.addColorStop(0, '#2b2b2b');
  shade.addColorStop(.34, '#121212');
  shade.addColorStop(.76, '#080808');
  shade.addColorStop(1, '#000000');
  ctx.fillStyle = shade;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, radius-2, 0, TAU); ctx.clip();
  gridCtx.clearRect(0, 0, 900, 900);
  for (let i=-4; i<=4; i++) {
    const lat = i * Math.PI / 10;
    drawCurve(u => project(lat, -Math.PI + u * TAU));
  }
  for (let i=0; i<14; i++) {
    const lon = i * Math.PI / 7;
    drawCurve(u => project(-Math.PI/2 + u * Math.PI, lon));
  }
  // Feather grid lines around the lettering instead of ending them abruptly.
  gridCtx.save();
  gridCtx.globalCompositeOperation = 'destination-out';
  const quiet = gridCtx.createLinearGradient(0, 355, 0, 545);
  quiet.addColorStop(0, 'rgba(0,0,0,0)');
  quiet.addColorStop(.23, '#000'); quiet.addColorStop(.77, '#000');
  quiet.addColorStop(1, 'rgba(0,0,0,0)');
  gridCtx.fillStyle = quiet; gridCtx.fillRect(150, 355, 600, 190);
  gridCtx.restore();
  ctx.drawImage(grid, 0, 0);
  ctx.restore();
  const rim = ctx.createLinearGradient(cx-radius,cy-radius,cx+radius,cy+radius);
  rim.addColorStop(0, '#ececec'); rim.addColorStop(.3, '#8b8b8b');
  rim.addColorStop(.6, '#3e3e3e'); rim.addColorStop(.85, '#e7e7e7');
  rim.addColorStop(1, '#737373');
  ctx.strokeStyle = rim; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.stroke();
  // Soft tangential light on the rim replaces the detached radial dash.
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rotation - 1.9);
  ctx.lineCap = 'round'; ctx.shadowColor = '#e7e7e7'; ctx.shadowBlur = 15;
  for (let i=0; i<32; i++) {
    const a = -.23 + i * .46 / 32;
    ctx.strokeStyle = `rgba(244,244,244,${Math.sin(Math.PI * (i+.5)/32)*.65})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, radius, a, a+.46/32+.002); ctx.stroke();
  }
  ctx.restore();
  drawOrbit(true);
  if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
}
function resume() {
  cancelAnimationFrame(frame);
  last = null;
  if (!document.hidden) frame = requestAnimationFrame(draw);
}
motion.addEventListener('change', resume);
document.addEventListener('visibilitychange', resume);
resume();

})();
