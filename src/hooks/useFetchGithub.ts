import { AxiosError } from 'axios';
import { useQueries } from 'react-query';
import { getGithubPullRequests } from 'src/api';
import { Auth, PullRequest } from 'src/api/type';
import {
  addWarning,
  Configuration,
  removeWarning,
} from 'src/store/feature/githubSlice';
import { useAppDispatch } from 'src/store/hooks';
import { getPartOfUrlRequest } from 'src/utils/httpUtils';
import { LIST_PULL_REQUESTS } from './constants';
import useReviewPullRequestNotification from './useReviewPullRequestNotification';

const getOwner = (config: Configuration) => {
  // FIXME: Enable configuration for non-organizations with multiple repositories
  return config.owner;
};

const getAuth = (config: Configuration): Auth | undefined => {
  if (config.organization) {
    return {
      usename: config.username,
      token: config.organization.token,
    };
  }

  return undefined;
};

const useFetchGithubQueries = (configurations: Configuration[]) => {
  const notification = useReviewPullRequestNotification();
  const dispatch = useAppDispatch();

  return useQueries(
    configurations.map((config) => {
      return {
        queryKey: [LIST_PULL_REQUESTS, config.identifier],
        queryFn: () =>
          getGithubPullRequests(
            getOwner(config),
            // FIXME: Enable configuration for multiple repositories
            config.repositories[0],
            getAuth(config),
          ),
        enabled: config.enabled,
        retry: false,
        refetchInterval: 10 * 1000,
        onError: (error: AxiosError) => {
          /**
           * TODO: Change error message when error is:
           * Resource protected by organization SAML enforcement.
           * You must grant your Personal Access token access
           * to this organization.
           */
          if (error.response?.status === 404) {
            dispatch(
              addWarning({
                identifier: config.identifier,
                repository: getPartOfUrlRequest(error, 5),
              }),
            );
          } else {
            throw new Error('Unexpected response from provider');
          }
        },
        onSuccess: (data: PullRequest[]) => {
          data.forEach((pullRequest) => {
            const requestedRevieres = pullRequest.requestedReviewers.filter(
              (reviewer) => reviewer.login === config.username,
            );

            const requestedTeams = pullRequest.requestedTeams.filter(
              (reviewer) => reviewer.name === config.organization?.teamname,
            );

            // Logic to trigger notification for pull request username review
            requestedRevieres.forEach((requested) => {
              notification.triggerNotificationUsername(
                requested.id,
                pullRequest.htmlUrl,
              );
            });

            // Logic to trigger notification for pull request team review
            requestedTeams.forEach((requested) => {
              notification.triggerNotificationTeam(
                requested.id,
                pullRequest.htmlUrl,
              );
            });
          });

          dispatch(
            removeWarning({
              identifier: config.identifier,
              repository: config.name,
            }),
          );
        },
      };
    }),
  );
};

export default useFetchGithubQueries;
