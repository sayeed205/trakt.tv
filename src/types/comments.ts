import type { Movie } from "./movies.ts";
import type { Episode, Show } from "./shows.ts";
import type { User } from "./users.ts";

/**
 * Core Comment type representing a comment in the Trakt.tv system
 */
export type Comment = {
  id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  comment: string;
  spoiler: boolean;
  review: boolean;
  replies: number;
  likes: number;
  user_rating?: number;
  user: User;
  // Optional media context - present when comment is retrieved with media context
  movie?: Movie;
  show?: Show;
  episode?: Episode;
};

/**
 * Parameters for creating a new comment
 */
export type CommentPostParams = {
  comment: string;
  spoiler?: boolean;
  review?: boolean;
  movie?: {
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
    };
  };
  show?: {
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
      tvdb?: number;
    };
  };
  episode?: {
    ids: {
      trakt?: number;
      imdb?: string;
      tmdb?: number;
      tvdb?: number;
    };
  };
  season?: {
    ids: {
      trakt?: number;
      tmdb?: number;
      tvdb?: number;
    };
  };
  list?: {
    ids: {
      trakt?: number;
    };
  };
};

/**
 * Parameters for updating an existing comment
 */
export type CommentUpdateParams = {
  comment: string;
  spoiler?: boolean;
  review?: boolean;
};

/**
 * Parameters for creating a reply to a comment
 */
export type CommentReplyParams = {
  comment: string;
  spoiler?: boolean;
  review?: boolean;
};

/**
 * Parameters for retrieving comments with optional filters
 */
export type GetCommentsParams = {
  comment_type?: "all" | "reviews" | "shouts";
  type?: "all" | "movies" | "shows" | "seasons" | "episodes" | "lists";
  include_replies?: boolean;
  page?: number;
  limit?: number;
};

/**
 * Parameters for trending comments
 */
export type TrendingCommentsParams = {
  comment_type?: "all" | "reviews" | "shouts";
  type?: "all" | "movies" | "shows" | "seasons" | "episodes" | "lists";
  include_replies?: boolean;
  page?: number;
  limit?: number;
};

/**
 * Parameters for recent comments
 */
export type RecentCommentsParams = {
  comment_type?: "all" | "reviews" | "shouts";
  type?: "all" | "movies" | "shows" | "seasons" | "episodes" | "lists";
  include_replies?: boolean;
  page?: number;
  limit?: number;
};

/**
 * Parameters for comment updates
 */
export type CommentUpdatesParams = {
  comment_type?: "all" | "reviews" | "shouts";
  type?: "all" | "movies" | "shows" | "seasons" | "episodes" | "lists";
  include_replies?: boolean;
  page?: number;
  limit?: number;
};
