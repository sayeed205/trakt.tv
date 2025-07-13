# Trakt.tv TypeScript SDK

A simple, promise-based TypeScript/JavaScript client for accessing the [Trakt.tv API](https://trakt.docs.apiary.io/).
This SDK enables Node.js and Deno applications to authenticate and interact with Trakt.tv using OAuth2 flows and fetch
various resources from the Trakt.tv API.

## Features

- OAuth2 authentication (Authorization Code & Device Code)
- Token import, export, refresh, and revocation
- Typed interfaces for responses and configuration
- Concise wrapper around `ky` HTTP client
- Works with TypeScript and modern JavaScript

---

## Installation

For installation and import, check out [https://jsr.io/@hitarashi/trakt](https://jsr.io/@hitarashi/trakt).

You can use your favorite package manager or import directly via JSR:

---

## Quick Start

### Constructing a Client

```typescript
import Trakt from "@hitarashi/trakt";

const client = new Trakt({
    client_id: "YOUR_TRAKT_CLIENT_ID",
    client_secret: "YOUR_TRAKT_CLIENT_SECRET",
    // Optional: redirect_uri, user_agent, api_url, pagination
});
```

### Beginning OAuth Flow

#### Authorization Code Flow

```typescript
// 1. Redirect user to this URL
const url = client.getUrl();
console.log("Go to:", url);

// 2. Once redirected, exchange the code for tokens
const tokens = await client.exchangeCode("CODE_FROM_REDIRECT");
```

#### Device Code Flow

```typescript
const codes = await client.getCodes();
console.log(`Go to ${codes.verification_url} and enter code: ${codes.user_code}`);
// Poll for access tokens with client._deviceCode(..., 'token'), or expand as needed
```

### Refreshing Token

```typescript
const refreshed = await client.refreshToken();
```

### Import/Export Tokens

```typescript
+await client.importToken({
    access_token: "...",
    refresh_token: "...",
    expires: 1712345678901,
});
const exported = client.exportToken();
```

### Revoking Token

```typescript
+await client.revokeToken();
```

---

## API Documentation

### Constructor

```typescript
new Trakt(settings, auth)
```

- `settings`: Your Trakt.tv app credentials and client options.
- `auth`: Previously obtained tokens (optional for session restoration).

---

## Contributing

Contributions are welcome! Open an issue or pull request.

---

## License

MIT License.