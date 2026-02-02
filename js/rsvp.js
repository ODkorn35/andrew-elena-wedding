Используем твой Apps Script endpoint:
const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTuxljwkoxLXWh27ZGUrW9h-edsyCu5QrjIseAUNFs9n2NsEfIZNXVVNEHj35PDzCTvw/exec';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  status.textContent = 'Отправка...';

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: new FormData(form),
  })
    .then(() => {
      status.textContent = 'Спасибо! Ваш ответ получен 💛';
      form.reset();
    })
    .catch(() => {
      status.textContent = 'Ошибка отправки. Попробуйте позже.';
    });
});

