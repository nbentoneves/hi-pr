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

  return (
    <div>
      <FormAntd labelCol={{ span: 4 }} name="preferences" onFinish={onSave}>
        <FormAntd.Item
          name={['user', 'username']}
          label="Username"
          initialValue={initValues.user.username}
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
          rules={[{ type: 'boolean' }]}
          initialValue={initValues.organization.isOrganization}
        >
          <Switch checked={isOrganization} onChange={setIsOrganization} />
        </FormAntd.Item>
        <FormAntd.Item
          name={['organization', 'token']}
          label="Token"
          rules={[{ type: 'string' }]}
          initialValue={initValues.organization.token}
        >
          <Input.Password disabled={!isOrganization} />
        </FormAntd.Item>
        <FormAntd.Item
          name={['organization', 'owner']}
          label="Owner"
          rules={[{ type: 'string' }]}
          initialValue={initValues.organization.owner}
        >
          <Input disabled={!isOrganization} />
        </FormAntd.Item>
        <FormAntd.Item
          name={['preferences', 'repos']}
          label="Repositories"
          initialValue={initValues.preferences.repos}
        >
          <Select mode="tags" tokenSeparators={[',']} />
        </FormAntd.Item>
        <FormAntd.Item wrapperCol={{ offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </FormAntd.Item>
      </FormAntd>
    </div>
  );
};

export default Preferences;
