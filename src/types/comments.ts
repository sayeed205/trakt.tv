export type CommentPostParams = {
  comment: string;
  spoiler?: boolean;
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
  list?: {
    ids: {
      trakt?: number;
    };
  };
};
