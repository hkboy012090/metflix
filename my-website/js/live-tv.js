// ========================================
// METFLIX LIVE TV
// CHANNEL PLAYER
// ========================================

function selectChannel(channelName) {

    const playerModal = document.getElementById("playerModal");
    const playerTitle = document.getElementById("playerTitle");
    const playerStatus = document.getElementById("playerStatus");
    const liveVideo = document.getElementById("liveVideo");
    const videoPlaceholder = document.getElementById("videoPlaceholder");

    if (!playerModal) {
        console.error("Player modal not found.");
        return;
    }

    if (playerTitle) {
        playerTitle.textContent = channelName;
    }

    // Walang stream na ikakabit hangga't walang
    // authorized/legal stream URL.
    if (liveVideo) {
        liveVideo.pause();
        liveVideo.removeAttribute("src");
        liveVideo.load();
        liveVideo.classList.remove("active");
    }

    if (videoPlaceholder) {
        videoPlaceholder.style.display = "flex";
    }

    if (playerStatus) {
        playerStatus.textContent =
            "No authorized live stream connected yet.";
    }

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal = document.getElementById("playerModal");
    const liveVideo = document.getElementById("liveVideo");

    if (liveVideo) {
        liveVideo.pause();
    }

    if (playerModal) {
        playerModal.classList.remove("show");
    }

    document.body.style.overflow = "";
}


// ========================================
// CLOSE OUTSIDE PLAYER
// ========================================

document.addEventListener("click", function(event) {

    const playerModal = document.getElementById("playerModal");

    if (!playerModal) return;

    if (event.target === playerModal) {
        closePlayer();
    }

});
