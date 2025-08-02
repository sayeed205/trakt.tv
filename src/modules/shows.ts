/**
 * @fileoverview Shows module for Trakt.tv API
 * Handles all TV show-related API endpoints including trending, popular, search, metadata,
 * seasons, and episodes. Provides comprehensive access to show information, ratings,
 * comments, and related data.
 */

import type { Comment, CommentUser, List } from "../types/index.ts";
import type { MoviePeople } from "../types/movies.ts";
import type { RatingDistribution } from "../types/shared.ts";
import type {
  AnticipatedShow,
  Episode,
  PlayedShow,
  Season,
  Show,
  ShowAlias,
  ShowExtended,
  ShowStats,
  ShowTranslation,
  ShowUpdates,
  TrendingShow,
  WatchedShow,
} from "../types/shows.ts";
import type { CallMethod } from "./base.ts";

/**
 * Shows module class providing access to all TV show-related Trakt.tv API endpoints.
 *
 * This module handles show discovery, metadata retrieval, ratings, comments,
 * seasons, episodes, and related functionality for the Trakt.tv API.
 */
export class ShowsModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get show details by ID.
   *
   * @param id - Show ID (Trakt ID, IMDB ID, TVDB ID, or TMDB ID)
   * @returns Promise resolving to basic show details
   * @example
   * ```ts
   * const show = await client.shows.get("breaking-bad");
   * console.log(show.title); // "Breaking Bad"
   * ```
   */
  get(id: string): Promise<Show>;

  /**
   * Get extended show details by ID.
   *
   * @param id - Show ID (Trakt ID, IMDB ID, TVDB ID, or TMDB ID)
   * @param extended - Set to true to get extended show information
   * @returns Promise resolving to extended show details with additional metadata
   * @example
   * ```ts
   * const extendedShow = await client.shows.get("breaking-bad", true);
   * console.log(extendedShow.overview); // Show plot summary
   * console.log(extendedShow.runtime); // Runtime in minutes
   * console.log(extendedShow.network); // Network name
   * ```
   */
  get(id: string, extended: true): Promise<ShowExtended>;

  /**
   * Get basic show details by ID.
   *
   * @param id - Show ID (Trakt ID, IMDB ID, TVDB ID, or TMDB ID)
   * @param extended - Set to false to get basic show information
   * @returns Promise resolving to basic show details
   */
  get(id: string, extended: false): Promise<Show>;

  get(id: string, extended?: boolean): Promise<Show | ShowExtended> {
    const params = extended ? { extended: "full" } : {};
    return this._call("get", `/shows/${id}`, params);
  }

  /**
   * Get trending shows.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of trending shows with watcher counts
   * @example
   * ```ts
   * const trending = await client.shows.trending({ page: 1, limit: 10 });
   * trending.forEach(item => {
   *   console.log(`${item.show.title} - ${item.watchers} watchers`);
   * });
   * ```
   */
  trending(params?: {
    page?: number;
    limit?: number;
  }): Promise<TrendingShow[]> {
    return this._call("get", "/shows/trending", params);
  }

  /**
   * Get popular shows.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of popular shows
   * @example
   * ```ts
   * const popular = await client.shows.popular({ limit: 20 });
   * ```
   */
  popular(params?: {
    page?: number;
    limit?: number;
  }): Promise<Show[]> {
    return this._call("get", "/shows/popular", params);
  }

  /**
   * Get most anticipated shows.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of anticipated shows with list counts
   * @example
   * ```ts
   * const anticipated = await client.shows.anticipated();
   * ```
   */
  anticipated(params?: {
    page?: number;
    limit?: number;
  }): Promise<AnticipatedShow[]> {
    return this._call("get", "/shows/anticipated", params);
  }

  /**
   * Get most watched shows in a time period.
   *
   * @param params - Parameters including time period and pagination
   * @returns Promise resolving to array of watched shows with statistics
   * @example
   * ```ts
   * const weeklyWatched = await client.shows.watched({ period: "weekly" });
   * const allTimeWatched = await client.shows.watched({ period: "all", limit: 50 });
   * ```
   */
  watched(params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
    page?: number;
    limit?: number;
  }): Promise<WatchedShow[]> {
    return this._call("get", `/shows/watched/${params?.period || "weekly"}`, {
      page: params?.page,
      limit: params?.limit,
    });
  }

  /**
   * Get most played shows in a time period.
   *
   * @param params - Parameters including time period and pagination
   * @returns Promise resolving to array of played shows with play statistics
   * @example
   * ```ts
   * const monthlyPlayed = await client.shows.played({ period: "monthly" });
   * ```
   */
  played(params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
    page?: number;
    limit?: number;
  }): Promise<PlayedShow[]> {
    return this._call("get", `/shows/played/${params?.period || "weekly"}`, {
      page: params?.page,
      limit: params?.limit,
    });
  }

  /**
   * Get recently updated shows.
   *
   * @param params - Parameters including start date and pagination
   * @returns Promise resolving to array of recently updated shows
   * @example
   * ```ts
   * const updates = await client.shows.updates({
   *   start_date: "2023-01-01",
   *   limit: 100
   * });
   * ```
   */
  updates(params: {
    start_date: string;
    page?: number;
    limit?: number;
  }): Promise<ShowUpdates[]> {
    return this._call("get", "/shows/updates", params);
  }

  /**
   * Get show aliases (alternative titles).
   *
   * @param id - Show ID
   * @returns Promise resolving to array of show aliases
   * @example
   * ```ts
   * const aliases = await client.shows.aliases("breaking-bad");
   * ```
   */
  aliases(id: string | number): Promise<ShowAlias[]> {
    return this._call("get", `/shows/${id}/aliases`);
  }

  /**
   * Get show translations.
   *
   * @param params - Parameters including show ID and optional language filter
   * @returns Promise resolving to array of show translations
   * @example
   * ```ts
   * const translations = await client.shows.translations({ id: "breaking-bad" });
   * const spanishTranslation = await client.shows.translations({
   *   id: "breaking-bad",
   *   language: "es"
   * });
   * ```
   */
  translations(params: {
    id: string | number;
    language?: string;
  }): Promise<ShowTranslation[]> {
    return this._call(
      "get",
      `/shows/${params.id}/translations${
        params.language ? `/${params.language}` : ""
      }`,
    );
  }

  /**
   * Get show comments.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to array of comments
   * @example
   * ```ts
   * const comments = await client.shows.comments({ id: "breaking-bad" });
   * ```
   */
  comments(params: { id: string | number }): Promise<Comment[]> {
    return this._call("get", `/shows/${params.id}/comments`);
  }

  /**
   * Get lists containing a show.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to array of lists containing the show
   * @example
   * ```ts
   * const lists = await client.shows.lists({ id: "breaking-bad" });
   * ```
   */
  lists(params: { id: string | number }): Promise<List[]> {
    return this._call("get", `/shows/${params.id}/lists`);
  }

  /**
   * Get show cast and crew information.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to show cast and crew data
   * @example
   * ```ts
   * const people = await client.shows.people({ id: "breaking-bad" });
   * ```
   */
  people(params: { id: string | number }): Promise<MoviePeople[]> {
    return this._call("get", `/shows/${params.id}/people`);
  }

  /**
   * Get show ratings and distribution.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to rating statistics
   * @example
   * ```ts
   * const ratings = await client.shows.ratings({ id: "breaking-bad" });
   * console.log(`Average rating: ${ratings.rating}/10`);
   * console.log(`Total votes: ${ratings.votes}`);
   * ```
   */
  ratings(params: { id: string | number }): Promise<RatingDistribution> {
    return this._call("get", `/shows/${params.id}/ratings`);
  }

  /**
   * Get related shows.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to array of related shows
   * @example
   * ```ts
   * const related = await client.shows.related({ id: "breaking-bad" });
   * ```
   */
  related(
    params: { id: string | number },
  ): Promise<Pick<Show, "title" | "year" | "ids">[]> {
    return this._call("get", `/shows/${params.id}/related`);
  }

  /**
   * Get show statistics.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to show statistics
   * @example
   * ```ts
   * const stats = await client.shows.stats({ id: "breaking-bad" });
   * console.log(`Watchers: ${stats.watchers}`);
   * console.log(`Plays: ${stats.plays}`);
   * ```
   */
  stats(params: { id: string | number }): Promise<ShowStats> {
    return this._call("get", `/shows/${params.id}/stats`);
  }

  /**
   * Get users currently watching a show.
   *
   * @param params - Parameters including show ID
   * @returns Promise resolving to array of users currently watching
   * @example
   * ```ts
   * const watching = await client.shows.watching({ id: "breaking-bad" });
   * ```
   */
  watching(params: { id: string | number }): Promise<CommentUser[]> {
    return this._call("get", `/shows/${params.id}/watching`);
  }

  /**
   * Get show seasons.
   *
   * todo)) add overloads with extended params
   *
   * @param id - Trakt ID, Trakt slug, or IMDB ID Example: `game-of-thrones`.
   * @returns Promise resolving to array of seasons with basic information
   * @example
   * ```ts
   * const seasons = await client.shows.seasons("breaking-bad");
   * seasons.forEach(season => {
   *   console.log(`Season ${season.number}`);
   * });
   * ```
   */
  seasons(id: string | number): Promise<Pick<Season, "number" | "ids">[]> {
    return this._call("get", `/shows/${id}/seasons`);
  }

  /**
   * Get episodes for a specific season.
   *
   * todo)) add overloads for extended params
   *
   * @param id - Trakt ID, Trakt slug, or IMDB ID Example: `game-of-thrones`.
   * @param season - Number of the season
   * @param params - todo))
   * @returns Promise resolving to array of episodes in the season
   * @example
   * ```ts
   * const season1Episodes = await client.shows.season("breaking-bad", season: 1);
   * ```
   */
  season(
    id: string | number,
    season: number,
    params?: Record<string, string>,
  ): Promise<Pick<Episode, "number" | "ids">> {
    return this._call(
      "get",
      `/shows/${id}/seasons/${season}/info`,
      params,
    );
  }

  /**
   * Get episodes for a specific season.
   *
   * @param params - Parameters including show ID, season number, and optional translations
   * @returns Promise resolving to array of episodes in the season
   * @example
   * ```ts
   * const episodes = await client.shows.episodes({ id: "breaking-bad", season: 1 });
   * const episodesWithTranslations = await client.shows.episodes({
   *   id: "breaking-bad",
   *   season: 1,
   *   translations: "es"
   * });
   * ```
   */
  episodes(params: {
    id: string | number;
    season: number;
    translations?: string;
  }): Promise<Pick<Episode, "season" | "number" | "title" | "ids">[]> {
    return this._call("get", `/shows/${params.id}/seasons/${params.season}`, {
      translations: params.translations,
    });
  }

  /**
   * Get detailed information about a specific episode.
   *
   * TODO)) update into separate modules with overloads
   *
   * @param id - Trakt ID, Trakt slug, or IMDB ID Example: `game-of-thrones`.
   * @param season - Season Number Example: `1`.
   * @param episode - Episode Number Example: `1`.
   * @param extended - Optional if include extended info
   * @returns Promise resolving to detailed episode information
   * @example
   * ```ts
   * const episode = await client.shows.episode({
   *   id: "breaking-bad",
   *   season: 1,
   *   episode: 1
   * });
   * console.log(episode.title); // "Pilot"
   * ```
   */
  episode(
    id: string | number,
    season: number,
    episode: number,
    extended?: boolean,
  ): Promise<Episode> {
    return this._call(
      "get",
      `/shows/${id}/seasons/${season}/episodes/${episode}`,
      extended ? { extended: "full" } : {},
    );
  }
}
