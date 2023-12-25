import {register, sendSmsCode} from '@/services/User/api';
import {LockOutlined, MailOutlined, MailTwoTone, UserOutlined} from '@ant-design/icons';
import {LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {FormattedMessage, Helmet, history, useIntl} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useRef, useState} from 'react';
import {ProFormInstance} from "@ant-design/pro-form";

const RegisterMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const RegisterPage = () => {
  const [userRegisterState, setUserRegisterState] = useState<API.RegisterResult>({});
  const [type, setType] = useState<string>('account');
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();

  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      const {password, checkPassword} = values;
      if (password !== checkPassword) {
        setUserRegisterState({status: "error", errorMsg: "两次输入的密码不一致"})
        return;
      }
      // 注册
      const resp = await register({...values, type});
      if (resp.code === 200) {
        const defaultRegisterSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultRegisterSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        // 失败则设置响应数据
        setUserRegisterState({status: (resp.data ? resp.data.status : "error"), errorMsg: resp.msg});
      }
    } catch (error) {
      const defaultRegisterFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: '注册失败，请重试！',
      });
      console.log(error);
      message.error(defaultRegisterFailureMessage);
    }
  };
  const {status, errorMsg} = userRegisterState;

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      height: '100vh',
    }}>
      <Helmet>
        <title>
          注册页
          - {Settings.title}
        </title>
      </Helmet>
      <LoginFormPage
        formRef={formRef}
        submitter={{
          searchConfig: {
            submitText: "注册"
          }
        }}
        backgroundImageUrl='/pic/login-background.jpg'
        logo={<img alt="logo" src="/logo.svg"/>}
        title="肉包仔"
        subTitle={"致力于打造全球最大最香的肉包供应商"}
        actions={[]}
        onFinish={async (values) => {
          await handleSubmit(values as API.RegisterParams);
        }}
      >
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
          items={[
            {
              key: 'account',
              label: intl.formatMessage({
                id: 'pages.register.accountRegister.tab',
                defaultMessage: '账户密码注册',
              }),
            },
          ]}
        />

        {(status === 'error' &&
          <RegisterMessage
            content={intl.formatMessage({
              id: 'pages.register.accountRegister.errorMessage',
              defaultMessage: errorMsg ? errorMsg : '账户或密码错误',
            })}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.username.placeholder',
                defaultMessage: '请输入用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.username.required"
                      defaultMessage="账号不可为空!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined/>,
              }}
              placeholder={"请输入邮箱"}
              rules={[
                {
                  required: true,
                  message: "邮箱为必填项！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone/>,
              }}
              captchaProps={{
                size: 'large',
              }}
              // 手机号的 name，onGetCaptcha 会注入这个值
              phoneName="username"
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
              onGetCaptcha={async (username) => {
                const email = formRef.current?.getFieldValue("email");
                await waitTime(1000);
                await sendSmsCode({username, email}).then((response) => {
                  if (response.code === 200) {
                    message.success(`账户 ${username} 验证码发送成功!`);
                    return;
                  }
                  throw new Error("验证码发送失败");
                })
              }}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.password.placeholder',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.required"
                      defaultMessage="密码不可为空!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="checkPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.checkPassword.placeholder',
                defaultMessage: '请再次输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.checkPassword.required"
                      defaultMessage="请再次输入密码！"
                    />
                  ),
                },
              ]}
            />
            <a onClick={() => {
              history.push("/user/login");
            }}>
              ➥ 回到登录
            </a>
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
        </div>
      </LoginFormPage>
    </div>
  );
}

export default () => {
  return (
    <ProConfigProvider>
      <RegisterPage/>
    </ProConfigProvider>
  )
};
