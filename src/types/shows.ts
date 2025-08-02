import type { IDs } from "./shared.ts";

/**
 * Core show type representing a TV show from the Trakt.tv API.
 */
export type Show = {
  title: string;
  year: number;
  ids: IDs;
};

/**
 * Extended show type representing a TV show from the Trakt.tv API.
 */
export type ShowExtended = Show & {
  overview?: string;
  first_aired?: string;
  airs?: {
    day: string;
    time: string;
    timezone: string;
  };
  runtime?: number;
  certification?: string;
  network?: string;
  country?: string;
  trailer?: string;
  homepage?: string;
  status?: string;
  rating?: number;
  votes?: number;
  comment_count?: number;
  language?: string;
  available_translations?: string[];
  genres?: string[];
  aired_episodes?: number;
};

/**
 * Season type representing a TV show season.
 */
export type Season = {
  number: number;
  ids: IDs;
  rating?: number;
  votes?: number;
  episode_count?: number;
  aired_episodes?: number;
  title?: string;
  overview?: string;
  first_aired?: string;
  network?: string;
  episodes?: Episode[];
};

/**
 * Episode type representing a TV show episode.
 */
export type Episode = {
  season: number;
  number: number;
  title: string;
  ids: Omit<IDs, "slug">;
  number_abs?: number;
  overview?: string;
  rating?: number;
  votes?: number;
  comment_count?: number;
  first_aired?: string;
  updated_at?: string;
  available_translations?: string[];
  runtime?: number;
};

/**
 * Trending show type with watcher count.
 */
export type TrendingShow = {
  watchers: number;
  show: Show;
};

/**
 * Anticipated show type with list count.
 */
export type AnticipatedShow = {
  list_count: number;
  show: Show;
};

/**
 * Watched show type with statistics.
 */
export type WatchedShow = {
  watcher_count: number;
  play_count: number;
  collected_count: number;
  show: Show;
};

/**
 * Played show type (alias for WatchedShow).
 */
export type PlayedShow = WatchedShow;

/**
 * Show updates type with timestamp.
 */
export type ShowUpdates = {
  updated_at: string;
  show: Show;
};

/**
 * Show alias type for alternative titles.
 */
export type ShowAlias = {
  title: string;
  country: string;
};

/**
 * Show translation type for localized content.
 */
export type ShowTranslation = {
  title: string;
  overview: string;
  language: string;
  country: string;
};

export type ShowStats = {
  watchers?: number;
  plays?: number;
  collectors?: number;
  collected_episodes: number;
  comments: number;
  votes: number;
  favorited: number;
};
