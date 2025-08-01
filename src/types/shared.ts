/**
 * Shared types used across multiple Trakt.tv API endpoints.
 *
 * This module contains common types, interfaces, and enums that are reused
 * throughout the API client to maintain consistency and reduce duplication.
 *
 * @example
 * ```ts
 * import type { IDs, MediaType, PaginationParams } from "@hitarashi/trakt/types/shared";
 * ```
 *
 * @module
 */

/**
 * Common ID structure used across all Trakt.tv entities.
 * Different entities may have different combinations of these IDs available.
 */
export type IDs = {
  /** Trakt.tv internal ID */
  trakt: number;
  /** URL-friendly slug identifier */
  slug: string;
  /** IMDb ID (when available) */
  imdb?: string;
  /** The Movie Database (TMDb) ID (when available) */
  tmdb?: number;
  /** TheTVDB ID (when available, primarily for shows/episodes) */
  tvdb?: number;
};

/**
 * Media types supported by the Trakt.tv API.
 */
export type MediaType = "movies" | "shows" | "seasons" | "episodes";

/**
 * Comment types for filtering comment-related endpoints.
 */
export type CommentType = "all" | "reviews" | "shouts";

/**
 * Privacy levels for user-generated content like lists.
 */
export type PrivacyLevel = "private" | "friends" | "public";

/**
 * Sort directions for ordered results.
 */
export type SortDirection = "asc" | "desc";

/**
 * Common pagination parameters used across multiple endpoints.
 */
export type PaginationParams = {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page (max varies by endpoint) */
  limit?: number;
};

/**
 * Extended information levels for API responses.
 */
export type ExtendedInfo = "min" | "full";

/**
 * Common parameters for endpoints that support extended information.
 */
export type ExtendedParams = {
  /** Level of detail to include in the response */
  extended?: ExtendedInfo;
};

/**
 * Base parameters combining pagination and extended info.
 */
export type BaseParams = PaginationParams & ExtendedParams;

/**
 * Date range parameters for calendar and time-based endpoints.
 */
export type DateRangeParams = {
  /** Start date in YYYY-MM-DD format */
  start_date?: string;
  /** Number of days to include */
  days?: number;
};

/**
 * Common rating scale used throughout Trakt.tv (1-10).
 */
export type Rating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type RatingDistribution = {
  rating: number;
  votes: number;
  distribution: Record<Rating, number>;
};

/**
 * Timestamp string in ISO 8601 format.
 */
export type Timestamp = string;

/**
 * Common statistics structure for content.
 */
export type Stats = {
  /** Number of watchers */
  watchers?: number;
  /** Number of plays */
  plays?: number;
  /** Number of collectors */
  collectors?: number;
  /** Number of comments */
  comments?: number;
  /** Number of lists containing this item */
  lists?: number;
  /** Number of votes */
  votes?: number;
  /** Number of pavorited by users */
  favorited?: number;
  /** Number of User recommend */
  recommended?: number;
};

/**
 * Common error response structure from the Trakt.tv API.
 */
export type TraktError = {
  /** Error message */
  error: string;
  /** Detailed error description */
  error_description?: string;
};

/**
 * Generic response wrapper for paginated results.
 */
export type PaginatedResponse<T> = {
  /** Array of results */
  data: T[];
  /** Pagination metadata */
  pagination?: {
    /** Current page number */
    page: number;
    /** Items per page */
    limit: number;
    /** Total number of pages */
    page_count: number;
    /** Total number of items */
    item_count: number;
  };
};
