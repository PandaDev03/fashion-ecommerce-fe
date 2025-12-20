import { CloseOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Flex,
  InputNumber,
  Layout,
  Space,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import { Content } from '~/shared/components/Layout/Layout';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import Select from '~/shared/components/Select/Select';
import Table from '~/shared/components/Table/Table';
import Dragger, { FileType } from '~/shared/components/Upload/Dragger';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import { generateSlug, getBase64 } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import ProductVariantCreateModal from './ProductVariantCreateModal';
import Image from '~/shared/components/Image/Image';

export interface ICreateForm {
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  categoryId: string;
  brandId: string;
  description: string;
  images: string[];
  productVariant: any[];
}

export interface IProductVariantCreateForm {
  price: number;
  stock: number;
  status: string;
  position: number;
  attributes: {
    name: string;
    value: string;
  }[];
}

interface IDataSource {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  position: number;
  //   optionValues: any[];
}

export interface IProductVariantOption {
  name: string;
  value: string;
}

const initialProductVariantOptions: IProductVariantOption[] = [
  {
    name: '',
    value: '',
  },
];

const ProductCreate = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [productCreateForm] = useForm<ICreateForm>();
  const [productVariantForm] = useForm<IProductVariantCreateForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const productVariantOptionRef = useRef(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);

  const [previewImage, setPreviewImage] = useState('');

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);

  const [productVariantOptions, setProductVariantOptions] = useState<
    IProductVariantOption[]
  >(initialProductVariantOptions);

  useEffect(() => {
    setTitle('Thêm mới sản phẩm');
    setBreadcrumb([
      {
        key: 'home',
        title: 'Sản phẩm',
        href: PATH.ADMIN_PRODUCT_MANAGEMENT,
      },
      {
        key: 'product-create',
        title: 'Thêm mới sản phẩm',
      },
    ]);

    productVariantForm.setFieldsValue({
      attributes: [{ name: '', value: '' }],
    });
  }, []);

  const columns: ColumnType<IDataSource>[] = [
    {
      key: '1',
      width: 50,
      title: 'STT',
      align: 'center',
      render: (_, __, index: number) => index + 1,
    },
    {
      key: '2',
      title: 'Biến thể',
      dataIndex: 'name',
    },
    {
      key: '3',
      align: 'right',
      title: 'Giá',
      dataIndex: 'price',
      render: (price) => (
        <span>
          {price?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          })}
        </span>
      ),
    },
    {
      key: '4',
      align: 'right',
      title: 'Tồn kho',
      dataIndex: 'stock',
      render: (stock) => (
        <Tag color={stock === 0 ? 'red' : stock <= 10 ? 'yellow' : 'green'}>
          {stock}
        </Tag>
      ),
    },
    {
      key: '5',
      title: 'Vị trí',
      align: 'center',
      dataIndex: 'position',
    },
    {
      key: '6',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm ngừng'}
        </Tag>
      ),
    },
    {
      width: 100,
      fixed: 'right',
      align: 'center',
      title: 'Thao tác',
      render: (_, record) => (
        <Flex align="center" justify="center">
          <PopConfirm
            title="Xoá mục này"
            placement="topLeft"
            onConfirm={() => handleDeleteProductVariant(record?.id)}
          >
            <Button
              displayType="text"
              title={<CloseOutlined className="[&>svg]:fill-red-500" />}
            />
          </PopConfirm>
        </Flex>
      ),
    },
  ];

  const handleChangeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const slug = generateSlug(value);
    productCreateForm.setFieldValue('slug', slug);
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    const { fileList: newFileList } = info;

    if (info.file.status === 'removed') {
      setFileList(newFileList);
      return;
    }

    setFileList((prevList) => {
      const uniqueNewFiles = newFileList.filter(
        (newFile) => !prevList.some((oldFile) => oldFile.uid === newFile.uid)
      );

      return [...prevList, ...uniqueNewFiles];
    });
  };

  const handleBeforeUpload = (file: FileType) => {
    const isValidFormat = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/webp',
    ].includes(file.type);

    if (!isValidFormat) {
      toast.error('Tệp tin không hợp lệ!');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleUploadPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType);

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleCancelProductVariant = () => {
    // productVariantForm.setFieldsValue({
    //   price: undefined,
    //   stock: undefined,
    //   position: undefined,
    //   status: 'active',
    //   attributes: productVariantOptions,
    // });
    productVariantForm.setFields([
      { name: 'price', value: undefined, errors: [] },
      { name: 'stock', value: undefined, errors: [] },
      { name: 'position', value: undefined, errors: [] },
      { name: 'status', value: 'active', errors: [] },
      { name: 'attributes', value: productVariantOptions, errors: [] },
      // { name: 'name', value: productVariantOptions, errors: [] },
      // { name: 'value', value: productVariantOptions, errors: [] },
    ]);

    setIsVariantModalVisible(false);
  };

  const handleDeleteProductVariant = (id: string) => {
    const newDataSource: IDataSource[] = dataSource?.filter(
      (data) => data?.id !== id
    );

    setDataSource(newDataSource);
    !newDataSource?.length &&
      setProductVariantOptions(initialProductVariantOptions);
  };

  console.log('productVariantOptions', productVariantOptions);

  const handleFinishProductVariant = (values: IProductVariantCreateForm) => {
    console.log(values);
    const { attributes } = values;

    if (!productVariantOptionRef.current) {
      const options: IProductVariantOption[] = attributes?.map((attribute) => ({
        name: attribute?.name,
        value: '',
      }));

      console.log('options', options);

      setProductVariantOptions(options);
      productVariantOptionRef.current = true;
    }

    const newDataSource: IDataSource = {
      ...values,
      id: `new-${Date.now()}-${Math.random()}`,
      name: attributes?.map((attribute) => attribute?.value).join(' - '),
    };

    setDataSource((prev) => [...prev, { ...newDataSource }]);
    handleCancelProductVariant();
    // setIsVariantModalVisible(false);
  };

  const handleFinishCreate = (values: ICreateForm) => {
    console.log(values);
  };

  return (
    <Layout>
      <Space size="middle" direction="vertical" className="w-full">
        <Flex align="center" justify="end" className="gap-x-4">
          <Button
            title="Hủy"
            displayType="outlined"
            onClick={() => navigate(PATH.ADMIN_PRODUCT_MANAGEMENT)}
          />
          <Button
            title="Lưu"
            iconBefore={<SaveOutlined />}
            onClick={() => productCreateForm.submit()}
          />
        </Flex>
        <Form form={productCreateForm} onFinish={handleFinishCreate}>
          <Space size="middle" direction="vertical" className="w-full">
            <Content className="bg-white! border border-gray-200 rounded-lg overflow-hidden">
              <h2 className="font-semibold text-xl text-primary mb-3">
                Thông tin sản phẩm
              </h2>
              <div className="grid grid-cols-2 gap-x-5">
                <Space direction="vertical" className="col-span-1">
                  <FormItem
                    spacing="none"
                    name="name"
                    label="Tên sản phẩm"
                    // rules={[
                    //   { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                    // ]}
                  >
                    <Input
                      placeholder="Ví dụ: Áo polo"
                      onChange={handleChangeProductName}
                    />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="slug"
                    label="Slug"
                    // rules={[
                    //   { required: true, message: 'Vui lòng nhập slug' },
                    //   {
                    //     pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    //     message:
                    //       'Chỉ chấp nhận chữ thường, số và dấu gạch ngang (-).',
                    //   },
                    // ]}
                  >
                    <Input placeholder="Ví dụ: ao-polo" />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="price"
                    label="Giá"
                    extra="Bỏ qua nếu sản phẩm có biến thể"
                    // rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
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
                    spacing="none"
                    name="stock"
                    label="Tồn kho"
                    extra="Bỏ qua nếu sản phẩm có biến thể"
                    // rules={[{ required: true, message: 'Vui lòng tồn kho' }]}
                  >
                    <InputNumber
                      min={0}
                      size="large"
                      className="w-full!"
                      placeholder="100"
                    />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="status"
                    label="Trạng thái"
                    // rules={[
                    //   { required: true, message: 'Vui lòng chọn trạng thái' },
                    // ]}
                  >
                    <Select placeholder="Chọn trạng thái" />
                  </FormItem>
                </Space>
                <Space direction="vertical" className="col-span-1">
                  <FormItem
                    spacing="none"
                    name="categoryId"
                    label="Danh mục"
                    // rules={[
                    //   { required: true, message: 'Vui lòng chọn danh mục' },
                    // ]}
                  >
                    <Select placeholder="Chọn danh mục" />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="brandId"
                    label="Thương hiệu"
                    // rules={[
                    //   { required: true, message: 'Vui lòng chọn thương hiệu' },
                    // ]}
                  >
                    <Select placeholder="Chọn thương hiệu" />
                  </FormItem>
                  <FormItem spacing="none" name="description" label="Mô tả">
                    <TextArea
                      placeholder="Mô tả sản phẩm..."
                      className="min-h-[200px]!"
                    />
                  </FormItem>
                </Space>
              </div>
            </Content>
            <div className="grid grid-cols-4 gap-x-5">
              <Content className="bg-white! border border-gray-200 rounded-lg overflow-hidden col-span-1">
                <Space direction="vertical" className="w-full">
                  <h2 className="font-semibold text-xl text-primary mb-3">
                    Hình ảnh
                  </h2>
                  <Dragger
                    multiple
                    name="files"
                    fileList={fileList}
                    listType="picture-card"
                    hint="Hỗ trợ tệp tin: PNG, JPG, JPEG, WEBP"
                    onChange={handleUploadChange}
                    onPreview={handleUploadPreview}
                    beforeUpload={handleBeforeUpload}
                  />
                </Space>
              </Content>
              <Content className="bg-white! border border-gray-200 rounded-lg overflow-hidden col-span-3">
                <Space direction="vertical" className="w-full">
                  <h2 className="font-semibold text-xl text-primary mb-3">
                    Biến thể sản phẩm
                  </h2>
                  <Button
                    className="w-full"
                    title="Thêm biến thể mới"
                    iconBefore={<PlusOutlined />}
                    onClick={() => setIsVariantModalVisible(true)}
                  />
                  <Table<IDataSource>
                    columns={columns}
                    dataSource={dataSource}
                  />
                </Space>
              </Content>
            </div>
          </Space>
        </Form>
      </Space>

      <ProductVariantCreateModal
        form={productVariantForm}
        open={isVariantModalVisible}
        productVariantOptions={productVariantOptions}
        onCancel={handleCancelProductVariant}
        onFinish={handleFinishProductVariant}
      />

      {previewImage && (
        <Image
          className="hidden"
          src={previewImage}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: boolean) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
        />
      )}
    </Layout>
  );
};

export default ProductCreate;
