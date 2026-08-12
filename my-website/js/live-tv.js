// ========================================
// CINEMA ONE - OFFICIAL
// ========================================

function openCinemaOne() {

    window.open(
        "https://www.iwanttfc.com/",
        "_blank",
        "noopener,noreferrer"
    );
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
