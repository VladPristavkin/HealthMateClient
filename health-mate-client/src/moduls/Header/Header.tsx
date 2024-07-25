import React from 'react';
import { Layout, Input, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, BellOutlined, SettingFilled } from '@ant-design/icons';
import './Header.css';

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent: React.FC = () => {
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Header className="header">
      <div className="header-left">
        <Search placeholder="Search for something ..." />
      </div>
      <div className="header-right">
        <Button type="text" icon={<BellOutlined />} />
        <Button type="text" icon={<SettingFilled />} />
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} className="user-dropdown-menu">
          <div className="user-info">
            <Avatar icon={<UserOutlined />} />
            <span className="username">Selena Watson</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
