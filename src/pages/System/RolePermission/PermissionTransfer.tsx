import React, {useEffect, useState} from 'react';
import {message, Tag, Transfer} from 'antd';
import type {TransferDirection} from 'antd/es/transfer';
import {changeRolePermissions} from "@/pages/System/api";

interface TreeTransferProps {
  roleId: number;
  permissions: any[];
  rolePermissions: any[];
}

const PermissionTransferForm: React.FC<TreeTransferProps> = ({roleId, permissions, rolePermissions, ...restProps}) => {
  const [targetKeys, setTargetKeys] = useState(rolePermissions);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [transferStatus, setTransferStatus] = useState<string>('');

  useEffect(() => {
    if (rolePermissions) {
      setTransferStatus('');
      setTargetKeys(rolePermissions.map((item) => item.key));
    }
  }, [rolePermissions]);

  const renderItem = (item) => {
    const customLabel = (
      <>
        <span className="custom-item">
        {item.title}&nbsp;&nbsp;
      </span>
        <Tag color={'green'}>{item.authKey}</Tag>
      </>
    );

    return {
      label: customLabel,
      value: item.title,
    };
  };

  const onChange = (nextTargetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    if (!roleId || roleId <= 0) {
      setTransferStatus('error');
      message.warning("请先查询出角色已有权限！");
      return;
    }
    const item: API.RolePermissionsChangedItem = {
      roleId: roleId,
      type: (direction === "right" ? 'SAVE' : 'REMOVE'),
      permissionIds: moveKeys
    };
    changeRolePermissions(item).then((response) => {
      if (response.code === "0000") {
        setTargetKeys(nextTargetKeys);
      } else {
        message.error("权限变更失败！");
      }
    })
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setTransferStatus('');
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };


  return (
    <Transfer
      status={transferStatus}
      className={"role-permissions-transfer"}
      {...restProps}
      listStyle={{
        height: '350px',
        width: '100%',
        maxHeight: '350px'
      }}
      dataSource={permissions}
      titles={['所有权限', '角色拥有权限']}
      operations={['授予权限', '移除权限']}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      showSelectAll={false}
      onChange={onChange}
      onSelectChange={onSelectChange}
      render={renderItem}
    />
  );
};

export default PermissionTransferForm;
