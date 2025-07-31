/**
 * Tests for metadata endpoints (genres, networks, certifications, countries, languages).
 */
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import Trakt from "../src/main.ts";
import type {
  Certification,
  Country,
  Genre,
  Language,
  Network,
} from "../src/types/metadata.ts";

const clientId = Deno.env.get("TRAKT_CLIENT_ID");
const clientSecret = Deno.env.get("TRAKT_CLIENT_SECRET");

if (!clientId || !clientSecret) {
  console.error(
    "Error: TRAKT_CLIENT_ID and TRAKT_CLIENT_SECRET must be set in .env file",
  );
  process.exit(1);
}

const client = new Trakt({
  client_id: clientId,
  client_secret: clientSecret,
});

Deno.test("Metadata endpoints should be defined", () => {
  // Test that all metadata endpoint groups exist
  assertEquals(typeof client.genres, "object");
  assertEquals(typeof client.genres.movies, "function");
  assertEquals(typeof client.genres.shows, "function");

  assertEquals(typeof client.networks, "function");

  assertEquals(typeof client.certifications, "object");
  assertEquals(typeof client.certifications.movies, "function");
  assertEquals(typeof client.certifications.shows, "function");

  assertEquals(typeof client.countries, "object");
  assertEquals(typeof client.countries.movies, "function");
  assertEquals(typeof client.countries.shows, "function");

  assertEquals(typeof client.languages, "object");
  assertEquals(typeof client.languages.movies, "function");
  assertEquals(typeof client.languages.shows, "function");
});

Deno.test("Metadata types should be properly defined", () => {
  // Test Genre type structure
  const genre: Genre = {
    name: "Action",
    slug: "action",
  };
  assertEquals(genre.name, "Action");
  assertEquals(genre.slug, "action");

  // Test Network type structure
  const network: Network = {
    name: "HBO",
  };
  assertEquals(network.name, "HBO");

  // Test Certification type structure
  const certification: Certification = {
    name: "PG-13",
    slug: "pg-13",
    description: "Parents Strongly Cautioned",
  };
  assertEquals(certification.name, "PG-13");
  assertEquals(certification.slug, "pg-13");
  assertEquals(certification.description, "Parents Strongly Cautioned");

  // Test Country type structure
  const country: Country = {
    name: "United States",
    code: "us",
  };
  assertEquals(country.name, "United States");
  assertEquals(country.code, "us");

  // Test Language type structure
  const language: Language = {
    name: "English",
    code: "en",
  };
  assertEquals(language.name, "English");
  assertEquals(language.code, "en");
});
