/** @jsxImportSource @emotion/react */
import { Button, Col, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { GITHUB_CONFIGURATIONS } from '../../store/constants';
import {
  cleanWarning,
  editConfiguration,
  saveConfiguration,
} from '../../store/feature/githubSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfigurationForm, { FormValues } from './Form';

const Configuration = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const configurations = useAppSelector(
    (state) => state[GITHUB_CONFIGURATIONS].configurations,
  );

  const { identifier } = useParams();

  const configuration =
    configurations && configurations.find((it) => it.identifier === identifier);

  const handleOnSave = (values: FormValues) => {
    let organization;

    if (values.teamname && values.token) {
      organization = {
        teamname: values.teamname,
        token: values.token,
      };
    }

    dispatch(
      saveConfiguration({
        identifier: uuidv4(),
        name: values.name,
        enabled: values.isEnabled,
        username: values.username,
        owner: values.owner,
        organization,
        repositories: values.repositories,
      }),
    );
    navigate(`/`);
  };

  const handleOnEdit = (values: FormValues) => {
    if (identifier) {
      let organization;

      if (values.teamname && values.token) {
        organization = {
          teamname: values.teamname,
          token: values.token,
        };
      }

      dispatch(
        editConfiguration({
          identifier,
          name: values.name,
          enabled: values.isEnabled,
          username: values.username,
          owner: values.owner,
          organization,
          repositories: values.repositories,
        }),
      );
      dispatch(cleanWarning({ identifier }));
      navigate(`/`);
    }
  };

  return (
    <div>
      <Row justify="end">
        <Col css={{ paddingRight: '30px' }}>
          <Button
            data-testid="on-back"
            type="primary"
            onClick={() => navigate(`/`)}
          >
            Back
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {identifier && configuration ? (
            <ConfigurationForm
              onSave={handleOnEdit}
              initValues={{
                isEnabled: configuration.enabled,
                name: configuration.name,
                username: configuration.username,
                teamname: configuration.organization?.teamname || '',
                token: configuration.organization?.token || '',
                owner: configuration.owner,
                repositories: configuration.repositories,
              }}
            />
          ) : (
            <ConfigurationForm onSave={handleOnSave} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Configuration;
