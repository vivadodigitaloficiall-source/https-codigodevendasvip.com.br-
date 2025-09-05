// Accessible accordion for FAQ
(function(){
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const btn = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    btn.addEventListener('click', () => toggle());
    btn.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
    function toggle(){
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('open', !isOpen);
    }
  });
})();
