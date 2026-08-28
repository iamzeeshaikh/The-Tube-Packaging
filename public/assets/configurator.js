/* The tube configurator's client behaviour.
 *
 * Progressive enhancement: every step is in the DOM as real radios and inputs
 * inside one <form>, so with this script blocked the page is a long form that
 * still posts to /api/form/. This adds the one-step-at-a-time flow, the
 * defaults that follow from what is being packed, the running summary and the
 * fetch submit.
 *
 * There is no price calculation here, deliberately. See src/lib/copy/configurator.js.
 */
(function () {
  var root = document.getElementById('ttp-configurator');
  if (!root) return;
  document.documentElement.classList.remove('no-js');

  var form = root.querySelector('.ttp-cfg__form');
  var stepEls = [].slice.call(root.querySelectorAll('.ttp-cfg__step'));
  var bar = root.querySelector('.ttp-cfg__bar');
  var progress = root.querySelector('.ttp-cfg__progress');
  var backBtn = root.querySelector('.ttp-cfg__back');
  var nextBtn = root.querySelector('.ttp-cfg__next');
  var sendBtn = root.querySelector('.ttp-cfg__send');
  var msg = root.querySelector('.ttp-cfg__msg');
  var sumEmpty = root.querySelector('.ttp-cfg__sumEmpty');
  var isFood = false;
  var at = 0;

  function active() {
    return stepEls.filter(function (s) {
      return !(s.dataset.foodOnly && !isFood);
    });
  }

  function show() {
    var list = active();
    if (at >= list.length) at = list.length - 1;
    if (at < 0) at = 0;
    stepEls.forEach(function (s) { s.hidden = true; });
    var cur = list[at];
    cur.hidden = false;
    cur.querySelector('.ttp-cfg__n').textContent = String(at + 1);
    cur.querySelector('.ttp-cfg__total').textContent = String(list.length);
    backBtn.hidden = at === 0;
    var last = at === list.length - 1;
    nextBtn.hidden = last;
    sendBtn.hidden = !last;
    bar.style.width = Math.round(((at + 1) / list.length) * 100) + '%';
    progress.setAttribute('aria-valuenow', String(at + 1));
    progress.setAttribute('aria-valuemax', String(list.length));
    if (cur.dataset.step === 'diameter') syncDiameters();
    var focusable = cur.querySelector('input:not([type=hidden]), textarea');
    if (focusable && at > 0) focusable.focus({ preventScroll: true });
    var top = root.getBoundingClientRect().top + window.pageYOffset - 90;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  // only the diameter set matching the chosen size class is shown
  function syncDiameters() {
    var size = checkedId('size') || 'medium';
    [].forEach.call(root.querySelectorAll('.ttp-cfg__diaSet'), function (g) {
      var on = g.dataset.size === size;
      g.hidden = !on;
      if (!on) {
        [].forEach.call(g.querySelectorAll('input'), function (i) { i.checked = false; });
      }
    });
    if (!root.querySelector('input[name="form_fields[diameter]"]:checked')) {
      var first = root.querySelector('.ttp-cfg__diaSet:not([hidden]) input');
      if (first) { first.checked = true; summarise(); }
    }
  }

  function checked(step) {
    return root.querySelector('input[name="form_fields[' + step + ']"]:checked');
  }
  function checkedId(step) {
    var el = checked(step);
    return el ? el.dataset.id : '';
  }

  function summarise() {
    var any = false;
    [].forEach.call(root.querySelectorAll('.ttp-cfg__sumRow'), function (row) {
      var el = checked(row.dataset.sum);
      var hideForFood = row.dataset.foodOnly && !isFood;
      if (el && !hideForFood) {
        row.hidden = false;
        row.querySelector('dd').textContent = el.value;
        any = true;
      } else {
        row.hidden = true;
      }
    });
    sumEmpty.hidden = any;
  }

  // what is being packed pre-selects the rest, and decides whether the
  // food-contact liner step is asked at all
  function applyDefaults(input) {
    isFood = input.dataset.food === '1';
    var defs;
    try { defs = JSON.parse(input.dataset.defaults || '{}'); } catch (e) { defs = {}; }
    Object.keys(defs).forEach(function (step) {
      var want = String(defs[step]);
      var match = [].filter.call(
        root.querySelectorAll('input[name="form_fields[' + step + ']"]'),
        function (i) { return i.dataset.id === want; })[0];
      if (match) match.checked = true;
    });
    syncDiameters();
    summarise();
  }

  form.addEventListener('change', function (e) {
    var input = e.target;
    if (input.name === 'form_fields[packing]') applyDefaults(input);
    if (input.name === 'form_fields[size]') syncDiameters();
    summarise();
    if (msg) msg.hidden = true;
  });

  var REQUIRED = ['packing', 'size', 'diameter', 'length', 'wall', 'material',
    'closure', 'quantity'];

  // a step now holds several fields, so every required one in the visible step
  // has to be answered before it will advance
  function missingIn(stepEl) {
    var names = {};
    [].forEach.call(stepEl.querySelectorAll('input[type=radio]'), function (i) {
      var m = /form_fields\[(.+?)\]/.exec(i.name);
      if (m && !i.closest('[hidden]')) names[m[1]] = true;
    });
    return Object.keys(names).filter(function (n) {
      return REQUIRED.indexOf(n) !== -1 && !checked(n);
    });
  }

  nextBtn.addEventListener('click', function () {
    var cur = active()[at];
    var missing = missingIn(cur);
    if (missing.length) {
      show_message('err', 'Please choose ' + (missing.length > 1 ? 'each option' : 'an option') + ' to continue.');
      return;
    }
    msg.hidden = true;
    at += 1;
    show();
  });

  backBtn.addEventListener('click', function () { at -= 1; msg.hidden = true; show(); });

  function show_message(kind, text) {
    msg.textContent = text;
    msg.className = 'ttp-cfg__msg ttp-cfg__msg--' + kind;
    msg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // the last step carries quantity as well as the contact fields, and the
    // Send button bypasses the Continue validation — so check the whole form
    var unanswered = active().reduce(function (all, stepEl) {
      return all.concat(missingIn(stepEl));
    }, []);
    if (unanswered.length) {
      show_message('err', 'Please complete every step before sending.');
      return;
    }
    var name = form.querySelector('#cfg-name');
    var email = form.querySelector('#cfg-email');
    if (!name.value.trim() || !email.value.trim() || !email.checkValidity()) {
      show_message('err', 'Please add your name and a valid email address.');
      (name.value.trim() ? email : name).focus();
      return;
    }
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    var data = new FormData(form);
    data.append('page_url', location.href);
    fetch('/api/form/', { method: 'POST', body: data })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send my specification';
        if (res && res.ok) {
          show_message('ok', res.message
            || 'Thank you — your specification has been sent. We will come back with a quote.');
          sendBtn.hidden = true;
          backBtn.hidden = true;
        } else {
          show_message('err', (res && res.message) || 'An error occurred.');
        }
      })
      .catch(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send my specification';
        show_message('err', 'An error occurred.');
      });
  });

  summarise();
  show();
}());
