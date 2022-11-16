/** @jsxImportSource @emotion/react */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { WarningOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchGithubQueries } from 'src/hooks/useFetchGithub';
import { GITHUB_CONFIGURATIONS } from '../../store/constants';
import { switchEnabled } from '../../store/feature/githubSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface DataType {
  key: string;
  enabled: boolean;
  name: string;
}

const Main = () => {
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

  useFetchGithubQueries(configurations);

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
