import { Alert, Layout } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { AxiosError } from 'axios';
import React from 'react';
import { useQueries } from 'react-query';
import { listPullRequests } from './api';
import { LIST_PULL_REQUESTS } from './api/constants';
import { Auth, PullRequest } from './api/type';
import Preferences, { FormValues } from './components/Preferences';
import useNotification from './hooks/useNotification';
import { GLOBAL } from './store/constants';
import {
  addWarning,
  cleanWarnings,
  removeWarning,
  saveSettings,
} from './store/feature/globalSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getUrlRequest } from './utils/httpUtils';
import logo from '../public/assets/images/logo.png';

const today = new Date();

const App = () => {
  const notification = useNotification();
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

  const isValidUserOrTeam = preferences?.username || preferences?.teamname;
  const isValidRepository = preferences?.repositories;
  const repositories =
    isValidRepository && isValidUserOrTeam ? preferences.repositories : [];

  useQueries(
    repositories.map((repository) => {
      return {
        queryKey: [
          LIST_PULL_REQUESTS,
          preferences.username,
          preferences.teamname,
          preferences.organization,
          repository,
        ],
        queryFn: () =>
          listPullRequests(getOwner(), repository, getOrganization()),
        enabled: !!preferences,
        retry: false,
        refetchInterval: 0.5 * 60000,
        onError: (error: AxiosError) => {
          // TODO: Change error message when error is:
          // Resource protected by organization SAML enforcement. You must grant your Personal Access token access to this organization.
          dispatch(addWarning(getUrlRequest(error)));
        },
        onSuccess: (data: PullRequest[]) => {
          data.forEach((pullRequest) => {
            const requestedRevieres = pullRequest.requestedReviewers.filter(
              (reviewer) => reviewer.login === preferences.username,
            );

            const requestedTeams = pullRequest.requestedTeams.filter(
              (reviewer) => reviewer.name === preferences.teamname,
            );

            // Logic to trigger notification for pull request username review
            requestedRevieres.forEach((requested) => {
              // TODO: Customize notification when is an user pull request
              notification.triggerNotification(
                requested.id,
                pullRequest.htmlUrl,
              );
            });

            // Logic to trigger notification for pull request team review
            requestedTeams.forEach((requested) => {
              // TODO: Customize notification when is a team pull request
              notification.triggerNotification(
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

  React.useEffect(() => {
    if (preferences) {
      dispatch(cleanWarnings());
    }
  }, [preferences, dispatch]);

  return (
    <Layout css={{ background: '#fff' }}>
      <Header
        css={{ background: '#fff', height: '180px', textAlign: 'center' }}
      >
        <img
          css={{
            width: '150px',
            paddingTop: '30px',
            margin: '0px 20px 0px 20px',
          }}
          src={logo}
          alt="logo"
        />
      </Header>
      <Content css={{ padding: '0 50px', marginTop: 10 }}>
        <div css={{ padding: 24, minHeight: 380 }}>
          <Preferences
            initValues={{
              user: {
                username: preferences?.username,
                teamname: preferences?.teamname,
              },
              organization: {
                isOrganization: preferences?.organization !== undefined,
                token: preferences?.organization?.token,
                owner: preferences?.organization?.owner,
              },
              preferences: {
                repos: preferences?.repositories,
              },
            }}
            onSave={(values: FormValues) => {
              dispatch(
                saveSettings({
                  username: values.user.username,
                  teamname: values.user.teamname,
                  repositories: values.preferences.repos,
                  organization: values.organization.isOrganization
                    ? {
                        owner: values.organization.owner,
                        token: values.organization.token,
                      }
                    : undefined,
                }),
              );
            }}
          />
          {/*
            FIXME: TextLoop is not working (<Alert banner message={<TextLoop mask />} />)
            */}
          {warnings.map((msg) => {
            return (
              <>
                <Alert banner message={msg} />
                <br />
              </>
            );
          })}
        </div>
      </Content>
      <Footer css={{ textAlign: 'center', background: '#fff' }}>
        Designed by © Hi-PR! {today.getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;
