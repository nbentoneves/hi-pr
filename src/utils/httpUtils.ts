import { AxiosError } from 'axios';

export const getPartOfUrlRequest = (
  error: AxiosError,
  expectedPart: number,
): string | never => {
  const url = error.request.responseURL;
  const urlSplit = url.split('/');

  if (urlSplit.length <= expectedPart) {
    throw new Error('Url does not have the expected part required');
  }

  return urlSplit[expectedPart];
};
