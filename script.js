const GAS_URL = 'https://script.google.com/macros/s/AKfycbwi_zVRPZSPxNr3t05zCrT8BhY8b0QYoMtSeodrONf2SYt_dpfk94QzJjfGOh1A24RgsA/exec';

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

const sliders = document.querySelectorAll('[data-slider]');
if (sliders.length) {
  sliders.forEach((slider) => {
    const display = slider.querySelector('.lookbook__display');
    const prevBtn = slider.querySelector('.lookbook__nav--prev');
    const nextBtn = slider.querySelector('.lookbook__nav--next');
    const images = (slider.dataset.images || '').split('|').map((item) => item.trim()).filter(Boolean);
    const positions = (slider.dataset.positions || '').split('|').map((item) => item.trim());
    const fits = (slider.dataset.fits || '').split('|').map((item) => item.trim().toLowerCase());
    const label = slider.dataset.label || 'Фото';
    let displayImage = null;
    let index = 0;

    if (display) {
      displayImage = display.querySelector('.lookbook__image');
      if (!displayImage) {
        displayImage = document.createElement('img');
        displayImage.className = 'lookbook__image';
        displayImage.alt = '';
        displayImage.loading = 'lazy';
        displayImage.decoding = 'async';
        display.append(displayImage);
      }
    }

    const showImage = (nextIndex) => {
      if (!display || images.length === 0) return;
      index = (nextIndex + images.length) % images.length;
      const imageUrl = encodeURI(images[index]);
      const fitValue = fits[index];
      const objectFit = fitValue === 'contain' || fitValue === 'cover' ? fitValue : 'cover';
      const objectPosition = positions[index] || 'center center';
      if (displayImage) {
        displayImage.src = imageUrl;
        displayImage.alt = `${label} ${index + 1} из ${images.length}`;
        displayImage.style.objectFit = objectFit;
        displayImage.style.objectPosition = objectPosition;
      } else {
        display.style.backgroundImage = `url('${imageUrl}')`;
        display.style.backgroundSize = objectFit;
        display.style.backgroundPosition = objectPosition;
      }
      display.setAttribute('aria-label', `${label} ${index + 1} из ${images.length}`);
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
  });
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
const successModal = document.querySelector('#success-modal');
const successModalCloseButton = successModal ? successModal.querySelector('.success-modal__btn') : null;
let previousFocus = null;

const closeSuccessModal = () => {
  if (!successModal) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  successModal.classList.remove('is-open');
  document.body.style.overflow = '';

  const hideDelay = prefersReduced ? 0 : 280;
  window.setTimeout(() => {
    successModal.hidden = true;
    successModal.setAttribute('aria-hidden', 'true');
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }, hideDelay);
};

const openSuccessModal = () => {
  if (!successModal || !successModalCloseButton) return;

  previousFocus = document.activeElement;
  successModal.hidden = false;
  successModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  window.requestAnimationFrame(() => {
    successModal.classList.add('is-open');
  });

  successModalCloseButton.focus();
};

if (successModal) {
  successModal.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.matches('[data-close-modal]')) {
      closeSuccessModal();
    }
  });

  successModal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSuccessModal();
      return;
    }

    if (event.key !== 'Tab' || !successModalCloseButton) return;

    event.preventDefault();
    successModalCloseButton.focus();
  });
}

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
        status.textContent = '';
      }
      openSuccessModal();
    } catch (error) {
      if (status) {
        status.textContent = 'Не удалось отправить форму. Попробуйте позже.';
      }
    }
  });
}


