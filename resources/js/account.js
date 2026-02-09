// Account settings JavaScript
import Swal from 'sweetalert2';

// Function to show success alert
function showSuccessAlert(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message,
        confirmButtonColor: '#10B981',
        background: '#F0FDF4',
        color: '#065F46',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
    });
}

// Function to show error alert
function showErrorAlert(errors) {
    const errorText = errors.join('\n');
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorText,
        confirmButtonColor: '#EF4444',
        background: '#FEF2F2',
        color: '#991B1B'
    });
}

// Check for success message
if (window.successMessage) {
    showSuccessAlert(window.successMessage);
}

// Check for error messages
if (window.errorMessages && window.errorMessages.length > 0) {
    showErrorAlert(window.errorMessages);
}
