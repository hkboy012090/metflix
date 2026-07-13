const API_KEY = '85d06918f5f2d578fd2048c5841b6ee2';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/original';
    let currentItem;
    let searchTimeout;

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
      document.getElementById('modal-description').textContent = item.overview;
      document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
      document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
      changeServer();
      document.getElementById('modal').style.display = 'flex';
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
    document.getElementById("search-modal").style.display = "flex";

    const input = document.getElementById("search-input");

    input.value = "";
    document.getElementById("search-results").innerHTML = "";

    input.focus();

    input.oninput = () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            searchTMDB();
        }, 400);
    };
}

    function closeSearchModal() {
      document.getElementById('search-modal').style.display = 'none';
      document.getElementById('search-results').innerHTML = '';
    }

    async function searchTMDB() {
    const query = document.getElementById("search-input").value.trim();

    const container = document.getElementById("search-results");

    if (!query) {
        container.innerHTML = "";
        return;
    }

        container.innerHTML = `
    <p style="color:white;font-size:18px;">
        Searching...
    </p>
`;
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    container.innerHTML = "";

    const results = data.results.filter(item => item.poster_path);

    if (results.length === 0) {
        container.innerHTML = `
            <p style="color:white;font-size:18px;">
                No results found.
            </p>
        `;
        return;
    }

    results.forEach(item => {

        const card = document.createElement("div");
        card.className = "search-item";

        card.innerHTML = `
            <img src="${IMG_URL}${item.poster_path}" alt="${item.title || item.name}">
            <p>${item.title || item.name}</p>
        `;

        card.onclick = () => {
            closeSearchModal();
            showDetails(item);
        };

        container.appendChild(card);

    });
}

    async function init() {
  const movies = await fetchTrending('movie');
  const tvShows = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();
  const vivamax = await fetchVivamax();

  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
  displayList(vivamax, 'vivamax-list');
}

init();
// ===== NETFLIX SLIDER =====

function slideLeft(id) {
    const slider = document.getElementById(id);

    slider.scrollBy({
        left: -800,
        behavior: "smooth"
    });
}

function slideRight(id) {
    const slider = document.getElementById(id);

    slider.scrollBy({
        left: 800,
        behavior: "smooth"
    });
}

// ===== HAMBURGER MENU =====

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
}
