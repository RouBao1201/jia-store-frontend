import {RobotOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Rou Bao King',
          title: 'Rou Bao King',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <RobotOutlined/>,
          href: 'https://www.baidu.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
