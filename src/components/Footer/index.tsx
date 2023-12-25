import {RobotOutlined, VerifiedOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import React from 'react';
import {FloatButton} from "antd";
import {history, useModel} from '@umijs/max';

const Footer: React.FC = () => {

  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState || {};

  return (
    <>
      <DefaultFooter
        copyright="@2023 肉包体验技术中心出品"
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
      {
        currentUser?.superAdmin ?
          <FloatButton
            shape="circle"
            type="primary"
            style={{right: 24}}
            icon={<VerifiedOutlined/>}
            onClick={() => {
              history.push('/super-admin');
            }}
          />
          : ''
      }
    </>
  );
};

export default Footer;
