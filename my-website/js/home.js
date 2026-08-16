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

    return data.results;
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

        const filtered = data.results.filter(item =>
            item.original_language === 'ja' &&
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

    document.getElementById('banner').style.backgroundImage =
        `url(${IMG_URL}${item.backdrop_path})`;

    document.getElementById('banner-title').textContent =
        item.title || item.name;
}


// ========================================
// DISPLAY LIST
// ========================================

function displayList(items, containerId) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    items.forEach(item => {

        const img =
            document.createElement("img");

        img.src =
            `${IMG_URL}${item.poster_path}`;

        img.alt =
            item.title || item.name;

        img.onclick =
            () => showDetails(item);

        container.appendChild(img);

    });
}


// ========================================
// TOP 10
// ========================================

function displayTop10(items, containerId) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    items.slice(0, 10).forEach((item, index) => {

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
                alt="${item.title || item.name}"
            >
        `;

        card.querySelector("img").onclick =
            () => showDetails(item);

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

    const server =
        document.getElementById('server').value;

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

    document.getElementById('modal-video').src =
        embedURL;
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    document.getElementById('modal').style.display =
        'none';

    document.getElementById('modal-video').src =
        '';
}


// ========================================
// SEARCH MODAL
// ========================================

function openSearchModal() {

    document.getElementById('search-modal').style.display =
        'flex';

    document.getElementById('search-input').focus();

    document.getElementById("searchBtn")
        .classList.add("active");
}


function closeSearchModal() {

    document.getElementById('search-modal').style.display =
        'none';

    document.getElementById('search-results').innerHTML =
        '';

    document.getElementById("searchBtn")
        .classList.remove("active");
}


// ========================================
// SEARCH TMDB
// ========================================

async function searchTMDB() {

    const query =
        document.getElementById('search-input').value;

    if (!query.trim()) {

        document.getElementById('search-results')
            .innerHTML = '';

        return;
    }

    const res = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
    );

    const data =
        await res.json();

    const container =
        document.getElementById('search-results');

    container.innerHTML = '';

    data.results.forEach(item => {

        if (!item.poster_path) return;

        const img =
            document.createElement('img');

        img.src =
            `${IMG_URL}${item.poster_path}`;

        img.alt =
            item.title || item.name;

        img.onclick = () => {

            closeSearchModal();

            showDetails(item);

        };

        container.appendChild(img);

    });
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


        // ========================================
        // DISPLAY HOME CONTENT
        // ========================================

        displayBanner(
            movies[
                Math.floor(
                    Math.random() *
                    movies.length
                )
            ]
        );


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


        // ========================================
        // TELL ANDROID HOME IS READY
        // ========================================

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


        // ========================================
        // PREVENT APK FROM BEING STUCK
        // ========================================

        if (
            window.Android &&
            typeof window.Android.homeReady === "function"
        ) {

            window.Android.homeReady();

        }

    }
}


// Start Home
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

    if (
        user &&
        savedMovie
    ) {

        sessionStorage.removeItem(
            "selectedMovie"
        );

        showDetails(
            JSON.parse(savedMovie)
        );

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

    menu.classList.toggle("show");
}


window.toggleMenu =
    toggleMenu;


document.addEventListener(
    "click",
    function (e) {

        const menu =
            document.getElementById(
                "menuPanel"
            );

        if (!menu) return;

        if (
            menu.classList.contains("show") &&
            !menu.contains(e.target) &&
            !e.target.closest(
                '[onclick="toggleMenu()"]'
            )
        ) {

            menu.classList.remove(
                "show"
            );

        }

    }
);


// ========================================
// 🎨 ADD THEMES TO MENU
// ========================================

function addThemesToMenu() {

    const menu =
        document.getElementById(
            "menuPanel"
        );

    if (!menu) {

        console.warn(
            "METFLIX: menuPanel not found."
        );

        return;

    }


    // Prevent duplicate Themes item
    if (
        document.getElementById(
            "themesMenuItem"
        )
    ) {

        return;

    }


    // ========================================
    // CREATE THEMES MENU ITEM
    // ========================================

    const themesItem =
        document.createElement(
            "div"
        );


    themesItem.id =
        "themesMenuItem";


    themesItem.className =
        "menu-item";


    themesItem.style.cursor =
        "pointer";


    themesItem.innerHTML = `

        <i
            class="fas fa-palette"
            style="
                width: 28px;
                font-size: 24px;
                margin-right: 18px;
            "
        ></i>

        <span>
            Themes
        </span>

    `;


    // ========================================
    // OPEN THEMES PAGE
    // ========================================

    themesItem.addEventListener(
        "click",
        function () {

            window.location.href =
                "themes.html";

        }
    );


    // ========================================
    // INSERT BEFORE ABOUT
    // ========================================

    const menuItems =
        menu.children;


    let inserted =
        false;


    for (
        let i = 0;
        i < menuItems.length;
        i++
    ) {

        const text =
            menuItems[i].textContent
                .trim()
                .toLowerCase();


        if (
            text === "about"
        ) {

            menu.insertBefore(
                themesItem,
                menuItems[i]
            );

            inserted =
                true;

            break;

        }

    }


    // ========================================
    // IF ABOUT WAS NOT FOUND
    // ADD TO END
    // ========================================

    if (!inserted) {

        menu.appendChild(
            themesItem
        );

    }

}


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


    if (!menuUsername) return;


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

        // Show Customize Profile
        if (customizeProfile) {

            customizeProfile.style.display =
                "flex";

        }


        // Show Avatar
        if (menuAvatar) {

            menuAvatar.style.display =
                "block";

        }


        // ========================================
        // 🎨 SHOW THEMES
        // ========================================

        addThemesToMenu();


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
                // LOAD USERNAME
                // ========================================

                if (
                    userData.username
                ) {

                    menuUsername.textContent =
                        userData.username;

                } else {

                    menuUsername.textContent =
                        user.displayName ||
                        user.email.split("@")[0];

                }


                // ========================================
                // LOAD SAVED AVATAR
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
                    user.email.split("@")[0];

            }


        } catch (e) {

            console.error(
                "Error loading user profile:",
                e
            );


            menuUsername.textContent =
                user.displayName ||
                user.email.split("@")[0];

        }


    }

    // ========================================
    // LOGGED OUT
    // ========================================

    else {

        menuUsername.textContent =
            "Guest";


        // Hide Avatar
        if (menuAvatar) {

            menuAvatar.style.display =
                "none";

        }


        // Hide Customize Profile
        if (customizeProfile) {

            customizeProfile.style.display =
                "none";

        }


        // ========================================
        // REMOVE THEMES WHEN LOGGED OUT
        // ========================================

        const themesMenuItem =
            document.getElementById(
                "themesMenuItem"
            );


        if (themesMenuItem) {

            themesMenuItem.remove();

        }


        // Close submenu
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
// PROFILE MENU
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
