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