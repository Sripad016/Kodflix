import type { Movie, MovieDetails } from "../types";

const OMDB_BASE_URL = "https://www.omdbapi.com/";

type OmdbResponse = {
  Response?: string;
  Error?: string;
  Search?: Array<Record<string, string>>;
  [key: string]: unknown;
};

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_OMDB_API_KEY environment variable.");
  }
  return apiKey;
}

async function fetchOmdb(params: Record<string, string>): Promise<OmdbResponse> {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", getApiKey());

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`OMDb request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OmdbResponse;
  if (data.Response === "False") {
    throw new Error(data.Error ?? "OMDb returned an error.");
  }

  return data;
}

function normalizeMovie(movie: Record<string, string>): Movie {
  return {
    imdbID: movie.imdbID ?? "",
    title: movie.Title ?? "Untitled",
    year: movie.Year ?? "N/A",
    type: movie.Type ?? "movie",
    poster: movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null,
  };
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  if (!query.trim()) {
    return [];
  }

  let data: OmdbResponse;
  try {
    data = await fetchOmdb({
      s: query.trim(),
      type: "movie",
      page: String(page),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Movie not found!") {
      return [];
    }
    throw error;
  }

  const searchResults = Array.isArray(data.Search) ? data.Search : [];
  return searchResults
    .map(normalizeMovie)
    .filter((movie) => movie.imdbID.length > 0);
}

export async function getMovieById(imdbID: string): Promise<MovieDetails> {
  if (!imdbID.trim()) {
    throw new Error("Movie id is required.");
  }

  const data = await fetchOmdb({ i: imdbID.trim(), plot: "full" });
  const movie = normalizeMovie(data as Record<string, string>);

  return {
    ...movie,
    plot:
      typeof data.Plot === "string" && data.Plot !== "N/A"
        ? data.Plot
        : "No plot summary available.",
    runtime:
      typeof data.Runtime === "string" && data.Runtime !== "N/A"
        ? data.Runtime
        : "Runtime unavailable",
    genre:
      typeof data.Genre === "string" && data.Genre !== "N/A"
        ? data.Genre
        : "Genre unavailable",
    rated:
      typeof data.Rated === "string" && data.Rated !== "N/A"
        ? data.Rated
        : "Not rated",
    director:
      typeof data.Director === "string" && data.Director !== "N/A"
        ? data.Director
        : "Director unavailable",
  };
}
