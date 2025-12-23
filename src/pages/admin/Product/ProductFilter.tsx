import { useMutation } from '@tanstack/react-query';
import { Divider, Dropdown, DropDownProps, Flex, FormInstance } from 'antd';
import { Dispatch, memo, SetStateAction, useEffect } from 'react';

import { FilterOutlined } from '~/assets/svg';
import { brandApi } from '~/features/brand/api/brandApi';
import { categoryApi } from '~/features/category/api/categoryApi';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import RangePicker from '~/shared/components/RangePicker/RangePicker';
import Select from '~/shared/components/Select/Select';
import { IFilterForm } from './ProductManagement';

interface ProductFilterProps extends DropDownProps {
  open: boolean;
  form: FormInstance<IFilterForm>;
  onCancel: () => void;
  onFinish: (values: any) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ProductFilter = ({
  open,
  form,
  onFinish,
  onCancel,
  setIsOpen,
  ...props
}: ProductFilterProps) => {
  const {
    data: categoryOptions,
    mutate: getCategoryOptions,
    isPending: isGetCategoryOptionPending,
  } = useMutation({
    mutationFn: () => categoryApi.getCategoryOptions(),
  });

  const {
    data: brandOptions,
    mutate: getBrandOptions,
    isPending: isGetBrandOptionPending,
  } = useMutation({
    mutationFn: () => brandApi.getBrandOptions(),
  });

  const filterDropdownRender: DropDownProps['popupRender'] = () => (
    <Form
      form={form}
      onFinish={onFinish}
      className="w-[280px] bg-white shadow-lg rounded-md border border-gray-200"
    >
      <Flex align="center" justify="space-between" className="py-1.5! px-4!">
        <p className="text-[16px] font-semibold text-primary capitalize">
          Bộ lọc
        </p>
        <Button
          displayType="text"
          title="Xóa tất cả"
          className="text-blue-400! hover:underline"
          onClick={() => form.resetFields()}
        />
      </Flex>
      <Divider className="my-1.5!" />
      <Flex vertical className="py-1.5! px-4!">
        <FormItem
          name="categoryId"
          label={
            <h2 className="uppercase font-semibold text-body mt-2">Danh mục</h2>
          }
        >
          <Select
            allowClear
            size="large"
            placeholder="Chọn danh mục"
            loading={isGetCategoryOptionPending}
            options={categoryOptions?.data?.map((category: any) => ({
              label: category?.name,
              value: category?.id,
            }))}
          />
        </FormItem>
        <FormItem
          name="brandId"
          label={
            <h2 className="uppercase font-semibold text-body mt-2">
              Thương hiệu
            </h2>
          }
        >
          <Select
            allowClear
            size="large"
            placeholder="Chọn thương hiệu"
            loading={isGetBrandOptionPending}
            options={brandOptions?.data?.map((brand: any) => ({
              label: brand?.name,
              value: brand?.id,
            }))}
          />
        </FormItem>
        <FormItem
          name="status"
          label={
            <h2 className="uppercase font-semibold text-body mt-2">
              Trạng thái
            </h2>
          }
        >
          <Select
            allowClear
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
          name="createdDate"
          label={
            <h2 className="uppercase font-semibold text-body mt-2">Ngày tạo</h2>
          }
        >
          <RangePicker />
        </FormItem>
      </Flex>
      <Divider className="my-1.5!" />
      <Flex align="center" justify="end" className="gap-x-3 py-3! px-4!">
        <Button title="Hủy" displayType="outlined" onClick={onCancel} />
        <Button title="Áp dụng" onClick={() => form.submit()} />
      </Flex>
    </Form>
  );

  useEffect(() => {
    getBrandOptions();
    getCategoryOptions();
  }, []);

  return (
    <Dropdown
      open={open}
      trigger={['click']}
      placement="bottomRight"
      popupRender={filterDropdownRender}
      onOpenChange={(open) => setIsOpen(open)}
      {...props}
    >
      <Button
        title="Lọc"
        displayType="outlined"
        iconBefore={<FilterOutlined />}
        onClick={() => setIsOpen(!open)}
      />
    </Dropdown>
  );
};

export default memo(ProductFilter);
