import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, FormInstance, InputNumber, ModalProps, Space } from 'antd';
import FormList from 'antd/es/form/FormList';
import { memo, useEffect } from 'react';

import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import Modal from '~/shared/components/Modal/Modal';
import Select from '~/shared/components/Select/Select';
import { IProductVariantCreateForm } from './ProductCreate';

interface ProductVariantCreateModalProps extends ModalProps {
  form: FormInstance<IProductVariantCreateForm>;
  onFinish: (values: IProductVariantCreateForm) => void;
}

const ProductVariantCreateModal = ({
  form,
  open,
  onFinish,
  ...props
}: ProductVariantCreateModalProps) => {
  useEffect(() => {
    form.setFieldsValue({
      attributes: [{ name: '', value: '' }],
    });
  }, [open]);

  return (
    <Modal
      centered
      width={650}
      open={open}
      title={
        <h2 className="capitalize text-primary text-lg">Thêm Mới Biến Thể</h2>
      }
      onOk={() => form.submit()}
      {...props}
    >
      <Form form={form} className="pt-4" onFinish={onFinish}>
        <Space direction="vertical" size={24} className="w-full">
          <h3 className="font-semibold text-lg">Thông tin biến thể</h3>
          <FormItem
            label="Giá"
            name="price"
            spacing="none"
            className="w-full"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              min={0}
              size="large"
              className="w-full!"
              placeholder="100,000"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </FormItem>

          <FormItem
            name="stock"
            spacing="none"
            className="w-full"
            label="Số lượng tồn kho"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng tồn kho' },
            ]}
          >
            <InputNumber
              min={0}
              size="large"
              className="w-full!"
              placeholder="100"
            />
          </FormItem>

          <FormItem
            name="status"
            spacing="none"
            label="Trạng thái"
            initialValue="active"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              size="large"
              placeholder="Chọn trạng thái"
              options={[
                {
                  label: 'Hoạt động',
                  value: 'active',
                },
                {
                  label: 'Tạm ngừng',
                  value: 'inactive',
                },
              ]}
            />
          </FormItem>

          <FormItem
            spacing="none"
            name="position"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
          >
            <InputNumber
              min={0}
              size="large"
              placeholder="0"
              className="w-full!"
            />
          </FormItem>

          <Flex vertical className="w-full gap-y-6">
            <h4 className="font-semibold text-base m-0">Thuộc tính sản phẩm</h4>
            <FormList name="attributes">
              {(fields, { add, remove }) => (
                <Space size="middle" direction="vertical" className="w-full">
                  {fields.map(({ key, name, ...restField }) => (
                    <Flex
                      align="end"
                      className="px-2! py-3! border border-dashed border-primary rounded-lg gap-x-2"
                    >
                      <FormItem
                        {...restField}
                        spacing="none"
                        label="Tên thuộc tính"
                        name={[name, 'name']}
                        rules={[
                          { required: true, message: 'Nhập tên thuộc tính' },
                        ]}
                      >
                        <Input placeholder="Tên (VD: Chất liệu)" />
                      </FormItem>

                      <FormItem
                        {...restField}
                        spacing="none"
                        label="Giá trị"
                        name={[name, 'value']}
                        rules={[{ required: true, message: 'Nhập giá trị' }]}
                      >
                        <Input placeholder="Nhập giá trị mới" />
                      </FormItem>

                      <Button
                        displayType="outlined"
                        title={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Flex>
                  ))}

                  <Button
                    displayType="primary"
                    iconBefore={<PlusOutlined />}
                    title="Thêm dòng thuộc tính mới"
                    onClick={() => add()}
                  />
                </Space>
              )}
            </FormList>
          </Flex>
        </Space>
      </Form>
    </Modal>
  );
};

export default memo(ProductVariantCreateModal);
