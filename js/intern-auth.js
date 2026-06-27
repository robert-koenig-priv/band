// Einfacher clientseitiger Zugriffsschutz für den internen Bereich.
// Hinweis: Dies ist KEIN echter Schutz – der Hash steht im Quelltext und
// lässt sich umgehen. Für echte Sicherheit braucht es ein Backend
// (z. B. HTTP-Basic-Auth oder Login mit Server).
(function () {
  const HASH = '9078e43e365a0d2849587c33e1623ccdbd92ad1ea81c5762414e9fbee6f20c03'; // SHA-256 von "bunker"
  const form = document.getElementById('authForm');
  const input = document.getElementById('authInput');
  const error = document.getElementById('authError');
  if (!form || !input) return;

  async function sha256(str) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function unlock() {
    try { sessionStorage.setItem('ds_intern', 'ok'); } catch (e) {}
    document.documentElement.classList.remove('gate-locked');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let ok = false;
    try {
      // crypto.subtle nur im sicheren Kontext (HTTPS/localhost) verfügbar
      ok = (await sha256(input.value)) === HASH;
    } catch (err) {
      ok = input.value === 'bunker'; // Fallback z. B. bei file://
    }
    if (ok) {
      unlock();
    } else {
      if (error) error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();
