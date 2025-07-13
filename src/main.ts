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
import crypto from "node:crypto";
import ky from "ky";

import type {
  Auth,
  DeviceCodeResponse,
  TokenResponse,
  TraktOptions,
} from "./types.ts";

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

  /**
   * Constructs a new {@link Trakt} client.
   * @param settings Configuration options for Trakt.tv API access.
   * @param auth Initial authentication object to restore session (optional).
   */
  constructor(
    settings: TraktOptions,
    auth: Auth = {},
  ) {
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
   * Starts the OAuth2 Device Code flow.
   * @returns A device code response used to direct the user to verify.
   *
   * @example
   * ```ts
   * const codes = await client.getCodes();
   * console.log(`Go to ${codes.verification_url} and enter code: ${codes.user_code}`);
   * ```
   */
  public getCodes(): Promise<DeviceCodeResponse> {
    return this._deviceCode({
      client_id: this.settings.client_id,
    }, "code") as Promise<DeviceCodeResponse>;
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
        this.refreshToken().then(() => resolve(this.exportToken())).catch(
          reject,
        );
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

  private async _exchange(
    params: Record<string, unknown>,
  ): Promise<TokenResponse> {
    const response = await ky.post(`${this.settings.api_url}/oauth/token`, {
      headers: {
        "User-Agent": this.settings.user_agent!,
        "Content-Type": "application/json",
      },
      json: params,
    }).json<TokenResponse>();
    this.auth.refresh_token = response.refresh_token;
    this.auth.access_token = response.access_token;
    this.auth.expires = (response.created_at + response.expires_in) * 1000;
    return response;
  }

  private _deviceCode(
    params: Record<string, unknown>,
    type: "code" | "token",
  ): Promise<DeviceCodeResponse | TokenResponse> {
    return ky.post(`${this.settings.api_url}/oauth/device/${type}`, {
      headers: {
        "User-Agent": this.settings.user_agent!,
        "Content-Type": "application/json",
      },
      json: params,
    }).json<DeviceCodeResponse | TokenResponse>();
  }

  private async _revoke(): Promise<void> {
    await ky.post(`${this.settings.api_url}/oauth/revoke`, {
      headers: {
        "User-Agent": this.settings.user_agent!,
        "Content-Type": "application/json",
      },
      json: {
        token: this.auth.access_token,
        client_id: this.settings.client_id,
        client_secret: this.settings.client_secret,
      },
    }).json();
  }
}
