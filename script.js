'use strict';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.movie-container');

let movies = [];
let genres = [];
let currentFilter = 'now_playing'; // Initialize currentFilter with a default value


const autorun = async () => {
  await fetchMovies(currentFilter); // Pass the currentFilter as an argument
  await fetchGenres();
  renderMovies(movies);
  renderGenres();
};

const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=9c7643a821f2dd01a5781799a3e78f7c`;
};

const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchMovies = async (filter) => {
  let url = '';

  switch (filter) {
    case 'now_playing':
      url = constructUrl('movie/now_playing');
      break;
    case 'upcoming':
      url = constructUrl('movie/upcoming');
      break;
    case 'popular':
      url = constructUrl('movie/popular');
      break;
    case 'top_rated':
      url = constructUrl('movie/top_rated');
      break;
    default:
      // Default to 'now_playing' if an invalid filter is provided
      url = constructUrl('movie/now_playing');
  }

  const res = await fetch(url);
  const data = await res.json();
  movies = data.results;
};

const fetchGenres = async () => {
  const url = constructUrl('genre/movie/list');
  const res = await fetch(url);
  const data = await res.json();
  genres = data.genres;
  return movies;
};

const renderMovies = (moviesToRender) => {
  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = '';

  moviesToRender.forEach((movie) => {
    const movieDiv = document.createElement('div');
    movieDiv.innerHTML = `
      <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
      <h3>${movie.title}</h3>
      <p>Genres: ${getGenresString(movie.genre_ids)}</p>`;
    movieDiv.addEventListener('click', async () => {
      await movieDetails(movie);
    });
    movieContainer.appendChild(movieDiv);
  });
};

const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img id="movie-backdrop" src="${BACKDROP_BASE_URL + movie.backdrop_path}">
      </div>
      <div class="col-md-8">
        <h2 id="movie-title">${movie.title}</h2>
        <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
        <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>
      </div>
    </div>
    <h3>Actors:</h3>
    <ul id="actors" class="list-unstyled"></ul>
  `;
};

const renderGenres = () => {
  const genreDropdown = document.querySelector('#genre-dropdown');
  genreDropdown.innerHTML = '';

  const filterDropdown = document.querySelector('#filter-dropdown');
  filterDropdown.innerHTML = '';

  genres.forEach((genre) => {
    const genreLink = document.createElement('a');
    genreLink.href = '#';
    genreLink.textContent = genre.name;
    genreLink.classList.add('hover:bg-yellow-300');
    genreLink.classList.add('hover:text-black');
    genreLink.classList.add('rounded-md');
    genreLink.classList.add('p-1.5');
    genreLink.addEventListener('click', () => {
      filterMoviesByGenre(genre.id);
    });
    genreDropdown.appendChild(genreLink);
  });

  const filterOptions = [
    { label: 'Now Playing', filter: 'now_playing' },
    { label: 'Upcoming', filter: 'upcoming' },
    { label: 'Popular', filter: 'popular' },
    { label: 'Top Rated', filter: 'top_rated' },
  ];

  filterOptions.forEach((option) => {
    const filterLink = document.createElement('a');
    filterLink.href = '#';
    filterLink.textContent = option.label;
    filterLink.classList.add('hover:bg-yellow-300');
    filterLink.classList.add('hover:text-black');
    filterLink.classList.add('rounded-md');
    filterLink.classList.add('p-1.5');
    filterLink.addEventListener('click', () => {
      currentFilter = option.filter; // Update the currentFilter variable
      filterMovies(currentFilter);
      filterOptions.forEach((item) => {
        if (item.filter === option.filter) {
          filterLink.classList.add('active');
        } else {
          const filterItem = document.querySelector(`[data-filter="${item.filter}"]`);
          filterItem.classList.remove('active');
        }
      });
    });

    if (option.filter === currentFilter) {
      filterLink.classList.add('active');
    }

    filterDropdown.appendChild(filterLink);
  });
};

const filterMovies = async (filter) => {
  currentFilter = filter;
  await fetchMovies(currentFilter);
  renderMovies(movies);
};

const filterMoviesByGenre = (genreId) => {
  const selectedGenre = genreId !== 0 ? genreId : null;
  const moviesToShow = movies.filter((movie) => {
    return selectedGenre ? movie.genre_ids.includes(selectedGenre) : true;
  });
  renderMovies(moviesToShow);
};

const getGenresString = (genreIds) => {
  const genreNames = genreIds.map((genreId) => {
    const genre = genres.find((genre) => genre.id === genreId);
    return genre ? genre.name : '';
  });
  return genreNames.join(', ');
};

const hamburgerIcon = document.querySelector('#toggle');
const hamburgerNav = document.querySelector('#ham-nav');

hamburgerIcon.addEventListener('click', e => {
  hamburgerIcon.classList.toggle('change');
  hamburgerNav.classList.toggle('hidden');
});

const genreMenu = document.querySelectorAll(".genre-menu");
const genreDropdown = document.querySelector("#genre-dropdown");
const genreCaret = document.querySelectorAll(".genre-caret");

genreMenu.forEach(menu => {
  menu.addEventListener('click', e => {
    genreDropdown.classList.toggle('hidden');
    menu.classList.toggle('bg-yellow-300');
    menu.classList.toggle('text-black');
    genreCaret.forEach(caret => {
      if (caret.classList.contains('fa-caret-down')) {
        caret.classList.remove('fa-caret-down');
        caret.classList.add('fa-caret-up');
      } else if (caret.classList.contains('fa-caret-up')) {
        caret.classList.remove('fa-caret-up');
        caret.classList.add('fa-caret-down');
      }
    });
  });
});

const filterMenu = document.querySelectorAll(".filter-menu");
const filterDropdown = document.querySelector("#filter-dropdown");
const filterCaret = document.querySelectorAll(".filter-caret");

filterMenu.forEach(menu => {
  menu.addEventListener('click', e => {
    filterDropdown.classList.toggle('hidden');
    menu.classList.toggle('bg-yellow-300');
    menu.classList.toggle('text-black');
    filterCaret.forEach(caret => {
      if (caret.classList.contains('fa-caret-down')) {
        caret.classList.remove('fa-caret-down');
        caret.classList.add('fa-caret-up');
      } else if (caret.classList.contains('fa-caret-up')) {
        caret.classList.remove('fa-caret-up');
        caret.classList.add('fa-caret-down');
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", autorun);

// ACTOR PAGE
const actorPage = document.querySelector('#actor');


const renderActorPage = async (movie) => {
  console.log(movie)
}

const actorPageDetails = async (movie) => {
  const actorRes = await fetchActorPage(movie.id);
  renderActorPage(actorRes);
}

const fetchActorPage = async (actor) => {
  const url = constructUrl(`movie/${actor}/credits`);
  const res = await fetch(url);
  return res.json();
}



