/**
 * @fileoverview Comments module for Trakt.tv API
 * Handles all comment-related API endpoints including CRUD operations, replies, likes, and comment discovery.
 * Provides functionality for creating, updating, deleting comments, managing replies, and retrieving trending/recent comments.
 */

import type {
  Comment,
  CommentPostParams,
  CommentReplyParams,
  CommentUpdateParams,
  CommentUpdatesParams,
  RecentCommentsParams,
  TrendingCommentsParams,
} from "../types/comments.ts";
import type { CallMethod } from "./base.ts";

/**
 * Comments module class providing all comment-related API functionality.
 * Handles comment CRUD operations, replies, likes, and comment discovery.
 */
export class CommentsModule {
  constructor(private readonly _call: CallMethod) {}

  /**
   * Get a specific comment by ID.
   * @param id The comment ID
   * @returns Promise resolving to the comment
   * @example
   * ```ts
   * const comment = await client.comments.get(12345);
   * ```
   */
  get = (id: number): Promise<Comment> => this._call("get", `/comments/${id}`);

  /**
   * Create a new comment.
   * OAuth Required
   * @param params Comment creation parameters
   * @returns Promise resolving to the created comment
   * @example
   * ```ts
   * const newComment = await client.comments.create({
   *   comment: "This movie was amazing!",
   *   spoiler: false,
   *   review: true,
   *   movie: { ids: { imdb: "tt0111161" } }
   * });
   * ```
   */
  create = (params: CommentPostParams): Promise<Comment> =>
    this._call("post", "/comments", params);

  /**
   * Update an existing comment.
   * OAuth Required
   * @param id The comment ID to update
   * @param params Comment update parameters
   * @returns Promise resolving to the updated comment
   * @example
   * ```ts
   * const updatedComment = await client.comments.update(12345, {
   *   comment: "Updated comment text",
   *   spoiler: true
   * });
   * ```
   */
  update = (id: number, params: CommentUpdateParams): Promise<Comment> =>
    this._call("put", `/comments/${id}`, params);

  /**
   * Delete a comment.
   * OAuth Required
   * @param id The comment ID to delete
   * @returns Promise resolving when comment is deleted
   * @example
   * ```ts
   * await client.comments.delete(12345);
   * ```
   */
  delete = (id: number): Promise<void> =>
    this._call("delete", `/comments/${id}`);

  /**
   * Get replies to a specific comment.
   * @param id The parent comment ID
   * @param params Optional parameters for pagination
   * @returns Promise resolving to array of reply comments
   * @example
   * ```ts
   * const replies = await client.comments.replies(12345, { page: 1, limit: 10 });
   * ```
   */
  replies = (
    id: number,
    params?: { page?: number; limit?: number },
  ): Promise<Comment[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", `/comments/${id}/replies`, searchParams);
  };

  /**
   * Create a reply to a comment.
   * OAuth Required
   * @param id The parent comment ID
   * @param params Reply parameters
   * @returns Promise resolving to the created reply comment
   * @example
   * ```ts
   * const reply = await client.comments.reply(12345, {
   *   comment: "I totally agree with your review!",
   *   spoiler: false
   * });
   * ```
   */
  reply = (id: number, params: CommentReplyParams): Promise<Comment> =>
    this._call("post", `/comments/${id}/replies`, params);

  /**
   * Like a comment.
   * OAuth Required
   * @param id The comment ID to like
   * @returns Promise resolving when comment is liked
   * @example
   * ```ts
   * await client.comments.like(12345);
   * ```
   */
  like = (id: number): Promise<void> =>
    this._call("post", `/comments/${id}/like`);

  /**
   * Unlike a comment.
   * OAuth Required
   * @param id The comment ID to unlike
   * @returns Promise resolving when comment is unliked
   * @example
   * ```ts
   * await client.comments.unlike(12345);
   * ```
   */
  unlike = (id: number): Promise<void> =>
    this._call("delete", `/comments/${id}/like`);

  /**
   * Get trending comments.
   * @param params Optional parameters for filtering and pagination
   * @returns Promise resolving to array of trending comments
   * @example
   * ```ts
   * const trending = await client.comments.trending({
   *   comment_type: "reviews",
   *   type: "movies",
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  trending = (params?: TrendingCommentsParams): Promise<Comment[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.comment_type) {
      searchParams.comment_type = params.comment_type;
    }
    if (params?.type) searchParams.type = params.type;
    if (params?.include_replies !== undefined) {
      searchParams.include_replies = params.include_replies;
    }
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/comments/trending", searchParams);
  };

  /**
   * Get recent comments.
   * @param params Optional parameters for filtering and pagination
   * @returns Promise resolving to array of recent comments
   * @example
   * ```ts
   * const recent = await client.comments.recent({
   *   comment_type: "all",
   *   type: "shows",
   *   include_replies: false,
   *   page: 1
   * });
   * ```
   */
  recent = (params?: RecentCommentsParams): Promise<Comment[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.comment_type) {
      searchParams.comment_type = params.comment_type;
    }
    if (params?.type) searchParams.type = params.type;
    if (params?.include_replies !== undefined) {
      searchParams.include_replies = params.include_replies;
    }
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/comments/recent", searchParams);
  };

  /**
   * Get comment updates.
   * @param params Optional parameters for filtering and pagination
   * @returns Promise resolving to array of updated comments
   * @example
   * ```ts
   * const updates = await client.comments.updates({
   *   comment_type: "reviews",
   *   type: "all",
   *   page: 1,
   *   limit: 20
   * });
   * ```
   */
  updates = (params?: CommentUpdatesParams): Promise<Comment[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.comment_type) {
      searchParams.comment_type = params.comment_type;
    }
    if (params?.type) searchParams.type = params.type;
    if (params?.include_replies !== undefined) {
      searchParams.include_replies = params.include_replies;
    }
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/comments/updates", searchParams);
  };
}
