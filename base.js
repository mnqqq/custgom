document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#channel-request-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const telegram = form.telegram.value.trim();
      const description = form.description.value.trim();

      if (!name || !telegram || !description) {
        alert('Будь ласка, заповніть усі поля.');
        return;
      }

      try {
        await window.firebaseDB.collection('channelRequests').add({
          name,
          telegram,
          description,
          createdAt: new Date()
        });

        alert('Ваш запит успішно надіслано!');
        form.reset();
      } catch (err) {
        console.error('Помилка:', err);
        alert('Не вдалося надіслати запит. Спробуйте пізніше.');
      }
    });
  }
});
