const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contactForm');

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  document.body.classList.remove('nav-open');
  menuToggle?.classList.remove('is-open');
  mainNav?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const activeNavObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);

sections.forEach((section) => activeNavObserver.observe(section));

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const nome = data.get('nome')?.toString().trim() || 'Não informado';
  const empresa = data.get('empresa')?.toString().trim() || 'Não informado';
  const telefone = data.get('telefone')?.toString().trim() || 'Não informado';
  const mensagem = data.get('mensagem')?.toString().trim() || 'Não informado';

  const text = [
    'Olá, vim pelo site da Lig Automação.',
    '',
    `Nome: ${nome}`,
    `Empresa: ${empresa}`,
    `Telefone: ${telefone}`,
    '',
    `Mensagem: ${mensagem}`
  ].join('\n');

  const url = `https://wa.me/5513981434489?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
});
