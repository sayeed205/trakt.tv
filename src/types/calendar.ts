import type { Movie } from "./movies.ts";
import type { Episode, Show } from "./shows.ts";

/**
 * Calendar show type representing a show episode with air date information.
 */
export type CalendarShow = {
  /** The air date of the episode in ISO 8601 format */
  first_aired: string;
  /** The episode information */
  episode: Pick<Episode, "season" | "number" | "title" | "ids">;
  /** The show information */
  show: Pick<Show, "title" | "year" | "ids">;
};

/**
 * Calendar movie type representing a movie with release date information.
 */
export type CalendarMovie = {
  /** The release date of the movie in ISO 8601 format */
  released: string;
  /** The movie information */
  movie: Movie;
};

/**
 * Parameters for calendar endpoints that support date range filtering.
 */
export type CalendarParams = {
  /** Start date in YYYY-MM-DD format (optional, defaults to today) */
  startDate?: string;
  /** Number of days to retrieve (optional, defaults to 7, max 33) */
  days?: number;
};
