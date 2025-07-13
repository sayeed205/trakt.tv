export type IDs = {
  trakt: string;
  slug: string;
  imdb: string;
  tmdb: number;
};

export type Movie = {
  title: string;
  year: number;
  ids: IDs;
};

export type TrendingMovies = {
  watchers: number;
  movie: Movie;
};

export type AnticipatedMovie = {
  list_count: number;
  movie: Movie;
};

export type WatchedMovie = {
  watcher_count: number;
  play_count: number;
  collected_count: number;
  movie: Movie;
};

export type PlayedMovie = WatchedMovie;

export type MovieUpdates = {
  updated_at: string;
  movie: Movie;
};

export type MovieAlias = {
  title: string;
  country: string;
};

export type MovieRelease = {
  country: string;
  certification: string;
  release_date: string;
  release_type: string;
  note: string;
};

export type MovieTranslation = {
  title: string;
  overview: string;
  tagline: string | null;
  language: string;
  country: string;
};
