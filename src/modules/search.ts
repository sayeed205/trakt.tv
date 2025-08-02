/**
 * @fileoverview Search module for Trakt.tv API
 * Handles all search-related API endpoints including text search and ID-based search.
 * Provides comprehensive search functionality for movies, shows, episodes, people, and lists.
 */

import type {SearchIdParams, SearchResult, SearchTextParams,} from "../types/search.ts";
import type {CallMethod} from "./base.ts";

/**
 * Search module class providing access to all search-related Trakt.tv API endpoints.
 *
 * This module handles text-based search and ID-based search functionality,
 * allowing users to find movies, shows, episodes, people, and lists.
 */
export class SearchModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Search for movies, shows, episodes, people, and lists using text query.
   *
   * @param params - Search parameters including query string and optional filters
   * @returns Promise resolving to array of search results
   * @example
   * ```ts
   * // Search for movies containing "tron"
   * const movieResults = await client.search.text({
   *   query: "tron",
   *   type: "movie"
   * });
   *
   * // Search for shows from a specific year
   * const showResults = await client.search.text({
   *   query: "breaking bad",
   *   type: "show",
   *   year: 2008
   * });
   *
   * // Search with pagination
   * const paginatedResults = await client.search.text({
   *   query: "star wars",
   *   type: "movie",
   *   page: 2,
   *   limit: 20
   * });
   * ```
   */
  text(params: SearchTextParams): Promise<SearchResult[]> {
    const searchParams: Record<string, unknown> = {
      query: params.query,
    };

    if (params.year) {
      searchParams.year = params.year;
    }
    if (params.page) {
      searchParams.page = params.page;
    }
    if (params.limit) {
      searchParams.limit = params.limit;
    }

    const searchType = params.type;
    return this._call("get", `/search/${searchType}`, searchParams);
  }

  /**
   * Search for movies, shows, and episodes using external IDs.
   *
   * @param params - Search parameters including ID type and value
   * @returns Promise resolving to array of search results
   * @example
   * ```ts
   * // Search by IMDB ID
   * const imdbResults = await client.search.id({
   *   id_type: "imdb",
   *   id: "tt1375666"
   * });
   *
   * // Search by TMDB ID for movies only
   * const tmdbResults = await client.search.id({
   *   id_type: "tmdb",
   *   id: "20526",
   *   type: "movie"
   * });
   *
   * // Search by TVDB ID for shows
   * const tvdbResults = await client.search.id({
   *   id_type: "tvdb",
   *   id: "290434",
   *   type: "show"
   * });
   *
   * // Search with pagination
   * const paginatedResults = await client.search.id({
   *   id_type: "trakt",
   *   id: "12345",
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  id(params: SearchIdParams): Promise<SearchResult[]> {
    const searchParams: Record<string, unknown> = {};

    if (params.type) {
      searchParams.type = params.type;
    }
    if (params.page) {
      searchParams.page = params.page;
    }
    if (params.limit) {
      searchParams.limit = params.limit;
    }

    return this._call(
      "get",
      `/search/${params.id_type}/${encodeURIComponent(params.id)}`,
      searchParams,
    );
  }
}
