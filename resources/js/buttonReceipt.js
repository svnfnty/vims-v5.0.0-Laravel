// ============================================
// DOCUMENT SELECTION FUNCTIONS - Module
// ============================================

window.selectReceipt = function() {
    if (typeof isLocked !== 'undefined' && isLocked) {
        showLockedAlert();
        return;
    }

    showDocumentSelection({
        title: 'Receipt Template',
        documentType: 'Receipt',
        optionsList: [
            { value: 'One', label: 'Liberty Insurance Corporation' },
            { value: 'OneV2', label: 'Liberty Insurance Corporation V2' },
            { value: 'Two', label: 'Pacific Union Insurance Corporation' },
            { value: 'Three', label: 'Milestone Insurance Corporation' },
             {
                value: 'Four',
                label: 'Stronghold Insurance Company'},
                {
                value: 'Five',
                label: 'Western Guaranty Corporation', isNew: true}
        ],
        cost: window.insuranceData?.cost || 0,
        markup: window.insuranceData?.markup || ''
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

// Helper function to get color class
function getColorClass(markup) {
    // This should match the PHP function in view_insurance.php
    // For now, return a default or implement logic
    return '#2575fc'; // Default color
}

// Helper function to convert number to words
function numberToWords(number) {
    const words = {
        0: 'Zero',
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine',
        10: 'Ten',
        11: 'Eleven',
        12: 'Twelve',
        13: 'Thirteen',
        14: 'Fourteen',
        15: 'Fifteen',
        16: 'Sixteen',
        17: 'Seventeen',
        18: 'Eighteen',
        19: 'Nineteen',
        20: 'Twenty',
        30: 'Thirty',
        40: 'Forty',
        50: 'Fifty',
        60: 'Sixty',
        70: 'Seventy',
        80: 'Eighty',
        90: 'Ninety',
    };
    if (typeof number !== 'number' || isNaN(number)) {
        return false;
    }
    if (number < 0) {
        return 'minus ' + numberToWords(Math.abs(number));
    }
    let string = '';
    if (number < 21) {
        string = words[number];
    } else if (number < 100) {
        const tens = Math.floor(number / 10) * 10;
        const units = number % 10;
        string = words[tens];
        if (units) {
            string += '-' + words[units];
        }
    } else if (number < 1000) {
        const hundreds = Math.floor(number / 100);
        const remainder = number % 100;
        string = words[hundreds] + ' Hundred';
        if (remainder) {
            string += ' and ' + numberToWords(remainder);
        }
    } else if (number < 1000000) {
        const thousands = Math.floor(number / 1000);
        const remainder = number % 1000;
        string = numberToWords(thousands) + ' Thousand';
        if (remainder) {
            string += ' ' + numberToWords(remainder);
        }
    } else {
        const millions = Math.floor(number / 1000000);
        const remainder = number % 1000000;
        string = numberToWords(millions) + ' Million';
        if (remainder) {
            string += ' ' + numberToWords(remainder);
        }
    }
    return string.trim();
}



// Helper function to generate print content based on selected template
function generatePrintContent(value, label, documentType) {
    const clientName = window.authData?.clientName || "Client Name";
    const clientAddress = window.authData?.clientAddress || "Client Address";
    const plateNo = window.authData?.plateNo || "Plate Number";
    const mvFileNo = window.authData?.mvFileNo || "MV File Number";
    const cost = window.insuranceData?.cost || 0;
    const currentDate = new Date().toLocaleDateString();

    let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${label} - ${documentType}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
                .company-name { color: #2563eb; margin-bottom: 10px; }
                .client-info { margin: 20px 0; }
                .client-info div { margin-bottom: 5px; }
                .amount { font-size: 18px; font-weight: bold; margin: 20px 0; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
    `;

    switch(value) {


        case 'One':
            const costInWords = numberToWords(cost);
            content += `
                <div id="showOne" style="padding: 1rem 0; font-family: Arial, sans-serif;">
                    <div style="padding: 1.25rem;">
                        <div style="width: 100%;" id="outprint">
                            <br><br><br><br>
                            <div style="width: 100%;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientName}</b></td>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;<b>${currentDate}</b></td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientAddress}</b></td>
                                            <td style="text-align:center; padding: 0.75rem; border: 1px solid transparent;" rowspan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br><br><br>
                                <table style="width: 906px; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr style="height: 25px;">
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;<b>${costInWords} Pesos Only</b></td>
                                            <td colspan="2" style="text-align: left; padding: 2px; border: 1px solid transparent;"><b>${window.insuranceData.thirdPartyLiability || ''}</b></td>
                                        </tr>
                                        ${window.insuranceData.personalAccident ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;"><b>${window.insuranceData.personalAccident}</b></td>
                                        </tr>
                                        ` : ''}
                                        ${window.insuranceData.tppd && window.insuranceData.tppd != 0 ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;"><b>TPPD ${window.insuranceData.tppd}</b></td>
                                        </tr>
                                        ` : ''}
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;<b>${window.insuranceData.documentaryStamps || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;"><b>&emsp;&emsp;${window.insuranceData.valueAddedTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;<b>${window.insuranceData.localGovTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="1" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;<b>${cost}.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;



        case 'OneV2':
            content += `
                <div id="showOneV2" style="padding: 1rem 0; font-family: Arial, sans-serif;">
                    <div style="padding: 1.25rem;">
                        <div style="width: 100%;" id="outprintV2">
                            <br><br><br><br>
                            <div style="width: 100%;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientName}&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color:white;">******</span><b>${currentDate}</b></b></td>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;"></b></td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientAddress}</b></td>
                                            <td style="text-align:center; padding: 0.75rem; border: 1px solid transparent;" rowspan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br><br><br><br><br><br><br><br><br><br>
                                <table style="width: 70%; border-collapse: collapse; margin-bottom: 1rem;">

                                    <tbody>
                                        <tr style="height: 25px;">
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;</td>
                                            <td colspan="2" style="text-align: left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.thirdPartyLiability || ''}</b></td>
                                        </tr>
                                        ${window.insuranceData.personalAccident ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.personalAccident}</b></td>
                                        </tr>
                                        ` : ''}
                                        ${window.insuranceData.tppd && window.insuranceData.tppd != 0 ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>TPPD ${window.insuranceData.tppd}</b></td>
                                        </tr>
                                        ` : ''}
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.documentaryStamps || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.valueAddedTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.localGovTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="1" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b> Total ${cost}.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                                ${window.authData?.officeId == 0 ? `
                                <br><br><br><br>
                                &emsp;
                                <b style="text-align:left; font-size: 14px;">
                                    JUNDEL CAROZ, ISD  <br>
                                    &emsp;&emsp;POLICY ISSUANCE ADMINISTRATOR
                                </b>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;


        case 'Two':
            content += `
                <div id="showTwo" style="padding: 1rem 0; font-family: Arial, sans-serif;">
                    <div style="padding: 1.25rem;">
                        <div style="width: 100%;" id="outprint_pup">
                            <br><br><br><br><br><br>
                            <div style="width: 100%;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientName}&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color:white;">***************</span><b>${currentDate}</b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientAddress}</b></td>
                                            <td colspan="2" style="text-align:center; padding: 0.75rem; border: 1px solid transparent;" rowspan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br><br>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr style="height: 25px;">
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;</td>
                                            <td colspan="2" style="text-align: left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.thirdPartyLiability || ''}</b></td>
                                        </tr>
                                        ${window.insuranceData.personalAccident ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.personalAccident}</b></td>
                                        </tr>
                                        ` : ''}
                                        ${window.insuranceData.tppd && window.insuranceData.tppd != 0 ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>TPPD ${window.insuranceData.tppd}</b></td>
                                        </tr>
                                        ` : ''}
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.documentaryStamps || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&emsp;&emsp;${window.insuranceData.valueAddedTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.localGovTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="1" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b> Total ${cost}.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;


        case 'Three':
            content += `
                <div id="showThree" style="padding: 1rem 0; font-family: Arial, sans-serif;">
                    <div style="padding: 1.25rem;">
                        <div style="width: 100%;" id="outprint_mil">
                            <br><br><br><br><br><br><br><br>
                            <div style="width: 100%;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientName}&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color:white;">***************</span><b>${currentDate}</b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientAddress}</b></td>
                                            <td colspan="2" style="text-align:center; padding: 0.75rem; border: 1px solid transparent;" rowspan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br><br>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr style="height: 25px;">
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;</td>
                                            <td colspan="2" style="text-align: left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.thirdPartyLiability || ''}</b></td>
                                        </tr>
                                        ${window.insuranceData.personalAccident ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.personalAccident}</b></td>
                                        </tr>
                                        ` : ''}
                                        ${window.insuranceData.tppd && window.insuranceData.tppd != 0 ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>TPPD ${window.insuranceData.tppd}</b></td>
                                        </tr>
                                        ` : ''}
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.documentaryStamps || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&emsp;&emsp;${window.insuranceData.valueAddedTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.localGovTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="1" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b> Total ${cost}.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;


        case 'Four':
            content += `
                <div id="showFour" style="padding: 1rem 0; font-family: Arial, sans-serif;">
                    <div style="padding: 1.25rem;">
                        <div style="width: 100%;" id="outprint_strong">
                            <br><br><br><br><br><br><br><br><br><br>
                            <div style="width: 100%;">
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientName}&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color:white;">******</span><b>${currentDate}</b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="text-align:left; padding: 0.75rem; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;<b>${clientAddress}</b></td>
                                            <td colspan="2" style="text-align:center; padding: 0.75rem; border: 1px solid transparent;" rowspan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <br><br><br><br><br><br><br><br><br><br>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
                                    <tbody>
                                        <tr style="height: 25px;">
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;</td>
                                            <td colspan="2" style="text-align: left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.thirdPartyLiability || ''}</b></td>
                                        </tr>
                                        ${window.insuranceData.personalAccident ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.personalAccident}</b></td>
                                        </tr>
                                        ` : ''}
                                        ${window.insuranceData.tppd && window.insuranceData.tppd != 0 ? `
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>TPPD ${window.insuranceData.tppd}</b></td>
                                        </tr>
                                        ` : ''}
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.documentaryStamps || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>&emsp;&emsp;${window.insuranceData.valueAddedTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="2" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b>${window.insuranceData.localGovTax || ''}</b></td>
                                        </tr>
                                        <tr style="height: 25px;">
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td style="text-align:center; padding: 2px; border: 1px solid transparent;"><b></b></td>
                                            <td colspan="1" style="text-align:left; padding: 2px; border: 1px solid transparent;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<b> Total ${cost}.00</b></td>
                                        </tr>
                                    </tbody>
                                </table>
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
                <div class="amount">Premium Paid: ₱${cost}.00</div>
                <div class="footer">Western Guaranty Corporation - Official Receipt (BETA)</div>
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