import { VIVAMAX_IDS } from "./vivamax-data.js";
const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search");

let allMovies = [];

async function loadVivamaxMovies() {

    movieGrid.innerHTML = "<h2>Loading...</h2>";

    allMovies = [];

    for (const id of VIVAMAX_IDS) {

        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );

        if (res.ok) {
            const movie = await res.json();
            allMovies.push(movie);
        }

    }

    displayMovies(allMovies);

}

function displayMovies(list){

    movieGrid.innerHTML="";

    list.forEach(movie=>{

        movieGrid.innerHTML += `
        <div class="movie-card" onclick="location.href='watch.html?id=${movie.id}&type=movie'">
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'no-poster.png'}">
            <h3>${movie.title}</h3>
        </div>
        `;

    });

}

async function searchVivamax() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {
        displayMovies(allMovies);
        return;
    }

    try {

        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(keyword)}`
        );

        const data = await res.json();

        const results = data.results;

        displayMovies(results);

    } catch (error) {
        console.error("Search Error:", error);
    }

}

searchInput.addEventListener("input", searchVivamax);
loadVivamaxMovies();
