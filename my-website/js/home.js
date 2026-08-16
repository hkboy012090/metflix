import { logout, checkAuth } from "./auth.js";
import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

let currentItem = null;


// ========================================
// TRENDING
// ========================================

async function fetchTrending(type) {

    const res = await fetch(
        `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`
    );

    const data = await res.json();

    return data.results || [];
}


// ========================================
// TRENDING ANIME
// ========================================

async function fetchTrendingAnime() {

    let allResults = [];

    for (let page = 1; page <= 3; page++) {

        const res = await fetch(
            `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`
        );

        const data = await res.json();

        const filtered = (data.results || []).filter(item =>
            item.original_language === "ja" &&
            Array.isArray(item.genre_ids) &&
            item.genre_ids.includes(16)
        );

        allResults = allResults.concat(filtered);
    }

    return allResults;
}


// ========================================
// BANNER
// ========================================

function displayBanner(item) {

    if (!item) return;

    const banner =
        document.getElementById("banner");

    const bannerTitle =
        document.getElementById("banner-title");

    if (banner && item.backdrop_path) {

        banner.style.backgroundImage =
            `url(${IMG_URL}${item.backdrop_path})`;
    }

    if (bannerTitle) {

        bannerTitle.textContent =
            item.title || item.name || "";
    }
}


// ========================================
// DISPLAY LIST
// ========================================

function displayList(items, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    items.forEach(item => {

        if (!item.poster_path) return;

        const img =
            document.createElement("img");

        img.src =
            `${IMG_URL}${item.poster_path}`;

        img.alt =
            item.title || item.name || "";

        img.loading = "lazy";

        img.onclick = () =>
            showDetails(item);

        container.appendChild(img);

    });
}


// ========================================
// TOP 10
// ========================================

function displayTop10(items, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    items.slice(0, 10).forEach((item, index) => {

        if (!item.poster_path) return;

        const card =
            document.createElement("div");

        card.className =
            "top10-item";

        card.innerHTML = `
            <div class="top10-number">
                ${index + 1}
            </div>

            <img
                src="${IMG_URL}${item.poster_path}"
                alt="${item.title || item.name || ""}"
                loading="lazy"
            >
        `;

        const image =
            card.querySelector("img");

        if (image) {

            image.onclick = () =>
                showDetails(item);
        }

        container.appendChild(card);

    });
}


// ========================================
// SHOW MOVIE / TV DETAILS
// ========================================

function showDetails(item) {

    currentItem = item;

    checkAuth((user) => {

        if (!user) {

            sessionStorage.setItem(
                "selectedMovie",
                JSON.stringify(item)
            );

            window.location.href =
                "login.html";

            return;
        }

        let type;

        if (item.media_type) {

            type =
                item.media_type;

        } else if (item.title) {

            type =
                "movie";

        } else {

            type =
                "tv";
        }

        window.location.href =
            `watch.html?id=${item.id}&type=${type}`;

    });
}


// ========================================
// CHANGE SERVER
// ========================================

function changeServer() {

    if (!currentItem) return;

    const serverElement =
        document.getElementById("server");

    const videoElement =
        document.getElementById("modal-video");

    if (!serverElement || !videoElement) {
        return;
    }

    const server =
        serverElement.value;

    const type =
        currentItem.media_type === "movie"
            ? "movie"
            : "tv";

    let embedURL = "";

    if (server === "vidsrc.cc") {

        embedURL =
            `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;

    } else if (server === "vidsrc.me") {

        embedURL =
            `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;

    } else if (server === "player.videasy.net") {

        embedURL =
            `https://player.videasy.net/${type}/${currentItem.id}`;
    }

    videoElement.src =
        embedURL;
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    const modal =
        document.getElementById("modal");

    const video =
        document.getElementById("modal-video");

    if (modal) {

        modal.style.display =
            "none";
    }

    if (video) {

        video.src =
            "";
    }
}


// ========================================
// SEARCH MODAL
// ========================================

function openSearchModal() {

    const modal =
        document.getElementById("search-modal");

    const input =
        document.getElementById("search-input");

    const searchBtn =
        document.getElementById("searchBtn");

    if (modal) {

        modal.style.display =
            "flex";
    }

    if (input) {

        input.focus();
    }

    if (searchBtn) {

        searchBtn.classList.add(
            "active"
        );
    }
}


function closeSearchModal() {

    const modal =
        document.getElementById("search-modal");

    const results =
        document.getElementById("search-results");

    const searchBtn =
        document.getElementById("searchBtn");

    if (modal) {

        modal.style.display =
            "none";
    }

    if (results) {

        results.innerHTML =
            "";
    }

    if (searchBtn) {

        searchBtn.classList.remove(
            "active"
        );
    }
}


// ========================================
// SEARCH TMDB
// ========================================

async function searchTMDB() {

    const input =
        document.getElementById("search-input");

    const container =
        document.getElementById("search-results");

    if (!input || !container) {
        return;
    }

    const query =
        input.value.trim();

    if (!query) {

        container.innerHTML =
            "";

        return;
    }

    try {

        const res =
            await fetch(
                `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
            );

        const data =
            await res.json();

        container.innerHTML =
            "";

        (data.results || []).forEach(item => {

            if (!item.poster_path) return;

            if (
                item.media_type !== "movie" &&
                item.media_type !== "tv"
            ) {
                return;
            }

            const img =
                document.createElement("img");

            img.src =
                `${IMG_URL}${item.poster_path}`;

            img.alt =
                item.title || item.name || "";

            img.loading =
                "lazy";

            img.onclick = () => {

                closeSearchModal();

                showDetails(item);
            };

            container.appendChild(img);

        });

    } catch (error) {

        console.error(
            "TMDB SEARCH ERROR:",
            error
        );

    }
}


// ========================================
// HOME PAGE INITIALIZATION
// ========================================

async function init() {

    try {

        const movies =
            await fetchTrending("movie");

        const tvShows =
            await fetchTrending("tv");

        const anime =
            await fetchTrendingAnime();


        // ========================================
        // BANNER
        // ========================================

        if (movies.length > 0) {

            displayBanner(
                movies[
                    Math.floor(
                        Math.random() *
                        movies.length
                    )
                ]
            );
        }


        // ========================================
        // TOP 10
        // ========================================

        displayTop10(
            movies,
            "movies-list"
        );


        // ========================================
        // TV
        // ========================================

        displayList(
            tvShows,
            "tvshows-list"
        );


        // ========================================
        // ANIME
        // ========================================

        displayList(
            anime,
            "anime-list"
        );


        // ========================================
        // ANDROID READY
        // ========================================

        if (
            window.Android &&
            typeof window.Android.homeReady ===
            "function"
        ) {

            window.Android.homeReady();
        }

    } catch (error) {

        console.error(
            "METFLIX Home loading error:",
            error
        );


        if (
            window.Android &&
            typeof window.Android.homeReady ===
            "function"
        ) {

            window.Android.homeReady();
        }
    }
}


// ========================================
// START HOME
// ========================================

init();


// ========================================
// LOGIN / LOGOUT
// ========================================

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


if (loginBtn && logoutBtn) {

    checkAuth((user) => {

        if (user) {

            loginBtn.style.display =
                "none";

            logoutBtn.style.display =
                "inline-block";

        } else {

            loginBtn.style.display =
                "inline-block";

            logoutBtn.style.display =
                "none";
        }

    });


    logoutBtn.addEventListener(
        "click",
        logout
    );
}


// ========================================
// SAVED MOVIE
// ========================================

const savedMovie =
    sessionStorage.getItem(
        "selectedMovie"
    );


checkAuth((user) => {

    if (user && savedMovie) {

        sessionStorage.removeItem(
            "selectedMovie"
        );

        try {

            showDetails(
                JSON.parse(savedMovie)
            );

        } catch (error) {

            console.error(
                "Saved movie error:",
                error
            );
        }
    }

});


// ========================================
// MENU
// ========================================

function toggleMenu() {

    const menu =
        document.getElementById(
            "menuPanel"
        );

    if (!menu) return;

    menu.classList.toggle(
        "show"
    );
}


window.toggleMenu =
    toggleMenu;


// ========================================
// PROFILE SUBMENU
// ========================================

function toggleProfileMenu() {

    const submenu =
        document.getElementById(
            "profileSubMenu"
        );

    if (!submenu) return;

    submenu.classList.toggle(
        "show"
    );
}


window.toggleProfileMenu =
    toggleProfileMenu;


// ========================================
// MENU CLICK HANDLING
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const menu =
            document.getElementById(
                "menuPanel"
            );

        const profileButton =
            document.querySelector(
                '[onclick="toggleProfileMenu()"]'
            );

        const profileSubMenu =
            document.getElementById(
                "profileSubMenu"
            );


        // ========================================
        // PROFILE BUTTON
        // ========================================

        if (profileButton) {

            /*
             * Remove inline onclick.
             *
             * This prevents the function
             * from being executed twice.
             */

            profileButton.removeAttribute(
                "onclick"
            );


            profileButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    if (!profileSubMenu) {
                        return;
                    }

                    profileSubMenu.classList.toggle(
                        "show"
                    );

                }
            );
        }


        // ========================================
        // SUBMENU
        // ========================================

        if (profileSubMenu) {

            profileSubMenu.addEventListener(
                "click",
                (event) => {

                    /*
                     * Allow submenu links to work,
                     * but prevent the menu itself
                     * from being treated as an
                     * outside click.
                     */

                    event.stopPropagation();

                }
            );
        }


        // ========================================
        // MENU OUTSIDE CLICK
        // ========================================

        document.addEventListener(
            "click",
            (event) => {

                if (!menu) return;

                if (
                    !menu.classList.contains(
                        "show"
                    )
                ) {
                    return;
                }


                /*
                 * If click is outside menu,
                 * close menu.
                 */

                if (
                    !menu.contains(
                        event.target
                    )
                ) {

                    menu.classList.remove(
                        "show"
                    );

                    if (profileSubMenu) {

                        profileSubMenu.classList.remove(
                            "show"
                        );
                    }
                }

            }
        );

    }
);


// ========================================
// USER PROFILE
// ========================================

checkAuth(async (user) => {

    const menuUsername =
        document.getElementById(
            "menuUsername"
        );

    const menuAvatar =
        document.getElementById(
            "menuAvatar"
        );


    if (!menuUsername) {
        return;
    }


    const customizeProfile =
        document.querySelector(
            '[onclick="toggleProfileMenu()"]'
        );


    const profileSubMenu =
        document.getElementById(
            "profileSubMenu"
        );


    // ========================================
    // LOGGED IN
    // ========================================

    if (user) {

        if (customizeProfile) {

            customizeProfile.style.display =
                "flex";
        }


        if (menuAvatar) {

            menuAvatar.style.display =
                "block";
        }


        try {

            const docRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const docSnap =
                await getDoc(
                    docRef
                );


            if (docSnap.exists()) {

                const userData =
                    docSnap.data();


                // ========================================
                // USERNAME
                // ========================================

                if (userData.username) {

                    menuUsername.textContent =
                        userData.username;

                } else {

                    menuUsername.textContent =
                        user.displayName ||
                        user.email?.split("@")[0] ||
                        "User";
                }


                // ========================================
                // AVATAR
                // ========================================

                if (
                    menuAvatar &&
                    userData.profileImage
                ) {

                    menuAvatar.src =
                        userData.profileImage;
                }

            } else {

                menuUsername.textContent =
                    user.displayName ||
                    user.email?.split("@")[0] ||
                    "User";
            }

        } catch (error) {

            console.error(
                "Error loading user profile:",
                error
            );

            menuUsername.textContent =
                user.displayName ||
                user.email?.split("@")[0] ||
                "User";
        }


    } else {

        // ========================================
        // LOGGED OUT
        // ========================================

        menuUsername.textContent =
            "Guest";


        if (menuAvatar) {

            menuAvatar.style.display =
                "none";
        }


        if (customizeProfile) {

            customizeProfile.style.display =
                "none";
        }


        if (profileSubMenu) {

            profileSubMenu.classList.remove(
                "show"
            );
        }
    }

});


// ========================================
// GLOBAL FUNCTIONS
// ========================================

window.closeModal =
    closeModal;

window.changeServer =
    changeServer;

window.openSearchModal =
    openSearchModal;

window.closeSearchModal =
    closeSearchModal;

window.searchTMDB =
    searchTMDB;


// ========================================
// PROTECT PROFILE SUBMENU
// ========================================

/*
 * Because the HTML currently has:
 *
 * <a href="#" onclick="toggleProfileMenu()">
 *
 * we remove the inline onclick once
 * the DOM is ready and replace it with
 * a proper event listener above.
 *
 * This prevents "#" from jumping the page
 * and prevents double-toggle problems.
 */


// ========================================
// FINAL LOG
// ========================================

console.log(
    "METFLIX HOME.JS LOADED"
);
