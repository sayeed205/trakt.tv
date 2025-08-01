import type { IDs } from "./shared.ts";
import { CreateListParams } from "./lists.ts";
import { CommentUser } from "./users.ts";

export type Movie = {
  title: string;
  year: number;
  ids: Omit<IDs, "tvdb">;
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

export type BoxOfficeMovie = {
  revenue: number;
  movie: Movie;
};

export type MovieList = CreateListParams & {
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  likes: number;
  ids: Pick<IDs, "trakt" | "slug">;
  user: CommentUser;
};

export type MoviePeople = MovieCast[] & MoviesCrew;

export type MovieCast = {
  characters: string[];
  person: {
    name: string;
    ids: Pick<IDs, "trakt" | "slug" | "imdb" | "tmdb">;
  };
};

export type MoviesCrew = {
  production: MoviePerson[];
  art: MoviePerson[];
  crew: MoviePerson[];
  "costume & make-up": MoviePerson[];
  directing: MoviePerson[];
  writing: MoviePerson[];
  sound: MoviePerson[];
  camera: MoviePerson[];
};

export type MoviePerson = {
  jobs: string[];
  person: {
    name: string;
    ids: Pick<IDs, "trakt" | "slug" | "imdb" | "tmdb">;
  };
};

export type MovieStudio = {
  name: string;
  country: string;
  ids: Pick<IDs, "trakt" | "slug" | "tmdb">;
};

export type MovieVideo = {
  title: string;
  url: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
  published_at: string;
  country: string;
  language: string;
};
