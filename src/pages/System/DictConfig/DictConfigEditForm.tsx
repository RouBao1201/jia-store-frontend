import {DrawerFormProps, ModalForm, ProFormInstance, ProFormText,} from '@ant-design/pro-form';
import {useEffect, useRef, useState} from 'react';
import {Button, Card, Form, Input, Space} from "antd";
import {CloseOutlined} from "@ant-design/icons";

export type DictConfigEditFormProps = {
  editModalVisit: boolean;
  dictRecord: API.DictConfigItem | undefined;
  onSuccess?: () => void;
} & DrawerFormProps;

const DictConfigEditForm: React.FC<DictConfigEditFormProps> = ({
                                                                 editModalVisit,
                                                                 dictRecord,
                                                                 onSuccess,
                                                               }) => {
  const formRef = useRef<ProFormInstance>();
  const [modalVisit, setModalVisit] = useState<boolean>(false);

  useEffect(() => {
    setModalVisit(editModalVisit);
    if (dictRecord) {
      formRef.current?.setFieldsValue({
        ...dictRecord,
      });
    }
  }, [dictRecord]);

  return (
    <ModalForm
      title="字典信息配置"
      open={modalVisit}
      onOpenChange={setModalVisit}
      onFinish={async (values) => {
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
    >
      <ProFormText name="id" initialValue="0" hidden/>
      {/*<ProFormText*/}
      {/*  label="字典KEY"*/}
      {/*  name="dictKey"*/}
      {/*  required*/}
      {/*  formItemProps={{rules: [{required: true}]}}*/}
      {/*/>*/}
      {/*<ProFormText
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
      />*/}
      <Form.List name="items">
        {(fields, {add, remove}) => (
          <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Item ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Form.Item label="Name" name={[field.name, 'name']}>
                  <Input/>
                </Form.Item>

                {/* Nest Form.List */}
                <Form.Item label="List">
                  <Form.List name={[field.name, 'list']}>
                    {(subFields, subOpt) => (
                      <div style={{display: 'flex', flexDirection: 'column', rowGap: 16}}>
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item noStyle name={[subField.name, 'first']}>
                              <Input placeholder="first"/>
                            </Form.Item>
                            <Form.Item noStyle name={[subField.name, 'second']}>
                              <Input placeholder="second"/>
                            </Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          + Add Sub Item
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Add Item
            </Button>
          </div>
        )}
      </Form.List>
    </ModalForm>
  );
};

export default DictConfigEditForm;
