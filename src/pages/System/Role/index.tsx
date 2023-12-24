import {EditOutlined, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button, message, Space, Switch} from 'antd';
import {useRef, useState} from 'react';
import {changeRoleStatus, listPageRole} from "@/pages/System/api";
import RoleConfigAddForm from "@/pages/System/Role/RoleConfigAddForm";
import {waitTimeFunc} from "@/services/common/api";


export default () => {
  const actionRef = useRef<ActionType>();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const columns: ProColumns<API.RoleItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      filters: true,
      onFilter: true,
      valueEnum: {
        1: {
          text: '启用'
        },
        0: {
          text: '停用'
        }
      },
      render: (text, record, num, action) => {
        return (
          <>
            {
              <Switch checkedChildren="启用" unCheckedChildren="停用"
                      loading={switchLoading}
                      disabled={record.id === 0} // 超级管理员不允许修改
                      defaultValue={record.status === 1}
                      onChange={async (checked, event) => {
                        setSwitchLoading(true);
                        await waitTimeFunc(1000);
                        await changeRoleStatus({id: record.id, status: (checked ? 1 : 0)})
                          .then((response) => {
                            if (response.code === 200) {
                              message.success(checked ? "启用成功" : "停用成功");
                            } else {
                              message.error(checked ? "启用失败" : "停用失败");
                            }
                          })
                          .finally(() => {
                            setSwitchLoading(false);
                          })
                      }}
              />
            }
          </>
        )
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 160,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (text, record, _, action) => [
        <Space>
          <Button
            size="small"
            icon={<EditOutlined/>}
            onClick={() => {
              // setDictConfig(record);
              // setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
        </Space>
      ],
    },
  ];

  return (
    <>
      <ProTable<API.RoleItem>
        headerTitle="角色管理"
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const resp = await listPageRole(params);
          return {
            success: resp.code === 200,
            data: resp.data.list,
            total: resp.data.total,
          }
        }}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined/>}
            onClick={() => {
              setAddModalVisible(true);
            }}
            type="primary"
          >
            新建角色
          </Button>,
        ]
        }
      />
      <RoleConfigAddForm
        onOpenChange={setAddModalVisible}
        open={addModalVisible}
        onSuccess={() => {
          actionRef.current?.reload();
          setAddModalVisible(false);
        }}>
      </RoleConfigAddForm>
    </>
  );
};
