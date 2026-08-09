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

    async function fetchTrending(type) {
      const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
      const data = await res.json();
      return data.results;
    }

    async function fetchTrendingAnime() {
  let allResults = [];

  // Fetch from multiple pages to get more anime (max 3 pages for demo)
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }

  return allResults;
}


    function displayBanner(item) {
      document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
      document.getElementById('banner-title').textContent = item.title || item.name;
    }

    function displayList(items, containerId){

    const container=document.getElementById(containerId);
    container.innerHTML="";

    items.forEach(item=>{

        const img=document.createElement("img");
        img.src=`${IMG_URL}${item.poster_path}`;
        img.alt=item.title || item.name;
        img.onclick=()=>showDetails(item);

        container.appendChild(img);

    });

}
function displayTop10(items, containerId){

    const container=document.getElementById(containerId);
    container.innerHTML="";

    items.slice(0,10).forEach((item,index)=>{

        const card=document.createElement("div");
        card.className="top10-item";

        card.innerHTML=`
            <div class="top10-number">${index+1}</div>
            <img src="${IMG_URL}${item.poster_path}"
                 alt="${item.title || item.name}">
        `;

        card.querySelector("img").onclick=()=>showDetails(item);

        container.appendChild(card);

    });

}

   function showDetails(item) {

    checkAuth((user) => {

        if (!user) {

            sessionStorage.setItem("selectedMovie", JSON.stringify(item));
            window.location.href = "login.html";
            return;

        }

        let type;

        if (item.media_type) {

            type = item.media_type;

        } else if (item.title) {

            type = "movie";

        } else {

            type = "tv";

        }

        


window.location.href =
    `watch.html?id=${item.id}&type=${type}`;

    });

}
    function changeServer() {
      const server = document.getElementById('server').value;
      const type = currentItem.media_type === "movie" ? "movie" : "tv";
      let embedURL = "";

      if (server === "vidsrc.cc") {
        embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
      } else if (server === "vidsrc.me") {
        embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
      } else if (server === "player.videasy.net") {
        embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
      }

      document.getElementById('modal-video').src = embedURL;
    }

    function closeModal() {
      document.getElementById('modal').style.display = 'none';
      document.getElementById('modal-video').src = '';
    }

    function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();

  document.getElementById("searchBtn").classList.add("active");
}

    function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';

  document.getElementById("searchBtn").classList.remove("active");
}
    async function searchTMDB() {
      const query = document.getElementById('search-input').value;
      if (!query.trim()) {
        document.getElementById('search-results').innerHTML = '';
        return;
      }

      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
      const data = await res.json();

      const container = document.getElementById('search-results');
      container.innerHTML = '';
      data.results.forEach(item => {
        if (!item.poster_path) return;
        const img = document.createElement('img');
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = () => {
          closeSearchModal();
          showDetails(item);
        };
        container.appendChild(img);
      });
    }

    async function init() {
      const movies = await fetchTrending('movie');
      const tvShows = await fetchTrending('tv');
      const anime = await fetchTrendingAnime();

      displayBanner(movies[Math.floor(Math.random() * movies.length)]);
      displayTop10(movies, 'movies-list');
      displayList(tvShows, 'tvshows-list');
      displayList(anime, 'anime-list');
    }

    init();
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (loginBtn && logoutBtn) {

    checkAuth((user) => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
});

    logoutBtn.addEventListener("click", logout);
}

const savedMovie = sessionStorage.getItem("selectedMovie");

checkAuth((user) => {
    if (user && savedMovie) {
        sessionStorage.removeItem("selectedMovie");
        showDetails(JSON.parse(savedMovie));
    }
});
function toggleMenu() {
    document.getElementById("menuPanel").classList.toggle("show");
}

window.toggleMenu = toggleMenu;
document.addEventListener("click", function (e) {
    const menu = document.getElementById("menuPanel");

    if (
        menu.classList.contains("show") &&
        !menu.contains(e.target) &&
        !e.target.closest('[onclick="toggleMenu()"]')
    ) {
        menu.classList.remove("show");
    }
});
checkAuth(async (user) => {

    const menuUsername = document.getElementById("menuUsername");
    const menuAvatar = document.getElementById("menuAvatar");

    if (!menuUsername) return;

    if (user) {

        try {

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                const userData = docSnap.data();

                // ==============================
                // LOAD USERNAME
                // ==============================

                if (userData.username) {

                    menuUsername.textContent =
                        userData.username;

                } else {

                    menuUsername.textContent =
                        user.displayName ||
                        user.email.split("@")[0];

                }


                // ==============================
                // LOAD SAVED AVATAR
                // ==============================

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

    } else {

        menuUsername.textContent = "Guest";

        if (menuAvatar) {
            menuAvatar.src =
                "avatars/avatar1.png";
        }

    }

});
window.closeModal = closeModal;
window.changeServer = changeServer;
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.searchTMDB = searchTMDB;

function toggleProfileMenu() {
    const submenu = document.getElementById("profileSubMenu");

    if (!submenu) return;

    submenu.classList.toggle("show");
}

window.toggleProfileMenu = toggleProfileMenu;
