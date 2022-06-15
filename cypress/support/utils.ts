export const interceptGithubPullRequestNotFound = (
  owner: string,
  repository: string,
  prefixAlias?: string,
): unknown => {
  return cy
    .intercept('GET', `/repos/${owner}/${repository}/pulls`, {
      hostname: 'api.github.com',
      fixture: 'github/pull-requests-not-found.json',
      statusCode: 404,
    })
    .as(`${prefixAlias ? `${prefixAlias}-` : ''}github-pull-request-not-found`);
};

export const interceptGithubOnePullRequest = (
  owner: string,
  repository: string,
  prefixAlias?: string,
): unknown => {
  return cy
    .intercept('GET', `/repos/${owner}/${repository}/pulls`, {
      hostname: 'api.github.com',
      fixture: 'github/pull-requests-one-no-requested-reviewers.json',
    })
    .as(
      `${
        prefixAlias ? `${prefixAlias}-` : ''
      }github-one-pull-request-no-requested-reviewers`,
    );
};

export const interceptGithubOnePullRequestWithRequestedReviewers = (
  owner: string,
  repository: string,
  prefixAlias?: string,
): unknown => {
  return cy
    .intercept('GET', `/repos/${owner}/${repository}/pulls`, {
      hostname: 'api.github.com',
      fixture: 'github/pull-requests-one-with-requested-reviewers.json',
    })
    .as(
      `${
        prefixAlias ? `${prefixAlias}-` : ''
      }github-one-pull-request-with-requested-reviewers`,
    );
};
