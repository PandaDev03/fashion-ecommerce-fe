import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Card,
  Divider,
  Flex,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType, TableProps } from 'antd/es/table';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FALLBACK_IMG, FOLDER_EMPTY } from '~/assets/images';
import { brandApi } from '~/features/brand/api/brandApi';
import { categoryApi } from '~/features/category/api/categoryApi';
import { cloudinaryApi } from '~/features/cloudinary/api/cloudinaryApi';
import { productAPI } from '~/features/products/api/productApi';
import {
  ICreateProductVariant,
  IGetProductOptionParams,
  IProduct,
  IProductOption,
  IUpdateProduct,
  IUpdateProductVariant,
  IVariant,
} from '~/features/products/types/product';
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
import {
  generateSlug,
  getBase64,
  normalizeObjectStrings,
} from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import ProductVariantModal from './ProductVariantModal';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import { ArrowDown, Trash } from '~/assets/svg';

interface IProductEditForm {
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string;
}

export interface IProductVariantForm {
  price: number;
  stock: number;
  status?: string;
  position?: number;
  optionValues: {
    isNew: boolean;
    optionId: string;
    optionValueId: {
      label: string;
      value: string;
    };
  }[];
}

interface IDataSource {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  position: number;
  // optionValues: IVariant['optionValues'];
  optionValues: any[];
}

interface ISelectedImage {
  id: string;
  url: string;
}

interface IUploadVariantImage extends UploadFile {
  id?: string;
}

const initialProduct = {} as IProduct;
const initialSelectedVariant = {} as IVariant;

const ProductDetailsManagement = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const flagRef = useRef(false);

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [productEditForm] = useForm<IProductEditForm>();
  const [productVariantForm] = useForm<IProductVariantForm>();

  const [isProductEdit, setIsProductEdit] = useState(false);
  const [isProductVariantEdit, setIsProductVariantEdit] = useState(false);
  const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);

  const [productOptions, setProductOptions] = useState<IProductOption[]>([]);
  const [selectedImage, setSelectedImage] = useState<ISelectedImage>();
  const [selectedVariant, setSelectedVariant] = useState<IVariant>(
    initialSelectedVariant
  );
  const [selectedMultipleProductVariant, setSelectedMultipleProductVariant] =
    useState<IDataSource[]>();

  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<IUploadVariantImage[]>([]);

  const [dataSource, setDataSource] = useState<IDataSource[]>();
  const [product, setProduct] = useState<IProduct>(initialProduct);

  const { mutate: getProductBySlug, isPending: isGetProductBySlugPending } =
    useMutation({
      mutationFn: (slug: string) => productAPI.getProductBySlug(slug),
      onSuccess: (response) => setProduct(response?.data),
    });

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

  const { mutate: getProductOptions } = useMutation({
    mutationFn: (params: IGetProductOptionParams) =>
      productAPI.getProductOptions(params),
    onSuccess: (response) => {
      setProductOptions(response?.data);
    },
  });

  const {
    mutate: createProductVariant,
    isPending: isCreateProductVariantPending,
  } = useMutation({
    mutationFn: (params: ICreateProductVariant) =>
      productAPI.createProductVariant(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      handleCancelVariantModal();
      refetchProductBySlug();
    },
  });

  const { mutate: uploadProductImages, isPending: isUploadProductImgPending } =
    useMutation({
      mutationFn: (data: FormData) => cloudinaryApi.upload(data),
      onSuccess: (response) => {
        const uploadedImages = response?.data?.map((image: any) => ({
          url: image?.url,
        }));

        if (!!uploadedImages?.length) {
          const currentProductImages = fileList?.filter((file) => file?.id);
          const newProductImages = [...currentProductImages, ...uploadedImages];

          const fieldValues = productEditForm.getFieldsValue();
          const params: IUpdateProduct = {
            productId: product?.id,
            variantId: selectedVariant.id,
            images: newProductImages?.map((image) => ({
              ...(image?.id && { imageId: image?.id }),
              url: image?.url,
            })),
            ...fieldValues,
          };

          handleUpdateProduct(params);
        }
      },
    });

  const { mutate: updateProduct, isPending: isUpdateProductPending } =
    useMutation({
      mutationFn: (params: IUpdateProduct) => productAPI.updateProduct(params),
      onSuccess: async (response) => {
        toast.success(response?.message);

        handleCancelEdit();

        const newSlug = productEditForm.getFieldValue('slug');
        refetchProductBySlug(newSlug);
      },
    });

  const {
    mutate: updateProductVariant,
    isPending: isUpdateProductVariantPending,
  } = useMutation({
    mutationFn: (params: IUpdateProductVariant) =>
      productAPI.updateProductVariant(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      handleCancelVariantModal();
      refetchProductBySlug();
    },
  });

  const {
    mutate: deleteProductVariant,
    isPending: isDeleteProductVariantPending,
  } = useMutation({
    mutationFn: (variantIds: string | string[]) =>
      productAPI.deleteProductVariant(variantIds),
    onSuccess: (response) => {
      setSelectedMultipleProductVariant([]);

      toast.success(response?.message);
      refetchProductBySlug();
    },
  });

  const averagePrice = useMemo(() => {
    const totalProducts = product?.variants?.length;
    const totalPrice = product?.variants?.reduce((prev, current) => {
      return (prev += Number(current?.price));
    }, 0);

    return (totalPrice / totalProducts || 0).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }, [product]);

  const totalStock = useMemo(
    () =>
      product?.variants?.reduce((prev, current) => {
        return (prev += current?.stock);
      }, 0),
    [product]
  );

  const handleRowSelectionChange = useDebounceCallback(
    (selectedRows: IDataSource[]) =>
      setSelectedMultipleProductVariant(selectedRows),
    300
  );

  const rowSelection: TableProps<IDataSource>['rowSelection'] = {
    onChange: (_, selectedRows: IDataSource[]) =>
      handleRowSelectionChange(selectedRows),
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

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
      render: (_, record) => {
        const isDisable =
          !!selectedMultipleProductVariant?.filter(
            (productVariant) => productVariant.id === record.id
          ).length || isProductEdit;

        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              disabled={isDisable}
              displayType="text"
              title={
                <EditOutlined
                  className={
                    isDisable
                      ? '[&>svg]:fill-gray-400'
                      : '[&>svg]:fill-blue-500'
                  }
                />
              }
              onClick={() => handleEditProductVariant(record)}
            />
            <PopConfirm
              title="Xoá mục này"
              placement="topLeft"
              onConfirm={() => deleteProductVariant(record?.id)}
            >
              <Button
                disabled={isDisable}
                displayType="text"
                title={
                  <CloseOutlined
                    className={
                      isDisable
                        ? '[&>svg]:fill-gray-400'
                        : '[&>svg]:fill-red-500'
                    }
                  />
                }
              />
            </PopConfirm>
          </Flex>
        );
      },
    },
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Biến thể sản phẩm',
      children: (
        <Space size="middle" direction="vertical" className="w-full">
          <Button
            disabled={isProductEdit}
            className="w-full"
            title="Thêm biến thể mới"
            iconBefore={<PlusOutlined />}
            onClick={() => setIsVariantModalVisible(true)}
          />
          <Table<IDataSource>
            columns={columns}
            dataSource={dataSource}
            rowSelection={{ type: 'checkbox', ...rowSelection }}
          />
          {!!selectedMultipleProductVariant?.length && (
            <Flex align="center" justify="end" className="gap-x-2">
              <PopConfirm
                title="Xóa mục này"
                placement="topLeft"
                description={
                  <p>
                    Bạn có chắc chắn muốn xóa biến thể:{' '}
                    <strong>
                      {selectedMultipleProductVariant
                        .map((brand) => brand.name)
                        .join(', ')}
                    </strong>
                    ?
                    <br />
                    Hành động này không thể hoàn tác.
                  </p>
                }
                onConfirm={() => handleDeleteMultipleProductVariant()}
              >
                <Button
                  title="Xóa đã chọn"
                  disabled={isProductEdit}
                  iconBefore={<DeleteOutlined />}
                />
              </PopConfirm>
            </Flex>
          )}
        </Space>
      ),
    },
    {
      key: '2',
      label: 'Mô tả',
      children: isProductEdit ? (
        <FormItem name="description" spacing="none">
          <TextArea
            className="min-h-[300px]!"
            placeholder="Mô tả sản phẩm..."
          />
        </FormItem>
      ) : (
        <p>{product?.description}</p>
      ),
    },
  ];

  useEffect(() => {
    setTitle('Chi tiết sản phẩm');
    setBreadcrumb([
      {
        key: 'home',
        title: 'Sản phẩm',
        href: PATH.ADMIN_PRODUCT_MANAGEMENT,
      },
      {
        key: 'product-details',
        title: 'Chi tiết sản phẩm',
      },
    ]);

    getBrandOptions();
    getCategoryOptions();
  }, []);

  useEffect(() => {
    if (flagRef.current) return;

    refetchProductBySlug(slug);
    flagRef.current = true;
  }, [slug]);

  useEffect(() => {
    const selectedVariant = product?.variants?.[0];
    const selectedImage = selectedVariant?.imageMappings?.[0]?.image;

    const dataSource: IDataSource[] = product?.variants?.map(
      ({ id, stock, status, position, optionValues, ...variant }) => ({
        id,
        stock,
        status,
        position,
        price: Number(variant?.price ?? 0),
        optionValues: optionValues?.map((value) => ({
          ...value,
          optionValueId: {
            label: value?.optionValue?.value,
            value: value?.optionValue?.id,
          },
        })),
        name:
          optionValues
            ?.map(({ optionValue }) => optionValue?.value)
            .join(' - ') || '-',
      })
    );

    setDataSource(dataSource);
    setSelectedVariant(selectedVariant);
    setSelectedImage({
      id: selectedImage?.id,
      url: selectedImage?.url ?? FALLBACK_IMG,
    });

    if (product?.id) getProductOptions({ productId: product?.id });
  }, [product]);

  const refetchProductBySlug = (newSlug?: string) => {
    const currentSlug = newSlug || slug;

    if (!currentSlug) {
      toast.error('Không tìm thấy slug!');
      return;
    }

    getProductBySlug(currentSlug);
    navigate(PATH.ADMIN_PRODUCT_DETAILS.replace(':slug', currentSlug), {
      replace: true,
    });
  };

  const handleUploadPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview)
      file.preview = await getBase64(file.originFileObj as FileType);

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const formattedFileList = (
    imageMappings: IVariant['imageMappings'] | undefined
  ) => {
    if (!imageMappings) return [];

    return imageMappings.map((item: any) => ({
      id: item?.image?.id,
      uid: item?.image?.id,
      name: `image-${item?.image?.position}.jpg`,
      status: 'done',
      url: item?.image?.url,
      thumbUrl: item?.image?.url,
    })) as UploadFile[];
  };

  const handleVariantClick = (optionId: string) => {
    const selectedVariant =
      product?.variants?.find((variant) =>
        variant?.optionValues?.some(
          ({ optionValue }) => optionValue?.id === optionId
        )
      ) || ({} as IVariant);

    const selectedImage = selectedVariant?.imageMappings?.[0]?.image;

    setSelectedVariant(selectedVariant);
    setSelectedImage({
      id: selectedImage?.id,
      url: selectedImage?.url ?? FALLBACK_IMG,
    });

    if (isProductEdit) {
      const newFileList = formattedFileList(selectedVariant?.imageMappings);
      setFileList(newFileList);
    }
  };

  const handleEdit = () => {
    const newFileList = formattedFileList(selectedVariant?.imageMappings);

    const productEditFormValues: IProductEditForm = {
      name: product?.name,
      slug: product?.slug,
      brandId: product?.brandId,
      categoryId: product?.categoryId,
      description: product?.description,
    };
    productEditForm.setFieldsValue(productEditFormValues);

    setIsProductEdit(true);
    setFileList(newFileList);
  };

  const handleCancelEdit = () => {
    setIsProductEdit(false);
    setFileList([]);
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

  const handleChangeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const slug = generateSlug(value);
    productEditForm.setFieldValue('slug', slug);
  };

  const handleUpdateProduct = (params: IUpdateProduct) => {
    const normalizePrams = normalizeObjectStrings(params);
    updateProduct(normalizePrams);
  };

  const handleFinishEditProduct = () => {
    const uploadImages = fileList?.filter((file) => !file?.id);

    if (uploadImages?.length > 0) {
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append('files', file.originFileObj);
      });

      uploadProductImages(formData);
      return;
    }

    if (!selectedVariant?.id) {
      toast.error('Không tìm thấy id của sản phẩm');
      return;
    }

    const fieldValues = productEditForm.getFieldsValue();
    const params: IUpdateProduct = {
      productId: product?.id,
      variantId: selectedVariant?.id,
      images: fileList?.map((file) => ({
        imageId: file?.id,
        url: file?.url,
      })),
      ...fieldValues,
    };

    // updateProduct(params);
    handleUpdateProduct(params);
  };

  const handleCancelVariantModal = () => {
    setIsProductVariantEdit(false);
    setIsVariantModalVisible(false);
    productVariantForm.resetFields();
  };

  const handleFinishVariantModal = (values: IProductVariantForm) => {
    if (!product?.id) {
      toast.error('Không tìm thấy ID của sản phẩm');
      return;
    }

    const { optionValues } = values;

    const params: ICreateProductVariant = {
      ...values,
      productId: product?.id,
      optionValues: optionValues?.map((optionVal) => {
        const isNewOption =
          optionVal?.optionValueId?.value?.startsWith('temp_');

        return {
          isNew: isNewOption,
          optionId: optionVal?.optionId,
          ...(!isNewOption && {
            optionValueId: optionVal?.optionValueId?.value,
          }),
          ...(isNewOption && { value: optionVal?.optionValueId?.label }),
        };
      }),
    };

    const { id: productVariantId } = productVariantForm.getFieldsValue(true);

    if (isProductVariantEdit) {
      if (!productVariantId) {
        toast.error('Không tìm thấy ID của biến thể');
        return;
      }

      const updateParams: IUpdateProductVariant = {
        variantId: productVariantId,
        ...params,
      };

      updateProductVariant(updateParams);
      return;
    }

    createProductVariant(params);
  };

  const handleEditProductVariant = (record: IDataSource) => {
    const { optionValues, ...values } = record;
    const fieldValues: Record<string, any> = { ...values };

    optionValues?.map((item) => {
      const { optionValue, optionValueId } = item;
      if (!optionValue?.optionId) return;

      fieldValues[optionValue.optionId] = optionValueId;
    });

    setIsProductVariantEdit(true);
    setIsVariantModalVisible(true);
    productVariantForm.setFieldsValue(fieldValues);
  };

  const handleDeleteMultipleProductVariant = () => {
    const params = selectedMultipleProductVariant?.map(
      (productVariant) => productVariant?.id
    );

    if (!params?.length) {
      toast.error('Không tìm thấy ID của biến thể để xóa');
      return;
    }

    deleteProductVariant(params);
  };

  // const handleDeleteOptionValue = (optionValueId: string) => {
  //   console.log(optionValueId);
  // };

  // console.log('product', product);
  // console.log('fileList', fileList);
  // console.log('selectedVariant', selectedVariant);

  return (
    <Layout
      loading={
        isGetProductBySlugPending ||
        isUpdateProductPending ||
        isUploadProductImgPending ||
        isDeleteProductVariantPending
      }
    >
      <Form
        form={productEditForm}
        onFinish={handleFinishEditProduct}
        className="w-full"
      >
        <Space size="middle" direction="vertical" className="w-full">
          <Content className="border border-gray-200 rounded-lg overflow-hidden">
            <Flex align="center" justify="space-between">
              {isProductEdit ? (
                <FormItem
                  name="name"
                  spacing="none"
                  label="Tên sản phẩm"
                  className="max-w-[500px]"
                >
                  <Input
                    placeholder="Ví dụ: Áo polo..."
                    onChange={handleChangeProductName}
                  />
                </FormItem>
              ) : (
                <h2 className="font-semibold text-xl text-primary">
                  {product?.name ?? '-'}
                </h2>
              )}
              <Flex className="gap-x-4">
                <Button
                  title="Import"
                  disabled={isProductEdit}
                  displayType="outlined"
                  iconAfter={<UploadOutlined />}
                />
                <Button
                  title="Export"
                  disabled={isProductEdit}
                  displayType="outlined"
                  iconAfter={<DownloadOutlined />}
                />
                <Button
                  title="Chỉnh sửa"
                  disabled={isProductEdit}
                  iconBefore={<EditOutlined />}
                  onClick={handleEdit}
                />
                {isProductEdit && (
                  <>
                    <Button
                      title="Hủy"
                      displayType="outlined"
                      onClick={handleCancelEdit}
                    />
                    <Button
                      title="Lưu"
                      iconBefore={<SaveOutlined />}
                      onClick={() => productEditForm.submit()}
                    />
                  </>
                )}
              </Flex>
            </Flex>
          </Content>
          <div className="grid grid-cols-4 gap-x-4">
            <Flex
              vertical
              className="bg-white py-4! px-5! border border-gray-200 rounded-lg overflow-hidden gap-y-2"
            >
              <span className="text-body">Tổng biến thể</span>
              <span className="font-semibold text-2xl text-[#3498DB]">
                {product?.variants?.length ?? '-'}
              </span>
            </Flex>
            <Flex
              vertical
              className="bg-white py-4! px-5! border border-gray-200 rounded-lg overflow-hidden gap-y-2"
            >
              <span className="text-body">Tổng tồn kho</span>
              <span className="font-semibold text-2xl text-green-600">
                {totalStock ?? '-'}
              </span>
            </Flex>
            <Flex
              vertical
              className="bg-white py-4! px-5! border border-gray-200 rounded-lg overflow-hidden gap-y-2"
            >
              <span className="text-body">Giá trung bình</span>
              <span className="font-semibold text-2xl text-yellow-500">
                {averagePrice ?? '-'}
              </span>
            </Flex>
            <Flex
              vertical
              className="bg-white py-4! px-5! border border-gray-200 rounded-lg overflow-hidden gap-y-2"
            >
              <span className="text-body">Trạng thái</span>
              <Tag color="green" className="max-w-max">
                Đang bán
              </Tag>
            </Flex>
          </div>
          <div className="grid grid-cols-4 gap-x-4 min-h-[580px]">
            <div className="col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="font-semibold text-lg text-primary py-4! px-5!">
                Thông tin sản phẩm
              </h3>
              <Divider className="my-1!" />
              <Space
                size="middle"
                direction="vertical"
                className="py-4! px-5! w-full"
              >
                <span className="text-[13px] text-body">Hình ảnh</span>
                {!!product?.variantColorData?.length && (
                  <div className="grid grid-cols-2 gap-2">
                    {product?.variantColorData?.map(({ id, name, count }) => (
                      <Button
                        key={id}
                        title={
                          <Flex vertical>
                            <p>{name}</p>
                            <p className="font-normal">{count} biến thể</p>
                          </Flex>
                        }
                        displayType={
                          selectedVariant?.optionValues?.some(
                            ({ optionValue }) => optionValue?.id === id
                          )
                            ? 'primary'
                            : 'outlined'
                        }
                        onClick={() => handleVariantClick(id)}
                      />
                    ))}
                  </div>
                )}
                {/* {!!product?.variantColorData?.length && (
                  <div className="grid grid-cols-2 gap-2">
                    {product?.variantColorData?.map(({ id, name, count }) => (
                      <Flex
                        key={id}
                        className="group relative border border-gray-300 rounded-lg cursor-pointer overflow-hidden"
                      >
                        <Flex
                          align="center"
                          justify="center"
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#ef4444] text-white border-none cursor-pointer hover:bg-[#dc2626] opacity-0 group-has-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                          onClick={() => handleDeleteOptionValue(id)}
                        >
                          <CloseOutlined className="text-[8px]" />
                        </Flex>
                        <Flex
                          vertical
                          className="w-full py-4! px-2! text-center group-has-hover:[&>span]:text-white! group-has-hover:bg-primary transition-all duration-300 ease-in-out"
                        >
                          <span className="font-semibold text-primary">
                            {name}
                          </span>
                          <span className="font-normal text-body">
                            {count} biến thể
                          </span>
                        </Flex>
                      </Flex>
                    ))}
                  </div>
                )} */}

                {isProductEdit ? (
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
                ) : (
                  <Space direction="vertical" className="w-full">
                    {selectedImage?.id ? (
                      <Image
                        className="rounded-lg"
                        src={selectedImage?.url}
                        preview={
                          !isProductEdit && selectedImage?.url !== FALLBACK_IMG
                        }
                      />
                    ) : (
                      <Flex align="center" justify="center" vertical>
                        <Image src={FOLDER_EMPTY} />
                        <span className="text-body">Chưa có hình ảnh</span>
                      </Flex>
                    )}
                    <Flex
                      className="overflow-x-auto gap-2 pb-2 no-scrollbar"
                      style={{
                        scrollbarWidth: 'thin',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      <div className="flex-none">
                        {selectedVariant?.imageMappings?.map(({ image }) => {
                          return (
                            <Image
                              width={100}
                              height={100}
                              key={image?.id}
                              src={image?.url}
                              className={classNames(
                                'border-2 border-gray-300 rounded-lg object-cover cursor-pointer hover:border-blue-300',
                                'transition-all duration-300 ease-in-out',
                                selectedImage?.id === image?.id
                                  ? 'border-blue-500!'
                                  : ''
                              )}
                              onClick={() =>
                                setSelectedImage({
                                  id: image?.id,
                                  url: image?.url ?? FALLBACK_IMG,
                                })
                              }
                            />
                          );
                        })}
                      </div>
                    </Flex>
                  </Space>
                )}

                {isProductEdit ? (
                  <FormItem name="slug" spacing="none" label="Slug">
                    <Input placeholder="Ví dụ: ao-polo..." />
                  </FormItem>
                ) : (
                  <>
                    <span className="text-[13px] text-body">Slug</span>
                    <span className="text-primary">{product?.slug ?? '-'}</span>
                  </>
                )}
                <Flex vertical>
                  {isProductEdit ? (
                    <FormItem name="categoryId" spacing="none" label="Danh mục">
                      <Select
                        loading={isGetCategoryOptionPending}
                        options={categoryOptions?.data?.map(
                          (optionCategory: any) => ({
                            label: optionCategory?.name,
                            value: optionCategory?.id,
                          })
                        )}
                      />
                    </FormItem>
                  ) : (
                    <>
                      <span className="text-[13px] text-body">Danh mục</span>
                      <span className="text-primary">
                        {product?.category?.name ?? '-'}
                      </span>
                    </>
                  )}
                </Flex>
                <Flex vertical>
                  {isProductEdit ? (
                    <FormItem name="brandId" spacing="none" label="Thương hiệu">
                      <Select
                        loading={isGetBrandOptionPending}
                        options={brandOptions?.data?.map(
                          (brandOption: any) => ({
                            label: brandOption?.name,
                            value: brandOption?.id,
                          })
                        )}
                      />
                    </FormItem>
                  ) : (
                    <>
                      <span className="text-[13px] text-body">Thương hiệu</span>
                      <span className="text-primary">
                        {product?.brand?.name ?? '-'}
                      </span>
                    </>
                  )}
                </Flex>
                <Flex vertical>
                  <span className="text-[13px] text-body">Ngày tạo</span>
                  <span className="text-primary">
                    {product?.createdAt
                      ? dayjs(product?.createdAt).format('DD/MM/YYYY HH:mm:ss')
                      : '-'}
                  </span>
                </Flex>
              </Space>
            </div>
            <div className="max-h-max col-span-3 py-4 px-5 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Tabs items={tabItems} defaultActiveKey="1" />
            </div>
          </div>
        </Space>
      </Form>

      {previewImage && (
        <Image
          className="hidden"
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: boolean) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

      <ProductVariantModal
        product={product}
        form={productVariantForm}
        open={isVariantModalVisible}
        productOptions={productOptions}
        loading={isCreateProductVariantPending || isUpdateProductVariantPending}
        setProductOptions={setProductOptions}
        onCancel={handleCancelVariantModal}
        onFinish={handleFinishVariantModal}
      />
    </Layout>
  );
};

export default ProductDetailsManagement;
