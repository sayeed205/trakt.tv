import {Movie} from "./movies.ts";

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
