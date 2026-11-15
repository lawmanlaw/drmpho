// Lift the loading splash once the page has loaded and the intro has played
const minIntro = 1400;
const lift = () => setTimeout(
  () => document.documentElement.classList.add('ready'),
  Math.max(0, minIntro - performance.now())
);
if (document.readyState === 'complete') lift();
else addEventListener('load', lift, { once: true });

// Close the mobile menu after a link is chosen
const menu = document.getElementById('menu');
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.hidePopover()));

// Contact form: sends through Web3Forms so the inbox address never appears on the site
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.cform-status');
  const button = form.querySelector('button[type="submit"]');
  const say = (text, kind) => { status.textContent = text; status.className = 'cform-status ' + kind; };

  form.addEventListener('input', e => e.target.removeAttribute('aria-invalid'));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (button.disabled) return;

    const fields = [...form.querySelectorAll('input[required], textarea[required]')];
    const bad = fields.filter(f => !f.value.trim() || !f.checkValidity());
    fields.forEach(f => f.toggleAttribute('aria-invalid', bad.includes(f)));
    if (bad.length) { say('Please fill in your name, a valid email and a message.', 'err'); bad[0].focus(); return; }

    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;

    button.disabled = true; say('Sending...', '');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error();
      form.reset();
      say('Thank you, your message has been sent.', 'ok');
    } catch {
      say('Something went wrong, please try again in a moment.', 'err');
    } finally {
      button.disabled = false;
    }
  });
}

// Put the cursor in the first field when the form is opened
const wrap = document.querySelector('.cform-wrap');
wrap?.addEventListener('toggle', () => {
  if (wrap.open) setTimeout(() => wrap.querySelector('#cf-name')?.focus({ preventScroll: true }), 60);
});
