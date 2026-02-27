import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMovieById, searchMovies } from "./omdb";

describe("OMDb service", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("VITE_OMDB_API_KEY", "test-key");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("normalizes movie rows from search responses", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: "True",
        Search: [
          {
            imdbID: "tt0848228",
            Title: "The Avengers",
            Year: "2012",
            Type: "movie",
            Poster: "https://image.tmdb.org/avengers.jpg",
          },
          {
            imdbID: "tt0000000",
            Title: "No Poster",
            Year: "2010",
            Type: "movie",
            Poster: "N/A",
          },
        ],
      }),
    });

    const movies = await searchMovies("avengers");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toContain("apikey=test-key");
    expect(fetchMock.mock.calls[0][0]).toContain("s=avengers");
    expect(movies).toEqual([
      {
        imdbID: "tt0848228",
        title: "The Avengers",
        year: "2012",
        type: "movie",
        poster: "https://image.tmdb.org/avengers.jpg",
      },
      {
        imdbID: "tt0000000",
        title: "No Poster",
        year: "2010",
        type: "movie",
        poster: null,
      },
    ]);
  });

  it("returns an empty list for OMDb movie-not-found errors", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: "False",
        Error: "Movie not found!",
      }),
    });

    const movies = await searchMovies("unknown title");

    expect(movies).toEqual([]);
  });

  it("returns detailed metadata when loading a movie by imdb id", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: "True",
        imdbID: "tt0111161",
        Title: "The Shawshank Redemption",
        Year: "1994",
        Type: "movie",
        Poster: "https://image.tmdb.org/shawshank.jpg",
        Plot: "Two imprisoned men bond over a number of years.",
        Runtime: "142 min",
        Genre: "Drama",
        Rated: "R",
        Director: "Frank Darabont",
      }),
    });

    const movie = await getMovieById("tt0111161");

    expect(movie).toEqual({
      imdbID: "tt0111161",
      title: "The Shawshank Redemption",
      year: "1994",
      type: "movie",
      poster: "https://image.tmdb.org/shawshank.jpg",
      plot: "Two imprisoned men bond over a number of years.",
      runtime: "142 min",
      genre: "Drama",
      rated: "R",
      director: "Frank Darabont",
    });
  });
});
