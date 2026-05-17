// LC Viagens — main.js

(function initApp() {
  // ─── MOBILE MENU LOGIC ───
  const hamburger = document.getElementById('hamburger');
  const closeMenu = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = link.dataset.cat;
      if (cat && window.renderCat) {
        window.renderCat(cat);
      }
      closeMobileMenu();
    });
  });

  // ─── BUDGET FORM LOGIC ───
  const budgetForm = document.getElementById('budget-form');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('b-nome').value;
      const zap = document.getElementById('b-whatsapp').value;
      const email = document.getElementById('b-email').value;
      const destino = document.getElementById('b-destino').value;
      const data = document.getElementById('b-data').value;
      const adultos = document.getElementById('b-adultos').value;
      const temCriancas = document.querySelector('input[name="b-criancas"]:checked').value === 'sim';
      const idades = document.getElementById('b-idades').value;
      const obs = document.getElementById('b-obs').value;

      let viajantes = `${adultos} adulto(s)`;
      if (temCriancas) {
        viajantes += ` + crianças`;
        if (idades) viajantes += ` (idades: ${idades})`;
      }

      const msg = encodeURIComponent(
        `Olá Clebert! Gostaria de um orçamento pela LC Viagens:\n\n` +
        `👤 *Nome:* ${nome}\n` +
        `📱 *WhatsApp:* ${zap}\n` +
        `📧 *E-mail:* ${email}\n` +
        `📍 *Destino:* ${destino}\n` +
        `📅 *Data Aproximada:* ${data}\n` +
        `👥 *Viajantes:* ${viajantes}\n` +
        `📝 *Obs:* ${obs || 'Nenhuma'}`
      );
      window.open(`https://wa.me/5582988017594?text=${msg}`, '_blank');
    });
  }

  // ─── HEADER SCROLL EFFECT ───
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // ─── ANIMATIONS ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .contato-card, .feature-item, .budget-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

})();
