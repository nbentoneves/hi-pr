import { GITHUB_CONFIGURATIONS } from './constants';

describe('store constants tests', () => {
  it('check the constants value', () => {
    expect(GITHUB_CONFIGURATIONS).toBe('store:gitlabConfigurations');
  });
});
