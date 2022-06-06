import axios, { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';

export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  if (
    response.data &&
    response.headers['content-type'] === 'application/json; charset=utf-8'
  ) {
    // eslint-disable-next-line no-param-reassign
    response.data = camelizeKeys(response.data);
  }

  return response;
});
