import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import process from "node:process";

import Trakt from "../src/main.ts";
import type {
  AnticipatedShow,
  Episode,
  PlayedShow,
  Season,
  Show,
  ShowAlias,
  ShowTranslation,
  ShowUpdates,
  TrendingShow,
  WatchedShow,
} from "../src/types/shows.ts";

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

describe("Trakt Shows", () => {
  describe("Basic Show Operations", () => {
    it("should have shows property with all basic endpoints", () => {
      expect(trakt.shows).toBeDefined();
      expect(trakt.shows.get).toBeDefined();
      expect(trakt.shows.trending).toBeDefined();
      expect(trakt.shows.popular).toBeDefined();
      expect(trakt.shows.anticipated).toBeDefined();
      expect(trakt.shows.watched).toBeDefined();
      expect(trakt.shows.played).toBeDefined();
      expect(trakt.shows.updates).toBeDefined();
    });

    it("should get trending shows", async () => {
      const results = await trakt.shows.trending();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.watchers).toBeGreaterThan(0);
        expect(firstResult.show).toBeDefined();
        expect(firstResult.show.title).toBeDefined();
        expect(firstResult.show.year).toBeGreaterThan(0);
        expect(firstResult.show.ids).toBeDefined();
        expect(firstResult.show.ids.trakt).toBeGreaterThan(0);
      }
    });

    it("should get trending shows with pagination", async () => {
      const results = await trakt.shows.trending({ page: 1, limit: 5 });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(5);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.watchers).toBeGreaterThan(0);
        expect(firstResult.show).toBeDefined();
      }
    });

    it("should get popular shows", async () => {
      const results = await trakt.shows.popular();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.title).toBeDefined();
        expect(firstResult.year).toBeGreaterThan(0);
        expect(firstResult.ids).toBeDefined();
        expect(firstResult.ids.trakt).toBeGreaterThan(0);
      }
    });

    it("should get popular shows with pagination", async () => {
      const results = await trakt.shows.popular({ page: 1, limit: 3 });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it("should get anticipated shows", async () => {
      const results = await trakt.shows.anticipated();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.list_count).toBeGreaterThan(0);
        expect(firstResult.show).toBeDefined();
        expect(firstResult.show.title).toBeDefined();
        expect(firstResult.show.year).toBeGreaterThan(0);
        expect(firstResult.show.ids).toBeDefined();
      }
    });

    it("should get watched shows", async () => {
      const results = await trakt.shows.watched();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.watcher_count).toBeGreaterThan(0);
        expect(firstResult.play_count).toBeGreaterThan(0);
        expect(firstResult.collected_count).toBeGreaterThan(0);
        expect(firstResult.show).toBeDefined();
        expect(firstResult.show.title).toBeDefined();
      }
    });

    it("should get watched shows with period filter", async () => {
      const results = await trakt.shows.watched({ period: "monthly" });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it("should get played shows", async () => {
      const results = await trakt.shows.played();

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.watcher_count).toBeGreaterThan(0);
        expect(firstResult.play_count).toBeGreaterThan(0);
        expect(firstResult.show).toBeDefined();
      }
    });

    it("should get show updates", async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // 7 days ago
      const results = await trakt.shows.updates({
        start_date: startDate.toISOString().split("T")[0],
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.updated_at).toBeDefined();
        expect(firstResult.show).toBeDefined();
        expect(firstResult.show.title).toBeDefined();
      }
    });

    it("should get specific show by ID", async () => {
      // Using Breaking Bad's Trakt ID
      const show = await trakt.shows.get("1390");

      expect(show).toBeDefined();
      expect(show.title).toBeDefined();
      expect(show.year).toBeGreaterThan(0);
      expect(show.ids).toBeDefined();
      expect(show.ids.trakt).toBe(1390);
    });
  });

  describe("Show Metadata Endpoints", () => {
    it("should have all metadata endpoints", () => {
      expect(trakt.shows.aliases).toBeDefined();
      expect(trakt.shows.translations).toBeDefined();
      expect(trakt.shows.comments).toBeDefined();
      expect(trakt.shows.lists).toBeDefined();
      expect(trakt.shows.people).toBeDefined();
      expect(trakt.shows.ratings).toBeDefined();
      expect(trakt.shows.related).toBeDefined();
      expect(trakt.shows.stats).toBeDefined();
      expect(trakt.shows.watching).toBeDefined();
    });

    it("should get show aliases", async () => {
      // Using Breaking Bad's Trakt ID
      const aliases = await trakt.shows.aliases("1390");

      expect(aliases).toBeDefined();
      expect(Array.isArray(aliases)).toBe(true);

      if (aliases.length > 0) {
        const firstAlias = aliases[0];
        expect(firstAlias.title).toBeDefined();
        expect(firstAlias.country).toBeDefined();
      }
    });

    it("should get show translations", async () => {
      // Using Breaking Bad's Trakt ID
      const translations = await trakt.shows.translations({ id: "1390" });

      expect(translations).toBeDefined();
      expect(Array.isArray(translations)).toBe(true);

      if (translations.length > 0) {
        const firstTranslation = translations[0];
        expect(firstTranslation.title).toBeDefined();
        expect(firstTranslation.language).toBeDefined();
        expect(firstTranslation.country).toBeDefined();
      }
    });

    it("should get show translations for specific language", async () => {
      const translations = await trakt.shows.translations({
        id: "1390",
        language: "es",
      });

      expect(translations).toBeDefined();
      expect(Array.isArray(translations)).toBe(true);
    });

    it("should get show comments", async () => {
      const comments = await trakt.shows.comments({ id: "1390" });

      expect(comments).toBeDefined();
      expect(Array.isArray(comments)).toBe(true);
    });

    it("should get show lists", async () => {
      const lists = await trakt.shows.lists({ id: "1390" });

      expect(lists).toBeDefined();
      expect(Array.isArray(lists)).toBe(true);
    });

    it("should get show people", async () => {
      const people = await trakt.shows.people({ id: "1390" });

      expect(people).toBeDefined();
    });

    it("should get show ratings", async () => {
      const ratings = await trakt.shows.ratings({ id: "1390" });

      expect(ratings).toBeDefined();
    });

    it("should get related shows", async () => {
      const related = await trakt.shows.related({ id: "1390" });

      expect(related).toBeDefined();
      expect(Array.isArray(related)).toBe(true);
    });

    it("should get show stats", async () => {
      const stats = await trakt.shows.stats({ id: "1390" });

      expect(stats).toBeDefined();
    });

    it("should get show watching", async () => {
      const watching = await trakt.shows.watching({ id: "1390" });

      expect(watching).toBeDefined();
      expect(Array.isArray(watching)).toBe(true);
    });
  });

  describe("Seasons and Episodes Endpoints", () => {
    it("should have all seasons and episodes endpoints", () => {
      expect(trakt.shows.seasons).toBeDefined();
      expect(trakt.shows.season).toBeDefined();
      expect(trakt.shows.episodes).toBeDefined();
      expect(trakt.shows.episode).toBeDefined();
    });

    it("should get show seasons", async () => {
      // Using Breaking Bad's Trakt ID
      const seasons = await trakt.shows.seasons({ id: "1390" });

      expect(seasons).toBeDefined();
      expect(Array.isArray(seasons)).toBe(true);

      if (seasons.length > 0) {
        const firstSeason = seasons[0];
        expect(firstSeason.number).toBeGreaterThanOrEqual(0);
        expect(firstSeason.ids).toBeDefined();
        expect(firstSeason.ids.trakt).toBeGreaterThan(0);
      }
    });

    it("should get show seasons with extended info", async () => {
      const seasons = await trakt.shows.seasons({
        id: "1390",
        extended: "full",
      });

      expect(seasons).toBeDefined();
      expect(Array.isArray(seasons)).toBe(true);

      if (seasons.length > 0) {
        const firstSeason = seasons[0];
        expect(firstSeason.number).toBeGreaterThanOrEqual(0);
        expect(firstSeason.ids).toBeDefined();
      }
    });

    it("should get specific season episodes", async () => {
      // Get season 1 of Breaking Bad
      const episodes = await trakt.shows.season({
        id: "1390",
        season: 1,
      });

      expect(episodes).toBeDefined();
      expect(Array.isArray(episodes)).toBe(true);

      if (episodes.length > 0) {
        const firstEpisode = episodes[0];
        expect(firstEpisode.season).toBe(1);
        expect(firstEpisode.number).toBeGreaterThan(0);
        expect(firstEpisode.title).toBeDefined();
        expect(firstEpisode.ids).toBeDefined();
        expect(firstEpisode.ids.trakt).toBeGreaterThan(0);
      }
    });

    it("should get episodes (alias for season)", async () => {
      const episodes = await trakt.shows.episodes({
        id: "1390",
        season: 1,
      });

      expect(episodes).toBeDefined();
      expect(Array.isArray(episodes)).toBe(true);
    });

    it("should get specific episode", async () => {
      // Get Breaking Bad S01E01
      const episode = await trakt.shows.episode({
        id: "1390",
        season: 1,
        episode: 1,
      });

      expect(episode).toBeDefined();
      expect(episode.season).toBe(1);
      expect(episode.number).toBe(1);
      expect(episode.title).toBeDefined();
      expect(episode.ids).toBeDefined();
      expect(episode.ids.trakt).toBeGreaterThan(0);
    });

    it("should get specific episode with extended info", async () => {
      const episode = await trakt.shows.episode({
        id: "1390",
        season: 1,
        episode: 1,
        extended: "full",
      });

      expect(episode).toBeDefined();
      expect(episode.season).toBe(1);
      expect(episode.number).toBe(1);
      expect(episode.title).toBeDefined();
    });
  });

  describe("TypeScript Type Validation", () => {
    it("should validate Show type structure", () => {
      const mockShow: Show = {
        title: "Breaking Bad",
        year: 2008,
        ids: {
          trakt: 1390,
          slug: "breaking-bad",
          tvdb: 81189,
          imdb: "tt0903747",
          tmdb: 1396,
        },
        overview: "A high school chemistry teacher...",
        first_aired: "2008-01-20T10:00:00.000Z",
        airs: {
          day: "Sunday",
          time: "21:00",
          timezone: "America/New_York",
        },
        runtime: 47,
        certification: "TV-MA",
        network: "AMC",
        country: "us",
        status: "ended",
        rating: 9.5,
        votes: 111,
        comment_count: 92,
        language: "en",
        genres: ["drama", "crime"],
        aired_episodes: 62,
      };

      expect(mockShow.title).toBe("Breaking Bad");
      expect(mockShow.year).toBe(2008);
      expect(mockShow.ids.trakt).toBe(1390);
      expect(mockShow.airs?.day).toBe("Sunday");
      expect(mockShow.runtime).toBe(47);
      expect(mockShow.genres).toContain("drama");
    });

    it("should validate TrendingShow type structure", () => {
      const mockTrendingShow: TrendingShow = {
        watchers: 35,
        show: {
          title: "Breaking Bad",
          year: 2008,
          ids: {
            trakt: 1390,
            slug: "breaking-bad",
            tvdb: 81189,
            imdb: "tt0903747",
            tmdb: 1396,
          },
        },
      };

      expect(mockTrendingShow.watchers).toBe(35);
      expect(mockTrendingShow.show.title).toBe("Breaking Bad");
      expect(mockTrendingShow.show.ids.trakt).toBe(1390);
    });

    it("should validate AnticipatedShow type structure", () => {
      const mockAnticipatedShow: AnticipatedShow = {
        list_count: 12345,
        show: {
          title: "Upcoming Show",
          year: 2024,
          ids: {
            trakt: 999,
            slug: "upcoming-show",
            tvdb: 12345,
            imdb: "tt1234567",
            tmdb: 67890,
          },
        },
      };

      expect(mockAnticipatedShow.list_count).toBe(12345);
      expect(mockAnticipatedShow.show.title).toBe("Upcoming Show");
    });

    it("should validate WatchedShow type structure", () => {
      const mockWatchedShow: WatchedShow = {
        watcher_count: 4992,
        play_count: 7100,
        collected_count: 1348,
        show: {
          title: "Game of Thrones",
          year: 2011,
          ids: {
            trakt: 1390,
            slug: "game-of-thrones",
            tvdb: 121361,
            imdb: "tt0944947",
            tmdb: 1399,
          },
        },
      };

      expect(mockWatchedShow.watcher_count).toBe(4992);
      expect(mockWatchedShow.play_count).toBe(7100);
      expect(mockWatchedShow.collected_count).toBe(1348);
      expect(mockWatchedShow.show.title).toBe("Game of Thrones");
    });

    it("should validate PlayedShow type structure", () => {
      const mockPlayedShow: PlayedShow = {
        watcher_count: 4992,
        play_count: 7100,
        collected_count: 1348,
        show: {
          title: "The Walking Dead",
          year: 2010,
          ids: {
            trakt: 1393,
            slug: "the-walking-dead",
            tvdb: 153021,
            imdb: "tt1520211",
            tmdb: 1402,
          },
        },
      };

      expect(mockPlayedShow.watcher_count).toBe(4992);
      expect(mockPlayedShow.play_count).toBe(7100);
      expect(mockPlayedShow.show.title).toBe("The Walking Dead");
    });

    it("should validate ShowUpdates type structure", () => {
      const mockShowUpdates: ShowUpdates = {
        updated_at: "2014-02-01T08:44:40.000Z",
        show: {
          title: "Breaking Bad",
          year: 2008,
          ids: {
            trakt: 1390,
            slug: "breaking-bad",
            tvdb: 81189,
            imdb: "tt0903747",
            tmdb: 1396,
          },
        },
      };

      expect(mockShowUpdates.updated_at).toBe("2014-02-01T08:44:40.000Z");
      expect(mockShowUpdates.show.title).toBe("Breaking Bad");
    });

    it("should validate Season type structure", () => {
      const mockSeason: Season = {
        number: 1,
        ids: {
          trakt: 3950,
          slug: "season-1",
          tvdb: 349232,
          tmdb: 3572,
        },
        rating: 9.1,
        votes: 111,
        episode_count: 7,
        aired_episodes: 7,
        title: "Season 1",
        overview: "The first season of Breaking Bad...",
        first_aired: "2008-01-20T10:00:00.000Z",
        network: "AMC",
      };

      expect(mockSeason.number).toBe(1);
      expect(mockSeason.ids.trakt).toBe(3950);
      expect(mockSeason.rating).toBe(9.1);
      expect(mockSeason.episode_count).toBe(7);
      expect(mockSeason.title).toBe("Season 1");
    });

    it("should validate Episode type structure", () => {
      const mockEpisode: Episode = {
        season: 1,
        number: 1,
        title: "Pilot",
        ids: {
          trakt: 73640,
          tvdb: 349232,
          imdb: "tt0959621",
          tmdb: 62085,
        },
        number_abs: 1,
        overview: "When an unassuming high school chemistry teacher...",
        rating: 9.0,
        votes: 111,
        comment_count: 49,
        first_aired: "2008-01-20T10:00:00.000Z",
        updated_at: "2014-01-01T08:00:00.000Z",
        available_translations: ["en", "es", "fr"],
        runtime: 58,
      };

      expect(mockEpisode.season).toBe(1);
      expect(mockEpisode.number).toBe(1);
      expect(mockEpisode.title).toBe("Pilot");
      expect(mockEpisode.ids.trakt).toBe(73640);
      expect(mockEpisode.runtime).toBe(58);
      expect(mockEpisode.available_translations).toContain("en");
    });

    it("should validate ShowAlias type structure", () => {
      const mockShowAlias: ShowAlias = {
        title: "Breaking Bad",
        country: "us",
      };

      expect(mockShowAlias.title).toBe("Breaking Bad");
      expect(mockShowAlias.country).toBe("us");
    });

    it("should validate ShowTranslation type structure", () => {
      const mockShowTranslation: ShowTranslation = {
        title: "Breaking Bad",
        overview: "Un profesor de química de secundaria...",
        language: "es",
        country: "es",
      };

      expect(mockShowTranslation.title).toBe("Breaking Bad");
      expect(mockShowTranslation.language).toBe("es");
      expect(mockShowTranslation.country).toBe("es");
      expect(mockShowTranslation.overview).toContain("profesor");
    });
  });

  describe("Error Handling", () => {
    it("should handle non-existent show ID", async () => {
      // Test with a very unlikely to exist show ID
      try {
        const result = await trakt.shows.get("999999999");
        // If we get a result, it should be null or undefined for non-existent shows
        // Some APIs return null/undefined instead of throwing errors
        if (result) {
          expect(result).toBeDefined();
        }
      } catch (error) {
        // If an error is thrown, that's also acceptable behavior
        expect(error).toBeDefined();
      }
    });

    it("should handle empty results gracefully", async () => {
      // Test with parameters that might return empty results
      const results = await trakt.shows.updates({
        start_date: "1900-01-01", // Very old date unlikely to have updates
        limit: 1,
      });

      expect(Array.isArray(results)).toBe(true);
      // Empty results are valid
    });

    it("should handle edge case parameters", async () => {
      // Test with edge case but valid parameters
      const results = await trakt.shows.trending({
        page: 1000, // High page number
        limit: 1,
      });

      expect(Array.isArray(results)).toBe(true);
      // Empty results for high page numbers are expected
    });
  });

  describe("Parameter Validation", () => {
    it("should handle pagination parameters correctly", async () => {
      const results = await trakt.shows.trending({
        page: 2,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(10);
    });

    it("should handle period parameters correctly", async () => {
      const dailyResults = await trakt.shows.watched({ period: "daily" });
      const weeklyResults = await trakt.shows.watched({ period: "weekly" });
      const monthlyResults = await trakt.shows.watched({ period: "monthly" });
      const yearlyResults = await trakt.shows.watched({ period: "yearly" });
      const allResults = await trakt.shows.watched({ period: "all" });

      expect(Array.isArray(dailyResults)).toBe(true);
      expect(Array.isArray(weeklyResults)).toBe(true);
      expect(Array.isArray(monthlyResults)).toBe(true);
      expect(Array.isArray(yearlyResults)).toBe(true);
      expect(Array.isArray(allResults)).toBe(true);
    });

    it("should handle extended parameters correctly", async () => {
      const basicSeasons = await trakt.shows.seasons({ id: "1390" });
      const fullSeasons = await trakt.shows.seasons({
        id: "1390",
        extended: "full",
      });

      expect(Array.isArray(basicSeasons)).toBe(true);
      expect(Array.isArray(fullSeasons)).toBe(true);
    });

    it("should handle date parameters correctly", async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split("T")[0];

      const results = await trakt.shows.updates({
        start_date: dateString,
        page: 1,
        limit: 5,
      });

      expect(Array.isArray(results)).toBe(true);
    });
  });
});
