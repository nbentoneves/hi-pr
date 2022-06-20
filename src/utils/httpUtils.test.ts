import { AxiosError } from 'axios';
import { getPartOfUrlRequest } from './httpUtils';

describe('http utils tests', () => {
  it('get url from AxiosError', async () => {
    const axiosError = {
      request: {
        responseURL: 'http://domain.com/owner/repo/pull/64',
      },
    } as AxiosError;
    const urlPart = getPartOfUrlRequest(axiosError, 4);

    expect(urlPart).toBe('repo');
  });

  it('throw exception when requesting an url part outside of the range', async () => {
    const axiosError = {
      request: {
        responseURL: 'http://domain.com/owner/repo/pull/64',
      },
    } as AxiosError;
    const urlPart = () => {
      getPartOfUrlRequest(axiosError, 10);
    };

    expect(urlPart).toThrowError(
      'Url does not have the expected part required',
    );
  });
});
