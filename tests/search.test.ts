import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import process from "node:process";

import Trakt from "../src/main.ts";
import type {
  SearchIdParams,
  SearchResult,
  SearchTextParams,
} from "../src/types/search.ts";

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

describe("Trakt Search", () => {
  it("should perform text search with basic query", async () => {
    const params: SearchTextParams = {
      query: "breaking bad",
      type: "show",
    };

    const results = await trakt.search.text(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    // Check that we have valid search results
    const firstResult = results[0];
    expect(firstResult.type).toBeDefined();
    expect(firstResult.score).toBeGreaterThan(0);

    // Should have at least one content property
    const hasContent = firstResult.movie || firstResult.show ||
      firstResult.episode || firstResult.person || firstResult.list;
    expect(hasContent).toBeDefined();
  });

  it("should perform text search with type filter", async () => {
    const params: SearchTextParams = {
      query: "breaking bad",
      type: "show",
      limit: 5,
    };

    const results = await trakt.search.text(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(5);

    // All results should be shows when type filter is applied
    results.forEach((result) => {
      expect(result.type).toBe("show");
      expect(result.show).toBeDefined();
    });
  });

  it("should perform ID search with IMDB ID", async () => {
    const params: SearchIdParams = {
      id_type: "imdb",
      id: "tt0903747", // Breaking Bad IMDB ID
      type: "show",
    };

    const results = await trakt.search.id(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    const firstResult = results[0];
    expect(firstResult.type).toBe("show");
    expect(firstResult.show).toBeDefined();
    expect(firstResult.show?.ids.imdb).toBe("tt0903747");
  });

  it("should perform ID search with TMDB ID", async () => {
    const params: SearchIdParams = {
      id_type: "tmdb",
      id: "1396", // Breaking Bad TMDB ID
      type: "show",
    };

    const results = await trakt.search.id(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    const firstResult = results[0];
    expect(firstResult.type).toBe("show");
    expect(firstResult.show).toBeDefined();
    expect(firstResult.show?.ids.tmdb).toBe(1396);
  });

  it("should search for movies", async () => {
    const params: SearchTextParams = {
      query: "inception",
      type: "movie",
      limit: 3,
    };

    const results = await trakt.search.text(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    results.forEach((result) => {
      expect(result.type).toBe("movie");
      expect(result.movie).toBeDefined();
      expect(result.movie?.title).toBeDefined();
      expect(result.movie?.year).toBeDefined();
      expect(result.movie?.ids).toBeDefined();
    });
  });

  it("should search for people", async () => {
    const params: SearchTextParams = {
      query: "bryan cranston",
      type: "person",
      limit: 3,
    };

    const results = await trakt.search.text(params);

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    results.forEach((result) => {
      expect(result.type).toBe("person");
      expect(result.person).toBeDefined();
      expect(result.person?.name).toBeDefined();
      expect(result.person?.ids).toBeDefined();
    });
  });

  it("should verify SearchResult type structure for movies", () => {
    const mockResult: SearchResult = {
      type: "movie",
      score: 95.5,
      movie: {
        title: "Test Movie",
        year: 2023,
        ids: {
          trakt: 123,
          slug: "test-movie",
          imdb: "tt123456",
          tmdb: 789,
        },
      },
    };

    expect(mockResult.type).toBe("movie");
    expect(mockResult.score).toBe(95.5);
    expect(mockResult.movie).toBeDefined();
    expect(mockResult.movie?.title).toBe("Test Movie");
  });

  it("should verify SearchResult type structure for people", () => {
    const mockResult: SearchResult = {
      type: "person",
      score: 88.2,
      person: {
        name: "Bryan Cranston",
        ids: {
          trakt: 1,
          slug: "bryan-cranston",
          imdb: "nm0186505",
          tmdb: 17419,
        },
        biography: "American actor and director",
        birthday: "1956-03-07",
        birthplace: "Hollywood, California, USA",
      },
    };

    expect(mockResult.type).toBe("person");
    expect(mockResult.person).toBeDefined();
    expect(mockResult.person?.name).toBe("Bryan Cranston");
    expect(mockResult.person?.biography).toBe("American actor and director");
  });

  it("should verify SearchResult type structure for lists", () => {
    const mockResult: SearchResult = {
      type: "list",
      score: 75.0,
      list: {
        name: "Best TV Shows",
        description: "My favorite TV shows of all time",
        privacy: "public",
        display_numbers: true,
        allow_comments: true,
        sort_by: "rank",
        sort_how: "asc",
        created_at: "2023-01-01T00:00:00.000Z",
        updated_at: "2023-12-01T00:00:00.000Z",
        item_count: 50,
        comment_count: 10,
        like_count: 25,
        ids: {
          trakt: 1,
          slug: "best-tv-shows",
        },
        user: {
          username: "testuser",
          private: false,
          name: "Test User",
          vip: false,
          vip_ep: false,
          ids: {
            slug: "testuser",
          },
        },
      },
    };

    expect(mockResult.type).toBe("list");
    expect(mockResult.list).toBeDefined();
    expect(mockResult.list?.name).toBe("Best TV Shows");
    expect(mockResult.list?.privacy).toBe("public");
    expect(mockResult.list?.user.username).toBe("testuser");
  });
});
