// Inside the desktop app, skip the web landing text and open straight on the machine.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('inapp', 'desktop-app');
  const s = document.createElement('style');
  s.textContent = '#dl, .cta, .back { display: none !important; }';
  document.head.appendChild(s);
});
