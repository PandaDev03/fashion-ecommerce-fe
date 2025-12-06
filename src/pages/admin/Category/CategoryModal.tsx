import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Flex, FormInstance, FormItemProps, ModalProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ChangeEvent, memo, useEffect } from 'react';

import { IParentCategory } from '~/features/category/types/category';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import Modal from '~/shared/components/Modal/Modal';
import Select from '~/shared/components/Select/Select';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import { ICategoryForm } from './CategoryManagement';

interface CategoryModalProps extends ModalProps {
  isEdit: boolean;
  form: FormInstance<ICategoryForm>;
  parentCategories: IParentCategory[];
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const CategoryModal = ({
  form,
  open,
  isEdit,
  loading,
  parentCategories,
  onFinish,
  onCancel,
  ...props
}: CategoryModalProps) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    form.setFieldValue('slug', slug);
  };

  const formItems: FormItemProps[] = [
    {
      name: 'name',
      label: 'Tên Danh mục',
      children: (
        <Input
          placeholder="VD: Giày dép, Thiết bị công nghệ,..."
          onChange={useDebounceCallback(handleNameChange, 300)}
        />
      ),
      rules: [{ required: true, message: 'Vui lòng nhập tên danh mục' }],
    },
    {
      name: 'slug',
      label: 'Slug',
      children: <Input placeholder="VD: giay-dep, thiet-bi-cong-nghe,..." />,
      extra: 'Tự động tạo từ tên. Được sử dụng trong URL',
      rules: [
        { required: true, message: 'Vui lòng nhập slug' },
        {
          pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          message: 'Chỉ chấp nhận chữ thường, số và dấu gạch ngang (-).',
        },
      ],
    },
    {
      name: 'description',
      label: 'Mô tả',
      children: (
        <TextArea className="h-25!" placeholder="Nhập mô tả (không bắt buộc)" />
      ),
    },
    {
      name: 'parentId',
      label: 'Danh mục cha',
      children: (
        <Select
          allowClear
          placeholder="Chọn danh mục cha (không bắt buộc)"
          options={parentCategories?.map((parentCategory) => ({
            value: parentCategory?.id,
            label: parentCategory?.name,
          }))}
        />
      ),
      extra: 'Để trống nếu đây là category gốc',
    },
    {
      name: 'position',
      label: 'Vị trí',
      children: <Input type="number" placeholder="0" />,
      extra: 'Dùng để sắp xếp thứ tự hiển thị (0 = đầu tiên)',
      rules: [{ required: true, message: 'Vui lòng nhập vị trí' }],
    },
  ];

  useEffect(() => {
    if (!open) return;

    const timerId = setTimeout(() => {
      form.focusField('name');
    }, 100);
    return () => clearTimeout(timerId);
  }, [open]);

  return (
    <Modal
      open={open}
      title={
        <h2 className="capitalize text-primary text-lg">
          {isEdit ? 'Chỉnh sửa Danh mục' : 'Thêm mới Danh mục'}
        </h2>
      }
      footer={
        <Flex align="center" justify="end" className="gap-x-3">
          <Button
            title="Hủy"
            loading={loading}
            displayType="outlined"
            onClick={onCancel}
          />
          <Button
            loading={loading}
            title={isEdit ? 'Lưu' : 'Tạo mới'}
            iconBefore={isEdit ? <SaveOutlined /> : <PlusOutlined />}
            onClick={() => form.submit()}
          />
        </Flex>
      }
      onCancel={onCancel}
      {...props}
    >
      <Form form={form} onFinish={onFinish}>
        {formItems.map(({ children, ...item }, index) => (
          <FormItem key={index} {...item}>
            {children}
          </FormItem>
        ))}
      </Form>
    </Modal>
  );
};

export default memo(CategoryModal);
