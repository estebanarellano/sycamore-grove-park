/* Sycamore Grove Park & Ramona Hall Master Plan: page behavior.
   No libraries. The page reads fine without this file; it adds the menu, language switching,
   the timeline layout, the highlighted values, the map switch and the forms. */

/* ---------- Settings ----------
   FORM_ENDPOINT: the Google Apps Script web app URL RAP uses for the sister sites' forms.
   Leave empty until the team confirms where Sycamore Grove submissions should go;
   while empty, forms show a message and send nothing. */
var FORM_ENDPOINT = '';
var SITE_ID = 'sgv';

(function () {
  'use strict';

  var LANG = 'EN';
  var T = window.TRANSLATIONS || { EN: {} };
  function t(key) { return (T[LANG] && T[LANG][key]) || (T.EN && T.EN[key]) || ''; }

  /* ---------- Review-notes button shows once the opening has scrolled past (draft only) ---------- */
  var intro = document.getElementById('intro');
  if (intro && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('past-hero', !entries[0].isIntersecting);
    }, { threshold: 0.2 }).observe(intro);
  } else {
    document.body.classList.add('no-io');
  }

  /* ---------- Dialogs: menu, feedback, review notes ---------- */
  function openDialog(d) { if (!d) return; if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); }
  function closeDialog(d) { if (!d) return; if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target === d && !d.classList.contains('menu')) closeDialog(d);
      if (e.target.closest('[data-close]')) closeDialog(d);
    });
  });
  var menu = document.getElementById('menu');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () { openDialog(menu); });
  if (menu) menu.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { closeDialog(menu); }); });
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
  document.addEventListener('click', function (e) { if (langList && !langList.hidden && !e.target.closest('.lang')) setLangMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && langList && !langList.hidden) { setLangMenu(false); langBtn.focus(); } });

  /* English lives in the HTML; remember it the first time so switching back restores it */
  function original(el, kind) {
    var k = 'en' + kind;
    if (el.dataset[k] === undefined) {
      el.dataset[k] = kind === 'Html' ? el.innerHTML
        : kind === 'Ph' ? (el.getAttribute('placeholder') || '')
        : kind === 'Aria' ? (el.getAttribute('aria-label') || '')
        : kind === 'Alt' ? (el.getAttribute('alt') || '')
        : el.textContent;
    }
    return el.dataset[k];
  }

  function applyLang(code) {
    LANG = T[code] ? code : 'EN';
    var dict = T[LANG] || {};
    var meta = (window.LANGS && LANGS[LANG]) || { html: 'en', code: 'EN' };
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var en = original(el, 'Text'); el.textContent = dict[el.getAttribute('data-i18n')] || en; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var en = original(el, 'Html'); el.innerHTML = dict[el.getAttribute('data-i18n-html')] || en; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { var en = original(el, 'Ph'); el.setAttribute('placeholder', dict[el.getAttribute('data-i18n-placeholder')] || en); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var en = original(el, 'Aria'); el.setAttribute('aria-label', dict[el.getAttribute('data-i18n-aria')] || en); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { var en = original(el, 'Alt'); el.setAttribute('alt', dict[el.getAttribute('data-i18n-alt')] || en); });

    document.documentElement.lang = meta.html;
    var siteName = document.querySelector('[data-i18n="site_name"]');
    var albumTitle = document.querySelector('.album__title');
    if (siteName) document.title = (albumTitle ? albumTitle.textContent + ' · ' : '') + siteName.textContent;
    var codeEl = document.querySelector('.lang__code');
    if (codeEl) codeEl.textContent = meta.code;
    if (langList) langList.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-current', b.getAttribute('data-lang') === LANG ? 'true' : 'false'); });
    try { localStorage.setItem('sgv-lang', LANG); } catch (e) { /* storage unavailable */ }

    activeTerm = null; showTip(null);
    drawTimeline();
  }
  if (langList) langList.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); setLangMenu(false); langBtn.focus(); });
  });

  /* ---------- Opening: highlighted values ---------- */
  var values = document.querySelector('.landing__values');
  var tip = document.getElementById('value-tip');
  var tipText = tip && tip.querySelector('.landing__tip-text');
  var activeTerm = null;
  function showTip(key) {
    if (!tipText) return;
    tipText.textContent = key ? t('tip_' + key) : (T[LANG] && T[LANG].tip_default) || original(tipText, 'Text');
    tip.classList.toggle('is-active', !!key);
  }
  if (values) {
    values.addEventListener('click', function (e) {
      var b = e.target.closest('.term'); if (!b) return;
      var key = b.getAttribute('data-tip');
      activeTerm = activeTerm === key ? null : key;
      values.querySelectorAll('.term').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-tip') === activeTerm ? 'true' : 'false'); });
      showTip(activeTerm);
    });
    values.addEventListener('mouseover', function (e) { var b = e.target.closest('.term'); if (b) showTip(b.getAttribute('data-tip')); });
    values.addEventListener('mouseout', function (e) { if (e.target.closest('.term')) showTip(activeTerm); });
  }

  /* ---------- Map: Today / Historic ---------- */
  document.querySelectorAll('.seg [data-view]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var view = btn.getAttribute('data-view');
      btn.parentNode.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      document.querySelectorAll('[data-view-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-view-panel') !== view; });
    });
  });

  /* ---------- Timeline ----------
     Every item carries its own date (data-at, or data-from and data-to).
     This places each one, writes its date in the current language, and puts "Today" where today is. */
  function parseDate(s) { var p = (s || '').split('-'); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
  function locale() { return document.documentElement.lang || 'en'; }
  function fmt(d, precision) {
    if (precision === 'season') {
      var m = d.getMonth(), y = d.getFullYear();
      var s = m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 7 ? 'summer' : m >= 8 && m <= 10 ? 'fall' : 'winter';
      return (t('season_fmt') || '{season} {year}').replace('{season}', t('season_' + s)).replace('{year}', y);
    }
    var o = precision === 'day' ? { year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'short' };
    try { return new Intl.DateTimeFormat(locale(), o).format(d); } catch (e) { return d.toDateString(); }
  }
  function drawTimeline() {
    var tl = document.getElementById('timeline'); if (!tl) return;
    var start = parseDate(tl.getAttribute('data-from')), end = parseDate(tl.getAttribute('data-to'));
    var span = end - start;
    function pos(d) { return Math.max(0, Math.min(1, (d - start) / span)); }

    tl.querySelectorAll('[data-from][data-to]').forEach(function (el) {
      if (el === tl) return;
      var a = parseDate(el.getAttribute('data-from')), b = parseDate(el.getAttribute('data-to'));
      el.style.setProperty('--p', pos(a).toFixed(4));
      el.style.setProperty('--w', (pos(b) - pos(a)).toFixed(4));
      var dateEl = el.querySelector('.ti__date');
      if (dateEl) dateEl.textContent = fmt(a, 'month') + ' – ' + fmt(b, 'month');
    });
    tl.querySelectorAll('[data-at]').forEach(function (el) {
      var d = parseDate(el.getAttribute('data-at'));
      el.style.setProperty('--p', pos(d).toFixed(4));
      var dateEl = el.querySelector('.ti__date');
      if (dateEl) dateEl.textContent = fmt(d, el.getAttribute('data-precision') || 'month');
    });

    /* year labels and dashed lines at each phase change */
    var years = tl.querySelector('.tl__years');
    tl.querySelectorAll('.tl__gridline').forEach(function (g) { g.remove(); });
    if (years) {
      years.innerHTML = '';
      var marks = [{ p: 0, label: String(start.getFullYear()) }];
      for (var y = start.getFullYear() + 1; new Date(y, 0, 1) < end; y++) marks.push({ p: pos(new Date(y, 0, 1)), label: String(y) });
      marks.forEach(function (m) {
        var s = document.createElement('span'); s.className = 'tl__year'; s.textContent = m.label; s.style.setProperty('--p', m.p.toFixed(4)); years.appendChild(s);
      });
      tl.querySelectorAll('.tl__phase').forEach(function (ph, i) {
        if (i === 0) return;
        var g = document.createElement('div'); g.className = 'tl__gridline'; g.setAttribute('aria-hidden', 'true');
        g.style.setProperty('--p', pos(parseDate(ph.getAttribute('data-from'))).toFixed(4)); tl.appendChild(g);
      });
    }

    var today = tl.querySelector('.tl__today');
    if (today) {
      var now = new Date();
      today.hidden = now < start || now > end;
      today.style.setProperty('--p', pos(now).toFixed(4));
    }
  }

  /* ---------- Forms ---------- */
  function send(payload) {
    return fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  var signup = document.getElementById('signup-form');
  if (signup) signup.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = signup.querySelector('.form-status');
    var input = signup.querySelector('input[type="email"]');
    if (!validEmail(input.value.trim())) { status.textContent = t('msg_email_invalid'); input.focus(); return; }
    if (!FORM_ENDPOINT) { status.textContent = t('msg_not_connected'); return; }
    send({ site: SITE_ID, form: 'updates', email: input.value.trim(), lang: document.documentElement.lang })
      .then(function () { status.textContent = t('msg_thanks_signup'); signup.reset(); })
      .catch(function () { status.textContent = t('msg_error'); });
  });

  var feedback = document.getElementById('feedback-form');
  if (feedback) feedback.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = feedback.querySelector('.form-status');
    var msg = feedback.querySelector('#fb-message');
    var email = feedback.querySelector('#fb-email');
    if (!msg.value.trim()) { status.textContent = t('msg_need_message'); msg.focus(); return; }
    if (email.value.trim() && !validEmail(email.value.trim())) { status.textContent = t('msg_check_email'); email.focus(); return; }
    if (!FORM_ENDPOINT) { status.textContent = t('msg_not_connected'); return; }
    var data = new FormData(feedback);
    send({ site: SITE_ID, form: 'feedback', kind: data.get('kind'), place: data.get('place'), message: data.get('message'), name: data.get('name'), email: data.get('email'), lang: document.documentElement.lang })
      .then(function () { status.textContent = t('msg_thanks_feedback'); feedback.reset(); })
      .catch(function () { status.textContent = t('msg_error'); });
  });

  /* ---------- Start ---------- */
  var saved = null;
  try { saved = localStorage.getItem('sgv-lang'); } catch (e) { /* storage unavailable */ }
  applyLang(saved && T[saved] ? saved : 'EN');
})();
