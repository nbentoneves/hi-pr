export type Auth = {
  usename: string;
  token: string;
};

export type PullRequest = {
  url: string;
  id: number;
  htmlUrl: string;
  requestedReviewers: RequestedReviewers[];
  requestedTeams: RequestedTeams[];
};

export type RequestedReviewers = {
  login: string;
  id: number;
};

export type RequestedTeams = {
  name: string;
  id: number;
};
