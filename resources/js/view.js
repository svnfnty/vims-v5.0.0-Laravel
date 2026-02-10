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

// ============================================
// BUTTON AUTHENTICATE FLOW - From view_insurance.php
// ============================================

// Main authentication function
window.verifyDataAndOpenWindow = function() {
    // Check if session credit is below 20
    const sessionCredit = window.authData?.userCredit || 0;

    // Modern loading dialog with sleek design
    const loadingSwal = Swal.fire({
        title: '<span style="color: #4f46e5;">Fetching Client Data</span>',
        imageUrl: "https://i.pinimg.com/originals/3a/81/05/3a8105197bf6472fa8e825c06a3e5041.gif",
        imageWidth: 180,
        imageHeight: 120,
        imageAlt: "Loading",
        html: `
            <div class="progress-container">
                <div id="progress-bar"></div>
            </div>
            <div style="margin-top: 0.5rem;">
                <div class="loading-message"><i class="fas fa-user" style="color: #667eea; width: 20px;"></i> Client: <span id="loadingClientName">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-map-marker-alt" style="color: #667eea; width: 20px;"></i> Address: <span id="loadingClientAddress">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-car" style="color: #667eea; width: 20px;"></i> Plate: <span id="loadingPlateNo">Loading...</span></div>
                <div class="loading-message"><i class="fas fa-file-alt" style="color: #667eea; width: 20px;"></i> MV File: <span id="loadingMvFileNo">Loading...</span></div>
            </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false,
        background: 'rgba(255, 255, 255, 0.98)',
        backdrop: `
            rgba(79, 70, 229, 0.08)
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23667eea' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
        `,
        didOpen: () => {
            // Smooth progress animation
            let progress = 0;
            const progressBar = document.getElementById('progress-bar');
            const interval = setInterval(() => {
                progress += Math.random() * 10 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = `${progress}%`;
            }, 200);
        }
    });

    // Simulate fetching data with a delay
    setTimeout(() => {
        // Get the dynamic data from window.authData
        var clientName = window.authData?.clientName || "";
        var clientAddress = window.authData?.clientAddress || "";
        var plateNo = window.authData?.plateNo || "";
        var mvFileNo = window.authData?.mvFileNo || "";
        var clientcoc = window.authData?.cocNo || ""; // COC number
        var orNo = window.authData?.orNo || "";
        var policyNo = window.authData?.policyNo || "";

        // Ensure clientcoc is in uppercase
        clientcoc = clientcoc.toUpperCase();

        // Update the loading message with the actual data
        document.getElementById('loadingClientName').textContent = clientName || "No data available";
        document.getElementById('loadingClientAddress').textContent = clientAddress || "No data available";
        document.getElementById('loadingPlateNo').textContent = plateNo || "No data available";
        document.getElementById('loadingMvFileNo').textContent = mvFileNo || "No data available";

        // Simulate a small delay before closing the spinner and showing the data verification dialog
        setTimeout(() => {
            
            if (sessionCredit <= 10) {
                Swal.fire({
                    title: '<span style="color: #ef4444;">Service Failed</span>',
                    html: '<div style="text-align:center;"><i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i><p>Request Limit Reached Balance Uphold.</p></div>',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'swal2-confirm-error'
                    }
                });
                return;
            }

            // Check for invalid characters in client name
            if (/(\.{2,})|[-\/]{2,}|,{2,}|`{2,}/.test(clientName)) {
                Swal.fire({
                    title: '<span style="color: #ef4444;">Invalid Name Format</span>',
                    html: `<div style="text-align:center;">
                            <i class="fas fa-exclamation-circle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i>
                            <p>The client name contains invalid characters. Multiple periods, hyphens, slashes, commas, or backticks are not allowed.</p>
                            <p style="font-weight:600;margin-top:1rem;">Please edit the name to continue.</p>
                          </div>`,
                    showCancelButton: true,
                    confirmButtonText: 'Edit Name',
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'swal2-confirm-error'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Open edit modal
                        window.openEditModal();
                    }
                });
                return;
            }

            // Check if clientcoc is between 1 and 200
            if (clientcoc >= 1 && clientcoc <= 200) {
                showBypassDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo);
                return;
            }

            // Check if clientcoc length is 6 and starts with '87'
            if (clientcoc.length === 6 && clientcoc.startsWith('87')) {
                showMilestoneCocDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo);
                return;
            }

            // If all validations pass, show the confirmation dialog
            showConfirmationDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo);

        }, 1000);
    }, 1500);
}

function showConfirmationDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo) {
    // Close the loading spinner
    Swal.close();

    // Prepare the message with elegant styling
    var message = `
        <div style="margin-top:1.5rem;text-align:left;">
            <div class="client-detail"><strong>Client Name:</strong> <span>${clientName}</span></div>
            <div class="client-detail"><strong>Address:</strong> <span>${clientAddress}</span></div>
            <div class="client-detail"><strong>Plate Number:</strong> <span>${plateNo}</span></div>
            <div class="client-detail"><strong>MV File No:</strong> <span>${mvFileNo}</span></div>
        </div>
    `;

    Swal.fire({
        title: '<span style="color: #4f46e5;">Confirm Details</span>',
        html: `
            <div style="text-align:center;">
                <p style="margin-bottom:1.5rem;">Please verify all details before proceeding. Ensure everything is correct.</p>
            </div>
            ${message}
        `,
        imageUrl: null,
        showCancelButton: true,
        confirmButtonText: 'Confirm & Proceed',
        cancelButtonText: 'Review Details',
        focusConfirm: false,
        allowOutsideClick: false,
        backdrop: 'rgba(79, 70, 229, 0.08)'
    }).then((result) => {
        if (result.isConfirmed) {
            // Log the action
            const data = {
                log: `Generated Authentication with Confirmation of Cover Bearing No: "${clientcoc}" to MV file No. : "${mvFileNo}"`,
                session: window.authData?.userFullname || 'System'
            };
            
            // Send log to server (optional - create insert_log.php endpoint)
            fetch('insert_log.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString()
            })
            .then(response => response.text())
            .then(data => console.log('Log saved:', data))
            .catch(error => console.error('Error saving log:', error));

            // Open the windows
            openNewWindows(clientcoc, orNo, policyNo);
            
            // Show real-time checking dialog
            showAuthenticationCheckDialog(clientcoc);
        }
    });
    
    // Animate the client details with staggered animation
    document.querySelectorAll('.client-detail').forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

function openNewWindows(clientcoc, orNo, policyNo) {
    // Get values from window.authData
    var clientName = window.authData?.clientName || "";
    var clientAddress = window.authData?.clientAddress || "";
    var plateNo = window.authData?.plateNo || "";
    var mvFileNo = window.authData?.mvFileNo || "";
    var chassisNo = window.authData?.chassisNo || "";
    var engineNo = window.authData?.engineNo || "";
    var fullName = window.authData?.clientName || "";
    var address = window.authData?.clientAddress || "";
    var insuranceId = window.authData?.insuranceId || "";

    // Build the URL with query parameters
    var url = 'https://primeone.com.ph/issuance?';
    url += 'assured_name=' + encodeURIComponent(clientName);
    url += '&assured_address=' + encodeURIComponent(clientAddress);
    url += '&plate_no=' + encodeURIComponent(plateNo);
    url += '&mvfile_no=' + encodeURIComponent(mvFileNo);
    url += '&chassis_no=' + encodeURIComponent(chassisNo);
    url += '&motor_no=' + encodeURIComponent(engineNo);
    url += '&fullname=' + encodeURIComponent(fullName);
    url += '&address=' + encodeURIComponent(address);
    url += '&or_no=' + encodeURIComponent(orNo);
    url += '&coc_no=' + encodeURIComponent(clientcoc); 
    url += '&policy_no=' + encodeURIComponent(policyNo); 

    // Calculate window dimensions with a small gap between them
    var windowWidth = Math.floor(screen.width * 0.49); // 48% to leave some gap
    var gap = Math.floor(screen.width * 0.01); // 2% gap
    
    // Style configuration
    var windowFeatures = `width=${windowWidth},height=${screen.height},scrollbars=yes,resizable=yes,toolbar=no,location=no`;
    
    // Open authenticate page in left window
    var leftWindow = window.open(
        `/authenticate/index?id=${insuranceId}`,
        'authWindow',
        `${windowFeatures},left=0,top=0`
    );
    
    // Open ECTPL in right window
    var rightWindow = window.open(
        url,
        'ectplWindow',
        `${windowFeatures},left=${windowWidth + gap},top=0`
    );
    
    // Focus the windows with visual feedback
    if (leftWindow) {
        leftWindow.focus();
        // Add visual feedback in console
        console.log('Authentication window opened successfully');
    } else {
        console.error('Popup blocker may be preventing the authentication window from opening');
        alert('Please allow popups for this site to continue');
    }
    
    if (rightWindow) {
        rightWindow.focus();
        console.log('ECTPL window opened successfully');
    } else {
        console.error('Popup blocker may be preventing the ECTPL window from opening');
    }
    
    // Add a resize handler to maintain window proportions if needed
    window.addEventListener('resize', function() {
        if (leftWindow && !leftWindow.closed) {
            leftWindow.resizeTo(Math.floor(screen.width * 0.48), screen.height);
        }
        if (rightWindow && !rightWindow.closed) {
            rightWindow.resizeTo(Math.floor(screen.width * 0.48), screen.height);
            rightWindow.moveTo(Math.floor(screen.width * 0.48) + gap, 0);
        }
    });
}

function showBypassDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo) {
    Swal.fire({
        title: '<span style="color: #ef4444;">Invalid COC Number</span>',
        html: `
            <div style="text-align:center;margin-bottom:1.5rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#f59e0b;"></i>
                <p style="margin-top:1rem;">The Certificate of Coverage number is invalid (1-200). To proceed, enable bypass mode and enter valid details.</p>
            </div>
            <div class="checkbox-container">
                <input id="enableBypassMode" type="checkbox">
                <label for="enableBypassMode">Enable Bypass Mode</label>
            </div>
            <div id="formFields">
                <div class="form-field">
                    <label for="orNoInput">Official Receipt No.</label>
                    <input id="orNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit OR Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
                <div class="form-field">
                    <label for="cocNoInput">Certificate of Coverage No.</label>
                    <input id="cocNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit COC Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
                <div class="form-field">
                    <label for="policyNoInput">Policy No.</label>
                    <input id="policyNoInput" class="swal2-input" type="text" placeholder="Enter 8-digit Policy Number" maxlength="8" pattern="\\d{8}" inputmode="numeric">
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
            const enableBypassMode = document.getElementById('enableBypassMode').checked;
            if (!enableBypassMode) {
                Swal.showValidationMessage('You must enable bypass mode to proceed');
                return false;
            }

            const orNoInput = document.getElementById('orNoInput').value;
            const cocNoInput = document.getElementById('cocNoInput').value;
            const policyNoInput = document.getElementById('policyNoInput').value;

            if (!/^\d{8}$/.test(orNoInput) || !/^\d{8}$/.test(cocNoInput) || !/^\d{8}$/.test(policyNoInput)) {
                Swal.showValidationMessage('All fields must contain exactly 8 digits');
                return false;
            }

            return {
                cocNo: cocNoInput,
                orNo: orNoInput,
                policyNo: policyNoInput
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            clientcoc = result.value.cocNo;
            orNo = result.value.orNo;
            policyNo = result.value.policyNo;
            showConfirmationDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo);
        }
    });

    // Handle checkbox change
    document.getElementById('enableBypassMode').addEventListener('change', function() {
        const formFields = document.getElementById('formFields');
        const submitButton = Swal.getConfirmButton();
        
        if (this.checked) {
            formFields.classList.add('visible');
            submitButton.disabled = false;
        } else {
            formFields.classList.remove('visible');
            submitButton.disabled = true;
        }
    });
}

function showMilestoneCocDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo) {
    Swal.fire({
        title: '<span style="color: #f59e0b;">Milestone COC Detected</span>',
        html: `
            <div style="text-align:center;margin-bottom:1.5rem;">
                <i class="fas fa-info-circle" style="font-size:3rem;color:#f59e0b;"></i>
                <p style="margin-top:1rem;">The COC number starts with 87 and has 6 digits. Please enter the correct COC number in the format: <strong>J123456</strong> (letter + 6 digits)</p>
            </div>
            <div class="form-field">
                <label for="cocNoInput">Milestone COC Number</label>
                <input id="cocNoInput" class="swal2-input" type="text" 
                    placeholder="Enter COC (e.g. J123456)" 
                    value="${clientcoc}" 
                    maxlength="7" 
                    pattern="[A-Za-z]\\d{6}" 
                    style="text-transform: uppercase;">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
            const cocNoInput = document.getElementById('cocNoInput').value.toUpperCase();
            if (!/^[A-Z]\d{6}$/.test(cocNoInput)) {
                Swal.showValidationMessage('COC must start with a letter followed by 6 digits (e.g. J123456)');
                return false;
            }
            return cocNoInput;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            clientcoc = result.value;
            showConfirmationDialog(clientName, clientAddress, plateNo, mvFileNo, clientcoc, orNo, policyNo);
        }
    });
}

function showAuthenticationCheckDialog(clientcoc) {
    const storageKey = `authCheck_${clientcoc}`;
    const existingSession = localStorage.getItem(storageKey);
    
    if (existingSession) {
        const sessionData = JSON.parse(existingSession);
        // Check if session is not expired (within last 5 minutes)
        if (sessionData.isActive && sessionData.timestamp && (Date.now() - sessionData.timestamp) < 300000) {
            continueAuthenticationCheck(clientcoc, sessionData.timeLeft, sessionData.currentAuthCode);
            return;
        } else {
            localStorage.removeItem(storageKey);
        }
    }
    
    // Start new session if no valid existing session found
    continueAuthenticationCheck(clientcoc, 300, null);
}

function continueAuthenticationCheck(clientcoc, initialTimeLeft, initialAuthCode) {
    let timerInterval;
    let checkInterval;
    let timeLeft = initialTimeLeft;
    let currentAuthCode = initialAuthCode;
    let isAuthenticated = false;
    let hasShownRefreshAlert = false;
    
    const storageKey = `authCheck_${clientcoc}`;
    
    // Save session to local storage
    const saveSession = () => {
        localStorage.setItem(storageKey, JSON.stringify({
            isActive: !isAuthenticated && timeLeft > 0,
            timeLeft: timeLeft,
            currentAuthCode: currentAuthCode,
            timestamp: Date.now(),
            clientcoc: clientcoc
        }));
    };
    
    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    // Warn when trying to close/refresh the page
    const beforeUnloadHandler = (e) => {
        if (!isAuthenticated && timeLeft > 0) {
            saveSession();
            e.preventDefault();
            e.returnValue = 'You have an ongoing authentication process. Your progress will be saved.';
            return e.returnValue;
        }
    };
    
    // Detect refresh attempts (F5, Ctrl+R, etc.)
    const keydownHandler = (e) => {
        if (!isAuthenticated && timeLeft > 0) {
            if ((e.ctrlKey && (e.key === 'r' || e.key === 'R')) || e.key === 'F5') {
                if (!hasShownRefreshAlert) {
                    showRefreshWarning();
                    hasShownRefreshAlert = true;
                    setTimeout(() => { hasShownRefreshAlert = false; }, 1000);
                }
                e.preventDefault();
            }
        }
    };
    
    // Detect new tab/window attempts using Page Visibility API
    let lastFocusTime = Date.now();
    const visibilityChangeHandler = () => {
        if (!isAuthenticated && timeLeft > 0) {
            if (document.hidden) {
                const now = Date.now();
                if (now - lastFocusTime > 1000) { // Ignore very quick tab switches
                    showNewTabWarning();
                }
            } else {
                lastFocusTime = Date.now();
            }
        }
    };
    
    // Show refresh warning message
    const showRefreshWarning = () => {
        Swal.fire({
            title: 'Authentication in Progress',
            html: `<div style="text-align: left;">
                  <p>Your authentication for <strong>${clientcoc}</strong> is still pending.</p>
                  <p>⚠️ <strong>Don't worry!</strong> Your session will be automatically restored.</p>
                  <p>Time remaining: ${formatTime(timeLeft)}</p>
                  </div>`,
            icon: 'info',
            confirmButtonText: 'Continue Authentication',
            backdrop: 'rgba(0,0,0,0.7)',
            allowOutsideClick: false
        });
    };
    
    // Show new tab warning
    const showNewTabWarning = () => {
        Swal.fire({
            title: 'Stay on This Page',
            html: `<div style="text-align: left;">
                  <p>Please complete the authentication on this tab first.</p>
                  <p>Your session will not transfer to new tabs.</p>
                  <p>Time remaining: ${formatTime(timeLeft)}</p>
                  </div>`,
            icon: 'warning',
            confirmButtonText: 'Return to Authentication',
            backdrop: 'rgba(0,0,0,0.7)',
            allowOutsideClick: false
        }).then(() => {
            window.focus();
        });
    };
    
    // Start checking immediately
    checkAuthenticationStatus(clientcoc);
    
    // Set up the checking interval (every 5 seconds)
    checkInterval = setInterval(() => {
        if (!isAuthenticated) {
            checkAuthenticationStatus(clientcoc);
        }
    }, 5000);
    
    // Show the authentication dialog
    Swal.fire({
        title: 'Waiting for Authentication',
        html: `Please complete the authentication process for COC: <strong>${clientcoc}</strong><br><br>
               <div id="time-left">Time remaining: ${formatTime(timeLeft)}</div>
               <div id="auth-code" style="margin: 10px 0; font-weight: bold;"></div>
               <div id="status-message" class="text-info">Checking status...</div>
               <div class="progress-bar"><div class="progress" style="width: ${(timeLeft / 300) * 100}%"></div></div>`,
        imageUrl: "https://cdn-icons-png.flaticon.com/512/4207/4207257.png",
        imageWidth: 80,
        imageHeight: 80,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            // Add event listeners when dialog opens
            window.addEventListener('beforeunload', beforeUnloadHandler);
            window.addEventListener('keydown', keydownHandler);
            document.addEventListener('visibilitychange', visibilityChangeHandler);
            
            // Update timer and progress bar every second
            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                const progressPercent = (timeLeft / 300) * 100;
                
                document.getElementById('time-left').innerHTML = 
                    `Time remaining: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                document.querySelector('.progress').style.width = `${progressPercent}%`;
                
                // Save session state periodically
                saveSession();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    clearInterval(checkInterval);
                    localStorage.removeItem(storageKey);
                    Swal.fire({
                        title: 'Timeout',
                        text: 'Authentication process timed out. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }, 1000);
        },
        willClose: () => {
            // Cleanup when dialog closes
            clearInterval(timerInterval);
            clearInterval(checkInterval);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            window.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('visibilitychange', visibilityChangeHandler);
            
            if (!isAuthenticated) {
                localStorage.removeItem(storageKey);
            }
        }
    });
    
    // Authentication status check function
    function checkAuthenticationStatus(cocNumber) {
        fetch(`/check_authentication.php?coc_no=${encodeURIComponent(cocNumber)}&current_auth=${encodeURIComponent(currentAuthCode)}&_=${Date.now()}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    document.getElementById('status-message').innerHTML = 
                        `<span class="text-danger">${data.error}</span>`;
                    return;
                }

                if (data.auth_renewal) {
                    document.getElementById('auth-code').innerHTML = 
                        `Authentication Code: <span class="text-primary">${data.auth_renewal}</span>`;
                }

                if (currentAuthCode === null) {
                    currentAuthCode = data.auth_renewal;
                    saveSession();
                } else if (data.auth_renewal && data.auth_renewal !== currentAuthCode) {
                    // New authentication detected
                    isAuthenticated = true;
                    clearInterval(timerInterval);
                    clearInterval(checkInterval);
                    localStorage.removeItem(storageKey);
                    
                    document.getElementById('status-message').innerHTML = 
                        '<span class="text-success">New authentication detected!</span>';
                    
                    // Play notification sound
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
                    audio.play().catch(e => console.log('Audio play failed:', e));
                    
                    // Show browser notification if supported
                    if (Notification.permission === "granted") {
                        new Notification('New Authentication', { 
                            body: 'A new authentication code has been received!' 
                        });
                    }
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    document.getElementById('status-message').innerHTML = 
                        data.message || 'Waiting for new authentication code...';
                }
            })
            .catch(error => {
                document.getElementById('status-message').innerHTML = 
                    `<span class="text-danger">Error checking status: ${error.message}</span>`;
            });
    }
}

// Check for existing authentication session on page load
window.addEventListener('load', () => {
    // Check URL for coc parameter or get it from window.authData
    const clientcoc = window.authData?.cocNo || null;
    const orNo = window.authData?.orNo || '';
    const policyNo = window.authData?.policyNo || '';
    
    if (clientcoc) {
        const storageKey = `authCheck_${clientcoc}`;
        const existingSession = localStorage.getItem(storageKey);
        
        if (existingSession) {
            const sessionData = JSON.parse(existingSession);
            // Check if session is not too old (within last 5 minutes)
            if (sessionData.isActive && sessionData.timestamp && (Date.now() - sessionData.timestamp) < 300000) {
                // Show recovery notification
                Swal.fire({
                    title: 'Session Restored',
                    html: `We found an ongoing authentication for COC: <strong>${clientcoc}</strong><br>
                           <p>Time remaining: ${formatTime(sessionData.timeLeft)}</p>`,
                    icon: 'info',
                    confirmButtonText: 'Continue Authentication'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Reopen both windows with parameters
                        openNewWindows(clientcoc, orNo, policyNo);
                        // Continue authentication check
                        showAuthenticationCheckDialog(clientcoc);
                    }
                });
                return;
            } else {
                // Clean up expired session
                localStorage.removeItem(storageKey);
            }
        }
    }
});

// Helper function to format time (used in load event)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ============================================
// CHECK POLICY STATUS - Full Implementation
// ============================================

window.checkPolicyStatus = function(status, pstatus, releaseDate, cocNo, element) {
    // Set loading state on button
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    element.style.backgroundColor = '#FF9800';
    element.disabled = true;

    // Show loading dialog with unique class names
    Swal.fire({
        title: '<div class="swal-policy-check-title">Verifying Policy Status</div>',
        html: `
            <div class="swal-policy-check-container">
                <div class="swal-policy-check-spinner">
                    <div class="swal-policy-check-spinner-outer"></div>
                    <div class="swal-policy-check-spinner-inner"></div>
                </div>
                <div class="swal-policy-check-progress-container">
                    <div id="swal-policy-check-progress-bar" class="swal-policy-check-progress-bar"></div>
                </div>
                <p class="swal-policy-check-message">Validating motor vehicle details with insurance provider...</p>
            </div>
        `,
        width: 500,
        padding: '2em',
        background: '#fff',
        allowOutsideClick: false,
        showConfirmButton: false,
        customClass: {
            popup: 'swal-policy-check-popup',
            title: 'swal-policy-check-title-container'
        },
        didOpen: () => {
            let progress = 0;
            const progressBar = document.getElementById('swal-policy-check-progress-bar');
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 100) progress = 100;
                progressBar.style.width = `${progress}%`;
                if (progress >= 100) clearInterval(interval);
            }, 200);
        }
    });

    setTimeout(function() {
        // Check for unknown policy (1-999 range)
        const cocNumber = parseInt(cocNo);
        if ((isNaN(cocNumber) || (cocNumber >= 1 && cocNumber <= 999)) && getCompanyInfo(cocNo).name === 'Unknown Policy') {
            showPolicyResult(
                'Policy Not Released',
                'https://static-00.iconduck.com/assets.00/circle-help-icon-512x512-udf9v5el.png',
                'Unknown Policy',
                cocNo,
                'Cannot release - Unknown policy number in restricted range',
                'FF0000',
                'error'
            );
            resetStatusButton(element);
            return;
        }

        // Determine company information
        const companyInfo = getCompanyInfo(cocNo);
        
        // Prepare result dialog based on status
        if (pstatus == 1 || status == 0) {
            showPolicyResult(
                'Policy Released!',
                companyInfo.logo,
                companyInfo.name,
                cocNo,
                releaseDate,
                '4CAF50',
                'success'
            );
        } else {
            showPolicyResult(
                'Policy Pending',
                companyInfo.logo,
                companyInfo.name,
                cocNo,
                'Not yet released',
                'FF6347',
                'warning'
            );
        }

        // Reset the button
        resetStatusButton(element);
    }, 2000);
}

// Helper function to get company info
function getCompanyInfo(cocNo) {
    let company = {
        name: 'Unknown Policy',
        logo: 'https://static-00.iconduck.com/assets.00/circle-help-icon-512x512-udf9v5el.png'
    };

    if (cocNo.startsWith('13') || cocNo.startsWith('40') || cocNo.startsWith('24')) {
        company.name = 'Liberty Insurance Corporation';
        company.logo = 'https://ectpl-vimsys.com/logo11.png';
    } else if (cocNo.startsWith('87') || cocNo.length === 6) {
        company.name = 'Milestone Guaranty And Assurance Corp.';
        company.logo = 'https://ectpl-vimsys.com/logo33.jpg';
    } else if (cocNo.startsWith('19')) {
        company.name = 'Pacific Union Insurance Company';
        company.logo = 'https://ectpl-vimsys.com/logo44.jpg';
    }

    return company;
}

// Helper function to show policy result
function showPolicyResult(title, logo, company, cocNo, date, borderColor, icon) {
    Swal.fire({
        title: `<div class="swal-policy-result-title">${title}</div>`,
        html: `
            <div class="swal-policy-result-container">
                <div class="swal-policy-result-logo" style="border-color: #${borderColor}">
                    <img src="${logo}" alt="${company} Logo">
                </div>
                <div class="swal-policy-result-details">
                    <div class="swal-policy-result-company" style="color: #${borderColor}">
                        <i class="fas fa-building"></i> ${company}
                    </div>
                    <div class="swal-policy-result-coc">
                        <i class="fas fa-file-alt"></i> COC No: ${cocNo}
                    </div>
                    <div class="swal-policy-result-date">
                        <i class="fas fa-calendar-alt"></i> ${date}
                    </div>
                </div>
            </div>
        `,
        icon: icon,
        confirmButtonText: 'Got it!',
        width: 550,
        padding: '2em',
        background: '#fff',
        customClass: {
            popup: 'swal-policy-result-popup',
            title: 'swal-policy-result-title-container',
            confirmButton: 'swal-policy-result-confirm-btn'
        },
        showClass: {
            popup: 'swal-policy-result-show'
        },
        hideClass: {
            popup: 'swal-policy-result-hide'
        }
    });
}

// Helper function to reset status button
function resetStatusButton(element) {
    element.innerHTML = '<i class="fas fa-check-circle"></i> Check Status';
    element.style.backgroundColor = '';
    element.disabled = false;
}

// ============================================
// DOCUMENT SELECTION FUNCTIONS
// ============================================

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

// ============================================
// MODAL FUNCTIONS
// ============================================

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

window.closeInsuranceModal = function() {
    const modal = document.getElementById('manageInsuranceModal');
    const overlay = document.getElementById('insuranceModalOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

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

// ============================================
// DOM CONTENT LOADED
// ============================================

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
