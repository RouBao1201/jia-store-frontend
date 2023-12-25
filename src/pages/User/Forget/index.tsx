import {revisePassword, sendSmsCode} from '@/services/User/api';
import {LockOutlined, MailTwoTone, UserOutlined,} from '@ant-design/icons';
import {LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history, useIntl} from '@umijs/max';
import {message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useState} from 'react';

const ForgetPasswordPage = () => {
  const [userReviseState, setUserReviseState] = useState<API.StatusResult>({});
  const [type, setType] = useState<string>('old_password');
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
    <div style={{
      backgroundColor: 'white',
      height: '100vh',
    }}>
      <Helmet>
        <title>
          修改密码页
          - {Settings.title}
        </title>
      </Helmet>
      <LoginFormPage
        submitter={{
          searchConfig: {
            submitText: "修改密码"
          }
        }}
        logo={<img alt="logo" src="/logo.svg"/>}
        backgroundImageUrl='/pic/login-background.jpg'
        title="肉包仔"
        subTitle={"致力于打造全球最大最香的肉包供应商"}
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
              label: "密码修改（旧密码）",
            },
            {
              key: 'sms_code',
              label: "密码修改（验证码）",
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
      </LoginFormPage>
    </div>
  );
}


export default () => {
  return (
    <ProConfigProvider>
      <ForgetPasswordPage/>
    </ProConfigProvider>
  );
};
