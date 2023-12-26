import {Link} from 'umi';
import {Button, Result} from 'antd';
import React from 'react';

export default () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle="抱歉，您没有权限访问该页面"
    extra={
      <Link to="/">
        <Button type="primary">回到主页</Button>
      </Link>
    }
  />
);
