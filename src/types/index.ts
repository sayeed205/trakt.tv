/**
 * Types for configuration, authentication, and API responses in the Trakt.tv SDK.
 *
 * @example
 * ```ts
 * import type { TraktOptions, Auth, TokenResponse, DeviceCodeResponse } from "@hitarashi/trakt/types";
 *
 * const options: TraktOptions = {
 *   client_id: "CLIENT_ID",
 *   client_secret: "SECRET",
 * };
 * ```
 *
 * @module
 */

/**
 * Options to configure the Trakt.tv API client.
 * @property client_id Your application's Trakt.tv client ID.
 * @property client_secret Your application's Trakt.tv client secret.
 * @property redirect_uri (Optional) The OAuth2 redirect URI. Defaults to Trakt's device flow built-in URI.
 * @property api_url (Optional) Override the Trakt.tv API base URL.
 * @property user_agent (Optional) Custom User-Agent to send with requests.
 * @property pagination (Optional) Whether to enable pagination of requests.
 */
export type TraktOptions = {
  /** Your application's Trakt.tv client ID. */
  client_id: string;
  /** Your application's Trakt.tv client secret. */
  client_secret: string;
  /** Optional OAuth2 redirect URI. */
  redirect_uri?: string;
  /** Optional override for the Trakt.tv API base URL. */
  api_url?: string;
  /** Optional custom User-Agent. */
  user_agent?: string;
  /** Enable pagination for API requests. */
  pagination?: boolean;
};

/**
 * The authentication state object.
 *
 * Used with {@link Trakt.importToken}, {@link Trakt.exportToken}, and internal token management.
 * @property access_token The OAuth2 access token for API authentication.
 * @property refresh_token Trakt.tv's long-lived refresh token for renewing access.
 * @property expires The UNIX timestamp (ms) when the access token expires.
 * @property state Optional CSRF protection token for the OAuth2 flow.
 */
export type Auth = {
  /** OAuth2 access token for API authentication. */
  access_token?: string;
  /** OAuth2 refresh token for obtaining new access tokens. */
  refresh_token?: string;
  /** UNIX timestamp (ms) when access_token expires. */
  expires?: number;
  /** OAuth2 state for CSRF protection. */
  state?: string;
};

/**
 * OAuth2 token response from the Trakt.tv API.
 * Used by {@link Trakt.exchangeCode}, {@link Trakt.refreshToken}.
 * @property access_token The returned access token.
 * @property refresh_token The refresh token to renew access.
 * @property created_at The UNIX timestamp (seconds) when the token was issued.
 * @property expires_in Seconds until the access token expires.
 */
export type TokenResponse = {
  /** The returned access token. */
  access_token: string;
  /** The refresh token to renew access. */
  refresh_token: string;
  /** UNIX timestamp (seconds) the token was issued. */
  created_at: number;
  /** Seconds until the access token expires. */
  expires_in: number;
  token_type: string;
  scope: string;
};

/**
 * Response from the device code flow.
 * Used by {@link Trakt.getCodes}.
 * @property device_code The code for client polling.
 * @property user_code The code the user must enter in browser.
 * @property verification_url The URL where the user enters the code.
 * @property expires_in Number of seconds until this code expires.
 * @property interval Recommended polling interval (seconds).
 */
export type DeviceCodeResponse = {
  /** The code for client polling. */
  device_code: string;
  /** The code to show the user. */
  user_code: string;
  /** The URL for user approval. */
  verification_url: string;
  /** Seconds until this code expires. */
  expires_in: number;
  /** Recommended polling interval (seconds). */
  interval: number;
};

// Re-export shared types
export type {
  BaseParams,
  CommentType,
  DateRangeParams,
  ExtendedInfo,
  ExtendedParams,
  IDs,
  MediaType,
  PaginatedResponse,
  PaginationParams,
  PrivacyLevel,
  Rating,
  SortDirection,
  Stats,
  Timestamp,
  TraktError,
} from "./shared.ts";
// ============================================================================
// MOVIES API SECTION
// ============================================================================
export type {
  AnticipatedMovie,
  BoxOfficeMovie,
  Movie,
  MovieAlias,
  MovieExtended,
  MovieRelease,
  MovieTranslation,
  MovieUpdates,
  PlayedMovie,
  TrendingMovies,
  WatchedMovie,
} from "./movies.ts";

// ============================================================================
// SHOWS API SECTION
// ============================================================================
export type {
  AnticipatedShow,
  Episode,
  PlayedShow,
  Season,
  Show,
  ShowAlias,
  ShowExtended,
  ShowTranslation,
  ShowUpdates,
  TrendingShow,
  WatchedShow,
} from "./shows.ts";

// ============================================================================
// SEARCH API SECTION
// ============================================================================
export type {
  List,
  Person,
  SearchIdParams,
  SearchResult,
  SearchTextParams,
} from "./search.ts";

// ============================================================================
// CALENDAR API SECTION
// ============================================================================
export type {
  CalendarMovie,
  CalendarParams,
  CalendarShow,
} from "./calendar.ts";

// ============================================================================
// SYNC API SECTION
// ============================================================================
export type {
  CollectionItem,
  CollectionType,
  HistoryItem,
  PlaybackParams,
  PlaybackProgress,
  RatedItem,
  SyncEpisode,
  SyncItem,
  SyncParams,
  SyncResponse,
  SyncSeason,
  WatchedEpisode,
  WatchedItem,
  WatchedSeason,
  WatchlistItem,
} from "./sync.ts";

// ============================================================================
// LISTS API SECTION
// ============================================================================
export type {
  AddListItemsParams,
  CreateListParams,
  GetListItemsParams,
  GetListsParams,
  ListItem,
  ListItemResponse,
  RemoveListItemsParams,
  ReorderListItemsParams,
  UpdateListParams,
} from "./lists.ts";

// ============================================================================
// COMMENTS API SECTION
// ============================================================================
export type {
  Comment,
  CommentPostParams,
  CommentReplyParams,
  CommentUpdateParams,
  CommentUpdatesParams,
  GetCommentsParams,
  RecentCommentsParams,
  TrendingCommentsParams,
} from "./comments.ts";

// ============================================================================
// USERS API SECTION
// ============================================================================
export type {
  CommentUser,
  FollowRequest,
  HiddenItem,
  Like,
  User,
  UserCollection,
  UserComment,
  UserIDs,
  UserLists,
  UserProfile,
  UserSettings,
} from "./users.ts";

// ============================================================================
// METADATA API SECTION
// ============================================================================
export type {
  Certification,
  Country,
  Genre,
  Language,
  Network,
} from "./metadata.ts";
