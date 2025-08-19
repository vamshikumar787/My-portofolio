// Main interactions and AI/ML animated background
document.addEventListener('DOMContentLoaded', () => {
  // Update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll + active nav highlight
  document.querySelectorAll('a.nav-link, a.btn').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="${href}"]`);
        link?.classList.add('active');
      }
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('show');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Typewriter role text
  const role = document.querySelector('.role');
  if (role) {
    const phrases = (role.dataset.text || 'AI Developer • ML Enthusiast • Full Stack Engineer').split('•').map(s => s.trim()).filter(Boolean);
    let i = 0, j = 0, deleting = false;
    const loop = () => {
      const phrase = phrases[i] || '';
      role.textContent = deleting ? phrase.slice(0, j--) : phrase.slice(0, j++);
      role.classList.add('type-caret');
      if (!deleting && j === phrase.length + 3) { deleting = true; setTimeout(loop, 800); }
      else if (deleting && j < 0) { deleting = false; i = (i + 1) % phrases.length; setTimeout(loop, 300); }
      else setTimeout(loop, deleting ? 40 : 60);
    };
    if (phrases.length) loop();
  }

  // Contact form demo (replace with real endpoint)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) status.textContent = 'Sending...';
    // TODO: Replace with Formspree/Netlify/EmailJS
    await new Promise(r => setTimeout(r, 800));
    if (status) status.textContent = 'Thanks! I will get back to you soon.';
    form.reset();
  });

  // Certifications accordion
  initCertAccordion();

  // Initialize AI/ML animated background
  initAIMLBg();
});

// Accordion behavior with auto-scroll and auto-collapse
function initCertAccordion(){
  const items = Array.from(document.querySelectorAll('.cert-item'));
  if (!items.length) return;
  const heads = items.map(i => i.querySelector('.cert-head')).filter(Boolean);

  function openItem(el, scroll=true){
    items.forEach(i => { if(i !== el) i.classList.remove('active'); });
    const willOpen = !el.classList.contains('active');
    if (willOpen) el.classList.add('active'); else el.classList.remove('active');
    if (willOpen && scroll) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  heads.forEach(head=>{
    head.addEventListener('click', ()=>{
      const parent = head.closest('.cert-item');
      if (parent) {
        openItem(parent, true);
        if (parent.id) history.replaceState(null, '', '#' + parent.id);
      }
    });
  });

  // Open from URL hash on load
  if (location.hash){
    const target = document.querySelector(location.hash);
    if (target && target.classList.contains('cert-item')){
      target.classList.add('active');
      setTimeout(()=>target.scrollIntoView({behavior:'smooth', block:'start'}), 150);
    }
  }
}

// AI/ML neural background with flowing lines
function initAIMLBg() {
  const c = document.getElementById('aiBg');
  if (!c) return;

  const ctx = c.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  const nodes = [];
  const edges = [];
  const NODE_COUNT_MOBILE = 40;
  const NODE_COUNT_DESKTOP = 80;
  let NODE_COUNT = window.innerWidth < 768 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
  const MAX_DIST = 150;

  function setSize() {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    c.width = Math.floor(cssW * dpr);
    c.height = Math.floor(cssH * dpr);
    c.style.width = cssW + 'px';
    c.style.height = cssH + 'px';
    w = c.width;
    h = c.height;
  }
  setSize();

  window.addEventListener('resize', () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    NODE_COUNT = window.innerWidth < 768 ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    setSize();
    nodes.length = 0;
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
  }, { passive: true });

  function rand(a, b) { return Math.random() * (b - a) + a; }
  function makeNode() {
    return {
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
      r: rand(1.2, 2.2) * dpr,
      q: Math.random() < 0.5 ? 'violet' : 'cyan'
    };
  }
  for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());

  // Flowing soft “code-like” lanes
  const lanes = Array.from({ length: 8 }, (_, i) => ({ y: i / 8, t: rand(0, 10) }));

  function drawFlow() {
    const time = performance.now() / 1000;
    ctx.save();
    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = 'rgba(148,163,184,0.06)';
    for (const lane of lanes) {
      const baseY = (lane.y * h + Math.sin(time + lane.t) * 10 * dpr);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 20 * dpr) {
        const yy = baseY + Math.sin((x * 0.002) + time + lane.t) * 8 * dpr;
        if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // Background soft lines
    drawFlow();

    // Compute edges
    edges.length = 0;
    const maxd = MAX_DIST * dpr;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxd) edges.push([i, j, dist]);
      }
    }

    // Draw edges
    for (const [i, j, dist] of edges) {
      const a = 1 - (dist / (MAX_DIST * dpr));
      ctx.strokeStyle = `rgba(${nodes[i].q === 'violet' ? '124,58,237' : '6,182,212'},${0.15 * a})`;
      ctx.lineWidth = 0.7 * dpr * a;
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
    }

    // Draw nodes and update positions
    for (const n of nodes) {
      n.x += n.vx * dpr; n.y += n.vy * dpr;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 6 * dpr);
      if (n.q === 'violet') {
        grd.addColorStop(0, 'rgba(124,58,237,0.9)');
        grd.addColorStop(1, 'rgba(124,58,237,0)');
      } else {
        grd.addColorStop(0, 'rgba(6,182,212,0.9)');
        grd.addColorStop(1, 'rgba(6,182,212,0)');
      }
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  step();
}
