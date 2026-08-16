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
// FIX THEMES MENU ICON ALIGNMENT
// ========================================

function fixThemesMenuAlignment() {

    if (document.getElementById("metflix-theme-menu-fix")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "metflix-theme-menu-fix";

    style.textContent = `

        /* =====================================
           MENU ICON ALIGNMENT
        ===================================== */

        #menuPanel a[href="themes.html"],
        #menuPanel a[href="./themes.html"],
        #menuPanel .themes-menu-item,
        #menuPanel .theme-menu-item {

            display: flex !important;

            align-items: center !important;

        }


        /* =====================================
           THEMES ICON
        ===================================== */

        #menuPanel a[href="themes.html"] i,
        #menuPanel a[href="./themes.html"] i,
        #menuPanel .themes-menu-item i,
        #menuPanel .theme-menu-item i {

            width: 28px !important;

            min-width: 28px !important;

            max-width: 28px !important;

            height: 28px !important;

            display: inline-flex !important;

            align-items: center !important;

            justify-content: center !important;

            text-align: center !important;

            margin-right: 18px !important;

            font-size: 24px !important;

            line-height: 1 !important;

            flex-shrink: 0 !important;

        }


        /* =====================================
           IF THEMES ICON IS A SPAN
        ===================================== */

        #menuPanel a[href="themes.html"] .menu-icon,
        #menuPanel a[href="./themes.html"] .menu-icon,
        #menuPanel .themes-menu-item .menu-icon,
        #menuPanel .theme-menu-item .menu-icon {

            width: 28px !important;

            min-width: 28px !important;

            max-width: 28px !important;

            height: 28px !important;

            display: inline-flex !important;

            align-items: center !important;

            justify-content: center !important;

            text-align: center !important;

            margin-right: 18px !important;

            flex-shrink: 0 !important;

        }


        /* =====================================
           FORCE THE TEXT TO START SAME PLACE
        ===================================== */

        #menuPanel a[href="themes.html"] span:last-child,
        #menuPanel a[href="./themes.html"] span:last-child,
        #menuPanel .themes-menu-item span:last-child,
        #menuPanel .theme-menu-item span:last-child {

            display: inline-block;

        }

    `;

    document.head.appendChild(style);
}


// Run immediately
fixThemesMenuAlignment();


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

        const filtered =
            data.results.filter(item =>
                item.original_language === 'ja' &&
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

    if (!container) return;

    container.innerHTML = "";

    items.forEach(item => {

        if (!item.poster_path) return;

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

    if (!container) return;

    container.innerHTML = "";

    items
        .slice(0, 10)
        .forEach((item, index) => {

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
                    alt="${item.title || item.name}"
                >

            `;

            const image =
                card.querySelector("img");

            if (image) {

                image.onclick =
                    () => showDetails(item);

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

    }


    else if (server === "vidsrc.me") {

        embedURL =
            `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;

    }


    else if (server === "player.videasy.net") {

        embedURL =
            `https://player.videasy.net/${type}/${currentItem.id}`;

    }


    const video =
        document.getElementById('modal-video');

    if (video) {

        video.src =
            embedURL;

    }
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

    const modal =
        document.getElementById('search-modal');

    const input =
        document.getElementById('search-input');


    if (modal) {

        modal.style.display =
            'flex';

    }


    if (input) {

        input.focus();

    }


    const searchBtn =
        document.getElementById("searchBtn");

    if (searchBtn) {

        searchBtn.classList.add("active");

    }
}


function closeSearchModal() {

    const modal =
        document.getElementById('search-modal');

    const results =
        document.getElementById('search-results');

    const searchBtn =
        document.getElementById("searchBtn");


    if (modal) {

        modal.style.display =
            'none';

    }


    if (results) {

        results.innerHTML =
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


        data.results.forEach(item => {

            if (!item.poster_path) return;


            const img =
                document.createElement('img');


            img.src =
                `${IMG_URL}${item.poster_path}`;


            img.alt =
                item.title || item.name;


            img.onclick =
                () => {

                    closeSearchModal();

                    showDetails(item);

                };


            results.appendChild(img);

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
