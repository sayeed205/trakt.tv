import type { Movie } from "./movies.ts";
import type { MediaType } from "./index.ts";

export type User = {
  username: string;
  private: boolean;
  deleted: boolean;
  ids: UserIDs;
};

export type UserIDs = {
  slug: string;
};

export type UserCollection = {
  collected_at: string;
  updated_at: string;
  movie: Movie;
};

export type CommentUser = {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: UserIDs;
};

export type UserComment = {
  type: MediaType;
  movie: Movie;
  user: CommentUser;
  comment: {
    id: number;
    comment: string;
    spoiler: boolean;
    review: boolean;
    parent_id: number;
    created_at: string;
    updated_at: string;
    replies: number;
    likes: number;
    user_stats: {
      rating: number;
      play_count: number;
      completed_count: number;
    };
  };
};

export type UserLists = {
  "name": "Star Wars in machete order";
  "description":
    "Next time you want to introduce someone to Star Wars for the first time, watch the films with them in this order: IV, V, II, III, VI.";
  "privacy": "public";
  "share_link": "https://trakt.tv/lists/55";
  "type": "personal";
  "display_numbers": true;
  "allow_comments": true;
  "sort_by": "rank";
  "sort_how": "asc";
  "created_at": "2014-10-11T17:00:54.000Z";
  "updated_at": "2014-10-11T17:00:54.000Z";
  "item_count": 5;
  "comment_count": 0;
  "likes": 0;
  "ids": {
    "trakt": 55;
    "slug": "star-wars-in-machete-order";
  };
};
