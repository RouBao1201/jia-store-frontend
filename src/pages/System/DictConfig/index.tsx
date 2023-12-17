import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button} from 'antd';
import {useRef} from 'react';
import {queryDictConfigList} from "@/pages/System/api";


const columns: ProColumns<API.DictConfigItem>[] = [
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
    width: 150,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.DictConfigItem>
      headerTitle="字典配置"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const resp = await queryDictConfigList(params);
        return {
          success: resp.code === 200,
          data: resp.data.list,
          total: resp.data.total,
        }
      }}
      rowKey="id"
      pagination={{
        pageSize: 10,
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined/>}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
      ]
      }
    />
  )
    ;
};
