import { checkAuth } from "./auth.js";

/* ===========================
CONFIG
=========================== */

const API_KEY = "85d06918f5f2d578fd2048c5841b6ee2";

const BASE_URL = "https://api.themoviedb.org/3";

const IMG_URL = "https://image.tmdb.org/t/p/original";

/* ===========================
URL PARAMS
=========================== */

const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");

const mediaType = params.get("type") || "movie";

let currentMovie = null;

/* ===========================
AUTH
=========================== */

checkAuth((user)=>{

if(!user){

window.location.href="login.html";

}

});

/* ===========================
ELEMENTS
=========================== */

const loadingScreen=document.getElementById("loadingScreen");

const errorScreen=document.getElementById("errorScreen");

const backdropImage=document.getElementById("backdropImage");

const posterImage=document.getElementById("posterImage");

const movieTitle=document.getElementById("movieTitle");

const movieDescription=document.getElementById("movieDescription");

const movieYear=document.getElementById("movieYear");

const movieRuntime=document.getElementById("movieRuntime");

const movieLanguage=document.getElementById("movieLanguage");

const movieRating=document.getElementById("movieRating");

const movieGenres=document.getElementById("movieGenres");

const releaseDate=document.getElementById("releaseDate");

const movieStatus=document.getElementById("movieStatus");

const originalLanguage=document.getElementById("originalLanguage");

const moviePopularity=document.getElementById("moviePopularity");

const castList=document.getElementById("castList");

const recommendList=document.getElementById("recommendList");

const player=document.getElementById("moviePlayer");

const backBtn=document.getElementById("backBtn");

const backHomeBtn=document.getElementById("backHomeBtn");

/* ===========================
BUTTONS
=========================== */

backBtn.onclick=()=>history.back();

backHomeBtn.onclick=()=>{

window.location.href="index.html";

};

/* ===========================
LOADING
=========================== */

function hideLoading(){

loadingScreen.classList.add("hide");

}

function showError(){

loadingScreen.classList.add("hide");

errorScreen.style.display="flex";

}
/* ===========================
LOAD MOVIE
=========================== */

async function loadMovie(){

try{

const response=await fetch(

`${BASE_URL}/${mediaType}/${movieId}?api_key=${API_KEY}&append_to_response=credits,recommendations`

);

if(!response.ok){

throw new Error("Movie not found");

}

const movie=await response.json();

currentMovie=movie;


/* ===========================
BACKDROP
=========================== */

backdropImage.src=movie.backdrop_path
?IMG_URL+movie.backdrop_path
:"";


/* ===========================
POSTER
=========================== */

posterImage.src=movie.poster_path
?IMG_URL+movie.poster_path
:"";


/* ===========================
TITLE
=========================== */

movieTitle.textContent=

movie.title||movie.name;


/* ===========================
DESCRIPTION
=========================== */

movieDescription.textContent=

movie.overview||

"No description available.";


/* ===========================
YEAR
=========================== */

const release=

movie.release_date||

movie.first_air_date||

"";

movieYear.textContent=

release

?release.substring(0,4)

:"N/A";


/* ===========================
RUNTIME
=========================== */

if(mediaType==="movie"){

movieRuntime.textContent=

movie.runtime

?`${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m`

:"N/A";

}else{

movieRuntime.textContent=

`${movie.number_of_seasons} Season`;

}


/* ===========================
LANGUAGE
=========================== */

movieLanguage.textContent=

(movie.original_language||"").toUpperCase();


/* ===========================
RATING
=========================== */

movieRating.textContent=

movie.vote_average

?movie.vote_average.toFixed(1)

:"0.0";


/* ===========================
GENRES
=========================== */

movieGenres.innerHTML="";

(movie.genres||[]).forEach(genre=>{

const tag=document.createElement("span");

tag.textContent=genre.name;

movieGenres.appendChild(tag);

});


/* ===========================
DETAILS
=========================== */

releaseDate.textContent=

release||"N/A";

movieStatus.textContent=

movie.status||"N/A";

originalLanguage.textContent=

(movie.original_language||"").toUpperCase();

moviePopularity.textContent=

Math.round(movie.popularity||0);

/* ===========================
PLAYER
=========================== */

loadPlayer();

loadCast(movie.credits?.cast || []);

loadRecommendations(movie.recommendations?.results || []);

hideLoading();

}catch(err){

console.error(err);

showError();

}

}


/* ===========================
PLAYER
=========================== */

function loadPlayer(){

changeServer();

}


/* ===========================
SERVER
=========================== */

function changeServer(){

if(!currentMovie)return;

const server=document.getElementById("server").value;

let url="";

switch(server){

case "vidfast":

url=`https://vidfast.pro/${mediaType}/${currentMovie.id}`;

break;

case "multiembed":

url=`https://multiembed.mov/?video_id=${currentMovie.id}&tmdb=1`;

break;

case "2embed":

url=`https://www.2embed.cc/embed/${currentMovie.id}`;

break;

case "vidsrc.cc":

url=`https://vidsrc.cc/v2/embed/${mediaType}/${currentMovie.id}`;

break;

case "vidsrc.me":

url=`https://vidsrc.me/embed/${mediaType}?tmdb=${currentMovie.id}`;

break;

case "player.videasy.net":

url=`https://player.videasy.net/${mediaType}/${currentMovie.id}`;

break;

default:

url=`https://vidfast.pro/${mediaType}/${currentMovie.id}`;

}

player.src=url;

}

window.changeServer=changeServer;


/* ===========================
WATCH BUTTON
=========================== */

document.getElementById("watchNowBtn")?.addEventListener("click",()=>{

document.querySelector(".player-section").scrollIntoView({

behavior:"smooth"

});

});


/* ===========================
CAST
=========================== */

function loadCast(cast){

castList.innerHTML="";

cast.slice(0,12).forEach(actor=>{

const image=actor.profile_path

?IMG_URL+actor.profile_path

:"https://via.placeholder.com/300x450?text=No+Image";

castList.innerHTML+=`

<div class="cast-card">

<img src="${image}" alt="${actor.name}">

<div class="cast-info">

<h4>${actor.name}</h4>

<p>${actor.character||""}</p>

</div>

</div>

`;

});

}


/* ===========================
RECOMMENDATIONS
=========================== */

function loadRecommendations(list){

recommendList.innerHTML="";

list.slice(0,12).forEach(item=>{

if(!item.poster_path)return;

recommendList.innerHTML+=`

<div class="movie-card"

onclick="location.href='watch.html?id=${item.id}&type=${item.media_type||mediaType}'">

<img src="${IMG_URL}${item.poster_path}">

<div class="movie-name">

${item.title||item.name}

</div>

<div class="movie-score">

⭐ ${item.vote_average.toFixed(1)}

</div>

</div>

`;

});

}


/* ===========================
START
=========================== */

if(movieId){

loadMovie();

}else{

showError();

}
