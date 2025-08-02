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

import type {
  Auth,
  DeviceCodeResponse,
  TokenResponse,
  TraktOptions,
} from "./types/index.ts";
import { CheckCodeFailure } from "./types/shared.ts";

// Module imports
import { CalendarsModule } from "./modules/calendars.ts";
import { CertificationsModule } from "./modules/certifications.ts";
import { CommentsModule } from "./modules/comments.ts";
import { CountriesModule } from "./modules/countries.ts";
import { GenresModule } from "./modules/genres.ts";
import { LanguagesModule } from "./modules/languages.ts";
import { ListsModule } from "./modules/lists.ts";
import { MoviesModule } from "./modules/movies.ts";
import { NetworksModule } from "./modules/networks.ts";
import { RecommendationsModule } from "./modules/recommendations.ts";
import { SearchModule } from "./modules/search.ts";
import { ShowsModule } from "./modules/shows.ts";
import { SyncModule } from "./modules/sync.ts";
import { UsersModule } from "./modules/users.ts";

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
  private settings: TraktOptions;
  private auth: Auth;

  // Module instances
  public movies: MoviesModule;
  public shows: ShowsModule;
  public users: UsersModule;
  public search: SearchModule;
  public calendars: CalendarsModule;
  public sync: SyncModule;
  public lists: ListsModule;
  public comments: CommentsModule;
  public recommendations: RecommendationsModule;

  // Backward compatible API properties
  public genres: {
    movies: () => Promise<import("./types/index.ts").Genre[]>;
    shows: () => Promise<import("./types/index.ts").Genre[]>;
  };
  public certifications: {
    movies: () => Promise<import("./types/index.ts").Certification[]>;
    shows: () => Promise<import("./types/index.ts").Certification[]>;
  };
  public countries: {
    movies: () => Promise<import("./types/index.ts").Country[]>;
    shows: () => Promise<import("./types/index.ts").Country[]>;
  };
  public languages: {
    movies: () => Promise<import("./types/index.ts").Language[]>;
    shows: () => Promise<import("./types/index.ts").Language[]>;
  };
  public networks: () => Promise<import("./types/index.ts").Network[]>;

  constructor(settings: TraktOptions, auth: Auth = {}) {
    this.settings = settings;
    this.auth = auth;

    // Initialize all modules with the _call method
    this.movies = new MoviesModule(this._call.bind(this));
    this.shows = new ShowsModule(this._call.bind(this));
    this.users = new UsersModule(this._call.bind(this));
    this.search = new SearchModule(this._call.bind(this));
    this.calendars = new CalendarsModule(this._call.bind(this));
    this.sync = new SyncModule(this._call.bind(this));
    this.lists = new ListsModule(this._call.bind(this));
    this.comments = new CommentsModule(this._call.bind(this));
    this.recommendations = new RecommendationsModule(this._call.bind(this));

    // Initialize module instances for internal use
    const genresModule = new GenresModule(this._call.bind(this));
    const certificationsModule = new CertificationsModule(
      this._call.bind(this),
    );
    const countriesModule = new CountriesModule(this._call.bind(this));
    const languagesModule = new LanguagesModule(this._call.bind(this));
    const networksModule = new NetworksModule(this._call.bind(this));

    // Create backward compatible API
    this.genres = {
      movies: () => genresModule.movies(),
      shows: () => genresModule.shows(),
    };
    this.certifications = {
      movies: () => certificationsModule.movies(),
      shows: () => certificationsModule.shows(),
    };
    this.countries = {
      movies: () => countriesModule.movies(),
      shows: () => countriesModule.shows(),
    };
    this.languages = {
      movies: () => languagesModule.movies(),
      shows: () => languagesModule.shows(),
    };
    this.networks = () => networksModule.get();
  }

  /**
   * Get the OAuth2 authorization URL.
   * @returns The authorization URL for OAuth2 flow
   */
  public getUrl(): string {
    const state = crypto.randomBytes(16).toString("hex");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.settings.client_id,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      state,
    });

    return `https://trakt.tv/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token.
   * @param code Authorization code from OAuth2 callback
   * @param state Optional state parameter for validation
   * @returns Promise resolving to token response
   */
  public async exchangeCode(
    code: string,
    state?: string,
  ): Promise<TokenResponse> {
    return this._exchange({
      code,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "authorization_code",
    });
  }

  /**
   * Refresh access token using refresh token.
   * @param refreshToken The refresh token
   * @returns Promise resolving to new token response
   */
  public async refreshToken(refreshToken: string): Promise<TokenResponse> {
    return this._exchange({
      refresh_token: refreshToken,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "refresh_token",
    });
  }

  /**
   * Get device code for device authentication flow.
   * @returns Promise resolving to device code response
   */
  public async getDeviceCode(): Promise<DeviceCodeResponse> {
    return this._call("post", "/oauth/device/code", {
      client_id: this.settings.client_id,
    });
  }

  /**
   * Check device code status and exchange for tokens.
   * @param deviceCode The device code from getDeviceCode()
   * @returns Promise resolving to token response or check failure
   */
  public async checkDeviceCode(
    deviceCode: string,
  ): Promise<TokenResponse | CheckCodeFailure> {
    try {
      return await this._exchange({
        code: deviceCode,
        client_id: this.settings.client_id,
        client_secret: this.settings.client_secret,
        grant_type: "device_code",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          status: 400,
          message: error.message,
        } as CheckCodeFailure;
      }
      return {
        status: 400,
        message: "Unknown error occurred",
      } as CheckCodeFailure;
    }
  }

  /**
   * Revoke access token.
   * @param token The access token to revoke (optional, uses current token if not provided)
   * @returns Promise resolving when token is revoked
   */
  public async revokeToken(token?: string): Promise<void> {
    const tokenToRevoke = token || this.auth.access_token;
    if (!tokenToRevoke) {
      throw new Error("No token available to revoke");
    }

    await this._call("post", "/oauth/revoke", {
      token: tokenToRevoke,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
    });

    // Clear the auth if we revoked the current token
    if (!token || token === this.auth.access_token) {
      this.auth = {};
    }
  }

  /**
   * Get device codes for device authentication flow.
   * @deprecated Use getDeviceCode() instead
   * @returns Promise resolving to device code response
   */
  public async getCodes(): Promise<DeviceCodeResponse> {
    return this.getDeviceCode();
  }

  /**
   * Import authentication tokens.
   * @param tokens The tokens to import
   * @returns The imported tokens
   */
  public async importToken(tokens: Partial<Auth>): Promise<Auth> {
    this.auth = { ...this.auth, ...tokens };
    return this.auth;
  }

  /**
   * Export current authentication tokens.
   * @returns Current authentication tokens
   */
  public exportToken(): Auth {
    return { ...this.auth };
  }

  /**
   * Private method to make HTTP requests to the Trakt API.
   * @param method HTTP method
   * @param path API endpoint path
   * @param params Request parameters
   * @returns Promise resolving to API response
   */
  private async _call<T = unknown>(
    method: "get" | "post" | "put" | "delete",
    path: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const url = `https://api.trakt.tv${path}`;
    const options: Options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": this.settings.client_id,
      },
    };

    if (this.auth.access_token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${this.auth.access_token}`,
      };
    }

    if (method === "get" && params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      options.searchParams = searchParams;
    } else if (params) {
      options.json = params;
    }

    const response = await ky(url, options);
    return response.json<T>();
  }

  /**
   * Private method to handle OAuth2 token exchange.
   * @param params Token exchange parameters
   * @returns Promise resolving to token response
   */
  private async _exchange(
    params: Record<string, string>,
  ): Promise<TokenResponse> {
    const response = await ky.post("https://api.trakt.tv/oauth/token", {
      json: params,
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": this.settings.client_id,
      },
    });

    const tokenResponse = await response.json<TokenResponse>();
    this.auth = { ...this.auth, ...tokenResponse };
    return tokenResponse;
  }
}

/**
 * Helper function to format date as YYYY-MM-DD
 * @param date Date object to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
