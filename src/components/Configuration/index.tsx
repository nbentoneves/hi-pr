/** @jsxImportSource @emotion/react */
import { Button, Col, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GITHUB_CONFIGURATIONS } from '../../store/constants';
import {
  cleanWarning,
  editConfiguration,
  saveConfiguration,
} from '../../store/feature/githubSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfigurationForm, { FormValues } from './Form';
import { MappingConfigurationForm } from './Form/utils/mappingForm';

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
    const apiObject =
      MappingConfigurationForm.mappingFromValuesNewConfiguration(values);

    dispatch(saveConfiguration(apiObject));
    navigate(`/`);
  };

  const handleOnEdit = (values: FormValues) => {
    if (identifier) {
      const apiObject =
        MappingConfigurationForm.mappingFromValuesEditConfiguration(
          identifier,
          values,
        );

      dispatch(editConfiguration(apiObject));
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
              initValues={MappingConfigurationForm.domainToForm(configuration)}
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
