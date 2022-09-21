/** @jsxImportSource @emotion/react */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { WarningOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { useQueries } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getGithubPullRequests } from '../../api';
import { Auth, PullRequest } from '../../api/type';
import { LIST_PULL_REQUESTS } from '../../hooks/constants';
import useReviewPullRequestNotification from '../../hooks/useReviewPullRequestNotification';
import { GITHUB_CONFIGURATIONS } from '../../store/constants';
import {
  addWarning,
  Configuration,
  removeWarning,
  switchEnabled,
} from '../../store/feature/githubSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getPartOfUrlRequest } from '../../utils/httpUtils';

interface DataType {
  key: string;
  enabled: boolean;
  name: string;
}

const Main = () => {
  const notification = useReviewPullRequestNotification();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const configurations = useAppSelector(
    (state) => state[GITHUB_CONFIGURATIONS].configurations,
  );
  const warnings = useAppSelector(
    (state) => state[GITHUB_CONFIGURATIONS].warnings,
  );

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (_, record) => (
        <Switch
          data-testid={`switch-config-${record.key}`}
          checked={record.enabled}
          onChange={() => {
            dispatch(switchEnabled(record.key));
          }}
        />
      ),
    },
    {
      title: 'Configuration',
      dataIndex: 'name',
      key: 'key',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link
            data-testid={`update-config-${record.key}`}
            to={`/configuration/${record.key}`}
          >
            Update
          </Link>
          <Link
            data-testid={`delete-config-${record.key}`}
            to={`/configuration/${record.key}/delete`}
          >
            Delete
          </Link>
        </Space>
      ),
    },
    {
      title: 'Warnings',
      key: 'warning',
      render: (index, record) => {
        const warning = warnings.find((warn) => warn.identifier === record.key);

        if (warning) {
          const message = (
            <div>Found problem for the following repositories:</div>
          );

          const repositories = warning.repositories.map((repository) => (
            <p key={index}>{repository}</p>
          ));

          const fullContent = (
            <div>
              {message} {repositories}
            </div>
          );

          return (
            <Popover content={fullContent} title="Warning">
              <WarningOutlined data-testid={`warning-config-${record.key}`} />
            </Popover>
          );
        }

        return null;
      },
    },
  ];

  const buildDataType = () => {
    const dataSouce: DataType[] = [];

    configurations.forEach((it) => {
      dataSouce.push({
        key: it.identifier,
        enabled: it.enabled,
        name: it.name,
      });
    });

    return dataSouce;
  };

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

  useQueries(
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

  return (
    <div css={{ marginBottom: '50px' }}>
      <Row css={{ marginBottom: '15px' }} justify="end">
        <Col css={{ paddingRight: '30px' }}>
          <Button
            data-testid="on-new-configuration"
            type="primary"
            onClick={() => navigate(`/configuration`)}
          >
            New configuration
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={buildDataType()}
            pagination={false}
          />
        </Col>
      </Row>
      {/** 
      <Row>
        <Col>
          {warnings.map((config) => {
            return (
              <>
                <Alert
                  banner
                  message={
                    <div data-testid={`alert-${config}`}>
                      Something is not right for <b>{config}</b> configuration.
                    </div>
                  }
                />
                <br />
              </>
            );
          })}
        </Col>
      </Row>
    */}
    </div>
  );
};
export default Main;
