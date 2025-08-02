/**
 * @fileoverview Base module infrastructure for Trakt.tv API modules
 * Provides common types and interfaces used by all API modules.
 */

/**
 * Type definition for the call method that modules use to make API requests.
 * This method is injected into each module to handle HTTP requests with proper authentication.
 *
 * @template T - The expected response type
 * @param method - HTTP method to use (get, post, put, delete)
 * @param path - API endpoint path (e.g., "/movies/trending")
 * @param params - Optional parameters for the request (query params for GET, body for others)
 * @returns Promise resolving to the API response
 */
export type CallMethod = <T = unknown>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  params?: Record<string, unknown>,
) => Promise<T>;

/**
 * Base interface that all API modules should implement.
 * Provides a consistent pattern for module construction and dependency injection.
 */
export interface BaseModule {
  /**
   * Constructor signature for all modules.
   * @param callMethod - The injected call method for making API requests
   */
  new (callMethod: CallMethod): this;
}

/**
 * Utility type for extracting module method names.
 * Used internally for type safety when delegating from main class to modules.
 */
export type ModuleMethods<T> = {
  [K in keyof T]: T[K];
};
