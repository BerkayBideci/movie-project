'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".movie-container");

let movies = [];
let genres = [];
let currentFilter = 'now_playing'; // Initialize currentFilter with a default value



// Don't touch this function please
const autorun = async () => {
  await fetchMovies(currentFilter); // Pass the currentFilter as an argument
  await fetchGenres();
  renderMovies(movies);
  renderGenres();
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


// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
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

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchGenres = async () => {
  const url = constructUrl('genre/movie/list');
  const res = await fetch(url);
  const data = await res.json();
  genres = data.genres;
  return movies;
};

// You'll need to play with this function in order to add features and enhance the style.
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

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = async (movie) => {
  console.log(movie)
  let similar = await similarDetails(movie);
  let slicedSimilar = similar.results.splice(0, 10);
  let acts = await actorsDetails(movie);
  let slicedActs = acts.cast.splice(0, 10)
  let video = await videoDetails(movie)
  console.log(video, "video")
  const director = acts.crew.find(item => item.name)
  CONTAINER.innerHTML = `
    <div class="container mx-auto ">
        <div>
             <img id="movie-backdrop" class="mx-auto rounded-lg" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="">
            <h1 id="movie-title" class='text-4xl font-bold text-center'>${movie.title}</h1>
            <div class="text-center">
            <h3 class='font-bold'>Vote Count</h3>
            <p id="movie-release-date">${movie.vote_count}</p>
            </div>
            <div class="text-center">
            <h3 class='font-bold'>Vote Average</h3>
            <p id="movie-release-date">${movie.vote_average}</p>
            </div>
            <div class="text-center">
            <h3 class='font-bold'>Release Date</h3>
            <p id="movie-release-date">${movie.release_date}</p>
            </div>
            <div class="text-center">
            <h3 class='font-bold'>Runtime</h3>
            <p id="movie-runtime">${movie.runtime} Minutes</p>
            </div>
            <div class="text-center">
            <h3 class='font-bold'>Language</h3>
            <p> ${movie.original_language.toUpperCase()}  </p>
            </div>
            <div class="text-center director">
            </div>
            <div class="iframe">
            </div>
            <div class="text-center">
            <h3 class='font-bold'>Overview</h3>
            <p id="movie-overview">${movie.overview}</p>
            </div>
        </div>
        </div>
            <h3 class='text-3xl font-bold'>Actors:</h3>
            <ul id="actors" class="container flex flex-wrap space-x-12   gap-y-6 py-6">
            ${slicedActs.map(actor => `
              <li class="actor">
                <img width='100' height='100' class='rounded-full' src=${BACKDROP_BASE_URL + actor.profile_path} alt='${actor.name}'>
                <p class=''> ${actor.name} </p>
              </li>
            `).join('')}
            </ul>
            <h3 class='text-3xl font-bold'>Similar Movies</h3>
            <ul id="actors" class="container flex flex-wrap space-x-12  gap-y-6 py-6">
                ${slicedSimilar.map(similar => `
                <li class="similar-movie">
                <img width='150' height='150' class='rounded-full' src=${BACKDROP_BASE_URL + similar.backdrop_path} alt='${similar.title}'>
                <p class=''> ${similar.title} </p>
              </li>
                `).join('')}
            </ul>
            <h3 class='text-3xl font-bold'>Production Companies</h3>
            <ul class="container flex flex-wrap space-x-12 gap-y-6 py-6 production-logo">
            </ul>
    </div>`;

  const similarMovieDiv = document.querySelectorAll('.similar-movie');
  similarMovieDiv.forEach((element, index) => {
    element.addEventListener('click', () => {
      movieDetails(slicedSimilar[index]);
    });
  })



  const actorDiv = document.querySelectorAll('.actor');
  actorDiv.forEach((element, index) => {
    element.addEventListener('click', () => {
      renderActor(slicedActs[index]);
    });
  })

  const directorDiv = document.querySelector(".director")
  if (director.name) {
    directorDiv.innerHTML = `<h3 class='font-bold'>Director</h3>
            <p> ${director.name} </p>`
  }

  const iframe = document.querySelector(".iframe")
  if (video.results !== []) {
    iframe.innerHTML = `<iframe width="560" height="315" class="mx-auto iframe" src="https://www.youtube.com/embed/${video.results[0].key}" title="YouTube video player" referrerpolicy="no-referrer-when-downgrade" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
    </iframe>`
  }

  const productionLogo = document.querySelector(".production-logo")
  if (movie.production_companies[0].logo_path) {
    productionLogo.innerHTML = `<li>
                <img width='200' height='200'  src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path} alt='${movie.name}'>
              </li>`
  }
};

const renderActor = async (actor) => {
  actor = await actorDetails(actor)
  console.log(actor)
  let movies = await fetchActorRelatedMovies(actor.id)
  let slicedMovies = movies.cast.splice(0, 10)
  let gender;
  if (actor.gender === 1) {
    gender = "Female"
  } else if (actor.gender === 2) {
    gender = "Male"
  }
  CONTAINER.innerHTML = `
    <div class="container mx-auto ">
        <div class="text-center">
             <img width='200' height='200' class="rounded-full mx-auto" src=${BACKDROP_BASE_URL + actor.profile_path} alt='${actor.name}'>
             <p id="movie-release-date"><b>${actor.name}</b></p>
             <p><b>Gender</b></p>
             <p>${gender}</p>
             <ul id="movie-release-date"><b>Also Known As</b> ${actor.also_known_as.map(aka => `<li>${aka}</li>`).join("")}</ul>
             <p><b>Popularity</b></p>
             <p>${actor.popularity}</p>
             <p id="movie-release-date"><b>Birthday:</b> ${actor.birthday}</p>
             <div class="deathday"></div>
             <p id="movie-release-date"><b>Place of Birth:</b> ${actor.place_of_birth}</p>
             <p id="movie-release-date"><b>Biography:</b> ${actor.biography}</p>
             <h3 class='text-3xl font-bold'>Related Movies</h3>
             <ul class="container flex flex-wrap space-x-12 gap-y-6 py-6">
                ${slicedMovies.map(related => `
                <li class='related-movie'>
                <img width='150' height='150' class='rounded-full' src=${BACKDROP_BASE_URL + related.backdrop_path} alt='${related.title}'>
                <p class=''> ${related.title} </p>
              </li>
                `).join('')}
            </ul>
        </div>`
  const relatedMovieImages = document.querySelectorAll('.related-movie');
  relatedMovieImages.forEach((image, index) => {
    image.addEventListener('click', () => {
      movieDetails(slicedMovies[index]);
    });
  })

  const deathday = document.querySelector(".deathday")
  if (actor.deathday !== null) {
    deathday.innerHTML = `<p><b>Deathday:</b> ${actor.deathday}</p>`
  }
};


document.addEventListener("DOMContentLoaded", autorun);


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



// fetching movie video details 
const fetchMovieVideo = async (movie) => {
  const url = constructUrl(`movie/${movie}/videos`)
  const res = await fetch(url)
  return res.json()
}

const videoDetails = async (movie) => {
  const movieRes = await fetchMovieVideo(movie.id)
  return movieRes
}

// fetching actors' details 
const fetchActorDetails = async (actor) => {
  const url = constructUrl(`person/${actor}`)
  const res = await fetch(url)
  return res.json()
}

const actorDetails = async (actor) => {
  const actorRes = await fetchActorDetails(actor.id)
  return actorRes
}

// fetching actor's related movies
const fetchActorRelatedMovies = async (actor) => {
  const url = constructUrl(`person/${actor}/combined_credits`)
  const res = await fetch(url)
  return res.json()
}

const actorRelatedMovieDetails = async (actor) => {
  const actorRelatedMoviesRes = await fetchActorRelatedMovies(actor.id)
  return actorRelatedMoviesRes
}

// fetching actors
const fetchActors = async (actor) => {
  const url = constructUrl(`movie/${actor}/credits`);
  const res = await fetch(url);
  return res.json();
}

const actorsDetails = async (movie) => {
  const actorRes = await fetchActors(movie.id);
  return actorRes;
};

// fetching similar movies
const fetchSimilar = async (similar) => {
  const url = constructUrl(`/movie/${similar}/similar`);
  const res = await fetch(url);
  return res.json();
};

const similarDetails = async (movie) => {
  const similarRes = await fetchSimilar(movie.id);
  return similarRes
}