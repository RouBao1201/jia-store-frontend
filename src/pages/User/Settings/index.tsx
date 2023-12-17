import React, {useEffect, useRef, useState} from 'react';
import ProForm, {ProFormInstance, ProFormText} from '@ant-design/pro-form';
import {Col, message, Modal, Row} from 'antd';
import {useModel} from 'umi';
import ProCard from '@ant-design/pro-card';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import {personalSettings} from "@/services/User/api";
import {history} from "@@/core/history";
import {ProFormSelect} from "@ant-design/pro-components";
import {getDictConfig} from "@/services/common/api";

const UserInfoSettingsForm: React.FC<API.UserInfo> = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<API.UserInfo>();
  const formRef = useRef<ProFormInstance>();
  const [genderList, setGenderList] = useState<any>([]);

  if (!userInfo) {
    setUserInfo(initialState?.currentUser?.userInfo);
  }

  useEffect(() => {
    if (initialState?.currentUser?.userInfo) {
      formRef.current?.setFieldsValue({
        ...initialState?.currentUser?.userInfo,
      });
    } else {
      formRef.current?.resetFields();
    }
  }, [userInfo]);

  useEffect(() => {
    getDictConfig("GENDER").then((response) => {
      if (response.code === 200) {
        const valueTmpList: any[] = [];
        response.data.forEach((element: any) => {
          valueTmpList.push({label: element.label, value: parseInt(element.value)});
        });
        setGenderList(valueTmpList);
      }
    })
  }, []);

  // 刷新用户信息
  const refreshCurrentUserInfo = async () => {
    const currentUser = await initialState?.fetchUserInfo?.();
    setUserInfo(currentUser?.userInfo)
    setInitialState({...initialState, currentUser});
  }

  return (
    <ProCard
      title={"个人信息"}
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
            title: "确定要修改个人信息吗？",
            maskClosable: true,
            onOk: () => {
              return new Promise<void>((resolve, reject) => {
                personalSettings({...values}).then((response) => {
                  if (response.code === 200) {
                    message.success("修改成功");
                    refreshCurrentUserInfo();
                    const urlParams = new URL(window.location.href).searchParams;
                    history.push(urlParams.get('redirect') || '/');
                    resolve();
                  } else {
                    message.error("删除失败");
                    reject();
                  }
                })
              })
            },
            onCancel: () => {
              Promise.reject();
            }
          });
        }}
      >
        <ProFormText
          readonly={true}
          label="用户名"
          name="username"
          required
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{maxLength: 30}}
        />
        <ProFormText
          label="昵称"
          name="nickname"
          required
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{maxLength: 30}}
        />
        <ProFormSelect
          label="性别"
          name="gender"
          required
          initialValue={1}
          formItemProps={{rules: [{required: true}]}}
          options={genderList}
          allowClear={false}
        />
        {/*<ProFormText.Password
          label="原密码"
          name="oldPassword"
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
        />*/}
      </ProForm>
    </ProCard>
  );
};

export default UserInfoSettingsForm;
