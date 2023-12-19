import {DrawerForm, ModalFormProps, ProFormInstance, ProFormText,} from '@ant-design/pro-form';
import React, {useEffect, useRef} from 'react';
import {message} from "antd";
import {updateDictConfig} from "@/pages/System/api";

export type DictConfigEditFormProps = {
  dictConfig: API.DictConfigItem | undefined;
  onSuccess?: () => void;
} & ModalFormProps;

const DictConfigEditForm: React.FC<DictConfigEditFormProps> = ({
                                                                 dictConfig,
                                                                 onSuccess,
                                                                 ...restProps
                                                               }) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (dictConfig) {
      formRef.current?.setFieldsValue({
        ...dictConfig,
      });
    }
  }, [dictConfig]);

  return (
    <DrawerForm
      autoFocusFirstInput
      formRef={formRef}
      modalProps={{destroyOnClose: true}}
      width={520}
      title="修改字典配置"
      onFinish={async (values) => {
        const resp = await updateDictConfig(values);
        if (resp.code === 200) {
          message.success('修改成功');
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
      <ProFormText name="id" hidden/>
      <ProFormText
        label="字典KEY"
        name="dictKey"
        required
        formItemProps={{rules: [{required: true}]}}
      />
      <ProFormText
        label="标签"
        name="label"
        required
        formItemProps={{rules: [{required: true}]}}
      />
      <ProFormText
        label="标签值"
        name="value"
        required
        formItemProps={{rules: [{required: true}]}}
      />
    </DrawerForm>
  );
};

export default DictConfigEditForm;
