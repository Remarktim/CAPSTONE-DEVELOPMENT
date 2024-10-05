// DELETE MODAL
function closeDeleteModal() {
    $('#delete_modal').addClass('hidden'); 
}

function openDeleteModal(element) {
  const incidentId = element.getAttribute('data-incident-id');
  const incidentName = element.getAttribute('data-incident-name');  

  console.log("Opening delete modal for incident ID:", incidentId);
  console.log("Incident Name:", incidentName);

  if (!incidentId) {
      console.error("No incident ID provided");
      alert("Error: Could not determine which incident to delete");
      return;
  }

  $('#incidentId').val(incidentId);
  $('#modal_content_message').text(`Are you sure you want to delete the incident: "${incidentName}"?`);

 
  const deleteUrl = `/admin_database/${incidentId}/delete/`;
  console.log("Delete URL will be:", deleteUrl);
  $('#deleteIncidentForm').attr('action', deleteUrl);  

  // Show the delete modal
  $('#delete_modal').removeClass('hidden');
}

function submitDeleteForm() {
    const incidentId = $('#incidentId').val(); 
    console.log("Submitting delete form for incident ID:", incidentId);
    
    if (!incidentId) {
        console.error("No incident ID found in form");
        alert("Error: No incident ID found");
        return;
    }
    const deleteUrl = `/admin_database/${incidentId}/delete/`; 

    $.ajax({
        url: deleteUrl,
        method: 'POST',
        data: {
            'csrfmiddlewaretoken': $('[name=csrfmiddlewaretoken]').val(), 
        },
        success: function(response) {
            console.log("Delete response received:", response);
            if (response.success) {
                closeDeleteModal(); 
                location.reload(); 
            } else {
                console.error("Delete failed:", response);
                alert("Deletion failed: " + (response.error || "Unknown error"));
            }
        },
        error: function(xhr, status, error) {
            console.error("Delete request failed:", {
                status: status,
                error: error,
                response: xhr.responseText
            });
            alert("Error deleting the incident. Check console for details.");
        }
    });
}

//EDIT MODAL

function openEditModal(element) {
    const incidentId = element.getAttribute('data-incident-id');

    console.log("Opening modal for incident:", incidentId); // Debug log

    if (!incidentId) {
        console.error("No incident ID provided");
        alert("Error: Could not determine which incident to edit");
        return;
    }

    const url = `/admin_database/${incidentId}/`; // Adjust this to your URL pattern

    // Show the modal first
    $('#edit_modal').removeClass('hidden').addClass('flex');

    // Fetch the form content
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function(response) {
            console.log("Received response:", response); // Debug log
            
            // Inject the form HTML into the modal body
            $('#modal_content_message').html(response.html); // Assuming your response contains the HTML
        },
        error: function(xhr, errmsg, err) {
            console.error('Error:', errmsg);
            console.error('XHR:', xhr.responseText); // More detailed error
        }
    });
}


// Close the modal function
function closeEditModal() {
    $('#edit_modal').removeClass('flex').addClass('hidden');
}




// function openEditModal() {
//     const modal = document.getElementById('edit_modal');
//     modal.classList.remove('hidden');
//     modal.classList.add('flex');
// }

// function closeEditModal() {
//     const modal = document.getElementById('edit_modal');
//     modal.classList.add('hidden');
//     modal.classList.remove('flex');
// }

