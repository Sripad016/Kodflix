import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as omdbService from "./services/omdb";
import type { Movie, MovieDetails } from "./types";

vi.mock("./services/omdb", () => ({
  searchMovies: vi.fn(),
  getMovieById: vi.fn(),
}));

const mockMovie = (query: string): Movie => ({
  imdbID: `id-${query.replace(/\s+/g, "-")}`,
  title: `${query} movie`,
  year: "2025",
  type: "movie",
  poster: "https://example.com/poster.jpg",
});

describe("App", () => {
  const mockedSearchMovies = vi.mocked(omdbService.searchMovies);
  const mockedGetMovieById = vi.mocked(omdbService.getMovieById);

  beforeEach(() => {
    mockedSearchMovies.mockReset();
    mockedGetMovieById.mockReset();

    mockedSearchMovies.mockImplementation(async (query: string) => [mockMovie(query)]);
    mockedGetMovieById.mockImplementation(async (imdbID: string) => {
      const movie: MovieDetails = {
        imdbID,
        title: "Hero Movie",
        year: "2025",
        type: "movie",
        poster: "https://example.com/hero.jpg",
        plot: "Hero summary from OMDb details endpoint.",
        runtime: "120 min",
        genre: "Action",
        rated: "PG-13",
        director: "Test Director",
      };
      return movie;
    });
  });

  it("renders Netflix-style sections and OMDb movie cards", async () => {
    render(<App />);

    expect(screen.getByText("KODFLIX")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Frequently Asked Questions" })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedSearchMovies).toHaveBeenCalledTimes(5);
    });

    expect(screen.getByRole("heading", { name: "Trending Now" })).toBeInTheDocument();
    expect(screen.getByText("avengers movie")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hero Movie" })).toBeInTheDocument();
  });

  it("shows row error text when one OMDb row request fails", async () => {
    mockedSearchMovies
      .mockRejectedValueOnce(new Error("OMDb temporary error"))
      .mockResolvedValueOnce([mockMovie("batman")])
      .mockResolvedValueOnce([mockMovie("star wars")])
      .mockResolvedValueOnce([mockMovie("mission")])
      .mockResolvedValueOnce([mockMovie("matrix")]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("OMDb temporary error")).toBeInTheDocument();
    });
  });
});
