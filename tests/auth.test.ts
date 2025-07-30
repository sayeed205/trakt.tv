import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import process from "node:process";

import Trakt from "../src/main.ts";

const clientId = Deno.env.get("TRAKT_CLIENT_ID");
const clientSecret = Deno.env.get("TRAKT_CLIENT_SECRET");

if (!clientId || !clientSecret) {
  console.error(
    "Error: TRAKT_CLIENT_ID and TRAKT_CLIENT_SECRET must be set in .env file",
  );
  process.exit(1);
}

const trakt = new Trakt({
  client_id: clientId,
  client_secret: clientSecret,
});

describe("Trakt Authentication", () => {
  it("should generate OAuth URL", () => {
    const url = trakt.getUrl();
    expect(url).toBeDefined();
    expect(url).toContain("https://trakt.tv/oauth/authorize");
    expect(url).toContain(`client_id=${clientId}`);
    expect(url).toContain("response_type=code");
    expect(url).toContain("redirect_uri=");
    expect(url).toContain("state=");
  });

  it("should get device codes", async () => {
    const codes = await trakt.getCodes();
    expect(codes).toBeDefined();
    expect(codes.device_code).toBeDefined();
    expect(codes.user_code).toBeDefined();
    expect(codes.verification_url).toBeDefined();
    expect(codes.expires_in).toBeGreaterThan(0);
    expect(codes.interval).toBeGreaterThan(0);

    console.log(
      `\nTo authenticate, go to ${codes.verification_url} and enter the code: ${codes.user_code}`,
    );
    console.log(
      "Note: This is just a test of code generation, not actual authentication.",
    );
  });

  it("should export and import token", async () => {
    // Create a mock token
    const mockToken = {
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
      expires: Date.now() + 3600000, // 1 hour from now
    };

    // Import the token
    const exportedToken = await trakt.importToken(mockToken);
    // Check that the exported token matches the imported token
    expect(exportedToken).toBeDefined();
    expect(exportedToken.access_token).toBe(mockToken.access_token);
    expect(exportedToken.refresh_token).toBe(mockToken.refresh_token);
    expect(exportedToken.expires).toBe(mockToken.expires);
  });

  // Test token revocation
  it("should revoke token", async () => {
    // Create a mock token
    const mockToken = {
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
      expires: Date.now() + 3600000, // 1 hour from now
    };

    // Import the token
    await trakt.importToken(mockToken);
    // Revoke the token
    await trakt.revokeToken();
    // Check that the token has been revoked
    const exportedToken = trakt.exportToken();
    expect(exportedToken.access_token).toBeUndefined();
    expect(exportedToken.refresh_token).toBeUndefined();
  });
});
