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
    
    document.getElementById('incidentadd').close();
    
    window.location.reload();
});