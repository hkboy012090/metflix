// ========================================
// METFLIX LIVE TV
// Step 4B - Live Video Player
// ========================================

const channelStreams = {

    "Cinema One": "",
    "Cinemo": ""

};


// ========================================
// SELECT CHANNEL
// ========================================

function selectChannel(channelName) {

    const playerModal = document.getElementById("playerModal");
    const playerTitle = document.getElementById("playerTitle");
    const playerStatus = document.getElementById("playerStatus");

    const liveVideo = document.getElementById("liveVideo");
    const videoPlaceholder =
        document.getElementById("videoPlaceholder");


    if (!playerModal) {
        console.error("Player modal not found.");
        return;
    }


    playerTitle.textContent = channelName;


    // Kunin ang stream URL
    const streamUrl = channelStreams[channelName];


    // Walang stream URL
    if (!streamUrl) {

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

    }


    // May stream URL
    else {

        if (liveVideo) {

            liveVideo.src = streamUrl;

            liveVideo.classList.add("active");

            if (videoPlaceholder) {
                videoPlaceholder.style.display = "none";
            }

            liveVideo.play().catch(error => {
                console.log("Autoplay blocked:", error);
            });

        }

    }


    // Open player
    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal =
        document.getElementById("playerModal");

    const liveVideo =
        document.getElementById("liveVideo");


    if (!playerModal) return;


    if (liveVideo) {

        liveVideo.pause();

        liveVideo.removeAttribute("src");

        liveVideo.load();

        liveVideo.classList.remove("active");

    }


    const videoPlaceholder =
        document.getElementById("videoPlaceholder");

    if (videoPlaceholder) {
        videoPlaceholder.style.display = "flex";
    }


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
