import axios, { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';

const MOCK_SERVER = 'http://localhost:3100';
const BASE_URL_GITHUB = 'https://api.github.com';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_MOCK_SERVER_ENABLED
    ? MOCK_SERVER
    : BASE_URL_GITHUB,
});

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  if (
    response.data
    // && response.headers['content-type'] === 'application/json; charset=utf-8'
  ) {
    // eslint-disable-next-line no-param-reassign
    response.data = camelizeKeys(response.data);
  }

  return response;
});
