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

// -------------------------
// Load Movie
// -------------------------

async function loadMovie() {

    try {

        const url = `${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}&append_to_response=credits,recommendations`;

alert(url);

const response = await fetch(url);

alert("Status: " + response.status);

        if (!response.ok) {

            throw new Error("Movie not found");

        }

        const movie = await response.json();

        alert(movie.title || movie.name);
        currentMovie = movie;

        // Backdrop

        backdropImage.src = movie.backdrop_path
            ? IMG_URL + movie.backdrop_path
            : "";

        // Poster

        posterImage.src = movie.poster_path
            ? IMG_URL + movie.poster_path
            : "";

        // Title

        movieTitle.textContent =
            movie.title || movie.name;

        // Description

        movieDescription.textContent =
            movie.overview || "No description available.";

        // Year

        const date =
            movie.release_date ||
            movie.first_air_date ||
            "";

        movieYear.textContent =
            date ? date.substring(0, 4) : "N/A";

        // Runtime

        if (mediaType === "movie") {

            movieRuntime.textContent =
                movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                    : "N/A";

        } else {

            movieRuntime.textContent =
                `${movie.number_of_seasons} Season`;

        }

        // Language

        movieLanguage.textContent =
            (movie.original_language || "").toUpperCase();

        // Rating

        movieRating.textContent =
            movie.vote_average.toFixed(1);

        // Genres

        movieGenres.innerHTML = "";

        movie.genres.forEach(genre => {

            const span = document.createElement("span");

            span.textContent = genre.name;

            movieGenres.appendChild(span);

        });

        // Details

        releaseDate.textContent =
            date || "N/A";

        movieStatus.textContent =
            movie.status || "N/A";

        originalLanguage.textContent =
            movie.original_language;

        moviePopularity.textContent =
            Math.round(movie.popularity);

        // Load Other Sections

        loadPlayer();

        loadCast(movie.credits.cast);

        loadRecommendations(movie.recommendations.results);

        hideLoading();

    } catch (err) {

    alert(err);

    console.error(err);

    showError();

}

}

// -------------------------
// PLAYER
// -------------------------

function loadPlayer() {

    if (!currentMovie) return;

    changeServer();

}

// -------------------------
// CHANGE SERVER
// -------------------------

function changeServer() {

    if (!currentMovie) return;

    const server = document.getElementById("server").value;

    let embedURL = "";

    if (server === "vidsrc.cc") {

        embedURL =
            `https://vidsrc.cc/v2/embed/${mediaType}/${currentMovie.id}`;

    }

    else if (server === "vidsrc.me") {

        embedURL =
            `https://vidsrc.net/embed/${mediaType}/?tmdb=${currentMovie.id}`;

    }

    else if (server === "player.videasy.net") {

        embedURL =
            `https://player.videasy.net/${mediaType}/${currentMovie.id}`;

    }

    player.src = embedURL;

}

// -------------------------
// WATCH BUTTON
// -------------------------

const watchNowBtn = document.getElementById("watchNowBtn");

if (watchNowBtn) {

    watchNowBtn.addEventListener("click", () => {

        document.querySelector(".player-section")
            .scrollIntoView({

                behavior: "smooth"

            });

    });

}

window.changeServer = changeServer;

// -------------------------
// LOAD CAST
// -------------------------

function loadCast(cast) {

    castList.innerHTML = "";

    if (!cast || cast.length === 0) {

        castList.innerHTML = "<p>No cast available.</p>";

        return;

    }

    cast.slice(0, 12).forEach(actor => {

        const card = document.createElement("div");

        card.className = "cast-card";

        const image = actor.profile_path
            ? IMG_URL + actor.profile_path
            : "https://via.placeholder.com/300x450?text=No+Image";

        card.innerHTML = `

            <img src="${image}" alt="${actor.name}">

            <div class="cast-info">

                <h4>${actor.name}</h4>

                <p>${actor.character || ""}</p>

            </div>

        `;

        castList.appendChild(card);

    });

}

// -------------------------
// LOAD RECOMMENDATIONS
// -------------------------

function loadRecommendations(movies) {

    recommendList.innerHTML = "";

    if (!movies || movies.length === 0) {

        recommendList.innerHTML = "<p>No recommendations available.</p>";

        return;

    }

    movies.slice(0, 12).forEach(movie => {

        if (!movie.poster_path) return;

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `

            <img
                src="${IMG_URL}${movie.poster_path}"
                alt="${movie.title || movie.name}"
            >

            <div class="movie-name">

                ${movie.title || movie.name}

            </div>

            <div class="movie-score">

                ⭐ ${movie.vote_average.toFixed(1)}

            </div>

        `;

        card.onclick = () => {

            const type = movie.media_type || mediaType;

            window.location.href =
                `watch.html?id=${movie.id}&type=${type}`;

        };

        recommendList.appendChild(card);

    });

}

// -------------------------
// START
// -------------------------

if (!movieId) {

    showError();

} else {

    loadMovie();

}



