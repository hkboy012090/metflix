// ========================================
// METFLIX LIVE TV
// HLS CHANNEL PLAYER
// ========================================

const CHANNELS = {

    "Cinema One":
        "https://cinemaone-abscbn-ono.amagi.tv/index.m3u8"

};


// ========================================
// HLS INSTANCE
// ========================================

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

    const video =
        document.getElementById("liveVideo");

    const placeholder =
        document.getElementById("videoPlaceholder");


    if (!playerModal || !video) {

        console.error("Live TV player elements not found.");

        return;
    }


    // Get stream URL
    const streamURL = CHANNELS[channelName];


    // Show modal
    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";


    // Set title
    playerTitle.textContent = channelName;


    // Reset player
    video.pause();

    video.removeAttribute("src");

    video.load();

    video.classList.remove("active");

    placeholder.style.display = "flex";

    playerStatus.textContent =
        "Connecting to live stream...";


    // Destroy previous HLS
    if (hls) {

        hls.destroy();

        hls = null;
    }


    // Check stream
    if (!streamURL) {

        playerStatus.textContent =
            "No stream configured for this channel.";

        return;
    }


    // ========================================
    // NATIVE HLS
    // Safari / iPhone / Some browsers
    // ========================================

    if (video.canPlayType("application/vnd.apple.mpegurl")) {

        console.log("Using native HLS.");

        video.src = streamURL;

        video.addEventListener("loadedmetadata", function () {

            video.classList.add("active");

            placeholder.style.display = "none";

            video.play().catch(function (error) {

                console.warn(
                    "Autoplay blocked:",
                    error
                );

                playerStatus.textContent =
                    "Tap the video to start playback.";
            });

        }, { once: true });


        video.addEventListener("error", function () {

            console.error(
                "Native video error:",
                video.error
            );

            video.classList.remove("active");

            placeholder.style.display = "flex";

            playerStatus.textContent =
                "Unable to play this live stream.";

        }, { once: true });


        return;
    }


    // ========================================
    // HLS.JS
    // Chrome / Android / Other browsers
    // ========================================

    if (typeof Hls === "undefined") {

        console.error("HLS.js is not loaded.");

        playerStatus.textContent =
            "HLS player failed to load.";

        return;
    }


    if (!Hls.isSupported()) {

        console.error(
            "HLS is not supported by this browser."
        );

        playerStatus.textContent =
            "This browser does not support this live stream.";

        return;
    }


    console.log("Using HLS.js.");

    hls = new Hls({

        enableWorker: true,

        lowLatencyMode: true,

        backBufferLength: 30

    });


    hls.loadSource(streamURL);

    hls.attachMedia(video);


    // ========================================
    // HLS READY
    // ========================================

    hls.on(
        Hls.Events.MANIFEST_PARSED,
        function () {

            console.log(
                "HLS manifest loaded successfully."
            );

            video.classList.add("active");

            placeholder.style.display = "none";


            video.play().catch(function (error) {

                console.warn(
                    "Autoplay blocked:",
                    error
                );

                playerStatus.textContent =
                    "Tap the video to start playback.";

            });

        }
    );


    // ========================================
    // HLS ERROR
    // ========================================

    hls.on(
        Hls.Events.ERROR,
        function (event, data) {

            console.error(
                "HLS ERROR:",
                data
            );


            if (!data.fatal) {

                return;
            }


            video.classList.remove("active");

            placeholder.style.display = "flex";


            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {

                playerStatus.textContent =
                    "Network error: unable to access the live stream.";

                console.error(
                    "HLS NETWORK ERROR:",
                    data
                );


                // Try recovering
                hls.startLoad();

            }

            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {

                playerStatus.textContent =
                    "Media error: the stream cannot be decoded.";

                console.error(
                    "HLS MEDIA ERROR:",
                    data
                );


                hls.recoverMediaError();

            }

            else {

                playerStatus.textContent =
                    "Unable to play this live stream.";

                console.error(
                    "Fatal HLS error:",
                    data
                );

                hls.destroy();

                hls = null;
            }

        }
    );

}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal =
        document.getElementById("playerModal");

    const video =
        document.getElementById("liveVideo");


    if (video) {

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.classList.remove("active");
    }


    if (hls) {

        hls.destroy();

        hls = null;
    }


    if (playerModal) {

        playerModal.classList.remove("show");
    }


    document.body.style.overflow = "";

}


// ========================================
// CLICK OUTSIDE MODAL
// ========================================

document.addEventListener(
    "click",
    function (event) {

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
    function (event) {

        if (event.key === "Escape") {

            closePlayer();

        }

    }
);
