import { Buffer } from 'buffer';
import { axiosInstance } from './axios-request';
import { Auth, PullRequest } from './type';

export const getGithubPullRequests = (
  owner: string,
  repo: string,
  auth?: Auth | undefined,
): Promise<PullRequest[]> => {
  const config = {
    method: 'get',
    url: `/repos/${owner}/${repo}/pulls`,
  };

  if (auth) {
    const authConfig = {
      ...config,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${auth.usename}:${auth.token}`,
          'utf8',
        ).toString('base64')}`,
      },
    };

    return axiosInstance.request(authConfig).then((response) => response.data);
  }

  return axiosInstance.request(config).then((response) => response.data);
};
