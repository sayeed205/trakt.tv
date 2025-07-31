/**
 * Types for Trakt.tv metadata endpoints including genres, networks, certifications, countries, and languages.
 *
 * @example
 * ```ts
 * import type { Genre, Network, Certification, Country, Language } from "@hitarashi/trakt/types";
 * ```
 *
 * @module
 */

/**
 * Genre information for movies and shows.
 */
export type Genre = {
  /** The genre name (e.g., "Action", "Comedy", "Drama") */
  name: string;
  /** The genre slug for API usage (e.g., "action", "comedy", "drama") */
  slug: string;
};

/**
 * Network information for shows.
 */
export type Network = {
  /** The network name (e.g., "HBO", "Netflix", "AMC") */
  name: string;
};

/**
 * Certification information for movies and shows.
 */
export type Certification = {
  /** The certification name (e.g., "PG-13", "R", "TV-MA") */
  name: string;
  /** The certification slug for API usage */
  slug: string;
  /** Description of what the certification means */
  description: string;
};

/**
 * Country information for movies and shows.
 */
export type Country = {
  /** The country name (e.g., "United States", "United Kingdom") */
  name: string;
  /** The ISO 3166-1 alpha-2 country code (e.g., "us", "gb") */
  code: string;
};

/**
 * Language information for movies and shows.
 */
export type Language = {
  /** The language name (e.g., "English", "Spanish", "French") */
  name: string;
  /** The ISO 639-1 language code (e.g., "en", "es", "fr") */
  code: string;
};