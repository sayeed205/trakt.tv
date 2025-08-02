/**
 * @fileoverview Languages module for Trakt.tv API
 * Handles all language-related API endpoints for retrieving movie and show languages.
 * Provides access to the list of languages used in movies and shows for audio, subtitles, or original content.
 */

import type { Language } from "../types/index.ts";
import type { CallMethod } from "./base.ts";

/**
 * LanguagesModule class for handling language-related API endpoints.
 * Provides methods to retrieve language information for movies and shows.
 * Languages represent audio languages, subtitle languages, or original content languages.
 *
 * @example
 * ```ts
 * const languages = new LanguagesModule(callMethod);
 * const movieLanguages = await languages.movies();
 * const showLanguages = await languages.shows();
 * ```
 */
export class LanguagesModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get all movie languages available on Trakt.tv.
   * Returns a list of languages used in movies for audio, subtitles, or as the original language.
   * Useful for filtering content by language preferences or finding foreign films.
   *
   * @returns Promise resolving to array of movie languages
   * @example
   * ```ts
   * const movieLanguages = await client.languages.movies();
   * console.log(movieLanguages); // [{ name: "English", code: "en" }, ...]
   * ```
   */
  movies(): Promise<Language[]> {
    return this._call("get", "/languages/movies");
  }

  /**
   * Get all show languages available on Trakt.tv.
   * Returns a list of languages used in TV shows for audio, subtitles, or as the original language.
   * Useful for filtering content by language preferences or finding international shows.
   *
   * @returns Promise resolving to array of show languages
   * @example
   * ```ts
   * const showLanguages = await client.languages.shows();
   * console.log(showLanguages); // [{ name: "Spanish", code: "es" }, ...]
   * ```
   */
  shows(): Promise<Language[]> {
    return this._call("get", "/languages/shows");
  }
}
