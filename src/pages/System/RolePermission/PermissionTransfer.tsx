import React, {useEffect, useState} from 'react';
import {Tag, Transfer} from 'antd';
import type {TransferDirection} from 'antd/es/transfer';

interface TreeTransferProps {
  permissions: any[];
  rolePermissions: any[];
}

const PermissionTransferForm: React.FC<TreeTransferProps> = ({permissions, rolePermissions, ...restProps}) => {
  const [targetKeys, setTargetKeys] = useState(rolePermissions);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (rolePermissions) {
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
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    // console.log('sourceSelectedKeys:', sourceSelectedKeys);
    // console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };


  return (
    <Transfer
      className={"role-permissions-transfer"}
      {...restProps}
      style={{
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
