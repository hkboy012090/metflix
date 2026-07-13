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
const res = await fetch(${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page});
const data = await res.json();
const filtered = data.results.filter(item =>
item.original_language === 'ja' && item.genre_ids.includes(16)
);
allResults = allResults.concat(filtered);
}

return allResults;
}
async function fetchVivamax() {

const ids = [  
    1122716,  
    1113612,  
    1104787,  
    1006911,  
    1044524,  
    1067623,  
    1015293,  
    1016452,  
    994108,  
    975937  
];  

const movies = [];  

for (const id of ids) {  

    try {  

        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);  
        const data = await res.json();  

        if (data.poster_path) {  
movies.push(data);

}

} catch (e) {  
        console.log(e);  
    }  

}  

return movies;

}

function displayBanner(item) {  
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;  
  document.getElementById('banner-title').textContent = item.title || item.name;  
}  

function displayList(items, containerId) {  
  const container = document.getElementById(containerId);  
  container.innerHTML = '';  
  items.forEach(item => {  
    const img = document.createElement('img');  
    img.src = `${IMG_URL}${item.poster_path}`;  
    img.alt = item.title || item.name;  
    img.onclick = () => showDetails(item);  
    container.appendChild(img);  
  });  
}  

function showDetails(item) {  
  currentItem = item;  
  document.getElementById('modal-title').textContent = item.title || item.name;
