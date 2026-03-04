/* ================================================
   SAI SRAVANTHI HOSPITALS – JAVASCRIPT
   ================================================ */
(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar       = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      scrollTopBtn && scrollTopBtn.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn && scrollTopBtn.classList.remove('visible');
    }
  });

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks && navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Active nav on scroll ---- */
  const sections       = document.querySelectorAll('section[id]');
  const navLinkEls     = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 100) current = s.id; });
    navLinkEls.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  });

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- AOS (scroll reveal) ---- */
  const aosObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => aosObs.observe(el));

  /* ---- Service cards stagger ---- */
  const svcObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        svcObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
    svcObs.observe(card);
  });

  /* ---- Testimonial slider ---- */
  const track     = document.getElementById('testimonialsTrack');
  const prevBtn   = document.getElementById('prevTestimonial');
  const nextBtn   = document.getElementById('nextTestimonial');
  const dotsWrap  = document.getElementById('testimonialDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxIdx = Math.max(0, cards.length - perView);

    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIdx));
      const w = cards[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${current * w}px)`;
      dotsWrap.querySelectorAll('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }
    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

    let auto = setInterval(() => goTo(current >= maxIdx ? 0 : current + 1), 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => { auto = setInterval(() => goTo(current >= maxIdx ? 0 : current + 1), 5000); });

    window.addEventListener('resize', () => {
      perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      goTo(0);
    });

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    });
  }

  /* ---- Toast notification ---- */
  function showToast(message, type = 'success', duration = 4500) {
    const old = document.getElementById('appt-toast');
    if (old) old.remove();

    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error:   '<i class="fas fa-exclamation-circle"></i>'
    };

    const toast = document.createElement('div');
    toast.id = 'appt-toast';
    toast.className = `appt-toast appt-toast--${type}`;
    toast.innerHTML = `
      <div class="appt-toast__icon">${icons[type] || icons.success}</div>
      <div class="appt-toast__body">
        <span class="appt-toast__msg">${message}</span>
        <div class="appt-toast__bar"></div>
      </div>
      <button class="appt-toast__close" aria-label="Close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);

    const bar = toast.querySelector('.appt-toast__bar');
    bar.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '0%'; }));
    toast.querySelector('.appt-toast__close').addEventListener('click', () => dismiss(toast));
    requestAnimationFrame(() => toast.classList.add('appt-toast--visible'));
    toast._t = setTimeout(() => dismiss(toast), duration);
  }

  function dismiss(toast) {
    if (!toast) return;
    clearTimeout(toast._t);
    toast.classList.remove('appt-toast--visible');
    setTimeout(() => toast && toast.remove(), 400);
  }

  /* ---- WhatsApp message builder ---- */
  function buildWAMessage(f) {
    const depts = {
      gynecology: 'Gynecology', obstetrics: 'Obstetrics', laparoscopy: 'Laparoscopy',
      infertility: 'Infertility Treatment', anesthesiology: 'Anaesthesiology',
      'general-medicine': 'General Medicine', emergency: 'Emergency Care',
      diagnostics: 'Diagnostic Laboratory', pharmacy: 'Pharmacy'
    };
    const dept = depts[f.department] || f.department;
    let dateStr = f.date;
    try { dateStr = new Date(f.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (_) {}

    let msg = `🏥 *Appointment Request – Sai Sravanthi Hospitals*\n\n`;
    msg += `👤 *Patient Name:* ${f.name}\n`;
    msg += `📞 *Phone:* ${f.phone}\n`;
    if (f.email)   msg += `📧 *Email:* ${f.email}\n`;
    msg += `🩺 *Department:* ${dept}\n`;
    msg += `📅 *Preferred Date:* ${dateStr}\n`;
    if (f.time)    msg += `⏰ *Preferred Time:* ${f.time}\n`;
    if (f.message) msg += `💬 *Message:* ${f.message}\n`;
    msg += `\n_Sent via SaiSravanthiHospitals.com_`;
    return msg;
  }

  /* ---- Appointment form submission ---- */
  const form = document.getElementById('appointmentForm');
  form && form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('patientName').value.trim();
    const phone   = document.getElementById('patientPhone').value.trim();
    const email   = document.getElementById('patientEmail').value.trim();
    const dept    = document.getElementById('department').value;
    const date    = document.getElementById('preferredDate').value;
    const time    = document.getElementById('preferredTime').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !dept || !date) {
      showToast('Please fill in all required fields (Name, Phone, Department, Date).', 'error', 4000);
      return;
    }

    const submitBtn = document.getElementById('submit-appt-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const waMsg = buildWAMessage({ name, phone, email, department: dept, date, time, message });
    const waUrl = `https://wa.me/919615155999?text=${encodeURIComponent(waMsg)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.reset();
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
      submitBtn.disabled = false;
      showToast('Appointment booked successfully! We will confirm your slot shortly.', 'success');
    }, 800);
  });

  /* ---- Set min date ---- */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  /* ---- Counter animation ---- */
  const ctrObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        ctrObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => ctrObs.observe(el));

  function animateCount(el) {
    const target = parseInt(el.textContent.replace(/,/g, ''));
    const step = target / (2000 / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString(); clearInterval(t); }
      else               { el.textContent = Math.floor(cur).toLocaleString(); }
    }, 16);
  }

  /* ---- Scroll to top ---- */
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- Hero parallax ---- */
  const heroImg = document.querySelector('.hero-bg-img');
  window.addEventListener('scroll', () => {
    if (heroImg && window.scrollY < window.innerHeight)
      heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });

  console.log('%cSai Sravanthi Hospitals – Loaded ✓', 'color:#2563eb;font-weight:bold;font-size:14px;');
})();
