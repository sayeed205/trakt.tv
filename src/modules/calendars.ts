/**
 * @fileoverview Calendars module for Trakt.tv API
 * Handles all calendar-related API endpoints including user-specific and public calendars
 * for shows, movies, premieres, finales, streaming, and DVD releases.
 */

import type {CalendarMovie, CalendarParams, CalendarShow,} from "../types/index.ts";

/**
 * Type definition for the call method dependency injection
 */
type CallMethod = <T = unknown>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  params?: Record<string, unknown>,
) => Promise<T>;

/**
 * CalendarsModule class handles all calendar-related API endpoints.
 * Provides access to both user-specific and public calendar data for shows and movies.
 */
export class CalendarsModule {
  /**
   * User-specific calendar endpoints for authenticated users.
   */
  public my = {
    /**
     * Get shows on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const shows = await client.calendars.my.shows();
     * const customShows = await client.calendars.my.shows({
     *   startDate: "2024-01-01",
     *   days: 14
     * });
     * ```
     */
    shows: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/shows/${startDate}/${days}`,
      );
    },

    /**
     * Get new shows on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const newShows = await client.calendars.my.newShows();
     * const customNewShows = await client.calendars.my.newShows({
     *   startDate: "2024-01-01",
     *   days: 30
     * });
     * ```
     */
    newShows: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/shows/new/${startDate}/${days}`,
      );
    },

    /**
     * Get season premieres on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const premieres = await client.calendars.my.seasonPremieres();
     * const customPremieres = await client.calendars.my.seasonPremieres({
     *   startDate: "2024-09-01",
     *   days: 7
     * });
     * ```
     */
    seasonPremieres: (
      params?: CalendarParams,
    ): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/shows/premieres/${startDate}/${days}`,
      );
    },

    /**
     * Get season finales on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const finales = await client.calendars.my.finales();
     * const customFinales = await client.calendars.my.finales({
     *   startDate: "2024-05-01",
     *   days: 14
     * });
     * ```
     */
    finales: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/shows/finales/${startDate}/${days}`,
      );
    },

    /**
     * Get movies on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const movies = await client.calendars.my.movies();
     * const customMovies = await client.calendars.my.movies({
     *   startDate: "2024-01-01",
     *   days: 30
     * });
     * ```
     */
    movies: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/movies/${startDate}/${days}`,
      );
    },

    /**
     * Get streaming movies on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const streaming = await client.calendars.my.streaming();
     * const customStreaming = await client.calendars.my.streaming({
     *   startDate: "2024-01-01",
     *   days: 7
     * });
     * ```
     */
    streaming: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/streaming/${startDate}/${days}`,
      );
    },

    /**
     * Get DVD releases on the user's calendar.
     * OAuth Required
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const dvd = await client.calendars.my.dvd();
     * const customDvd = await client.calendars.my.dvd({
     *   startDate: "2024-01-01",
     *   days: 7
     * });
     * ```
     */
    dvd: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/my/dvd/${startDate}/${days}`,
      );
    },
  };
  /**
   * Public calendar endpoints for all users.
   */
  public all = {
    /**
     * Get all shows calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const allShows = await client.calendars.all.shows();
     * const customAllShows = await client.calendars.all.shows({
     *   startDate: "2024-01-01",
     *   days: 14
     * });
     * ```
     */
    shows: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/shows/${startDate}/${days}`,
      );
    },

    /**
     * Get all new shows calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const allNewShows = await client.calendars.all.newShows();
     * const customAllNewShows = await client.calendars.all.newShows({
     *   startDate: "2024-01-01",
     *   days: 30
     * });
     * ```
     */
    newShows: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/shows/new/${startDate}/${days}`,
      );
    },

    /**
     * Get all season premieres calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const allPremieres = await client.calendars.all.seasonPremieres();
     * const customAllPremieres = await client.calendars.all.seasonPremieres({
     *   startDate: "2024-09-01",
     *   days: 7
     * });
     * ```
     */
    seasonPremieres: (
      params?: CalendarParams,
    ): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/shows/premieres/${startDate}/${days}`,
      );
    },

    /**
     * Get all season finales calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar shows
     * @example
     * ```ts
     * const allFinales = await client.calendars.all.finale();
     * const customAllFinales = await client.calendars.all.finale({
     *   startDate: "2024-05-01",
     *   days: 14
     * });
     * ```
     */
    finale: (params?: CalendarParams): Promise<CalendarShow[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/shows/finale/${startDate}/${days}`,
      );
    },

    /**
     * Get all movies calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const allMovies = await client.calendars.all.movies();
     * const customAllMovies = await client.calendars.all.movies({
     *   startDate: "2024-01-01",
     *   days: 30
     * });
     * ```
     */
    movies: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/movies/${startDate}/${days}`,
      );
    },

    /**
     * Get all streaming movies calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const allStreaming = await client.calendars.all.streaming();
     * const customAllStreaming = await client.calendars.all.streaming({
     *   startDate: "2024-01-01",
     *   days: 7
     * });
     * ```
     */
    streaming: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/streaming/${startDate}/${days}`,
      );
    },

    /**
     * Get all DVD releases calendar.
     * @param params Optional parameters for date range and pagination
     * @returns Promise resolving to array of calendar movies
     * @example
     * ```ts
     * const allDvd = await client.calendars.all.dvd();
     * const customAllDvd = await client.calendars.all.dvd({
     *   startDate: "2024-01-01",
     *   days: 7
     * });
     * ```
     */
    dvd: (params?: CalendarParams): Promise<CalendarMovie[]> => {
      const startDate = params?.startDate ?? this.formatDate(new Date());
      const days = params?.days ?? 7;

      return this._call(
        "get",
        `/calendars/all/dvd/${startDate}/${days}`,
      );
    },
  };

  constructor(private readonly _call: CallMethod) {}

  /**
   * Helper method to format date as YYYY-MM-DD
   * @param date Date object to format
   * @returns Formatted date string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
