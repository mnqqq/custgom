document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#channel-request-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const telegram = form.telegram.value.trim();
      const description = form.description.value.trim();

      if (!name || !telegram || !description) {
        alert('Please fill in all fields.');
        return;
      }

      try {
        await window.firebaseDB.collection('channelRequests').add({
          name,
          telegram,
          description,
          createdAt: new Date()
        });

        alert('Your request has been successfully submitted!');
        form.reset();
      } catch (err) {
        console.error('Error:', err);
        alert('Failed to submit the request. Please try again later.');
      }
    });
  }
});
