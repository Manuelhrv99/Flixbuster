document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '33fe4a090809a4ce2d92accf19828a4d';
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?query=avengers&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
    const movieCardsContainer = document.getElementById('movieCards');

    function loadMoviesFromAPI(searchQuery) {
        let searchUrl = apiUrl;
        if (searchQuery) {
            searchUrl = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
        }

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results.slice(0, 20);

                displayMovies(movies)
            })
            .catch(err => console.error(err));
    }

    // Función para mostrar las tarjetas de películas en la pantalla
    function displayMovies(movies) {
        // Borrar las tarjetas anteriores antes de mostrar las nuevas
        while (movieCardsContainer.firstChild) {
        movieCardsContainer.removeChild(movieCardsContainer.firstChild);
        }
    
        movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieCardsContainer.appendChild(movieCard);

        // Agrega un evento de clic a las tarjetas de películas
        movieCard.addEventListener("click", function () {
            // Obtén información de la película desde la tarjeta
            const movieTitle = movie.title;
            const movieOverview = movie.overview;
            const moviePosterPath = movie.poster_path;
            const movieDate = movie.release_date;
            const movieScore = movie.vote_average;

            // Actualiza el contenido del modal con la información de la película
            document.getElementById("modalTitle").textContent = movieTitle;
            document.getElementById("modalOverview").textContent = movieOverview;
            document.getElementById("modalPoster").src = `https://image.tmdb.org/t/p/w500/${moviePosterPath}`;
            document.getElementById("modalDate").textContent = 'Release date: ' + movieDate;
            document.getElementById("modalScore").textContent = 'Users score: ' + movieScore;

            // Abre el modal
            $('#movieModal').modal('show');
        });
        });
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');
        movieCard.classList.add('col-sm-12');
        movieCard.classList.add('col-md-6');
        movieCard.classList.add('col-lg-3');

        // Asignar el ID de la película como un atributo de datos
        movieCard.setAttribute('data-movie-id', movie.id);

        const image = document.createElement('img');
        image.classList.add('card-img-top');
        image.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        image.alt = movie.title;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = movie.title;

        cardBody.appendChild(title);
        movieCard.appendChild(image);
        movieCard.appendChild(cardBody);

        return movieCard;
    }

    function searchMovies(event) {
        event.preventDefault(); // Evitar la recarga de la página
        const searchQuery = document.getElementById("searchInput").value;
        if (searchQuery) {
            loadMoviesFromAPI(searchQuery);
        }
        else {
            loadMoviesFromAPI('');
        }
    }

    document.getElementById("searchButton").addEventListener("click", searchMovies);

    // ~~~~~~~~~~~~~~ Buscar peliculas por genero ~~~~~~~~~~~~~~
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2ZlNGEwOTA4MDlhNGNlMmQ5MmFjY2YxOTgyOGE0ZCIsInN1YiI6IjY1MzE4ZWMwOWFjNTM1MDEzOWYxMTk4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-Piucbyd9z7Qwrpy72aZrbJAH59Zlj0X7ycc7ZdAo2g'
        }
    };

    // Función para obtener películas de un género específico
    function fetchMoviesByGenre(genreName) {
        // Realiza la solicitud para obtener la lista de géneros
        fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
            .then(response => response.json())
            .then(genresData => {
                // Encuentra el ID del género que coincida con el nombre proporcionado
                const genre = genresData.genres.find(g => g.name === genreName);
                if (genre) {
                    // Realiza una solicitud para obtener películas del género específico (usando el ID del género)
                    const genreId = genre.id;
                    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`, options)
                        .then(response => response.json())
                        .then(moviesData => {
                            const movies = moviesData.results;
                            // Muestra las tarjetas de películas en la pantalla
                            displayMovies(movies);
                        })
                        .catch(err => console.error(err));
                }
            })
            .catch(err => console.error(err));
    }

    document.getElementById("action_button").addEventListener("click", function () {
        fetchMoviesByGenre("Action");
    });
    
    document.getElementById("comedy_button").addEventListener("click", function () {
        fetchMoviesByGenre("Comedy");
    });

    document.getElementById("animation_button").addEventListener("click", function () {
        fetchMoviesByGenre("Animation");
    });

    document.getElementById("horror_button").addEventListener("click", function () {
        fetchMoviesByGenre("Horror");
    });

    let isNavbarExpanded = false;
    document.getElementById("moveButton").addEventListener("click", function () {
        const navbar = document.querySelector(".navbar");

        if (!isNavbarExpanded) {
            navbar.classList.add("expanded");
        } else {
            navbar.classList.remove("expanded");
        }
        
        isNavbarExpanded = !isNavbarExpanded;
    });

    loadMoviesFromAPI('');
});
