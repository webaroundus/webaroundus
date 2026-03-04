// ===== Language Switching =====
let currentLang = 'ka';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all elements with data-ka / data-en attributes
  document.querySelectorAll('[data-ka][data-en]').forEach(el => {
    if (el.tagName === 'OPTION') {
      el.textContent = el.getAttribute('data-' + lang);
    } else {
      el.innerHTML = el.getAttribute('data-' + lang);
    }
  });

  // Update placeholders on inputs/textareas
  document.querySelectorAll('[data-placeholder-ka][data-placeholder-en]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update page title
  document.title = lang === 'ka'
    ? 'WebAroundUs - ლამაზი და მომგებიანი ვებსაიტები თქვენი ბიზნესისთვის'
    : 'WebAroundUs - Beautiful and Profitable Websites for Your Business';

  // Save preference
  localStorage.setItem('webaroundus-lang', lang);
}

// Language switch buttons
document.getElementById('langSwitch').addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (btn && btn.dataset.lang !== currentLang) {
    setLanguage(btn.dataset.lang);
  }
});

// Load saved preference (default: ka)
const savedLang = localStorage.getItem('webaroundus-lang');
if (savedLang && savedLang !== 'ka') {
  setLanguage(savedLang);
}

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== Scroll Animations =====
const animateElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
      setTimeout(() => {
        entry.target.classList.add('animate-in');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
animateElements.forEach(el => observer.observe(el));

// ===== Counter Animation =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// ===== Form Handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"] span');
    const origKa = btn.getAttribute('data-ka');
    const origEn = btn.getAttribute('data-en');
    btn.textContent = currentLang === 'ka' ? 'გაგზავნილია! ✓' : 'Message Sent! ✓';
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = currentLang === 'ka' ? origKa : origEn;
    }, 3000);
  });
}

// ===== Active Nav Highlight =====
const sections = document.querySelectorAll('.section, .hero');
const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinksAll.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#818cf8';
    }
  });
});

// ===== Project Card Tilt =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'translateY(-8px) perspective(1000px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');
    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
    // Open clicked if wasn't active
    if (!isActive) item.classList.add('active');
  });
});

// ===== Hero Parallax on Scroll =====
const heroGlow1 = document.querySelector('.hero-glow-1');
const heroGlow2 = document.querySelector('.hero-glow-2');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    const speed = scrollY * 0.3;
    if (heroGlow1) heroGlow1.style.transform = 'translate(' + (speed * 0.2) + 'px, ' + (speed * 0.5) + 'px)';
    if (heroGlow2) heroGlow2.style.transform = 'translate(-' + (speed * 0.15) + 'px, ' + (speed * 0.3) + 'px)';
  }
});

// ===== Code System Background (About → Contact) =====
(function () {
  const canvas = document.getElementById('codeSystemCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const wrapper = document.getElementById('codeBgWrapper');
  let w, h, dpr;
  let animId;
  let isVisible = false;
  let mouseX = -1000, mouseY = -1000;
  let mouseActive = false;

  const nodes = [];
  const streams = [];
  const particles = [];

  // Track mouse position relative to the wrapper
  wrapper.style.pointerEvents = 'auto';
  wrapper.addEventListener('mousemove', function (e) {
    const rect = wrapper.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top + wrapper.scrollTop;
    mouseActive = true;
  });
  wrapper.addEventListener('mouseleave', function () {
    mouseActive = false;
    mouseX = -1000;
    mouseY = -1000;
  });

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = wrapper.offsetWidth;
    h = wrapper.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initElements();
  }

  function initElements() {
    // Grid nodes
    nodes.length = 0;
    var spacingX = 90;
    var spacingY = 90;
    for (var x = spacingX; x < w; x += spacingX) {
      for (var y = spacingY; y < h; y += spacingY) {
        if (Math.random() > 0.55) {
          nodes.push({
            homeX: x + (Math.random() - 0.5) * 25,
            homeY: y + (Math.random() - 0.5) * 25,
            x: x + (Math.random() - 0.5) * 25,
            y: y + (Math.random() - 0.5) * 25,
            vx: 0,
            vy: 0,
            radius: Math.random() * 2.2 + 1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.4 + Math.random() * 1.2,
            opacity: 0.12 + Math.random() * 0.22
          });
        }
      }
    }

    // Data streams
    streams.length = 0;
    var streamCount = Math.floor(h / 140) + 4;
    for (var i = 0; i < streamCount; i++) {
      var stream = {
        y: (h / (streamCount + 1)) * (i + 1) + (Math.random() - 0.5) * 40,
        speed: 0.3 + Math.random() * 0.7,
        dir: Math.random() > 0.5 ? 1 : -1,
        segments: [],
        opacity: 0.035 + Math.random() * 0.05
      };
      var segCount = 3 + Math.floor(Math.random() * 5);
      for (var s = 0; s < segCount; s++) {
        stream.segments.push({
          x: Math.random() * w * 1.5 - w * 0.25,
          length: 50 + Math.random() * 140,
          thickness: 0.8 + Math.random() * 1.5,
          glow: Math.random() > 0.7
        });
      }
      streams.push(stream);
    }

    // Floating code particles
    particles.length = 0;
    var pCount = Math.floor((w * h) / 18000);
    for (var i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        homeX: 0,
        homeY: 0,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.08 - Math.random() * 0.35,
        size: 1 + Math.random() * 2,
        opacity: 0.08 + Math.random() * 0.25,
        char: ['0', '1', '<', '>', '/', '{', '}', ';', '(', ')', '=', '+', '#', '*', '&', '|'][Math.floor(Math.random() * 16)],
        useChar: Math.random() > 0.45,
        life: Math.random() * 200
      });
    }
  }

  // Mouse repulsion force
  var REPEL_RADIUS = 120;
  var REPEL_FORCE = 8;

  function updateNodePositions() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      if (mouseActive) {
        var dx = n.x - mouseX;
        var dy = n.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 0) {
          var force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
          var angle = Math.atan2(dy, dx);
          n.vx += Math.cos(angle) * force;
          n.vy += Math.sin(angle) * force;
        }
      }

      // Spring back to home position
      var springX = (n.homeX - n.x) * 0.03;
      var springY = (n.homeY - n.y) * 0.03;
      n.vx += springX;
      n.vy += springY;

      // Damping
      n.vx *= 0.88;
      n.vy *= 0.88;

      n.x += n.vx;
      n.y += n.vy;
    }
  }

  function drawGrid(time) {
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.025)';
    ctx.lineWidth = 0.5;
    var sp = 90;
    for (var x = sp; x < w; x += sp) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (var y = sp; y < h; y += sp) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }

  function drawNodes(time) {
    // Connections between nearby nodes
    ctx.lineWidth = 0.5;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          var alpha = (1 - dist / 130) * 0.07;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
          ctx.stroke();
        }
      }
    }

    // Draw each node
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var pulse = Math.sin(time * n.pulseSpeed + n.pulse);
      var r = n.radius + pulse * 0.8;
      var alpha = n.opacity + pulse * 0.08;

      // Check distance to mouse for highlight
      var mouseDist = 9999;
      if (mouseActive) {
        var mdx = n.x - mouseX;
        var mdy = n.y - mouseY;
        mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);
      }
      var highlight = mouseDist < REPEL_RADIUS ? (1 - mouseDist / REPEL_RADIUS) * 0.5 : 0;

      // Outer glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * (4 + highlight * 3), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, ' + (alpha * 0.12 + highlight * 0.1) + ')';
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + highlight * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, ' + (alpha + highlight * 0.4) + ')';
      ctx.fill();
    }
  }

  function drawStreams(time) {
    for (var i = 0; i < streams.length; i++) {
      var stream = streams[i];
      for (var s = 0; s < stream.segments.length; s++) {
        var seg = stream.segments[s];
        seg.x += stream.speed * stream.dir;
        if (stream.dir > 0 && seg.x > w + 60) seg.x = -seg.length - 60;
        if (stream.dir < 0 && seg.x < -seg.length - 60) seg.x = w + 60;

        var grad = ctx.createLinearGradient(seg.x, 0, seg.x + seg.length, 0);
        grad.addColorStop(0, 'rgba(99, 102, 241, 0)');
        grad.addColorStop(0.3, 'rgba(99, 102, 241, ' + stream.opacity + ')');
        grad.addColorStop(0.7, 'rgba(139, 92, 246, ' + stream.opacity + ')');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.moveTo(seg.x, stream.y);
        ctx.lineTo(seg.x + seg.length, stream.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = seg.thickness;
        ctx.stroke();

        if (seg.glow) {
          ctx.beginPath();
          ctx.moveTo(seg.x, stream.y);
          ctx.lineTo(seg.x + seg.length, stream.y);
          ctx.strokeStyle = 'rgba(129, 140, 248, ' + (stream.opacity * 0.4) + ')';
          ctx.lineWidth = seg.thickness + 3;
          ctx.stroke();
        }
      }
    }
  }

  function drawParticles(time) {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;

      // Mouse repulsion on particles too
      if (mouseActive) {
        var dx = p.x - mouseX;
        var dy = p.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          var force = (1 - dist / 80) * 1.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; p.life = 0; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      var fadeIn = Math.min(p.life / 30, 1);
      var alpha = p.opacity * fadeIn;

      if (p.useChar) {
        ctx.font = (p.size * 5) + 'px monospace';
        ctx.fillStyle = 'rgba(129, 140, 248, ' + (alpha * 0.55) + ')';
        ctx.fillText(p.char, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, ' + alpha + ')';
        ctx.fill();
      }
    }
  }

  function drawWaves(time) {
    for (var i = 0; i < 4; i++) {
      ctx.beginPath();
      var yBase = h * (0.2 + i * 0.2);
      var amp = 14 + i * 7;
      var freq = 220 + i * 70;
      var speed = 0.25 + i * 0.12;
      var alpha = 0.02 - i * 0.003;

      for (var x = 0; x <= w; x += 3) {
        var y = yBase +
          Math.sin((x / freq) + time * speed) * amp +
          Math.sin((x / (freq * 0.4)) + time * speed * 1.4) * (amp * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function animate(timestamp) {
    if (!isVisible) return;
    var time = timestamp * 0.001;
    ctx.clearRect(0, 0, w, h);

    updateNodePositions();
    drawGrid(time);
    drawWaves(time);
    drawStreams(time);
    drawNodes(time);
    drawParticles(time);

    animId = requestAnimationFrame(animate);
  }

  // Initialize immediately
  resize();
  isVisible = true;
  animId = requestAnimationFrame(animate);

  // Re-check visibility on scroll for performance
  var lastScrollCheck = 0;
  function checkVisibility() {
    var now = Date.now();
    if (now - lastScrollCheck < 200) return;
    lastScrollCheck = now;
    var rect = wrapper.getBoundingClientRect();
    var visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (visible && !isVisible) {
      isVisible = true;
      animId = requestAnimationFrame(animate);
    } else if (!visible && isVisible) {
      isVisible = false;
      if (animId) cancelAnimationFrame(animId);
    }
  }
  window.addEventListener('scroll', checkVisibility, { passive: true });

  window.addEventListener('resize', function () { resize(); });
})();

// ===== WAU Logo Code Rain Animation =====
(function () {
  function initLogoCodeRain(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var container = canvas.parentElement;
    var w, h, dpr;
    var drops = [];
    var chars = '01<>{}();=+#*&|/\\'.split('');

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDrops();
    }

    function initDrops() {
      drops = [];
      var colWidth = 6;
      var numCols = Math.ceil(w / colWidth) + 2;
      for (var i = 0; i < numCols; i++) {
        drops.push({
          x: i * colWidth + Math.random() * 3,
          y: Math.random() * h * 2 - h,
          speed: 0.2 + Math.random() * 0.6,
          opacity: 0.15 + Math.random() * 0.5,
          charIdx: Math.floor(Math.random() * chars.length),
          size: 4 + Math.random() * 3,
          trail: 2 + Math.floor(Math.random() * 4)
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += d.speed;

        if (d.y > h + 10) {
          d.y = -10 - Math.random() * 20;
          d.charIdx = Math.floor(Math.random() * chars.length);
        }

        // Draw trail
        for (var t = 0; t < d.trail; t++) {
          var ty = d.y - t * d.size * 1.2;
          if (ty < -10 || ty > h + 10) continue;
          var trailAlpha = d.opacity * (1 - t / d.trail) * 0.6;
          ctx.font = d.size + 'px monospace';
          ctx.fillStyle = 'rgba(45, 140, 240, ' + trailAlpha + ')';
          var ci = (d.charIdx + t) % chars.length;
          ctx.fillText(chars[ci], d.x, ty);
        }

        // Draw head (brighter)
        ctx.font = d.size + 'px monospace';
        ctx.fillStyle = 'rgba(100, 200, 255, ' + (d.opacity * 0.9) + ')';
        ctx.fillText(chars[d.charIdx], d.x, d.y);
      }

      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
  }

  initLogoCodeRain('navLogoCanvas');
  initLogoCodeRain('footerLogoCanvas');
})();

// ===== Contact Section: Binary Code Waves (Full Coverage) =====
(function () {
  var canvas = document.getElementById('contactWaveCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var section = canvas.closest('.contact');
  var w, h, dpr;
  var animId;
  var isVisible = false;

  var CELL_W = 20;
  var CELL_H = 16;
  var cols, rows;
  var chars = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = section.offsetWidth;
    h = section.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL_W) + 1;
    rows = Math.ceil(h / CELL_H) + 2;
    chars = [];
    for (var i = 0; i < cols * rows; i++) {
      chars.push(Math.random() > 0.5 ? '1' : '0');
    }
  }

  function animate(timestamp) {
    if (!isVisible) return;
    var time = timestamp * 0.001;
    ctx.clearRect(0, 0, w, h);
    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var idx = r * cols + c;

        // Randomly change some chars each frame
        if (Math.random() < 0.003) {
          chars[idx] = chars[idx] === '1' ? '0' : '1';
        }

        var baseX = c * CELL_W;
        var baseY = r * CELL_H;

        // Normalized coords
        var nx = c / cols;
        var ny = r / rows;

        // Multiple wave layers
        var w1 = Math.sin(nx * 8 + time * 0.8 + ny * 3) * 0.5 + 0.5;
        var w2 = Math.sin(nx * 5 - time * 0.5 + ny * 6) * 0.5 + 0.5;
        var w3 = Math.cos((nx * 4 + ny * 2) + time * 1.1) * 0.5 + 0.5;
        var w4 = Math.sin(nx * 12 + time * 1.5) * 0.3 + 0.5;
        var wave = w1 * 0.35 + w2 * 0.25 + w3 * 0.25 + w4 * 0.15;

        // Vertical displacement (creates wave shape)
        var dy = (wave - 0.5) * 18;
        var drawX = baseX;
        var drawY = baseY + dy;

        // Color: cyan (left) → blue → purple → pink (right)
        var cr, cg, cb;
        if (nx < 0.25) {
          cr = 20 + wave * 50;
          cg = 140 + wave * 115;
          cb = 200 + wave * 55;
        } else if (nx < 0.5) {
          var t = (nx - 0.25) / 0.25;
          cr = 30 + t * 60 + wave * 60;
          cg = 80 + wave * 100;
          cb = 210 + wave * 45;
        } else if (nx < 0.75) {
          var t = (nx - 0.5) / 0.25;
          cr = 90 + t * 80 + wave * 50;
          cg = 40 + wave * 60;
          cb = 200 + wave * 55;
        } else {
          var t = (nx - 0.75) / 0.25;
          cr = 170 + t * 50 + wave * 35;
          cg = 50 + wave * 70;
          cb = 180 - t * 40 + wave * 50;
        }

        // Brightness / alpha from wave
        var alpha = 0.06 + wave * 0.65;
        if (wave > 0.72) {
          alpha += (wave - 0.72) * 2.0;
          cr = Math.min(255, cr + 50);
          cg = Math.min(255, cg + 50);
          cb = Math.min(255, cb + 40);
        }
        alpha = Math.min(0.95, alpha);

        cr = Math.min(255, Math.floor(cr));
        cg = Math.min(255, Math.floor(cg));
        cb = Math.min(255, Math.floor(cb));

        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + alpha.toFixed(2) + ')';
        ctx.fillText(chars[idx], drawX, drawY);
      }
    }

    animId = requestAnimationFrame(animate);
  }

  resize();

  var contactObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      if (!isVisible) {
        isVisible = true;
        animId = requestAnimationFrame(animate);
      }
    } else {
      isVisible = false;
      if (animId) cancelAnimationFrame(animId);
    }
  }, { threshold: 0.0 });
  contactObserver.observe(section);

  window.addEventListener('resize', resize);
})();

