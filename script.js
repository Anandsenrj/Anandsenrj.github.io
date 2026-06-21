'use strict';

/* ══════════════════════════════════════════════════════════
   ANAND SEN PORTFOLIO — JS v2
   Theme Toggle · Cursor · Navbar · Scroll · GitHub API
   ══════════════════════════════════════════════════════════ */

// ───────────────────────────────────────────────────────────
// THEME MANAGER
// ───────────────────────────────────────────────────────────
const ThemeManager = (() => {
  const html      = document.documentElement;
  const flash     = document.getElementById('themeFlash');
  const toggles   = document.querySelectorAll('#themeToggle, #themeToggleMobile');

  const STORED    = 'as-theme';
  let current     = localStorage.getItem(STORED) || 'dark';

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORED, theme);
    current = theme;
  }

  function ripple(btn) {
    if (!flash || !btn) return;
    const r   = btn.getBoundingClientRect();
    const cx  = ((r.left + r.width  / 2) / window.innerWidth  * 100).toFixed(1) + '%';
    const cy  = ((r.top  + r.height / 2) / window.innerHeight * 100).toFixed(1) + '%';
    flash.style.setProperty('--fx', cx);
    flash.style.setProperty('--fy', cy);
    flash.classList.remove('pop');
    void flash.offsetWidth; // reflow
    flash.classList.add('pop');
  }

  function toggle(e) {
    const next = current === 'dark' ? 'light' : 'dark';
    ripple(e.currentTarget);
    // slight delay so ripple starts before theme switches
    setTimeout(() => apply(next), 60);
  }

  function init() {
    apply(current); // restore saved preference
    toggles.forEach(btn => btn.addEventListener('click', toggle));
  }

  return { init };
})();

// ───────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ───────────────────────────────────────────────────────────
const Cursor = (() => {
  const dot      = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;
  let hidden = false;

  function track(e) {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  }

  function animateFollower() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; }
    requestAnimationFrame(animateFollower);
  }

  function attachHover() {
    const sel = 'a,button,.project-card,.contact-card,.about-card,.skill-card,.cta-primary,.cta-secondary,.exp-category';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(sel)) {
        dot?.classList.add('hovered');
        follower?.classList.add('hovered');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(sel)) {
        dot?.classList.remove('hovered');
        follower?.classList.remove('hovered');
      }
    });
  }

  function init() {
    if (!dot || !follower) return;
    document.addEventListener('mousemove', track);
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; follower.style.opacity = '0'; hidden = true;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = ''; follower.style.opacity = ''; hidden = false;
    });
    animateFollower();
    attachHover();
  }
  return { init };
})();

// ───────────────────────────────────────────────────────────
// NAVBAR SCROLL
// ───────────────────────────────────────────────────────────
const Navbar = (() => {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateScroll() {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  function init() {
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
  }
  return { init };
})();

// ───────────────────────────────────────────────────────────
// MOBILE MENU
// ───────────────────────────────────────────────────────────
const MobileMenu = (() => {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  function init() {
    btn?.addEventListener('click', () => {
      btn.classList.toggle('active');
      menu?.classList.toggle('open');
    });
    menu?.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn?.classList.remove('active');
        menu?.classList.remove('open');
      });
    });
  }
  return { init };
})();

// ───────────────────────────────────────────────────────────
// SCROLL REVEAL
// ───────────────────────────────────────────────────────────
const ScrollReveal = (() => {
  let observer;

  function init() {
    observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function observe(el) { observer?.observe(el); }

  return { init, observe };
})();

// ───────────────────────────────────────────────────────────
// SKILL BAR ANIMATION (triggered on scroll into view)
// ───────────────────────────────────────────────────────────
const SkillBars = (() => {
  function init() {
    const cards = document.querySelectorAll('.skill-card');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('bar-animated');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    cards.forEach(c => obs.observe(c));
  }
  return { init };
})();

// ───────────────────────────────────────────────────────────
// SMOOTH ANCHOR SCROLL
// ───────────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
    });
  });
}

// ───────────────────────────────────────────────────────────
// COUNTER ANIMATION
// ───────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1400) {
  if (isNaN(target) || target <= 0) return;
  const startTime = performance.now();
  const update = t => {
    const p = Math.min((t - startTime) / duration, 1);
    const v = Math.floor(p < 1 ? target * (1 - Math.pow(1 - p, 3)) : target);
    el.textContent = v;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ───────────────────────────────────────────────────────────
// HERO PARALLAX
// ───────────────────────────────────────────────────────────
function initParallax() {
  const content = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (content && s < window.innerHeight) {
      content.style.transform = `translateY(${s * 0.22}px)`;
      content.style.opacity   = String(1 - s / 650);
    }
  }, { passive: true });
}

// ───────────────────────────────────────────────────────────
// CARD TILT EFFECT (desktop only)
// ───────────────────────────────────────────────────────────
function initTilt() {
  if (window.innerWidth <= 768) return;

  const SELECTORS = '.skill-card, .project-card, .about-card, .exp-category';

  document.addEventListener('mousemove', e => {
    document.querySelectorAll(SELECTORS).forEach(card => {
      const r  = card.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const inside = cx >= 0 && cx <= r.width && cy >= 0 && cy <= r.height;

      if (inside) {
        const rx = ((cy / r.height) - 0.5) * -8;
        const ry = ((cx / r.width)  - 0.5) * 8;
        card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      } else {
        card.style.transform = '';
      }
    });
  });
}

// ───────────────────────────────────────────────────────────
// GITHUB API
// ───────────────────────────────────────────────────────────
const GitHub = (() => {
  const USER = 'Anandsenrj';

  async function fetchProfile() {
    const res = await fetch(`https://api.github.com/users/${USER}`);
    if (!res.ok) throw new Error('GitHub profile error');
    return res.json();
  }

  async function init() {
    const statEl = document.getElementById('stat-repos');
    try {
      const profile = await fetchProfile();

      if (statEl) {
        statEl.textContent = '0';
        setTimeout(() => animateCounter(statEl, profile.public_repos || 10), 800);
      }
    } catch {
      if (statEl) statEl.textContent = '10+';
    }
  }

  return { init };
})();

// ───────────────────────────────────────────────────────────
// STAGGER SKILL CARDS reveal delay
// ───────────────────────────────────────────────────────────
function staggerSkillCards() {
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 5) * 0.07}s`;
  });
}

// ───────────────────────────────────────────────────────────
// BOOT
// ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Cursor.init();
  Navbar.init();
  MobileMenu.init();
  ScrollReveal.init();
  SkillBars.init();
  initSmoothScroll();
  initParallax();
  initTilt();
  staggerSkillCards();
  GitHub.init();
});
