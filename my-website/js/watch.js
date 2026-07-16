import { checkAuth } from "./auth.js";

const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");
const mediaType = params.get("type") || "movie";

let currentMovie = null;

// -------------------------
// HTML Elements
// -------------------------

const loadingScreen = document.getElementById("loadingScreen");
const errorScreen = document.getElementById("errorScreen");

const backdropImage = document.getElementById("backdropImage");
const posterImage = document.getElementById("posterImage");

const movieTitle = document.getElementById("movieTitle");
const movieDescription = document.getElementById("movieDescription");
const movieYear = document.getElementById("movieYear");
const movieRuntime = document.getElementById("movieRuntime");
const movieLanguage = document.getElementById("movieLanguage");
const movieRating = document.getElementById("movieRating");

const movieGenres = document.getElementById("movieGenres");

const releaseDate = document.getElementById("releaseDate");
const movieStatus = document.getElementById("movieStatus");
const originalLanguage = document.getElementById("originalLanguage");
const moviePopularity = document.getElementById("moviePopularity");

const player = document.getElementById("moviePlayer");

const castList = document.getElementById("castList");
const recommendList = document.getElementById("recommendList");

const backBtn = document.getElementById("backBtn");
const backHomeBtn = document.getElementById("backHomeBtn");

// -------------------------
// Login Check
// -------------------------

checkAuth((user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

// -------------------------
// Back Buttons
// -------------------------

backBtn.onclick = () => {

    history.back();

};

backHomeBtn.onclick = () => {

    window.location.href = "index.html";

};

// -------------------------
// Loading
// -------------------------

function hideLoading(){

    loadingScreen.classList.add("hide");

}

function showError(){

    loadingScreen.classList.add("hide");

    errorScreen.style.display="flex";

}
