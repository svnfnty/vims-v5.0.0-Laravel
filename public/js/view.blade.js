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

// Event listener for image click
img.addEventListener('click', openProfile);

// Event listener for the "View Profile" text click
overlayText.addEventListener('click', openProfile);
