const icons = {
  delivery:'<svg viewBox="0 0 24 24"><path d="M3 7h11v10H3z"/><path d="M14 10h3l4 4v3h-7z"/><path d="M6.5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="M17.5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="M5 11h5"/><path d="M5 14h3"/></svg>',
  atendimento:'<svg viewBox="0 0 24 24"><path d="M4 18h16"/><path d="M6 16a6 6 0 0 1 12 0"/><path d="M12 8V5"/><path d="M10 5h4"/></svg>',
  gestao:'<svg viewBox="0 0 24 24"><path d="M5 19V9"/><path d="M12 19V5"/><path d="M19 19v-7"/><path d="M3 19h18"/></svg>',
  pagamentos:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h3"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>',
  headset:'<svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2Z"/><path d="M20 13v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z"/></svg>',
  rocket:'<svg viewBox="0 0 24 24"><path d="M5 15c-1 1-2 4-2 6 2 0 5-1 6-2"/><path d="M9 15 4 10l3-3 5 5"/><path d="M14 5c3-3 6-3 7-2 1 1 1 4-2 7l-7 7-5-5 7-7Z"/><path d="M15 9h.01"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  whatsapp:'<svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 8c.3 3 2.5 5.4 6 6"/></svg>',
  monitor:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="1"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  check:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>'
};

document.querySelectorAll('[data-icon]').forEach(el => {
  const name = el.getAttribute('data-icon');
  if (icons[name]) el.innerHTML = icons[name];
});

const contacts = {
  comercial: {
    label: 'comercial',
    phone: '(13) 98143-4489',
    wa: '5513981434489',
    message: 'Olá, vim pelo site da LiG Automação.'
  },
  plantao: {
    label: 'plantão',
    phone: '(13) 99692-4357',
    wa: '5513996924357',
    message: 'Olá, preciso falar com o plantão da LiG Automação.'
  }
};

const pad = value => String(value).padStart(2, '0');
const dateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const getEasterDate = year => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const getBrazilHolidayKeys = year => {
  const easter = getEasterDate(year);
  return new Set([
    `${year}-01-01`,
    `${year}-04-21`,
    `${year}-05-01`,
    `${year}-09-07`,
    `${year}-10-12`,
    `${year}-11-02`,
    `${year}-11-15`,
    `${year}-11-20`,
    `${year}-12-25`,
    dateKey(addDays(easter, -48)),
    dateKey(addDays(easter, -47)),
    dateKey(addDays(easter, -2)),
    dateKey(addDays(easter, 60))
  ]);
};

const getSaoPauloNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
const shouldUsePlantao = now => {
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isAfterSix = now.getHours() >= 18;
  const isHoliday = getBrazilHolidayKeys(now.getFullYear()).has(dateKey(now));
  return isWeekend || isAfterSix || isHoliday;
};

const applyContactBySchedule = () => {
  const isPlantao = shouldUsePlantao(getSaoPauloNow());
  const contact = isPlantao ? contacts.plantao : contacts.comercial;
  const whatsappUrl = `https://wa.me/${contact.wa}?text=${encodeURIComponent(contact.message)}`;

  document.querySelectorAll('[data-contact-auto]').forEach(link => {
    link.href = whatsappUrl;
    link.setAttribute('aria-label', `Falar com a LiG Automação pelo WhatsApp do ${contact.label}`);
  });

  document.querySelectorAll('[data-contact-phone]').forEach(el => {
    el.textContent = contact.phone;
  });

  document.querySelectorAll('[data-contact-label]').forEach(el => {
    el.textContent = isPlantao ? 'Falar com o plantão' : 'Falar com especialista';
  });

  document.querySelectorAll('[data-contact-status]').forEach(el => {
    el.textContent = isPlantao
      ? 'Plantão ativo após as 18h, fins de semana e feriados.'
      : 'Comercial ativo em dias úteis antes das 18h.';
  });
};

applyContactBySchedule();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const navLinks = document.querySelectorAll('.main-nav a');
const sections = [...navLinks]
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  let current = '#topo';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = `#${section.id}`;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === current));
}, { passive: true });

document.querySelectorAll('.system-carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dots button')];
  const prev = carousel.querySelector('.carousel-control.prev');
  const next = carousel.querySelector('.carousel-control.next');
  let current = 0;
  let timer;

  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === current;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === current);
    });
  };

  const start = () => {
    timer = window.setInterval(() => showSlide(current + 1), 4500);
  };

  const restart = () => {
    window.clearInterval(timer);
    start();
  };

  prev?.addEventListener('click', () => {
    showSlide(current - 1);
    restart();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    restart();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      restart();
    });
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', () => window.clearInterval(timer));
  carousel.addEventListener('focusout', start);

  showSlide(0);
  start();
});
