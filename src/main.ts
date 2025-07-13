import crypto from "node:crypto";
import ky from "ky";

import type {
  Auth,
  DeviceCodeResponse,
  TokenResponse,
  TraktOptions,
} from "./types.ts";

export default class Trakt {
  private settings: TraktOptions;
  private auth: Auth;
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

  public getUrl(): string {
    this.auth.state = crypto.randomBytes(6).toString("hex");
    const baseUrl = this.settings.api_url!.replace(/api\W/, "");
    return `${baseUrl}/oauth/authorize?response_type=code&client_id=${this.settings.client_id}&redirect_uri=${
      this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob"
    }&state=${this.auth.state}`;
  }

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

  public getCodes(): Promise<DeviceCodeResponse> {
    return this._deviceCode({
      client_id: this.settings.client_id,
    }, "code") as Promise<DeviceCodeResponse>;
  }

  public refreshToken(): Promise<TokenResponse> {
    return this._exchange({
      refresh_token: this.auth.refresh_token!,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret!,
      redirect_uri: this.settings.redirect_uri || "urn:ietf:wg:oauth:2.0:oob",
      grant_type: "refresh_token",
    });
  }

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

  public exportToken(): Auth {
    return {
      access_token: this.auth.access_token,
      expires: this.auth.expires,
      refresh_token: this.auth.refresh_token,
    };
  }

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
