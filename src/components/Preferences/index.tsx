/** @jsxImportSource @emotion/react */
import { Alert } from 'antd';
import { AxiosError } from 'axios';
import _ from 'lodash';
import { useEffect } from 'react';
import { useQueries } from 'react-query';
import { getGithubPullRequests } from '../../api';
import { Auth, PullRequest } from '../../api/type';
import { LIST_PULL_REQUESTS } from '../../hooks/constants';
import useReviewPullRequestNotification from '../../hooks/useReviewPullRequestNotification';
import { GLOBAL } from '../../store/constants';
import {
  addWarning,
  cleanWarnings,
  removeWarning,
  savePreferences,
} from '../../store/feature/globalSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getPartOfUrlRequest } from '../../utils/httpUtils';
import FormPreferences, { FormValues } from '../FormPreferences';

const Preferences = () => {
  const notification = useReviewPullRequestNotification();
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state[GLOBAL].preferences);
  const warnings = useAppSelector((state) => state[GLOBAL].warnings);

  const getOwner = () => {
    // Owner is an organization
    if (preferences && preferences.organization) {
      return preferences.organization.owner;
    }

    // Owner is a username
    if (preferences && preferences.username) {
      return preferences.username;
    }

    return '';
  };

  const getOrganization = (): Auth | undefined => {
    if (preferences && preferences.organization) {
      return {
        usename: preferences.organization.owner,
        token: preferences.organization.token,
      };
    }

    return undefined;
  };

  const isValidUsername = preferences?.username;
  const isValidRepository = preferences?.repositories;
  const isValidOrganization = preferences?.organization;
  const repositories =
    isValidRepository && isValidUsername ? preferences.repositories : [];

  // TODO: Move this to a hook
  useQueries(
    repositories.map((repository) => {
      return {
        queryKey: [
          LIST_PULL_REQUESTS,
          preferences?.username,
          preferences?.organization,
          repository,
        ],
        queryFn: () =>
          getGithubPullRequests(getOwner(), repository, getOrganization()),
        enabled: !!preferences,
        retry: false,
        refetchInterval: 0.5 * 60000,
        onError: (error: AxiosError) => {
          // TODO: Change error message when error is:
          // Resource protected by organization SAML enforcement. You must grant your Personal Access token access to this organization.
          dispatch(addWarning(getPartOfUrlRequest(error, 5)));
        },
        onSuccess: (data: PullRequest[]) => {
          data.forEach((pullRequest) => {
            const requestedRevieres = pullRequest.requestedReviewers.filter(
              (reviewer) => reviewer.login === preferences?.username,
            );

            const requestedTeams = pullRequest.requestedTeams.filter(
              (reviewer) =>
                reviewer.name === preferences?.organization?.teamname,
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

          dispatch(removeWarning(repository));
        },
      };
    }),
  );

  useEffect(() => {
    if (preferences) {
      dispatch(cleanWarnings());
    }
  }, [preferences, dispatch]);

  return (
    <div css={{ padding: 24, minHeight: 380 }}>
      <FormPreferences
        initValues={{
          user: {
            username: preferences?.username,
          },
          organization: {
            isOrganization: !_.isUndefined(preferences?.organization),
            token:
              (isValidOrganization && preferences?.organization.token) || '',
            owner:
              (isValidOrganization && preferences?.organization?.owner) || '',
            teamname: preferences?.organization?.teamname,
          },
          preferences: {
            repositories:
              preferences !== undefined ? preferences.repositories : [],
          },
        }}
        onSave={(values: FormValues) => {
          dispatch(
            savePreferences({
              username: values.user.username,
              repositories: values.preferences.repositories,
              organization: values.organization.isOrganization
                ? {
                    owner: values.organization.owner,
                    token: values.organization.token,
                    teamname: values.organization.teamname,
                  }
                : undefined,
            }),
          );
        }}
      />
      {/*
        TODO: TextLoop is not working (<Alert banner message={<TextLoop mask />} />)
        */}
      {warnings.map((repositoryName) => {
        const testId = `alert-${repositoryName}`;

        return (
          <>
            <Alert
              banner
              message={
                <div data-testid={testId}>
                  Did you type the <b>{repositoryName}</b> repository name
                  right?
                </div>
              }
            />
            <br />
          </>
        );
      })}
    </div>
  );
};

export default Preferences;
