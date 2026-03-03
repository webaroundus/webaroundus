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

// ===== About Section: Code System Background =====
(function() {
  const canvas = document.getElementById('aboutCodeBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let animId;
  let isVisible = false;

  // Grid lines
  const gridLines = [];
  // Flowing code particles
  const particles = [];
  // Horizontal data streams
  const streams = [];
  // Connection nodes
  const nodes = [];

  function resize() {
    const section = canvas.parentElement;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = section.offsetWidth;
    h = section.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    initElements();
  }

  function initElements() {
    // Create grid nodes (intersection points)
    nodes.length = 0;
    const spacingX = 80;
    const spacingY = 80;
    for (let x = spacingX; x < w; x += spacingX) {
      for (let y = spacingY; y < h; y += spacingY) {
        if (Math.random() > 0.6) {
          nodes.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            radius: Math.random() * 2 + 1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.5 + Math.random() * 1.5,
            opacity: 0.15 + Math.random() * 0.25
          });
        }
      }
    }

    // Create horizontal data streams (like flowing code)
    streams.length = 0;
    const streamCount = Math.floor(h / 100) + 3;
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        y: (h / (streamCount + 1)) * (i + 1) + (Math.random() - 0.5) * 30,
        speed: 0.3 + Math.random() * 0.8,
        segments: [],
        opacity: 0.04 + Math.random() * 0.06
      });
      // Create segments for each stream
      const segCount = 3 + Math.floor(Math.random() * 5);
      for (let s = 0; s < segCount; s++) {
        streams[streams.length - 1].segments.push({
          x: Math.random() * w * 1.5 - w * 0.25,
          length: 40 + Math.random() * 120,
          thickness: 1 + Math.random() * 1.5,
          glow: Math.random() > 0.7
        });
      }
    }

    // Create floating code particles
    particles.length = 0;
    const particleCount = Math.floor((w * h) / 25000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.4,
        size: 1 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3,
        char: ['0', '1', '<', '>', '/', '{', '}', ';', '(', ')', '=', '+', '#'][Math.floor(Math.random() * 13)],
        useChar: Math.random() > 0.5,
        life: Math.random() * 200
      });
    }
  }

  function drawGrid(time) {
    // Subtle vertical grid lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)';
    ctx.lineWidth = 0.5;
    const spacing = 80;
    for (let x = spacing; x < w; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    // Subtle horizontal grid lines
    for (let y = spacing; y < h; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawNodes(time) {
    nodes.forEach(node => {
      const pulse = Math.sin(time * node.pulseSpeed + node.pulse);
      const r = node.radius + pulse * 0.8;
      const alpha = node.opacity + pulse * 0.08;
      
      // Glow
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, ' + (alpha * 0.15) + ')';
      ctx.fill();
      
      // Core dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, ' + alpha + ')';
      ctx.fill();
    });

    // Draw connections between nearby nodes
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
          ctx.stroke();
        }
      }
    }
  }

  function drawStreams(time) {
    streams.forEach(stream => {
      stream.segments.forEach(seg => {
        // Move segment
        seg.x += stream.speed;
        if (seg.x > w + 50) seg.x = -seg.length - 50;
        
        // Draw the flowing line
        const gradient = ctx.createLinearGradient(seg.x, 0, seg.x + seg.length, 0);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0)');
        gradient.addColorStop(0.3, 'rgba(99, 102, 241, ' + stream.opacity + ')');
        gradient.addColorStop(0.7, 'rgba(139, 92, 246, ' + stream.opacity + ')');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        
        ctx.beginPath();
        ctx.moveTo(seg.x, stream.y);
        ctx.lineTo(seg.x + seg.length, stream.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = seg.thickness;
        ctx.stroke();

        // Glow effect for selected segments
        if (seg.glow) {
          ctx.beginPath();
          ctx.moveTo(seg.x, stream.y);
          ctx.lineTo(seg.x + seg.length, stream.y);
          ctx.strokeStyle = 'rgba(129, 140, 248, ' + (stream.opacity * 0.5) + ')';
          ctx.lineWidth = seg.thickness + 3;
          ctx.stroke();
        }
      });
    });
  }

  function drawParticles(time) {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;

      // Wrap around
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; p.life = 0; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const fadeIn = Math.min(p.life / 30, 1);
      const alpha = p.opacity * fadeIn;

      if (p.useChar) {
        ctx.font = (p.size * 5) + 'px monospace';
        ctx.fillStyle = 'rgba(129, 140, 248, ' + (alpha * 0.6) + ')';
        ctx.fillText(p.char, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, ' + alpha + ')';
        ctx.fill();
      }
    });
  }

  function drawWaveOverlay(time) {
    // Subtle sine wave overlays for the "system pulse" feeling
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yBase = h * (0.3 + i * 0.25);
      const amp = 15 + i * 8;
      const freq = 200 + i * 80;
      const speed = 0.3 + i * 0.15;
      const alpha = 0.025 - i * 0.005;
      
      for (let x = 0; x <= w; x += 3) {
        const y = yBase + 
          Math.sin((x / freq) + time * speed) * amp +
          Math.sin((x / (freq * 0.4)) + time * speed * 1.5) * (amp * 0.3);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function animate(timestamp) {
    if (!isVisible) return;
    const time = timestamp * 0.001;
    ctx.clearRect(0, 0, w, h);

    drawGrid(time);
    drawWaveOverlay(time);
    drawStreams(time);
    drawNodes(time);
    drawParticles(time);

    animId = requestAnimationFrame(animate);
  }

  // Only animate when section is visible (performance)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        resize();
        animId = requestAnimationFrame(animate);
      } else {
        isVisible = false;
        if (animId) cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas.parentElement);
  window.addEventListener('resize', () => { if (isVisible) resize(); });
})();
