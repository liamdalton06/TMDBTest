using System.Text.Json;
using TMDBTest;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/movies", async (string query) =>
{
    using var client = new HttpClient();

    var token = builder.Configuration["TMDB:Token"];

    if (string.IsNullOrEmpty(token))
    {
        throw new InvalidOperationException("TMDB token is missing.");
    }

    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue(
            "Bearer",
            token
        );

    var url = $"https://api.themoviedb.org/3/search/movie?query={query}";

    var response = await client.GetAsync(url);

    var json = await response.Content.ReadAsStringAsync();

    var result = JsonSerializer.Deserialize<MovieResponse>(json);

    return result;
});

app.MapGet("/api/movies/top-rated", async () =>
{
    using var client = new HttpClient();

    var token = builder.Configuration["TMDB:Token"];

    if (string.IsNullOrEmpty(token))
    {
        throw new InvalidOperationException("TMDB token is missing.");
    }

    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue(
            "Bearer",
            token
        );

    var url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    var response = await client.GetAsync(url);

    var json = await response.Content.ReadAsStringAsync();

    var result = JsonSerializer.Deserialize<MovieResponse>(json);

    return result;
});

app.MapGet("/api/movies/{id:int}", async (int id) =>
{
    using var client = new HttpClient();

    var token = builder.Configuration["TMDB:Token"];

    if (string.IsNullOrEmpty(token))
    {
        throw new InvalidOperationException("TMDB token is missing.");
    }

    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue(
            "Bearer",
            token
        );

    var url = $"https://api.themoviedb.org/3/movie/{id}";

    var response = await client.GetAsync(url);

    var json = await response.Content.ReadAsStringAsync();

    var movie = JsonSerializer.Deserialize<Movie>(json);

    return movie;
});

app.Run();
