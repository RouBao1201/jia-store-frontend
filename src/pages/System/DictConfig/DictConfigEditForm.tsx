import {ModalForm, ModalFormProps, ProFormInstance, ProFormList, ProFormText,} from '@ant-design/pro-form';
import React, {useEffect, useRef} from 'react';
import {CloseCircleOutlined} from "@ant-design/icons";
import {ProForm} from '@ant-design/pro-components';

export type DictConfigEditFormProps = {
  dictRecord: API.DictConfigItem | undefined;
  onSuccess?: () => void;
} & ModalFormProps;

const DictConfigEditForm: React.FC<DictConfigEditFormProps> = ({
                                                                 dictRecord,
                                                                 onSuccess,
                                                                 ...restProps
                                                               }) => {
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (dictRecord) {
      formRef.current?.setFieldsValue({
        ...dictRecord,
      });
    }
  }, [dictRecord]);

  return (
    <ModalForm
      modalProps={{destroyOnClose: true}}
      width={500}
      title="字典信息配置"
      onFinish={async (values) => {
        console.log("Song:" + JSON.stringify(values));
        // const idValue = formRef.current?.getFieldValue('id');
        // console.log(idValue);
        // const resp = (!idValue || idValue == 0)
        //   ? await createDictConfig(values)
        //   : await updateDictConfig(values);
        // if (resp.code === 200) {
        //   message.success('提交成功');
        //   if (onSuccess) {
        //     onSuccess();
        //   }
        //   formRef.current?.resetFields();
        //   return true;
        // }
        // return false;
        // onSuccess();
        return true;
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

export default DictConfigEditForm;
