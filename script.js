'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".movie-container");

// // Don't touch this function please
// const autorun = async () => {
//   const movies = await fetchMovies();
//   renderMovies(movies.results);
// };

const autorun = async () => {
  const genres = await fetchGenres(); // Fetch genres first
  renderGenres(genres);
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${'9c7643a821f2dd01a5781799a3e78f7c'}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies by genre
const fetchMoviesByGenre = async (genreId) => {
  const url = constructUrl(`discover/movie?with_genres=${genreId}`);
  const res = await fetch(url);
  const data = await res.json();
  renderMovies(data.results);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

// Fetch and render genre options in the navbar
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  const data = await res.json();
  renderGenres(data.genres);
};

const renderGenres = (genres) => {
  const genreNav = document.querySelector("#genre-nav");
  const genreDropdown = document.querySelector("#genre-dropdown");

  genres.forEach((genre) => {
    const genreItem = document.createElement("li");
    genreItem.innerText = genre.name;
    genreItem.addEventListener("click", () => {
      fetchMoviesByGenre(genre.id);
      genreDropdown.classList.add("hidden");
    });
    genreNav.appendChild(genreItem);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchGenres();
  autorun();
});

// hamburger menu manipulation 
const hamburgerIcon = document.querySelector('#toggle');
const hamburgerNav = document.querySelector('#ham-nav');

hamburgerIcon.addEventListener('click', e => {
  hamburgerIcon.classList.toggle('change');
  hamburgerNav.classList.toggle('hidden');

})

// genre menu manipulation 
const genreMenu = document.querySelectorAll(".genre-menu")
const genreDropdown = document.querySelector("#genre-dropdown")
const genreCaret = document.querySelectorAll(".genre-caret")

genreMenu.forEach(menu => {
  menu.addEventListener('click', e => {
    genreDropdown.classList.toggle('hidden')
    menu.classList.toggle('bg-yellow-300')
    menu.classList.toggle('text-black')
    genreCaret.forEach(caret => {
      if (caret.classList.contains('fa-caret-down')) {
        caret.classList.remove('fa-caret-down')
        caret.classList.add('fa-caret-up')
      }
      else if (caret.classList.contains('fa-caret-up')) {
        caret.classList.remove('fa-caret-up')
        caret.classList.add('fa-caret-down')
      }
    })
  })
})

// filter menu manipulation 
const filterMenu = document.querySelectorAll(".filter-menu")
const filterDropdown = document.querySelector("#filter-dropdown")
const filterCaret = document.querySelectorAll(".filter-caret")

filterMenu.forEach(menu => {
  menu.addEventListener('click', e => {
    filterDropdown.classList.toggle('hidden')
    menu.classList.toggle('bg-yellow-300')
    menu.classList.toggle('text-black')
    filterCaret.forEach(caret => {
      if (caret.classList.contains('fa-caret-down')) {
        caret.classList.remove('fa-caret-down')
        caret.classList.add('fa-caret-up')
      }
      else if (caret.classList.contains('fa-caret-up')) {
        caret.classList.remove('fa-caret-up')
        caret.classList.add('fa-caret-down')
      }
    })
  })
})