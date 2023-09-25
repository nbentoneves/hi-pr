import { Button, Form, Form as FormAntd, Input, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';

export type FormValues = {
  isEnabled: boolean;
  isOrganizationOwner: boolean;
  username: string;
  name: string;
  type: 'NONE' | 'TEAM' | 'USER';
  followBy?: string;
  token?: string;
  owner: string;
  repository: string;
};

export type Props = {
  initValues?: FormValues;
  onSave: (values: FormValues) => void;
};

const defaultFormValues: FormValues = {
  isEnabled: true,
  isOrganizationOwner: false,
  username: '',
  name: '',
  owner: '',
  type: 'NONE',
  repository: '',
};

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const ConfigurationForm = ({
  initValues = defaultFormValues,
  onSave,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const [isOrganizationOwner, setIsOrganizationOwner] = useState(false);
  const [followBy, setFollowBy] = useState<string | undefined>();

  const [isFollowByRequred, setIsFollowByRequired] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (initValues) {
      setIsEnabled(initValues.isEnabled);
      setIsOrganizationOwner(initValues.isOrganizationOwner);
      setFollowBy(capitalizeFirstLetter(initValues.type));

      if (initValues.type !== 'NONE') setIsFollowByRequired(true);
    }
  }, [initValues]);

  const onChangeType = (type: string) => {
    if (type !== 'NONE') {
      setIsFollowByRequired(true);
    } else {
      setIsFollowByRequired(false);
      form.setFieldsValue({
        followBy: undefined,
      });
    }
    setFollowBy(capitalizeFirstLetter(type));
  };

  // TODO: Fix the labelCol and wrapperCol from property
  return (
    <FormAntd
      form={form}
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
      name="configuraton"
      onFinish={onSave}
    >
      <FormAntd.Item
        name="isEnabled"
        label="Enabled"
        initialValue={initValues.isEnabled}
        rules={[{ type: 'boolean' }]}
      >
        <Switch
          data-testid="isEnable-switch"
          checked={isEnabled}
          onChange={(checked: boolean) => setIsEnabled(checked)}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name="isOrganizationOwner"
        label="Organization"
        initialValue={initValues.isOrganizationOwner}
        rules={[{ type: 'boolean' }]}
      >
        <Switch
          data-testid="isOrganizationOwner-switch"
          checked={isOrganizationOwner}
          onChange={(checked: boolean) => setIsOrganizationOwner(checked)}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name="token"
        label="Token"
        initialValue={initValues.token}
        required={isOrganizationOwner}
        rules={[{ required: isOrganizationOwner }]}
      >
        <Input.Password
          data-testid="token-input"
          disabled={!isEnabled || !isOrganizationOwner}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name="name"
        label="Configutation Name"
        initialValue={initValues.name}
        required={isEnabled}
        rules={[{ required: isEnabled }]}
      >
        <Input data-testid="name-input" disabled={!isEnabled} />
      </FormAntd.Item>
      <FormAntd.Item
        name="username"
        label="Username"
        initialValue={initValues.username}
        required={isEnabled}
        rules={[{ required: isEnabled }]}
      >
        <Input data-testid="username-input" disabled={!isEnabled} />
      </FormAntd.Item>
      <FormAntd.Item
        name="owner"
        label="Owner"
        initialValue={initValues.owner}
        required={isEnabled}
        rules={[{ required: isEnabled }]}
      >
        <Input data-testid="owner-input" disabled={!isEnabled} />
      </FormAntd.Item>
      <FormAntd.Item
        name="type"
        label="Follow by"
        initialValue={initValues.type}
      >
        <Select
          data-testid="type-select"
          disabled={!isEnabled}
          onChange={onChangeType}
          options={[
            {
              value: 'NONE',
              label: 'None',
            },
            {
              value: 'TEAM',
              label: 'Team',
            },
            {
              value: 'USER',
              label: 'User',
            },
          ]}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name="followBy"
        label={followBy}
        initialValue={initValues.followBy}
        required={isEnabled && isFollowByRequred}
        rules={[{ required: isEnabled && isFollowByRequred }]}
        style={{ visibility: isFollowByRequred ? 'visible' : 'hidden' }}
      >
        <Input data-testid="followBy-input" disabled={!isEnabled} />
      </FormAntd.Item>
      <FormAntd.Item
        name="repository"
        label="Repository"
        initialValue={initValues.repository}
        required={isEnabled}
        rules={[{ required: isEnabled }]}
      >
        <Input data-testid="repository-input" disabled={!isEnabled} />
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

export default ConfigurationForm;
