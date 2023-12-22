import { InsuranceOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang, history } from '@umijs/max';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://baidu.com');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

// 超级管理员标签
export const SuperAdmin = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        history.push('/super-admin');
      }}
    >
      <InsuranceOutlined />
    </div>
  );
};
