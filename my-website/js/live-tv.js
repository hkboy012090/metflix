// ========================================
// METFLIX LIVE TV
// Step 4A - Channel Player
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
        "Live stream will appear here when an authorized stream is connected.";

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal = document.getElementById("playerModal");

    if (!playerModal) return;

    playerModal.classList.remove("show");

    document.body.style.overflow = "";
}


// ========================================
// CLOSE WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener("click", function (event) {

    const playerModal = document.getElementById("playerModal");

    if (!playerModal) return;

    if (event.target === playerModal) {
        closePlayer();
    }

});
