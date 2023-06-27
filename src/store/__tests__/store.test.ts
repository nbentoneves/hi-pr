import { GITHUB_CONFIGURATIONS } from '../constants';
import { store } from '../store';

describe('store tests', () => {
  it('check initial github state store', () => {
    const myGithubStore = store.getState()[GITHUB_CONFIGURATIONS];

    expect(myGithubStore.configurations).toStrictEqual([]);
    expect(myGithubStore.pullRequestsAlreadyNotified).toStrictEqual([]);
    expect(myGithubStore.type).toStrictEqual('github');
    expect(myGithubStore.warnings).toStrictEqual([]);
  });
});
