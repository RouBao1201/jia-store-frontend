import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button, message, Modal, Space} from 'antd';
import {useRef, useState} from 'react';
import {deleteDictConfig, queryPageDictConfigList} from "@/pages/System/api";
import DictConfigEditForm from "@/pages/System/DictConfig/DictConfigEditForm";


export default () => {
  const actionRef = useRef<ActionType>();
  const [dictRecord, setDictRecord] = useState<API.DictConfigItem>();
  const [editingModalVisible, setEditingModalVisible] = useState(false);

  const columns: ProColumns<API.DictConfigItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: '字典KEY',
      dataIndex: 'dictKey',
    },
    {
      title: '字典标签',
      dataIndex: 'label',
    },
    {
      title: '字典值',
      dataIndex: 'value',
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
              setDictRecord(record);
              setEditingModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined/>}
            onClick={() => {
              Modal.confirm({
                title: '确定删除当前字典配置吗？',
                maskClosable: true,
                onOk() {
                  return new Promise<void>((resolve, reject) => {
                    deleteDictConfig(record.id).then((response) => {
                      if (response.code === 200) {
                        actionRef.current?.reload();
                        message.success('删除成功');
                        resolve();
                      } else {
                        reject();
                      }
                    })
                  });
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ],
    },
  ];

  return (
    <>
      <ProTable<API.DictConfigItem>
        headerTitle="字典配置"
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const resp = await queryPageDictConfigList(params);
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
              setDictRecord(undefined);
              setEditingModalVisible(true);
            }}
            type="primary"
          >
            新建字典配置
          </Button>,
        ]
        }
      />
      <DictConfigEditForm
        dictRecord={dictRecord}
        visible={editingModalVisible}
        onSuccess={() => {
          actionRef.current?.reload();
          setEditingModalVisible(false);
        }}
        drawerProps={{
          onClose: () => setEditingModalVisible(false),
        }}>
      </DictConfigEditForm>
    </>
  );
};
