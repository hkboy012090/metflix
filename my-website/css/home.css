import { logout, checkAuth } from "./auth.js";
import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const API_KEY = '85d06918f5f2d578fd2048c5841b6ee2';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentItem;


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

        const filtered =
            (data.results || []).filter(item =>
                item.original_language === 'ja' &&
                item.genre_ids &&
                item.genre_ids.includes(16)
            );

        allResults =
            allResults.concat(filtered);
    }

    return allResults;
}


// ========================================
// BANNER
// ========================================

function displayBanner(item) {

    if (!item) return;

    const banner =
        document.getElementById('banner');

    const title =
        document.getElementById('banner-title');

    if (banner && item.backdrop_path) {

        banner.style.backgroundImage =
            `url(${IMG_URL}${item.backdrop_path})`;
    }

    if (title) {

        title.textContent =
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

    items
        .filter(item => item.poster_path)
        .slice(0, 10)
        .forEach((item, index) => {

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
                    alt="${item.title || item.name || ''}"
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
        document.getElementById('server');

    const videoElement =
        document.getElementById('modal-video');

    if (!serverElement || !videoElement) return;

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
        document.getElementById('modal');

    const video =
        document.getElementById('modal-video');

    if (modal) {

        modal.style.display =
            'none';
    }

    if (video) {

        video.src =
            '';
    }
}


// ========================================
// SEARCH MODAL
// ========================================

function openSearchModal() {

    const searchModal =
        document.getElementById('search-modal');

    const searchInput =
        document.getElementById('search-input');

    const searchBtn =
        document.getElementById("searchBtn");

    if (searchModal) {

        searchModal.style.display =
            'flex';
    }

    if (searchInput) {

        searchInput.focus();
    }

    if (searchBtn) {

        searchBtn.classList.add("active");
    }
}


function closeSearchModal() {

    const searchModal =
        document.getElementById('search-modal');

    const searchResults =
        document.getElementById('search-results');

    const searchBtn =
        document.getElementById("searchBtn");

    if (searchModal) {

        searchModal.style.display =
            'none';
    }

    if (searchResults) {

        searchResults.innerHTML =
            '';
    }

    if (searchBtn) {

        searchBtn.classList.remove("active");
    }
}


// ========================================
// SEARCH TMDB
// ========================================

async function searchTMDB() {

    const input =
        document.getElementById('search-input');

    const results =
        document.getElementById('search-results');

    if (!input || !results) return;

    const query =
        input.value;

    if (!query.trim()) {

        results.innerHTML =
            '';

        return;
    }

    try {

        const res =
            await fetch(
                `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
            );

        const data =
            await res.json();

        results.innerHTML =
            '';

        (data.results || []).forEach(item => {

            if (!item.poster_path) return;

            const img =
                document.createElement('img');

            img.src =
                `${IMG_URL}${item.poster_path}`;

            img.alt =
                item.title || item.name || "";

            img.onclick = () => {

                closeSearchModal();

                showDetails(item);
            };

            results.appendChild(img);

        });

    } catch (error) {

        console.error(
            "SEARCH ERROR:",
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
            await fetchTrending('movie');

        const tvShows =
            await fetchTrending('tv');

        const anime =
            await fetchTrendingAnime();


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


        displayTop10(
            movies,
            'movies-list'
        );


        displayList(
            tvShows,
            'tvshows-list'
        );


        displayList(
            anime,
            'anime-list'
        );


        if (
            window.Android &&
            typeof window.Android.homeReady === "function"
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
            typeof window.Android.homeReady === "function"
        ) {

            window.Android.homeReady();
        }
    }
}


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
// MAIN MENU
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
// CLOSE MAIN MENU OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.getElementById(
                "menuPanel"
            );

        if (!menu) return;

        const menuButton =
            event.target.closest(
                '.bottom-nav a[onclick*="toggleMenu"]'
            );

        if (
            menu.classList.contains("show") &&
            !menu.contains(event.target) &&
            !menuButton
        ) {

            menu.classList.remove(
                "show"
            );
        }

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

    const customizeProfile =
        document.querySelector(
            '[onclick="toggleProfileMenu()"]'
        );

    const profileSubMenu =
        document.getElementById(
            "profileSubMenu"
        );


    if (!menuUsername) return;


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


                // USERNAME
                if (userData.username) {

                    menuUsername.textContent =
                        userData.username;

                } else {

                    menuUsername.textContent =
                        user.displayName ||
                        (
                            user.email
                                ? user.email.split("@")[0]
                                : "User"
                        );
                }


                // AVATAR
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
                    (
                        user.email
                            ? user.email.split("@")[0]
                            : "User"
                    );
            }

        } catch (error) {

            console.error(
                "Error loading user profile:",
                error
            );

            menuUsername.textContent =
                user.displayName ||
                (
                    user.email
                        ? user.email.split("@")[0]
                        : "User"
                );
        }

    }


    // ========================================
    // LOGGED OUT
    // ========================================

    else {

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

            profileSubMenu.style.display =
                "none";
        }
    }

});


// ========================================
// CUSTOMIZE PROFILE SUBMENU
// ========================================

function setupProfileMenu() {

    const customizeButton =
        document.querySelector(
            '[onclick="toggleProfileMenu()"]'
        );

    const submenu =
        document.getElementById(
            "profileSubMenu"
        );


    if (!customizeButton || !submenu) {

        console.warn(
            "METFLIX: Profile menu not found."
        );

        return;
    }


    customizeButton.removeAttribute(
        "onclick"
    );


    submenu.classList.remove(
        "show"
    );


    submenu.style.display =
        "none";


    customizeButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                submenu.classList.contains(
                    "show"
                );


            if (isOpen) {

                submenu.classList.remove(
                    "show"
                );

                submenu.style.display =
                    "none";

            } else {

                submenu.classList.add(
                    "show"
                );

                submenu.style.display =
                    "block";
            }

        }
    );


    submenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


// ========================================
// PROFILE MENU GLOBAL FUNCTION
// ========================================

function toggleProfileMenu() {

    const submenu =
        document.getElementById(
            "profileSubMenu"
        );

    if (!submenu) return;


    const isOpen =
        submenu.classList.contains(
            "show"
        );


    if (isOpen) {

        submenu.classList.remove(
            "show"
        );

        submenu.style.display =
            "none";

    } else {

        submenu.classList.add(
            "show"
        );

        submenu.style.display =
            "block";
    }
}


window.toggleProfileMenu =
    toggleProfileMenu;


// ========================================
// MAIN MENU THEMES
// ========================================
// IMPORTANT:
//
// Walang automatic na pag-create dito.
// Ang Themes sa main menu ay dapat nasa HTML.
//
// URL:
// https://metflix-973.pages.dev/themes
//
// Ang Theme Settings naman ay mananatili
// sa loob ng Customize Profile.
//
// ========================================


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
// SETUP PROFILE MENU
// ========================================

setupProfileMenu();


// ========================================
// START HOME
// ========================================

init();
