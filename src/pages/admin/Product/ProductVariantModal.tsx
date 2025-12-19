import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Divider,
  Flex,
  FormInstance,
  InputNumber,
  ModalProps,
  Space,
} from 'antd';
import {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { IProduct, IProductOption } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import Modal from '~/shared/components/Modal/Modal';
import Select from '~/shared/components/Select/Select';
import { useToast } from '~/shared/contexts/NotificationContext';
import { IProductVariantForm } from './ProductDetailsManagement';
import FormList from 'antd/es/form/FormList';

interface ProductVariantModalProps extends ModalProps {
  product: IProduct;
  productOptions: IProductOption[];
  form: FormInstance<IProductVariantForm>;
  setProductOptions: Dispatch<SetStateAction<IProductOption[]>>;
  onFinish: (values: any) => void;
}

const ProductVariantModal = ({
  form,
  open,
  product,
  productOptions,
  onFinish,
  setProductOptions,
  ...props
}: ProductVariantModalProps) => {
  const toast = useToast();
  const [newOption, setNewOption] = useState('');

  const handleFinish = (values: IProductVariantForm) => {
    const { price, stock, status, position, ...optionSelections } = values;

    const optionValues = Object.entries(optionSelections).map(
      ([optionId, valueId]) => ({
        optionId,
        isNew: false,
        optionValueId: valueId,
      })
    );

    const submitData = {
      productId: product.id,
      price,
      stock,
      status,
      position,
      optionValues,
    };
    onFinish(submitData);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewOption(value);
  };

  const handleAddItem = (optionId: string) => {
    if (!newOption || newOption.trim() === '') return;

    const isExistingValue = !!productOptions?.filter((option) =>
      option?.values?.some((val) => val.value === newOption)
    )?.length;

    if (isExistingValue) {
      toast.error(`Thuộc tính "${newOption}" đã tồn tại`);
      return;
    }

    const currentOption = productOptions?.find(({ id }) => id === optionId);

    if (!currentOption) return;

    const maxValuePosition = currentOption?.values?.reduce((max, item) => {
      return max < item?.position ? item?.position : max;
    }, 0);

    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const productOptionWithNewValue: IProductOption = {
      ...currentOption,
      values: [
        ...currentOption?.values,
        { id: tempId, position: maxValuePosition + 1, value: newOption },
      ],
    };

    const otherProductOptions = productOptions?.filter(
      (productOption) => productOption?.id !== currentOption?.id
    );

    setProductOptions([
      ...otherProductOptions,
      { ...productOptionWithNewValue },
    ]);
    setNewOption('');
  };

  return (
    <Modal
      centered
      width={550}
      open={open}
      title={
        <h2 className="capitalize text-primary text-lg">Thêm Mới Biến Thể</h2>
      }
      onOk={() => form.submit()}
      {...props}
    >
      <Form form={form} className="pt-4" onFinish={handleFinish}>
        <Space direction="vertical" size={24} className="w-full">
          <h3 className="font-semibold text-lg">Thông tin biến thể</h3>
          <FormItem spacing="none" name="price" label="Giá" className="w-full">
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
            spacing="none"
            name="stock"
            label="Số lượng tồn kho"
            className="w-full"
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

          <FormItem spacing="none" name="position" label="Vị trí">
            <InputNumber
              min={0}
              size="large"
              placeholder="0"
              className="w-full!"
            />
          </FormItem>

          <Space direction="vertical" size={24} className="w-full">
            <h4 className="font-semibold text-base m-0">Thuộc tính sản phẩm</h4>
            {productOptions?.map((option) => (
              <FormItem
                spacing="none"
                key={option?.id}
                name={option?.id}
                label={option?.name}
                style={{ order: `${option?.position}` }}
              >
                <Select
                  labelInValue
                  placeholder={
                    <span>
                      Chọn
                      <span className="lowercase"> {option?.name}</span>
                    </span>
                  }
                  options={option?.values?.map((value) => ({
                    label: value?.value,
                    value: value?.id,
                  }))}
                  popupRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Flex
                        align="center"
                        className="gap-x-2"
                        style={{ padding: '0 8px 4px' }}
                      >
                        <Input
                          value={newOption}
                          className="w-full"
                          onChange={handleNameChange}
                        />
                        <Button
                          title="Thêm mới"
                          iconBefore={<PlusOutlined />}
                          onClick={() => handleAddItem(option?.id)}
                        />
                      </Flex>
                    </>
                  )}
                />
              </FormItem>
            ))}
            {/* <FormList name="attributes">
              {(fields, { add, remove }) => (
                <Space size="middle" direction="vertical" className="w-full">
                  {fields.map(({ key, name, ...restField }) => {
                    const currentAttr = form.getFieldValue([
                      'attributes',
                      name,
                    ]);
                    const isExisting = !!currentAttr?.optionId;

                    console.log(currentAttr);

                    return (
                      <Flex align="end" className="gap-x-2">
                        <FormItem
                          {...restField}
                          spacing="none"
                          label="Tên thuộc tính"
                          name={[name, 'name']}
                          rules={[
                            { required: true, message: 'Nhập tên thuộc tính' },
                          ]}
                        >
                          <Input
                            disabled={isExisting}
                            placeholder="Tên (VD: Chất liệu)"
                          />
                        </FormItem>

                        <FormItem
                          {...restField}
                          spacing="none"
                          label="Giá trị"
                          name={[name, 'value']}
                          rules={[{ required: true, message: 'Nhập giá trị' }]}
                        >
                          {isExisting ? (
                            <Select
                              placeholder={
                                <span>
                                  Chọn{' '}
                                  <span className="lowercase">
                                    {currentAttr?.name}
                                  </span>
                                </span>
                              }
                              options={currentAttr?.values?.map(
                                (value: any) => ({
                                  label: value?.value,
                                  value: value?.id,
                                })
                              )}
                            />
                          ) : (
                            <Input placeholder="Nhập giá trị mới" />
                          )}
                        </FormItem>

                        <Button
                          displayType="outlined"
                          title={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Flex>
                    );
                  })}

                  <Button
                    displayType="primary"
                    iconBefore={<PlusOutlined />}
                    title="Thêm dòng thuộc tính mới"
                    onClick={() => add()}
                  />
                </Space>
              )}
            </FormList> */}
          </Space>
        </Space>
      </Form>
    </Modal>
  );
};

export default memo(ProductVariantModal);
