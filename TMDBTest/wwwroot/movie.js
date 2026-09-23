async function loadMovie() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");
    const movieResult = document.getElementById("movieresult");
    const status = document.getElementById("movie-status");

    if (!movieId) {
        status.textContent = "No movie was selected.";
        return;
    }

    status.textContent = "Loading movie details...";

    try {
        const response = await fetch(`/api/movies/${encodeURIComponent(movieId)}`);

        if (!response.ok) {
            throw new Error("The movie details could not be loaded.");
        }

        const movie = await response.json();

        if (!movie) {
            throw new Error("No movie details were returned.");
        }

        status.textContent = "";

        const poster = document.createElement("img");
        poster.classList.add("movie-detail-poster");
        poster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : createPosterPlaceholder();
        poster.alt = movie.title ? `Poster for ${movie.title}` : "Movie poster unavailable";

        const info = document.createElement("div");
        info.classList.add("movie-info");

        const title = document.createElement("h2");
        title.textContent = movie.title || "Untitled movie";

        const metadata = document.createElement("div");
        metadata.classList.add("movie-metadata");

        const releaseDate = document.createElement("p");
        releaseDate.textContent = `Release date: ${movie.release_date || "Unavailable"}`;

        const voteAverage = document.createElement("p");
        voteAverage.classList.add("vote-average");
        voteAverage.textContent = Number.isFinite(movie.vote_average)
            ? `Rating: ${movie.vote_average.toFixed(1)}`
            : "Not rated";

        const overview = document.createElement("p");
        overview.classList.add("movie-overview");
        overview.textContent = movie.overview || "No overview is available for this movie.";

        metadata.appendChild(releaseDate);
        metadata.appendChild(voteAverage);
        info.appendChild(title);
        info.appendChild(metadata);
        info.appendChild(overview);
        movieResult.appendChild(poster);
        movieResult.appendChild(info);
    } catch (error) {
        status.textContent = error.message;
    }
}

function createPosterPlaceholder() {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750">
            <rect width="500" height="750" fill="darkslateblue" />
            <text x="250" y="375" fill="lightgray" font-family="sans-serif"
                  font-size="30" text-anchor="middle">No poster available</text>
        </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

loadMovie();
