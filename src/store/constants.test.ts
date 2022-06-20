import { GLOBAL } from './constants';

describe('store constants tests', () => {
  it('check the constants value', () => {
    expect(GLOBAL).toBe('store:global');
  });
});
