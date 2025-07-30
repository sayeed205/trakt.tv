import type { Movie } from "./movies.ts";
import type { Episode, Show } from "./shows.ts";

/**
 * Person type for search results.
 */
export type Person = {
  name: string;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  biography?: string;
  birthday?: string;
  death?: string;
  birthplace?: string;
  homepage?: string;
};

/**
 * List type for search results.
 */
export type List = {
  name: string;
  description: string;
  privacy: "private" | "friends" | "public";
  display_numbers: boolean;
  allow_comments: boolean;
  sort_by: string;
  sort_how: "asc" | "desc";
  created_at: string;
  updated_at: string;
  item_count: number;
  comment_count: number;
  like_count: number;
  ids: {
    trakt: number;
    slug: string;
  };
  user: {
    username: string;
    private: boolean;
    name: string;
    vip: boolean;
    vip_ep: boolean;
    ids: {
      slug: string;
    };
  };
};

/**
 * Search result type that can contain different content types.
 */
export type SearchResult = {
  type: "movie" | "show" | "episode" | "person" | "list";
  score: number;
  movie?: Movie;
  show?: Show;
  episode?: Episode;
  person?: Person;
  list?: List;
};

/**
 * Search parameters for text search.
 */
export type SearchTextParams = {
  query: string;
  type: "movie" | "show" | "episode" | "person" | "list";
  year?: number;
  page?: number;
  limit?: number;
};

/**
 * Search parameters for ID-based search.
 */
export type SearchIdParams = {
  id_type: "trakt" | "imdb" | "tmdb" | "tvdb";
  id: string;
  type?: "movie" | "show" | "episode";
  page?: number;
  limit?: number;
};
