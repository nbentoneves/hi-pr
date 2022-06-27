export const pullRequestGitHubMock = {
  url: 'https://github.com/owner/repo/pull/64',
  id: 100,
  htmlUrl: 'https://github.com/owner/repo/pull/64',
  requestedReviewers: [
    {
      login: 'user1',
      id: 100,
    },
    {
      login: 'user2',
      id: 101,
    },
  ],
  requestedTeams: [
    {
      login: 'team1',
      id: 200,
    },
    {
      login: 'team2',
      id: 201,
    },
  ],
};

export const pullRequestGitHubMockNotFound = {
  message: 'Not Found',
  documentation_url:
    'https://docs.github.com/rest/reference/pulls#list-pull-requests',
};
