import React, {useEffect, useRef, useState} from 'react';
import {Space, theme, Transfer, Tree} from 'antd';
import type {TransferDirection, TransferItem} from 'antd/es/transfer';
import type {DataNode} from 'antd/es/tree';
import {ProFormInstance, QueryFilter} from "@ant-design/pro-form";
import {ProFormSelect} from "@ant-design/pro-components";
import ProCard from "@ant-design/pro-card";
import {listAllRole, listRolePermission} from "@/pages/System/api";

interface TreeTransferProps {
  dataSource: DataNode[];
  targetKeys: string[];
  onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
}


// Customize Table Transfer
const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) =>
  selectedKeys.includes(eventKey);

const generateTree = (treeNodes: DataNode[] = [], checkedKeys: string[] = []): DataNode[] =>
  treeNodes.map(({children, ...props}) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));


const treeData: DataNode[] = [
  {key: '0-0', title: '0-0'},
  {
    key: '0-1',
    title: '0-1',
    children: [
      {key: '0-1-0', title: '0-1-0'},
      {key: '0-1-1', title: '0-1-1'},
    ],
  },
  {key: '0-2', title: '0-2'},
  {key: '0-3', title: '0-3'},
  {key: '0-4', title: '0-4'},
];

const TreeTransfer: React.FC<TreeTransferProps> = ({
                                                     dataSource,
                                                     targetKeys,
                                                     ...restProps
                                                   }) => {
  const {token} = theme.useToken();
  const transferDataSource: TransferItem[] = [];

  function flatten(list: DataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }

  flatten(dataSource);

  return (
    <>
      <Transfer
        titles={['所有权限', '已有权限']}
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        render={(item) => item.title!}
        showSelectAll={false}
      >
        {({direction, onItemSelect, selectedKeys}) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            return (
              <div style={{padding: token.paddingXS}}>
                <Tree
                  blockNode
                  checkable
                  checkStrictly
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  treeData={generateTree(dataSource, targetKeys)}
                  onCheck={(_, {node: {key}}) => {
                    onItemSelect(key as string, !isChecked(checkedKeys, key));
                  }}
                  onSelect={(_, {node: {key}}) => {
                    onItemSelect(key as string, !isChecked(checkedKeys, key));
                  }}
                />
              </div>
            );
          }
        }}
      </Transfer>
    </>
  );
};


const RolePermissionForm: React.FC<unknown> = () => {
  const formRef = useRef<ProFormInstance>();
  const [roleList, setRoleList] = useState<any>([]);


  useEffect(() => {
    listAllRole().then((response) => {
      if (response.code === 200) {
        if (response.code === 200) {
          const valueTmpList: any[] = [];
          response.data.forEach((element: any) => {
            valueTmpList.push({label: element.name, value: element.id});
          });
          setRoleList(valueTmpList);
        }
      }
    });
  }, []);

  return (
    <QueryFilter defaultCollapsed split
                 layout="horizontal"
                 formRef={formRef}
                 onFinish={async (values: API.RolePermissionQueryItem) => {
                   await listRolePermission(values).then((response) => {
                     if (response.code === 200) {
                       console.log("角色权限：[" + values.id + "]" + JSON.stringify(response.data));
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
  );
}

const App: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const onChange = (keys: string[]) => {
    setTargetKeys(keys);
  };
  return (
    <>
      <Space direction="vertical" size="middle" style={{display: 'flex'}}>
        <ProCard>
          <RolePermissionForm/>
        </ProCard>
        <ProCard title='角色授权'>
          <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange}/>
        </ProCard>
      </Space>
    </>
  );
};

export default App;
