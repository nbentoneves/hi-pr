import { AxiosError } from 'axios';

export const getUrlRequest = (error: AxiosError): string | undefined => {
  if (error.request instanceof XMLHttpRequest) {
    const url = error.request.responseURL;
    const urlSplit = url.split('/');

    return urlSplit[5];
  }

  return undefined;
};
