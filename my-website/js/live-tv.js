// ========================================
// METFLIX LIVE TV
// DASH (.MPD) + HLS (.M3U8)
// SHAKA PLAYER + HLS.JS
// ========================================

let shakaPlayer = null;
let hlsPlayer = null;
let currentChannel = null;


// ========================================
// CHANNEL STREAMS
// ========================================
//
// IMPORTANT:
// Ilagay ang CURRENT AUTHORIZED URL
// sa bawat channel.
// Huwag gumamit ng expired session URL.
//
// ========================================

const STREAMS = {

    // ====================================
    // A2Z
    // ====================================

    "A2Z": {
        type: "mpd",
        url:http://136.239.173.2:6610/001/2/ch00000090990000001087/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BqHRrK8UUahwItHhKpXgPXKytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001176&contentid=ch00000000000000001176&videoid=ch00000090990000001087&recommendtype=0&userid=1287297673984&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=U4DB4Z0H2EXXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO
    },


    // ====================================
    // GMA
    // ====================================

    "GMA": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // JEEPNEY TV
    // ====================================

    "Jeepney TV": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // CINEMA ONE
    // ====================================

    "Cinema One": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // CINEMO
    // ====================================

    "Cinemo": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // ABANTE
    // ====================================

    "Abante": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // TFC
    // ====================================

    "TFC": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // ANC
    // ====================================

    "ANC": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // MYX
    // ====================================

    "MYX": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // TELERADYO
    // ====================================

    "TeleRadyo": {
        type: "mpd",
        url: ""
    },


    // ====================================
    // INTERNATIONAL
    // ====================================

    "BBC News Asia Pacific": {
        type: "hls",
        url: ""
    },

    "Arirang": {
        type: "hls",
        url: ""
    },

    "CGTN News Live": {
        type: "mpd",
        url: ""
    },

    "CGTN Documentaries": {
        type: "hls",
        url: ""
    },

    "Moonbug Kids": {
        type: "hls",
        url: ""
    }

};


// ========================================
// GET ELEMENTS
// ========================================

function getElements() {

    return {

        modal:
            document.getElementById("playerModal"),

        video:
            document.getElementById("liveVideo"),

        title:
            document.getElementById("playerTitle"),

        status:
            document.getElementById("playerStatus"),

        placeholder:
            document.getElementById("videoPlaceholder")

    };

}


// ========================================
// STATUS
// ========================================

function setStatus(message) {

    const elements =
        getElements();

    if (elements.status) {

        elements.status.textContent =
            message;

    }

    console.log(
        "[METFLIX LIVE TV]",
        message
    );

}


// ========================================
// OPEN PLAYER
// ========================================

function openPlayer(channelName) {

    const elements =
        getElements();

    if (!elements.modal) {

        console.error(
            "METFLIX: playerModal not found."
        );

        return;

    }

    elements.modal.style.display =
        "flex";


    if (elements.title) {

        elements.title.textContent =
            channelName;

    }


    if (elements.placeholder) {

        elements.placeholder.style.display =
            "flex";

    }

}


// ========================================
// STOP SHAKA / HLS / VIDEO
// ========================================

async function stopCurrentPlayer() {

    const elements =
        getElements();

    const video =
        elements.video;


    // ====================================
    // SHAKA
    // ====================================

    if (shakaPlayer) {

        try {

            await shakaPlayer.destroy();

        } catch (error) {

            console.warn(
                "SHAKA DESTROY ERROR:",
                error
            );

        }

        shakaPlayer =
            null;

    }


    // ====================================
    // HLS.JS
    // ====================================

    if (hlsPlayer) {

        try {

            hlsPlayer.destroy();

        } catch (error) {

            console.warn(
                "HLS DESTROY ERROR:",
                error
            );

        }

        hlsPlayer =
            null;

    }


    // ====================================
    // VIDEO
    // ====================================

    if (video) {

        try {

            video.pause();

        } catch (error) {

            console.warn(
                error
            );

        }

        video.removeAttribute(
            "src"
        );

        video.load();

    }

}


// ========================================
// SELECT CHANNEL
// ========================================

async function selectChannel(channelName) {

    console.log(
        "===================================="
    );

    console.log(
        "METFLIX CHANNEL:",
        channelName
    );

    console.log(
        "===================================="
    );


    currentChannel =
        channelName;


    openPlayer(
        channelName
    );


    const stream =
        STREAMS[channelName];


    // ====================================
    // CHECK CONFIG
    // ====================================

    if (!stream) {

        setStatus(
            "Channel configuration not found."
        );

        console.error(
            "CHANNEL NOT FOUND:",
            channelName
        );

        return;

    }


    // ====================================
    // CHECK URL
    // ====================================

    if (
        !stream.url ||
        stream.url.trim() === "" ||
        stream.url === "PASTE_A2Z_MPD_URL_HERE"
    ) {

        setStatus(
            "Stream URL is not configured for this channel."
        );

        console.warn(
            "STREAM URL NOT CONFIGURED:",
            channelName
        );

        return;

    }


    // ====================================
    // STOP PREVIOUS PLAYER
    // ====================================

    await stopCurrentPlayer();


    const elements =
        getElements();


    if (!elements.video) {

        setStatus(
            "Video element not found."
        );

        return;

    }


    setStatus(
        `Loading ${stream.type.toUpperCase()}...`
    );


    try {

        if (stream.type === "mpd") {

            await playMPD(
                stream.url
            );

        }

        else if (stream.type === "hls") {

            await playHLS(
                stream.url
            );

        }

        else {

            throw new Error(
                "Unsupported stream type: " +
                stream.type
            );

        }

    }

    catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "METFLIX STREAM ERROR"
        );

        console.error(
            error
        );

        console.error(
            "===================================="
        );


        setStatus(
            "Stream failed. See browser console for the exact error."
        );

    }

}


// ========================================
// PLAY MPD
// ========================================

async function playMPD(url) {

    const elements =
        getElements();

    const video =
        elements.video;


    // ====================================
    // CHECK SHAKA
    // ====================================

    if (
        typeof shaka === "undefined"
    ) {

        throw new Error(
            "Shaka Player library was not loaded."
        );

    }


    setStatus(
        "Initializing DASH player..."
    );


    // ====================================
    // BROWSER SUPPORT
    // ====================================

    if (
        !shaka.Player.isBrowserSupported()
    ) {

        throw new Error(
            "This browser does not support Shaka Player."
        );

    }


    // ====================================
    // CREATE SHAKA
    // ====================================

    shakaPlayer =
        new shaka.Player(
            video
        );


    // ====================================
    // ERROR LISTENER
    // ====================================

    shakaPlayer.addEventListener(
        "error",
        function(event) {

            const error =
                event.detail;


            console.error(
                "SHAKA ERROR:",
                error
            );


            console.error(
                "SHAKA ERROR CODE:",
                error.code
            );


            console.error(
                "SHAKA ERROR MESSAGE:",
                error.message
            );


            setStatus(
                `MPD error ${error.code || "UNKNOWN"}: ${
                    error.message || "Unknown error"
                }`
            );

        }
    );


    // ====================================
    // NETWORK DEBUGGING
    // ====================================

    const networkingEngine =
        shakaPlayer.getNetworkingEngine();


    if (networkingEngine) {

        networkingEngine.registerRequestFilter(
            function(type, request) {

                console.log(
                    "SHAKA REQUEST TYPE:",
                    type
                );

                console.log(
                    "SHAKA REQUEST:",
                    request.uris
                );

            }
        );

    }


    // ====================================
    // LOAD MPD
    // ====================================

    setStatus(
        "Loading MPD manifest..."
    );


    console.log(
        "Loading MPD:"
    );

    console.log(
        url
    );


    try {

        await shakaPlayer.load(
            url
        );

    }

    catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "MPD LOAD FAILED"
        );

        console.error(
            "CODE:",
            error.code
        );

        console.error(
            "CATEGORY:",
            error.category
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "FULL ERROR:",
            error
        );

        console.error(
            "===================================="
        );


        let message =
            "MPD stream failed to load.";


        if (error.code) {

            message +=
                ` Error code: ${error.code}.`;

        }


        if (error.message) {

            message +=
                ` ${error.message}`;

        }


        setStatus(
            message
        );


        throw error;

    }


    // ====================================
    // MPD SUCCESS
    // ====================================

    console.log(
        "MPD MANIFEST LOADED SUCCESSFULLY"
    );


    setStatus(
        "MPD loaded. Starting playback..."
    );


    if (elements.placeholder) {

        elements.placeholder.style.display =
            "none";

    }


    // ====================================
    // PLAY
    // ====================================

    try {

        await video.play();

        setStatus(
            "▶ LIVE STREAM PLAYING"
        );

    }

    catch (error) {

        console.warn(
            "AUTOPLAY BLOCKED:",
            error
        );


        setStatus(
            "Stream loaded. Press Play."
        );

    }

}


// ========================================
// PLAY HLS
// ========================================

async function playHLS(url) {

    const elements =
        getElements();

    const video =
        elements.video;


    setStatus(
        "Loading HLS stream..."
    );


    console.log(
        "HLS URL:",
        url
    );


    // ====================================
    // NATIVE HLS
    // ====================================

    if (
        video.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        video.src =
            url;


        video.addEventListener(
            "loadedmetadata",
            async function onLoaded() {

                video.removeEventListener(
                    "loadedmetadata",
                    onLoaded
                );


                if (elements.placeholder) {

                    elements.placeholder.style.display =
                        "none";

                }


                try {

                    await video.play();

                    setStatus(
                        "▶ LIVE STREAM PLAYING"
                    );

                }

                catch (error) {

                    console.warn(
                        "AUTOPLAY BLOCKED:",
                        error
                    );

                    setStatus(
                        "Stream loaded. Press Play."
                    );

                }

            }
        );


        video.addEventListener(
            "error",
            function() {

                console.error(
                    "NATIVE HLS ERROR:",
                    video.error
                );


                setStatus(
                    "HLS stream failed to load."
                );

            }
        );


        video.load();

        return;

    }


    // ====================================
    // CHECK HLS.JS
    // ====================================

    if (
        typeof Hls === "undefined"
    ) {

        throw new Error(
            "HLS.js library was not loaded."
        );

    }


    if (
        !Hls.isSupported()
    ) {

        throw new Error(
            "HLS is not supported by this browser."
        );

    }


    setStatus(
        "Initializing HLS.js..."
    );


    // ====================================
    // CREATE HLS
    // ====================================

    hlsPlayer =
        new Hls({

            enableWorker: true,

            lowLatencyMode: true

        });


    // ====================================
    // HLS ERROR
    // ====================================

    hlsPlayer.on(
        Hls.Events.ERROR,
        function(
            event,
            data
        ) {

            console.error(
                "HLS ERROR:",
                data
            );


            if (data.fatal) {

                setStatus(
                    `HLS fatal error: ${
                        data.details || "Unknown error"
                    }`
                );

            }

        }
    );


    // ====================================
    // HLS MANIFEST
    // ====================================

    hlsPlayer.on(
        Hls.Events.MANIFEST_PARSED,
        async function() {

            console.log(
                "HLS MANIFEST LOADED"
            );


            if (elements.placeholder) {

                elements.placeholder.style.display =
                    "none";

            }


            try {

                await video.play();

                setStatus(
                    "▶ LIVE STREAM PLAYING"
                );

            }

            catch (error) {

                console.warn(
                    "AUTOPLAY BLOCKED:",
                    error
                );


                setStatus(
                    "Stream loaded. Press Play."
                );

            }

        }
    );


    // ====================================
    // LOAD SOURCE
    // ====================================

    hlsPlayer.loadSource(
        url
    );


    hlsPlayer.attachMedia(
        video
    );

}


// ========================================
// CLOSE PLAYER
// ========================================

async function closePlayer() {

    console.log(
        "Closing player..."
    );


    await stopCurrentPlayer();


    const elements =
        getElements();


    if (elements.modal) {

        elements.modal.style.display =
            "none";

    }


    if (elements.placeholder) {

        elements.placeholder.style.display =
            "flex";

    }


    setStatus(
        "Select a channel."
    );


    currentChannel =
        null;

}


// ========================================
// CLICK OUTSIDE MODAL
// ========================================

document.addEventListener(
    "click",
    function(event) {

        const elements =
            getElements();


        if (
            elements.modal &&
            event.target === elements.modal
        ) {

            closePlayer();

        }

    }
);


// ========================================
// SEARCH
// ========================================

function openSearchModal() {

    console.log(
        "Search clicked."
    );

}


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.selectChannel =
    selectChannel;

window.closePlayer =
    closePlayer;

window.openSearchModal =
    openSearchModal;


// ========================================
// READY
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "===================================="
        );

        console.log(
            "METFLIX LIVE TV READY"
        );

        console.log(
            "SHAKA:",
            typeof shaka !== "undefined"
        );

        console.log(
            "HLS.JS:",
            typeof Hls !== "undefined"
        );

        console.log(
            "===================================="
        );

    }
);
