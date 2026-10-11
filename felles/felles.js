// Felles oppførsel: innglidning, meny og demoskjema. Ingen sporing, ingen eksterne kall.
(() => {
  document.documentElement.classList.remove('no-js');

  // Innglidning når delene kommer inn i bildet
  const inn = document.querySelectorAll('.inn');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((rader) => {
      rader.forEach((r) => { if (r.isIntersecting) { r.target.classList.add('synlig'); io.unobserve(r.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    inn.forEach((el) => io.observe(el));
  } else inn.forEach((el) => el.classList.add('synlig'));

  // Meny: knapp med aria-controls åpner et lag; Esc og klikk på lenke lukker, fokus går tilbake
  document.querySelectorAll('[data-meny]').forEach((knapp) => {
    const lag = document.getElementById(knapp.getAttribute('aria-controls'));
    if (!lag) return;
    const lenker = () => lag.querySelectorAll('a, button');
    const sett = (apen) => {
      knapp.setAttribute('aria-expanded', String(apen));
      knapp.setAttribute('aria-label', apen ? 'Lukk meny' : 'Åpne meny');
      lag.classList.toggle('apen', apen);
      lag.toggleAttribute('inert', !apen);
      document.body.classList.toggle('meny-apen', apen);
      if (apen) setTimeout(() => lenker()[0]?.focus(), 60); else knapp.focus();
    };
    lag.setAttribute('inert', '');
    knapp.addEventListener('click', () => sett(knapp.getAttribute('aria-expanded') !== 'true'));
    lag.addEventListener('click', (e) => { if (e.target.closest('a')) sett(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && knapp.getAttribute('aria-expanded') === 'true') sett(false);
      if (e.key === 'Tab' && lag.classList.contains('apen')) {
        const alle = [knapp, ...lenker()];
        const i = alle.indexOf(document.activeElement);
        e.preventDefault();
        alle[(i + (e.shiftKey ? -1 : 1) + alle.length) % alle.length].focus();
      }
    });
  });

  // Demoskjema: sender ingenting, sier det tydelig
  document.querySelectorAll('form[data-demo]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const svar = f.querySelector('.skjema-svar');
      if (!f.checkValidity()) { f.reportValidity(); return; }
      if (svar) svar.textContent = 'Takk. Dette er en demo, så ingenting ble sendt.';
    });
  });
})();

// Fast befaringsknapp: vises når toppen er ute av syne, skjules ved skjema eller avslutning
(() => {
  const fast = document.querySelector('.fast');
  const topp = document.querySelector('[data-topp]');
  if (!fast || !topp || !('IntersectionObserver' in window)) return;
  let iTopp = true, iSlutt = false;
  const oppdater = () => fast.classList.toggle('vis', !iTopp && !iSlutt);
  new IntersectionObserver(([r]) => { iTopp = r.isIntersecting; oppdater(); }).observe(topp);
  const slutt = document.querySelector('[data-skjul-fast]');
  if (slutt) new IntersectionObserver(([r]) => { iSlutt = r.isIntersecting; oppdater(); }, { threshold: 0.15 }).observe(slutt);
})();
