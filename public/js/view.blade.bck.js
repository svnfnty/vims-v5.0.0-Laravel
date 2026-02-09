// Get elements for image click and profile modal
const img = document.getElementById('img-thumb-path');
const overlayText = document.getElementById('view-profile-text');

// Function to open the full-screen image view when the image or "View Profile" is clicked
function openProfile() {
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
function checkPolicyStatus(status, policyStatus, policyDateRelease, cocNo, button) {
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
function verifyDataAndOpenWindow() {
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
function selectReceipt() {
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
function selectCertificateOfCoverage() {
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
function selectPolicyofCover() {
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

// Event listener for image click
img.addEventListener('click', openProfile);

// Event listener for the "View Profile" text click
overlayText.addEventListener('click', openProfile);

// Edit button functionality - only show if user has permissions > 0
if (window.userPermissions > 0) {
    document.getElementById('edit_data').addEventListener('click', function() {
        openEditModal();
    });
} else {
    // Hide edit button if no permission
    const editBtn = document.getElementById('edit_data');
    if (editBtn) editBtn.style.display = 'none';
}

// Delete button functionality - only show if user has permissions === 1
if (window.userPermissions === 1) {
    document.getElementById('delete_data').addEventListener('click', function() {
        deleteInsurance();
    });
} else {
    // Hide delete button if no permission
    const deleteBtn = document.getElementById('delete_data');
    if (deleteBtn) deleteBtn.style.display = 'none';
}

// Function to open edit modal
function openEditModal() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        // Initialize Select2 after modal is shown
        setTimeout(() => {
            $('.js-example-basic-single').select2({
                width: '100%',
                dropdownParent: $('#manageInsuranceModal')
            });
        }, 100);
    }
}

// Function to close modal
function closeInsuranceModal() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// Function to delete insurance
function deleteInsurance() {
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
            fetch(insuranceDestroyUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire(
                        'Deleted!',
                        'Insurance record has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.href = '{{ route("insurances.index") }}';
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
                Swal.fire(
                    'Error!',
                    'An error occurred while deleting the record.',
                    'error'
                );
            });
        }
    });
}

// Handle button click for edit
$(document).ready(function() {
    document.getElementById('insuranceSubmitBtn').addEventListener('click', function(e) {
        e.preventDefault();

        // Close the modal
        closeInsuranceModal();

        const submitBtn = document.getElementById('insuranceSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

        const formData = new FormData(document.getElementById('insuranceForm'));
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

        fetch(insuranceUpdateUrl, {
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
});
