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

  // Load selected statuses from localStorage and set checkboxes
  const savedStatuses = JSON.parse(localStorage.getItem('selectedStatuses')) || [];
  statusCheckboxes.forEach(checkbox => {
      if (savedStatuses.includes(checkbox.value)) {
          checkbox.checked = true; // Check the checkbox if it's in localStorage
      }
  });

  // Open dropdown if any checkbox is checked
  if (savedStatuses.length > 0) {
      dropdownMenu.classList.remove('hidden');
  }

  dropdownButton.addEventListener('click', function(event) {
      dropdownMenu.classList.toggle('hidden');
  });

  statusCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateFilters);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
      if (!dropdownMenu.contains(event.target) && event.target !== dropdownButton) {
          dropdownMenu.classList.add('hidden');
      }
  });

  function updateFilters() {
      const selectedStatuses = Array.from(statusCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);

      // Save selected statuses to localStorage
      localStorage.setItem('selectedStatuses', JSON.stringify(selectedStatuses));

      // Fetch the updated incidents based on selected filters
      fetchIncidents(selectedStatuses);
  }

  function fetchIncidents(selectedStatuses) {
      const url = new URL(window.location);
      url.searchParams.delete('status');

      if (selectedStatuses.length > 0) {
          selectedStatuses.forEach(status => {
              url.searchParams.append('status', status);
          });
      }

      fetch(url.toString())
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.text(); // Get the response as text
          })
          .then(data => {
              // Update the table body with the new content
              const parser = new DOMParser();
              const doc = parser.parseFromString(data, 'text/html');
              const newTableBody = doc.querySelector('#table-body'); // Get the new table body from the response
              const currentTableBody = document.getElementById('table-body');
              currentTableBody.innerHTML = newTableBody.innerHTML; // Replace the current table body content
          })
          .catch(error => {
              console.error('Error fetching incidents:', error);
          });
  }
});

