// System Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Handle success message
    if (window.successMessage) {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: window.successMessage,
            confirmButtonColor: '#007bff',
            timer: 3000,
            timerProgressBar: true
        });
    }

    // Handle error messages
    if (window.errorMessages && window.errorMessages.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: window.errorMessages.join('<br>'),
            confirmButtonColor: '#dc3545'
        });
    }
});

// Image preview functions
function displayImg(input, _this) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#cimg').attr('src', e.target.result);
            _this.siblings('.custom-file-label').html(input.files[0].name);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function displayImg2(input, _this) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#cimg2').attr('src', e.target.result);
            _this.siblings('.custom-file-label').html(input.files[0].name);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
