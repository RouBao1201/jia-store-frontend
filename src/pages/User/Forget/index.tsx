import {Footer} from '@/components';
import {revisePassword, sendSmsCode} from '@/services/ant-design-pro/api';
import {LockOutlined, MailTwoTone, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history, SelectLang, useIntl} from '@umijs/max';
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
  const [userReviseState, setUserReviseState] = useState<API.StatusResult>({});
  const [type, setType] = useState<string>('old_password');
  const {styles} = useStyles();
  const intl = useIntl();

  const handleSubmit = async (values: API.SmsReviseParams) => {
    try {
      const {newPassword, checkPassword} = values;
      if (newPassword !== checkPassword) {
        setUserReviseState({status: "error", errorMsg: "两次输入的密码不一致"})
        return;
      }
      // 修改密码
      const resp = await revisePassword({...values, type});
      if (resp.code === 200) {
        message.success("修改成功");
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        // 失败则设置响应数据
        setUserReviseState({status: (resp.data ? resp.data.status : "error"), errorMsg: resp.msg});
      }
    } catch (error) {
      console.log(error);
      message.error("修改失败，请重试！");
    }
  };
  const {status, errorMsg} = userReviseState;

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
            await handleSubmit(values as API.SmsReviseParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'old_password',
                label: "旧密码",
              },
              {
                key: 'sms_code',
                label: "验证码",
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
          {/*旧密码方式修改密码tab*/}
          {type === 'old_password' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={"请输入用户名"}
                rules={[
                  {
                    required: true,
                    message: "账号不可为空",
                  },
                ]}
              />
              <ProFormText.Password
                name="oldPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请输入旧密码"}
                rules={[
                  {
                    required: true,
                    message: "旧密码不可为空",
                  },
                ]}
              />
              <ProFormText.Password
                name="newPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请输入新密码"}
                rules={[
                  {
                    required: true,
                    message: "新密码不可为空",
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请再次输入新密码"}
                rules={[
                  {
                    required: true,
                    message: "请再次输入新密码",
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
          {/*短信方式修改密码tab*/}
          {type === 'sms_code' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={"请输入用户名"}
                rules={[
                  {
                    required: true,
                    message: "账号不可为空",
                  },
                ]}
              />
              <ProFormText.Password
                name="newPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请输入新密码"}
                rules={[
                  {
                    required: true,
                    message: "新密码不可为空",
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={"请再次输入新密码"}
                rules={[
                  {
                    required: true,
                    message: "请再次输入新密码",
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
                  await waitTime(1000);
                  await sendSmsCode({username}).then((response) => {
                    if (response.code === 200) {
                      message.success(`账户 ${username} 验证码发送成功!`);
                      return;
                    }
                    throw new Error("验证码发送失败");
                  })
                }}
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

export default ForgetPassword;
