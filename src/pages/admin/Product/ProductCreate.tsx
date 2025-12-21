import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Flex,
  InputNumber,
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
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import { Content, Layout } from '~/shared/components/Layout/Layout';
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
import { ICreateProduct } from '~/features/products/types/product';
import { useMutation } from '@tanstack/react-query';
import { productAPI } from '~/features/products/api/productApi';
import { brandApi } from '~/features/brand/api/brandApi';
import { categoryApi } from '~/features/category/api/categoryApi';

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
  attributes: { name: string; value: string }[];
  //   optionValues: any[];
}

export interface IProductVariantOption {
  name: string;
  value: string;
}

interface IProductVariantOptionValue {
  id: string;
  name: string;
  // options: {
  //   name: string;
  //   value: string;
  // }[];
  files: UploadFile[];
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

  const [isProductVariantEdit, setIsProductVariantEdit] = useState(false);
  const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);

  const [selectedVariantId, setSelectedVariantId] = useState('');

  const [productVariantOptions, setProductVariantOptions] = useState<
    IProductVariantOption[]
  >(initialProductVariantOptions);

  const [productVariantOptionValues, setProductVariantOptionValues] =
    useState<IProductVariantOptionValue[]>();

  const {
    data: brandOptions,
    mutate: getBrandOptions,
    isPending: isGetBrandOptionPending,
  } = useMutation({
    mutationFn: () => brandApi.getBrandOptions(),
  });

  const {
    data: categoryOptions,
    mutate: getCategoryOptions,
    isPending: isGetCategoryOptionPending,
  } = useMutation({
    mutationFn: () => categoryApi.getCategoryOptions(),
  });

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: (data: FormData) => productAPI.createProduct(data),
    onSuccess: (response) => {
      console.log(response);

      toast.success(response?.message);
      navigate(PATH.ADMIN_PRODUCT_MANAGEMENT);
    },
  });

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

    getBrandOptions();
    getCategoryOptions();
  }, []);

  useEffect(() => {
    const colorMap = new Map<string, UploadFile[]>();

    dataSource.forEach((variant) => {
      const colorAttr = variant?.attributes?.find(
        (attr) => attr.name.trim().toLowerCase() === 'màu sắc'
      );

      if (colorAttr?.value) {
        const colorName = colorAttr.value;

        if (!colorMap.has(colorName)) {
          const existingFiles =
            productVariantOptionValues?.find((v) => v.name === colorName)
              ?.files || [];

          colorMap.set(colorName, existingFiles);
        }
      }
    });

    const newOptionValues: IProductVariantOptionValue[] = Array.from(
      colorMap
    ).map(([name, files]) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      name,
      files,
    }));

    setProductVariantOptionValues(newOptionValues);
  }, [dataSource]);

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
        <Flex align="center" justify="center" className="gap-x-2">
          <Button
            displayType="text"
            title={
              <EditOutlined
                className="[&>svg]:fill-blue-500"
                onClick={() => handleEditProductVariant(record?.id)}
              />
            }
          />
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

  const handleMainUploadChange: UploadProps['onChange'] = (info) => {
    const { fileList: newFileList } = info;

    if (selectedVariantId) {
      setProductVariantOptionValues((prev) =>
        prev?.map((item) =>
          item.id === selectedVariantId ? { ...item, files: newFileList } : item
        )
      );
    } else setFileList(newFileList);
  };

  const getCurrentFileList = () => {
    if (selectedVariantId) {
      const currentGroup = productVariantOptionValues?.find(
        (v) => v.id === selectedVariantId
      );

      return currentGroup?.files || [];
    }
    return fileList;
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

  const handleAddProductVariant = () => {
    productVariantForm.setFieldValue('status', 'active');
    setIsVariantModalVisible(true);
  };

  const handleEditProductVariant = (id: string) => {
    const currentDataSource = dataSource?.find((data) => data?.id === id);

    if (!currentDataSource) {
      toast.error('Không tìm thấy biến thể cần chỉnh sửa');
      return;
    }

    productVariantForm.setFieldsValue(currentDataSource);

    setIsProductVariantEdit(true);
    setIsVariantModalVisible(true);
  };

  const handleCancelProductVariant = () => {
    const attributes: IProductVariantCreateForm['attributes'] =
      productVariantOptions?.map(({ name }) => ({ name, value: '' }));

    productVariantForm.resetFields();
    productVariantForm.setFieldValue('attributes', attributes);

    setIsVariantModalVisible(false);
  };

  const handleDeleteProductVariant = (id: string) => {
    const newDataSource: IDataSource[] = dataSource?.filter(
      (data) => data?.id !== id
    );

    setDataSource(newDataSource);
    if (!newDataSource?.length) {
      setProductVariantOptions(initialProductVariantOptions);
      productVariantOptionRef.current = false;
    }
  };

  const handleValidateProductVariantForm = (variantName?: string) => {
    const isDuplicate = dataSource.some((data) => {
      if (isProductVariantEdit) {
        const editingId = productVariantForm.getFieldsValue(true)?.id;
        if (!editingId) {
          toast.error('Không tìm thấy ID của biến thể');
          return;
        }

        return data.name === variantName && data.id !== editingId;
      }

      return data.name === variantName;
    });

    return isDuplicate;
  };

  const handleFinishProductVariant = (values: IProductVariantCreateForm) => {
    // console.log('values', values);
    const { attributes } = values;

    if (!productVariantOptionRef.current) {
      const options: IProductVariantOption[] = attributes?.map(
        ({ name, value }) => ({
          name,
          value,
        })
      );

      setProductVariantOptions(options);
      productVariantOptionRef.current = true;
    }

    const variantName = attributes
      ?.map((attribute) => attribute?.value)
      .join(' - ');

    if (handleValidateProductVariantForm(variantName)) {
      toast.error(`Biến thể "${variantName}" đã tồn tại!`);
      return;
    }

    if (isProductVariantEdit) {
      const editingId = productVariantForm.getFieldsValue(true)?.id;

      setDataSource((prev) =>
        prev?.map((data) =>
          data?.id === editingId
            ? {
                ...data,
                ...values,
                name: variantName,
              }
            : data
        )
      );
      setIsProductVariantEdit(false);
    } else {
      const newDataSource: IDataSource = {
        ...values,
        id: `new-${Date.now()}-${Math.random()}`,
        name: variantName,
      };

      setDataSource((prev) =>
        [...prev, { ...newDataSource }].sort(
          (a, b) => a?.position - b?.position
        )
      );
    }

    handleCancelProductVariant();
  };

  const handleFinishCreate = (values: ICreateForm) => {
    console.log('fileList', fileList);
    console.log('productVariantOptionValues', productVariantOptionValues);

    const isHasVariant = !!dataSource?.length;

    const formData = new FormData();

    formData.append('name', values?.name);
    formData.append('slug', values?.slug);
    formData.append('price', values?.price?.toString());
    formData.append('stock', values?.stock?.toString());
    formData.append('status', values?.status);
    formData.append('categoryId', values?.categoryId);
    formData.append('brandId', values?.brandId);

    if (values?.description) formData.append('description', values.description);

    if (isHasVariant) {
      const fileMap = new Map<string, File>();

      const finalVariants: ICreateProduct['variables']['variants'] =
        dataSource.map((variant) => {
          const colorAttr = variant.attributes?.find(
            (attr) => attr.name.trim().toLowerCase() === 'màu sắc'
          );

          const matchingColorGroup = productVariantOptionValues?.find(
            (group) => group.name === colorAttr?.value
          );

          return {
            price: variant.price,
            stock: variant.stock,
            status: variant.status,
            position: variant.position,
            optionValues: variant.attributes.map((attr) => ({
              optionName: attr.name,
              value: attr.value,
            })),
            images:
              matchingColorGroup?.files.map((file) => ({
                uid: file?.originFileObj?.uid,
              })) || [],
          };
        });

      productVariantOptionValues?.forEach((colorGroup) => {
        colorGroup.files.forEach((file) => {
          if (file.originFileObj && !fileMap.has(file.uid)) {
            fileMap.set(file.uid, file.originFileObj);
          }
        });
      });

      fileMap.forEach((file, uid) => {
        const renamedFile = new File([file], uid, { type: file.type });
        formData.append('files', renamedFile);
      });

      formData.append('variants', JSON.stringify(finalVariants));
      console.log('finalVariants', finalVariants);
    } else {
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append('files', file.originFileObj);
      });
    }

    createProduct(formData);
  };

  return (
    <Layout loading={isPending}>
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
                    rules={[
                      { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                    ]}
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
                    rules={[
                      { required: true, message: 'Vui lòng nhập slug' },
                      {
                        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message:
                          'Chỉ chấp nhận chữ thường, số và dấu gạch ngang (-).',
                      },
                    ]}
                  >
                    <Input placeholder="Ví dụ: ao-polo" />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="price"
                    label="Giá"
                    // extra="Bỏ qua nếu sản phẩm có biến thể"
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
                    spacing="none"
                    name="stock"
                    label="Tồn kho"
                    // extra="Bỏ qua nếu sản phẩm có biến thể"
                    rules={[{ required: true, message: 'Vui lòng tồn kho' }]}
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
                    rules={[
                      { required: true, message: 'Vui lòng chọn trạng thái' },
                    ]}
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
                </Space>
                <Space direction="vertical" className="col-span-1">
                  <FormItem
                    spacing="none"
                    name="categoryId"
                    label="Danh mục"
                    rules={[
                      { required: true, message: 'Vui lòng chọn danh mục' },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      loading={isGetCategoryOptionPending}
                      options={categoryOptions?.data?.map((opt: any) => ({
                        label: opt?.name,
                        value: opt?.id,
                      }))}
                    />
                  </FormItem>
                  <FormItem
                    spacing="none"
                    name="brandId"
                    label="Thương hiệu"
                    rules={[
                      { required: true, message: 'Vui lòng chọn thương hiệu' },
                    ]}
                  >
                    <Select
                      placeholder="Chọn thương hiệu"
                      loading={isGetBrandOptionPending}
                      options={brandOptions?.data?.map((opt: any) => ({
                        label: opt?.name,
                        value: opt?.id,
                      }))}
                    />
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
                  {productVariantOptionValues &&
                    productVariantOptionValues.length > 0 && (
                      <Flex wrap="wrap" gap={8} className="mb-4">
                        {productVariantOptionValues.map(({ id, name }) => (
                          <Button
                            key={id}
                            title={name}
                            displayType={
                              selectedVariantId === id ? 'primary' : 'outlined'
                            }
                            onClick={() =>
                              setSelectedVariantId(
                                selectedVariantId === id ? '' : id
                              )
                            }
                          />
                        ))}
                      </Flex>
                    )}
                  <Dragger
                    multiple
                    name="files"
                    listType="picture-card"
                    fileList={getCurrentFileList()}
                    hint="Hỗ trợ tệp tin: PNG, JPG, JPEG, WEBP"
                    onChange={handleMainUploadChange}
                    onPreview={handleUploadPreview}
                    beforeUpload={handleBeforeUpload}
                  />
                  <p className="mt-2 text-gray-500 text-xs italic text-center">
                    {selectedVariantId
                      ? `Đang tải ảnh cho màu: ${
                          productVariantOptionValues?.find(
                            (v) => v.id === selectedVariantId
                          )?.name
                        }`
                      : 'Tải lên ảnh chung cho sản phẩm (không theo biến thể)'}
                  </p>
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
                    onClick={handleAddProductVariant}
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
        isEdit={isProductVariantEdit}
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
