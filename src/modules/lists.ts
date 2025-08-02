/**
 * @fileoverview Lists module for Trakt.tv API
 * Handles all list-related API endpoints including trending, popular, CRUD operations, and item management.
 * Provides functionality for creating, updating, deleting lists, managing list items, and retrieving list data.
 */

import type { Comment } from "../types/comments.ts";
import type {
  AddListItemsParams,
  CreateListParams,
  GetListItemsParams,
  GetListsParams,
  List,
  ListItem,
  ListItemResponse,
  RemoveListItemsParams,
  ReorderListItemsParams,
  UpdateListParams,
} from "../types/lists.ts";
import type { CallMethod } from "./base.ts";

/**
 * Lists module class providing all list-related API functionality.
 * Handles list discovery, CRUD operations, and item management.
 */
export class ListsModule {
  /**
   * List item management operations.
   */
  itemManagement = {
    /**
     * Add items to a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @param params Items to add to the list
     * @returns Promise resolving to operation response
     * @example
     * ```ts
     * const result = await client.lists.itemManagement.add("my-list", {
     *   movies: [{ ids: { imdb: "tt0111161" } }],
     *   shows: [{ ids: { imdb: "tt0903747" } }]
     * });
     * ```
     */
    add: (
      id: string,
      params: AddListItemsParams,
    ): Promise<ListItemResponse> =>
      this._call("post", `/lists/${id}/items`, params),

    /**
     * Remove items from a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @param params Items to remove from the list
     * @returns Promise resolving to operation response
     * @example
     * ```ts
     * const result = await client.lists.itemManagement.remove("my-list", {
     *   movies: [{ ids: { imdb: "tt0111161" } }]
     * });
     * ```
     */
    remove: (
      id: string,
      params: RemoveListItemsParams,
    ): Promise<ListItemResponse> =>
      this._call("post", `/lists/${id}/items/remove`, params),

    /**
     * Reorder items in a list.
     * OAuth Required
     * @param id The list ID (Trakt ID or slug)
     * @param params New order for list items
     * @returns Promise resolving to operation response
     * @example
     * ```ts
     * const result = await client.lists.itemManagement.reorder("my-list", {
     *   movies: [
     *     { rank: 1, ids: { imdb: "tt0111161" } },
     *     { rank: 2, ids: { imdb: "tt0068646" } }
     *   ]
     * });
     * ```
     */
    reorder: (
      id: string,
      params: ReorderListItemsParams,
    ): Promise<ListItemResponse> =>
      this._call("post", `/lists/${id}/items/reorder`, params),
  };

  constructor(private readonly _call: CallMethod) {}

  /**
   * Get trending lists.
   * @param params Optional parameters for pagination
   * @returns Promise resolving to array of trending lists
   * @example
   * ```ts
   * const trendingLists = await client.lists.trending({ page: 1, limit: 10 });
   * ```
   */
  trending = (params?: GetListsParams): Promise<List[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/lists/trending", searchParams);
  };

  /**
   * Get popular lists.
   * @param params Optional parameters for pagination
   * @returns Promise resolving to array of popular lists
   * @example
   * ```ts
   * const popularLists = await client.lists.popular({ page: 1, limit: 10 });
   * ```
   */
  popular = (params?: GetListsParams): Promise<List[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", "/lists/popular", searchParams);
  };

  /**
   * Get a specific list by ID.
   * OAuth Required for private lists
   * @param id The list ID (Trakt ID or slug)
   * @returns Promise resolving to the list
   * @example
   * ```ts
   * const list = await client.lists.get("my-awesome-list");
   * ```
   */
  get = (id: string): Promise<List> => this._call("get", `/lists/${id}`);

  /**
   * Get items from a specific list.
   * OAuth Required for private lists
   * @param id The list ID (Trakt ID or slug)
   * @param params Optional parameters for filtering and pagination
   * @returns Promise resolving to array of list items
   * @example
   * ```ts
   * const items = await client.lists.items("my-list", { type: "movies", page: 1 });
   * ```
   */
  items = (
    id: string,
    params?: GetListItemsParams,
  ): Promise<ListItem[]> => {
    const searchParams: Record<string, unknown> = {};
    if (params?.type) searchParams.type = params.type;
    if (params?.extended) searchParams.extended = params.extended;
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;

    return this._call("get", `/lists/${id}/items`, searchParams);
  };

  /**
   * Get comments for a specific list.
   * @param id The list ID (Trakt ID or slug)
   * @param sort Optional parameters for sorting
   * @returns Promise resolving to array of comments
   * @example
   * ```ts
   * const comments = await client.lists.comments("my-list", "newest");
   * ```
   */
  comments = (
    id: string,
    sort: "newest" | "oldest" | "likes" | "replies" = "newest",
  ): Promise<Comment[]> => {
    return this._call("get", `/lists/${id}/comments/${sort}`);
  };

  /**
   * Create a new list.
   * OAuth Required
   * @param params List creation parameters
   * @returns Promise resolving to the created list
   * @example
   * ```ts
   * const newList = await client.lists.create({
   *   name: "My Favorite Movies",
   *   description: "A collection of my all-time favorites",
   *   privacy: "public"
   * });
   * ```
   */
  create = (params: CreateListParams): Promise<List> =>
    this._call("post", "/lists", params);

  /**
   * Update an existing list.
   * OAuth Required
   * @param id The list ID (Trakt ID or slug)
   * @param params List update parameters
   * @returns Promise resolving to the updated list
   * @example
   * ```ts
   * const updatedList = await client.lists.update("my-list", {
   *   name: "Updated List Name",
   *   privacy: "private"
   * });
   * ```
   */
  update = (id: string, params: UpdateListParams): Promise<List> =>
    this._call("put", `/lists/${id}`, params);

  /**
   * Delete a list.
   * OAuth Required
   * @param id The list ID (Trakt ID or slug)
   * @returns Promise resolving when list is deleted
   * @example
   * ```ts
   * await client.lists.delete("my-old-list");
   * ```
   */
  delete = (id: string): Promise<void> => this._call("delete", `/lists/${id}`);

  /**
   * Like a list.
   * OAuth Required
   * @param id The list ID (Trakt ID or slug)
   * @returns Promise resolving when list is liked
   * @example
   * ```ts
   * await client.lists.like("awesome-list");
   * ```
   */
  like = (id: string): Promise<void> => this._call("post", `/lists/${id}/like`);

  /**
   * Unlike a list.
   * OAuth Required
   * @param id The list ID (Trakt ID or slug)
   * @returns Promise resolving when list is unliked
   * @example
   * ```ts
   * await client.lists.unlike("awesome-list");
   * ```
   */
  unlike = (id: string): Promise<void> =>
    this._call("delete", `/lists/${id}/like`);
}
