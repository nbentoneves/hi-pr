import { ORGANIZATION_PREFERENCES } from './constants';

describe('store constants tests', () => {
  it('check the constants value', () => {
    expect(ORGANIZATION_PREFERENCES).toBe('store:organizationPreferences');
  });
});
