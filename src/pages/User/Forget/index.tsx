import {Footer} from '@/components';
import {revise} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {FormattedMessage, Helmet, history, SelectLang, useIntl} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useState} from 'react';
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

const ReviseMessage: React.FC<{
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

const ForgetPassword: React.FC = () => {
  const [userReviseState, setUserReviseState] = useState<API.ReviseResult>({});
  const [type, setType] = useState<string>('account');
  const {styles} = useStyles();
  const intl = useIntl();

  const handleSubmit = async (values: API.ReviseParams) => {
    try {
      const {password, checkPassword} = values;
      if (password !== checkPassword) {
        setUserReviseState({status: "error", errorMsg: "两次输入的密码不一致"})
        return;
      }
      // 修改密码
      const resp = await revise({...values, type});
      if (resp.code === 200) {
        const defaultForgetSuccessMessage = intl.formatMessage({
          id: 'pages.revise.success',
          defaultMessage: '修改成功！',
        });
        message.success(defaultForgetSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        // 失败则设置响应数据
        setUserReviseState({status: (resp.data ? resp.data.status : "error"), errorMsg: resp.msg});
      }
    } catch (error) {
      const defaultForgetFailureMessage = intl.formatMessage({
        id: 'pages.revise.failure',
        defaultMessage: '修改失败，请重试！',
      });
      console.log(error);
      message.error(defaultForgetFailureMessage);
    }
  };
  const {status, errorMsg} = userReviseState;


  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          修改密码页
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
          submitter={{
            searchConfig: {
              submitText: "修改密码"
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="Ant Design"
          subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}
          actions={[]}
          onFinish={async (values) => {
            await handleSubmit(values as API.ReviseParams);
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
                  id: 'pages.revise.passwordRevise.tab',
                  defaultMessage: '账户密码修改',
                }),
              },
            ]}
          />

          {/*{(status === 'error' &&*/}
          {/*  <ReviseMessage*/}
          {/*    content={intl.formatMessage({*/}
          {/*      id: 'pages.revise.passwordRevise.errorMessage',*/}
          {/*      defaultMessage: errorMsg ? errorMsg : '账户或密码错误',*/}
          {/*    })}*/}
          {/*  />*/}
          {/*)}*/}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.revise.username.placeholder',
                  defaultMessage: '请输入用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.revise.username.required"
                        defaultMessage="账号不可为空!"
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
                  id: 'pages.revise.password.placeholder',
                  defaultMessage: '请输入密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.revise.password.required"
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
                  id: 'pages.revise.checkPassword.placeholder',
                  defaultMessage: '请再次输入密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.revise.checkPassword.required"
                        defaultMessage="请再次输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <a onClick={() => {
                history.push("/user/login");
              }}>
                <FormattedMessage id="pages.login.callbackLogin" defaultMessage="➥ 回到登录"/>
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

export default ForgetPassword;
