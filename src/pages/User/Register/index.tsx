import {Footer} from '@/components';
import {register, sendSmsCode} from '@/services/User/api';
import {LockOutlined, MailOutlined, MailTwoTone, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {FormattedMessage, Helmet, history, SelectLang, useIntl} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useRef, useState} from 'react';
import {createStyles} from 'antd-style';
import {ProFormInstance} from "@ant-design/pro-form";

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Lang = () => {
  const {styles} = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang/>}
    </div>
  );
};

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

const Register: React.FC = () => {
  const [userRegisterState, setUserRegisterState] = useState<API.RegisterResult>({});
  const [type, setType] = useState<string>('account');
  const {styles} = useStyles();
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
    <div className={styles.container}>
      <Helmet>
        <title>
          注册页
          - {Settings.title}
        </title>
      </Helmet>
      <Lang/>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          formRef={formRef}
          submitter={{
            searchConfig: {
              submitText: "注册"
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo_bak.svg"/>}
          title="Ant Design"
          subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}
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
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;
