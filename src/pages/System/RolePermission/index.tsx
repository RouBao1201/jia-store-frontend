import React, {useEffect, useRef, useState} from 'react';
import {Space} from 'antd';
import {ProFormInstance, QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-components";
import ProCard from "@ant-design/pro-card";
import {listAllPermissions, listAllRole, listRolePermissions} from "@/pages/System/api";
import PermissionTransferForm from "@/pages/System/RolePermission/PermissionTransfer";

const App: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [roleId, setRoleId] = useState<number>(-1);
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
          <QueryFilter layout="horizontal"
                       defaultCollapsed={true}
                       formRef={formRef}
                       onFinish={async (values) => {
                         setRoleId(values.id);
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
              placeholder="请选择角色"
              options={roleList}
            />
          </QueryFilter>
        </ProCard>
        <ProCard size={'default'} title='角色授权'>
          <PermissionTransferForm roleId={roleId} permissions={permissions} rolePermissions={rolePermissions}/>
        </ProCard>
      </Space>
    </>
  );
}

export default App;
