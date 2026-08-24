// ========================================
// METFLIX LIVE TV
// MPD + M3U8 PLAYER
// ========================================

let currentPlayer = null;
let currentHls = null;
let currentChannel = null;


// ========================================
// CHANNEL DATABASE
// ========================================

const CHANNELS = {

    // ====================================
    // MPEG-DASH / MPD
    // ====================================

    "A2Z": {
        type: "mpd",
        url: "http://136.239.173.2:6610/001/2/ch00000090990000001087/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BqHRrK8UUahwItHhKpXgPXKytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001176&contentid=ch00000000000000001176&videoid=ch00000090990000001087&recommendtype=0&userid=1287297673984&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=U4DB4Z0H2EXXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "DepEd TV": {
        type: "mpd",
        url: "http://136.239.158.10:6610/001/2/ch00000090990000001340/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BpqUIe1xo9fgdQj%2FdedKSTyytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001832&contentid=ch00000000000000001832&videoid=ch00000090990000001340&recommendtype=0&userid=1586131651828&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=1RR87QJ6AY2XXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "ALLTV": {
        type: "mpd",
        url: "http://136.239.158.10:6610/001/2/ch00000090990000001179/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2Bow35sHUcBhGBpxqddBGYEnytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001415&contentid=ch00000000000000001415&videoid=ch00000090990000001179&recommendtype=0&userid=1205050496206&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=02WMA0HI2O3AXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "Jeepney TV": {
        type: "mpd",
        url: "http://161.49.17.2:6610/001/2/ch00000090990000001250/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BpGbNnk2H5Bi8k4yR%2B9AHGFytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001546&contentid=ch00000000000000001546&videoid=ch00000090990000001250&recommendtype=0&userid=1870820485634&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=6T45HYQ6YE3XXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "Cartoonito": {
        type: "mpd",
        url: "http://161.49.17.2:6610/001/2/ch00000090990000001125/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BoZQDeIq8A03ROpfeWN75MYytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001238&contentid=ch00000000000000001238&videoid=ch00000090990000001125&recommendtype=0&userid=1642489849443&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=9X3U5ZPDLQVXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "TV Maria": {
        type: "mpd",
        url: "http://136.158.97.2:6610/001/2/ch00000090990000001160/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BqJiJmfV%2B93mjmGGmqynSohytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001374&contentid=ch00000000000000001374&videoid=ch00000090990000001160&recommendtype=0&userid=1605694488407&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=G669IAJA55PXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "Tagalized Movie Channel": {
        type: "mpd",
        url: "http://136.239.159.20:6610/001/2/ch00000090990000001080/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BrHx%2Fyl86rMkFVqtHp1NtQIytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001153&contentid=ch00000000000000001153&videoid=ch00000090990000001080&recommendtype=0&userid=1123674387331&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=OWFM2G9EILPXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "GMA": {
        type: "mpd",
        url: "http://136.158.97.2:6610/001/2/ch00000090990000001093/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BoLvT86fM74ocVChyFS93HUytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001214&contentid=ch00000000000000001214&videoid=ch00000090990000001093&recommendtype=0&userid=1084724632836&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=FGE3OISG4KGXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "INCTV": {
        type: "mpd",
        url: "http://136.239.159.18:6610/001/2/ch00000090990000001092/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2BrC5ZD%2FYbS0KSGrFVJUNIMkytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001178&contentid=ch00000000000000001178&videoid=ch00000090990000001092&recommendtype=0&userid=1760058453659&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=HILNO5G9U9IXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },

    "CGTN News Live": {
        type: "mpd",
        url: "http://136.239.173.26:6610/001/2/ch00000090990000001146/manifest.mpd?AuthInfo=v87HD9rEhwHiAdYyrP20Tg5pgSMSITY%2FHYvvCWJRp%2Bq0bLdlQQxjquEy7BUYBE%2BOytokK1MIobcue1ImXa0ZEA%3D%3D&version=v1.0&BreakPoint=0&virtualDomain=001.live_hls.zte.com&programid=ch00000000000000001316&contentid=ch00000000000000001316&videoid=ch00000090990000001146&recommendtype=0&userid=1917967408923&boid=001&stbid=02%3A00%3A00%3A00%3A00%3A00&terminalflag=1&profilecode=&usersessionid=4ADPFTEPDLCXXX&NeedJITP=1&JITPMediaType=DASH&JITPDRMType=NO"
    },


    // ====================================
    // HLS / M3U8
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

    "Bilyonario News Channel": {
        type: "hls",
        url: "https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8"
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
// GET ELEMENTS
// ========================================

function getElements() {

    return {
        modal: document.getElementById("playerModal"),
        video: document.getElementById("liveVideo"),
        title: document.getElementById("playerTitle"),
        placeholder: document.getElementById("videoPlaceholder"),
        status: document.getElementById("playerStatus"),
        loading: document.getElementById("videoLoading")
    };

}


// ========================================
// SHOW MODAL
// ========================================

function showPlayer() {

    const el = getElements();

    if (el.modal) {
        el.modal.style.display = "flex";
    }

}


// ========================================
// STATUS
// ========================================

function setStatus(message) {

    const el = getElements();

    if (el.status) {
        el.status.textContent = message;
    }

}


// ========================================
// PLACEHOLDER
// ========================================

function showPlaceholder(message) {

    const el = getElements();

    if (el.placeholder) {
        el.placeholder.style.display = "flex";
    }

    setStatus(message);

}


function hidePlaceholder() {

    const el = getElements();

    if (el.placeholder) {
        el.placeholder.style.display = "none";
    }

}


// ========================================
// LOADING
// ========================================

function setLoading(value) {

    const el = getElements();

    if (el.loading) {
        el.loading.style.display =
            value ? "flex" : "none";
    }

}


// ========================================
// DESTROY SHAKA / HLS
// ========================================

async function destroyPlayers() {

    if (currentPlayer) {

        try {
            await currentPlayer.destroy();
        } catch (error) {
            console.error(
                "SHAKA DESTROY ERROR:",
                error
            );
        }

        currentPlayer = null;
    }


    if (currentHls) {

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


// ========================================
// RESET VIDEO
// ========================================

function resetVideo() {

    const el = getElements();

    if (!el.video) return;

    try {
        el.video.pause();
    } catch (error) {
        console.warn(error);
    }

    el.video.removeAttribute("src");

    el.video.load();

}


// ========================================
// PLAY MPD
// ========================================

async function playMPD(url) {

    const el = getElements();

    const video = el.video;

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

        setLoading(false);

        showPlaceholder(
            "Shaka Player failed to load."
        );

        return;
    }


    if (
        !shaka.Player.isBrowserSupported()
    ) {

        setLoading(false);

        showPlaceholder(
            "This browser does not support MPEG-DASH."
        );

        return;
    }


    console.log(
        "METFLIX: Starting MPD..."
    );


    try {

        currentPlayer =
            new shaka.Player(video);


        currentPlayer.addEventListener(
            "error",
            function(event) {

                console.error(
                    "SHAKA ERROR:",
                    event.detail
                );

                setLoading(false);

                showPlaceholder(
                    "MPD error " +
                    (
                        event.detail &&
                        event.detail.code
                            ? event.detail.code
                            : "UNKNOWN"
                    )
                );

            }
        );


        await currentPlayer.load(url);


        console.log(
            "METFLIX: MPD loaded."
        );


        setLoading(false);

        hidePlaceholder();


        try {

            await video.play();

        } catch (error) {

            console.log(
                "Autoplay blocked. Press Play."
            );

            setStatus(
                "Press Play to start the stream."
            );

        }

    } catch (error) {

        console.error(
            "MPD LOAD ERROR:",
            error
        );

        setLoading(false);

        showPlaceholder(
            "MPD stream failed to load."
        );

    }

}


// ========================================
// PLAY HLS
// ========================================

async function playHLS(url) {

    const el = getElements();

    const video = el.video;

    if (!video) return;


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


        video.src = url;


        video.addEventListener(
            "loadedmetadata",
            function handler() {

                video.removeEventListener(
                    "loadedmetadata",
                    handler
                );

                setLoading(false);

                hidePlaceholder();


                video.play()
                    .catch(() => {

                        setStatus(
                            "Press Play to start the stream."
                        );

                    });

            }
        );


        video.addEventListener(
            "error",
            function() {

                console.error(
                    "NATIVE HLS ERROR:",
                    video.error
                );

                setLoading(false);

                showPlaceholder(
                    "HLS stream failed."
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
            function() {

                console.log(
                    "METFLIX: HLS manifest loaded."
                );


                setLoading(false);

                hidePlaceholder();


                video.play()
                    .catch(() => {

                        setStatus(
                            "Press Play to start the stream."
                        );

                    });

            }
        );


        currentHls.on(
            Hls.Events.ERROR,
            function(event, data) {

                console.error(
                    "HLS ERROR:",
                    data
                );


                if (data.fatal) {

                    setLoading(false);


                    if (
                        data.type ===
                        Hls.ErrorTypes.NETWORK_ERROR
                    ) {

                        showPlaceholder(
                            "Network error. Stream unavailable."
                        );

                    }

                    else if (
                        data.type ===
                        Hls.ErrorTypes.MEDIA_ERROR
                    ) {

                        showPlaceholder(
                            "Media error. Attempting recovery..."
                        );


                        try {

                            currentHls.recoverMediaError();

                        } catch (error) {

                            console.error(
                                error
                            );

                        }

                    }

                    else {

                        showPlaceholder(
                            "HLS stream cannot be played."
                        );

                    }

                }

            }
        );


        return;
    }


    setLoading(false);

    showPlaceholder(
        "HLS is not supported by this browser."
    );

}


// ========================================
// SELECT CHANNEL
// ========================================

async function selectChannel(channelName) {

    console.log(
        "================================"
    );

    console.log(
        "CHANNEL:",
        channelName
    );

    console.log(
        "================================"
    );


    const el = getElements();

    const channel =
        CHANNELS[channelName];


    // ====================================
    // CHANNEL NOT FOUND
    // ====================================

    if (!channel) {

        showPlayer();

        if (el.title) {
            el.title.textContent =
                channelName;
        }

        setLoading(false);

        showPlaceholder(
            "Channel is not configured."
        );

        console.error(
            "CHANNEL NOT FOUND:",
            channelName
        );

        return;
    }


    currentChannel =
        channelName;


    // ====================================
    // OPEN PLAYER
    // ====================================

    showPlayer();


    if (el.title) {
        el.title.textContent =
            channelName;
    }


    showPlaceholder(
        "Connecting to " +
        channelName +
        "..."
    );


    setLoading(true);


    // ====================================
    // STOP PREVIOUS STREAM
    // ====================================

    await destroyPlayers();

    resetVideo();


    // ====================================
    // TYPE
    // ====================================

    const type =
        String(channel.type)
            .toLowerCase();


    console.log(
        "TYPE:",
        type
    );


    // ====================================
    // MPD
    // ====================================

    if (type === "mpd") {

        await playMPD(
            channel.url
        );

        return;
    }


    // ====================================
    // HLS
    // ====================================

    if (type === "hls") {

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
        "Unsupported stream type."
    );

}


// ========================================
// CLOSE PLAYER
// ========================================

async function closePlayer() {

    console.log(
        "METFLIX: Closing player."
    );


    const el =
        getElements();


    await destroyPlayers();

    resetVideo();


    if (el.modal) {
        el.modal.style.display = "none";
    }


    if (el.title) {
        el.title.textContent =
            "Live TV";
    }


    if (el.status) {
        el.status.textContent =
            "Select a channel to start watching.";
    }


    if (el.placeholder) {
        el.placeholder.style.display =
            "flex";
    }


    if (el.loading) {
        el.loading.style.display =
            "none";
    }


    currentChannel =
        null;

}


// ========================================
// CLICK OUTSIDE PLAYER
// ========================================

document.addEventListener(
    "click",
    function(event) {

        const el =
            getElements();


        if (
            !el.modal ||
            el.modal.style.display !== "flex"
        ) {
            return;
        }


        if (
            event.target === el.modal
        ) {

            closePlayer();

        }

    }
);


// ========================================
// ESC
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            const el =
                getElements();


            if (
                el.modal &&
                el.modal.style.display === "flex"
            ) {

                closePlayer();

            }

        }

    }
);


// ========================================
// SEARCH
// ========================================

function openSearchModal() {

    console.log(
        "METFLIX: Search clicked."
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

console.log(
    "========================================"
);

console.log(
    "METFLIX LIVE TV PLAYER READY"
);

console.log(
    "MPD: Shaka Player"
);

console.log(
    "HLS: HLS.js / Native HLS"
);

console.log(
    "CHANNELS:",
    Object.keys(CHANNELS).length
);

console.log(
    "========================================"
);
