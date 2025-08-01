/**
 * Trakt.tv TypeScript SDK – Auth flow and API access for Trakt.tv.
 *
 * This module provides a Trakt client class for authenticating with the Trakt.tv API,
 * managing OAuth2 authorization, token refresh, and device code flows.
 *
 * @example
 * ```ts
 * import Trakt from "@hitarashi/trakt";
 *
 * const client = new Trakt({
 *   client_id: "YOUR_TRAKT_CLIENT_ID",
 *   client_secret: "YOUR_TRAKT_CLIENT_SECRET",
 * });
 *
 * // Get Auth URL
 * console.log(client.getUrl());
 *
 * // Exchange auth code
 * await client.exchangeCode("CODE_FROM_REDIRECT");
 * ```
 *
 * @module
 */
import type { Options } from "ky";
import ky from "ky";
import crypto from "node:crypto";

import {
  AddListItemsParams,
  Auth,
  CalendarMovie,
  CalendarParams,
  CalendarShow,
  Certification,
  CollectionItem,
  Comment,
  CommentPostParams,
  CommentReplyParams,
  CommentType,
  CommentUpdateParams,
  CommentUpdatesParams,
  CommentUser,
  Country,
  CreateListParams,
  DeviceCodeResponse,
  Genre,
  GetListItemsParams,
  GetListsParams,
  HistoryItem,
  Language,
  List,
  ListItem,
  ListItemResponse,
  MediaType,
  Network,
  PlaybackParams,
  PlaybackProgress,
  RatedItem,
  Rating,
  RecentCommentsParams,
  RemoveListItemsParams,
  ReorderListItemsParams,
  SearchIdParams,
  SearchResult,
  SearchTextParams,
  Stats,
  SyncParams,
  SyncResponse,
  TokenResponse,
  TraktOptions,
  TrendingCommentsParams,
  UpdateListParams,
  User,
  WatchedItem,
  WatchlistItem,
} from "./types/index.ts";
import {
  AnticipatedMovie,
  BoxOfficeMovie,
  Movie,
  MovieAlias,
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
} from "./types/movies.ts";
import {
  CheckCodeFailure,
  CheckCodeResponse,
  RatingDistribution,
} from "./types/shared.ts";
import {
  AnticipatedShow,
  Episode,
  PlayedShow,
  Season,
  Show,
  ShowAlias,
  ShowStats,
  ShowTranslation,
  ShowUpdates,
  TrendingShow,
  WatchedShow,
} from "./types/shows.ts";
import { CollectionType } from "./types/sync.ts";
import type {
  FollowRequest,
  HiddenItem,
  Like,
  UserCollection,
  UserComment,
  UserProfile,
  UserSettings,
} from "./types/users.ts";

/**
 * The main Trakt.tv API client for handling OAuth2 flows and token management.
 *
 * @example
 * ```ts
 * const client = new Trakt({
 *   client_id: "YOUR_TRAKT_CLIENT_ID",
 *   client_secret: "YOUR_TRAKT_CLIENT_SECRET"
 * });
 * ```
 */
export default class Trakt {
  public movies = {
    get: (id: string): Promise<Movie> => this._call("get", `/movies/${id}`),
    trending: (params?: {
      page?: number;
      limit?: number;
    }): Promise<TrendingMovies[]> =>
      this._call("get", "/movies/trending", params),
    popular: (params?: {
      page?: number;
      limit?: number;
    }): Promise<Movie[]> => this._call("get", "/movies/popular", params),
    anticipated: (params?: {
      page?: number;
      limit?: number;
    }): Promise<AnticipatedMovie[]> =>
      this._call("get", "/movies/anticipated", params),
    watched: (params?: {
      period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
      page?: number;
      limit?: number;
    }): Promise<WatchedMovie[]> =>
      this._call("get", `/movies/watched/${params?.period || "weekly"}`, {
        page: params?.page,
        limit: params?.limit,
      }),
    played: (params?: {
      period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
      page?: number;
      limit?: number;
    }): Promise<PlayedMovie[]> =>
      this._call("get", `/movies/played/${params?.period || "weekly"}`, {
        page: params?.page,
        limit: params?.limit,
      }),
    updates: (params: {
      start_date: string;
      page?: number;
      limit?: number;
    }): Promise<MovieUpdates[]> => this._call("get", "/movies/updates", params),
    aliases: (id: string): Promise<MovieAlias[]> =>
      this._call("get", `/movies/${id}/aliases`),
    releases: (params: {
      id: string;
      country?: string;
    }): Promise<MovieRelease[]> =>
      this._call(
        "get",
        `/movies/${params.id}/releases${
          params.country ? `/${params.country}` : ""
        }`,
      ),
    translations: (params: {
      id: string;
      language?: string;
    }): Promise<MovieTranslation[]> =>
      this._call(
        "get",
        `/movies/${params.id}/translations${
          params.language ? `/${params.language}` : ""
        }`,
      ),
    comments: (
      params: {
        id: string | number;
        sort?:
          | "newest"
          | "oldest"
          | "likes"
          | "replies"
          | "highest"
          | "lowest"
          | "plays";
      },
    ): Promise<Comment[]> =>
      this._call(
        "get",
        `/movies/${params.id}/comments/${params.sort ? params.sort : "newest"}`,
      ),
    lists: ({ id, type, sort }: {
      id: string | number;
      type?: "all" | "personal" | "official" | "watchlists" | "favorites";
      sort?: "popular" | "likes" | "comments" | "items" | "added" | "updated";
    }): Promise<MovieList[]> =>
      this._call(
        "get",
        `/movies/${id}/lists/${type ? type : "personal"}/${
          sort ? sort : "popular"
        }`,
      ),
    people: (params: { id: string }): Promise<MoviePeople[]> =>
      this._call("get", `/movies/${params.id}/people`),
    ratings: (params: { id: string }): Promise<{
      rating: number;
      votes: number;
      distribution: Record<Rating, number>;
    }> => this._call("get", `/movies/${params.id}/ratings`),
    related: (params: { id: string }): Promise<Movie[]> =>
      this._call("get", `/movies/${params.id}/related`),
    stats: (params: { id: string }): Promise<Stats> =>
      this._call("get", `/movies/${params.id}/stats`),
    studios: (params: { id: string }): Promise<MovieStudio[]> =>
      this._call("get", `/movies/${params.id}/studios`),
    watching: (params: { id: string }): Promise<CommentUser[]> =>
      this._call("get", `/movies/${params.id}/watching`),
    videos: (params: { id: string }): Promise<MovieVideo[]> =>
      this._call("get", `/movies/${params.id}/videos`),
    boxoffice: (params?: {
      page?: number;
      limit?: number;
    }): Promise<BoxOfficeMovie[]> =>
      this._call("get", "/movies/boxoffice", params),
    certifications: (params: { id: string }): Promise<Certification[]> =>
      this._call("get", `/movies/${params.id}/certifications`),
    languages: (params: { id: string }): Promise<Language[]> =>
      this._call("get", `/movies/${params.id}/languages`),
    genres: (params: { id: string }): Promise<Genre[]> =>
      this._call("get", `/movies/${params.id}/genres`),
    similar: (params: {
      id: string;
      page?: number;
      limit?: number;
    }): Promise<Movie[]> =>
      this._call("get", `/movies/${params.id}/similar`, {
        page: params.page,
        limit: params.limit,
      }),
  };

  public shows = {
    // Basic show operations
    get: (id: string): Promise<Show> => this._call("get", `/shows/${id}`),
    trending: (params?: {
      page?: number;
      limit?: number;
    }): Promise<TrendingShow[]> => this._call("get", "/shows/trending", params),
    popular: (params?: {
      page?: number;
      limit?: number;
    }): Promise<Show[]> => this._call("get", "/shows/popular", params),
    anticipated: (params?: {
      page?: number;
      limit?: number;
    }): Promise<AnticipatedShow[]> =>
      this._call("get", "/shows/anticipated", params),
    watched: (params?: {
      period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
      page?: number;
      limit?: number;
    }): Promise<WatchedShow[]> =>
      this._call("get", `/shows/watched/${params?.period || "weekly"}`, {
        page: params?.page,
        limit: params?.limit,
      }),
    played: (params?: {
      period?: "daily" | "weekly" | "monthly" | "yearly" | "all";
      page?: number;
      limit?: number;
    }): Promise<PlayedShow[]> =>
      this._call("get", `/shows/played/${params?.period || "weekly"}`, {
        page: params?.page,
        limit: params?.limit,
      }),
    updates: (params: {
      start_date: string;
      page?: number;
      limit?: number;
    }): Promise<ShowUpdates[]> => this._call("get", "/shows/updates", params),

    // Show metadata endpoints
    aliases: (id: string | number): Promise<ShowAlias[]> =>
      this._call("get", `/shows/${id}/aliases`),
    translations: (params: {
      id: string | number;
      language?: string;
    }): Promise<ShowTranslation[]> =>
      this._call(
        "get",
        `/shows/${params.id}/translations${
          params.language ? `/${params.language}` : ""
        }`,
      ),
    comments: (params: { id: string | number }): Promise<Comment[]> =>
      this._call("get", `/shows/${params.id}/comments`),
    lists: (params: { id: string | number }): Promise<List[]> =>
      this._call("get", `/shows/${params.id}/lists`),
    people: (params: { id: string | number }): Promise<MoviePeople[]> =>
      this._call("get", `/shows/${params.id}/people`),
    ratings: (params: { id: string | number }): Promise<RatingDistribution> =>
      this._call("get", `/shows/${params.id}/ratings`),
    related: (
      params: { id: string | number },
    ): Promise<Pick<Show, "title" | "year" | "ids">[]> =>
      this._call("get", `/shows/${params.id}/related`),
    stats: (params: { id: string | number }): Promise<ShowStats> =>
      this._call("get", `/shows/${params.id}/stats`),
    watching: (params: { id: string | number }): Promise<CommentUser[]> =>
      this._call("get", `/shows/${params.id}/watching`),

    // Seasons and episodes endpoints
    seasons: (params: {
      id: string | number;
    }): Promise<Pick<Season, "number" | "ids">[]> =>
      this._call("get", `/shows/${params.id}/seasons`),
    season: (params: {
      id: string | number;
      season: number;
    }): Promise<Season[]> =>
      this._call("get", `/shows/${params.id}/seasons/${params.season}/info`),
    episodes: (params: {
      id: string | number;
      season: number;
      translations?: string;
    }): Promise<Pick<Episode, "season" | "number" | "title" | "ids">[]> =>
      this._call("get", `/shows/${params.id}/seasons/${params.season}`, {
        translations: params.translations,
      }),
    episode: (params: {
      id: string | number;
      season: number;
      episode: number;
    }): Promise<Episode> =>
      this._call(
        "get",
        `/shows/${params.id}/seasons/${params.season}/episodes/${params.episode}`,
      ),
  };

  public search = {
    /**
     * Search for movies, shows, episodes, people, and lists using text query.
     * @param params Search parameters including query string and optional filters
     * @returns Promise resolving to array of search results
     */
    text: (params: SearchTextParams): Promise<SearchResult[]> => {
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
    },

    /**
     * Search for movies, shows, and episodes using external IDs.
     * @param params Search parameters including ID type and value
     * @returns Promise resolving to array of search results
     */
    id: (params: SearchIdParams): Promise<SearchResult[]> => {
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
    },
  };

  public calendars = {
    /**
     * User-specific calendar endpoints for authenticated users.
     */
    my: {
      /**
       * Get shows on the user's calendar.
       * @param params Optional parameters for date range and pagination
       * @returns Promise resolving to array of calendar shows
       */
      shows: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/shows/${startDate}/${days}`,
        );
      },

      /**
       * Get new shows on the user's calendar.
       * @param params Optional parameters for date range and pagination
       * @returns Promise resolving to array of calendar shows
       */
      newShows: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/shows/new/${startDate}/${days}`,
        );
      },

      /**
       * Get season premieres on the user's calendar.
       * @param params Optional parameters for date range and pagination
       * @returns Promise resolving to array of calendar shows
       */
      seasonPremieres: (
        params?: CalendarParams,
      ): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/shows/premieres/${startDate}/${days}`,
        );
      },

      /**
       * Get season finales on the user's calendar.
       * @param params Optional parameter
       * @example
       * ```ts
       * finales({startDate: "2014-09-01",days: 7})
       * ```
       */
      finales: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/shows/finales/${startDate}/${days}`,
        );
      },

      /**
       * Get movies on the user's calendar.
       * @param params Optional parameters for date range and pagination
       * @returns Promise resolving to array of calendar movies
       */
      movies: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/movies/${startDate}/${days}`,
        );
      },

      streaming: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/streaming/${startDate}/${days}`,
        );
      },

      dvd: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/my/dvd/${startDate}/${days}`,
        );
      },
    },

    /**
     * Public calendar endpoints for all users.
     */
    all: {
      /**
       * Get all shows calendar.
       * @param params Optional parameters for date range and pagination
       * @returns Promise resolving to array of calendar shows
       */
      shows: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
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
       */
      newShows: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
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
       */
      seasonPremieres: (
        params?: CalendarParams,
      ): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/all/shows/premieres/${startDate}/${days}`,
        );
      },

      finale: (params?: CalendarParams): Promise<CalendarShow[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
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
       */
      movies: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/all/movies/${startDate}/${days}`,
        );
      },

      streaming: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/all/streaming/${startDate}/${days}`,
        );
      },

      dvd: (params?: CalendarParams): Promise<CalendarMovie[]> => {
        const startDate = params?.startDate ?? formatDate(new Date());
        const days = params?.days ?? 7;

        return this._call(
          "get",
          `/calendars/all/dvd/${startDate}/${days}`,
        );
      },
    },
  };

  public users = {
    get: (id: string): Promise<User> => this._call("get", `/users/${id}`),
    collection: (params: {
      id: string;
      type: "movies" | "shows";
    }): Promise<UserCollection[]> =>
      this._call("get", `/users/${params.id}/collection/${params.type}`),
    comments: (params: {
      id: string;
      type: "all" | MediaType;
      comment_type: CommentType;
    }): Promise<UserComment> =>
      this._call(
        "get",
        `/users/${params.id}/comments/${params.type}/${params.comment_type}`,
      ),
    lists: (params: { id: string }): Promise<List[]> =>
      this._call("get", `/users/${params.id}/lists`),
    followers: (params: { id: string }): Promise<User[]> =>
      this._call("get", `/users/${params.id}/followers`),
    following: (params: { id: string }): Promise<User[]> =>
      this._call("get", `/users/${params.id}/following`),
    friends: (params: { id: string }): Promise<User[]> =>
      this._call("get", `/users/${params.id}/friends`),
    history: (params: {
      id: string;
      type: MediaType;
      item_id?: string;
      start_at?: string;
      end_at?: string;
    }): Promise<HistoryItem[]> =>
      this._call(
        "get",
        `/users/${params.id}/history${params.type ? `/${params.type}` : ""}${
          params.item_id ? `/${params.item_id}` : ""
        }?start_at=${params.start_at}&end_at=${params.end_at}`,
      ),
    ratings: (
      params: { id: string; type: MediaType; rating?: number },
    ): Promise<RatedItem[]> =>
      this._call(
        "get",
        `/users/${params.id}/ratings/${params.type}${
          params.rating ? `/${params.rating}` : ""
        }`,
      ),
    watchlist: (
      params: { id: string; type: MediaType },
    ): Promise<WatchlistItem[]> =>
      this._call("get", `/users/${params.id}/watchlist/${params.type}`),
    stats: (params: { id: string }): Promise<Stats> =>
      this._call("get", `/users/${params.id}/stats`),
    follow: (params: { id: string }): Promise<void> =>
      this._call("post", `/users/${params.id}/follow`),
    unfollow: (params: { id: string }): Promise<void> =>
      this._call("delete", `/users/${params.id}/follow`),
    approve: (params: { id: string }): Promise<void> =>
      this._call("post", `/users/requests/${params.id}`),
    deny: (params: { id: string }): Promise<void> =>
      this._call("delete", `/users/requests/${params.id}`),

    // User settings and profile management
    settings: (): Promise<UserSettings> => this._call("get", "/users/settings"),
    updateSettings: (
      params: Partial<UserSettings>,
    ): Promise<UserSettings> => this._call("post", "/users/settings", params),
    profile: (): Promise<UserProfile> => this._call("get", "/users/me"),
    updateProfile: (params: Partial<UserProfile>): Promise<UserProfile> =>
      this._call("post", "/users/me", params),

    // Follow requests management
    requests: (): Promise<FollowRequest[]> =>
      this._call("get", "/users/requests"),

    // Hidden items management
    hidden: (
      section:
        | "calendar"
        | "progress_watched"
        | "progress_collected"
        | "recommendations",
    ): Promise<HiddenItem[]> => this._call("get", `/users/hidden/${section}`),

    // User likes
    likes: (params?: {
      type?: "comments" | "lists";
      page?: number;
      limit?: number;
    }): Promise<Like[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.type) searchParams.type = params.type;
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/users/likes", searchParams);
    },

    // Enhanced user data endpoints for authenticated user
    watched: (type: "movies" | "shows"): Promise<WatchedItem[]> =>
      this._call("get", `/users/me/watched/${type}`),
    myCollection: (
      type: "movies" | "shows",
    ): Promise<CollectionItem<"movies" | "shows">[]> =>
      this._call("get", `/users/me/collection/${type}`),
    myRatings: (
      type: "movies" | "shows" | "seasons" | "episodes",
      rating?: number,
    ): Promise<RatedItem[]> => {
      const path = rating
        ? `/users/me/ratings/${type}/${rating}`
        : `/users/me/ratings/${type}`;
      return this._call("get", path);
    },
    myWatchlist: (
      type: "movies" | "shows" | "seasons" | "episodes",
    ): Promise<WatchlistItem[]> =>
      this._call("get", `/users/me/watchlist/${type}`),
    myHistory: (params?: {
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

      let path = "/users/me/history";
      if (params?.type) {
        path += `/${params.type}`;
        if (params?.id) {
          path += `/${params.id}`;
        }
      }

      return this._call("get", path, searchParams);
    },
    myRecommendations: {
      movies: (params?: {
        ignore_collected?: boolean;
        ignore_watchlisted?: boolean;
        page?: number;
        limit?: number;
      }): Promise<Movie[]> => {
        const searchParams: Record<string, unknown> = {};
        if (params?.ignore_collected !== undefined) {
          searchParams.ignore_collected = params.ignore_collected;
        }
        if (params?.ignore_watchlisted !== undefined) {
          searchParams.ignore_watchlisted = params.ignore_watchlisted;
        }
        if (params?.page) searchParams.page = params.page;
        if (params?.limit) searchParams.limit = params.limit;

        return this._call(
          "get",
          "/users/me/recommendations/movies",
          searchParams,
        );
      },
      shows: (params?: {
        ignore_collected?: boolean;
        ignore_watchlisted?: boolean;
        page?: number;
        limit?: number;
      }): Promise<Show[]> => {
        const searchParams: Record<string, unknown> = {};
        if (params?.ignore_collected !== undefined) {
          searchParams.ignore_collected = params.ignore_collected;
        }
        if (params?.ignore_watchlisted !== undefined) {
          searchParams.ignore_watchlisted = params.ignore_watchlisted;
        }
        if (params?.page) searchParams.page = params.page;
        if (params?.limit) searchParams.limit = params.limit;

        return this._call(
          "get",
          "/users/me/recommendations/shows",
          searchParams,
        );
      },
    },
  };

  public recommendations = {
    /**
     * Get movie recommendations for the authenticated user.
     * OAuth Required
     * @param params Optional parameters for pagination and filtering
     * @returns Promise resolving to array of recommended movies
     */
    movies: (params?: {
      ignore_collected?: boolean;
      ignore_watchlisted?: boolean;
      page?: number;
      limit?: number;
    }): Promise<Movie[]> => {
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
    },

    /**
     * Get show recommendations for the authenticated user.
     * OAuth Required
     * @param params Optional parameters for pagination and filtering
     * @returns Promise resolving to array of recommended shows
     */
    shows: (params?: {
      ignore_collected?: boolean;
      ignore_watchlisted?: boolean;
      page?: number;
      limit?: number;
    }): Promise<Show[]> => {
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
    },

    /**
     * Hide functionality for removing items from future recommendations.
     */
    hide: {
      /**
       * Hide a movie from future recommendations.
       * OAuth Required
       * @param id The movie ID (Trakt ID, IMDB ID, or TMDB ID)
       * @returns Promise resolving when movie is hidden
       */
      movie: (id: string): Promise<void> =>
        this._call("delete", `/recommendations/movies/${id}`),

      /**
       * Hide a show from future recommendations.
       * OAuth Required
       * @param id The show ID (Trakt ID, IMDB ID, TVDB ID, or TMDB ID)
       * @returns Promise resolving when show is hidden
       */
      show: (id: string): Promise<void> =>
        this._call("delete", `/recommendations/shows/${id}`),
    },
  };

  public sync = {
    /**
     * Collection sync operations for managing user's collected items.
     */
    collection: {
      /**
       * Get all collected items for a specific media type.
       * OAuth Required
       * @param type The media type to retrieve (movies or shows)
       * @returns Promise resolving to array of collection items
       */
      get: <T extends CollectionType>(
        type: T,
      ): Promise<CollectionItem<T>[]> =>
        this._call("get", `/sync/collection/${type}`),

      /**
       * Add items to user's collection.
       * OAuth and *VIP Enhanced* is Required
       * @param params Items to add to collection
       * @returns Promise resolving to sync response
       */
      add: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/collection", params),

      /**
       * Remove items from user's collection.
       * @param params Items to remove from collection
       * @returns Promise resolving to sync response
       */
      remove: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/collection/remove", params),
    },

    /**
     * Watched sync operations for managing user's watch history.
     */
    watched: {
      /**
       * Get all watched items for a specific media type.
       * @param type The media type to retrieve (movies or shows)
       * @returns Promise resolving to array of watched items
       */
      get: (type: "movies" | "shows"): Promise<WatchedItem[]> =>
        this._call("get", `/sync/watched/${type}`),

      /**
       * Add items to user's watched history.
       * @param params Items to mark as watched
       * @returns Promise resolving to sync response
       */
      add: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/history", params),

      /**
       * Remove items from user's watched history.
       * @param params Items to remove from watched history
       * @returns Promise resolving to sync response
       */
      remove: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/history/remove", params),
    },

    /**
     * Ratings sync operations for managing user's ratings.
     */
    ratings: {
      /**
       * Get all rated items for a specific media type.
       * @param type The media type to retrieve
       * @param rating Optional specific rating to filter by (1-10)
       * @returns Promise resolving to array of rated items
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
       * @param params Items with ratings to add
       * @returns Promise resolving to sync response
       */
      add: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/ratings", params),

      /**
       * Remove ratings from items.
       * @param params Items to remove ratings from
       * @returns Promise resolving to sync response
       */
      remove: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/ratings/remove", params),
    },

    /**
     * Watchlist sync operations for managing user's watchlist.
     */
    watchlist: {
      /**
       * Get all watchlist items for a specific media type.
       * @param type The media type to retrieve
       * @returns Promise resolving to array of watchlist items
       */
      get: (
        type: "movies" | "shows" | "seasons" | "episodes",
      ): Promise<WatchlistItem[]> =>
        this._call("get", `/sync/watchlist/${type}`),

      /**
       * Add items to user's watchlist.
       * @param params Items to add to watchlist
       * @returns Promise resolving to sync response
       */
      add: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/watchlist", params),

      /**
       * Remove items from user's watchlist.
       * @param params Items to remove from watchlist
       * @returns Promise resolving to sync response
       */
      remove: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/watchlist/remove", params),
    },

    /**
     * History sync operations for managing detailed watch history.
     */
    history: {
      /**
       * Get user's watch history with optional filters.
       * @param params Optional parameters for filtering history
       * @returns Promise resolving to array of history items
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
       * @param params Items to add to history
       * @returns Promise resolving to sync response
       */
      add: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/history", params),

      /**
       * Remove items from user's watch history.
       * @param params Items to remove from history
       * @returns Promise resolving to sync response
       */
      remove: (params: SyncParams): Promise<SyncResponse> =>
        this._call("post", "/sync/history/remove", params),
    },

    /**
     * Playback progress operations for managing viewing progress.
     */
    playback: {
      /**
       * Get current playback progress for all items.
       * @param params Optional parameters for filtering
       * @returns Promise resolving to array of playback progress items
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
       * @param params Playback progress data
       * @returns Promise resolving to sync response
       */
      set: (params: PlaybackParams): Promise<SyncResponse> =>
        this._call("post", "/sync/playback", params),

      /**
       * Remove playback progress for an item.
       * @param id The playback progress ID to remove
       * @returns Promise resolving to sync response
       */
      remove: (id: number): Promise<SyncResponse> =>
        this._call("delete", `/sync/playback/${id}`),
    },
  };

  public lists = {
    /**
     * Get trending lists.
     * @param params Optional parameters for pagination
     * @returns Promise resolving to array of trending lists
     */
    trending: (params?: GetListsParams): Promise<List[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/lists/trending", searchParams);
    },

    /**
     * Get popular lists.
     * @param params Optional parameters for pagination
     * @returns Promise resolving to array of popular lists
     */
    popular: (params?: GetListsParams): Promise<List[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/lists/popular", searchParams);
    },

    /**
     * Get a specific list by ID.
     * OAuth Required for private lists
     * @param id The list ID (Trakt ID or slug)
     * @returns Promise resolving to the list
     */
    get: (id: string): Promise<List> => this._call("get", `/lists/${id}`),

    /**
     * Get items from a specific list.
     * OAuth Required for private lists
     * @param id The list ID (Trakt ID or slug)
     * @param params Optional parameters for filtering and pagination
     * @returns Promise resolving to array of list items
     */
    items: (
      id: string,
      params?: GetListItemsParams,
    ): Promise<ListItem[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.type) searchParams.type = params.type;
      if (params?.extended) searchParams.extended = params.extended;
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", `/lists/${id}/items`, searchParams);
    },

    /**
     * Get comments for a specific list.
     * @param id The list ID (Trakt ID or slug)
     * @param sort Optional parameters for sorting
     * @returns Promise resolving to array of comments
     */
    comments: (
      id: string,
      sort: "newest" | "oldest" | "likes" | "replies" = "newest",
    ): Promise<Comment[]> => {
      return this._call("get", `/lists/${id}/comments/${sort}`);
    },

    /**
     * Create a new list.
     * OAuth Required
     * @param params List creation parameters
     * @returns Promise resolving to the created list
     */
    create: (params: CreateListParams): Promise<List> =>
      this._call("post", "/lists", params),

    /**
     * Update an existing list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @param params List update parameters
     * @returns Promise resolving to the updated list
     */
    update: (id: string, params: UpdateListParams): Promise<List> =>
      this._call("put", `/lists/${id}`, params),

    /**
     * Delete a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @returns Promise resolving when list is deleted
     */
    delete: (id: string): Promise<void> => this._call("delete", `/lists/${id}`),

    /**
     * Like a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @returns Promise resolving when list is liked
     */
    like: (id: string): Promise<void> =>
      this._call("post", `/lists/${id}/like`),

    /**
     * Unlike a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @returns Promise resolving when list is unliked
     */
    unlike: (id: string): Promise<void> =>
      this._call("delete", `/lists/${id}/like`),

    /**
     * List item management operations.
     */
    itemManagement: {
      /**
       * Add items to a list.
       * OAuth Required
       * @param id The list ID (Trakt ID or slug)
       * @param params Items to add to the list
       * @returns Promise resolving to operation response
       */
      add: (
        id: string,
        params: AddListItemsParams,
      ): Promise<ListItemResponse> =>
        this._call("post", `/lists/${id}/items`, params),

      /**
       * Remove items from a list.
       * OAuth Required
       * @param id The list ID (Trakt ID or slug)
       * @param params Items to remove from the list
       * @returns Promise resolving to operation response
       */
      remove: (
        id: string,
        params: RemoveListItemsParams,
      ): Promise<ListItemResponse> =>
        this._call("post", `/lists/${id}/items/remove`, params),

      /**
       * Reorder items in a list.
       * OAuth Required
       * @param id The list ID (Trakt ID or slug)
       * @param params New order for list items
       * @returns Promise resolving to operation response
       */
      reorder: (
        id: string,
        params: ReorderListItemsParams,
      ): Promise<ListItemResponse> =>
        this._call("post", `/lists/${id}/items/reorder`, params),
    },
  };

  public comments = {
    /**
     * Get a specific comment by ID.
     * @param id The comment ID
     * @returns Promise resolving to the comment
     */
    get: (id: number): Promise<Comment> => this._call("get", `/comments/${id}`),

    /**
     * Create a new comment.
     * OAuth Required
     * @param params Comment creation parameters
     * @returns Promise resolving to the created comment
     */
    create: (params: CommentPostParams): Promise<Comment> =>
      this._call("post", "/comments", params),

    /**
     * Update an existing comment.
     * OAuth Required
     * @param id The comment ID to update
     * @param params Comment update parameters
     * @returns Promise resolving to the updated comment
     */
    update: (id: number, params: CommentUpdateParams): Promise<Comment> =>
      this._call("put", `/comments/${id}`, params),

    /**
     * Delete a comment.
     * OAuth Required
     * @param id The comment ID to delete
     * @returns Promise resolving when comment is deleted
     */
    delete: (id: number): Promise<void> =>
      this._call("delete", `/comments/${id}`),

    /**
     * Get replies to a specific comment.
     * @param id The parent comment ID
     * @param params Optional parameters for pagination
     * @returns Promise resolving to array of reply comments
     */
    replies: (
      id: number,
      params?: { page?: number; limit?: number },
    ): Promise<Comment[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", `/comments/${id}/replies`, searchParams);
    },

    /**
     * Create a reply to a comment.
     * OAuth Required
     * @param id The parent comment ID
     * @param params Reply parameters
     * @returns Promise resolving to the created reply comment
     */
    reply: (id: number, params: CommentReplyParams): Promise<Comment> =>
      this._call("post", `/comments/${id}/replies`, params),

    /**
     * Like a comment.
     * OAuth Required
     * @param id The comment ID to like
     * @returns Promise resolving when comment is liked
     */
    like: (id: number): Promise<void> =>
      this._call("post", `/comments/${id}/like`),

    /**
     * Unlike a comment.
     * OAuth Required
     * @param id The comment ID to unlike
     * @returns Promise resolving when comment is unliked
     */
    unlike: (id: number): Promise<void> =>
      this._call("delete", `/comments/${id}/like`),

    /**
     * Get trending comments.
     * @param params Optional parameters for filtering and pagination
     * @returns Promise resolving to array of trending comments
     */
    trending: (params?: TrendingCommentsParams): Promise<Comment[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.comment_type) {
        searchParams.comment_type = params.comment_type;
      }
      if (params?.type) searchParams.type = params.type;
      if (params?.include_replies !== undefined) {
        searchParams.include_replies = params.include_replies;
      }
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/comments/trending", searchParams);
    },

    /**
     * Get recent comments.
     * @param params Optional parameters for filtering and pagination
     * @returns Promise resolving to array of recent comments
     */
    recent: (params?: RecentCommentsParams): Promise<Comment[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.comment_type) {
        searchParams.comment_type = params.comment_type;
      }
      if (params?.type) searchParams.type = params.type;
      if (params?.include_replies !== undefined) {
        searchParams.include_replies = params.include_replies;
      }
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/comments/recent", searchParams);
    },

    /**
     * Get comment updates.
     * @param params Optional parameters for filtering and pagination
     * @returns Promise resolving to array of updated comments
     */
    updates: (params?: CommentUpdatesParams): Promise<Comment[]> => {
      const searchParams: Record<string, unknown> = {};
      if (params?.comment_type) {
        searchParams.comment_type = params.comment_type;
      }
      if (params?.type) searchParams.type = params.type;
      if (params?.include_replies !== undefined) {
        searchParams.include_replies = params.include_replies;
      }
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;

      return this._call("get", "/comments/updates", searchParams);
    },
  };

  /**
   * Genres endpoints for retrieving movie and show genres.
   */
  public genres = {
    /**
     * Get all movie genres.
     * @returns Promise resolving to array of movie genres
     */
    movies: (): Promise<Genre[]> => this._call("get", "/genres/movies"),

    /**
     * Get all show genres.
     * @returns Promise resolving to array of show genres
     */
    shows: (): Promise<Genre[]> => this._call("get", "/genres/shows"),
  };
  /**
   * Certifications endpoints for retrieving movie and show certifications.
   */
  public certifications = {
    /**
     * Get all movie certifications.
     * @returns Promise resolving to array of movie certifications
     */
    movies: (): Promise<Certification[]> =>
      this._call("get", "/certifications/movies"),

    /**
     * Get all show certifications.
     * @returns Promise resolving to array of show certifications
     */
    shows: (): Promise<Certification[]> =>
      this._call("get", "/certifications/shows"),
  };
  /**
   * Countries endpoints for retrieving movie and show countries.
   */
  public countries = {
    /**
     * Get all movie countries.
     * @returns Promise resolving to array of movie countries
     */
    movies: (): Promise<Country[]> => this._call("get", "/countries/movies"),

    /**
     * Get all show countries.
     * @returns Promise resolving to array of show countries
     */
    shows: (): Promise<Country[]> => this._call("get", "/countries/shows"),
  };
  /**
   * Languages endpoints for retrieving movie and show languages.
   */
  public languages = {
    /**
     * Get all movie languages.
     * @returns Promise resolving to array of movie languages
     */
    movies: (): Promise<Language[]> => this._call("get", "/languages/movies"),

    /**
     * Get all show languages.
     * @returns Promise resolving to array of show languages
     */
    shows: (): Promise<Language[]> => this._call("get", "/languages/shows"),
  };
  private settings: TraktOptions;
  private auth: Auth;

  /**
   * Constructs a new {@link Trakt} client.
   * @param settings Configuration options for Trakt.tv API access.
   * @param auth Initial authentication object to restore session (optional).
   */
  constructor(settings: TraktOptions, auth: Auth = {}) {
    this.settings = {
      ...settings,
      api_url: "https://api.trakt.tv",
      redirect_uri: settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      user_agent: "trakt.tv",
      pagination: false,
    };
    this.auth = auth;
  }

  /**
   * Get all networks.
   * @returns Promise resolving to array of networks
   */
  public networks = (): Promise<Network[]> => this._call("get", "/networks");

  /**
   * Generates an OAuth2 authorization URL for user consent.
   * @returns The authorization URL to redirect the user.
   *
   * @example
   * ```ts
   * const url = client.getUrl();
   * window.location.href = url;
   * ```
   */
  public getUrl(): string {
    this.auth.state = crypto.randomBytes(6).toString("hex");
    const baseUrl = this.settings.api_url!.replace(/api\W/, "");
    return `${baseUrl}/oauth/authorize?response_type=code&client_id=${this.settings.client_id}&redirect_uri=${
      this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob"
    }&state=${this.auth.state}`;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   * @param code The authorization code returned from user consent redirect.
   * @param state (Optional) State value to check for CSRF protection.
   * @returns The OAuth {@link TokenResponse} object.
   *
   * @throws Error if the state does not match the CSRF token.
   * @example
   * ```ts
   * const tokens = await client.exchangeCode("CODE_FROM_REDIRECT");
   * ```
   */
  public exchangeCode(code: string, state?: string): Promise<TokenResponse> {
    if (state && state !== this.auth.state) {
      throw new Error("Invalid CSRF (State)");
    }

    return this._exchange({
      code,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret!,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "authorization_code",
    });
  }

  /**
   * Generate new codes to start the device authentication process.
   * The `device_code` and interval will be used later to poll for the access_token.
   * The `user_code` and `verification_url` should be presented to the user as mentioned in the flow steps above.
   * *QR Code*
   * You might consider generating a QR code for the user to easily scan on their mobile device.
   * The QR code should be a URL that redirects to the verification_url and appends the user_code.
   * For example, https://trakt.tv/activate/5055CC52 would load the Trakt hosted `verification_url` and pre-fill in the `user_code`.
   * @returns A device code response {@link DeviceCodeResponse} used to direct the user to verify.
   *
   * @example
   * ```ts
   * const codes = await client.getCodes();
   * console.log(`Go to ${codes.verification_url} and enter code: ${codes.user_code}`);
   * ```
   */
  public getCodes(): Promise<DeviceCodeResponse> {
    return this._deviceCode(
      {
        client_id: this.settings.client_id,
      },
      "code",
    ) as Promise<DeviceCodeResponse>;
  }

  /**
   * Use this to verify the OAuth2 Device code flow
   * Use the device_code and poll at the interval (in seconds) to check if the user has authorized you app.
   * Use expires_in to stop polling after that many seconds, and gracefully instruct the user to restart the process.
   * It is important to poll at the correct interval and also stop polling when expired.
   *
   * When you receive a `200` success response,
   * save the `access_token` so your app can authenticate the user in methods that require it.
   * The `access_token` is valid for 24 hours.
   * Save and use the `refresh_token` to get a new access_token without asking the user to re-authenticate.
   * Check below for all the error codes that you should handle.
   *
   * `200`	Success - save the `access_token`
   *
   * `400`	Pending - waiting for the user to authorize your app
   *
   * `404`	Not Found - invalid `device_code`
   *
   * `409`	Already Used - user already approved this code
   *
   * `410`	Expired - the tokens have expired, restart the process
   *
   * `418`	Denied - user explicitly denied this code
   *
   * `429`	Slow Down - your app is polling too quickly
   *
   * @param code The device code returned from the initial request.
   * @returns The OAuth {@link TokenResponse} object.
   */
  public async checkCodes(code: string): Promise<CheckCodeResponse> {
    try {
      const data = (await this._deviceCode(
        {
          code,
          client_id: this.settings.client_id,
          client_secret: this.settings.client_secret!,
        },
        "token",
      )) as TokenResponse;

      return { status: 200, message: "Success", data };
    } catch (error: any) {
      const status: number = error.response?.status ?? 500;
      let message = "Unknown error";

      switch (status) {
        case 400:
          message = "Pending – waiting for user authorization";
          break;
        case 404:
          message = "Not Found – invalid device_code";
          break;
        case 409:
          message = "Already Used – user already approved this code";
          break;
        case 410:
          message = "Expired – the tokens have expired, restart the process";
          break;
        case 418:
          message = "Denied – user explicitly denied this code";
          break;
        case 429:
          message = "Slow Down – polling too quickly";
          break;
        default:
          message = error.response?.statusText ?? "Network or server error";
      }

      return { status: status as CheckCodeFailure["status"], message };
    }
  }

  /**
   * Refreshes the access token using the stored refresh token.
   * @returns A new OAuth {@link TokenResponse} object.
   *
   * @example
   * ```ts
   * const refreshed = await client.refreshToken();
   * ```
   */
  public refreshToken(): Promise<TokenResponse> {
    return this._exchange({
      refresh_token: this.auth.refresh_token!,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret!,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "refresh_token",
    });
  }

  /**
   * Import authentication tokens and optionally trigger a refresh if expired.
   * @param token The {@link Auth} object to import.
   * @returns The updated {@link Auth} object (possibly refreshed).
   *
   * @example
   * ```ts
   * await client.importToken({ access_token: "...", refresh_token: "...", expires: Date.now() + 86400_000 });
   * ```
   */
  public importToken(token: Auth): Promise<Auth> {
    this.auth.access_token = token.access_token;
    this.auth.expires = token.expires;
    this.auth.refresh_token = token.refresh_token;

    return new Promise((resolve, reject) => {
      if (token.expires && token.expires < Date.now()) {
        this.refreshToken()
          .then(() => resolve(this.exportToken()))
          .catch(reject);
      } else {
        resolve(this.exportToken());
      }
    });
  }

  /**
   * Export the current authentication token info.
   * @returns The current {@link Auth} object.
   *
   * @example
   * ```ts
   * const session = client.exportToken();
   * ```
   */
  public exportToken(): Auth {
    return {
      access_token: this.auth.access_token,
      expires: this.auth.expires,
      refresh_token: this.auth.refresh_token,
    };
  }

  /**
   * Revokes the current access token and clears authentication state.
   * @returns A promise that resolves when tokens are revoked.
   *
   * @example
   * ```ts
   * await client.revokeToken();
   * ```
   */
  public async revokeToken(): Promise<void> {
    if (this.auth.access_token) {
      await this._revoke();
      this.auth = {};
    }
  }

  private _call<T = unknown>(
    method: "get" | "post" | "put" | "delete",
    path: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "trakt-api-version": "2",
      "trakt-api-key": this.settings.client_id,
      "User-Agent": this.settings.user_agent!,
    };

    if (this.auth.access_token) {
      headers["Authorization"] = `Bearer ${this.auth.access_token}`;
    }

    const options: Options = {
      method,
      headers,
      searchParams: method === "get"
        ? (params as Record<string, string | number | boolean>)
        : undefined,
      json: method !== "get" ? params : undefined,
    };

    return ky(`${this.settings.api_url}${path}`, options).json<T>();
  }

  private async _exchange(
    params: Record<string, unknown>,
  ): Promise<TokenResponse> {
    const response = await ky
      .post(`${this.settings.api_url}/oauth/token`, {
        headers: {
          "User-Agent": this.settings.user_agent!,
          "Content-Type": "application/json",
        },
        json: params,
      })
      .json<TokenResponse>();
    this.auth.refresh_token = response.refresh_token;
    this.auth.access_token = response.access_token;
    this.auth.expires = (response.created_at + response.expires_in) * 1000;
    return response;
  }

  private _deviceCode(
    params: Record<string, unknown>,
    type: "code" | "token",
  ): Promise<DeviceCodeResponse | TokenResponse> {
    return ky
      .post(`${this.settings.api_url}/oauth/device/${type}`, {
        headers: {
          "User-Agent": this.settings.user_agent!,
          "Content-Type": "application/json",
        },
        json: params,
      })
      .json<DeviceCodeResponse | TokenResponse>();
  }

  private async _revoke(): Promise<void> {
    await ky
      .post(`${this.settings.api_url}/oauth/revoke`, {
        headers: {
          "User-Agent": this.settings.user_agent!,
          "Content-Type": "application/json",
        },
        json: {
          token: this.auth.access_token,
          client_id: this.settings.client_id,
          client_secret: this.settings.client_secret,
        },
      })
      .json();
  }
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
