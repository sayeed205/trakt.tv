import type { Movie } from "./movies.ts";
import type { IDs, MediaType } from "./shared.ts";

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
  ids: Pick<IDs, "slug">;
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

export type UserSettings = {
  user: {
    username: string;
    private: boolean;
    name: string;
    description: string;
    email: string;
    facebook: string;
    twitter: string;
    google: string;
    tumblr: string;
    medium: string;
    website: string;
    location: string;
    about: string;
    gender: string;
    age: number;
    images: {
      avatar: {
        full: string;
      };
    };
    ids: UserIDs;
  };
  account: {
    timezone: string;
    date_format: string;
    time_24hr: boolean;
    cover_image: string;
    token: string;
  };
  connections: {
    facebook: boolean;
    twitter: boolean;
    google: boolean;
    tumblr: boolean;
    medium: boolean;
    slack: boolean;
  };
  sharing_text: {
    watching: string;
    watched: string;
    rated: string;
  };
};

export type UserProfile = {
  username: string;
  private: boolean;
  name: string;
  description: string;
  email: string;
  facebook: string;
  twitter: string;
  google: string;
  tumblr: string;
  medium: string;
  website: string;
  location: string;
  about: string;
  gender: string;
  age: number;
  images: {
    avatar: {
      full: string;
    };
  };
  ids: UserIDs;
};

export type FollowRequest = {
  id: number;
  requested_at: string;
  user: User;
};

export type HiddenItem = {
  hidden_at: string;
  type: "movie" | "show" | "season" | "episode";
  movie?: Movie;
  show?: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
  season?: {
    number: number;
    ids: {
      trakt: number;
      tvdb: number;
      tmdb: number;
    };
  };
  episode?: {
    season: number;
    number: number;
    title: string;
    ids: {
      trakt: number;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
};

export type Like = {
  liked_at: string;
  type: "comment" | "list";
  comment?: {
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
    user: CommentUser;
  };
  list?: {
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
    user: User;
  };
};
