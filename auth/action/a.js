// KORA Field — Firebase email link check (2026-10-13 · Jun 「다 해결」 after the 2-step notice link removed whurlpoo0418's 2-step at 01:20).
// Firebase sends every account email link here first (Identity Platform notification.sendEmail.callbackUri = https://koracarenepal.com/auth/action/).
// · revertSecondFactorAddition (the "If you didn't add this 2-step verification, click the link below to remove it." link) = asks first,
//   and only a second press of the red button goes on to Firebase's own page, which removes the 2-step.
// · every other link (password reset · email confirmation · email change) = goes straight on to Firebase's own page, unchanged.
// The query string is passed on exactly as Firebase made it, to one fixed address — nothing from it is ever put into the page.
(function () {
  var BASE = 'https://kora-field.firebaseapp.com/__/auth/action';
  function route(search) {
    var s = String(search || '');
    if (s && s.charAt(0) !== '?') s = '?' + s;
    var q = new URLSearchParams(s);
    var mode = q.get('mode') || '', code = q.get('oobCode') || '';
    if (!mode || !code) return { kind: 'none' };
    return { kind: mode === 'revertSecondFactorAddition' ? 'ask' : 'go', url: BASE + s };
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { route: route, BASE: BASE }; return; }

  var r = route(location.search);
  function show(id) {
    var ids = ['vGo', 'vAsk', 'vKept', 'vNone'];
    for (var i = 0; i < ids.length; i++) document.getElementById(ids[i]).hidden = ids[i] !== id;
  }
  if (r.kind === 'go') {
    document.getElementById('goLink').href = r.url;
    show('vGo');
    location.replace(r.url);
    return;
  }
  if (r.kind === 'none') { show('vNone'); return; }

  show('vAsk');
  var keep = document.getElementById('keep'), off = document.getElementById('off'), offNote = document.getElementById('offNote');
  var armed = false;
  keep.addEventListener('click', function () {
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* the link stays in the mail anyway */ }
    show('vKept');
    try { window.close(); } catch (e) { /* a tab opened from a mail app cannot always close itself — the text says to close it */ }
  });
  off.addEventListener('click', function () {
    if (!armed) { armed = true; off.classList.add('armed'); offNote.hidden = false; return; }
    off.disabled = true;
    location.href = r.url;
  });
})();
