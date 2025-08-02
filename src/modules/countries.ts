/**
 * @fileoverview Countries module for Trakt.tv API
 * Handles all country-related API endpoints for retrieving movie and show countries.
 * Provides access to the list of countries where movies and shows are produced or available.
 */

import type { Country } from "../types/index.ts";
import type { CallMethod } from "./base.ts";

/**
 * CountriesModule class for handling country-related API endpoints.
 * Provides methods to retrieve country information for movies and shows.
 * Countries represent production countries or availability regions for content.
 *
 * @example
 * ```ts
 * const countries = new CountriesModule(callMethod);
 * const movieCountries = await countries.movies();
 * const showCountries = await countries.shows();
 * ```
 */
export class CountriesModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get all movie countries available on Trakt.tv.
   * Returns a list of countries where movies are produced or distributed.
   * Useful for filtering content by production country or regional availability.
   *
   * @returns Promise resolving to array of movie countries
   * @example
   * ```ts
   * const movieCountries = await client.countries.movies();
   * console.log(movieCountries); // [{ name: "United States", code: "us" }, ...]
   * ```
   */
  movies(): Promise<Country[]> {
    return this._call("get", "/countries/movies");
  }

  /**
   * Get all show countries available on Trakt.tv.
   * Returns a list of countries where TV shows are produced or distributed.
   * Useful for filtering content by production country or regional availability.
   *
   * @returns Promise resolving to array of show countries
   * @example
   * ```ts
   * const showCountries = await client.countries.shows();
   * console.log(showCountries); // [{ name: "United Kingdom", code: "gb" }, ...]
   * ```
   */
  shows(): Promise<Country[]> {
    return this._call("get", "/countries/shows");
  }
}
