/*
 * Runtime behaviour that WordPress used to get from Elementor's frontend
 * bundles. Everything else -- sticky header, off-canvas drawer, search modal,
 * submenu toggles, WhatsApp widget, product gallery slider and zoom -- still
 * runs from the original vendor scripts, which are shipped unchanged.
 *
 * Covered here:
 *   1. Elementor's user-agent body classes
 *   2. entrance animations (elementor-invisible -> animated <name>)
 *   3. the popup dialog and its trigger links
 *   4. Elementor Pro form submission
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- 1. UA
  // Elementor stamps these only where its frontend bundle was enqueued, which
  // is not simply "the page contains Elementor markup" -- /thank-you/ has
  // Elementor containers but never loaded the bundle. The build records what
  // the original page did.
  var self = document.currentScript ||
    document.querySelector('script[src="/assets/ttp.js"]');
  if (self && self.dataset.elementorFrontend === '1') {
    var ua = navigator.userAgent;
    var flags = [];
    if (/Chrome|Chromium|Edg/.test(ua)) flags.push('e--ua-blink');
    else if (/Firefox/.test(ua)) flags.push('e--ua-firefox');
    else if (/Safari/.test(ua)) flags.push('e--ua-safari');
    if (/Mac OS X/.test(ua)) flags.push('e--ua-mac');
    else if (/Windows/.test(ua)) flags.push('e--ua-windows');
    if (/AppleWebKit/.test(ua)) flags.push('e--ua-webkit');
    document.body.classList.add.apply(document.body.classList, flags);
  }

  // -------------------------------------------------------- 2. animations
  function settingsOf(el) {
    var raw = el.getAttribute('data-settings');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function animationName(el) {
    var s = settingsOf(el);
    if (!s) return null;
    var name = s._animation || s.animation;
    if (!name || name === 'none') return null;
    return name;
  }

  var animated = document.querySelectorAll('.elementor-invisible');
  if (animated.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          play(entry.target);
          obs.unobserve(entry.target);
        });
      }, { rootMargin: '0px' });
      Array.prototype.forEach.call(animated, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(animated, play);
    }
  }

  function play(el) {
    var name = animationName(el);
    var s = settingsOf(el) || {};
    var delay = parseInt(s._animation_delay || s.animation_delay || 0, 10) || 0;
    setTimeout(function () {
      el.classList.remove('elementor-invisible');
      if (name) el.classList.add('animated', name);
    }, delay);
  }

  // ------------------------------------------------------------- 3. popup
  var CLOSE_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="eicon-close" viewBox="0 0 1000 1000"><path d="M742 167L500 408 258 ' +
    '167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 ' +
    '229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 ' +
    '829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 ' +
    '804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 ' +
    '137 775 137 742 167Z"></path></symbol></svg>';

  // Elementor lifts popup templates out of the document on init and only puts
  // them back inside the dialog when the popup opens, so before any click the
  // page contains neither the template nor the form inside it.
  var popups = {};
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-elementor-type="popup"]'),
    function (tpl) {
      popups[tpl.getAttribute('data-elementor-id')] = tpl;
      tpl.parentNode.removeChild(tpl);
    }
  );

  var openModal = null;

  function popupSettings(tpl) {
    try { return JSON.parse(tpl.getAttribute('data-elementor-settings') || '{}'); }
    catch (e) { return {}; }
  }

  function buildModal(id, tpl) {
    var cfg = popupSettings(tpl);
    var modal = document.createElement('div');
    modal.className = 'dialog-widget dialog-lightbox-widget dialog-type-buttons ' +
      'dialog-type-lightbox elementor-popup-modal';
    modal.id = 'elementor-popup-modal-' + id;
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'document');
    modal.setAttribute('tabindex', '0');

    var content = document.createElement('div');
    content.className = 'dialog-widget-content dialog-lightbox-widget-content animated';
    if (cfg.entrance_animation) {
      content.classList.add(cfg.entrance_animation);
      var dur = cfg.entrance_animation_duration && cfg.entrance_animation_duration.size;
      if (dur) content.style.animationDuration = dur + 's';
    }

    var close = document.createElement('a');
    close.setAttribute('role', 'button');
    close.setAttribute('tabindex', '0');
    close.setAttribute('aria-label', 'Close');
    close.href = '#';
    close.className = 'dialog-close-button dialog-lightbox-close-button';
    close.innerHTML = '<svg class="e-font-icon-svg e-eicon-close eicon-close">' +
      '<use xlink:href="#eicon-close"></use></svg>';

    var header = document.createElement('div');
    header.className = 'dialog-header dialog-lightbox-header';

    var message = document.createElement('div');
    message.className = 'dialog-message dialog-lightbox-message';
    message.appendChild(tpl);
    tpl.style.display = 'block';

    var buttons = document.createElement('div');
    buttons.className = 'dialog-buttons-wrapper dialog-lightbox-buttons-wrapper';

    content.appendChild(close);
    content.appendChild(header);
    content.appendChild(message);
    content.appendChild(buttons);
    modal.appendChild(content);

    close.addEventListener('click', function (e) { e.preventDefault(); closePopup(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closePopup(); });
    return modal;
  }

  function openPopup(id) {
    var tpl = popups[id];
    if (!tpl || openModal) return;
    if (!document.getElementById('eicon-close')) {
      document.body.insertAdjacentHTML('beforeend', CLOSE_ICON);
    }
    openModal = buildModal(id, tpl);
    document.body.appendChild(openModal);
    document.body.classList.add('dialog-body', 'dialog-lightbox-body',
      'dialog-container', 'dialog-lightbox-container');
    openModal.focus();
  }

  function closePopup() {
    if (!openModal) return;
    var tpl = openModal.querySelector('[data-elementor-type="popup"]');
    if (tpl) { tpl.style.display = ''; tpl.parentNode.removeChild(tpl); }
    openModal.remove();
    openModal = null;
    document.body.classList.remove('dialog-body', 'dialog-lightbox-body',
      'dialog-container', 'dialog-lightbox-container');
  }

  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="elementor-action"]');
    if (!link) return;
    var href = decodeURIComponent(link.getAttribute('href') || '');
    var m = href.match(/action=popup:open&settings=([^&]+)/);
    if (!m) return;
    e.preventDefault();
    var cfg;
    try { cfg = JSON.parse(atob(m[1])); } catch (err) { return; }
    if (cfg && cfg.id) openPopup(String(cfg.id));
  });

  // ---------------------------------------------------------- 4. reCAPTCHA
  // The quote forms carry a visible "I'm not a robot" checkbox. Elementor Pro
  // loaded the API on page load and rendered each widget immediately.
  //
  // That cost 1.4 MB of third-party JavaScript on every page carrying a form —
  // Google ships recaptcha__en.js at 344 KB and fetches it once per frame, four
  // times in practice, plus 2 x 41 KB of styles. It was the largest single
  // weight on the site and none of it is needed until someone actually starts
  // filling a form in.
  //
  // So the API is now loaded on first interaction with any form: focus, input
  // or pointerdown. By the time a person has typed their name the widget has
  // rendered, and ttp.js still refuses to submit a form whose captcha has no
  // response, so nothing about the verification changes.
  var captchas = document.querySelectorAll('.elementor-g-recaptcha');
  if (captchas.length) {
    var API = 'https://www.google.com/recaptcha/api.js?render=explicit';
    var started = false;

    var renderAll = function () {
      Array.prototype.forEach.call(captchas, function (el) {
        if (el.dataset.rendered) return;
        el.dataset.rendered = '1';
        grecaptcha.render(el, {
          sitekey: el.dataset.sitekey,
          theme: el.dataset.theme || 'light',
          size: el.dataset.size || 'normal',
        });
      });
    };

    var loadCaptcha = function () {
      if (started) return;
      started = true;
      if (window.grecaptcha && grecaptcha.render) {
        grecaptcha.ready ? grecaptcha.ready(renderAll) : renderAll();
        return;
      }
      var s = document.createElement('script');
      s.src = API;
      s.async = true;
      s.defer = true;
      s.onload = function () {
        var waitForApi = setInterval(function () {
          if (window.grecaptcha && grecaptcha.render) {
            clearInterval(waitForApi);
            grecaptcha.ready ? grecaptcha.ready(renderAll) : renderAll();
          }
        }, 50);
      };
      document.head.appendChild(s);
    };

    ['focusin', 'pointerdown', 'keydown'].forEach(function (evt) {
      document.addEventListener(evt, function (e) {
        if (e.target && e.target.closest && e.target.closest('form.elementor-form')) {
          loadCaptcha();
        }
      }, { passive: true });
    });
    // a form already in view and focused by the browser still gets one
    if (document.activeElement && document.activeElement.closest
        && document.activeElement.closest('form.elementor-form')) loadCaptcha();
  }

  // -------------------------------------------------------------- 5. forms
  Array.prototype.forEach.call(document.querySelectorAll('form.elementor-form'),
    function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm(form);
      });
    });

  function clearMessages(form) {
    Array.prototype.forEach.call(form.querySelectorAll('.elementor-message'),
      function (n) { n.remove(); });
    Array.prototype.forEach.call(form.querySelectorAll('.elementor-error'),
      function (n) { n.classList.remove('elementor-error'); });
  }

  function showMessage(form, kind, text) {
    var box = document.createElement('div');
    box.className = 'elementor-message elementor-message-' + kind;
    box.setAttribute('role', 'alert');
    box.textContent = text;
    var wrap = form.querySelector('.elementor-form-fields-wrapper') || form;
    wrap.appendChild(box);
  }

  // The configured redirect is an absolute production URL. Follow it by path so
  // it also lands correctly when the build is served from a QA origin.
  function sameOrigin(url) {
    try { return new URL(url, location.href).pathname; } catch (e) { return url; }
  }

  function submitForm(form) {
    var button = form.querySelector('button[type="submit"]');
    clearMessages(form);

    // native constraint validation first -- same fields, same required flags
    var invalid = form.querySelectorAll(':invalid');
    if (invalid.length) {
      Array.prototype.forEach.call(invalid, function (field) {
        var group = field.closest('.elementor-field-group');
        if (group) group.classList.add('elementor-error');
      });
      showMessage(form, 'danger', form.dataset.invalidMessage ||
        "There's something wrong. The form is invalid.");
      invalid[0].focus();
      return;
    }

    // the reCAPTCHA checkbox is required wherever the form shows one
    var captcha = form.querySelector('.elementor-g-recaptcha');
    if (captcha && !(form.querySelector('[name="g-recaptcha-response"]') || {}).value) {
      showMessage(form, 'danger', "There's something wrong. The form is invalid.");
      return;
    }

    if (button) button.classList.add('elementor-button-state');
    var data = new FormData(form);
    data.append('page_url', location.href);

    fetch('/api/form/', { method: 'POST', body: data })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (res) {
        if (button) button.classList.remove('elementor-button-state');
        if (res && res.ok) {
          form.reset();
          showMessage(form, 'success', res.message || 'The form was sent successfully.');
          if (res.redirect) location.assign(sameOrigin(res.redirect));
        } else {
          showMessage(form, 'danger', (res && res.message) || 'An error occurred.');
        }
      })
      .catch(function () {
        if (button) button.classList.remove('elementor-button-state');
        showMessage(form, 'danger', 'An error occurred.');
      });
  }
})();
