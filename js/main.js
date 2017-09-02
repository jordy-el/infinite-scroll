'use strict';

function main() {

  const apiKey = prompt('Enter API access key');

  // Initialize page count
  let currentPage = 1;

  // Initialize scroll anchor
  function anchorPosition() {
    return $('#bottom-anchor').position().top;
  }

  // Function for getting most popular in TMDb
  function getResults(page) {
    return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`);
  }

  // Function for creating UIkit card with movie details
  function createMovieCard(movie) {
    function backdropPath(path) {
      if (path === null) {
        return "https://placehold.it/780x439?text=No+Image+Found"
      }
      return `http://image.tmdb.org/t/p/w780/${path}`
    }
    return `
      <div class="uk-width-1-3">
        <div class="uk-card uk-card-default uk-width-1-1 uk-box-shadow-medium">
          <div class="uk-card-media-top">
              <img src="${backdropPath(movie.backdrop_path)}" alt="${movie.title} backdrop">
          </div>
          <div class="uk-card-body">
              <h3 class="uk-card-title">${movie.title}</h3>
              <p>${movie.overview}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Function for appending cards onto page
  function appendResults() {
    getResults(currentPage)
      .then((response) => { response.data.results.forEach((movie) => { $('#movies').append(createMovieCard(movie)) }) })
      .catch((error) => {
          console.log(error.response);
      });
    currentPage++;
  }

  // Get first page of results immediately
  appendResults();

  $(document).on('scroll', () => {
    if ($(this).scrollTop() > anchorPosition() - ($(window).height() + 500)) {
      const $anchor = $('#bottom-anchor');
      $anchor.remove();
      appendResults();
      $('#content').append($anchor);
    }
  });
}


document.addEventListener('DOMContentLoaded', main);