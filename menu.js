// Close the mobile menu after a link is chosen
const menu = document.getElementById('menu');
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.hidePopover()));
