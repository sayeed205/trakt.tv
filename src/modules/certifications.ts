/**
 * @fileoverview Certifications module for Trakt.tv API
 * Handles all certification-related API endpoints for retrieving movie and show certifications.
 * Provides access to content rating certifications (like PG, R, TV-MA) used by different countries.
 */

import type { Certification } from "../types/index.ts";
import type { CallMethod } from "./base.ts";

/**
 * CertificationsModule class for handling certification-related API endpoints.
 * Provides methods to retrieve certification information for movies and shows.
 * Certifications represent content ratings like PG, R, TV-MA, etc. used by different countries.
 *
 * @example
 * ```ts
 * const certifications = new CertificationsModule(callMethod);
 * const movieCertifications = await certifications.movies();
 * const showCertifications = await certifications.shows();
 * ```
 */
export class CertificationsModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get all movie certifications available on Trakt.tv.
   * Returns content rating certifications used for movies by different countries.
   * Includes ratings like G, PG, PG-13, R, NC-17 for US, and equivalent ratings for other countries.
   *
   * @returns Promise resolving to array of movie certifications
   * @example
   * ```ts
   * const movieCertifications = await client.certifications.movies();
   * console.log(movieCertifications); // [{ name: "PG", slug: "pg", description: "..." }, ...]
   * ```
   */
  movies(): Promise<Certification[]> {
    return this._call("get", "/certifications/movies");
  }

  /**
   * Get all show certifications available on Trakt.tv.
   * Returns content rating certifications used for TV shows by different countries.
   * Includes ratings like TV-Y, TV-PG, TV-14, TV-MA for US, and equivalent ratings for other countries.
   *
   * @returns Promise resolving to array of show certifications
   * @example
   * ```ts
   * const showCertifications = await client.certifications.shows();
   * console.log(showCertifications); // [{ name: "TV-MA", slug: "tv-ma", description: "..." }, ...]
   * ```
   */
  shows(): Promise<Certification[]> {
    return this._call("get", "/certifications/shows");
  }
}
