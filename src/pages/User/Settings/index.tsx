import React, {useEffect, useRef, useState} from 'react';
import ProForm, {ProFormInstance, ProFormText} from '@ant-design/pro-form';
import {Col, message, Modal, Row, Space} from 'antd';
import {useModel} from 'umi';
import ProCard from '@ant-design/pro-card';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import {personalSettings, sendSmsCode} from "@/services/User/api";
import {history} from "@@/core/history";
import {ProFormCaptcha, ProFormSelect} from "@ant-design/pro-components";
import {listDictConfig} from "@/services/common/api";
import {MailTwoTone} from "@ant-design/icons";

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
    listDictConfig("GENDER").then((response) => {
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

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

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
          label="ID"
          name="id"
          required
          formItemProps={{rules: [{required: true}]}}
          hidden={true}/>
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
        <ProFormText
          label="邮箱"
          name="email"
          required
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{maxLength: 30}}
        />
        <ProFormCaptcha
          label='验证码'
          formItemProps={{rules: [{required: true}]}}
          fieldProps={{
            size: 'large',
            prefix: <MailTwoTone/>,
          }}
          captchaProps={{
            size: 'large',
          }}
          // 手机号的 name，onGetCaptcha 会注入这个值
          phoneName="email"
          name="smsCode"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
          countDown={60}
          placeholder="请输入验证码"
          // 如果需要失败可以 throw 一个错误出来，onGetCaptcha 会自动停止
          // throw new Error("获取验证码错误")
          onGetCaptcha={async (email) => {
            const username = formRef.current?.getFieldValue("username");
            await waitTime(1000);
            await sendSmsCode({email, username}).then((response) => {
              if (response.code === 200) {
                message.success(`邮箱 ${email} 验证码发送成功!`);
                return;
              }
              throw new Error("验证码发送失败");
            })
          }}
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
