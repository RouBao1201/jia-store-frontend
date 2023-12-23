import {ModalForm, ModalFormProps, ProFormInstance, ProFormText,} from '@ant-design/pro-form';
import React, {useEffect, useRef, useState} from 'react';
import {ProFormSelect} from '@ant-design/pro-components';
import {message} from "antd";
import {saveRole} from "@/pages/System/api";
import {listDictConfig} from "@/services/common/api";

export type RoleConfigAddFormProps = {
  onSuccess?: () => void;
} & ModalFormProps;

const RoleConfigAddForm: React.FC<RoleConfigAddFormProps> = ({
                                                               onSuccess,
                                                               ...restProps
                                                             }) => {
  const formRef = useRef<ProFormInstance>();
  const [statusList, setStatusList] = useState<any>([]);

  useEffect(() => {
    listDictConfig("STATUS").then((response) => {
      if (response.code === 200) {
        const valueTmpList: any[] = [];
        response.data.forEach((element: any) => {
          valueTmpList.push({label: element.label, value: parseInt(element.value)});
        });
        setStatusList(valueTmpList);
      }
    })
  }, []);

  return (
    <ModalForm
      modalProps={{destroyOnClose: true}}
      width={400}
      title="新增角色配置"
      onFinish={async (values) => {
        const resp = await saveRole(values)
        if (resp.code === 200) {
          message.success('新增成功');
          if (onSuccess) {
            onSuccess();
          }
          formRef.current?.resetFields();
          return true;
        }
        return false;
      }}
      {...restProps}
    >
      <ProFormText name="id" initialValue="0" hidden/>
      <ProFormText
        label="角色名称"
        name="name"
        required
        formItemProps={{rules: [{required: true}]}}
      />
      <ProFormSelect
        label="状态"
        name="status"
        required
        initialValue={0}
        formItemProps={{rules: [{required: true}]}}
        options={statusList}
        allowClear={false}
      />
    </ModalForm>
  );
};

export default RoleConfigAddForm;
