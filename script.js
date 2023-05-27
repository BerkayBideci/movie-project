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
  return data;
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
    movieDiv.classList.add('cursor-pointer');
    movieDiv.innerHTML = `
      <img class='transition shadow-xl shadow-slate-900 opacity-80 hover:opacity-100 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' height='400' width='400' src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
      <div class='space-y-2 pt-3'>
        <h3 class='text-2xl font-bold'>${movie.title}</h3>
        <p class='text-sm text-slate-400'>Genres: ${getGenresString(movie.genre_ids)}</p>
      </div>
      `;
    movieDiv.addEventListener('click', async () => {
      await movieDetails(movie);
    });
    movieContainer.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = async (movie) => {
  // similar movies 
  let similar = await similarDetails(movie);
  let slicedSimilar = similar.results.splice(0, 5);
  // actors who play in related movie
  let acts = await actorsDetails(movie);
  let slicedActs = acts.cast.splice(0, 5)
  const director = acts.crew.find(item => item.name)
  //trailer movie 
  const trailer = await trailerDetails(movie);

  CONTAINER.innerHTML = `
  <div class="container mx-auto">
    <div class="flex items-center justify-center">
      <img id="movie-backdrop" class='text-center' src=${BACKDROP_BASE_URL + movie.backdrop_path}>
    </div>
    <h1 id="movie-title" class='text-4xl font-bold text-center py-3 lg:text-6xl'>${movie.title}</h1>
    <div class="container flex flex-col space-y-12   md:flex-row md:space-x-12 md:space-y-0">
      <div class="left w-1/2 space-y-4 text-xl">  
          <h1 id="movie-title" class='text-4xl font-bold text-center'>Preface</h1>
          <div class='flex  space-x-3 pt-7 justify-center  '>
            <h3 class='font-bold '>Vote Count</h3>
            <p id="movie-release-date" class='text-slate-400'>${movie.vote_count}</p>
          </div>
          <div class='flex space-x-3 justify-center'>
            <h3 class='font-bold '>Vote Average</h3>
            <p id="movie-release-date" class='text-slate-400'>${movie.vote_average}</p>
          </div>
          <div class='flex space-x-3 justify-center'>
            <h3 class='font-bold'>Release Date</h3>
            <p id="movie-release-date" class='text-slate-400'>${movie.release_date}</p>
          </div>
          <div class='flex space-x-3 justify-center'>
            <h3 class='font-bold'>Runtime</h3>
            <p id="movie-runtime" class='text-slate-400'>${movie.runtime} Minutes</p>
            </div>
          <div class='flex space-x-3 justify-center '>
            <h3 class='font-bold'>Language</h3>
            <p class='text-slate-400'>  ${movie.original_language.toUpperCase()}  </p>
          </div>
          <div class='flex space-x-3 justify-center '>
            <h3 class='font-bold'>Director:</h3>
            <p class='text-slate-400'> ${director.name} </p>
          </div>
      </div>
      
      <div class="right w-1/2 text-center">
        <h1 class='text-4xl font-bold pb-4 text-center'>Trailer</h1>
        <div>
        ${
          trailer.results && trailer.results.length > 0 && trailer.results[0].key
            ? `<div class='pl-6'>
                 <iframe class='ml-6 shadow-xl shadow-slate-900' width="83%" height="275" src="https://www.youtube.com/embed/${trailer.results[0].key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                 <figcaption class="overlay"></figcaption>
               </div>`
            : `<p>No trailer available</p>`
        }
        </div>
      </div>
    </div>

    <div class='space-y-3 pt-12 text-center'>
        <div id="Actors">
          <h3 class='text-4xl font-bold'>Actors</h3>
          <ul id="actors" class="container flex flex-wrap space-x-12 justify-center gap-y-6 py-6">
          ${slicedActs.map(actor => `
            <li class='cursor-pointer actor'>
              <img width='150' height='100' class='rounded-full shadow-xl shadow-slate-900 opacity-80 hover:opacity-100 rounded-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' src=${BACKDROP_BASE_URL + actor.profile_path} alt='${actor.name}'>
              <p class='font-bold pt-2 text-slate-400'> ${actor.name} </p>
            </li>
          `).join('')}
          </ul>
        </div>
        <div id="relatedMovies">
          <h3 class='text-4xl font-bold'>Similar Movies</h3>
          <ul id="actors" class="container flex flex-wrap space-x-12 justify-center gap-y-6 py-6">
              ${slicedSimilar.map(similar => `
            <li class='cursor-pointer similar-movie'>
              <img width='300' height='300' class='rounded-full shadow-xl shadow-slate-900 opacity-80 hover:opacity-100 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' src=${BACKDROP_BASE_URL + similar.backdrop_path} alt='${similar.title}'>
              <p class='font-bold pt-2 text-slate-400'> ${similar.title} </p>
            </li>
              `).join('')}
          </ul>
        </div>
        <div id="relatedMovies">
          <h3 class='text-4xl font-bold'>Production Companies</h3>
          <ul id="actors" class="container flex flex-wrap space-x-12 justify-center gap-y-6 py-6">
              ${`
            <li class='cursor-pointer'>
              <img width='200' height='200' class='transition  opacity-80 hover:opacity-100 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' src=${BACKDROP_BASE_URL + movie.production_companies[0].logo_path} alt='${movie.name}'>
            </li>
              `}
          </ul>
        </div>
    </div>
    </div>
   `;

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
};

const fetchTrailer = async (trailer) => {
  const url = constructUrl(`movie/${trailer}/videos`);
  const res = await fetch(url);
  return res.json();
}

const trailerDetails = (movie) => {
  const trailerRes = fetchTrailer(movie.id);
  return trailerRes;
}

const renderActor = async (actor) => {
  actor = await actorDetails(actor)
  let movies = await fetchActorRelatedMovies(actor.id)
  let slicedMovies = movies.cast.splice(0, 5)
  let gender;
  if (actor.gender === 1) {
    gender = "Female"
  } else if (actor.gender === 2) {
    gender = "Male"
  }
  CONTAINER.innerHTML = `
    <div class="container mx-auto ">
        <div class="flex flex-col space-y-2 items-center text-center text-xl">
             <img width='200' height='200' class="rounded-full shadow-xl shadow-slate-900 mx-auto" src=${BACKDROP_BASE_URL + actor.profile_path} alt='${actor.name}'>
             <h3 id="movie-release-date" class='text-6xl py-2 font-bold'><b>${actor.name}</b></h3>
             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Gender</h3>
              <p class='text-slate-400'>${gender}</p>
             </div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Also Known As</h3>
              <p class='text-slate-400'>${actor.also_known_as[0]}</p>
             </div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Popularity</h3>
              <p class='text-slate-400'>${actor.popularity}</p>
             </div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Birthday</h3>
              <p class='text-slate-400'>${actor.birthday}</p>
             </div>

             <div class="deathday"></div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Place of Birth</h3>
              <p class='text-slate-400'>${actor.place_of_birth}</p>
             </div>

             <div class='flex space-x-3 justify-center w-1/2 '>
              <h3 class='font-bold'>Biography</h3>
              <p class='text-slate-400'>${actor.biography}</p>
             </div>
             <h3 class='text-3xl font-bold py-3'>Related Movies</h3>
             <ul class="container flex flex-wrap cursor-pointer space-x-12 justify-center gap-y-6 py-6">
                ${slicedMovies.map(related => `
                <li class='related-movie'>
                <img width='300' height='300' class='rounded-full shadow-xl shadow-slate-900 opacity-80 hover:opacity-100 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' src=${BACKDROP_BASE_URL + related.backdrop_path} alt='${related.title}'>
                <p class='pt-2 font-bold text-slate-400'> ${related.title} </p>
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
    deathday.innerHTML = `
    <h3 class='font-bold'>Deathday</h3>
    <p class='text-slate-400'>${actor.deathday}</p>
    `
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


// ACTOR PAGE
const actorPage = document.querySelectorAll('.actorsPage');
actorPage.forEach(actorPage => actorPage.addEventListener('click', async (e) => {
  let actors = await fetchActorPage();
  console.log(actors)
  CONTAINER.innerHTML = `
  <div class='flex space-x-6 flex-wrap items-center justify-center gap-6 py-3'>
  ${actors.results.map(actor => {
    return `
    
    <div class='single-actor  flex flex-col  space-y-4 cursor-pointer'> <img class='rounded-full shadow-xl shadow-slate-800 opacity-75 hover:opacity-100 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' width='200' height='200' src=${BACKDROP_BASE_URL + actor.profile_path} alt=${actor.name}>
      <p>${actor.name}</p>
    </div>
    `
  }).join('')}
  </div>
  `

const singleActor = document.querySelectorAll('.single-actor');

singleActor.forEach((actorDiv, index) => actorDiv.addEventListener('click', async (e) => {
  let actor = actors.results[index];
  await renderActor(actor);
}))
}))

const fetchActorPage = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
}

// search input 
const searchInput = document.querySelector('#input');
searchInput.addEventListener('input', e => filterMoviesByInput());

function displayFilteredMovies(movies) {
  CONTAINER.innerHTML = '';

  if (movies.length === 0) {
    CONTAINER.innerHTML = `<h1 class='text-4xl font-bold text-red-700'>No movies found</h1>`;
    return;
  }

  for (let movie of movies) {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('cursor-pointer');
    movieDiv.innerHTML = `
      <img class='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300' height='400' width='400' src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
      <div class='space-y-2 pt-3'>
        <h3 class='text-xl font-bold'>${movie.title}</h3>
        <p class='text-xs text-slate-400'>Genres: ${getGenresString(movie.genre_ids)}</p>
      </div>
      `;
    movieDiv.addEventListener('click', async () => {
      await movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
    // CONTAINER.appendChild(movieItem);
  }
}



async function filterMoviesByInput() {
  const movies = await fetchMovies('now_playing');

  console.log(movies)
  const searchValue = searchInput.value.toLowerCase()

  
  const filteredMovies = movies.results.filter(movie => movie.original_title.toLowerCase().includes(searchValue));
  console.log(filteredMovies)
  displayFilteredMovies(filteredMovies);
}

filterMoviesByInput()


// ABOUT PAGE
// script.js
const aboutContent = `
<h3 class="about-heading text-4xl">nice to meet you!!</h3>
<img src="./media/ZIb4.gif" alt="gifforabout">
<h3 class="about-subheading text-4xl">and bye!</h3>

`;

const showAboutPage = () => {
  CONTAINER.innerHTML = aboutContent;
};

const aboutBtns = document.querySelectorAll('.aboutButton');
console.log(aboutBtns);
aboutBtns.forEach(btn => btn.addEventListener('click', e => {
  showAboutPage()
}))


// ... Existing code ...


autorun();


