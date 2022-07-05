/** @jsxImportSource @emotion/react */
import { Alert } from 'antd';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useQueries } from 'react-query';
import { getGithubPullRequests } from '../../api';
import { Auth, PullRequest } from '../../api/type';
import { LIST_PULL_REQUESTS } from '../../hooks/constants';
// eslint-disable-next-line max-len
import useReviewPullRequestNotification from '../../hooks/useReviewPullRequestNotification';
import { ORGANIZATION_PREFERENCES } from '../../store/constants';
import {
  addWarning,
  cleanWarnings,
  removeWarning,
  savePreferences,
  setEnabled,
} from '../../store/feature/organizationPreferencesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getPartOfUrlRequest } from '../../utils/httpUtils';
import FormOrganizationPreferences, { FormValues } from './Form';

const OrganizationPreferences = () => {
  const notification = useReviewPullRequestNotification();
  const dispatch = useAppDispatch();
  const isEnabled = useAppSelector(
    (state) => state[ORGANIZATION_PREFERENCES].enabled,
  );
  const preferences = useAppSelector(
    (state) => state[ORGANIZATION_PREFERENCES].preferences,
  );
  const warnings = useAppSelector(
    (state) => state[ORGANIZATION_PREFERENCES].warnings,
  );

  const getOwner = () => {
    // Owner is an organization
    if (preferences && preferences.organization) {
      return preferences.organization.name;
    }

    return '';
  };

  const getAuth = (): Auth | undefined => {
    if (preferences && preferences.organization) {
      return {
        usename: preferences.organization.name,
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

  useQueries(
    repositories.map((repository) => {
      return {
        queryKey: [
          LIST_PULL_REQUESTS,
          preferences?.username,
          preferences?.organization,
          repository,
        ],
        queryFn: () => getGithubPullRequests(getOwner(), repository, getAuth()),
        enabled: !!preferences && isEnabled,
        retry: false,
        refetchInterval: 0.5 * 60000,
        onError: (error: AxiosError) => {
          /**
           * TODO: Change error message when error is:
           * Resource protected by organization SAML enforcement.
           * You must grant your Personal Access token access
           * to this organization.
           */
          if (error.response?.status === 404) {
            dispatch(addWarning(getPartOfUrlRequest(error, 5)));
          } else {
            throw new Error('Unexpected response from provider');
          }
        },
        onSuccess: (data: PullRequest[]) => {
          data.forEach((pullRequest) => {
            const requestedRevieres = pullRequest.requestedReviewers.filter(
              (reviewer) => reviewer.login === preferences?.username,
            );

            const requestedTeams = pullRequest.requestedTeams.filter(
              (reviewer) => reviewer.name === preferences?.teamname,
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
    <div>
      <FormOrganizationPreferences
        initValues={{
          isEnabled,
          username: preferences?.username,
          token:
            (isValidOrganization && preferences?.organization?.token) || '',
          organization:
            (isValidOrganization && preferences?.organization?.name) || '',
          teamname: preferences?.teamname,
          repositories:
            preferences !== undefined ? preferences.repositories : [],
        }}
        onSave={(values: FormValues) => {
          console.log('save values', values);
          dispatch(setEnabled(values.isEnabled));
          dispatch(
            savePreferences({
              username: values.username,
              teamname: values.teamname,
              organization: {
                name: values.organization,
                token: values.token,
              },
              repositories: values.repositories,
            }),
          );
        }}
      />
      {/**
       * TODO: TextLoop is not working
       * (<Alert banner message={<TextLoop mask />} />)
       */}
      {isEnabled &&
        warnings.map((repositoryName) => {
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

export default OrganizationPreferences;
