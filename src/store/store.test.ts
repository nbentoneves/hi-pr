import { ORGANIZATION_PREFERENCES } from './constants';
import { store } from './store';

describe('store tests', () => {
  it('check initial state store', () => {
    const myStore = store.getState()[ORGANIZATION_PREFERENCES];

    expect(myStore.preferences).toBeUndefined();
    expect(myStore.pullRequestsAlreadyNotified).toStrictEqual([]);
    expect(myStore.warnings).toStrictEqual([]);
  });
});
