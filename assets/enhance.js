/* Progressive enhancement only: share and copy buttons. Without JS both stay hidden and the page works as before. */
(function () {
  'use strict';
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }
  function say(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.textContent = ''; el.classList.remove('is-visible'); }, 2500);
  }
  var toast = document.querySelector('.toast');
  var canonical = document.querySelector('link[rel="canonical"]');
  var pageUrl = canonical ? canonical.href : location.href;

  document.querySelectorAll('.js-share').forEach(function (btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: document.title, url: pageUrl }).catch(function () {});
      } else {
        copyText(pageUrl).then(function () { say(toast, 'Link copied'); }, function () { say(toast, 'Copy failed. The link is ' + pageUrl); });
      }
    });
  });
  document.querySelectorAll('.js-copy').forEach(function (btn) {
    var status = btn.parentNode.querySelector('.copy-status');
    btn.hidden = false;
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy')).then(function () { say(status, 'Copied'); }, function () { say(status, 'Copy failed'); });
    });
  });
})();
