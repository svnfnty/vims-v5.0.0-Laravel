
window.selectCertificateOfCoverage = function() {
//if (typeof isLocked !== 'undefined' && isLocked) {
//    showLockedAlert();
//    return;
//}

    showDocumentSelection({
        title: 'Certificate of Coverage',
        documentType: 'Certificate',
        optionsList: [
            { value: 'One', label: 'Liberty Insurance Corporation' },
            { value: 'Two', label: 'Pacific Union Insurance Corporation' },
            { value: 'Three', label: 'Milestone Insurance Corporation' },
            {
                value: 'Four',
                label: 'Stronghold Insurance Company'},
            {
                value: 'Five',
                label: 'Western Guaranty Corporation', isNew: true}
        ]
    });
}

// 🖨️ Standard Document Selection UI (reusable function)
function showDocumentSelection(options) {
    const {
        title,
        documentType,
        optionsList,
        cost = 0,
        markup = ''
    } = options;

    // 💰 Price Check
    if (cost === 0 && documentType !== 'Certificate') {
        Swal.fire({
            icon: 'error',
            title: '<span style="font-weight:600">Pricing Unavailable</span>',
            html: `
                <div style="text-align:center; max-width:400px; margin:0 auto;">
                    <div style="width:80px; height:80px; margin:0 auto 20px; background:#f8f9fa; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                        </svg>
                    </div>
                    <p style="color:#495057; margin-bottom:15px;">The system cannot retrieve pricing information for this document.</p>
                    <div style="background:#f8f9fa; padding:10px; border-radius:6px;">
                        <p style="font-size:0.9rem; color:#868e96; margin:0;">Verify the insurance details and try again</p>
                    </div>
                </div>
            `,
            confirmButtonText: 'OK',
            confirmButtonColor: '#6c757d'
        });
        return;
    }

    // 🖨️ Premium Document Selection UI
    Swal.fire({
        title: `<div style="font-size:1.5rem; font-weight:600; color:#212529;">Select ${title}</div>`,
        html: `
            <div style="max-width:500px; margin:0 auto;">
                <div style="background:#f8f9fa; border-radius:12px; padding:20px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <img src="https://i.gifer.com/ISSh.gif" alt="Printer Loading" style="width:60px; height:60px; margin-right:15px; border-radius:6px;">
                        <div>
                            <p style="font-weight:500; margin-bottom:5px; color:#212529;">Printer Preparation</p>
                            <p style="font-size:0.9rem; color:#868e96; margin:0;">Load official document paper into the printer</p>
                        </div>
                    </div>
                    ${cost > 0 ? `
                    <div style="
                        background: linear-gradient(to right, ${markup ? getColorClass(markup) : '#2575fc'}, #2575fc);
                        border-radius: 10px;
                        padding: 20px;
                        color: white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    ">
                        <p style="font-size: 0.9rem; opacity: 0.9; margin: 0;">Transaction Amount</p>
                        <p style="font-size: 1.5rem; font-weight: 600; margin: 0;">
                            ${markup ? `<span style="font-size:1rem; opacity:0.85;">${markup} + ₱${cost} </span>` : ''}
                        </p>
                    </div>
                    ` : ''}
                </div>

                <div style="margin-bottom:20px;">
                    <label style="display:block; font-size:0.9rem; color:#495057; margin-bottom:8px; font-weight:500;">Select Template</label>
                    <select id="cusSelectbox" style="width:100%; padding:12px 15px; border:1px solid #e9ecef; border-radius:8px; background-color:#fff; font-size:1rem; color:#495057; transition:all 0.2s; appearance:none; background-image:url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\"); background-repeat:no-repeat; background-position:right 15px center; background-size:15px;">
                        <option value="" selected disabled>Choose a template...</option>
                        ${optionsList.map(opt => {
                            const isNew = opt.isNew ? ' ✨ New Template 50%' : '';
                            return `<option value="${opt.value}">${opt.label}${isNew}</option>`;
                        }).join('')}
                    </select>
                </div>

                <div style="font-size:0.8rem; color:#adb5bd; text-align:center; margin-top:10px;">
                    <svg style="vertical-align:-2px; margin-right:5px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>
                    Select the appropriate template for your ${documentType.toLowerCase()}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<span style="display:flex; align-items:center; justify-content:center;"><svg style="margin-right:8px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Document</span>',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#f8f9fa',
        customClass: {
            confirmButton: 'swal-confirm-button',
            cancelButton: 'swal-cancel-button'
        },
        width: '600px',
        padding: '2rem',
        preConfirm: () => {
            const selectedOption = document.getElementById('cusSelectbox').value;
            if (!selectedOption) {
                Swal.showValidationMessage('Please select a template to proceed');
                return false;
            }

           if (selectedOption === 'Five') {
                        return Swal.fire({
                            title: 'Beta Template Warning',
                            html: `
                                <div style="text-align:center; max-width:400px; margin:0 auto;">
                                    <div style="width:80px; height:80px; margin:0 auto 20px; background:#fff3cd; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12" y2="17"></line>
                                        </svg>
                                    </div>
                                    <p style="color:#495057; margin-bottom:15px;">The <strong>Western Guaranty Corporation</strong> template is currently in <strong>BETA</strong> testing phase.</p>
                                    <div style="background:#fff3cd; padding:12px; border-radius:8px; margin-bottom:15px;">
                                        <p style="font-size:0.9rem; color:#856404; margin:0;">Please be advise that layout still broken, proceed with care.</p>
                                    </div>
                                </div>
                            `,
                            showConfirmButton: false, // Remove "Proceed Anyway" button
                            showCancelButton: true,   // Keep "Go Back" button
                            cancelButtonText: 'Go Back',
                            reverseButtons: true
                        }).then((result) => {
                            return result.dismiss === Swal.DismissReason.cancel ? false : selectedOption;
                        });
                    }

            return selectedOption;
        },
        didOpen: () => {
            const selectBox = document.getElementById('cusSelectbox');
            selectBox.addEventListener('focus', () => {
                selectBox.style.borderColor = '#80bdff';
                selectBox.style.boxShadow = '0 0 0 0.2rem rgba(0, 123, 255, 0.25)';
            });
            selectBox.addEventListener('blur', () => {
                selectBox.style.borderColor = '#e9ecef';
                selectBox.style.boxShadow = 'none';
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showLoadingAnimation();

            // Process after delay
            setTimeout(() => {
                const selectedOption = optionsList.find(opt => opt.value === result.value);
                const printContent = generatePrintContent(result.value, selectedOption.label, documentType);

                // Create hidden iframe with generated content
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(printContent);
                iframeDoc.close();

                iframe.onload = () => {
                    // Trigger print on the iframe content
                    iframe.contentWindow.print();
                    // Remove iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                };

                // Close loading animation
                Swal.close();
            }, 1500);
        }
    });
}

function getColorClass(markup) {
    // This should match the PHP function in view_insurance.php
    // For now, return a default or implement logic
    return '#2575fc'; // Default color
}

// Helper function to generate print content based on selected template
function generatePrintContent(value, label, documentType) {
    const clientName = window.authData?.clientName || "Client Name";
    const clientAddress = window.authData?.clientAddress || "Client Address";
    const plateNo = window.authData?.plateNo || "Plate Number";
    const mvFileNo = window.authData?.mvFileNo || "MV File Number";
    const cost = window.insuranceData?.cost || 0;
    const currentDate = new Date().toLocaleDateString();
    const policyNo = window.insuranceData?.policyNo || "";
    const orNo = window.insuranceData?.orNo || "";
    const cocNo = window.insuranceData?.cocNo || "";
    const vehicleModel = window.insuranceData?.vehicleModel || "";
    const make = window.insuranceData?.make || "";
    const category = window.insuranceData?.category || "";
    const vehicleColor = window.insuranceData?.vehicleColor || "";
    const registrationNo = window.insuranceData?.registrationNo || "";
    const chassisNo = window.insuranceData?.chassisNo || "";
    const engineNo = window.insuranceData?.engineNo || "";
    const registrationDate = window.insuranceData?.registrationDate ? new Date(window.insuranceData.registrationDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "";
    const expirationDate = window.insuranceData?.expirationDate ? new Date(window.insuranceData.expirationDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "";
    const authRenewal = window.insuranceData?.authRenewal || "";
    const code = window.insuranceData?.code || "";

    // Determine colors based on coc_no and policy_no
    const cocColor = (cocNo >= 1 && cocNo <= 500) ? "white" : "inherit";
    const policyColor = (policyNo >= 1 && policyNo <= 200) ? "white" : "inherit";
    const orColor = (orNo >= 1 && orNo <= 200) ? "white" : "inherit";

    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${label} - ${documentType}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; font-size: 25px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .container { font-size: 15px; line-height: 1.5; font-weight: normal; color: #1c1e21; }
                .center { text-align: left !important; }
                .title { height: 18px; background-color: #fdfdfd; border: 2px solid transparent; color: #000000; position: relative; top: -10px; }
                .header, .body { border: 1px solid transparent; }
                .tbl { width: 1200px; }
                table, th, td { border: 3px solid transparent; font-size: 12px; }
                .list { width: 300px; }
                .table { position: relative; top: -20px; margin-bottom: -10px; }
            </style>
        </head>
        <body>
    `;

    switch(value) {
        case 'One':
            content += `
                <div id="showOne" class="content py-3 myDiv" style="font-size:25px;">
                    <div class="card card-outline card-primary rounded-0 shadow" style="font-size:25px;">
                       
                        <div class="card-body" style="font-size:25px;">
                            <div class="container-fluid" id="outprint" style="font-size:25px;">
                                <br><br><br>
                                <div class="row-fluid body" style="font-size:25px;">
                                    <h5 class="title" style="font-size:25px;"><b>
                                        ${authRenewal ? `<h4 style="text-align:right;font-size:25px;">${authRenewal}</h4>` : '<h4 style="text-align:right;font-size:25px; color:#ffffff;">&nbsp;</h4>'}
                                    </b></h5>
                                    <table class="table" style="font-size:25px;">
                                        <tbody>
                                            <tr>
                                                <td class="list" rowspan="2" style="text-align:right; font-size:25px;">
                                                    <h4 style="font-size:25px;"></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align: right; font-size:25px;"></td>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="color:${cocColor};font-size:25px;">046${cocNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" colspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl" rowspan="2" style="text-align:center; font-size:25px;">
                                                    <b style="color: ${policyColor}; font-size:25px;">${policyNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="font-size:25px;"></b>
                                                </td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:25px;"></td>
                                                <td class="tbl" style="text-align:center; font-size:25px;">
                                                    <b style="font-size:23px;">${clientName}</b>
                                                </td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:25px;"></b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="color: ${orColor}; font-size:25px;">${orNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2" style="font-size:25px;"></td>
                                                <td class="tbl center" rowspan="2" style="font-size:23px;"><b style="font-size:23px;">${clientAddress}</b>
                                                </td>
                                                <td class="tbl center" rowspan="2" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl" style="text-align: right; font-size:20px;"><b style="font-size:20px;">${registrationDate}</b></td>
                                                <td class="tbl" style="font-size:25px;"></td>
                                            </tr>
                                            <tr>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="font-size:25px;"></td>
                                                <td style="text-align:right; font-size:25px;">
                                                    <b style="font-size:20px;">${registrationDate}</b>
                                                </td>
                                                <td style="text-align:center; font-size:25px;">
                                                    <b style="font-size:20px;">${expirationDate}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table class="table" style="font-size:25px;">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${vehicleModel}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${make}</b></td>
                                                <td class="center tbl" style="font-size:15px;"><b style="font-size:18px;">${category}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:18px;">${vehicleColor}</b></td>
                                                <td style="text-align: center; font-size:25px;"><b style="font-size:20px;">${mvFileNo}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${registrationNo}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${chassisNo}</b></td>
                                                <td class="center tbl" style="font-size:25px;"><b style="font-size:20px;">${engineNo}</b></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                                <td class="center tbl" style="font-size:25px;"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'Two':
            content += `
                <div id="showTwo" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                       
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_pup">
                                <br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;">
                                                    <b style="color: ${policyColor};">${policyNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${clientName}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${orColor};">${orNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;"><b>${clientAddress}</b></td>
                                                <td></td>
                                                <td style="text-align:left;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;"><b>${expirationDate}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${vehicleModel}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${make}</b></td>
                                                <td class='center tbl'><b>${category}</b></td>
                                                <td class="tbl"><b>${vehicleColor}</b></td>
                                                <td class="" style="text-align: center;"><b>${mvFileNo}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${registrationNo}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${chassisNo}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${engineNo}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'Three':
            content += `
                <div id="showThree" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                        
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_mil">
                                <br><br><br><br><br><br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;">
                                                    <b style="color: ${policyColor};">${policyNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;"><b>${clientName}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${orColor};">${orNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;"><b>${clientAddress}</b></td>
                                                <td></td>
                                                <td style="text-align:left;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;"><b>${expirationDate}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${vehicleModel}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${make}</b></td>
                                                <td class='center tbl'><b>${category}</b></td>
                                                <td class="tbl"><b>${vehicleColor}</b></td>
                                                <td class="" style="text-align: center;"><b>${mvFileNo}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;"><b>${registrationNo}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${chassisNo}</b></td>
                                                <td class="tbl" style="text-align:center;"><b>${engineNo}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'Four':
            content += `
                <div id="showFour" class="content py-3  myDiv">
                    <div class="card card-outline card-primary rounded-0 shadow">
                      
                        <div class="card-body">
                            <div class="container-fluid" id="outprint_strong">
                                <br><br><br><br><br><br><br><br><br><br>  <br><br>
                                <div class="row-fluid body">
                                    <h5 class="title"></h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td class="list " rowspan="2" style="text-align:right;">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2">
                                                    <h4></h4>
                                                </td>
                                                <td class="tbl center" rowspan="2"></td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align: right;"></td>
                                                <td class="tbl " style="text-align:center;"></td>
                                            </tr>
                                            <tr>
                                                <td class="list center" rowspan="2"></td>
                                                <td class="tbl center" colspan="2"></td>
                                                <td class="tbl center" rowspan="2"></td>
                                                <td class="tbl" rowspan="2" style="text-align: center;font-size:20px;">
                                                    <b style="color: ${policyColor};font-size:20px;">${policyNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="tbl " style="text-align:center;"></td>
                                                <td class="tbl " style="color: white;">a</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl " style="text-align:center;font-size:20px;"><b>${clientName}</b></td>
                                                <td class="tbl "></td>
                                                <td style="text-align:left;font-size:20px;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;">
                                                    <b style="color: ${orColor};font-size:20px;">${orNo}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${clientAddress}</b></td>
                                                <td></td>
                                                <td style="text-align:left;font-size:20px;"><b>${registrationDate}</b></td>
                                                <td style="text-align:center;font-size:20px;"><b>${expirationDate}</b></td>
                                            </tr>
                                        </tbody>
                                    </table><br>
                                    <table class="table">
                                        <tbody>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${vehicleModel}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${make}</b></td>
                                                <td class='center tbl'><b style="text-align:center;font-size:20px;">${category}</b></td>
                                                <td class="tbl"><b style="text-align:center;font-size:20px;">${vehicleColor}</b></td>
                                                <td class="" style="text-align: center;font-size:20px;"><b>${mvFileNo}</b></td>
                                            </tr>
                                            <tr style="height: 25px;">
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${registrationNo}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${chassisNo}</b></td>
                                                <td class="tbl" style="text-align:center;font-size:20px;"><b>${engineNo}</b></td>
                                                <td class="center tbl"></td>
                                                <td class="center tbl"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'Five':
            content += `
                <div class="client-info">
                    <div><strong>Policy Owner:</strong> ${clientName}</div>
                    <div><strong>Address:</strong> ${clientAddress}</div>
                    <div><strong>Plate No:</strong> ${plateNo}</div>
                    <div><strong>MV File No:</strong> ${mvFileNo}</div>
                    <div><strong>Issue Date:</strong> ${currentDate}</div>
                </div>
                <div class="amount">Certificate of Coverage Issued</div>
                <div class="footer">${label} - Official Certificate (BETA)</div>
            `;
            break;

        default:
            content += `
                <div class="client-info">
                    <div><strong>Client:</strong> ${clientName}</div>
                    <div><strong>Amount:</strong> ₱${cost}.00</div>
                </div>
                <div class="footer">Unknown Template - ${documentType}</div>
            `;
    }

    content += `
        </body>
        </html>
    `;

    return content;
}

// 🌀 Premium Loading Animation (reusable function)
function showLoadingAnimation(message = 'Generating document...', submessage = 'This typically takes 2-3 seconds') {
    Swal.fire({
        title: '<div style="font-size:1.3rem; font-weight:600; color:#212529; margin-bottom:15px;">Preparing Document</div>',
        html: `
            <div style="max-width:400px; margin:0 auto; text-align:center;">
                <div style="position:relative; width:80px; height:80px; margin:0 auto 20px;">
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #f1f3f5; border-radius:50%;"></div>
                    <div style="position:absolute; top:0; left:0; width:100%; height:100%; border:4px solid #28a745; border-radius:50%; border-top-color:transparent; animation:spin 1s linear infinite;"></div>
                    <svg style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </div>
                <p style="color:#495057; margin-bottom:5px;">${message}</p>
                <p style="font-size:0.9rem; color:#868e96;">${submessage}</p>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
            if (!document.getElementById('swal-loading-animation')) {
                const style = document.createElement('style');
                style.id = 'swal-loading-animation';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    });
}

// 🔒 Premium Locked State UI (reusable function)
function showLockedAlert() {
    Swal.fire({
        icon: 'error',
        title: '<span style="font-weight:600">Reprint Restricted</span>',
        html: `
            <div style="text-align:center; max-width:400px; margin:0 auto;">
                <div style="width:80px; height:80px; margin:0 auto 20px; background:#f8f9fa; border-radius:50%; display:flex; align-items:center; justify-content:center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="12" y1="17" x2="12" y2="17.01"></line>
                    </svg>
                </div>
                <p style="color:#495057; margin-bottom:10px;">This document is under RSU policy lock until:</p>
                <div style="background:#f1f3f5; padding:12px; border-radius:8px; margin-bottom:20px;">
                    <p style="font-size:1.1rem; color:#212529; margin:0;">${lockDate}</p>
                </div>
                <p style="font-size:0.9rem; color:#868e96;">Please contact administration for emergency access</p>
            </div>
        `,
        confirmButtonText: 'Understood',
        confirmButtonColor: '#dc3545',
        customClass: {
            container: 'swal-premium-container',
            popup: 'swal-premium-popup'
        }
    });
}