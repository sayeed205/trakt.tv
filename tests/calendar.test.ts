import {expect} from "jsr:@std/expect";
import {describe, it} from "jsr:@std/testing/bdd";
import process from "node:process";

import Trakt from "../src/main.ts";
import type {CalendarMovie} from "../src/types/calendar.ts";

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

describe("Trakt Calendar", () => {
  it("should have calendars property with my and all sections", () => {
    expect(trakt.calendars).toBeDefined();
    expect(trakt.calendars.my).toBeDefined();
    expect(trakt.calendars.all).toBeDefined();
  });

  it("should have my calendar endpoints", () => {
    expect(trakt.calendars.my.shows).toBeDefined();
    expect(trakt.calendars.my.newShows).toBeDefined();
    expect(trakt.calendars.my.seasonPremieres).toBeDefined();
    expect(trakt.calendars.my.movies).toBeDefined();
  });

  it("should have all calendar endpoints", () => {
    expect(trakt.calendars.all.shows).toBeDefined();
    expect(trakt.calendars.all.newShows).toBeDefined();
    expect(trakt.calendars.all.seasonPremieres).toBeDefined();
    expect(trakt.calendars.all.movies).toBeDefined();
  });

  it("should get all shows calendar", async () => {
    const results = await trakt.calendars.all.shows();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);

    if (results.length > 0) {
      const firstResult = results[0];
      expect(firstResult.first_aired).toBeDefined();
      expect(firstResult.episode).toBeDefined();
      expect(firstResult.show).toBeDefined();
      expect(firstResult.episode.season).toBeGreaterThan(0);
      expect(firstResult.episode.number).toBeGreaterThan(0);
      expect(firstResult.show.title).toBeDefined();
      expect(firstResult.show.year).toBeGreaterThan(0);
      expect(firstResult.show.ids).toBeDefined();
    }
  });

  it("should get all new shows calendar", async () => {
    const results = await trakt.calendars.all.newShows();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);

    if (results.length > 0) {
      const firstResult = results[0];
      expect(firstResult.first_aired).toBeDefined();
      expect(firstResult.episode).toBeDefined();
      expect(firstResult.show).toBeDefined();
      expect(firstResult.episode.season).toBeGreaterThan(0);
      expect(firstResult.episode.number).toBeGreaterThan(0);
      expect(firstResult.show.title).toBeDefined();
      expect(firstResult.show.year).toBeGreaterThan(0);
      expect(firstResult.show.ids).toBeDefined();
    }
  });

  it("should get all season premieres calendar", async () => {
    const results = await trakt.calendars.all.seasonPremieres();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  it("should get all movies calendar", async () => {
    const results = await trakt.calendars.all.movies();

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);

    if (results.length > 0) {
      const firstResult = results[0];
      expect(firstResult.released).toBeDefined();
      expect(firstResult.movie).toBeDefined();
      expect(firstResult.movie.title).toBeDefined();
      expect(firstResult.movie.year).toBeGreaterThan(0);
      expect(firstResult.movie.ids).toBeDefined();
    }
  });

  it("should verify CalendarShow type structure", async () => {
    const results = await trakt.calendars.all.shows();

    if (results.length > 0) {
      const firstResult = results[0];
      expect(firstResult.first_aired).toBeDefined();
      expect(firstResult.episode).toBeDefined();
      expect(firstResult.show).toBeDefined();
      expect(firstResult.episode.season).toBeGreaterThan(0);
      expect(firstResult.episode.number).toBeGreaterThan(0);
      expect(firstResult.show.title).toBeDefined();
      expect(firstResult.show.year).toBeGreaterThan(0);
      expect(firstResult.show.ids).toBeDefined();
    }
  });

  it("should verify CalendarMovie type structure", () => {
    const calendarMovie: CalendarMovie = {
      released: "2024-01-01",
      movie: {
        title: "Test Movie",
        year: 2024,
        ids: {
          trakt: 1,
          slug: "test-movie",
          imdb: "tt1234567",
          tmdb: 12345,
        },
      },
    };

    expect(typeof calendarMovie.released).toBe("string");
    expect(typeof calendarMovie.movie).toBe("object");
    expect(calendarMovie.movie.title).toBe("Test Movie");
    expect(calendarMovie.movie.year).toBe(2024);
  });
});
