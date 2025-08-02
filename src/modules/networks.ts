/**
 * @fileoverview Networks module for Trakt.tv API
 * Handles network-related API endpoints for retrieving TV network information.
 */

import type { Network } from "../types/index.ts";

/**
 * Type definition for the call method dependency injection
 */
type CallMethod = <T = unknown>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  params?: Record<string, unknown>,
) => Promise<T>;

/**
 * NetworksModule handles network-related API endpoints.
 * Provides methods to retrieve information about TV networks.
 */
export class NetworksModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get all networks.
   * Returns a list of all TV networks available in the Trakt.tv database.
   * This includes both current and historical networks from various countries.
   * @returns Promise resolving to array of networks
   * @example
   * ```ts
   * // Get all available networks
   * const networks = await client.networks();
   *
   * // Networks contain information like:
   * // - name: "HBO"
   * // - country: "us"
   * // - ids: { trakt: 1, slug: "hbo", tmdb: 49 }
   * ```
   */
  get(): Promise<Network[]> {
    return this._call("get", "/networks");
  }
}
