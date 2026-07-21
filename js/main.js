// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navBackdrop = document.getElementById('navBackdrop');

function closeNav() {
  menuBtn.classList.remove('active');
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Abrir menu');
  navBackdrop.setAttribute('aria-hidden', 'true');
}

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.classList.toggle('active', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  navBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});

navBackdrop.addEventListener('click', closeNav);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeNav);
});

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 769px)').matches && nav.classList.contains('open')) {
    closeNav();
  }
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// Contact form — salva em pasta e abre e-mail
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const dados = {
    nome: form.nome.value.trim(),
    telefone: form.telefone.value.trim(),
    email: form.email.value.trim(),
    mensagem: form.mensagem.value.trim()
  };

  btn.disabled = true;
  btn.textContent = 'Enviando...';
  formFeedback.textContent = '';
  formFeedback.className = 'form-feedback';

  try {
    const res = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      throw new Error(result.erro || 'Erro ao enviar mensagem.');
    }

    formFeedback.textContent = 'Mensagem salva com sucesso! Abrindo seu e-mail...';
    formFeedback.classList.add('form-feedback--success');
    form.reset();

    const assunto = encodeURIComponent(`Contato pelo site — ${dados.nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${dados.nome}\nTelefone: ${dados.telefone}\nE-mail: ${dados.email || 'Não informado'}\n\nMensagem:\n${dados.mensagem}`
    );
    window.location.href = `mailto:mfelevadores87@gmail.com?subject=${assunto}&body=${corpo}`;
  } catch (err) {
    formFeedback.textContent = err.message || 'Não foi possível enviar. Tente novamente.';
    formFeedback.classList.add('form-feedback--error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Mensagem';
  }
});

// Phone mask
const telInput = document.getElementById('telefone');
telInput.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    e.target.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    e.target.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    e.target.value = `(${v}`;
  }
});
