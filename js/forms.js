document.addEventListener('DOMContentLoaded', () => {

  // ===== TOAST =====
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const msg   = document.getElementById('toast-message');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.style.borderColor = type === 'success'
      ? 'rgba(42,184,176,0.45)'
      : 'rgba(224,80,80,0.45)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
  }

  // ===== VALIDACIÓN =====
  function validateField(field) {
    const val = field.value.trim();
    let ok = true;

    if (!val) {
      ok = false;
    } else if (field.type === 'email') {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else if (field.tagName === 'SELECT') {
      ok = val !== '';
    } else if (field.tagName === 'TEXTAREA') {
      ok = val.length >= 10;
    }

    field.classList.toggle('error', !ok);
    return ok;
  }

  const form = document.getElementById('contact-form');
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('error')) validateField(field); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('[required]');
    let isValid = true;
    fields.forEach(f => { if (!validateField(f)) isValid = false; });

    if (!isValid) {
      showToast('Completa todos los campos correctamente.', 'error');
      const first = form.querySelector('.error');
      if (first) first.focus();
      return;
    }

    const btn     = form.querySelector('button[type="submit"]');
    const btnSpan = btn.querySelector('span');
    const orig    = btnSpan.textContent;

    btn.disabled = true;
    btnSpan.textContent = 'Enviando…';

    setTimeout(() => {
      btn.disabled = false;
      btnSpan.textContent = orig;
      form.reset();
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      showToast('✓ Mensaje enviado. Te contactamos en menos de 24 h.');
    }, 1600);
  });
});
