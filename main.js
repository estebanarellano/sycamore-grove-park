/* Sycamore Grove Park & Ramona Hall Master Plan: page behavior.
   No libraries. Everything here is progressive: the page reads fine without it. */

/* ---------- Settings ----------
   FORM_ENDPOINT: the Google Apps Script web app URL RAP uses for the sister sites' forms.
   Leave empty until the team confirms where Sycamore Grove submissions should go;
   while empty, forms show a message and send nothing. */
var FORM_ENDPOINT = '';
var SITE_ID = 'sgv';
var MSG_NOT_CONNECTED = 'This draft isn’t connected to a form yet, so nothing was sent.';
var MSG_THANKS_SIGNUP = 'Thank you. You’re on the list.';
var MSG_THANKS_FEEDBACK = 'Thank you. Your response went to the project team.';
var MSG_ERROR = 'Something went wrong. Please try again, or email sycamore@staynerarchitects.com.';

/* Timeline: month 0 is October 1, 2026; the chart spans 25 months. */
var TIMELINE_START = new Date(2026, 9, 1);
var TIMELINE_MONTHS = 25;

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: solid once the opening photo has scrolled past ---------- */
  var header = document.getElementById('site-header');
  var hero = document.querySelector('.hero');
  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-solid', !entries[0].isIntersecting);
      document.body.classList.toggle('past-hero', !entries[0].isIntersecting);
    }, { rootMargin: '-' + (header.offsetHeight || 72) + 'px 0px 0px 0px' }).observe(hero);
  } else if (header) {
    header.classList.add('is-solid');
    document.body.classList.add('no-io');
  }

  /* ---------- Dialogs: menu, feedback, review notes ---------- */
  function openDialog(d) {
    if (!d) return;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  }
  function closeDialog(d) {
    if (!d) return;
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target === d && !d.classList.contains('menu')) closeDialog(d); /* click on backdrop */
      if (e.target.closest('[data-close]')) closeDialog(d);
    });
  });
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () { openDialog(menu); });
  if (menu) menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { closeDialog(menu); });
  });
  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { openDialog(document.getElementById(btn.getAttribute('data-open'))); });
  });

  /* ---------- Language ---------- */
  var langBtn = document.querySelector('.lang__btn');
  var langList = document.getElementById('lang-list');
  function setLangMenu(open) {
    if (!langBtn || !langList) return;
    langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    langList.hidden = !open;
    if (open) { var cur = langList.querySelector('[aria-current="true"]') || langList.querySelector('button'); if (cur) cur.focus(); }
  }
  if (langBtn) langBtn.addEventListener('click', function () { setLangMenu(langList.hidden); });
  document.addEventListener('click', function (e) {
    if (langList && !langList.hidden && !e.target.closest('.lang')) setLangMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && langList && !langList.hidden) { setLangMenu(false); langBtn.focus(); }
  });

  function remember(el, attr) {
    var k = 'en' + attr;
    if (el.dataset[k] === undefined) {
      el.dataset[k] = attr === 'Html' ? el.innerHTML : attr === 'Ph' ? (el.getAttribute('placeholder') || '') : attr === 'Aria' ? (el.getAttribute('aria-label') || '') : el.textContent;
    }
    return el.dataset[k];
  }

  function applyLang(code) {
    var dict = (window.TRANSLATIONS && TRANSLATIONS[code]) || {};
    var meta = (window.LANGS && LANGS[code]) || { html: 'en', code: 'EN' };
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var en = remember(el, 'Text');
      el.textContent = dict[el.getAttribute('data-i18n')] || en;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var en = remember(el, 'Html');
      el.innerHTML = dict[el.getAttribute('data-i18n-html')] || en;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var en = remember(el, 'Ph');
      el.setAttribute('placeholder', dict[el.getAttribute('data-i18n-placeholder')] || en);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var en = remember(el, 'Aria');
      el.setAttribute('aria-label', dict[el.getAttribute('data-i18n-aria')] || en);
    });

    document.documentElement.lang = meta.html;
    var codeEl = document.querySelector('.lang__code');
    if (codeEl) codeEl.textContent = meta.code;
    if (langList) langList.querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-lang') === code ? 'true' : 'false');
    });
    try { localStorage.setItem('sgv-lang', code); } catch (e) { /* storage unavailable */ }
  }
  if (langList) langList.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); setLangMenu(false); langBtn.focus(); });
  });
  var saved = null;
  try { saved = localStorage.getItem('sgv-lang'); } catch (e) { /* storage unavailable */ }
  applyLang(saved && window.TRANSLATIONS && TRANSLATIONS[saved] ? saved : 'EN');

  /* ---------- Timeline: put "Today" where today is ---------- */
  var today = document.querySelector('.tl__today');
  if (today) {
    var months = (Date.now() - TIMELINE_START.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    months = Math.max(0, Math.min(TIMELINE_MONTHS, months));
    today.style.setProperty('--m', months.toFixed(2));
  }

  /* ---------- The Plan: scroll the row of notes ---------- */
  var artifacts = document.getElementById('artifacts');
  document.querySelectorAll('[data-scroll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!artifacts) return;
      var step = Math.min(artifacts.clientWidth * 0.8, 420);
      artifacts.scrollBy({ left: step * Number(btn.getAttribute('data-scroll')), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Reveal and drift (skipped when people ask for less motion) ---------- */
  var revealables = document.querySelectorAll('.float__item, .paper, .print');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });

    var drifters = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
    var ticking = false;
    function drift() {
      ticking = false;
      if (window.innerWidth < 900) { drifters.forEach(function (el) { el.style.removeProperty('--py'); }); return; }
      var vh = window.innerHeight;
      drifters.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var offset = (r.top + r.height / 2) - vh / 2;
        el.style.setProperty('--py', (-offset * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px');
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
    window.addEventListener('resize', drift);
    drift();
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Forms ---------- */
  function send(payload) {
    return fetch(FORM_ENDPOINT, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  var signup = document.getElementById('signup-form');
  if (signup) signup.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = signup.querySelector('.form-status');
    var input = signup.querySelector('input[type="email"]');
    if (!validEmail(input.value.trim())) { status.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    if (!FORM_ENDPOINT) { status.textContent = MSG_NOT_CONNECTED; return; }
    send({ site: SITE_ID, form: 'updates', email: input.value.trim(), lang: document.documentElement.lang })
      .then(function () { status.textContent = MSG_THANKS_SIGNUP; signup.reset(); })
      .catch(function () { status.textContent = MSG_ERROR; });
  });

  var feedback = document.getElementById('feedback-form');
  if (feedback) feedback.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = feedback.querySelector('.form-status');
    var msg = feedback.querySelector('#fb-message');
    var email = feedback.querySelector('#fb-email');
    if (!msg.value.trim()) { status.textContent = 'Please write a message first.'; msg.focus(); return; }
    if (email.value.trim() && !validEmail(email.value.trim())) { status.textContent = 'Please check the email address, or leave it blank.'; email.focus(); return; }
    if (!FORM_ENDPOINT) { status.textContent = MSG_NOT_CONNECTED; return; }
    var data = new FormData(feedback);
    send({
      site: SITE_ID, form: 'feedback',
      kind: data.get('kind'), place: data.get('place'), message: data.get('message'),
      name: data.get('name'), email: data.get('email'), lang: document.documentElement.lang
    })
      .then(function () { status.textContent = MSG_THANKS_FEEDBACK; feedback.reset(); })
      .catch(function () { status.textContent = MSG_ERROR; });
  });
})();
