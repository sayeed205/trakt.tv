export type TraktOptions = {
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
  api_url?: string;
  user_agent?: string;
  pagination?: boolean;
};

export type Auth = {
  access_token?: string;
  refresh_token?: string;
  expires?: number;
  state?: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  created_at: number;
  expires_in: number;
};

export type DeviceCodeResponse = {
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
};
