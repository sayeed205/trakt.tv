import type { Movie } from "./movies.ts";
import type { Episode, Season, Show } from "./shows.ts";

/**
 * Re-export the List type from search.ts for consistency
 */
export type { List } from "./search.ts";

/**
 * List item that can contain movies, shows, seasons, episodes, or people.
 */
export type ListItem = {
  rank: number;
  listed_at: string;
  notes?: string;
  movie?: Movie;
  show?: Show;
  season?: Season;
  episode?: Episode;
  person?: {
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
};

/**
 * Parameters for creating a new list.
 */
export type CreateListParams = {
  name: string;
  description?: string;
  privacy?: "private" | "friends" | "public";
  display_numbers?: boolean;
  allow_comments?: boolean;
  sort_by?:
    | "rank"
    | "added"
    | "title"
    | "released"
    | "runtime"
    | "popularity"
    | "percentage"
    | "votes"
    | "my_rating"
    | "random";
  sort_how?: "asc" | "desc";
};

/**
 * Parameters for updating an existing list.
 */
export type UpdateListParams = {
  name?: string;
  description?: string;
  privacy?: "private" | "friends" | "public";
  display_numbers?: boolean;
  allow_comments?: boolean;
  sort_by?:
    | "rank"
    | "added"
    | "title"
    | "released"
    | "runtime"
    | "popularity"
    | "percentage"
    | "votes"
    | "my_rating"
    | "random";
  sort_how?: "asc" | "desc";
};

/**
 * Parameters for adding items to a list.
 */
export type AddListItemsParams = {
  movies?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
    notes?: string;
  }>;
  shows?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
      tvdb?: number;
    };
    notes?: string;
  }>;
  seasons?: Array<{
    ids: {
      trakt?: number;
      tvdb?: number;
      tmdb?: number;
    };
    notes?: string;
  }>;
  episodes?: Array<{
    ids: {
      trakt?: number;
      tvdb?: number;
      imdb?: string;
      tmdb?: number;
    };
    notes?: string;
  }>;
  people?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
    notes?: string;
  }>;
};

/**
 * Parameters for removing items from a list.
 */
export type RemoveListItemsParams = {
  movies?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
  shows?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
      tvdb?: number;
    };
  }>;
  seasons?: Array<{
    ids: {
      trakt?: number;
      tvdb?: number;
      tmdb?: number;
    };
  }>;
  episodes?: Array<{
    ids: {
      trakt?: number;
      tvdb?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
  people?: Array<{
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
};

/**
 * Parameters for reordering list items.
 */
export type ReorderListItemsParams = {
  movies?: Array<{
    rank: number;
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
  shows?: Array<{
    rank: number;
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
      tvdb?: number;
    };
  }>;
  seasons?: Array<{
    rank: number;
    ids: {
      trakt?: number;
      tvdb?: number;
      tmdb?: number;
    };
  }>;
  episodes?: Array<{
    rank: number;
    ids: {
      trakt?: number;
      tvdb?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
  people?: Array<{
    rank: number;
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
  }>;
};

/**
 * Response from list item operations (add, remove, reorder).
 */
export type ListItemResponse = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
    people: number;
  };
  existing: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
    people: number;
  };
  not_found: {
    movies: Array<{
      ids: {
        trakt?: number;
        imdb?: string;
        tmdb?: number;
      };
    }>;
    shows: Array<{
      ids: {
        trakt?: number;
        imdb?: string;
        tmdb?: number;
        tvdb?: number;
      };
    }>;
    seasons: Array<{
      ids: {
        trakt?: number;
        tvdb?: number;
        tmdb?: number;
      };
    }>;
    episodes: Array<{
      ids: {
        trakt?: number;
        tvdb?: number;
        imdb?: string;
        tmdb?: number;
      };
    }>;
    people: Array<{
      ids: {
        trakt?: number;
        imdb?: string;
        tmdb?: number;
      };
    }>;
  };
};

/**
 * Parameters for getting list items with optional filters.
 */
export type GetListItemsParams = {
  type?: "movies" | "shows" | "seasons" | "episodes" | "people";
  extended?: "min" | "full";
  page?: number;
  limit?: number;
};

/**
 * Parameters for getting lists with optional filters.
 */
export type GetListsParams = {
  page?: number;
  limit?: number;
};
