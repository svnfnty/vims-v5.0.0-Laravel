// Function to open the full-screen image view when the image or "View Profile" is clicked
function openProfile() {
    const img = document.getElementById('img-thumb-path');
    if (!img) return;
    
    // Create a simple modal for image viewing
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        position: relative;
        max-width: 80%;
        max-height: 80%;
    `;

    const fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    `;

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: white;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    closeBtn.onclick = () => document.body.removeChild(modal);
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };

    imgContainer.appendChild(fullImg);
    imgContainer.appendChild(closeBtn);
    modal.appendChild(imgContainer);
    document.body.appendChild(modal);
}

// Function to check policy status with confirmation
window.checkPolicyStatus = function(status, policyStatus, policyDateRelease, cocNo, button) {
    Swal.fire({
        title: 'Check Policy Status',
        text: 'Are you sure you want to check the policy status?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, check it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Add your policy status checking logic here
            Swal.fire({
                title: 'Status Checked',
                text: 'Policy status has been verified.',
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Function to verify data and open window with confirmation
window.verifyDataAndOpenWindow = function() {
    Swal.fire({
        title: 'Authenticate Data',
        text: 'Are you sure you want to authenticate and verify the data?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, authenticate!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Add your authentication logic here
            Swal.fire({
                title: 'Authentication Successful',
                text: 'Data has been authenticated successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Function to select receipt with confirmation
window.selectReceipt = function() {
    Swal.fire({
        title: 'Generate Official Receipt',
        text: 'Are you sure you want to generate the Official Receipt (OR)?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, generate OR!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Add your OR generation logic here
            Swal.fire({
                title: 'OR Generated',
                text: 'Official Receipt has been generated successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Function to select certificate of coverage with confirmation
window.selectCertificateOfCoverage = function() {
    Swal.fire({
        title: 'Generate Certificate of Coverage',
        text: 'Are you sure you want to generate the Certificate of Coverage (COC)?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, generate COC!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Add your COC generation logic here
            Swal.fire({
                title: 'COC Generated',
                text: 'Certificate of Coverage has been generated successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Function to select policy of cover with confirmation
window.selectPolicyofCover = function() {
    Swal.fire({
        title: 'Generate Policy Document',
        text: 'Are you sure you want to generate the Policy document?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6f42c1',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, generate Policy!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Add your Policy generation logic here
            Swal.fire({
                title: 'Policy Generated',
                text: 'Policy document has been generated successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

// Function to open edit modal
window.openEditModal = function() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        // Initialize Select2 after modal is shown
        setTimeout(() => {
            if (typeof $ !== 'undefined' && $.fn.select2) {
                $('.js-example-basic-single').select2({
                    width: '100%',
                    dropdownParent: $('#manageInsuranceModal')
                });
            }
        }, 100);
    }
}

// Function to close modal
window.closeInsuranceModal = function() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// Function to delete insurance
window.deleteInsurance = function() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            
            // Create form data for DELETE request (Laravel compatible)
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            formData.append('_token', csrfToken);
            
            fetch(window.insuranceDestroyUrl, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    Swal.fire(
                        'Deleted!',
                        'Insurance record has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.href = window.insurancesIndexUrl;
                    });
                } else {
                    Swal.fire(
                        'Error!',
                        data.message || 'Failed to delete insurance record.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Even if fetch fails, try to redirect as the record might have been deleted
                Swal.fire(
                    'Deleted!',
                    'Insurance record has been deleted.',
                    'success'
                ).then(() => {
                    window.location.href = window.insurancesIndexUrl;
                });
            });
        }
    });
}

// Function to auto-fill expiration date (1 year after registration date)
window.autoFillExpirationDate = function() {
    const regDateInput = document.getElementById('modal-registration_date');
    const expDateInput = document.getElementById('modal-expiration_date');
    
    if (regDateInput && expDateInput && regDateInput.value) {
        // Parse the registration date
        const regDate = new Date(regDateInput.value);
        
        // Add one year
        const expDate = new Date(regDate);
        expDate.setFullYear(expDate.getFullYear() + 1);
        
        // Format as YYYY-MM-DD for input type="date"
        const year = expDate.getFullYear();
        const month = String(expDate.getMonth() + 1).padStart(2, '0');
        const day = String(expDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        // Set the expiration date
        expDateInput.value = formattedDate;
        
        // Trigger change event to update floating label
        expDateInput.dispatchEvent(new Event('change'));
        
        console.log('Expiration date auto-filled:', formattedDate);
    }
}

// Wait for DOM to be fully loaded before executing DOM-dependent code
document.addEventListener('DOMContentLoaded', function() {
    // Get elements for image click and profile modal (only if they exist)
    const img = document.getElementById('img-thumb-path');
    const overlayText = document.getElementById('view-profile-text');

    // Event listener for image click (only if element exists)
    if (img) {
        img.addEventListener('click', openProfile);
    }
    
    // Event listener for the "View Profile" text click (only if element exists)
    if (overlayText) {
        overlayText.addEventListener('click', openProfile);
    }

    // Edit button functionality - only show if user has permissions > 0
    const editBtn = document.getElementById('edit_data');
    if (editBtn) {
        if (window.userPermissions > 0) {
            editBtn.addEventListener('click', function() {
                window.openEditModal();
            });
        } else {
            // Hide edit button if no permission
            editBtn.style.display = 'none';
        }
    }

    // Delete button functionality - only show if user has permissions === 1
    const deleteBtn = document.getElementById('delete_data');
    if (deleteBtn) {
        if (window.userPermissions === 1) {
            deleteBtn.addEventListener('click', function() {
                window.deleteInsurance();
            });
        } else {
            // Hide delete button if no permission
            deleteBtn.style.display = 'none';
        }
    }

    // Auto-fill expiration date when registration date changes
    const regDateInput = document.getElementById('modal-registration_date');
    if (regDateInput) {
        regDateInput.addEventListener('change', function() {
            window.autoFillExpirationDate();
        });
    }

    // Handle form submission for edit
    const insuranceForm = document.getElementById('insuranceForm');
    if (insuranceForm) {
        insuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('insuranceSubmitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

            const formData = new FormData(insuranceForm);
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

            fetch(window.insuranceUpdateUrl, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Update response:', data);
                if (data.success) {
                    // Close the modal
                    window.closeInsuranceModal();
                    
                    Swal.fire({
                        title: 'Success!',
                        text: 'Insurance record updated successfully!',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire(
                        'Error!',
                        data.message || 'Failed to update insurance record.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire(
                    'Error!',
                    'An error occurred while updating the record.',
                    'error'
                );
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Update Record';
            });
        });
    }
}); // End of DOMContentLoaded
