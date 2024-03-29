import { AxiosError } from 'axios';
import { useQueries } from 'react-query';
import { getGithubPullRequests } from 'src/api';
import { Auth, PullRequest } from 'src/api/type';
import {
  Configuration,
  addWarning,
  cleanWarning,
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
  if (config.isOrganizationOwner && config.token) {
    return {
      usename: config.username,
      token: config.token,
    };
  }

  return undefined;
};

export const useFetchGithubQueries = (configurations: Configuration[]) => {
  const notification = useReviewPullRequestNotification();
  const dispatch = useAppDispatch();

  const onSuccess = (data: PullRequest[], config: Configuration) => {
    data.forEach((pullRequest) => {
      const requestedRevieres = pullRequest.requestedReviewers.filter(
        (reviewer) => reviewer.login === config.username,
      );

      // Logic to trigger notification for pull request username review
      requestedRevieres.forEach((requested) => {
        notification.triggerNotificationUsername(
          requested.id,
          pullRequest.htmlUrl,
        );
      });

      switch (config.type) {
        case 'TEAM': {
          pullRequest.requestedTeams
            .filter((reviewer) => reviewer.name === config.followBy)
            .forEach((requested) => {
              notification.triggerNotificationTeam(
                requested.id,
                pullRequest.htmlUrl,
              );
            });
          break;
        }
        case 'USER': {
          if (pullRequest.user.login === config.followBy) {
            notification.triggerNotificationFollowByUser(
              pullRequest.id,
              pullRequest.htmlUrl,
            );
          }
          break;
        }
        default: {
          console.log(`FollowBy 'NONE' selected for: ${pullRequest.id}`);
          break;
        }
      }
    });

    dispatch(
      cleanWarning({
        identifier: config.identifier,
      }),
    );
  };

  const onError = (error: AxiosError, config: Configuration) => {
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
  };

  return useQueries(
    configurations.map((config) => {
      return {
        queryKey: [LIST_PULL_REQUESTS, config.identifier],
        queryFn: () =>
          getGithubPullRequests(
            getOwner(config),
            // FIXME: Enable configuration for multiple repositories
            config.repository,
            getAuth(config),
          ),
        enabled: config.enabled,
        retry: false,
        refetchInterval: 10 * 1000,
        onError: (error: AxiosError) => onError(error, config),
        onSuccess: (data: PullRequest[]) => onSuccess(data, config),
      };
    }),
  );
};
