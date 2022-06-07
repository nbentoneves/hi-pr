import { Button, Form as FormAntd, Input, Select, Switch } from 'antd';
import React from 'react';

export type FormValues = {
  user: {
    username?: string;
    teamname?: string;
  };
  organization: {
    isOrganization: boolean;
    token?: string;
    owner?: string;
  };
  preferences: {
    repos?: string[];
  };
};

export type Props = {
  initValues: FormValues;
  onSave: (values: FormValues) => void;
};

const Preferences: React.FC<Props> = ({ initValues, onSave }) => {
  // TODO: Do not init useState using initValues, change another way
  const [isOrganization, setIsOrganization] = React.useState(
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
        <Input />
      </FormAntd.Item>
      <FormAntd.Item
        name={['user', 'teamname']}
        label="Team"
        initialValue={initValues.user.teamname}
      >
        <Input />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'isOrganization']}
        label="Is organization"
        initialValue={initValues.organization.isOrganization}
        rules={[{ type: 'boolean' }]}
      >
        <Switch checked={isOrganization} onChange={setIsOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'token']}
        label="Token"
        initialValue={initValues.organization.token}
        required={isOrganization}
        rules={[{ required: isOrganization }]}
      >
        <Input.Password disabled={!isOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['organization', 'owner']}
        label="Owner"
        initialValue={initValues.organization.owner}
        required={isOrganization}
        rules={[{ required: isOrganization }]}
      >
        <Input disabled={!isOrganization} />
      </FormAntd.Item>
      <FormAntd.Item
        name={['preferences', 'repos']}
        label="Repositories"
        initialValue={initValues.preferences.repos}
        required
        rules={[{ required: true }]}
      >
        <Select mode="tags" tokenSeparators={[',']} />
      </FormAntd.Item>
      <FormAntd.Item
        wrapperCol={{
          xs: { offset: 18 },
          sm: { span: 16 },
          lg: { span: 18 },
        }}
      >
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </FormAntd.Item>
    </FormAntd>
  );
};

export default Preferences;
