/*------------------------------------------------------------------------------
VOLUME BOOST BUTTON
------------------------------------------------------------------------------*/

ImprovedTube.volumeBoostButton = function () {

    // SVGs for normal and boosted states
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Normal volume icon (speaker)
    const normalIcon = "M3 9v6h4l5 5V4L7 9H3z";
    // Boosted volume icon (speaker with sound waves)
    const boostedIcon = "M3 9v6h4l5 5V4L7 9H3zm7.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
    path.setAttribute("d", normalIcon);
    path.setAttribute("fill", "#ffffff");
    svg.appendChild(path);

    // Store the original volume in ImprovedTube state
    if (typeof ImprovedTube._originalVolume === 'undefined') {
        ImprovedTube._originalVolume = null;
    }
    if (typeof ImprovedTube._boostActive === 'undefined') {
        ImprovedTube._boostActive = false;
    }

    const button = this.createPlayerButton({
        id: 'it-volume-boost-button',
        child: svg,
        opacity: 0.85,
        position: "right",
        title: 'Volume Boost (Scroll to adjust)',
        onclick: function () {
            const player = ImprovedTube.elements.player;
            if (!player) return;

            if (!ImprovedTube._boostActive) {
                // Save the current volume before boosting
                ImprovedTube._originalVolume = player.getVolume();
                ImprovedTube.setAndShowVolume(200);
                ImprovedTube._boostActive = true;
                button.classList.add('it-volume-boost-active');
                // Change icon to boosted
                path.setAttribute("d", boostedIcon);
            } else {
                // Restore the original volume
                const restoreVolume = ImprovedTube._originalVolume != null ? ImprovedTube._originalVolume : 100;
                ImprovedTube.setAndShowVolume(restoreVolume);
                ImprovedTube._boostActive = false;
                button.classList.remove('it-volume-boost-active');
                // Change icon to normal
                path.setAttribute("d", normalIcon);
            }
        }
    });

    // Add wheel handler for fine control
    button.addEventListener('wheel', function (e) {
        e.preventDefault();
        const player = ImprovedTube.elements.player;
        if (!player) return;

        const currentVolume = player.getVolume();
        const step = 5;
        let newVolume;

        if (e.deltaY < 0) {
            // Scroll up: increase volume
            newVolume = Math.min(currentVolume + step, 400);
        } else {
            // Scroll down: decrease volume
            newVolume = Math.max(currentVolume - step, 0);
        }

    ImprovedTube.setAndShowVolume(newVolume);
    // If user adjusts volume manually, treat as leaving boost mode
    ImprovedTube._boostActive = false;
    button.classList.remove('it-volume-boost-active');
    // Change icon to normal
    path.setAttribute("d", normalIcon);
    });

    // Optional: visually indicate boost mode (CSS class)
    // You can add a style for .it-volume-boost-active in your CSS for highlight

    return button;
};

// Helper function to set volume and show status
ImprovedTube.setAndShowVolume = function (volume) {
    const player = this.elements.player;
    if (!player) return;

    // Ensure volume is within bounds
    volume = Math.max(0, Math.min(400, volume));

    // Use Web Audio API for volume boost above 100%
    if (volume > 100) {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.audioContextSource = this.audioContext.createMediaElementSource(document.querySelector('video'));
            this.audioContextGain = this.audioContext.createGain();
            this.audioContextSource.connect(this.audioContextGain);
            this.audioContextGain.connect(this.audioContext.destination);
        }

        player.setVolume(100);
        this.audioContextGain.gain.value = volume / 100;
    } else {
        if (this.audioContext) {
            this.audioContextGain.gain.value = 1;
        }
        player.setVolume(volume);
    }

    // Update localStorage for YouTube's native volume persistence
    localStorage['yt-player-volume'] = JSON.stringify({
        data: JSON.stringify({
            volume: Math.min(100, volume), // Keep YouTube's native volume <= 100
            muted: player.isMuted(),
            expiration: Date.now(),
            creation: Date.now()
        })
    });
    sessionStorage['yt-player-volume'] = localStorage['yt-player-volume'];

    // Store the actual boosted volume value separately
    localStorage['it-volume-boost'] = volume;

    // Show status
    this.showStatus(Math.round(volume) + '%');

    // Update stored volume if forced volume is enabled
    if (this.storage.player_forced_volume === true) {
        this.storage.player_volume = volume;
    }
};