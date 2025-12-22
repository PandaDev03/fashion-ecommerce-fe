import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Divider,
  Flex,
  FormInstance,
  InputNumber,
  ModalProps,
  Space,
} from 'antd';
import FormList from 'antd/es/form/FormList';
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

interface ProductVariantModalProps extends ModalProps {
  product: IProduct;
  isProductVariantEdit: boolean;
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
  isProductVariantEdit,
  onFinish,
  setProductOptions,
  ...props
}: ProductVariantModalProps) => {
  const toast = useToast();
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (!open) return;

    !isProductVariantEdit &&
      form.setFieldsValue({
        status: 'active',
        attributes: [{ name: '', value: '' }],
      });
  }, [open, isProductVariantEdit]);

  const handleFinish = (values: IProductVariantForm) => {
    const {
      price,
      stock,
      status,
      position,
      attributes,
      optionValues,
      ...optionSelections
    } = values;

    let finalOptionValues: IProductVariantForm['optionValues'] = [];

    if (attributes && attributes?.length > 0) {
      finalOptionValues = attributes?.map((attr) => ({
        isNew: true,
        isNewOption: true,
        optionName: attr?.name,
        value: attr?.value,
      }));
    } else {
      const selections = optionSelections as Record<
        string,
        { label: string; value: string }
      >;

      finalOptionValues = Object.entries(selections).map(
        ([optionId, value]) => {
          const isNew = value?.value?.startsWith('temp_');

          return {
            optionId,
            isNew,
            isNewOption: false,
            ...(isNew
              ? { value: value?.label }
              : { optionValueId: value?.value }),
          };
        }
      );
    }

    const submitData = {
      price,
      stock,
      status,
      position,
      productId: product.id,
      optionValues: finalOptionValues,
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
      width={650}
      open={open}
      title={
        <h2 className="capitalize text-primary text-lg">
          {isProductVariantEdit ? 'Cập nhật biến thể' : 'Thêm mới biến thể'}
        </h2>
      }
      onOk={() => form.submit()}
      {...props}
    >
      <Form form={form} className="pt-4" onFinish={handleFinish}>
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
            {productOptions && !!productOptions?.length ? (
              productOptions?.map((option) => (
                <FormItem
                  spacing="none"
                  key={option?.id}
                  name={option?.id}
                  label={option?.name}
                  style={{ order: `${option?.position}` }}
                  rules={[
                    { required: true, message: 'Vui lòng chọn thuộc tính' },
                  ]}
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
              ))
            ) : (
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
                          <Input
                            // disabled={isDisable}
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
                          <Input placeholder="Nhập giá trị mới" />
                        </FormItem>

                        <Button
                          // disabled={isDisable}
                          displayType="outlined"
                          title={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Flex>
                    ))}

                    <Button
                      // disabled={isDisable}
                      displayType="primary"
                      iconBefore={<PlusOutlined />}
                      title="Thêm dòng thuộc tính mới"
                      onClick={() => add()}
                    />
                  </Space>
                )}
              </FormList>
            )}
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
          </Flex>
        </Space>
      </Form>
    </Modal>
  );
};

export default memo(ProductVariantModal);
