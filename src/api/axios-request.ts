import axios, { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';

const MOCK_SERVER = 'http://localhost:3100';
const BASE_URL_GITHUB = 'https://api.github.com';

const url =
  process.env.REACT_APP_MOCK_SERVER_ENABLED === 'TRUE'
    ? MOCK_SERVER
    : BASE_URL_GITHUB;

export const axiosInstance = axios.create({
  baseURL: url,
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
