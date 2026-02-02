const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTuxljwkoxLXWh27ZGUrW9h-edsyCu5QrjIseAUNFs9n2NsEfIZNXVVNEHj35PDzCTvw/exec';

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = 'Отправка...';

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: new FormData(form)
  })
    .then(() => {
      status.textContent = 'Спасибо! Ответ получен.';
      form.reset();
    })
    .catch(() => {
      status.textContent = 'Ошибка. Попробуйте позже.';
    });
});

const targetDate = new Date('2026-06-26T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) return;

  document.getElementById('days').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById('hours').textContent = Math.floor(diff / (1000 * 60 * 60) % 24);
  document.getElementById('minutes').textContent = Math.floor(diff / (1000 * 60) % 60);
  document.getElementById('seconds').textContent = Math.floor(diff / 1000 % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);
