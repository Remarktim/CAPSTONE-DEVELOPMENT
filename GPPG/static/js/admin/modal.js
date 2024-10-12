function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.remove('flex');
      location.reload();

    } else {
      console.error('Modal not found');
    }

  }

// reloads page after submission in modal
document.body.addEventListener('closeAndRefresh', function() {
    const modal = document.getElementById('modaldialog');
    if (!modal) {
        console.error('Modal not found in the DOM');
        return;
    }
    console.log('Modal found');
    modal.style.display = 'none';
    window.location.reload();
});


function showTitle(text) {
  document.getElementById('title').innerText = text;
}
