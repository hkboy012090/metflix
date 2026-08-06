
import { logout, checkAuth } from "./auth.js";
import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

let currentItem = null;

// ===========================
// FETCH TRENDING MOVIES
// ===========================

async function fetchTrending(type) {

    const res = await fetch(
        `${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`
    );

    const data = await res.json();

    return data.results;

}

// ===========================
// FETCH TRENDING ANIME
// ===========================

async function fetchTrendingAnime() {

    let allResults = [];

    for (let page = 1; page <= 3; page++) {

        const res = await fetch(
            `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`
        );

        const data = await res.json();

        const anime = data.results.filter(item =>

            item.original_language === "ja" &&
            item.genre_ids.includes(16)

        );

        allResults = allResults.concat(anime);

    }

    return allResults;

}

// ===========================
// BANNER
// ===========================

function displayBanner(item) {

    const banner = document.getElementById("banner");
    const title = document.getElementById("banner-title");

    if (!banner || !title) return;

    banner.style.backgroundImage =
        `url(${IMG_URL}${item.backdrop_path})`;

    title.textContent =
        item.title || item.name;

}

// ===========================
// MOVIE LIST
// ===========================

function displayList(items, containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    items.forEach(item => {

        if (!item.poster_path) return;

        const img = document.createElement("img");

        img.src =
            `${IMG_URL}${item.poster_path}`;

        img.alt =
            item.title || item.name;

        img.loading = "lazy";

        img.onclick = () => {

            showDetails(item);

        };

        container.appendChild(img);

    });

}

// ===========================
// TOP 10
// ===========================

function displayTop10(items, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    items.slice(0,10).forEach((item,index)=>{

        if(!item.poster_path) return;

        const card=document.createElement("div");

        card.className="top10-item";

        card.innerHTML=`

            <div class="top10-number">

                ${index+1}

            </div>

            <img
                src="${IMG_URL}${item.poster_path}"
                alt="${item.title || item.name}"
            >

        `;

        card.querySelector("img").onclick=()=>{

            showDetails(item);

        };

        container.appendChild(card);

    });

}
// ===========================
// SHOW DETAILS
// ===========================

function showDetails(item) {

    checkAuth((user) => {

        if (!user) {

            sessionStorage.setItem(
                "selectedMovie",
                JSON.stringify(item)
            );

            window.location.href = "login.html";
            return;

        }

        let type = "movie";

        if (item.media_type) {

            type = item.media_type;

        } else if (!item.title) {

            type = "tv";

        }

        window.location.href =
            `watch.html?id=${item.id}&type=${type}`;

    });

}

// ===========================
// PLAYER SERVER
// ===========================

function changeServer() {

    const server =
        document.getElementById("server").value;

    const type =
        currentItem.media_type === "movie"
            ? "movie"
            : "tv";

    let url = "";

    switch (server) {

        case "vidsrc.cc":
            url =
            `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
            break;

        case "vidsrc.me":
            url =
            `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
            break;

        case "player.videasy.net":
            url =
            `https://player.videasy.net/${type}/${currentItem.id}`;
            break;

    }

    document.getElementById("modal-video").src = url;

}

// ===========================
// MODAL
// ===========================

function closeModal() {

    document.getElementById("modal").style.display = "none";

    document.getElementById("modal-video").src = "";

}

// ===========================
// SEARCH
// ===========================

function openSearchModal() {

    document.getElementById("search-modal").style.display = "flex";

    document.getElementById("search-input").focus();

    document.getElementById("searchBtn")
        .classList.add("active");

}

function closeSearchModal() {

    document.getElementById("search-modal").style.display = "none";

    document.getElementById("search-results").innerHTML = "";

    document.getElementById("searchBtn")
        .classList.remove("active");

}

async function searchTMDB() {

    const query =
        document.getElementById("search-input").value;

    if (!query.trim()) {

        document.getElementById("search-results").innerHTML = "";

        return;

    }

    const res = await fetch(

        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`

    );

    const data = await res.json();

    const container =
        document.getElementById("search-results");

    container.innerHTML = "";

    data.results.forEach(item => {

        if (!item.poster_path) return;

        const img = document.createElement("img");

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

// ===========================
// INITIALIZE
// ===========================

async function init() {

    const movies =
        await fetchTrending("movie");

    const tv =
        await fetchTrending("tv");

    const anime =
        await fetchTrendingAnime();

    displayBanner(

        movies[Math.floor(Math.random() * movies.length)]

    );

    displayTop10(
        movies,
        "movies-list"
    );

    displayList(
        tv,
        "tvshows-list"
    );

    displayList(
        anime,
        "anime-list"
    );

}

init();
// ===========================
// AUTH & MENU
// ===========================

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const customizeProfile = document.getElementById("customizeProfile");

logoutBtn?.addEventListener("click", logout);

// Bumalik sa napiling movie pagkatapos mag-login
const savedMovie = sessionStorage.getItem("selectedMovie");

checkAuth((user) => {

    if (user && savedMovie) {

        sessionStorage.removeItem("selectedMovie");

        showDetails(JSON.parse(savedMovie));

    }

});

// ===========================
// MENU
// ===========================

function toggleMenu() {

    document.getElementById("menuPanel")
        .classList.toggle("show");

}

window.toggleMenu = toggleMenu;

document.addEventListener("click", (e) => {

    const menu = document.getElementById("menuPanel");

    if (
        menu.classList.contains("show") &&
        !menu.contains(e.target) &&
        !e.target.closest('[onclick="toggleMenu()"]')
    ) {

        menu.classList.remove("show");

    }

});

// ===========================
// USER INFO
// ===========================

checkAuth(async (user) => {

    const menuUsername =
        document.getElementById("menuUsername");

    const userInfo =
        document.querySelector(".user-info");

    if (!menuUsername) return;

    // -----------------------
    // NOT LOGGED IN
    // -----------------------

    if (!user) {

        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        menuUsername.textContent = "Guest";

        if (customizeProfile)
            customizeProfile.style.display = "none";

        const avatar =
            document.getElementById("menuProfileImage");

        if (avatar) avatar.remove();

        const icon =
            document.querySelector(".user-info i");

        if (icon)
            icon.style.display = "block";

        return;

    }

    // -----------------------
    // LOGGED IN
    // -----------------------

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    if (customizeProfile)
        customizeProfile.style.display = "flex";

    try {

        const ref = doc(db, "users", user.uid);

        const snap = await getDoc(ref);

        let data = {};

        if (snap.exists()) {

            data = snap.data();

        }

        // Username

        menuUsername.textContent =
            data.username ||
            user.displayName ||
            user.email.split("@")[0];

        // Avatar

        let img =
            document.getElementById("menuProfileImage");

        if (!img) {

            img = document.createElement("img");

            img.id = "menuProfileImage";

            img.style.width = "48px";
            img.style.height = "48px";
            img.style.borderRadius = "50%";
            img.style.objectFit = "cover";

            userInfo.prepend(img);

        }

        if (data.profileImage) {

            img.src = data.profileImage;

            const icon =
                document.querySelector(".user-info i");

            if (icon)
                icon.style.display = "none";

        }

    } catch (err) {

        console.error(err);

    }

});

// ===========================
// EXPORTS
// ===========================

window.closeModal = closeModal;
window.changeServer = changeServer;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.searchTMDB = searchTMDB;

// ===========================
// PROFILE CUSTOMIZATION
// ===========================

const profilePreview = document.getElementById("profilePreview");
const avatarOptions = document.querySelectorAll(".avatar-option");
const galleryUpload = document.getElementById("galleryUpload");

// Open Modal
function openProfileModal() {

    document.getElementById("profileModal").style.display = "flex";

    // Load current avatar from Firestore
    checkAuth(async (user) => {

        if (!user) return;

        try {

            const snap = await getDoc(doc(db, "users", user.uid));

            if (snap.exists()) {

                const data = snap.data();

                if (data.profileImage) {

                    profilePreview.src = data.profileImage;

                }

            }

        } catch (e) {

            console.error(e);

        }

    });

}

// Close Modal
function closeProfileModal() {

    document.getElementById("profileModal").style.display = "none";

}

// Select Avatar
avatarOptions.forEach(img => {

    img.addEventListener("click", () => {

        profilePreview.src = img.src;

    });

});

// Upload Gallery Image
galleryUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profilePreview.src = e.target.result;

    };

    reader.readAsDataURL(file);

});

// Save Avatar
async function saveProfileImage() {

    if (!auth.currentUser) {

        alert("Please login first.");

        return;

    }

    try {

        const ref = doc(db, "users", auth.currentUser.uid);

        await setDoc(ref, {

            profileImage: profilePreview.src

        }, {

            merge: true

        });

        let img =
            document.getElementById("menuProfileImage");

        if (!img) {

            img = document.createElement("img");

            img.id = "menuProfileImage";

            img.style.width = "48px";
            img.style.height = "48px";
            img.style.borderRadius = "50%";
            img.style.objectFit = "cover";

            document.querySelector(".user-info").prepend(img);

        }

        img.src = profilePreview.src;

        const icon =
            document.querySelector(".user-info i");

        if (icon)
            icon.style.display = "none";

        alert("Profile updated successfully!");

        closeProfileModal();

    } catch (e) {

        console.error(e);
