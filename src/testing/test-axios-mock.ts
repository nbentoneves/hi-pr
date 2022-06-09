import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../api/axios-request';

export const mockAxios = () => {
  return new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });
};
