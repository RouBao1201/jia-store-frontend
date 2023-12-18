import {DrawerForm, DrawerFormProps, ProFormInstance, ProFormText,} from '@ant-design/pro-form';
import {useEffect, useRef} from 'react';
import {createDictConfig, updateDictConfig} from "@/pages/System/api";
import {message} from "antd";

export type DictConfigEditFormProps = {
  dictRecord: API.DictConfigItem | undefined;
  onSuccess?: () => void;
} & DrawerFormProps;

const DictConfigEditForm: React.FC<DictConfigEditFormProps> = ({dictRecord, onSuccess, ...restProps}) => {
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (dictRecord) {
      formRef.current?.setFieldsValue({
        ...dictRecord,
      });
    }
  }, [dictRecord]);

  return (
    <DrawerForm
      title="字典信息配置"
      formRef={formRef}
      width={375}
      labelCol={{span: 6}}
      layout="horizontal"
      autoFocusFirstInput
      onFinish={async (values) => {
        const idValue = formRef.current?.getFieldValue('id');
        console.log(idValue);
        const resp = (!idValue || idValue == 0)
          ? await createDictConfig(values)
          : await updateDictConfig(values);
        if (resp.code === 200) {
          message.success('提交成功');
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
      <ProFormText
        label="字典标签"
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
