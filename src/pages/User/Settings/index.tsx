import React, {useRef, useState} from 'react';
import ProForm, {ProFormInstance, ProFormText} from '@ant-design/pro-form';
import {Col, message, Modal, Row} from 'antd';
import {useIntl, useModel} from 'umi';
import ProCard from '@ant-design/pro-card';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import {revise} from "@/services/ant-design-pro/api";
import {history} from "@@/core/history";

const UserInfoSettingsForm: React.FC<API.UserInfo> = () => {
  const {initialState} = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<API.UserInfo>();
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  if (!userInfo) {
    setUserInfo(initialState?.currentUser?.userInfo)
  }

  return (
    <ProCard
      title={intl.formatMessage({
        id: 'app.settings.menu.user-info',
        defaultMessage: '个人信息',
      })}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal"
        labelCol={{span: 3}}
        wrapperCol={{span: 6}}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
          render: (_props, doms) => (
            <Row>
              <Col md={{offset: 3}}>{doms[1]}</Col>
            </Row>
          ),
        }}
        onFinish={async (values) => {
          Modal.confirm({
            content: "确定要修改个人信息吗？",
            onOk: (args) => {
              console.log("Song-onOk");
              return;
            },
            onCancel: (args) => {
              console.log("Song-onCancel");
              return;
            }
          });
          const type = "old_password";
          const resp = await revise({...values, type});
          if (resp.code === 200) {
            const defaultReviseSuccessMessage = intl.formatMessage({
              id: 'pages.revise.success',
              defaultMessage: '修改成功！',
            });
            message.success(defaultReviseSuccessMessage);
            const urlParams = new URL(window.location.href).searchParams;
            history.push(urlParams.get('redirect') || '/');
          } else {
            const defaultRevisePwdFailureMessage = intl.formatMessage({
              id: 'pages.revise.failure',
              defaultMessage: '修改失败！',
            });
            message.error(defaultRevisePwdFailureMessage);
          }
        }}
      >
        <ProFormText
          label="昵称"
          name="nickname"
          initialValue={userInfo?.nickname}
          required
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{maxLength: 30}}
        />
        <ProFormText
          label="用户名"
          name="username"
          initialValue={userInfo?.username}
          required
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{maxLength: 30}}
        />
        <ProFormText.Password
          label="原密码"
          name="password"
          formItemProps={{
            rules: [{required: true}],
          }}
        />
        <ProFormText.Password
          label="新密码"
          name="newPassword"
          formItemProps={{
            rules: [
              {
                validator: (rule, value) => {
                  if (!value || value.length < 6) {
                    return Promise.reject(new Error('密码长度不能少于6位'));
                  }
                  return Promise.resolve();
                },
              },
            ],
          }}
        />
        <ProFormText.Password
          label="确认密码"
          name="checkPassword"
          formItemProps={{
            rules: [
              {
                validator: (rule, value) => {
                  const newPassword = formRef.current?.getFieldValue('newPassword');
                  if (!value) {
                    return Promise.reject(new Error('请再输入一次密码'));
                  }
                  if (value !== newPassword) {
                    return Promise.reject(new Error('两次密码输入不一致'));
                  }
                  return Promise.resolve();
                },
              },
            ],
          }}
        />
      </ProForm>
    </ProCard>
  );
};

export default UserInfoSettingsForm;
