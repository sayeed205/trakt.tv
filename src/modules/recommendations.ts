/**
 * @fileoverview Recommendations module for Trakt.tv API
 * Handles all recommendation-related API endpoints including movie and show recommendations,
 * and functionality to hide items from future recommendations.
 */

import type { Movie } from "../types/movies.ts";
import type { Show } from "../types/shows.ts";

/**
 * Type definition for the call method dependency injection
 */
type CallMethod = <T = unknown>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  params?: Record<string, unknown>,
) => Promise<T>;

/**
 * RecommendationsModule handles all recommendation-related API endpoints.
 * Provides methods to get personalized movie and show recommendations,
 * as well as functionality to hide items from future recommendations.
 *
 * All recommendation methods require OAuth authentication.
 */
export class RecommendationsModule {
  /**
   * Hide functionality for removing items from future recommendations.
   * Provides methods to hide specific movies or shows from appearing
   * in future recommendation results.
   */
  hide = {
    /**
     * Hide a movie from future recommendations.
     * OAuth Required
     * @param id The movie ID (Trakt ID, IMDB ID, or TMDB ID)
     * @returns Promise resolving when movie is hidden
     * @example
     * ```ts
     * // Hide a movie by Trakt ID
     * await client.recommendations.hide.movie("tron-legacy-2010");
     *
     * // Hide a movie by IMDB ID
     * await client.recommendations.hide.movie("tt1104001");
     * ```
     */
    movie: (id: string): Promise<void> =>
      this._call("delete", `/recommendations/movies/${id}`),

    /**
     * Hide a show from future recommendations.
     * OAuth Required
     * @param id The show ID (Trakt ID, IMDB ID, TVDB ID, or TMDB ID)
     * @returns Promise resolving when show is hidden
     * @example
     * ```ts
     * // Hide a show by Trakt ID
     * await client.recommendations.hide.show("breaking-bad");
     *
     * // Hide a show by IMDB ID
     * await client.recommendations.hide.show("tt0903747");
     * ```
     */
    show: (id: string): Promise<void> =>
      this._call("delete", `/recommendations/shows/${id}`),
  };

  constructor(private readonly _call: CallMethod) {}

  /**
   * Get movie recommendations for the authenticated user.
   * OAuth Required
   * @param params Optional parameters for pagination and filtering
   * @param params.ignore_collected Whether to ignore movies in user's collection
   * @param params.ignore_watchlisted Whether to ignore movies in user's watchlist
   * @param params.page Page number for pagination
   * @param params.limit Number of items per page
   * @returns Promise resolving to array of recommended movies
   * @example
   * ```ts
   * // Get basic movie recommendations
   * const movies = await client.recommendations.movies();
   *
   * // Get recommendations with filtering
   * const filteredMovies = await client.recommendations.movies({
   *   ignore_collected: true,
   *   ignore_watchlisted: true,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  movies(params?: {
    ignore_collected?: boolean;
    ignore_watchlisted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Movie[]> {
    const searchParams: Record<string, unknown> = {};
    if (params?.ignore_collected !== undefined) {
      searchParams.ignore_collected = params.ignore_collected;
    }
    if (params?.ignore_watchlisted !== undefined) {
      searchParams.ignore_watchlisted = params.ignore_watchlisted;
    }
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/recommendations/movies", searchParams);
  }

  /**
   * Get show recommendations for the authenticated user.
   * OAuth Required
   * @param params Optional parameters for pagination and filtering
   * @param params.ignore_collected Whether to ignore shows in user's collection
   * @param params.ignore_watchlisted Whether to ignore shows in user's watchlist
   * @param params.page Page number for pagination
   * @param params.limit Number of items per page
   * @returns Promise resolving to array of recommended shows
   * @example
   * ```ts
   * // Get basic show recommendations
   * const shows = await client.recommendations.shows();
   *
   * // Get recommendations with filtering
   * const filteredShows = await client.recommendations.shows({
   *   ignore_collected: true,
   *   ignore_watchlisted: true,
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  shows(params?: {
    ignore_collected?: boolean;
    ignore_watchlisted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Show[]> {
    const searchParams: Record<string, unknown> = {};
    if (params?.ignore_collected !== undefined) {
      searchParams.ignore_collected = params.ignore_collected;
    }
    if (params?.ignore_watchlisted !== undefined) {
      searchParams.ignore_watchlisted = params.ignore_watchlisted;
    }
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/recommendations/shows", searchParams);
  }
}
