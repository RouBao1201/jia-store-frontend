import {ModalForm, ModalFormProps, ProFormInstance, ProFormList, ProFormText,} from '@ant-design/pro-form';
import React, {useRef} from 'react';
import {CloseCircleOutlined} from "@ant-design/icons";
import {ProForm} from '@ant-design/pro-components';
import {message} from "antd";
import {createDictConfig} from "@/pages/System/api";

export type DictConfigAddFormProps = {
  onSuccess?: () => void;
} & ModalFormProps;

const DictConfigAddForm: React.FC<DictConfigAddFormProps> = ({
                                                               onSuccess,
                                                               ...restProps
                                                             }) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <ModalForm
      modalProps={{destroyOnClose: true}}
      width={520}
      title="新增字典配置"
      onFinish={async (values) => {
        const resp = await createDictConfig(values)
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
        label="字典KEY"
        name="dictKey"
        required
        formItemProps={{rules: [{required: true}]}}
      />
      <ProFormList
        name="dictPair"
        creatorButtonProps={{
          position: 'bottom',
          creatorButtonText: "新增键值对"
        }}
        copyIconProps={false}
        deleteIconProps={{
          Icon: CloseCircleOutlined,
          tooltipText: '不需要这行了',
        }}
      >
        <ProForm.Group key="group" size={8}>
          <ProFormText name="label" label="标签" required formItemProps={{rules: [{required: true}]}}/>
          <ProFormText name="value" label="标签值" required formItemProps={{rules: [{required: true}]}}/>
        </ProForm.Group>
      </ProFormList>
    </ModalForm>
  );
};

export default DictConfigAddForm;
