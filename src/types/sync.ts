import type { Movie } from "./movies.ts";
import type { Episode, Season, Show } from "./shows.ts";

/**
 * Response from sync operations (add/remove items).
 */
export type SyncResponse = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  existing: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  not_found: {
    movies: SyncItem[];
    shows: SyncItem[];
    seasons: SyncItem[];
    episodes: SyncItem[];
  };
};

/**
 * Item structure for sync operations.
 */
export type SyncItem = {
  ids: {
    trakt?: number;
    slug?: string;
    imdb?: string;
    tmdb?: number;
    tvdb?: number;
  };
  title?: string;
  year?: number;
  collected_at?: string;
  watched_at?: string;
  rated_at?: string;
  rating?: number;
  seasons?: SyncSeason[];
};

/**
 * Season structure for sync operations.
 */
export type SyncSeason = {
  number: number;
  episodes?: SyncEpisode[];
};

/**
 * Episode structure for sync operations.
 */
export type SyncEpisode = {
  number: number;
  collected_at?: string;
  watched_at?: string;
  rated_at?: string;
  rating?: number;
};

export type CollectionType = "movies" | "shows";

/**
 * Collection item with metadata.
 */
export type CollectionItem<T extends CollectionType> = T extends "movies"
  ? { collected_at: string; updated_at: string; movie: Movie }
  : { collected_at: string; updated_at: string; show: Show; seasons: Season[] };

/**
 * Watched item with play statistics.
 */
export type WatchedItem = {
  plays: number;
  last_watched_at: string;
  last_updated_at: string;
  movie?: Movie;
  show?: Show;
  seasons?: WatchedSeason[];
};

/**
 * Watched season with episode details.
 */
export type WatchedSeason = {
  number: number;
  episodes: WatchedEpisode[];
};

/**
 * Watched episode with play count.
 */
export type WatchedEpisode = {
  number: number;
  plays: number;
  last_watched_at: string;
};

/**
 * Rated item with rating information.
 */
export type RatedItem = {
  rated_at: string;
  rating: number;
  movie?: Movie;
  show?: Show;
  season?: Season;
  episode?: Episode;
};

/**
 * Watchlist item with metadata.
 */
export type WatchlistItem = {
  listed_at: string;
  movie?: Movie;
  show?: Show;
  season?: Season;
  episode?: Episode;
};

/**
 * History item with watch timestamp.
 */
export type HistoryItem = {
  id: number;
  watched_at: string;
  action: "watch" | "checkin" | "scrobble";
  movie?: Movie;
  show?: Show;
  season?: Season;
  episode?: Episode;
};

/**
 * Playback progress item.
 */
export type PlaybackProgress = {
  progress: number;
  paused_at: string;
  id: number;
  movie?: Movie;
  episode?: Episode;
};

/**
 * Parameters for sync add/remove operations.
 */
export type SyncParams = {
  movies?: SyncItem[];
  shows?: SyncItem[];
  seasons?: SyncItem[];
  episodes?: SyncItem[];
};

/**
 * Parameters for playback progress operations.
 */
export type PlaybackParams = {
  progress: number;
  movie?: {
    ids: {
      trakt?: number;
      slug?: string;
      imdb?: string;
      tmdb?: number;
    };
  };
  episode?: {
    ids: {
      trakt?: number;
      tvdb?: number;
      imdb?: string;
      tmdb?: number;
    };
  };
};
