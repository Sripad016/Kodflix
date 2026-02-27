import type { MovieDetails } from "../types";

type HeroProps = {
  movie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void> | void;
};

export function Hero({ movie, loading, error, onRetry }: HeroProps) {
  const hasPoster = Boolean(movie?.poster);
  const heroStyle = hasPoster
    ? {
        backgroundImage: `linear-gradient(84deg, rgba(8, 8, 8, 0.94) 30%, rgba(8, 8, 8, 0.48) 60%, rgba(8, 8, 8, 0.96) 100%), url(${movie?.poster})`,
      }
    : undefined;

  return (
    <section className={`hero ${hasPoster ? "hero-with-poster" : ""}`} style={heroStyle}>
      <div className="hero-content">
        <p className="hero-eyebrow">Now Streaming</p>
        <h1>{movie?.title ?? "Unlimited movies, TV shows, and more."}</h1>
        <p className="hero-description">
          {movie?.plot ??
            "Watch anywhere. Cancel anytime. Enter your email to create or restart your membership."}
        </p>
        {movie ? (
          <div className="hero-meta">
            <span>{movie.year}</span>
            <span>{movie.runtime}</span>
            <span>{movie.genre}</span>
            <span>{movie.rated}</span>
          </div>
        ) : null}
        <div className="hero-actions">
          <button className="primary-btn" type="button">
            Play
          </button>
          <button className="secondary-btn" type="button">
            More Info
          </button>
          <button className="ghost-btn" type="button" onClick={onRetry}>
            Refresh
          </button>
        </div>
        {loading ? <p className="state-text">Loading OMDb titles...</p> : null}
        {error ? (
          <p className="state-text state-error">
            {error}
            <button type="button" className="text-btn" onClick={onRetry}>
              Retry
            </button>
          </p>
        ) : null}
      </div>
    </section>
  );
}
