/**
 * @fileoverview Users module for Trakt.tv API
 * Handles all user-related API endpoints including profiles, collections, watchlists, ratings, and social features.
 * Provides comprehensive access to user data, follow relationships, and personal content management.
 */

import type {
  CollectionItem,
  CommentType,
  HistoryItem,
  List,
  MediaType,
  RatedItem,
  Stats,
  User,
  WatchedItem,
  WatchlistItem,
} from "../types/index.ts";
import type { Movie } from "../types/movies.ts";
import type { Show } from "../types/shows.ts";
import type {
  FollowRequest,
  HiddenItem,
  Like,
  UserCollection,
  UserComment,
  UserProfile,
  UserSettings,
} from "../types/users.ts";
import type { CallMethod } from "./base.ts";

/**
 * Users module class providing access to all user-related Trakt.tv API endpoints.
 *
 * This module handles user profiles, collections, watchlists, ratings, social features,
 * and personal content management for the Trakt.tv API.
 */
export class UsersModule {
  /**
   * Get current user's personalized recommendations.
   * OAuth Required
   */
  myRecommendations = {
    /**
     * Get movie recommendations for the current user.
     *
     * @param params - Optional parameters for filtering and pagination
     * @returns Promise resolving to array of recommended movies
     * @example
     * ```ts
     * const movieRecs = await client.users.myRecommendations.movies();
     * const filteredRecs = await client.users.myRecommendations.movies({
     *   ignore_collected: true,
     *   ignore_watchlisted: true,
     *   limit: 20
     * });
     * ```
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

      return this._call(
        "get",
        "/users/me/recommendations/movies",
        searchParams,
      );
    },

    /**
     * Get show recommendations for the current user.
     *
     * @param params - Optional parameters for filtering and pagination
     * @returns Promise resolving to array of recommended shows
     * @example
     * ```ts
     * const showRecs = await client.users.myRecommendations.shows();
     * const filteredRecs = await client.users.myRecommendations.shows({
     *   ignore_collected: true,
     *   limit: 10
     * });
     * ```
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

      return this._call(
        "get",
        "/users/me/recommendations/shows",
        searchParams,
      );
    },
  };

  constructor(private readonly _call: CallMethod) {}

  /**
   * Get user profile information.
   *
   * @param id - User ID or username
   * @returns Promise resolving to user profile data
   * @example
   * ```ts
   * const user = await client.users.get("sean");
   * console.log(user.username); // "sean"
   * ```
   */
  get(id: string): Promise<User> {
    return this._call("get", `/users/${id}`);
  }

  /**
   * Get user's collection for movies or shows.
   *
   * @param params - Parameters including user ID and media type
   * @returns Promise resolving to array of collection items
   * @example
   * ```ts
   * const movieCollection = await client.users.collection({
   *   id: "sean",
   *   type: "movies"
   * });
   * ```
   */
  collection(params: {
    id: string;
    type: "movies" | "shows";
  }): Promise<UserCollection[]> {
    return this._call("get", `/users/${params.id}/collection/${params.type}`);
  }

  /**
   * Get user's comments.
   *
   * @param params - Parameters including user ID, media type, and comment type
   * @returns Promise resolving to user comments
   * @example
   * ```ts
   * const comments = await client.users.comments({
   *   id: "sean",
   *   type: "movies",
   *   comment_type: "reviews"
   * });
   * ```
   */
  comments(params: {
    id: string;
    type: "all" | MediaType;
    comment_type: CommentType;
  }): Promise<UserComment> {
    return this._call(
      "get",
      `/users/${params.id}/comments/${params.type}/${params.comment_type}`,
    );
  }

  /**
   * Get user's lists.
   *
   * @param params - Parameters including user ID
   * @returns Promise resolving to array of user lists
   * @example
   * ```ts
   * const lists = await client.users.lists({ id: "sean" });
   * ```
   */
  lists(params: { id: string }): Promise<List[]> {
    return this._call("get", `/users/${params.id}/lists`);
  }

  /**
   * Get user's followers.
   *
   * @param params - Parameters including user ID
   * @returns Promise resolving to array of follower users
   * @example
   * ```ts
   * const followers = await client.users.followers({ id: "sean" });
   * ```
   */
  followers(params: { id: string }): Promise<User[]> {
    return this._call("get", `/users/${params.id}/followers`);
  }

  /**
   * Get users that a user is following.
   *
   * @param params - Parameters including user ID
   * @returns Promise resolving to array of followed users
   * @example
   * ```ts
   * const following = await client.users.following({ id: "sean" });
   * ```
   */
  following(params: { id: string }): Promise<User[]> {
    return this._call("get", `/users/${params.id}/following`);
  }

  /**
   * Get user's friends.
   *
   * @param params - Parameters including user ID
   * @returns Promise resolving to array of friend users
   * @example
   * ```ts
   * const friends = await client.users.friends({ id: "sean" });
   * ```
   */
  friends(params: { id: string }): Promise<User[]> {
    return this._call("get", `/users/${params.id}/friends`);
  }

  /**
   * Get user's watch history.
   *
   * @param params - Parameters including user ID, media type, and optional filters
   * @returns Promise resolving to array of history items
   * @example
   * ```ts
   * const history = await client.users.history({
   *   id: "sean",
   *   type: "movies",
   *   start_at: "2023-01-01T00:00:00.000Z",
   *   end_at: "2023-12-31T23:59:59.999Z"
   * });
   * ```
   */
  history(params: {
    id: string;
    type: MediaType;
    item_id?: string;
    start_at?: string;
    end_at?: string;
  }): Promise<HistoryItem[]> {
    return this._call(
      "get",
      `/users/${params.id}/history${params.type ? `/${params.type}` : ""}${
        params.item_id ? `/${params.item_id}` : ""
      }?start_at=${params.start_at}&end_at=${params.end_at}`,
    );
  }

  /**
   * Get user's ratings.
   *
   * @param params - Parameters including user ID, media type, and optional rating filter
   * @returns Promise resolving to array of rated items
   * @example
   * ```ts
   * const ratings = await client.users.ratings({
   *   id: "sean",
   *   type: "movies"
   * });
   * const highRatings = await client.users.ratings({
   *   id: "sean",
   *   type: "movies",
   *   rating: 10
   * });
   * ```
   */
  ratings(params: {
    id: string;
    type: MediaType;
    rating?: number;
  }): Promise<RatedItem[]> {
    return this._call(
      "get",
      `/users/${params.id}/ratings/${params.type}${
        params.rating ? `/${params.rating}` : ""
      }`,
    );
  }

  /**
   * Get user's watchlist.
   *
   * @param params - Parameters including user ID and media type
   * @returns Promise resolving to array of watchlist items
   * @example
   * ```ts
   * const watchlist = await client.users.watchlist({
   *   id: "sean",
   *   type: "movies"
   * });
   * ```
   */
  watchlist(params: {
    id: string;
    type: MediaType;
  }): Promise<WatchlistItem[]> {
    return this._call("get", `/users/${params.id}/watchlist/${params.type}`);
  }

  /**
   * Get user's statistics.
   *
   * @param params - Parameters including user ID
   * @returns Promise resolving to user statistics
   * @example
   * ```ts
   * const stats = await client.users.stats({ id: "sean" });
   * console.log(`Movies watched: ${stats.movies.watched}`);
   * console.log(`Shows watched: ${stats.shows.watched}`);
   * ```
   */
  stats(params: { id: string }): Promise<Stats> {
    return this._call("get", `/users/${params.id}/stats`);
  }

  /**
   * Follow a user.
   * OAuth Required
   *
   * @param params - Parameters including user ID to follow
   * @returns Promise resolving when follow request is sent
   * @example
   * ```ts
   * await client.users.follow({ id: "sean" });
   * ```
   */
  follow(params: { id: string }): Promise<void> {
    return this._call("post", `/users/${params.id}/follow`);
  }

  /**
   * Unfollow a user.
   * OAuth Required
   *
   * @param params - Parameters including user ID to unfollow
   * @returns Promise resolving when user is unfollowed
   * @example
   * ```ts
   * await client.users.unfollow({ id: "sean" });
   * ```
   */
  unfollow(params: { id: string }): Promise<void> {
    return this._call("delete", `/users/${params.id}/follow`);
  }

  /**
   * Approve a follow request.
   * OAuth Required
   *
   * @param params - Parameters including request ID to approve
   * @returns Promise resolving when request is approved
   * @example
   * ```ts
   * await client.users.approve({ id: "123" });
   * ```
   */
  approve(params: { id: string }): Promise<void> {
    return this._call("post", `/users/requests/${params.id}`);
  }

  /**
   * Deny a follow request.
   * OAuth Required
   *
   * @param params - Parameters including request ID to deny
   * @returns Promise resolving when request is denied
   * @example
   * ```ts
   * await client.users.deny({ id: "123" });
   * ```
   */
  deny(params: { id: string }): Promise<void> {
    return this._call("delete", `/users/requests/${params.id}`);
  }

  /**
   * Get current user's settings.
   * OAuth Required
   *
   * @returns Promise resolving to user settings
   * @example
   * ```ts
   * const settings = await client.users.settings();
   * console.log(settings.user.username);
   * console.log(settings.account.timezone);
   * ```
   */
  settings(): Promise<UserSettings> {
    return this._call("get", "/users/settings");
  }

  /**
   * Update current user's settings.
   * OAuth Required
   *
   * @param params - Partial user settings to update
   * @returns Promise resolving to updated user settings
   * @example
   * ```ts
   * const updatedSettings = await client.users.updateSettings({
   *   account: { timezone: "America/New_York" }
   * });
   * ```
   */
  updateSettings(params: Partial<UserSettings>): Promise<UserSettings> {
    return this._call("post", "/users/settings", params);
  }

  /**
   * Get current user's profile.
   * OAuth Required
   *
   * @returns Promise resolving to user profile
   * @example
   * ```ts
   * const profile = await client.users.profile();
   * console.log(profile.username);
   * ```
   */
  profile(): Promise<UserProfile> {
    return this._call("get", "/users/me");
  }

  /**
   * Update current user's profile.
   * OAuth Required
   *
   * @param params - Partial user profile data to update
   * @returns Promise resolving to updated user profile
   * @example
   * ```ts
   * const updatedProfile = await client.users.updateProfile({
   *   name: "New Display Name",
   *   location: "New York, NY"
   * });
   * ```
   */
  updateProfile(params: Partial<UserProfile>): Promise<UserProfile> {
    return this._call("post", "/users/me", params);
  }

  /**
   * Get pending follow requests.
   * OAuth Required
   *
   * @returns Promise resolving to array of follow requests
   * @example
   * ```ts
   * const requests = await client.users.requests();
   * requests.forEach(request => {
   *   console.log(`${request.user.username} wants to follow you`);
   * });
   * ```
   */
  requests(): Promise<FollowRequest[]> {
    return this._call("get", "/users/requests");
  }

  /**
   * Get hidden items for a specific section.
   * OAuth Required
   *
   * @param section - The section to get hidden items for
   * @returns Promise resolving to array of hidden items
   * @example
   * ```ts
   * const hiddenCalendar = await client.users.hidden("calendar");
   * const hiddenRecommendations = await client.users.hidden("recommendations");
   * ```
   */
  hidden(
    section:
      | "calendar"
      | "progress_watched"
      | "progress_collected"
      | "recommendations",
  ): Promise<HiddenItem[]> {
    return this._call("get", `/users/hidden/${section}`);
  }

  /**
   * Get user's likes (comments and lists they've liked).
   * OAuth Required
   *
   * @param params - Optional parameters for filtering and pagination
   * @returns Promise resolving to array of liked items
   * @example
   * ```ts
   * const allLikes = await client.users.likes();
   * const commentLikes = await client.users.likes({ type: "comments" });
   * const listLikes = await client.users.likes({ type: "lists", limit: 50 });
   * ```
   */
  likes(params?: {
    type?: "comments" | "lists";
    page?: number;
    limit?: number;
  }): Promise<Like[]> {
    const searchParams: Record<string, unknown> = {};
    if (params?.type) searchParams.type = params.type;
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/users/likes", searchParams);
  }

  /**
   * Get current user's watched items.
   * OAuth Required
   *
   * @param type - Media type to retrieve (movies or shows)
   * @returns Promise resolving to array of watched items
   * @example
   * ```ts
   * const watchedMovies = await client.users.watched("movies");
   * const watchedShows = await client.users.watched("shows");
   * ```
   */
  watched(type: "movies" | "shows"): Promise<WatchedItem[]> {
    return this._call("get", `/users/me/watched/${type}`);
  }

  /**
   * Get current user's collection.
   * OAuth Required
   *
   * @param type - Media type to retrieve (movies or shows)
   * @returns Promise resolving to array of collection items
   * @example
   * ```ts
   * const movieCollection = await client.users.myCollection("movies");
   * const showCollection = await client.users.myCollection("shows");
   * ```
   */
  myCollection(
    type: "movies" | "shows",
  ): Promise<CollectionItem<"movies" | "shows">[]> {
    return this._call("get", `/users/me/collection/${type}`);
  }

  /**
   * Get current user's ratings.
   * OAuth Required
   *
   * @param type - Media type to retrieve ratings for
   * @param rating - Optional specific rating to filter by (1-10)
   * @returns Promise resolving to array of rated items
   * @example
   * ```ts
   * const movieRatings = await client.users.myRatings("movies");
   * const highRatedMovies = await client.users.myRatings("movies", 10);
   * const showRatings = await client.users.myRatings("shows");
   * ```
   */
  myRatings(
    type: "movies" | "shows" | "seasons" | "episodes",
    rating?: number,
  ): Promise<RatedItem[]> {
    const path = rating
      ? `/users/me/ratings/${type}/${rating}`
      : `/users/me/ratings/${type}`;
    return this._call("get", path);
  }

  /**
   * Get current user's watchlist.
   * OAuth Required
   *
   * @param type - Media type to retrieve from watchlist
   * @returns Promise resolving to array of watchlist items
   * @example
   * ```ts
   * const movieWatchlist = await client.users.myWatchlist("movies");
   * const showWatchlist = await client.users.myWatchlist("shows");
   * const episodeWatchlist = await client.users.myWatchlist("episodes");
   * ```
   */
  myWatchlist(
    type: "movies" | "shows" | "seasons" | "episodes",
  ): Promise<WatchlistItem[]> {
    return this._call("get", `/users/me/watchlist/${type}`);
  }

  /**
   * Get current user's watch history.
   * OAuth Required
   *
   * @param params - Optional parameters for filtering and pagination
   * @returns Promise resolving to array of history items
   * @example
   * ```ts
   * const allHistory = await client.users.myHistory();
   * const movieHistory = await client.users.myHistory({ type: "movies" });
   * const recentHistory = await client.users.myHistory({
   *   start_at: "2023-01-01T00:00:00.000Z",
   *   limit: 100
   * });
   * ```
   */
  myHistory(params?: {
    type?: "movies" | "shows" | "seasons" | "episodes";
    id?: number;
    start_at?: string;
    end_at?: string;
    page?: number;
    limit?: number;
  }): Promise<HistoryItem[]> {
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
  }
}
