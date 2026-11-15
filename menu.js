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
