/**
 * @fileoverview Movies module for Trakt.tv API
 * Handles all movie-related API endpoints including trending, popular, search, and metadata.
 * Provides comprehensive access to movie information, ratings, comments, and related data.
 */

import type {
  Certification,
  Comment,
  CommentUser,
  Genre,
  Language,
  Rating,
  Stats,
} from "../types/index.ts";
import type {
  AnticipatedMovie,
  BoxOfficeMovie,
  Movie,
  MovieAlias,
  MovieExtended,
  MovieList,
  MoviePeople,
  MovieRelease,
  MovieStudio,
  MovieTranslation,
  MovieUpdates,
  MovieVideo,
  PlayedMovie,
  TrendingMovies,
  WatchedMovie,
} from "../types/movies.ts";
import type { CallMethod } from "./base.ts";

/**
 * Movies module class providing access to all movie-related Trakt.tv API endpoints.
 *
 * This module handles movie discovery, metadata retrieval, ratings, comments,
 * and related functionality for the Trakt.tv API.
 */
export class MoviesModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get movie details by ID.
   *
   * @param id - Movie ID (Trakt ID, IMDB ID, or TMDB ID)
   * @returns Promise resolving to basic movie details
   * @example
   * ```ts
   * const movie = await client.movies.get("tron-legacy-2010");
   * console.log(movie.title); // "Tron: Legacy"
   * ```
   */
  get(id: string): Promise<Movie>;

  /**
   * Get extended movie details by ID.
   *
   * @param id - Movie ID (Trakt ID, IMDB ID, or TMDB ID)
   * @param extended - Set to true to get extended movie information
   * @returns Promise resolving to extended movie details with additional metadata
   * @example
   * ```ts
   * const extendedMovie = await client.movies.get("tron-legacy-2010", true);
   * console.log(extendedMovie.overview); // Movie plot summary
   * console.log(extendedMovie.runtime); // Runtime in minutes
   * ```
   */
  get(id: string, extended: true): Promise<MovieExtended>;

  /**
   * Get basic movie details by ID.
   *
   * @param id - Movie ID (Trakt ID, IMDB ID, or TMDB ID)
   * @param extended - Set to false to get basic movie information
   * @returns Promise resolving to basic movie details
   */
  get(id: string, extended: false): Promise<Movie>;

  get(id: string, extended?: boolean): Promise<Movie | MovieExtended> {
    const params = extended ? { extended: "full" } : {};
    return this._call("get", `/movies/${id}`, params);
  }

  /**
   * Get trending movies.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of trending movies with watcher counts
   * @example
   * ```ts
   * const trending = await client.movies.trending({ page: 1, limit: 10 });
   * trending.forEach(item => {
   *   console.log(`${item.movie.title} - ${item.watchers} watchers`);
   * });
   * ```
   */
  trending(params?: {
    page?: number;
    limit?: number;
  }): Promise<TrendingMovies[]> {
    return this._call("get", "/movies/trending", params);
  }

  /**
   * Get popular movies.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of popular movies
   * @example
   * ```ts
   * const popular = await client.movies.popular({ limit: 20 });
   * ```
   */
  popular(params?: {
    page?: number;
    limit?: number;
  }): Promise<Movie[]> {
    return this._call("get", "/movies/popular", params);
  }

  /**
   * Get most anticipated movies.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of anticipated movies with list counts
   * @example
   * ```ts
   * const anticipated = await client.movies.anticipated();
   * ```
   */
  anticipated(params?: {
    page?: number;
    limit?: number;
  }): Promise<AnticipatedMovie[]> {
    return this._call("get", "/movies/anticipated", params);
  }

  /**
   * Get most watched movies in a time period.
   *
   * @param params - Parameters including time period and pagination
   * @returns Promise resolving to array of watched movies with statistics
   * @example
   * ```ts
   * const weeklyWatched = await client.movies.watched({ period: "weekly" });
   * const allTimeWatched = await client.movies.watched({ period: "all", limit: 50 });
   * ```
   */
  watched(params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
    page?: number;
    limit?: number;
  }): Promise<WatchedMovie[]> {
    return this._call("get", `/movies/watched/${params?.period || "weekly"}`, {
      page: params?.page,
      limit: params?.limit,
    });
  }

  /**
   * Get most played movies in a time period.
   *
   * @param params - Parameters including time period and pagination
   * @returns Promise resolving to array of played movies with play statistics
   * @example
   * ```ts
   * const monthlyPlayed = await client.movies.played({ period: "monthly" });
   * ```
   */
  played(params?: {
    period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
    page?: number;
    limit?: number;
  }): Promise<PlayedMovie[]> {
    return this._call("get", `/movies/played/${params?.period || "weekly"}`, {
      page: params?.page,
      limit: params?.limit,
    });
  }

  /**
   * Get recently updated movies.
   *
   * @param params - Parameters including start date and pagination
   * @returns Promise resolving to array of recently updated movies
   * @example
   * ```ts
   * const updates = await client.movies.updates({
   *   start_date: "2023-01-01",
   *   limit: 100
   * });
   * ```
   */
  updates(params: {
    start_date: string;
    page?: number;
    limit?: number;
  }): Promise<MovieUpdates[]> {
    return this._call("get", "/movies/updates", params);
  }

  /**
   * Get movie aliases (alternative titles).
   *
   * @param id - Movie ID
   * @returns Promise resolving to array of movie aliases
   * @example
   * ```ts
   * const aliases = await client.movies.aliases("tron-legacy-2010");
   * ```
   */
  aliases(id: string): Promise<MovieAlias[]> {
    return this._call("get", `/movies/${id}/aliases`);
  }

  /**
   * Get movie release information.
   *
   * @param params - Parameters including movie ID and optional country filter
   * @returns Promise resolving to array of movie releases
   * @example
   * ```ts
   * const releases = await client.movies.releases({ id: "tron-legacy-2010" });
   * const usReleases = await client.movies.releases({
   *   id: "tron-legacy-2010",
   *   country: "us"
   * });
   * ```
   */
  releases(params: {
    id: string;
    country?: string;
  }): Promise<MovieRelease[]> {
    return this._call(
      "get",
      `/movies/${params.id}/releases${
        params.country ? `/${params.country}` : ""
      }`,
    );
  }

  /**
   * Get movie translations.
   *
   * @param params - Parameters including movie ID and optional language filter
   * @returns Promise resolving to array of movie translations
   * @example
   * ```ts
   * const translations = await client.movies.translations({ id: "tron-legacy-2010" });
   * const spanishTranslation = await client.movies.translations({
   *   id: "tron-legacy-2010",
   *   language: "es"
   * });
   * ```
   */
  translations(params: {
    id: string;
    language?: string;
  }): Promise<MovieTranslation[]> {
    return this._call(
      "get",
      `/movies/${params.id}/translations${
        params.language ? `/${params.language}` : ""
      }`,
    );
  }

  /**
   * Get movie comments.
   *
   * @param params - Parameters including movie ID and optional sort order
   * @returns Promise resolving to array of comments
   * @example
   * ```ts
   * const comments = await client.movies.comments({ id: "tron-legacy-2010" });
   * const topComments = await client.movies.comments({
   *   id: "tron-legacy-2010",
   *   sort: "likes"
   * });
   * ```
   */
  comments(params: {
    id: string | number;
    sort?:
      | "newest"
      | "oldest"
      | "likes"
      | "replies"
      | "highest"
      | "lowest"
      | "plays";
  }): Promise<Comment[]> {
    return this._call(
      "get",
      `/movies/${params.id}/comments/${params.sort ? params.sort : "newest"}`,
    );
  }

  /**
   * Get lists containing a movie.
   *
   * @param params - Parameters including movie ID, list type, and sort order
   * @returns Promise resolving to array of lists containing the movie
   * @example
   * ```ts
   * const lists = await client.movies.lists({ id: "tron-legacy-2010" });
   * const popularLists = await client.movies.lists({
   *   id: "tron-legacy-2010",
   *   type: "all",
   *   sort: "popular"
   * });
   * ```
   */
  lists(params: {
    id: string | number;
    type?: "all" | "personal" | "official" | "watchlists" | "favorites";
    sort?: "popular" | "likes" | "comments" | "items" | "added" | "updated";
  }): Promise<MovieList[]> {
    return this._call(
      "get",
      `/movies/${params.id}/lists/${params.type ? params.type : "personal"}/${
        params.sort ? params.sort : "popular"
      }`,
    );
  }

  /**
   * Get movie cast and crew information.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to movie cast and crew data
   * @example
   * ```ts
   * const people = await client.movies.people({ id: "tron-legacy-2010" });
   * ```
   */
  people(params: { id: string }): Promise<MoviePeople[]> {
    return this._call("get", `/movies/${params.id}/people`);
  }

  /**
   * Get movie ratings and distribution.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to rating statistics
   * @example
   * ```ts
   * const ratings = await client.movies.ratings({ id: "tron-legacy-2010" });
   * console.log(`Average rating: ${ratings.rating}/10`);
   * console.log(`Total votes: ${ratings.votes}`);
   * ```
   */
  ratings(params: { id: string }): Promise<{
    rating: number;
    votes: number;
    distribution: Record<Rating, number>;
  }> {
    return this._call("get", `/movies/${params.id}/ratings`);
  }

  /**
   * Get related movies.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of related movies
   * @example
   * ```ts
   * const related = await client.movies.related({ id: "tron-legacy-2010" });
   * ```
   */
  related(params: { id: string }): Promise<Movie[]> {
    return this._call("get", `/movies/${params.id}/related`);
  }

  /**
   * Get movie statistics.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to movie statistics
   * @example
   * ```ts
   * const stats = await client.movies.stats({ id: "tron-legacy-2010" });
   * console.log(`Watchers: ${stats.watchers}`);
   * console.log(`Plays: ${stats.plays}`);
   * ```
   */
  stats(params: { id: string }): Promise<Stats> {
    return this._call("get", `/movies/${params.id}/stats`);
  }

  /**
   * Get movie studios.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of movie studios
   * @example
   * ```ts
   * const studios = await client.movies.studios({ id: "tron-legacy-2010" });
   * ```
   */
  studios(params: { id: string }): Promise<MovieStudio[]> {
    return this._call("get", `/movies/${params.id}/studios`);
  }

  /**
   * Get users currently watching a movie.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of users currently watching
   * @example
   * ```ts
   * const watching = await client.movies.watching({ id: "tron-legacy-2010" });
   * ```
   */
  watching(params: { id: string }): Promise<CommentUser[]> {
    return this._call("get", `/movies/${params.id}/watching`);
  }

  /**
   * Get movie videos (trailers, clips, etc.).
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of movie videos
   * @example
   * ```ts
   * const videos = await client.movies.videos({ id: "tron-legacy-2010" });
   * ```
   */
  videos(params: { id: string }): Promise<MovieVideo[]> {
    return this._call("get", `/movies/${params.id}/videos`);
  }

  /**
   * Get current box office movies.
   *
   * @param params - Optional pagination parameters
   * @returns Promise resolving to array of box office movies with revenue data
   * @example
   * ```ts
   * const boxOffice = await client.movies.boxoffice({ limit: 10 });
   * boxOffice.forEach(item => {
   *   console.log(`${item.movie.title}: $${item.revenue.toLocaleString()}`);
   * });
   * ```
   */
  boxoffice(params?: {
    page?: number;
    limit?: number;
  }): Promise<BoxOfficeMovie[]> {
    return this._call("get", "/movies/boxoffice", params);
  }

  /**
   * Get movie certifications.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of movie certifications
   * @example
   * ```ts
   * const certifications = await client.movies.certifications({ id: "tron-legacy-2010" });
   * ```
   */
  certifications(params: { id: string }): Promise<Certification[]> {
    return this._call("get", `/movies/${params.id}/certifications`);
  }

  /**
   * Get movie languages.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of movie languages
   * @example
   * ```ts
   * const languages = await client.movies.languages({ id: "tron-legacy-2010" });
   * ```
   */
  languages(params: { id: string }): Promise<Language[]> {
    return this._call("get", `/movies/${params.id}/languages`);
  }

  /**
   * Get movie genres.
   *
   * @param params - Parameters including movie ID
   * @returns Promise resolving to array of movie genres
   * @example
   * ```ts
   * const genres = await client.movies.genres({ id: "tron-legacy-2010" });
   * ```
   */
  genres(params: { id: string }): Promise<Genre[]> {
    return this._call("get", `/movies/${params.id}/genres`);
  }

  /**
   * Get similar movies.
   *
   * @param params - Parameters including movie ID and optional pagination
   * @returns Promise resolving to array of similar movies
   * @example
   * ```ts
   * const similar = await client.movies.similar({
   *   id: "tron-legacy-2010",
   *   limit: 20
   * });
   * ```
   */
  similar(params: {
    id: string;
    page?: number;
    limit?: number;
  }): Promise<Movie[]> {
    return this._call("get", `/movies/${params.id}/similar`, {
      page: params.page,
      limit: params.limit,
    });
  }
}
