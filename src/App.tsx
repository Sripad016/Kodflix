import { useCallback, useEffect, useMemo, useState } from "react";
import { ROW_CONFIGS } from "./data/rows";
import { getMovieById, searchMovies } from "./services/omdb";
import type { Movie, MovieDetails, MovieRowData } from "./types";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MovieRow } from "./components/MovieRow";
import { FeatureBands } from "./components/FeatureBands";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";

const DEFAULT_HERO_PLOT =
  "Watch anywhere. Cancel anytime. Enter your email to create or restart your membership.";

function asHeroFallback(movie: Movie): MovieDetails {
  return {
    ...movie,
    plot: DEFAULT_HERO_PLOT,
    runtime: "Runtime unavailable",
    genre: "Genre unavailable",
    rated: "Not rated",
    director: "Director unavailable",
  };
}

export default function App() {
  const initialRows = useMemo<MovieRowData[]>(
    () => ROW_CONFIGS.map((config) => ({ ...config, items: [], error: null })),
    [],
  );

  const [rows, setRows] = useState<MovieRowData[]>(initialRows);
  const [heroMovie, setHeroMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroError, setHeroError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setHeroError(null);
    setGlobalError(null);

    const fetchedRows = await Promise.all(
      ROW_CONFIGS.map(async (config): Promise<MovieRowData> => {
        try {
          const movies = await searchMovies(config.query, 1);
          const cleanedMovies = movies.filter((movie) => movie.poster).slice(0, 12);
          return {
            ...config,
            items: cleanedMovies,
            error: cleanedMovies.length ? null : "No titles found for this row.",
          };
        } catch (error) {
          return {
            ...config,
            items: [],
            error: error instanceof Error ? error.message : "Unable to load this row.",
          };
        }
      }),
    );

    setRows(fetchedRows);

    const firstMovie = fetchedRows.flatMap((row) => row.items).find(Boolean);
    if (!firstMovie) {
      setHeroMovie(null);
      setGlobalError("Unable to load movie titles from OMDb. Please retry.");
      setLoading(false);
      return;
    }

    try {
      const details = await getMovieById(firstMovie.imdbID);
      setHeroMovie(details);
    } catch {
      setHeroMovie(asHeroFallback(firstMovie));
      setHeroError("Hero details could not be loaded. Showing fallback metadata.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  const hasLoadedCards = rows.some((row) => row.items.length > 0);

  return (
    <div className="app-shell">
      <Header />
      <Hero
        movie={heroMovie}
        loading={loading}
        error={globalError ?? heroError}
        onRetry={loadPageData}
      />

      {globalError && !hasLoadedCards ? (
        <section className="fatal-error" aria-live="polite">
          <p>{globalError}</p>
          <button className="primary-btn" type="button" onClick={loadPageData}>
            Retry Fetch
          </button>
        </section>
      ) : null}

      <main>
        <section className="rows-wrapper" aria-label="Movie collections">
          {rows.map((row) => (
            <MovieRow
              key={row.id}
              title={row.title}
              items={row.items}
              error={row.error}
              loading={loading && row.items.length === 0}
            />
          ))}
        </section>
        <FeatureBands />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
