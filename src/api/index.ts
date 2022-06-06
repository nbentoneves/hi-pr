import { Buffer } from 'buffer';
import { axiosInstance } from './axios-request';
import { Auth, PullRequest } from './type';

export const listPullRequests = (
  owner: string,
  repo: string,
  auth: Auth = undefined,
): Promise<PullRequest[]> => {
  const config = {
    method: 'get',
    url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
  };

  if (auth) {
    return axiosInstance({
      ...config,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${auth.usename}:${auth.token}`,
          'utf8',
        ).toString('base64')}`,
      },
    }).then((response) => response.data);
  }

  return axiosInstance(config).then((response) => response.data);
};
