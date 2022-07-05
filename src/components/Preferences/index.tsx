/** @jsxImportSource @emotion/react */
import { FolderOpenFilled, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import OrganizationPreferences from '../OrganizationPreferences';

const Preferences = () => {
  return (
    <div css={{ padding: 24, minHeight: 380 }}>
      <Tabs defaultActiveKey="2">
        <Tabs.TabPane
          tab={
            <span>
              <UserOutlined />
              Public
            </span>
          }
          key="1"
        >
          Under construction
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <FolderOpenFilled />
              Organization
            </span>
          }
          key="2"
        >
          <OrganizationPreferences />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Preferences;
