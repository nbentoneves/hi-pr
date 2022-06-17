import { getGithubPullRequests } from '.';
import { axiosInstance } from './axios-request';
import { mockAxios } from '../testing/test-axios-mock';
import { pullRequestGitHubMock } from './mock';

// Store the spy so that we can reset it
let axiosSpyStored: any;

// FIXME: This is not working
const setupMocks = () => {
  const mock = mockAxios();
  const spy = jest.spyOn(axiosInstance, 'request');
  axiosSpyStored = spy;
  return {
    mock,
    spy,
    getFirstCallToAxios: () => spy.mock.calls[0]?.[0] ?? {},
  };
};

describe('Github API request/reponse', () => {
  it('get a list of pull requests without authentication', async () => {
    const mock = mockAxios();

    mock.onGet('/repos/OWNER/REPO/pulls').replyOnce(200, pullRequestGitHubMock);

    const response = await getGithubPullRequests('OWNER', 'REPO');

    expect(response).toStrictEqual(pullRequestGitHubMock);
  });

  it('get a list of pull requests with authentication', async () => {
    const mock = mockAxios();

    const auth = {
      usename: 'myusername',
      token: 'github_token',
    };

    mock
      .onGet(
        '/repos/OWNER/REPO/pulls',
        undefined,
        expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
        }),
      )
      .replyOnce(200, pullRequestGitHubMock);

    const response = await getGithubPullRequests('OWNER', 'REPO', auth);

    expect(response).toStrictEqual(pullRequestGitHubMock);
  });
});
