console.log("METFLIX LIVE TV JS LOADED");

function selectChannel(channelName) {

    alert("Napindot ang " + channelName);

    const playerModal = document.getElementById("playerModal");
    const playerTitle = document.getElementById("playerTitle");

    if (!playerModal) {
        alert("ERROR: playerModal not found!");
        return;
    }

    playerTitle.textContent = channelName;

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";
}

function closePlayer() {

    const playerModal = document.getElementById("playerModal");

    if (!playerModal) return;

    playerModal.classList.remove("show");

    document.body.style.overflow = "";
}
