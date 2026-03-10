const GAS_URL = '';

const envelopeScreen = document.querySelector('#envelope-screen');
const openBtn = document.querySelector('.open-btn');
const envelope = document.querySelector('.envelope');

if (openBtn && envelopeScreen && envelope) {
  openBtn.addEventListener('click', () => {
    openBtn.disabled = true;
    envelope.classList.add('is-open');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hideDelay = prefersReduced ? 0 : 900;

    window.setTimeout(() => {
      envelopeScreen.classList.add('is-hidden');
      window.scrollTo(0, 0);
      window.setTimeout(() => {
        envelopeScreen.remove();
      }, 600);
    }, hideDelay);
  });
}
const countdownRoot = document.querySelector('[data-countdown]');
if (countdownRoot) {
  const targetDate = new Date(countdownRoot.dataset.countdown);
  const nodes = {
    days: countdownRoot.querySelector('[data-count="days"]'),
    hours: countdownRoot.querySelector('[data-count="hours"]'),
    minutes: countdownRoot.querySelector('[data-count="minutes"]'),
    seconds: countdownRoot.querySelector('[data-count="seconds"]')
  };

  const updateCountdown = () => {
    const now = new Date();
    const diff = Math.max(0, targetDate - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (nodes.days) nodes.days.textContent = String(days).padStart(2, '0');
    if (nodes.hours) nodes.hours.textContent = String(hours).padStart(2, '0');
    if (nodes.minutes) nodes.minutes.textContent = String(minutes).padStart(2, '0');
    if (nodes.seconds) nodes.seconds.textContent = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

const slider = document.querySelector('[data-slider]');
if (slider) {
  const display = slider.querySelector('.lookbook__display');
  const prevBtn = slider.querySelector('.lookbook__nav--prev');
  const nextBtn = slider.querySelector('.lookbook__nav--next');
  const images = (slider.dataset.images || '').split('|').filter(Boolean);
  let index = 0;

  const showImage = (nextIndex) => {
    if (!display || images.length === 0) return;
    index = (nextIndex + images.length) % images.length;
    display.style.backgroundImage = `url('${images[index]}')`;
    display.setAttribute('aria-label', `Пример образа ${index + 1} из ${images.length}`);
  };

  showImage(index);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showImage(index - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showImage(index + 1));
  }

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  if (display) {
    display.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isDragging = true;
    }, { passive: true });

    display.addEventListener('touchend', (event) => {
      if (!isDragging) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      isDragging = false;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          showImage(index + 1);
        } else {
          showImage(index - 1);
        }
      }
    });
  }
}

const revealItems = document.querySelectorAll('.section, .hero');
if (revealItems.length) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealItems.forEach((item) => item.classList.add('reveal', 'is-visible'));
  } else if ('IntersectionObserver' in window) {
    revealItems.forEach((item) => item.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal', 'is-visible'));
  }
}

const form = document.querySelector('#rsvp-form');
const status = document.querySelector('#form-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!GAS_URL) {
      if (status) {
        status.textContent = 'Добавьте ссылку на GAS веб-приложение в script.js.';
      }
      return;
    }

    const formData = new FormData(form);
    const drinks = formData.getAll('drinks');

    const payload = new URLSearchParams({
      name: formData.get('name') || '',
      attendance: formData.get('attendance') || '',
      drinks: drinks.join(', '),
      phone: formData.get('phone') || '',
      comment: formData.get('comment') || ''
    });

    if (status) {
      status.textContent = 'Отправляем...';
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: payload.toString()
      });

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      form.reset();
      if (status) {
        status.textContent = 'Спасибо! Мы получили ваш ответ.';
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Не удалось отправить форму. Попробуйте позже.';
      }
    }
  });
}

