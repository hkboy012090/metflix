const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieGrid = document.getElementById("movie-grid");
const searchInput = document.getElementById("search");

let allMovies = [];

async function loadVivamaxMovies() {

    movieGrid.innerHTML = "<h2>Loading...</h2>";

    let movies = [];

    for(let page=1; page<=5; page++){

        const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`
        );

        const data = await res.json();

        movies = movies.concat(data.results);
    }

    // Placeholder filter
    allMovies = movies.filter(movie =>
        movie.original_language === "tl"
    );

    displayMovies(allMovies);

}

function displayMovies(list){

    movieGrid.innerHTML="";

    list.forEach(movie=>{

        movieGrid.innerHTML += `
        <div class="movie-card">
            <img src="${IMG_URL}${movie.poster_path}">
            <h3>${movie.title}</h3>
        </div>
        `;

    });

}

searchInput.addEventListener("input",()=>{

    const keyword = searchInput.value.toLowerCase();

    const filtered = allMovies.filter(movie=>
        movie.title.toLowerCase().includes(keyword)
    );

    displayMovies(filtered);

});

loadVivamaxMovies();
