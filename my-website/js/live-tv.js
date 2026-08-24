// ========================================
// METFLIX LIVE TV
// MPEG-DASH (.mpd) + HLS (.m3u8)
// ========================================

let currentPlayer = null;
let currentHls = null;
let currentChannel = null;


// ========================================
// CHANNEL DATABASE
// ========================================
//
// IMPORTANT:
// Ilagay dito ang AUTHORIZED stream URLs mo.
//
// type:
// "mpd" = MPEG-DASH / Shaka Player
// "hls" = M3U8 / HLS.js
//
// Huwag gumamit ng expired/session URL kung
// hindi na valid o hindi ka authorized.
//

const CHANNELS = {

    // ====================================
    // MPEG-DASH CHANNELS
    // ====================================

    "A2Z": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_A2Z_MPD_URL_HERE"
    },

    "DepEd TV": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_DEPED_MPD_URL_HERE"
    },

    "ALLTV": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_ALLTV_MPD_URL_HERE"
    },

    "Jeepney TV": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_JEEPNEY_MPD_URL_HERE"
    },

    "Cartoonito": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_CARTOONITO_MPD_URL_HERE"
    },

    "TV Maria": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_TVMARIA_MPD_URL_HERE"
    },

    "Tagalized Movie Channel": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_TAGALIZED_MPD_URL_HERE"
    },

    "GMA": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_GMA_MPD_URL_HERE"
    },

    "INCTV": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_INCTV_MPD_URL_HERE"
    },

    "CGTN News Live": {
        type: "mpd",
        url: "PASTE_YOUR_AUTHORIZED_CGTN_MPD_URL_HERE"
    },


    // ====================================
    // HLS CHANNELS
    // ====================================

    "FilAm TV Network": {
        type: "hls",
        url: "https://streams.comclark.com/pknsd/filamtv/playlist.m3u8"
    },

    "Moonbug Kids": {
        type: "hls",
        url: "https://moonbug-rokuus.amagi.tv/playlist.m3u8"
    },

    "Vegas Life TV": {
        type: "hls",
        url: "https://streams.comclark.com/pknsd/vegaslifetv/playlist.m3u8"
    },

    "Mindanow Network TV": {
        type: "hls",
        url: "https://streams.comclark.com/overlay/mindanow/playlist.m3u8"
    },

    "BBC News Asia Pacific": {
        type: "hls",
        url: "https://cdn4.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8"
    },

    "CLTV 36": {
        type: "hls",
        url: "https://live.cltv36.tv:5443/LiveApp/streams/cltvlive.m3u8"
    },

    "Arirang": {
        type: "hls",
        url: "https://amdlive-ch03-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8"
    },

    "Bloomberg Asia": {
        type: "hls",
        url: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8"
    },

    "CGTN Documentaries": {
        type: "hls",
        url: "https://english-livebkali.cgtn.com/live/doccgtn_1.m3u8"
    },

    "Outdoor Channel": {
        type: "hls",
        url: "https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg00718-outdoorchannela-outdoortvnz-samsungnz/playlist.m3u8"
    },

    "Thrillers": {
        type: "hls",
        url: "https://amc-rushbyamc-1-us.vizio.wurl.tv/playlist.m3u8"
    },

    "Bein Sports Xtra": {
        type: "hls",
        url: "https://amg01334-beinsportsllc-beinxtra-localnow-kcy6r.amagi.tv/playlist.m3u8"
    },

    "MovieSphere": {
        type: "hls",
        url: "https://moviesphereuk-samsunguk.amagi.tv/playlist.m3u8"
    },

    "TFC GUAM": {
        type: "hls",
        url: "https://tfcguam-abscbn-ono.amagi.tv/index.m3u8"
    },

    "3ABN Kids": {
        type: "hls",
        url: "https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8"
    },

    "Blues TV": {
        type: "hls",
        url: "https://2-fss-2.streamhoster.com/pl_138/205510-3094608-1/playlist.m3u8"
    },

    "Japanim TV": {
        type: "hls",
        url: "https://foxkidstv.be:3369/stream/play.m3u8"
    },

    "Magic Kids": {
        type: "hls",
        url: "https://magicstream.ddns.net/magicstream/stream.m3u8"
    },

    "Persiana Junior": {
        type: "hls",
        url: "https://junhls.persiana.live/hls/stream.m3u8"
    },

    "Yahoo Finance": {
        type: "hls",
        url: "https://yahoo-samsung.amagi.tv/playlist.m3u8"
    },

    "EWTN Europe": {
        type: "hls",
        url: "https://cdn3.wowza.com/1/T2NXeHF6UGlGbHY3/WFluRldQ/hls/live/playlist.m3u8"
    },

    "CNN": {
        type: "hls",
        url: "https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8"
    }

};


// ========================================
// ELEMENTS
// ========================================

function getPlayerElements() {

    return {

        modal:
            document.getElementById("playerModal"),

        video:
            document.getElementById("liveVideo"),

        title:
            document.getElementById("playerTitle"),

        placeholder:
            document.getElementById("videoPlaceholder"),

        status:
            document.getElementById("playerStatus"),

        loading:
            document.getElementById("videoLoading")

    };

}


// ========================================
// SHOW PLAYER
// ========================================

function showPlayer() {

    const elements =
        getPlayerElements();

    if (!elements.modal) return;

    elements.modal.style.display = "flex";

}


// ========================================
// HIDE PLACEHOLDER
// ========================================

function hidePlaceholder() {

    const elements =
        getPlayerElements();

    if (!elements.placeholder) return;

    elements.placeholder.style.display = "none";

}


// ========================================
// SHOW PLACEHOLDER
// ========================================

function showPlaceholder(message) {

    const elements =
        getPlayerElements();

    if (elements.placeholder) {

        elements.placeholder.style.display =
            "flex";

    }

    if (elements.status) {

        elements.status.textContent =
            message;

    }

}


// ========================================
// LOADING
// ========================================

function setLoading(isLoading) {

    const elements =
        getPlayerElements();

    if (!elements.loading) return;

    elements.loading.style.display =
        isLoading
            ? "flex"
            : "none";

}


// ========================================
// STATUS
// ========================================

function setStatus(message) {

    const elements =
        getPlayerElements();

    if (elements.status) {

        elements.status.textContent =
            message;

    }

}


// ========================================
// RESET VIDEO
// ========================================

function resetVideo() {

    const elements =
        getPlayerElements();

    const video =
        elements.video;

    if (!video) return;

    try {

        video.pause();

    } catch (error) {

        console.warn(
            "VIDEO PAUSE ERROR:",
            error
        );

    }

    video.removeAttribute("src");

    video.load();

}


// ========================================
// DESTROY PLAYERS
// ========================================

async function destroyPlayers() {

    // ====================================
    // SHAKA
    // ====================================

    if (currentPlayer) {

        try {

            await currentPlayer.destroy();

        } catch (error) {

            console.warn(
                "SHAKA DESTROY ERROR:",
                error
            );

        }

        currentPlayer = null;

    }


    // ====================================
    // HLS.JS
    // ====================================

    if (currentHls) {

        try {

            currentHls.destroy();

        } catch (error) {

            console.warn(
                "HLS DESTROY ERROR:",
                error
            );

        }

        currentHls = null;

    }

}


// ========================================
// PLAY MPEG-DASH
// ========================================

async function playMPD(url) {

    const elements =
        getPlayerElements();

    const video =
        elements.video;

    if (!video) {

        console.error(
            "METFLIX: liveVideo not found."
        );

        return;

    }


    if (
        typeof shaka === "undefined" ||
        !shaka.Player
    ) {

        setStatus(
            "Shaka Player failed to load."
        );

        console.error(
            "METFLIX: Shaka Player unavailable."
        );

        return;

    }


    if (
        !shaka.Player.isBrowserSupported()
    ) {

        setStatus(
            "This browser does not support MPEG-DASH."
        );

        return;

    }


    console.log(
        "METFLIX: Loading MPD:",
        url
    );


    try {

        currentPlayer =
            new shaka.Player(video);


        currentPlayer.addEventListener(
            "error",
            function (event) {

                console.error(
                    "SHAKA ERROR:",
                    event.detail
                );

                const errorCode =
                    event.detail &&
                    event.detail.code
                        ? event.detail.code
                        : "UNKNOWN";

                setLoading(false);

                setStatus(
                    "MPD playback error: " +
                    errorCode
                );

                showPlaceholder(
                    "Unable to play this MPD stream."
                );

            }
        );


        await currentPlayer.load(url);


        console.log(
            "METFLIX: MPD loaded successfully."
        );


        setLoading(false);

        hidePlaceholder();


        try {

            await video.play();

        } catch (playError) {

            console.warn(
                "AUTOPLAY BLOCKED:",
                playError
            );

            setStatus(
                "Press the Play button to start the stream."
            );

        }

    } catch (error) {

        console.error(
            "MPD LOAD ERROR:",
            error
        );

        setLoading(false);

        showPlaceholder(
            "MPD stream could not be loaded."
        );

    }

}


// ========================================
// PLAY HLS
// ========================================

async function playHLS(url) {

    const elements =
        getPlayerElements();

    const video =
        elements.video;

    if (!video) {

        console.error(
            "METFLIX: liveVideo not found."
        );

        return;

    }


    console.log(
        "METFLIX: Loading HLS:",
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

        console.log(
            "METFLIX: Using native HLS."
        );


        video.src =
            url;


        video.addEventListener(
            "loadedmetadata",
            function onLoaded() {

                video.removeEventListener(
                    "loadedmetadata",
                    onLoaded
                );

                setLoading(false);

                hidePlaceholder();


                video.play()
                    .catch(error => {

                        console.warn(
                            "HLS AUTOPLAY BLOCKED:",
                            error
                        );

                        setStatus(
                            "Press Play to start the stream."
                        );

                    });

            }
        );


        video.addEventListener(
            "error",
            function () {

                console.error(
                    "NATIVE HLS ERROR:",
                    video.error
                );

                setLoading(false);

                showPlaceholder(
                    "Unable to play this HLS stream."
                );

            },
            {
                once: true
            }
        );


        return;

    }


    // ====================================
    // HLS.JS
    // ====================================

    if (
        typeof Hls === "undefined"
    ) {

        setLoading(false);

        showPlaceholder(
            "HLS.js failed to load."
        );

        console.error(
            "METFLIX: HLS.js unavailable."
        );

        return;

    }


    if (
        Hls.isSupported()
    ) {

        console.log(
            "METFLIX: Using HLS.js."
        );


        currentHls =
            new Hls({

                enableWorker: true,

                lowLatencyMode: true,

                backBufferLength: 90

            });


        currentHls.loadSource(url);

        currentHls.attachMedia(video);


        currentHls.on(
            Hls.Events.MANIFEST_PARSED,
            function () {

                console.log(
                    "METFLIX: HLS manifest loaded."
                );


                setLoading(false);

                hidePlaceholder();


                video.play()
                    .catch(error => {

                        console.warn(
                            "HLS AUTOPLAY BLOCKED:",
                            error
                        );

                        setStatus(
                            "Press Play to start the stream."
                        );

                    });

            }
        );


        currentHls.on(
            Hls.Events.ERROR,
            function (
                event,
                data
            ) {

                console.error(
                    "HLS ERROR:",
                    data
                );


                if (
                    data.fatal
                ) {

                    setLoading(false);


                    if (
                        data.type ===
                        Hls.ErrorTypes.NETWORK_ERROR
                    ) {

                        showPlaceholder(
                            "Network error. The stream may be unavailable."
                        );

                    } else if (
                        data.type ===
                        Hls.ErrorTypes.MEDIA_ERROR
                    ) {

                        showPlaceholder(
                            "Media error. Trying to recover..."
                        );


                        try {

                            currentHls.recoverMediaError();

                        } catch (error) {

                            console.error(
                                "HLS RECOVERY ERROR:",
                                error
                            );

                        }

                    } else {

                        showPlaceholder(
                            "HLS stream could not be played."
                        );

                        try {

                            currentHls.destroy();

                        } catch (error) {

                            console.error(
                                "HLS DESTROY ERROR:",
                                error
                            );

                        }

                        currentHls = null;

                    }

                }

            }
        );


        return;

    }


    setLoading(false);

    showPlaceholder(
        "This browser does not support HLS."
    );

}


// ========================================
// SELECT CHANNEL
// ========================================

async function selectChannel(channelName) {

    console.log(
        "METFLIX CHANNEL SELECTED:",
        channelName
    );


    const elements =
        getPlayerElements();


    const channel =
        CHANNELS[channelName];


    // ====================================
    // CHECK CHANNEL
    // ====================================

    if (!channel) {

        console.warn(
            "CHANNEL NOT FOUND:",
            channelName
        );


        showPlayer();

        if (elements.title) {

            elements.title.textContent =
                channelName;

        }


        setLoading(false);

        showPlaceholder(
            "This channel is not configured yet."
        );

        return;

    }


    // ====================================
    // CHECK URL
    // ====================================

    if (
        !channel.url ||
        channel.url.startsWith(
            "PASTE_YOUR_"
        )
    ) {

        console.warn(
            "NO STREAM URL:",
            channelName
        );


        showPlayer();

        if (elements.title) {

            elements.title.textContent =
                channelName;

        }


        setLoading(false);

        showPlaceholder(
            "Stream URL is not configured for this channel."
        );

        return;

    }


    currentChannel =
        channelName;


    // ====================================
    // OPEN MODAL
    // ====================================

    showPlayer();


    if (elements.title) {

        elements.title.textContent =
            channelName;

    }


    // ====================================
    // RESET UI
    // ====================================

    showPlaceholder(
        "Preparing live stream..."
    );

    setLoading(true);


    // ====================================
    // STOP PREVIOUS PLAYER
    // ====================================

    await destroyPlayers();

    resetVideo();


    // ====================================
    // DETERMINE TYPE
    // ====================================

    const type =
        String(channel.type)
            .toLowerCase();


    console.log(
        "CHANNEL:",
        channelName
    );

    console.log(
        "TYPE:",
        type
    );


    // ====================================
    // MPD
    // ====================================

    if (
        type === "mpd" ||
        channel.url
            .toLowerCase()
            .includes(".mpd")
    ) {

        await playMPD(
            channel.url
        );

        return;

    }


    // ====================================
    // HLS
    // ====================================

    if (
        type === "hls" ||
        channel.url
            .toLowerCase()
            .includes(".m3u8")
    ) {

        await playHLS(
            channel.url
        );

        return;

    }


    // ====================================
    // UNKNOWN
    // ====================================

    setLoading(false);

    showPlaceholder(
        "Unsupported stream format."
    );

}


// ========================================
// CLOSE PLAYER
// ========================================

async function closePlayer() {

    console.log(
        "METFLIX: Closing player."
    );


    const elements =
        getPlayerElements();


    await destroyPlayers();

    resetVideo();


    if (elements.modal) {

        elements.modal.style.display =
            "none";

    }


    if (elements.title) {

        elements.title.textContent =
            "Live TV";

    }


    if (elements.status) {

        elements.status.textContent =
            "Select a channel to start watching.";

    }


    if (elements.placeholder) {

        elements.placeholder.style.display =
            "flex";

    }


    if (elements.loading) {

        elements.loading.style.display =
            "none";

    }


    currentChannel =
        null;

}


// ========================================
// MODAL CLICK OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const elements =
            getPlayerElements();

        const modal =
            elements.modal;

        const box =
            document.querySelector(
                ".player-box"
            );


        if (
            !modal ||
            modal.style.display !== "flex"
        ) {

            return;

        }


        if (
            event.target === modal
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

        if (
            event.key === "Escape"
        ) {

            const elements =
                getPlayerElements();

            if (
                elements.modal &&
                elements.modal.style.display === "flex"
            ) {

                closePlayer();

            }

        }

    }
);


// ========================================
// SEARCH PLACEHOLDER
// ========================================
//
// Live TV page currently has no search modal.
// Prevent error if button is clicked.
//

function openSearchModal() {

    console.log(
        "METFLIX: Search requested."
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
// INITIALIZATION
// ========================================

console.log(
    "========================================"
);

console.log(
    "METFLIX LIVE TV PLAYER LOADED"
);

console.log(
    "MPD: Shaka Player"
);

console.log(
    "HLS: HLS.js / Native HLS"
);

console.log(
    "========================================"
);
