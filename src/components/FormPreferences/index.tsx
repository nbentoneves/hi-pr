import { Button, Form as FormAntd, Input, Select, Switch } from 'antd';
import { useState } from 'react';

export type FormValues = {
  user: {
    username?: string;
  };
  organization: {
    isOrganization: boolean;
    token?: string;
    owner?: string;
    teamname?: string;
  };
  preferences: {
    repositories?: string[];
  };
};

export type Props = {
  initValues: FormValues;
  onSave: (values: FormValues) => void;
};

const FormPreferences = ({ initValues, onSave }: Props) => {
  // TODO: Do not init useState using initValues, change another way
  const [isOrganization, setIsOrganization] = useState(
    initValues.organization.isOrganization,
  );

  // TODO: Fix the labelCol and wrapperCol from property
  return (
    <FormAntd
      labelCol={{
        xs: { span: 24 },
        sm: { span: 6 },
        lg: { span: 4 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        sm: { span: 16 },
        lg: { span: 18 },
      }}
      validateMessages={{
        // eslint-disable-next-line no-template-curly-in-string
        required: '${label} is required!',
      }}
      name="preferences"
      onFinish={onSave}
    >
      <FormAntd.Item
        name={['user', 'username']}
        label="Username"
        initialValue={initValues.user.username}
        rules={[{ required: true }]}
        required
      >
        <Input data-testid="username-input" />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'isOrganization']}
        label="Is organization"
        initialValue={initValues.organization.isOrganization}
        rules={[{ type: 'boolean' }]}
      >
        <Switch
          data-testid="isOrganization-switch"
          checked={isOrganization}
          onChange={setIsOrganization}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'token']}
        label="Token"
        initialValue={initValues.organization.token}
        required={isOrganization}
        rules={[{ required: isOrganization }]}
      >
        <Input.Password data-testid="token-input" disabled={!isOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'owner']}
        label="Owner"
        initialValue={initValues.organization.owner}
        required={isOrganization}
        rules={[{ required: isOrganization }]}
      >
        <Input data-testid="owner-input" disabled={!isOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'teamname']}
        label="Team"
        initialValue={initValues.organization.teamname}
      >
        <Input data-testid="teamname-input" disabled={!isOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['preferences', 'repositories']}
        label="Repositories"
        initialValue={initValues.preferences.repositories}
        required
        rules={[{ required: true }]}
      >
        <Select
          data-testid="repositories-select"
          mode="tags"
          tokenSeparators={[',']}
        />
      </FormAntd.Item>
      <FormAntd.Item
        wrapperCol={{
          xs: { offset: 18 },
          sm: { span: 16 },
          lg: { span: 18 },
        }}
      >
        <Button data-testid="on-save-button" type="primary" htmlType="submit">
          Save
        </Button>
      </FormAntd.Item>
    </FormAntd>
  );
};

export default FormPreferences;
