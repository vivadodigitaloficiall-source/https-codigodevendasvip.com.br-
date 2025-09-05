// Smooth scroll, animations on scroll, countdown timer, notifications, helpers
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // Year in footer
  $('#year').textContent = new Date().getFullYear();

  // Set checkout link placeholder
  const checkoutUrl = 'https://pay.kiwify.com.br/mSKZt3a'; // link oficial do checkout
  const buyBtn = $('#buy-now');
  if (buyBtn) buyBtn.href = checkoutUrl;

  // Smooth scroll for in-page anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        const el = document.querySelector(href);
        if(el){
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Back to top button
  const toTop = $('.to-top');
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    toTop.style.display = window.scrollY > 600 ? 'grid' : 'none';
    if(header){ header.classList.toggle('scrolled', window.scrollY > 8); }
  });
  toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  // Mobile nav toggle
  const nav = $('#nav-primary');
  const navToggle = document.querySelector('.nav-toggle');
  if(nav && navToggle){
    const close = () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); };
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if(e.target.closest('a')) close();
    });
    document.addEventListener('keydown', (e) => { if(e.key==='Escape') close(); });
  }

  // Active link on scroll
  const sections = ['#beneficios','#oferta','#prova-social','#faq'].map(id=>document.querySelector(id)).filter(Boolean);
  const links = $$('#nav-primary a').filter(a=>a.getAttribute('href').startsWith('#'));
  const setActive = () => {
    let current = null;
    for(const sec of sections){
      const rect = sec.getBoundingClientRect();
      if(rect.top <= 120 && rect.bottom >= 120){ current = '#'+sec.id; break; }
    }
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href')===current));
  };
  window.addEventListener('scroll', setActive, { passive:true });
  setActive();

  // Intersection Observer animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .2 });
  $$('[data-animate]').forEach(el => io.observe(el));

  // Notification mock (Pix / Venda)
  const notifRoot = $('.notif-stack');
  const saleMessages = [
    { title: 'Pix Recebido', msg: 'R$ 97,00 — Lucas, SP', ok:true },
  { title: 'Venda Aprovada', msg: 'R$ 97,00 — Marina, MG', ok:true },
  { title: 'Pix Recebido', msg: 'R$ 97,00 — Rafael, PR', ok:true },
    { title: 'Novo Aluno', msg: 'Bianca acabou de entrar', ok:true },
  ];
  function pushNotif(){
    if(!notifRoot) return;
    const item = saleMessages[Math.floor(Math.random()*saleMessages.length)];
    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `<span class="dot" aria-hidden="true"></span>
      <div><strong>${item.title}</strong><br/><small>${item.msg}</small></div>`;
    notifRoot.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }, 3500);
    setTimeout(() => el.remove(), 4200);
  }
  setTimeout(pushNotif, 2000);
  setInterval(pushNotif, 7000);

  // Countdown timer (2 hours rolling from first load per session)
  const hh = $('#hh'), mm = $('#mm'), ss = $('#ss');
  if (hh && mm && ss) {
    const KEY = 'cdv_offer_deadline';
    let deadline = sessionStorage.getItem(KEY);
    if(!deadline){
      deadline = Date.now() + 2*60*60*1000; // 2h
      sessionStorage.setItem(KEY, String(deadline));
    } else {
      deadline = Number(deadline);
    }

    function tick(){
      const now = Date.now();
      let diff = Math.max(0, deadline - now);
      const h = Math.floor(diff / 3_600_000);
      diff -= h * 3_600_000;
      const m = Math.floor(diff / 60_000);
      diff -= m * 60_000;
      const s = Math.floor(diff / 1000);
      hh.textContent = String(h).padStart(2,'0');
      mm.textContent = String(m).padStart(2,'0');
      ss.textContent = String(s).padStart(2,'0');
      if (deadline - now <= 0) {
        // Extend window subtly to keep urgency but not block purchase
        deadline = now + 20*60*1000; // +20 min
        sessionStorage.setItem(KEY, String(deadline));
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // (lead form removido por solicitação)
})();
