form.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch('https://script.google.com/macros/s/AKfycbwVci456ki8RRcxPWntF3FByvc6DLW5xC82F-EhfSzsxuqZ5VRNqUJwa5ddUstwlcFMxg/execТВОЙ_НОВЫЙ_APPS_SCRIPT_URL', {
    method: 'POST',
    body: formData
  })
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .catch(() => {
      alert('Ошибка отправки');
    });
});
