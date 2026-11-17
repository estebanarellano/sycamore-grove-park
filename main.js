// Forms: the Google Apps Script web app that receives sign-ups and feedback.
// Left empty in the mockup so nothing is sent to the sister sites' sheet.
// Paste Sycamore Grove's endpoint here once the project team sets one up.
var FORM_ENDPOINT = '';
var SITE_ID = 'sgv';
var MOCKUP_FORM_MSG = 'This mockup is not connected to a form yet.';

// i18n
var LANG_CODES = { EN: 'en', ES: 'es', '粤': 'zh-yue', '普': 'zh' };

function applyLanguage(code) {
  var t = TRANSLATIONS[code];
  if (!t) return;
  document.documentElement.lang = LANG_CODES[code] || 'en';
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });
}

// Nav brand — scroll to top
var navBrand = document.querySelector('.nav__brand');
if (navBrand) {
  navBrand.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Carousel
document.querySelectorAll('.carousel').forEach(function (carousel) {
  var slides = carousel.querySelectorAll('.carousel__slide');
  var dots   = carousel.querySelectorAll('.carousel__dot');
  var prev   = carousel.querySelector('.carousel__btn--prev');
  var next   = carousel.querySelector('.carousel__btn--next');
  var index  = 0;

  function goTo(n) {
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = (n + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  }

  if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
  if (next) next.addEventListener('click', function () { goTo(index + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });
});

// Accordion (FAQ + document groups)
document.querySelectorAll('.accordion__trigger, .docs-group__trigger').forEach(function (trigger) {
  trigger.addEventListener('click', function () {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    var body = document.getElementById(this.getAttribute('aria-controls'));
    this.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('is-open', !expanded);
  });
});

// Language dropdown (desktop)
var langBtn      = document.getElementById('langBtn');
var langDropdown = document.getElementById('langDropdown');
var langLabel    = document.getElementById('langLabel');

if (langBtn && langDropdown) {
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = langDropdown.classList.toggle('is-open');
    langBtn.setAttribute('aria-expanded', String(open));
  });

  langDropdown.querySelectorAll('button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = this.dataset.code;
      langLabel.textContent = code;
      langDropdown.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-selected', 'false');
      });
      this.setAttribute('aria-selected', 'true');
      langDropdown.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
      syncMobileLang(code);
      applyLanguage(code);
    });
  });

  document.addEventListener('click', function () {
    langDropdown.classList.remove('is-open');
    langBtn.setAttribute('aria-expanded', 'false');
  });
}

// Mobile menu
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var mobileMenu    = document.getElementById('mobileMenu');
var ICON_HAMBURGER = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
var ICON_CLOSE    = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', function () {
    var opening = mobileMenu.hidden;
    mobileMenu.hidden = !opening;
    this.setAttribute('aria-expanded', String(opening));
    this.innerHTML = opening ? ICON_CLOSE : ICON_HAMBURGER;
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.hidden = true;
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.innerHTML = ICON_HAMBURGER;
    });
  });

  // Mobile language buttons
  var mobileLangBtns = mobileMenu.querySelectorAll('.mobile-lang button');
  mobileLangBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = this.dataset.code;
      mobileLangBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      this.setAttribute('aria-pressed', 'true');
      if (langLabel) langLabel.textContent = code;
      syncDesktopLang(code);
      applyLanguage(code);
    });
  });
}

function syncMobileLang(code) {
  if (!mobileMenu) return;
  mobileMenu.querySelectorAll('.mobile-lang button').forEach(function (b) {
    b.setAttribute('aria-pressed', b.dataset.code === code ? 'true' : 'false');
  });
}

function syncDesktopLang(code) {
  if (!langDropdown) return;
  langDropdown.querySelectorAll('button').forEach(function (b) {
    b.setAttribute('aria-selected', b.dataset.code === code ? 'true' : 'false');
  });
}

// Email updates form
var updatesForm = document.getElementById('updatesForm');
if (updatesForm) {
  updatesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = document.getElementById('updatesStatus');
    var btn = this.querySelector('button[type="submit"]');
    var email = this.querySelector('input[type="email"]').value.trim();

    if (!email) {
      status.textContent = 'Please enter your email address.';
      return;
    }

    if (!FORM_ENDPOINT) {
      status.textContent = MOCKUP_FORM_MSG;
      return;
    }

    btn.disabled = true;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams({ site: SITE_ID, type: 'email', email: email })
    }).then(function () {
      status.textContent = 'Thanks for signing up!';
      updatesForm.reset();
    }).catch(function () {
      status.textContent = 'Something went wrong. Please try again.';
    }).finally(function () {
      btn.disabled = false;
    });
  });
}

// Feedback form
var feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = document.getElementById('formStatus');
    var btn    = this.querySelector('button[type="submit"]');
    var fd     = new FormData(feedbackForm);

    if (!fd.get('name').trim() || !fd.get('email').trim() || !fd.get('message').trim()) {
      status.textContent = 'Please fill out all fields before submitting.';
      status.className = 'form-status error';
      return;
    }

    if (!FORM_ENDPOINT) {
      status.textContent = MOCKUP_FORM_MSG;
      status.className = 'form-status';
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    status.textContent = '';
    status.className   = 'form-status';

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams({
        site: SITE_ID,
        name: fd.get('name'),
        email: fd.get('email'),
        message: fd.get('message')
      })
    }).then(function () {
      status.textContent = 'Thanks for your feedback!';
      feedbackForm.reset();
    }).catch(function () {
      status.textContent = 'Something went wrong. Please try again.';
      status.className = 'form-status error';
    }).finally(function () {
      btn.disabled    = false;
      btn.textContent = 'Send Feedback';
    });
  });
}

// Proposed alternatives boards: caption sync + zoomable lightbox
(function () {
  var boards = document.querySelector('.carousel--boards');
  var lightbox = document.getElementById('boardLightbox');
  if (!boards || !lightbox) return;

  var slides  = boards.querySelectorAll('.carousel__slide');
  var openers = boards.querySelectorAll('.boards__open');
  var captions = document.querySelectorAll('.boards__caption [data-board]');
  var counter = document.querySelector('.boards__count');

  function activeIndex() {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('is-active')) return i;
    }
    return 0;
  }

  function syncCaption() {
    var i = activeIndex();
    captions.forEach(function (c, k) { c.hidden = k !== i; });
    if (counter) counter.textContent = (i + 1) + ' / ' + slides.length;
  }
  new MutationObserver(syncCaption).observe(boards, { subtree: true, attributes: true, attributeFilter: ['class'] });
  syncCaption();

  // ---- Lightbox ----
  var stage   = lightbox.querySelector('.lightbox__stage');
  var img     = lightbox.querySelector('.lightbox__img');
  var titles  = lightbox.querySelectorAll('.lightbox__title [data-board]');
  var btnClose = lightbox.querySelector('[data-lb="close"]');
  var index = 0, scale = 1, minScale = 1, maxScale = 1, x = 0, y = 0;
  var lastFocus = null;

  function clampPan() {
    var w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    var sw = stage.clientWidth, sh = stage.clientHeight;
    x = w <= sw ? (sw - w) / 2 : Math.min(0, Math.max(sw - w, x));
    y = h <= sh ? (sh - h) / 2 : Math.min(0, Math.max(sh - h, y));
  }

  function render() {
    clampPan();
    img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
  }

  function fit() {
    if (!img.naturalWidth) return;
    minScale = Math.min(stage.clientWidth / img.naturalWidth, stage.clientHeight / img.naturalHeight);
    maxScale = Math.max(minScale * 6, 1.5);
    scale = minScale;
    render();
  }

  function zoomAt(factor, cx, cy) {
    var next = Math.min(maxScale, Math.max(minScale, scale * factor));
    if (cx === undefined) { cx = stage.clientWidth / 2; cy = stage.clientHeight / 2; }
    x = cx - (cx - x) * (next / scale);
    y = cy - (cy - y) * (next / scale);
    scale = next;
    render();
  }

  var loadToken = 0;

  // Show the carousel-size image right away, then swap in the full-resolution
  // version when it has loaded, keeping the current zoom and position.
  function show(i) {
    index = (i + openers.length) % openers.length;
    var token = ++loadToken;
    var full = openers[index].getAttribute('data-full');
    var preview = openers[index].querySelector('img');
    titles.forEach(function (t, k) { t.hidden = k !== index; });
    img.alt = preview ? preview.alt : '';
    img.onload = fit;
    img.src = preview ? (preview.currentSrc || preview.src) : full;
    if (!full) return;
    var hi = new Image();
    hi.onload = function () {
      if (token !== loadToken || lightbox.hidden) return;
      var ratio = img.naturalWidth / hi.naturalWidth;
      img.onload = function () {
        minScale = Math.min(stage.clientWidth / img.naturalWidth, stage.clientHeight / img.naturalHeight);
        maxScale = Math.max(minScale * 6, 1.5);
        scale = scale * ratio;
        render();
      };
      img.src = full;
    };
    hi.src = full;
  }

  function open(i) {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  openers.forEach(function (btn, i) {
    btn.addEventListener('click', function () { open(i); });
  });

  lightbox.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lb]');
    if (!b) return;
    var a = b.getAttribute('data-lb');
    if (a === 'close') close();
    else if (a === 'prev') show(index - 1);
    else if (a === 'next') show(index + 1);
    else if (a === 'in') zoomAt(1.5);
    else if (a === 'out') zoomAt(1 / 1.5);
    else if (a === 'reset') fit();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === '+' || e.key === '=') zoomAt(1.5);
    else if (e.key === '-') zoomAt(1 / 1.5);
  });

  window.addEventListener('resize', function () { if (!lightbox.hidden) fit(); });

  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = stage.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  stage.addEventListener('dblclick', function (e) {
    if (e.target.closest('button')) return;
    var r = stage.getBoundingClientRect();
    if (scale > minScale * 1.05) fit();
    else zoomAt(3, e.clientX - r.left, e.clientY - r.top);
  });

  // Drag to pan, pinch to zoom
  var pointers = {}, startDist = 0, startScale = 1, lastX = 0, lastY = 0;

  function mid() {
    var ids = Object.keys(pointers), a = pointers[ids[0]], b = pointers[ids[1]];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
  }

  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    stage.setPointerCapture(e.pointerId);
    var r = stage.getBoundingClientRect();
    pointers[e.pointerId] = { x: e.clientX - r.left, y: e.clientY - r.top };
    var n = Object.keys(pointers).length;
    if (n === 1) { lastX = pointers[e.pointerId].x; lastY = pointers[e.pointerId].y; stage.classList.add('is-dragging'); }
    if (n === 2) { var m = mid(); startDist = m.d; startScale = scale; lastX = m.x; lastY = m.y; }
  });

  stage.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId]) return;
    var r = stage.getBoundingClientRect();
    pointers[e.pointerId] = { x: e.clientX - r.left, y: e.clientY - r.top };
    var n = Object.keys(pointers).length;
    if (n === 1) {
      var p = pointers[e.pointerId];
      x += p.x - lastX; y += p.y - lastY; lastX = p.x; lastY = p.y;
      render();
    } else if (n === 2 && startDist) {
      var m = mid();
      x += m.x - lastX; y += m.y - lastY; lastX = m.x; lastY = m.y;
      zoomAt((startScale * m.d / startDist) / scale, m.x, m.y);
    }
  });

  function endPointer(e) {
    delete pointers[e.pointerId];
    var ids = Object.keys(pointers);
    if (ids.length === 1) { lastX = pointers[ids[0]].x; lastY = pointers[ids[0]].y; startDist = 0; }
    if (!ids.length) stage.classList.remove('is-dragging');
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
})();
