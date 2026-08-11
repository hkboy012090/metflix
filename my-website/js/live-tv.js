// ========================================
// METFLIX LIVE TV
// Step 4C - Cinema One HLS
// ========================================

const channelStreams = {

    "Cinema One":
        "https://cinemaone-abscbn-ono.amagi.tv/index.m3u8",

    "Cinemo": ""

};

let hls = null;


// ========================================
// SELECT CHANNEL
// ========================================

function selectChannel(channelName) {

    const playerModal =
        document.getElementById("playerModal");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerStatus =
        document.getElementById("playerStatus");

    const liveVideo =
        document.getElementById("liveVideo");

    const videoPlaceholder =
        document.getElementById("videoPlaceholder");


    if (!playerModal || !liveVideo) {
        console.error("Player elements not found.");
        return;
    }


    playerTitle.textContent = channelName;

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";


    // Stop previous stream
    if (hls) {
        hls.destroy();
        hls = null;
    }

    liveVideo.pause();
    liveVideo.removeAttribute("src");
    liveVideo.load();

    liveVideo.classList.remove("active");

    if (videoPlaceholder) {
        videoPlaceholder.style.display = "flex";
    }


    const streamUrl =
        channelStreams[channelName];


    // No stream
    if (!streamUrl) {

        playerStatus.textContent =
            "No authorized live stream connected yet.";

        return;
    }


    // Loading message
    playerStatus.textContent =
        "Connecting to live stream...";


    // ========================================
    // HLS.JS
    // ========================================

    if (window.Hls && Hls.isSupported()) {

        hls = new Hls();

        hls.loadSource(streamUrl);

        hls.attachMedia(liveVideo);


        hls.on(Hls.Events.MANIFEST_PARSED, function () {

            console.log(
                "Cinema One HLS stream loaded."
            );

            liveVideo.classList.add("active");

            if (videoPlaceholder) {
                videoPlaceholder.style.display = "none";
            }

            liveVideo.play().catch(function(error) {

                console.log(
                    "Autoplay blocked:",
                    error
                );

            });

        });


        hls.on(Hls.Events.ERROR, function (
            event,
            data
        ) {

            console.error(
                "HLS Error:",
                data
            );

            if (data.fatal) {

                playerStatus.textContent =
                    "Unable to play this live stream.";

                liveVideo.classList.remove("active");

                if (videoPlaceholder) {
                    videoPlaceholder.style.display =
                        "flex";
                }

            }

        });

    }


    // ========================================
    // NATIVE HLS
    // ========================================

    else if (
        liveVideo.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        liveVideo.src = streamUrl;

        liveVideo.classList.add("active");

        if (videoPlaceholder) {
            videoPlaceholder.style.display = "none";
        }

        liveVideo.play().catch(function(error) {

            console.log(
                "Autoplay blocked:",
                error
            );

        });

    }


    // ========================================
    // NOT SUPPORTED
    // ========================================

    else {

        playerStatus.textContent =
            "This browser does not support HLS live streaming.";

    }

}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal =
        document.getElementById("playerModal");

    const liveVideo =
        document.getElementById("liveVideo");

    const videoPlaceholder =
        document.getElementById("videoPlaceholder");


    if (hls) {
        hls.destroy();
        hls = null;
    }


    if (liveVideo) {

        liveVideo.pause();

        liveVideo.removeAttribute("src");

        liveVideo.load();

        liveVideo.classList.remove("active");

    }


    if (videoPlaceholder) {
        videoPlaceholder.style.display = "flex";
    }


    if (playerModal) {
        playerModal.classList.remove("show");
    }


    document.body.style.overflow = "";

}


// ========================================
// CLICK OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function(event) {

        const playerModal =
            document.getElementById("playerModal");

        if (!playerModal) return;

        if (event.target === playerModal) {
            closePlayer();
        }

    }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closePlayer();
        }

    }
);
