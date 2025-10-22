/*-----------------------------------------------------------------------------
 * Speed Controls Feature
 * Adds speed control buttons to the YouTube video player
 *----------------------------------------------------------------------------*/

function createSpeedControls() {
    const controls = document.createElement('div');
    controls.className = 'ytp-speed-controls';
    
    // Create decrease speed button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'ytp-button ytp-speed-decrease';
    decreaseBtn.title = 'Decrease playback speed';
    decreaseBtn.innerHTML = `
        <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <path d="M 12,24 20.5,18 12,12 V 24 z" fill="currentColor"></path>
            <path d="M 22,12 v 12" stroke="currentColor" stroke-width="2"></path>
        </svg>`;
    decreaseBtn.onclick = () => adjustSpeed('decrease');
    
    // Create reset speed button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'ytp-button ytp-speed-reset';
    resetBtn.title = 'Reset to normal speed (1x)';
    resetBtn.innerHTML = '1x';
    resetBtn.onclick = () => adjustSpeed('reset');
    
    // Create increase speed button
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'ytp-button ytp-speed-increase';
    increaseBtn.title = 'Increase playback speed';
    increaseBtn.innerHTML = `
        <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
            <path d="M 12,24 20.5,18 12,12 V 24 z" fill="currentColor"></path>
            <path d="M 22,12 L 30.5,18 22,24 V 12 z" fill="currentColor"></path>
        </svg>`;
    increaseBtn.onclick = () => adjustSpeed('increase');
    
    // Add buttons to controls
    controls.appendChild(decreaseBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(increaseBtn);
    
    return controls;
}

function adjustSpeed(action) {
    const video = document.querySelector('video');
    if (!video) return;

    const currentSpeed = video.playbackRate;
    let newSpeed = currentSpeed;

    switch (action) {
        case 'increase':
            newSpeed = Math.min(currentSpeed + 0.25, 2);
            break;
        case 'decrease':
            newSpeed = Math.max(currentSpeed - 0.25, 0.25);
            break;
        case 'reset':
            newSpeed = 1;
            break;
    }

    video.playbackRate = newSpeed;
    updateSpeedDisplay(newSpeed);
}

function updateSpeedDisplay(speed) {
    const resetBtn = document.querySelector('.ytp-speed-reset');
    if (resetBtn) {
        resetBtn.innerHTML = speed + 'x';
    }
}

// Initialize speed controls when video player is ready
function initSpeedControls() {
    const videoPlayer = document.querySelector('.html5-video-player');
    if (!videoPlayer) return;

    const rightControls = videoPlayer.querySelector('.ytp-right-controls');
    if (!rightControls) return;

    // Check if controls already exist
    if (!document.querySelector('.ytp-speed-controls')) {
        const speedControls = createSpeedControls();
        rightControls.insertBefore(speedControls, rightControls.firstChild);
    }
}

// Initialize when page loads and when navigation occurs
document.addEventListener('yt-navigate-finish', initSpeedControls);
window.addEventListener('load', initSpeedControls);
