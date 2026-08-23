// ========================================
// METFLIX LIVE TV
// ABANTE HLS PLAYER
// ========================================


// ========================================
// ABANTE STREAM
// ========================================

const ABANTE_STREAM =
    "https://amg19223-amg19223c12-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c12-amgplt0352/playlist.m3u8";


// ========================================
// HLS INSTANCE
// ========================================

let hls = null;


// ========================================
// LOAD HLS.JS
// ========================================

function loadHlsJS() {

    return new Promise((resolve, reject) => {

        // Hls.js already loaded
        if (window.Hls) {
            resolve();
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/hls.js@latest";

        script.onload = () => {
            console.log("HLS.js loaded.");
            resolve();
        };

        script.onerror = () => {
            console.error("Failed to load HLS.js.");
            reject(new Error("HLS.js failed to load."));
        };

        document.head.appendChild(script);

    });

}


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


    if (!playerModal) {
        console.error("Player modal not found.");
        return;
    }


    if (!video) {
        console.error("Video element not found.");
        return;
    }


    // ========================================
    // OPEN PLAYER
    // ========================================

    playerTitle.textContent = channelName;

    playerModal.classList.add("show");

    document.body.style.overflow = "hidden";


    // ========================================
    // STOP PREVIOUS STREAM
    // ========================================

    stopStream();


    // ========================================
    // ABANTE
    // ========================================

    if (channelName === "Abante") {

        if (placeholder) {
            placeholder.style.display = "flex";
        }

        video.classList.remove("active");

        playerStatus.textContent =
            "Connecting to Abante live stream...";


        try {

            await loadHlsJS();

            playAbante(video, playerStatus, placeholder);

        } catch (error) {

            console.error(error);

            playerStatus.textContent =
                "Unable to load the live player.";

        }

        return;
    }


    // ========================================
    // OTHER CHANNELS
    // ========================================

    if (placeholder) {
        placeholder.style.display = "flex";
    }

    video.classList.remove("active");

    playerStatus.textContent =
        channelName + " live stream is not configured yet.";

}


// ========================================
// PLAY ABANTE
// ========================================

function playAbante(video, playerStatus, placeholder) {

    // ========================================
    // HLS.JS SUPPORTED
    // ========================================

    if (window.Hls && Hls.isSupported()) {

        hls = new Hls({

            enableWorker: true,

            lowLatencyMode: true,

            backBufferLength: 30

        });


        hls.loadSource(ABANTE_STREAM);

        hls.attachMedia(video);


        // ========================================
        // MANIFEST LOADED
        // ========================================

        hls.on(Hls.Events.MANIFEST_PARSED, function () {

            console.log("Abante stream loaded.");

            if (placeholder) {
                placeholder.style.display = "none";
            }

            video.classList.add("active");

            playerStatus.textContent =
                "Abante Live";


            video.play().catch(function (error) {

                console.log(
                    "Autoplay blocked. User can press play.",
                    error
                );

            });

        });


        // ========================================
        // HLS ERROR
        // ========================================

        hls.on(Hls.Events.ERROR, function (
            event,
            data
        ) {

            console.error(
                "HLS Error:",
                data
            );


            if (data.fatal) {

                switch (data.type) {

                    case Hls.ErrorTypes.NETWORK_ERROR:

                        playerStatus.textContent =
                            "Network error. Retrying...";

                        hls.startLoad();

                        break;


                    case Hls.ErrorTypes.MEDIA_ERROR:

                        playerStatus.textContent =
                            "Media error. Recovering...";

                        hls.recoverMediaError();

                        break;


                    default:

                        playerStatus.textContent =
                            "Unable to play Abante stream.";

                        stopStream();

                        break;

                }

            }

        });


        return;
    }


    // ========================================
    // NATIVE HLS
    // Safari / iOS
    // ========================================

    if (
        video.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        video.src = ABANTE_STREAM;

       
