/**
 * Rogon Network - Main JavaScript
 * Vanilla JS — no framework dependencies
 * Features: hero slider, mobile menu, scroll-reveal, tabs, form, cookie consent
 */
(function () {
  'use strict';

  // ─── DOM References ──────────────────────────────────
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const body = document.body;
  const scrollTopBtn = document.getElementById('scroll-top');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link, .nav-desktop .nav-link');

  // ─── Set Current Year ──────────────────────────────
  var yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ─── Header Scroll Behavior ─────────────────────────
  function updateHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // ─── Mobile Menu Toggle ─────────────────────────────
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var isOpen = body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close mobile menu when clicking a nav link
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (body.classList.contains('menu-open')) {
        body.classList.remove('menu-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ─── Nav Link Active State on Scroll ────────────────
  var sections = [];
  var allNavLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav .nav-link');

  allNavLinks.forEach(function (link) {
    var hash = link.getAttribute('href');
    if (hash && hash.startsWith('#') && hash.length > 1) {
      var section = document.querySelector(hash);
      if (section) {
        sections.push({ link: link, section: section, id: hash });
      }
    }
  });

  function updateActiveNavLink() {
    var scrollPos = window.scrollY + 120;
    var currentId = '';

    sections.forEach(function (item) {
      var top = item.section.offsetTop;
      var bottom = top + item.section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        currentId = item.id;
      }
    });

    // Update all matching nav links
    var links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      if (link.getAttribute('href') === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('load', updateActiveNavLink);

  // ─── Scroll-to-Top Button ───────────────────────────
  if (scrollTopBtn) {
    function toggleScrollTopBtn() {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Hero Slider ────────────────────────────────────
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dots .dot');
  var heroPrev = document.querySelector('.hero-nav.hero-prev');
  var heroNext = document.querySelector('.hero-nav.hero-next');

  if (heroSlides.length > 0) {
    var currentSlide = 0;
    var slideInterval;
    var SLIDE_DURATION = 5000;

    function goToSlide(index) {
      heroSlides.forEach(function (s) { s.classList.remove('active'); });
      heroDots.forEach(function (d) { d.classList.remove('active'); });

      if (index < 0) index = heroSlides.length - 1;
      if (index >= heroSlides.length) index = 0;

      currentSlide = index;
      heroSlides[currentSlide].classList.add('active');
      if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
      stopAutoplay();
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoplay() {
      if (slideInterval) clearInterval(slideInterval);
    }

    if (heroPrev) {
      heroPrev.addEventListener('click', function () {
        prevSlide();
        startAutoplay();
      });
    }

    if (heroNext) {
      heroNext.addEventListener('click', function () {
        nextSlide();
        startAutoplay();
      });
    }

    heroDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        goToSlide(index);
        startAutoplay();
      });
    });

    // Pause on hover
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
      // Also pause when focus is inside the hero (accessibility)
      heroSection.addEventListener('focusin', stopAutoplay);
      heroSection.addEventListener('focusout', startAutoplay);
    }

    // Touch swipe support
    var touchStartX = 0;

    if (heroSection) {
      heroSection.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener('touchend', function (e) {
        var touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoplay();
        }
      }, { passive: true });
    }

    // Keyboard navigation
    if (heroSection) {
      heroSection.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          startAutoplay();
        }
      });
    }

    startAutoplay();
  }

  // ─── Approach Tabs ──────────────────────────────────
  var tabButtons = document.querySelectorAll('.approach-tab-btn');
  var tabPanels = document.querySelectorAll('.approach-tab-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });

  // ─── Intersection Observer - Reveal Animations ──────
  // Respects prefers-reduced-motion: handled via CSS
  if ('IntersectionObserver' in window) {
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ─── Cookie Consent ─────────────────────────────────
  var cookieBanner = document.getElementById('cookie-banner');
  var cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    // Show banner if not previously accepted
    if (!localStorage.getItem('cookie-consent')) {
      // Small delay to allow CSS transition to be visible
      setTimeout(function () {
        cookieBanner.classList.add('visible');
      }, 500);
    }

    cookieAccept.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // ─── Contact Form Handler ───────────────────────────
  var form = document.querySelector('.contact-form');
  if (form) {
    var loadingMsg = form.querySelector('.loading-message');
    var errorMsg = form.querySelector('.error-message');
    var successMsg = form.querySelector('.success-message');
    var submitBtn = form.querySelector('button[type="submit"]');

    var TURNSTILE_TIMEOUT = 5000;
    var FETCH_TIMEOUT = 15000;

    function show(el) {
      if (el) el.style.display = 'block';
    }

    function hide(el) {
      if (el) el.style.display = 'none';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      hide(errorMsg);
      hide(successMsg);
      show(loadingMsg);
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);
      var actionUrl = form.getAttribute('action') || '';

      getTurnstileToken(TURNSTILE_TIMEOUT)
        .then(function (token) {
          if (token) {
            formData.append('cf-turnstile-response', token);
          }
          return fetchWithTimeout(actionUrl, { method: 'POST', body: formData }, FETCH_TIMEOUT);
        })
        .then(function (response) {
          if (response.ok) {
            hide(loadingMsg);
            show(successMsg);
            form.reset();
            if (typeof turnstile !== 'undefined' && typeof turnstile.render === 'function') {
              setTimeout(function () {
                var widget = document.getElementById('cf-turnstile-widget');
                if (widget) {
                  var sitekey = widget.getAttribute('data-sitekey');
                  var theme = widget.getAttribute('data-theme') || 'light';
                  var size = widget.getAttribute('data-size') || 'normal';
                  widget.innerHTML = '';
                  turnstile.render(widget, { sitekey: sitekey, theme: theme, size: size });
                }
              }, 300);
            }
          } else {
            throw new Error('Server error. Please try again later.');
          }
        })
        .catch(function (err) {
          hide(loadingMsg);
          show(errorMsg);
          if (errorMsg) {
            errorMsg.textContent = err.message || 'Something went wrong. Please try again.';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    function getTurnstileToken(timeout) {
      return new Promise(function (resolve) {
        var start = Date.now();
        var widgetEl = document.getElementById('cf-turnstile-widget');
        if (!widgetEl) {
          resolve(null);
          return;
        }

        function ensureRendered() {
          if (typeof turnstile !== 'undefined' && typeof turnstile.render === 'function') {
            if (!widgetEl.querySelector('iframe')) {
              try {
                var sitekey = widgetEl.getAttribute('data-sitekey');
                var theme = widgetEl.getAttribute('data-theme') || 'light';
                var size = widgetEl.getAttribute('data-size') || 'normal';
                turnstile.render(widgetEl, { sitekey: sitekey, theme: theme, size: size });
              } catch (e) {
                console.warn('Turnstile render failed:', e);
              }
            }
          }
        }

        function check() {
          ensureRendered();
          if (typeof turnstile !== 'undefined' && typeof turnstile.getResponse === 'function') {
            var token = turnstile.getResponse(widgetEl);
            if (token) {
              resolve(token);
              return;
            }
          }
          if (Date.now() - start > timeout) {
            console.warn('Turnstile unreachable — submitting without verification');
            resolve(null);
            return;
          }
          setTimeout(check, 200);
        }
        check();
      });
    }

    function fetchWithTimeout(url, options, timeout) {
      return new Promise(function (resolve, reject) {
        var controller = new AbortController();
        var timer = setTimeout(function () {
          controller.abort();
          reject(new Error('Request timed out. Please check your connection.'));
        }, timeout);
        options.signal = controller.signal;

        fetch(url, options)
          .then(function (response) {
            clearTimeout(timer);
            resolve(response);
          })
          .catch(function (err) {
            clearTimeout(timer);
            reject(new Error('Network error. Please check your connection.'));
          });
      });
    }
  }

})();
