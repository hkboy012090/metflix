// ========================================
// METFLIX LIVE TV
// CINEMA ONE PLAYER
// ========================================

function selectChannel(channelName) {

    const playerModal = document.getElementById("playerModal");
    const playerTitle = document.getElementById("playerTitle");
    const playerStatus = document.getElementById("playerStatus");

    if (!playerModal) {
        console.error("Player modal not found.");
        return;
    }

    playerTitle.textContent = channelName;

    playerStatus.textContent =
        "Cinema One live stream is not configured yet.";

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal =
        document.getElementById("playerModal");

    if (!playerModal) return;

    playerModal.classList.remove("show");

    document.body.style.overflow = "";
}


// ========================================
// CLICK OUTSIDE PLAYER
// ========================================

document.addEventListener("click", function(event) {

    const playerModal =
        document.getElementById("playerModal");

    if (!playerModal) return;

    if (event.target === playerModal) {
        closePlayer();
    }

});


// ========================================
// ESC KEY
// ========================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closePlayer();
    }

});
