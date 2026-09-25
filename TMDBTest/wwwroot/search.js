const input = document.getElementById("usersearch");
const form = document.getElementById("search-form");
const button = form.querySelector("button");
const results = document.getElementById("results");
const status = document.getElementById("search-status");
const resultsHeading = document.getElementById("results-heading");
const resultsTitle = document.getElementById("results-title");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = input.value.trim();
    if (!name) {
        await loadTopRatedMovies();
        return;
    }

    clearResults();
    status.textContent = "Searching for movies...";
    button.disabled = true;

    try {
        const response = await fetch(
            `/api/movies?query=${encodeURIComponent(name)}`
        );

        if (!response.ok) {
            throw new Error("The movie search could not be completed.");
        }

        const result = await response.json();
        const movies = result?.results ?? [];

        if (movies.length === 0) {
            status.textContent = "No movies matched your search.";
            return;
        }

        status.textContent = `${movies.length} movies found.`;
        showMovies(movies, "Search results");
    } catch (error) {
        status.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});

async function loadTopRatedMovies() {
    clearResults();
    status.textContent = "Loading top rated movies...";
    button.disabled = true;

    try {
        const response = await fetch("/api/movies/top-rated");

        if (!response.ok) {
            throw new Error("Top rated movies could not be loaded.");
        }

        const result = await response.json();
        const movies = result?.results ?? [];

        if (movies.length === 0) {
            status.textContent = "No top rated movies are available right now.";
            return;
        }

        status.textContent = "";
        showMovies(movies, "Top rated movies");
    } catch (error) {
        status.textContent = "Top rated movies could not be loaded.";
    } finally {
        button.disabled = false;
    }
}

function showMovies(movies, title) {
    resultsTitle.textContent = title;
    resultsHeading.hidden = false;

    for (const movie of movies) {
        results.appendChild(createMovieCard(movie));
    }
}

function clearResults() {
    results.textContent = "";
    resultsHeading.hidden = true;
}

function createMovieCard(movie) {
    const card = document.createElement("a");
    card.classList.add("movie-card");
    card.href = `movie.html?id=${movie.id}`;

    const poster = document.createElement("img");
    poster.classList.add("movie-poster");
    poster.loading = "lazy";
    poster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : createPosterPlaceholder();
    poster.alt = movie.title ? `Poster for ${movie.title}` : "Movie poster unavailable";

    const title = document.createElement("h2");
    title.textContent = movie.title || "Untitled movie";

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("release-date");
    releaseDate.textContent = movie.release_date || "Release date unavailable";

    const voteAverage = document.createElement("p");
    voteAverage.classList.add("vote-average");
    voteAverage.textContent = Number.isFinite(movie.vote_average)
        ? `Rating ${movie.vote_average.toFixed(1)}`
        : "Not rated";

    const details = document.createElement("div");
    details.classList.add("movie-card-details");
    details.appendChild(title);
    details.appendChild(voteAverage);
    details.appendChild(releaseDate);

    card.appendChild(poster);
    card.appendChild(details);

    return card;
}

function createPosterPlaceholder() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750">
            <rect width="500" height="750" fill="rgb(35, 35, 35)" />
            <text x="250" y="375" fill="lightgray" font-family="sans-serif"
                  font-size="30" text-anchor="middle">No poster available</text>
        </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

loadTopRatedMovies();
