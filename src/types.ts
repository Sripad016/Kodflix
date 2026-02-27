export type Movie = {
  imdbID: string;
  title: string;
  year: string;
  type: string;
  poster: string | null;
};

export type MovieDetails = Movie & {
  plot: string;
  runtime: string;
  genre: string;
  rated: string;
  director: string;
};

export type MovieRowConfig = {
  id: string;
  title: string;
  query: string;
};

export type MovieRowData = MovieRowConfig & {
  items: Movie[];
  error: string | null;
};
