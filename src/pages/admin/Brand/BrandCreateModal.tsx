import { PlusOutlined } from '@ant-design/icons';
import {
  Flex,
  FormInstance,
  FormItemProps,
  ModalProps,
  Space,
  UploadProps,
} from 'antd';
import { ChangeEvent, memo, ReactNode } from 'react';

import { FacebookBrand, Global, InstagramBrand } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import Modal from '~/shared/components/Modal/Modal';
import { generateSlug } from '~/shared/utils/function';
import { IBrandCreateForm } from './BrandManagement';
import BrandUpload from './BrandUpload';

interface BrandCreateModalProps extends ModalProps {
  fileList: UploadProps['fileList'];
  form: FormInstance<IBrandCreateForm>;
  onFinish: (values: any) => void;
  onUploadChange: UploadProps['onChange'];
  onUploadRemove: UploadProps['onRemove'];
  onUploadPreview: UploadProps['onPreview'];
  onBeforeUpload: UploadProps['beforeUpload'];
}

interface BrandCreateFormProps {
  title: ReactNode;
  formItems: FormItemProps[];
}

const BrandCreateModal = ({
  form,
  loading,
  fileList,
  onCancel,
  onFinish,
  onUploadPreview,
  onUploadChange,
  onUploadRemove,
  onBeforeUpload,
  ...props
}: BrandCreateModalProps) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const slug = generateSlug(value);
    form.setFieldValue('slug', slug);
  };

  const brandCreateForm: BrandCreateFormProps[] = [
    {
      title: 'Thông tin cơ bản',
      formItems: [
        {
          name: 'name',
          label: 'Tên thương hiệu',
          children: (
            <Input
              placeholder="VD: Nike, Addidas,..."
              onChange={handleNameChange}
            />
          ),
          rules: [{ required: true, message: 'Vui lòng nhập tên thương hiệu' }],
        },
        {
          name: 'slug',
          label: 'Slug',
          children: <Input placeholder="VD: nike, adiddas..." />,
          extra: 'Tự động tạo từ tên thương hiệu',
          rules: [
            { required: true, message: 'Vui lòng nhập slug' },
            {
              pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Chỉ chấp nhận chữ thường, số và dấu gạch ngang (-).',
            },
          ],
        },
        {
          label: 'Mô tả',
          name: 'description',
          children: (
            <TextArea
              className="min-h-[150px]!"
              placeholder="Mô tả về thương hiệu..."
            />
          ),
        },
      ],
    },
    {
      title: 'Logo',
      formItems: [
        {
          name: 'logo',
          children: (
            <BrandUpload
              name="files"
              maxCount={1}
              fileList={fileList}
              listType="picture-card"
              hint="Hỗ trợ tệp tin: PNG, JPG, JPEG, WEBP"
              onPreview={onUploadPreview}
              onChange={onUploadChange}
              onRemove={onUploadRemove}
              beforeUpload={onBeforeUpload}
            />
          ),
        },
      ],
    },
    {
      title: 'Mạng xã hội',
      formItems: [
        {
          name: 'website',
          label: 'Website',
          children: (
            <Input
              placeholder="https://example.com"
              addonBefore={<Global className="stroke-[cornflowerblue]" />}
            />
          ),
        },
        {
          name: 'facebook',
          label: 'Facebook',
          children: (
            <Input
              placeholder="https://facebook.com/yourpage"
              addonBefore={<FacebookBrand />}
            />
          ),
        },
        {
          name: 'instagram',
          label: 'Instagram',
          children: (
            <Input
              placeholder="https://instagram.com/yourusername"
              addonBefore={<InstagramBrand />}
            />
          ),
        },
      ],
    },
  ];

  return (
    <>
      <Modal
        width={700}
        title={
          <h2 className="capitalize text-primary text-lg">
            Thêm mới thương hiệu
          </h2>
        }
        footer={
          <Flex align="center" justify="end" className="gap-x-2">
            <Button
              title="Hủy"
              loading={loading}
              displayType="outlined"
              onClick={onCancel}
            />
            <Button
              title="Tạo mới"
              loading={loading}
              iconBefore={<PlusOutlined />}
              onClick={() => form.submit()}
            />
          </Flex>
        }
        onCancel={onCancel}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Space direction="vertical" size="middle" className="w-full">
            {brandCreateForm.map(({ title, formItems }, index) => (
              <Space key={index} direction="vertical" className="w-full">
                <h3 className="font-semibold text-lg text-primary capitalize">
                  {title}
                </h3>
                <Flex vertical className="w-full">
                  {formItems?.map(({ children, ...props }, childIndex) => (
                    <FormItem
                      key={childIndex}
                      spacing={
                        childIndex === formItems?.length - 1
                          ? 'none'
                          : 'default'
                      }
                      {...props}
                    >
                      {children}
                    </FormItem>
                  ))}
                </Flex>
              </Space>
            ))}
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default memo(BrandCreateModal);
