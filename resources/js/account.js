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

// Real-time password validation
function validatePasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 1;
        feedback.push({ text: 'At least 8 characters', valid: true });
    } else {
        feedback.push({ text: 'At least 8 characters', valid: false });
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 1;
        feedback.push({ text: 'One uppercase letter', valid: true });
    } else {
        feedback.push({ text: 'One uppercase letter', valid: false });
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        strength += 1;
        feedback.push({ text: 'One lowercase letter', valid: true });
    } else {
        feedback.push({ text: 'One lowercase letter', valid: false });
    }

    // Number check
    if (/\d/.test(password)) {
        strength += 1;
        feedback.push({ text: 'One number', valid: true });
    } else {
        feedback.push({ text: 'One number', valid: false });
    }

    return { strength, feedback };
}

function updatePasswordValidation(inputId, feedbackId) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    const password = input.value;

    if (password.length === 0) {
        feedback.style.display = 'none';
        return;
    }

    const validation = validatePasswordStrength(password);
    const feedbackList = validation.feedback.map(item =>
        `<li class="${item.valid ? 'text-green-600' : 'text-red-600'}">${item.valid ? '✓' : '✗'} ${item.text}</li>`
    ).join('');

    let strengthText = '';
    let strengthClass = '';

    if (validation.strength <= 2) {
        strengthText = 'Weak';
        strengthClass = 'text-red-600 bg-red-100';
    } else if (validation.strength <= 3) {
        strengthText = 'Medium';
        strengthClass = 'text-yellow-600 bg-yellow-100';
    } else {
        strengthText = 'Strong';
        strengthClass = 'text-green-600 bg-green-100';
    }

    feedback.innerHTML = `
        <div class="mt-2 p-3 bg-gray-50 rounded-md border">
            <div class="text-sm font-medium mb-2">Password Strength: <span class="px-2 py-1 rounded text-xs font-semibold ${strengthClass}">${strengthText}</span></div>
            <ul class="text-sm space-y-1">
                ${feedbackList}
            </ul>
        </div>
    `;
    feedback.style.display = 'block';
}

function validatePasswordConfirmation() {
    const password = document.getElementById('password').value;
    const confirmation = document.getElementById('password_confirmation').value;
    const feedback = document.getElementById('confirmation-feedback');

    if (confirmation.length === 0) {
        feedback.style.display = 'none';
        return;
    }

    if (password === confirmation) {
        feedback.innerHTML = '<div class="mt-2 text-sm text-green-600">✓ Passwords match</div>';
        feedback.style.display = 'block';
    } else {
        feedback.innerHTML = '<div class="mt-2 text-sm text-red-600">✗ Passwords do not match</div>';
        feedback.style.display = 'block';
    }
}

// Initialize real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmationInput = document.getElementById('password_confirmation');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordValidation('password', 'password-feedback');
            validatePasswordConfirmation();
        });
    }

    if (confirmationInput) {
        confirmationInput.addEventListener('input', validatePasswordConfirmation);
    }
});
