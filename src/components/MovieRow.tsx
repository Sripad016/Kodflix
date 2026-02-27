import type { Movie } from "../types";

type MovieRowProps = {
  title: string;
  items: Movie[];
  loading: boolean;
  error: string | null;
};

const SKELETON_COUNT = 7;

export function MovieRow({ title, items, loading, error }: MovieRowProps) {
  return (
    <section className="movie-row" aria-label={title}>
      <h2>{title}</h2>
      {error ? <p className="row-error">{error}</p> : null}
      <div className="movie-rail">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <article key={`${title}-skeleton-${index}`} className="movie-card skeleton-card" />
            ))
          : items.map((movie) => (
              <article className="movie-card" key={movie.imdbID}>
                {movie.poster ? (
                  <img
                    loading="lazy"
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="movie-poster"
                  />
                ) : (
                  <div className="poster-fallback">
                    <p>{movie.title}</p>
                  </div>
                )}
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.year}</p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
