import {login} from '@/services/User/api';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginFormPage, ProConfigProvider, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {FormattedMessage, Helmet, history, SelectLang, useIntl, useModel} from '@umijs/max';
import {Alert, Divider, message, Space, Tabs, Typography} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import {createStyles} from 'antd-style';

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

const LoginMessage: React.FC<{
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

const LoginPage = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const resp = await login({...values, type});
      if (resp.code === "0000") {
        // 将token放入本地缓存中
        localStorage.setItem("accessToken", resp.data.token);
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // 如果失败去设置用户登录错误信息
      setUserLoginState({status: "error", errorMsg: resp.msg});
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType, errorMsg} = userLoginState;

  return (
    <div style={{
      backgroundColor: 'white',
      height: '100vh',
    }}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      {/*<Lang/>*/}
      <LoginFormPage
        backgroundImageUrl='/pic/login-background.jpg'
        logo={<img alt="logo" src="/logo.svg"/>}
        title="肉包仔"
        subTitle={"致力于打造全球最大最香的肉包供应商"}
        initialValues={{
          autoLogin: true,
        }}
        actions={[]}
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
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
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              }),
            },
          ]}
        />

        {status === 'error' && (
          <LoginMessage
            content={intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
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
                id: 'pages.login.username.placeholder',
                defaultMessage: '请输入用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="用户名是必填项！"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined/>,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '请输入密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="密码是必填项！"
                    />
                  ),
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <Space size={20} split={<Divider type="vertical"/>}>
            <Typography.Link>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
              </ProFormCheckbox>
            </Typography.Link>
            <Typography.Link>
              <a onClick={() => {
                history.push("/user/register");
              }}>
                <FormattedMessage id="pages.login.registerAccount" defaultMessage="注册账户"/>
              </a>
            </Typography.Link>
            <Typography.Link>
              <a
                onClick={() => {
                  history.push("/user/forget");
                }}
                style={{
                  float: 'right',
                }}
              >
                {/*<FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>*/}
                修改密码？
              </a>
            </Typography.Link>
          </Space>
        </div>
      </LoginFormPage>
      {/*<Footer/>*/}
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider>
      <LoginPage/>
    </ProConfigProvider>
  )
};
