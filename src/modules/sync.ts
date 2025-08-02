/**
 * @fileoverview Sync module for Trakt.tv API
 * Handles all sync-related API endpoints including collection, watched, ratings,
 * watchlist, history, and playback progress synchronization operations.
 */

import type {
  CollectionItem,
  HistoryItem,
  PlaybackParams,
  PlaybackProgress,
  RatedItem,
  SyncParams,
  SyncResponse,
  WatchedItem,
  WatchlistItem,
} from "../types/index.ts";
import type {CollectionType} from "../types/sync.ts";

/**
 * Type definition for the call method dependency injection
 */
type CallMethod = <T = unknown>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  params?: Record<string, unknown>,
) => Promise<T>;

/**
 * SyncModule class handles all sync-related API endpoints.
 * Provides comprehensive synchronization functionality for user's collection,
 * watched items, ratings, watchlist, history, and playback progress.
 */
export class SyncModule {
  /**
   * Collection sync operations for managing user's collected items.
   */
  public collection = {
    /**
     * Get all collected items for a specific media type.
     * OAuth Required
     * @param type The media type to retrieve (movies or shows)
     * @returns Promise resolving to array of collection items
     * @example
     * ```ts
     * const movieCollection = await client.sync.collection.get("movies");
     * const showCollection = await client.sync.collection.get("shows");
     * ```
     */
    get: <T extends CollectionType>(
      type: T,
    ): Promise<CollectionItem<T>[]> =>
      this._call("get", `/sync/collection/${type}`),

    /**
     * Add items to user's collection.
     * OAuth and VIP Enhanced is Required
     * @param params Items to add to collection
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.collection.add({
     *   movies: [
     *     { title: "Inception", year: 2010, ids: { imdb: "tt1375666" } }
     *   ]
     * });
     * ```
     */
    add: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/collection", params),

    /**
     * Remove items from user's collection.
     * OAuth Required
     * @param params Items to remove from collection
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.collection.remove({
     *   movies: [
     *     { title: "Inception", year: 2010, ids: { imdb: "tt1375666" } }
     *   ]
     * });
     * ```
     */
    remove: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/collection/remove", params),
  };
  /**
   * Watched sync operations for managing user's watch history.
   */
  public watched = {
    /**
     * Get all watched items for a specific media type.
     * OAuth Required
     * @param type The media type to retrieve (movies or shows)
     * @returns Promise resolving to array of watched items
     * @example
     * ```ts
     * const watchedMovies = await client.sync.watched.get("movies");
     * const watchedShows = await client.sync.watched.get("shows");
     * ```
     */
    get: (type: "movies" | "shows"): Promise<WatchedItem[]> =>
      this._call("get", `/sync/watched/${type}`),

    /**
     * Add items to user's watched history.
     * OAuth Required
     * @param params Items to mark as watched
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.watched.add({
     *   movies: [
     *     {
     *       title: "Inception",
     *       year: 2010,
     *       ids: { imdb: "tt1375666" },
     *       watched_at: "2024-01-15T20:30:00.000Z"
     *     }
     *   ]
     * });
     * ```
     */
    add: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/history", params),

    /**
     * Remove items from user's watched history.
     * OAuth Required
     * @param params Items to remove from watched history
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.watched.remove({
     *   movies: [
     *     { title: "Inception", year: 2010, ids: { imdb: "tt1375666" } }
     *   ]
     * });
     * ```
     */
    remove: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/history/remove", params),
  };
  /**
   * Ratings sync operations for managing user's ratings.
   */
  public ratings = {
    /**
     * Get all rated items for a specific media type.
     * OAuth Required
     * @param type The media type to retrieve
     * @param rating Optional specific rating to filter by (1-10)
     * @returns Promise resolving to array of rated items
     * @example
     * ```ts
     * const allRatedMovies = await client.sync.ratings.get("movies");
     * const highRatedShows = await client.sync.ratings.get("shows", 9);
     * const ratedEpisodes = await client.sync.ratings.get("episodes");
     * ```
     */
    get: (
      type: "movies" | "shows" | "seasons" | "episodes",
      rating?: number,
    ): Promise<RatedItem[]> => {
      const path = rating
        ? `/sync/ratings/${type}/${rating}`
        : `/sync/ratings/${type}`;
      return this._call("get", path);
    },

    /**
     * Add ratings for items.
     * OAuth Required
     * @param params Items with ratings to add
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.ratings.add({
     *   movies: [
     *     {
     *       title: "Inception",
     *       year: 2010,
     *       ids: { imdb: "tt1375666" },
     *       rating: 9
     *     }
     *   ]
     * });
     * ```
     */
    add: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/ratings", params),

    /**
     * Remove ratings from items.
     * OAuth Required
     * @param params Items to remove ratings from
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.ratings.remove({
     *   movies: [
     *     { title: "Inception", year: 2010, ids: { imdb: "tt1375666" } }
     *   ]
     * });
     * ```
     */
    remove: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/ratings/remove", params),
  };
  /**
   * Watchlist sync operations for managing user's watchlist.
   */
  public watchlist = {
    /**
     * Get all watchlist items for a specific media type.
     * OAuth Required
     * @param type The media type to retrieve
     * @returns Promise resolving to array of watchlist items
     * @example
     * ```ts
     * const movieWatchlist = await client.sync.watchlist.get("movies");
     * const showWatchlist = await client.sync.watchlist.get("shows");
     * const episodeWatchlist = await client.sync.watchlist.get("episodes");
     * ```
     */
    get: (
      type: "movies" | "shows" | "seasons" | "episodes",
    ): Promise<WatchlistItem[]> => this._call("get", `/sync/watchlist/${type}`),

    /**
     * Add items to user's watchlist.
     * OAuth Required
     * @param params Items to add to watchlist
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.watchlist.add({
     *   movies: [
     *     { title: "Dune", year: 2021, ids: { imdb: "tt1160419" } }
     *   ],
     *   shows: [
     *     { title: "Breaking Bad", year: 2008, ids: { imdb: "tt0903747" } }
     *   ]
     * });
     * ```
     */
    add: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/watchlist", params),

    /**
     * Remove items from user's watchlist.
     * OAuth Required
     * @param params Items to remove from watchlist
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.watchlist.remove({
     *   movies: [
     *     { title: "Dune", year: 2021, ids: { imdb: "tt1160419" } }
     *   ]
     * });
     * ```
     */
    remove: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/watchlist/remove", params),
  };
  /**
   * History sync operations for managing detailed watch history.
   */
  public history = {
    /**
     * Get user's watch history with optional filters.
     * OAuth Required
     * @param params Optional parameters for filtering history
     * @returns Promise resolving to array of history items
     * @example
     * ```ts
     * const allHistory = await client.sync.history.get();
     * const movieHistory = await client.sync.history.get({ type: "movies" });
     * const recentHistory = await client.sync.history.get({
     *   start_at: "2024-01-01T00:00:00.000Z",
     *   end_at: "2024-01-31T23:59:59.000Z"
     * });
     * ```
     */
    get: (params?: {
      type?: "movies" | "shows" | "seasons" | "episodes";
      id?: number;
      start_at?: string;
      end_at?: string;
      page?: number;
      limit?: number;
    }): Promise<HistoryItem[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.start_at) searchParams.start_at = params.start_at;
      if (params?.end_at) searchParams.end_at = params.end_at;
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      let path = "/sync/history";
      if (params?.type) {
        path += `/${params.type}`;
        if (params?.id) {
          path += `/${params.id}`;
        }
      }

      return this._call("get", path, searchParams);
    },

    /**
     * Add items to user's watch history.
     * OAuth Required
     * @param params Items to add to history
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.history.add({
     *   movies: [
     *     {
     *       title: "The Matrix",
     *       year: 1999,
     *       ids: { imdb: "tt0133093" },
     *       watched_at: "2024-01-15T20:30:00.000Z"
     *     }
     *   ]
     * });
     * ```
     */
    add: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/history", params),

    /**
     * Remove items from user's watch history.
     * OAuth Required
     * @param params Items to remove from history
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.history.remove({
     *   movies: [
     *     { title: "The Matrix", year: 1999, ids: { imdb: "tt0133093" } }
     *   ]
     * });
     * ```
     */
    remove: (params: SyncParams): Promise<SyncResponse> =>
      this._call("post", "/sync/history/remove", params),
  };
  /**
   * Playback progress operations for managing viewing progress.
   */
  public playback = {
    /**
     * Get current playback progress for all items.
     * OAuth Required
     * @param params Optional parameters for filtering
     * @returns Promise resolving to array of playback progress items
     * @example
     * ```ts
     * const allProgress = await client.sync.playback.get();
     * const movieProgress = await client.sync.playback.get({ type: "movies" });
     * const episodeProgress = await client.sync.playback.get({
     *   type: "episodes",
     *   page: 1,
     *   limit: 50
     * });
     * ```
     */
    get: (params?: {
      type?: "movies" | "episodes";
      page?: number;
      limit?: number;
    }): Promise<PlaybackProgress[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      let path = "/sync/playback";
      if (params?.type) {
        path += `/${params.type}`;
      }

      return this._call("get", path, searchParams);
    },

    /**
     * Set playback progress for an item.
     * OAuth Required
     * @param params Playback progress data
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.playback.set({
     *   progress: 65.5,
     *   app_version: "1.0.0",
     *   app_date: "2024-01-15T20:30:00.000Z",
     *   movie: {
     *     title: "Inception",
     *     year: 2010,
     *     ids: { imdb: "tt1375666" }
     *   }
     * });
     * ```
     */
    set: (params: PlaybackParams): Promise<SyncResponse> =>
      this._call("post", "/sync/playback", params),

    /**
     * Remove playback progress for an item.
     * OAuth Required
     * @param id The playback progress ID to remove
     * @returns Promise resolving to sync response
     * @example
     * ```ts
     * const response = await client.sync.playback.remove(12345);
     * ```
     */
    remove: (id: number): Promise<SyncResponse> =>
      this._call("delete", `/sync/playback/${id}`),
  };

  constructor(private readonly _call: CallMethod) {}
}
