/**
 * @fileoverview Genres module for Trakt.tv API
 * Handles all genre-related API endpoints for retrieving movie and show genres.
 * Provides access to the complete list of genres available on Trakt.tv for both movies and shows.
 */

import type { Genre } from "../types/index.ts";
import type { CallMethod } from "./base.ts";

/**
 * GenresModule class for handling genre-related API endpoints.
 * Provides methods to retrieve genre information for movies and shows.
 *
 * @example
 * ```ts
 * const genres = new GenresModule(callMethod);
 * const movieGenres = await genres.movies();
 * const showGenres = await genres.shows();
 * ```
 */
export class GenresModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get all movie genres available on Trakt.tv.
   * Returns a complete list of genres that can be associated with movies.
   *
   * @returns Promise resolving to array of movie genres
   * @example
   * ```ts
   * const movieGenres = await client.genres.movies();
   * console.log(movieGenres); // [{ name: "Action", slug: "action" }, ...]
   * ```
   */
  movies(): Promise<Genre[]> {
    return this._call("get", "/genres/movies");
  }

  /**
   * Get all show genres available on Trakt.tv.
   * Returns a complete list of genres that can be associated with TV shows.
   *
   * @returns Promise resolving to array of show genres
   * @example
   * ```ts
   * const showGenres = await client.genres.shows();
   * console.log(showGenres); // [{ name: "Drama", slug: "drama" }, ...]
   * ```
   */
  shows(): Promise<Genre[]> {
    return this._call("get", "/genres/shows");
  }
}
