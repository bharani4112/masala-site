/* ============================================
   MASALA BRAND - MAIN JAVASCRIPT
   main.js - All JavaScript in one file
   ============================================ */

/* ---- Wait for DOM ready ---- */
document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================
     1. PAGE LOADER
     ========================================== */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 1200);
    });
  }

  /* ==========================================
     2. STICKY NAVBAR — add scrolled class
     ========================================== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ==========================================
     3. HAMBURGER MOBILE MENU
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    /* Close menu when a link is clicked */
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================
     4. ACTIVE NAV LINK — highlight current page
     ========================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ==========================================
     5. BACK TO TOP BUTTON
     ========================================== */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================
     6. WHATSAPP FLOATING POPUP — shows after 5s
     ========================================== */
  const waPopup = document.getElementById('wa-popup');
  const waPopupClose = document.getElementById('wa-popup-close');

  if (waPopup) {
    /* Show popup after 5 seconds (only if not dismissed in this session) */
    if (!sessionStorage.getItem('wa-popup-dismissed')) {
      setTimeout(function () {
        waPopup.classList.add('show');
      }, 5000);
    }

    /* Close button */
    if (waPopupClose) {
      waPopupClose.addEventListener('click', function () {
        waPopup.classList.remove('show');
        sessionStorage.setItem('wa-popup-dismissed', 'true');
      });
    }
  }

  /* ==========================================
     7. SCROLL ANIMATIONS (Intersection Observer)
     ========================================== */
  const animElements = document.querySelectorAll('.animate-on-scroll');

  if (animElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); /* Animate only once */
          }
        });
      },
      { threshold: 0.15 }
    );

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================
     8. COUNTER ANIMATION for Stats Section
     ========================================== */
  function animateCounter(el, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }, 16);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            const duration = 1800;
            animateCounter(entry.target, target, duration);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ==========================================
     9. WEIGHT OPTION SELECTOR (Product Cards)
     Selects weight buttons and updates price
     ========================================== */
  document.querySelectorAll('.product-card').forEach(function (card) {
    const weightBtns = card.querySelectorAll('.weight-btn');
    const priceEl = card.querySelector('.current-price');

    weightBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Toggle selected state */
        weightBtns.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');

        /* Update price if data-price is set */
        if (priceEl && btn.dataset.price) {
          priceEl.textContent = '₹' + btn.dataset.price;
        }

        /* Update WhatsApp link with chosen weight */
        const waLink = card.querySelector('.btn-whatsapp');
        const prodName = card.querySelector('.product-name');
        if (waLink && prodName) {
          const weight = btn.textContent.trim();
          const name = prodName.textContent.trim();
          const msg = encodeURIComponent(
            'Hi! I want to order ' + name + ' (' + weight + ')'
          );
          waLink.href = 'https://wa.me/917695939649?text=' + msg;
        }
      });
    });
  });

  /* ==========================================
     10. PRODUCT FILTER BUTTONS (products.html)
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* Active state */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const category = btn.dataset.filter;

        productCards.forEach(function (card) {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================
     11. CONTACT FORM — basic validation + submit
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Simple validation */
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      /* Simulate success message */
      const submitBtn = contactForm.querySelector('.form-submit');
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✅ Message Sent!';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML = origText;
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ==========================================
     12. SMOOTH SCROLL for anchor links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}); /* end DOMContentLoaded */
