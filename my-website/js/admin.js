import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const form = document.getElementById("movieForm");
const movieList = document.getElementById("movieList");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const tmdbId = Number(document.getElementById("tmdbId").value);
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    try{

        await addDoc(collection(db,"movies"),{

            title,
            tmdbId,
            category,
            description

        });

        alert("Movie Added Successfully!");

        form.reset();

        loadMovies();

    }catch(err){

        alert(err.message);

    }

});

async function loadMovies(){

    movieList.innerHTML="";

    const snapshot = await getDocs(collection(db,"movies"));

    snapshot.forEach(doc=>{

        const movie = doc.data();

        movieList.innerHTML += `
            <div class="movie-card">
                <h3>${movie.title}</h3>
                <p>${movie.category}</p>
                <small>TMDB ID : ${movie.tmdbId}</small>
            </div>
        `;

    });

}

loadMovies();
