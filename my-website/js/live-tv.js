// ========================================
// METFLIX LIVE TV
// DASH (.MPD) + HLS (.M3U8)
// ========================================

let shakaPlayer = null;
let hlsPlayer = null;
let currentChannel = null;


// ========================================
// CHANNEL STREAMS
// ========================================

const STREAMS = {

    // ==============================
    // AUTHENTICATED MPD STREAMS
    // ==============================

    "A2Z": {
        type: "mpd",
        url: ""
    },

    "DepEd TV": {
        type: "mpd",
        url: ""
    },

    "ALLTV": {
        type: "mpd",
        url: ""
    },

    "Jeepney TV": {
        type: "mpd",
        url: ""
    },

    "Cartoonito": {
        type: "mpd",
        url: ""
    },

    "TV Maria": {
        type: "mpd",
        url: ""
    },

    "Tagalized Movie Channel": {
        type: "mpd",
        url: ""
    },

    "GMA": {
        type: "mpd",
        url: ""
    },

    "INCTV": {
        type: "mpd",
        url: ""
    },

    "CGTN News Live": {
        type: "mpd",
        url: ""
    },


    // ==============================
    // HLS
    // ==============================

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

    "EWTN Asia-Pacific": {
        type: "hls",
        url: "https://cdn3.wowza.com/1/QmVNUVhTNTZSS3Uz/YWQ0aHpi/hls/live/playlist.m3u8"
    },

    "Arirang": {
        type: "hls",
        url: "https://amdlive-ch03-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8"
    },

    "Bloomberg Asia": {
        type: "hls",
        url: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8"
    },

    "BBC World News": {
        type: "hls",
        url: "https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8"
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
    },

    "Animax": {
        type: "hls",
        url: "http://202.57.43.60:8443/live/5748aabe4c9d661afbd7f4068248f664/125.m3u8"
    },

    "Kapamilya Channel": {
        type: "hls",
        url: "http://202.57.43.60:8443/live/5748aabe4c9d661afbd7f4068248f664/100.m3u8"
    }

};


// ========================================
// ELEMENTS
// ========================================

function elements() {

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

    const el = elements();

    if (el.status) {
        el.status.textContent = message;
    }

    console.log(
        "[METFLIX LIVE TV]",
        message
    );

}


// ========================================
// STOP PLAYER
// ========================================

async function stopPlayer() {

    const el = elements();

    if (shakaPlayer) {

        try {
            await shakaPlayer.destroy();
        } catch (e) {
            console.warn(e);
        }

        shakaPlayer = null;
    }


    if (hlsPlayer) {

        try {
            hlsPlayer.destroy();
        } catch (e) {
            console.warn(e);
        }

        hlsPlayer = null;
    }


    if (el.video) {

        el.video.pause();

        el.video.removeAttribute("src");

        el.video.load();

    }

}


// ========================================
// SELECT CHANNEL
// ========================================

async function selectChannel(channelName) {

    console.log(
        "SELECTED:",
        channelName
    );


    currentChannel =
        channelName;


    const el =
        elements();


    if (el.modal) {
        el.modal.style.display = "flex";
    }


    if (el.title) {
        el.title.textContent =
            channelName;
    }


    const stream =
        STREAMS[channelName];


    if (!stream) {

        setStatus(
            "Channel configuration not found."
        );

        return;
    }


    if (
        !stream.url ||
        stream.url.trim() === ""
    ) {

        setStatus(
            "Stream URL is not configured for this channel."
        );

        return;
    }


    await stopPlayer();


    if (el.placeholder) {
        el.placeholder.style.display = "flex";
    }


    setStatus(
        "Loading stream..."
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
                "Unsupported stream type."
            );

        }

    }

    catch (error) {

        console.error(
            "STREAM ERROR:",
            error
        );

        setStatus(
            "Stream failed to load."
        );

    }

}


// ========================================
// MPD / SHAKA
// ========================================

async function playMPD(url) {

    const el =
        elements();


    if (
        typeof shaka === "undefined"
    ) {

        throw new Error(
            "Shaka Player is not loaded."
        );

    }


    if (
        !shaka.Player.isBrowserSupported()
    ) {

        throw new Error(
            "Shaka Player is not supported."
        );

    }


    setStatus(
        "Initializing DASH..."
    );


    shakaPlayer =
        new shaka.Player(
            el.video
        );


    shakaPlayer.addEventListener(
        "error",
        function(event) {

            const error =
                event.detail;


            console.error(
                "SHAKA ERROR:",
                error
            );


            setStatus(
                `MPD error ${error.code || "UNKNOWN"}`
            );

        }
    );


    try {

        await shakaPlayer.load(
            url
        );

    }

    catch (error) {

        console.error(
            "MPD LOAD ERROR:",
            error
        );


        setStatus(
            `MPD stream failed to load. Error ${error.code || ""}`
        );


        throw error;

    }


    console.log(
        "MPD LOADED"
    );


    if (el.placeholder) {
        el.placeholder.style.display = "none";
    }


    try {

        await el.video.play();

        setStatus(
            "▶ LIVE"
        );

    }

    catch (error) {

        console.warn(
            "AUTOPLAY BLOCKED"
        );

        setStatus(
            "Stream loaded — press Play."
        );

    }

}


// ========================================
// HLS / HLS.JS
// ========================================

async function playHLS(url) {

    const el =
        elements();


    // Native HLS

    if (
        el.video.canPlayType(
            "application/vnd.apple.mpegurl"
        )
    ) {

        el.video.src =
            url;


        el.video.addEventListener(
            "loadedmetadata",
            async function() {

                if (el.placeholder) {
                    el.placeholder.style.display =
                        "none";
                }


                try {

                    await el.video.play();

                    setStatus(
                        "▶ LIVE"
                    );

                }

                catch (error) {

                    setStatus(
                        "Stream loaded — press Play."
                    );

                }

            },
            {
                once: true
            }
        );


        el.video.load();

        return;

    }


    // HLS.js

    if (
        typeof Hls === "undefined"
    ) {

        throw new Error(
            "HLS.js is not loaded."
        );

    }


    if (!Hls.isSupported()) {

        throw new Error(
            "HLS is not supported."
        );

    }


    hlsPlayer =
        new Hls();


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
                    "HLS stream failed."
                );

            }

        }
    );


    hlsPlayer.on(
        Hls.Events.MANIFEST_PARSED,
        async function() {

            if (el.placeholder) {
                el.placeholder.style.display =
                    "none";
            }


            try {

                await el.video.play();

                setStatus(
                    "▶ LIVE"
                );

            }

            catch (error) {

                setStatus(
                    "Stream loaded — press Play."
                );

            }

        }
    );


    hlsPlayer.loadSource(
        url
    );


    hlsPlayer.attachMedia(
        el.video
    );

}


// ========================================
// CLOSE PLAYER
// ========================================

async function closePlayer() {

    await stopPlayer();


    const el =
        elements();


    if (el.modal) {
        el.modal.style.display = "none";
    }


    if (el.placeholder) {
        el.placeholder.style.display = "flex";
    }


    setStatus(
        "Live stream will appear here."
    );


    currentChannel =
        null;

}


// ========================================
// CLOSE WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function(event) {

        const el =
            elements();


        if (
            el.modal &&
            event.target === el.modal
        ) {

            closePlayer();

        }

    }
);


// ========================================
// GLOBAL
// ========================================

window.selectChannel =
    selectChannel;

window.closePlayer =
    closePlayer;


// ========================================
// READY
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "================================"
        );

        console.log(
            "METFLIX LIVE TV READY"
        );

        console.log(
            "Shaka:",
            typeof shaka !== "undefined"
        );

        console.log(
            "HLS.js:",
            typeof Hls !== "undefined"
        );

        console.log(
            "Channels:",
            Object.keys(STREAMS).length
        );

        console.log(
            "================================"
        );

    }
);
