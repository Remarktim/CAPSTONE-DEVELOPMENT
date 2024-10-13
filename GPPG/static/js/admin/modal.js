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


document.addEventListener('DOMContentLoaded', function() {
  const dropdownButton = document.getElementById('dropdownCheckboxButton');
  const dropdownMenu = document.getElementById('dropdownDefaultCheckbox');
  const statusCheckboxes = document.querySelectorAll('#dropdownDefaultCheckbox input[type="checkbox"]');
  
  // Toggle dropdown on button click
  dropdownButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent the click from bubbling up
      dropdownMenu.classList.toggle('hidden'); // Toggle visibility of the dropdown
  });

  // Prevent dropdown from closing when clicking inside it
  dropdownMenu.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent the click from closing the dropdown
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
      dropdownMenu.classList.add('hidden'); // Close the dropdown
  });

  // Update table based on selected checkboxes
  statusCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function(event) {
          event.stopPropagation();  // Prevent click propagation
          updateFilters();
      });
  });

  function updateFilters() {
      const selectedStatuses = Array.from(statusCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);

      const url = new URL(window.location); // Get the current URL
      url.searchParams.delete('status');    // Clear any previous status filters

      // Append selected statuses to the query parameters
      if (selectedStatuses.length > 0) {
          selectedStatuses.forEach(status => {
              url.searchParams.append('status', status);
          });
      }

      // Use HTMX to update the table dynamically without reloading the page
      htmx.ajax('GET', url.toString(), { 
          target: '#table-body',  // Adjust based on your table's ID
          swap: 'innerHTML'
      });
  }
});


