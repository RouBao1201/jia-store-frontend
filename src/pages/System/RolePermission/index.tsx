import React, {useEffect, useRef, useState} from 'react';
import {Space} from 'antd';
import {ProFormInstance, QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-components";
import ProCard from "@ant-design/pro-card";
import {listAllPermissions, listAllRole, listRolePermissions} from "@/pages/System/api";
import PermissionTransferForm from "@/pages/System/RolePermission/PermissionTransfer";

const App: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [roleList, setRoleList] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>();
  const [rolePermissions, setRolePermissions] = useState<any>([]);

  useEffect(() => {
    listAllRole().then((response) => {
      if (response.code === "0000") {
        const valueTmpList: any[] = [];
        response.data.forEach((element: any) => {
          valueTmpList.push({label: element.name, value: element.id});
        });
        setRoleList(valueTmpList);
      }
    });
    listAllPermissions().then((response) => {
      if (response.code === "0000") {
        const valuesTemp = [];
        response.data.forEach(item => {
          valuesTemp.push({key: item.id, title: item.name, authKey: item.authKey});
        });
        setPermissions(valuesTemp);
      }
    })
  }, []);

  return (
    <>
      <Space direction="vertical" size="middle" style={{display: 'flex'}}>
        <ProCard size={'small'}>
          <QueryFilter defaultCollapsed split
                       layout="horizontal"
                       formRef={formRef}
                       onFinish={async (values: API.RolePermissionQueryItem) => {
                         await listRolePermissions(values).then((response) => {
                           if (response.code === "0000") {
                             const valuesTemp = [];
                             response.data.forEach(item => {
                               valuesTemp.push({key: item.id, title: item.name, authKey: item.authKey});
                             });
                             setRolePermissions(valuesTemp);
                           }
                         })
                       }}>
            <ProFormSelect
              label='角色名称'
              width="md"
              name="id"
              placeholder="请输入名称"
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              formItemProps={{rules: [{required: true}]}}
              options={roleList}
            />
          </QueryFilter>
        </ProCard>
        <ProCard size={'default'} title='角色授权' layout={'center'}>
          <PermissionTransferForm permissions={permissions} rolePermissions={rolePermissions}/>
        </ProCard>
      </Space>
    </>
  );
}

export default App;
