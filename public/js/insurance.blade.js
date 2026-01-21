$(document).ready(function() {
        $('#insuranceTable').DataTable({
            processing: true,
            serverSide: true,
            scrollX: true,
            ajax: {
                url: insuranceDataUrl, // Use the global variable
                type: 'GET',
                error: function(xhr, error, thrown) {
                    console.error('DataTables AJAX error:', xhr.responseText || error, thrown);
                    Swal.fire({
                        icon: 'error',
                        title: 'Data Load Failed',
                        text: 'Unable to load insurance data. Please check the server logs for more details.',
                    });
                }
            }, 
            columns: [
                { data: 'id', name: 'id' },
                { data: 'client_name', name: 'client_name', defaultContent: 'N/A' }, 
                { data: 'policy_name', name: 'policy_name', defaultContent: 'N/A' }, 
                { data: 'code', name: 'code' },
                { data: 'registration_no', name: 'registration_no' },
                { data: 'chassis_no', name: 'chassis_no' },
                { data: 'engine_no', name: 'engine_no' },
                { data: 'vehicle_model', name: 'vehicle_model' },
                { data: 'vehicle_color', name: 'vehicle_color' },
                { data: 'registration_date', name: 'registration_date' },
                { data: 'expiration_date', name: 'expiration_date' },
                { data: 'cost', name: 'cost' },
                { data: 'new', name: 'new' },
                { data: 'make', name: 'make' },
                { data: 'or_no', name: 'or_no' },
                { data: 'coc_no', name: 'coc_no' },
                { data: 'policy_no', name: 'policy_no' },
                { data: 'mvfile_no', name: 'mvfile_no' },
                { data: 'auth_no', name: 'auth_no' },
                { data: 'auth_renewal', name: 'auth_renewal' },
                { data: 'status', name: 'status' },
                { data: 'remarks', name: 'remarks' }
            ],
            language: {
                emptyTable: "No data available in table",
                infoFiltered: "(filtered from total entries)"
            }
        });

        $('#loadInsuranceDataBtn').on('click', function() {
            $('#insuranceTable').DataTable().ajax.reload();
        });

        $('#addInsuranceBtn').on('click', function() {
            Swal.fire({
                title: '<h2 class="swal2-title-design">Enter COC Number</h2>',
                html: `
                    <div class="coc-input-container">
                        <div class="input-guide">Enter 8-digit COC Number</div>
                        <div class="coc-input-wrapper">
                            <input type="text" id="coc-input" class="swal2-input-design" placeholder="12345678" autocapitalize="off" autocorrect="off" maxlength="8">
                            <div class="status-indicator" id="coc-status-indicator"></div>
                        </div>
                        <div class="status-message" id="coc-status-message"></div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '<span class="swal2-confirm-btn">Next</span>',
                cancelButtonText: '<span class="swal2-cancel-btn">Cancel</span>',
                customClass: {
                    popup: 'swal2-popup-design',
                    confirmButton: 'swal2-confirm-btn',
                    cancelButton: 'swal2-cancel-btn'
                },
                buttonsStyling: false,
                didOpen: () => {
                    const cocInput = document.getElementById('coc-input');
                    cocInput.addEventListener('input', function () {
                        const cocNumber = cocInput.value;
                        if (cocNumber.length === 8) {
                            $.ajax({
                                url: insuranceValidateCocUrl,
                                type: 'POST',
                                data: { coc_no: cocNumber },
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                success: function(response) {
                                    const statusIndicator = document.getElementById('coc-status-indicator');
                                    const statusMessage = document.getElementById('coc-status-message');
                                    if (response.valid) {
                                        statusIndicator.style.backgroundColor = 'green';
                                        statusMessage.textContent = response.message;
                                        statusMessage.style.color = 'green';
                                    } else {
                                        statusIndicator.style.backgroundColor = 'red';
                                        statusMessage.textContent = response.message;
                                        statusMessage.style.color = 'red';
                                    }
                                },
                                error: function(xhr, error, thrown) {
                                    console.error('Validation error:', xhr.responseText || error, thrown);
                                    const statusMessage = document.getElementById('coc-status-message');
                                    statusMessage.textContent = 'Error validating COC Number.';
                                    statusMessage.style.color = 'red';
                                }
                            });
                        } else {
                            const statusIndicator = document.getElementById('coc-status-indicator');
                            const statusMessage = document.getElementById('coc-status-message');
                            statusIndicator.style.backgroundColor = '';
                            statusMessage.textContent = '';
                        }
                    });
                },
                willClose: () => {
                    document.body.style.overflow = ''; 
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const cocNumber = document.getElementById('coc-input').value;
                    const statusMessage = document.getElementById('coc-status-message').textContent;
                    if (statusMessage.includes('available')) {
                        Swal.fire({
                            title: '<h2 class="swal2-title-design">Enter MV File Number</h2>',
                            html: `
                                <div class="mvfile-input-container">
                                    <div class="input-guide">Enter MV File Number</div>
                                    <div class="mvfile-input-wrapper">
                                        <input type="text" id="mvfile-input" class="swal2-input-design" placeholder="MV123456" autocapitalize="off" autocorrect="off">
                                    </div>
                                    <div id="mvfile-record-container" style="margin-top: 10px;"></div>
                                </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: '<span class="swal2-confirm-btn">Submit</span>',
                            cancelButtonText: '<span class="swal2-cancel-btn">Cancel</span>',
                            customClass: {
                                popup: 'swal2-popup-design',
                                confirmButton: 'swal2-confirm-btn',
                                cancelButton: 'swal2-cancel-btn'
                            },
                            buttonsStyling: false,
                            didOpen: () => {
                                const mvFileInput = document.getElementById('mvfile-input');
                                const recordContainer = document.getElementById('mvfile-record-container');

                                mvFileInput.addEventListener('input', function () {
                                    const mvFileNumber = mvFileInput.value;
                                    const submitButton = document.querySelector('.swal2-confirm-btn');
                                    if (mvFileNumber.length >= 15) {
                                        $.ajax({
                                            url: insuranceValidateMvFileUrl, // Use the global variable
                                            type: 'POST',
                                            data: { mvfile_no: mvFileNumber },
                                            headers: {
                                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                            },
                                            success: function(response) {
                                                const recordContainer = document.getElementById('mvfile-record-container');
                                                if (response.exists) {
                                                    const record = response.record;
                                                    recordContainer.innerHTML = `
                                                        <div class="record-details-container" style="display: flex; flex-wrap: wrap; gap: 20px;">
                                                            <div style="flex: 1; min-width: 45%;">
                                                                <h4>Insurance Details</h4>
                                                                <div class="record-row">
                                                                    <span class="record-label">ID:</span>
                                                                    <span class="record-value">${record.insurance_id}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Policy Name:</span>
                                                                    <span class="record-value">${record.policy_name}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Code:</span>
                                                                    <span class="record-value">${record.insurance_code}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Registration No:</span>
                                                                    <span class="record-value">${record.registration_no}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Vehicle Model:</span>
                                                                    <span class="record-value">${record.vehicle_model}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Vehicle Color:</span>
                                                                    <span class="record-value">${record.vehicle_color}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Registration Date:</span>
                                                                    <span class="record-value">${record.registration_date}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Expiration Date:</span>
                                                                    <span class="record-value">${record.expiration_date}</span>
                                                                </div>
                                                            </div>
                                                            <div style="flex: 1; min-width: 45%;">
                                                                <h4>Client Details</h4>
                                                                <div class="record-row">
                                                                    <span class="record-label">Client Name:</span>
                                                                    <span class="record-value">${record.firstname} ${record.middlename} ${record.lastname}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Contact:</span>
                                                                    <span class="record-value">${record.contact}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Email:</span>
                                                                    <span class="record-value">${record.email}</span>
                                                                </div>
                                                                <div class="record-row">
                                                                    <span class="record-label">Address:</span>
                                                                    <span class="record-value">${record.address}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `;
                                                    recordContainer.style.display = 'block';
                                                    recordContainer.style.color = 'green';
                                                    submitButton.innerHTML = '<span class="swal2-confirm-btn">Bind</span>';
                                                    submitButton.onclick = function () {
                                                        const identifier = "true";
                                                        const url = `insurances/manage_insurance?id=${record.insurance_id}&identifier=${identifier}`;
                                                        Swal.close(); // Close the Swal container
                                                        uni_modal("Manage Insurance Details", url, 'mid-large');
                                                    };
                                                } else {
                                                    recordContainer.innerHTML = `<p>${response.message}</p>`;
                                                    recordContainer.style.color = 'red';
                                                    recordContainer.style.display = 'block';
                                                    submitButton.innerHTML = '<span class="swal2-confirm-btn">Create New Record</span>';
                                                }
                                            },
                                            error: function(xhr, error, thrown) {
                                                const recordContainer = document.getElementById('mvfile-record-container');
                                                console.error('Validation error:', xhr.responseText || error, thrown);
                                                recordContainer.innerHTML = `<p>Error validating MV File Number.</p>`;
                                                recordContainer.style.color = 'red';
                                                recordContainer.style.display = 'block';
                                                submitButton.innerHTML = '<span class="swal2-confirm-btn">Create New Record</span>';
                                            }
                                        });
                                    } else {
                                        const recordContainer = document.getElementById('mvfile-record-container');
                                        recordContainer.innerHTML = '';
                                        recordContainer.style.display = 'none';
                                        submitButton.innerHTML = '<span class="swal2-confirm-btn">Create New Record</span>';
                                    }
                                });
                            },
                            willClose: () => {
                                document.body.style.overflow = ''; 
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const mvFileNumber = document.getElementById('mvfile-input').value;
                                const recordContainer = document.getElementById('mvfile-record-container').textContent;
                                if (recordContainer.includes('does not exist')) {
                                        const identifier = "false";
                                        const url = `insurances/manage_insurance?id=new&identifier=${identifier}`;
                                        uni_modal("Create New Insurance Record", url, 'mid-large');
                                } else {
                                    console.log("MV File Number exists:", mvFileNumber);
                                    // Add logic to handle the existing record
                                }
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid COC Number',
                            text: 'Please enter a valid COC Number before proceeding.',
                        });
                    }
                }
            });
        });
    });

    // Enhance responsiveness for modals
    function uni_modal(title, url, size = 'mid-large') {
        const modalHtml = `
            <div class="modal fade" id="uni_modal" tabindex="-1" role="dialog" aria-labelledby="uni_modal_label" aria-hidden="true">
                <div class="modal-dialog modal-${size} modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="uni_modal_label">${title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <iframe src="${url}" style="width: 100%; height: 80vh; border: none;"></iframe>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="saveButton">Save</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        if ($('#uni_modal').length > 0) {
            $('#uni_modal').remove();
        }
        
        $('body').append(modalHtml);
        $('#uni_modal').modal('show');

        $('#uni_modal').on('hidden.bs.modal', function() {
            $(this).remove();
        });

        $('#saveButton').on('click', function() {
            const iframe = document.querySelector('#uni_modal iframe');
            if (iframe && iframe.contentWindow) {
                // Trigger save in the iframe
                iframe.contentWindow.postMessage('save', '*');
            }
        });
    }

    function syncFrames() {
        const leftFrame = document.getElementById('leftFrame');
        const rightFrame = document.getElementById('rightFrame');

        if (leftFrame && rightFrame) {
            leftFrame.onload = function() {
                leftFrame.contentWindow.addEventListener('scroll', function() {
                    rightFrame.contentWindow.scrollTo(
                        leftFrame.contentWindow.scrollX,
                        leftFrame.contentWindow.scrollY
                    );
                });
            };

            rightFrame.onload = function() {
                rightFrame.contentWindow.addEventListener('scroll', function() {
                    leftFrame.contentWindow.scrollTo(
                        rightFrame.contentWindow.scrollX,
                        rightFrame.contentWindow.scrollY
                    );
                });
            };
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .modal-body .row {
            display: flex;
            flex-wrap: nowrap;
            margin: 0;
            height: 100%;
        }
        .modal-body .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%;
        }
        @media (max-width: 768px) {
            .modal-body .row {
                flex-direction: column;
            }
            .modal-body .col-md-6 {
                flex: 0 0 100%;
                max-width: 100%;
                border-right: none !important;
                border-bottom: 1px solid #dee2e6;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @media (max-width: 768px) {
            .swal2-popup-design {
                width: 90% !important;
                font-size: 0.9em !important;
            }
            .swal2-title-design {
                font-size: 1.2em !important;
            }
            .swal2-confirm-btn, .swal2-cancel-btn {
                padding: 8px 16px !important;
                font-size: 0.9em !important;
            }
        }

        @media (max-width: 576px) {
            .modal-dialog {
                width: 100% !important;
                margin: 0 !important;
            }
            .modal-content {
                height: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
