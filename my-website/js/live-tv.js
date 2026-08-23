// ========================================
// METFLIX LIVE TV
// ABANTE HLS DIAGNOSTIC PLAYER
// ========================================

const ABANTE_STREAM =
    "https://amg19223-amg19223c12-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c12-amgplt0352/playlist.m3u8";

let hls = null;


// ========================================
// SELECT CHANNEL
// ========================================

async function selectChannel(channelName) {

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
        console.error("Player elements not found.");
        return;
    }


    // OPEN MODAL

    playerTitle.textContent = channelName;

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";


    // STOP PREVIOUS STREAM

    stopStream();


    // ONLY ABANTE HAS STREAM

    if (channelName !== "Abante") {

        playerStatus.textContent =
            channelName +
            " live stream is not configured yet.";

        if (placeholder) {
            placeholder.style.display = "flex";
        }

        return;
    }


    // ABANTE

    if (placeholder) {
        placeholder.style.display = "flex";
    }

    video.classList.remove("active");

    playerStatus.textContent =
        "Loading Abante player...";


    console.log("================================");
    console.log("METFLIX ABANTE PLAYER");
    console.log("Stream:", ABANTE_STREAM);
    console.log("================================");


    // LOAD HLS.JS

    try {

        await loadHlsJS();

    } catch (error) {

        console.error("HLS.JS LOAD ERROR:", error);

        playerStatus.textContent =
            "ERROR: HLS.js failed to load.";

        return;
    }


    // START PLAYBACK

    startAbante(video, playerStatus, placeholder);
}


// ========================================
// LOAD HLS.JS
// ========================================

function loadHlsJS() {

    return new Promise((resolve, reject) => {

        if (window.Hls) {

            console.log("HLS.js already loaded.");

            resolve();

            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/hls.js@1";


        script.onload = function () {

            console.log(
                "HLS.js loaded successfully."
            );

            resolve();

        };


        script.onerror = function () {

            console.error(
                "Could not load HLS.js."
            );

            reject(
                new Error("HLS.js load failed")
            );

        };


        document.head.appendChild(script);

    });
}


// ========================================
// START ABANTE
// ========================================

function startAbante(
    video,
    playerStatus,
    placeholder
) {


    // ====================================
    // HLS.JS
    // ====================================

    if (
        window.Hls &&
        Hls.isSupported()
    ) {

        console.log(
            "HLS.js is supported."
        );


        hls = new Hls({

            debug: true,

            enableWorker: true,

            lowLatencyMode: true,

            backBufferLength: 30

        });


        hls.attachMedia(video);


        hls.on(
            Hls.Events.MEDIA_ATTACHED,
            function () {

                console.log(
                    "Video element attached."
                );

                playerStatus.textContent =
                    "Loading Abante stream...";

                hls.loadSource(
                    ABANTE_STREAM
                );

            }
        );


        // ====================================
        // MANIFEST LOADED
        // ====================================

        hls.on(
            Hls.Events.MANIFEST_PARSED,
            function (event, data) {

                console.log(
                    "================================"
                );

                console.log(
                    "ABANTE MANIFEST LOADED"
                );

                console.log(
                    "Levels:",
                    data.levels
                );

                console.log(
                    "================================"
                );


                playerStatus.textContent =
                    "Abante stream loaded. Starting video...";


                if (placeholder) {
                    placeholder.style.display =
                        "none";
                }


                video.classList.add("active");


                video.play()
                    .then(function () {

                        console.log(
                            "ABANTE PLAYING"
                        );

                    })
                    .catch(function (error) {

                        console.warn(
                            "AUTOPLAY BLOCKED:",
                            error
                        );

                        playerStatus.textContent =
                            "Stream loaded. Press ▶ Play.";

                    });

            }
        );


        // ====================================
        // LEVEL LOADED
        // ====================================

        hls.on(
            Hls.Events.LEVEL_LOADED,
            function (event, data) {

                console.log(
                    "LEVEL LOADED:",
                    data
                );

            }
        );


        // ====================================
        // FRAGMENT LOADED
        // ====================================

        hls.on(
            Hls.Events.FRAG_LOADED,
            function (event, data) {

                console.log(
                    "FRAGMENT LOADED:",
                    data.frag
                );

            }
        );


        // ====================================
        // HLS ERROR
        // ====================================

        hls.on(
            Hls.Events.ERROR,
            function (
                event,
                data
            ) {

                console.error(
                    "================================"
                );

                console.error(
                    "HLS ERROR"
                );

                console.error(
                    "Type:",
                    data.type
                );

                console.error(
                    "Details:",
                    data.details
                );

                console.error(
                    "Fatal:",
                    data.fatal
                );

                console.error(
                    "Response:",
                    data.response
                );

                console.error(
                    "================================"
                );


                // NETWORK ERROR

                if (
                    data.type ===
                    Hls.ErrorTypes.NETWORK_ERROR
                ) {

                    playerStatus.textContent =
                        "NETWORK ERROR: Stream cannot be accessed.";

                    return;
                }


                // MEDIA ERROR

                if (
                    data.type ===
                    Hls.ErrorTypes.MEDIA_ERROR
                ) {

                    playerStatus.textContent =
                        "MEDIA ERROR: Stream format/codec problem.";

                    return;
                }


                // OTHER ERROR

                if (data.fatal) {

                    playerStatus.textContent =
                        "STREAM ERROR: " +
                        data.details;

                }

            }
        );


        return;
    }


    // ====================================
    // NATIVE HLS
    // ====================================

    if (
        video.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        console.log(
            "Browser has native HLS support."
        );


        playerStatus.textContent =
            "Using native HLS player...";


        video.src =
            ABANTE_STREAM;


        video.addEventListener(
            "loadedmetadata",
            function onLoaded() {

                console.log(
                    "NATIVE HLS METADATA LOADED"
                );


                if (placeholder) {
                    placeholder.style.display =
                        "none";
                }


                video.classList.add("active");


                playerStatus.textContent =
                    "Abante stream loaded.";


                video.play()
                    .catch(function (error) {

                        console.warn(
                            "Autoplay blocked:",
                            error
                        );

                        playerStatus.textContent =
                            "Stream loaded. Press ▶ Play.";

                    });


                video.removeEventListener(
                    "loadedmetadata",
                    onLoaded
                );

            }
        );


        video.addEventListener(
            "error",
            function () {

                console.error(
                    "NATIVE VIDEO ERROR:",
                    video.error
                );


                playerStatus.textContent =
                    "NATIVE HLS ERROR: " +
                    getVideoError(video);

            }
        );


        return;
    }


    // ====================================
    // NOT SUPPORTED
    // ====================================

    console.error(
        "Browser does not support HLS."
    );


    playerStatus.textContent =
        "This browser does not support HLS playback.";

}


// ========================================
// VIDEO ERROR DESCRIPTION
// ========================================

function getVideoError(video) {

    if (!video.error) {
        return "Unknown video error.";
    }


    switch (video.error.code) {

        case 1:
            return "MEDIA_ERR_ABORTED";

        case 2:
            return "MEDIA_ERR_NETWORK";

        case 3:
            return "MEDIA_ERR_DECODE";

        case 4:
            return "MEDIA_ERR_SRC_NOT_SUPPORTED";

        default:
            return "Unknown media error.";

    }
}


// ========================================
// STOP STREAM
// ========================================

function stopStream() {

    const video =
        document.getElementById("liveVideo");


    if (hls) {

        console.log(
            "Destroying HLS instance..."
        );

        try {
            hls.destroy();
        } catch (error) {
            console.error(error);
        }

        hls = null;
    }


    if (video) {

        video.pause();

        video.removeAttribute("src");

        video.load();

        video.classList.remove("active");

    }


    const placeholder =
        document.getElementById(
            "videoPlaceholder"
        );


    if (placeholder) {

        placeholder.style.display =
            "flex";

    }

}


// ========================================
// CLOSE PLAYER
// ========================================

function closePlayer() {

    const playerModal =
        document.getElementById("playerModal");


    if (!playerModal) {
        return;
    }


    stopStream();


    playerModal.classList.remove("show");

    document.body.style.overflow = "";


    const playerStatus =
        document.getElementById(
            "playerStatus"
        );


    if (playerStatus) {

        playerStatus.textContent =
            "Live stream will appear here.";

    }

}


// ========================================
// CLICK OUTSIDE PLAYER
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const playerModal =
            document.getElementById(
                "playerModal"
            );


        if (!playerModal) {
            return;
        }


        if (
            event.target ===
            playerModal
        ) {

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
