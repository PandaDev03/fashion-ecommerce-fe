import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Space, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search, Trash } from '~/assets/svg';
import { productAPI } from '~/features/products/api/productApi';
import { getProducts } from '~/features/products/store/productThunks';
import {
  IDeleteManyProduct,
  IProduct,
  IProductParams,
} from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import { Layout } from '~/shared/components/Layout/Layout';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { PATH } from '~/shared/utils/path';
import ProductFilter from './ProductFilter';

export interface IFilterForm {
  search?: string;
  status?: string;
  brandId?: string;
  categoryId?: string;
  createdDate?: string[];
}

interface ISearchForm {
  search: string;
}

const ProductManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryParams = useQueryParams();

  const toast = useToast();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [searchForm] = useForm<ISearchForm>();
  const [filterForm] = useForm<IFilterForm>();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [filterParams, setFilterParams] = useState<IProductParams>();
  const [selectedMultipleProduct, setSelectedMultipleProduct] = useState<
    IProduct[]
  >([]);

  const product = useAppSelector((state) => state.product);

  const { pageInfo, handlePageChange, refetch, resetPaginationAndUrl } =
    usePagination({
      setFilterParams,
      extraParams: filterParams,
      fetchFn: (params) => dispatch(getProducts(params)).unwrap(),
    });

  const { mutate: deleteProduct, isPending: isDeleteProductPending } =
    useMutation({
      mutationFn: (id: string) => productAPI.deleteProduct(id),
      onSuccess: (response) => {
        toast.success(response?.message);
        refetch();
      },
    });

  const { mutate: deleteManyProduct, isPending: isDeleteManyProductPending } =
    useMutation({
      mutationFn: (id: IDeleteManyProduct) => productAPI.deleteManyProduct(id),
      onSuccess: (response) => {
        toast.success(response?.message);
        refetch();
      },
    });

  const columns: ColumnType<IProduct>[] = [
    {
      key: '1',
      width: 50,
      title: 'STT',
      align: 'center',
      render: (_, __, index: number) =>
        index + 1 + pageInfo?.pageSize * (pageInfo?.page - 1),
    },
    {
      key: '2',
      width: 300,
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: '3',
      width: 250,
      title: 'Slug',
      dataIndex: 'slug',
    },
    {
      key: '4',
      width: 300,
      title: 'Mô tả',
      dataIndex: 'description',
      render: (value) => {
        return (
          <Tooltip title={value}>
            <p className="max-w-[250px] truncate">{value}</p>
          </Tooltip>
        );
      },
    },
    {
      key: '5',
      width: 150,
      align: 'center',
      title: 'SL Biến thể',
      dataIndex: 'variants',
      render: (variants) => variants?.length,
    },
    {
      key: '5',
      width: 150,
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
    },
    {
      key: '6',
      width: 150,
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
    },
    {
      key: '7',
      width: 150,
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Tạm ngừng'}
        </Tag>
      ),
    },
    {
      key: '8',
      width: 150,
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '9',
      width: 150,
      title: 'Người tạo',
      dataIndex: ['creator', 'name'],
    },
    {
      key: '10',
      width: 150,
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '11',
      width: 150,
      title: 'Người chỉnh sửa',
      dataIndex: ['updater', 'name'],
    },
    {
      width: 100,
      fixed: 'right',
      align: 'center',
      title: 'Thao tác',
      render: (_, record) => {
        const isDisable = !!selectedMultipleProduct?.filter(
          (product) => product?.id === record?.id
        ).length;

        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              disabled={isDisable}
              displayType="text"
              title={
                <EyeOutlined
                  className={
                    isDisable
                      ? '[&>svg]:fill-gray-400'
                      : '[&>svg]:fill-blue-500'
                  }
                />
              }
              onClick={() =>
                navigate(
                  PATH.ADMIN_PRODUCT_DETAILS.replace(':slug', record.slug)
                )
              }
            />
            <Button
              displayType="text"
              disabled={isDisable}
              title={
                <EditOutlined
                  className={
                    isDisable
                      ? '[&>svg]:fill-gray-400'
                      : '[&>svg]:fill-blue-500'
                  }
                />
              }
              onClick={() =>
                navigate(
                  PATH.ADMIN_PRODUCT_DETAILS.replace(':slug', record?.slug),
                  { state: { edit: true } }
                )
              }
            />
            <PopConfirm
              placement="topLeft"
              title="Xoá mục này"
              onConfirm={() => deleteProduct(record?.id)}
            >
              <Button
                displayType="text"
                disabled={isDisable}
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

  const handleRowSelectionChange = useDebounceCallback(
    (selectedRows: IProduct[]) => setSelectedMultipleProduct(selectedRows),
    300
  );

  const rowSelection: TableProps<IProduct>['rowSelection'] = {
    onChange: (_, selectedRows: IProduct[]) => {
      console.log('selectedRows: ', selectedRows);
      handleRowSelectionChange(selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  useEffect(() => {
    const queryValues = queryParams.searchParams;

    const createdFrom =
      typeof queryValues?.createdFrom === 'string'
        ? dayjs(queryValues?.createdFrom)
        : undefined;
    const createdTo =
      typeof queryValues?.createdTo === 'string'
        ? dayjs(queryValues?.createdTo)
        : undefined;

    const brandId = Array.isArray(queryValues?.brandId)
      ? queryValues?.brandId[0]
      : queryValues?.brandId ?? '';
    const categoryId = Array.isArray(queryValues?.categoryId)
      ? queryValues?.categoryId[0]
      : queryValues?.categoryId ?? '';
    const status = Array.isArray(queryValues?.status)
      ? queryValues?.status[0]
      : queryValues?.status ?? '';

    searchForm.setFieldValue('search', queryValues?.search);
    filterForm.setFieldValue('createdDate', [createdFrom, createdTo]);

    filterForm.setFieldsValue({
      ...(status && { status: status }),
      ...(brandId && { brandId: brandId }),
      ...(categoryId && { categoryId: categoryId }),
    });

    setTitle('Sản phẩm');
    setBreadcrumb([
      {
        key: 'home',
        title: 'Trang chủ',
        href: PATH.ADMIN_DASHBOARD,
      },
      {
        key: 'product',
        title: 'Sản phẩm',
      },
    ]);
  }, []);

  const handleSearch = (values: ISearchForm) => {
    const { search } = values;

    resetPaginationAndUrl();
    setFilterParams({ ...filterParams, search });
  };
  const handleCancelFilter = () => {
    filterForm.resetFields();

    resetPaginationAndUrl();

    setIsFilterVisible(false);
    setFilterParams({
      brandId: undefined,
      categoryId: undefined,
      status: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    });
  };

  const handleFinishFilter = (values: IFilterForm) => {
    const { createdDate, ...rest } = values;

    const params: IProductParams = {
      createdFrom: createdDate?.[0]
        ? dayjs(createdDate?.[0]).startOf('day').toISOString()
        : undefined,
      createdTo: createdDate?.[1]
        ? dayjs(createdDate?.[1]).endOf('day').toISOString()
        : undefined,
      ...rest,
    };

    setIsFilterVisible(false);

    resetPaginationAndUrl();
    setFilterParams(params);
  };

  const handleDeleteProduct = () => {
    const params: IDeleteManyProduct = {
      ids: selectedMultipleProduct?.map((product) => product?.id),
    };

    deleteManyProduct(params);
  };

  return (
    <Layout
      loading={isDeleteProductPending || isDeleteManyProductPending}
      className="bg-white! border border-gray-200 rounded-lg overflow-hidden"
    >
      <Flex align="center" justify="space-between" className="py-4! px-5!">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách sản phẩm
          </h2>
          <p className="text-body">Quản lý sản phẩm của bạn</p>
        </Flex>
        <Flex className="gap-x-4">
          <Button
            title="Import"
            displayType="outlined"
            iconAfter={<UploadOutlined />}
          />
          <Button
            title="Export"
            displayType="outlined"
            iconAfter={<DownloadOutlined />}
          />
          <Button
            title="Thêm Sản phẩm"
            iconBefore={<PlusOutlined />}
            onClick={() => navigate(PATH.ADMIN_PRODUCT_CREATE)}
          />
        </Flex>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        className="border-t border-b border-gray-200 py-4! px-5!"
      >
        <Space>
          <Form
            form={searchForm}
            onFinish={useDebounceCallback(handleSearch, 300)}
          >
            <FormItem name="search" className="mb-0!">
              <Input
                allowClear
                placeholder="Tìm kiếm..."
                className="max-w-[300px]"
                prefix={<Search className="[&>path]:fill-[#667085] mr-1" />}
                onChange={() => searchForm.submit()}
              />
            </FormItem>
          </Form>
          {!!selectedMultipleProduct?.length && (
            <PopConfirm
              title="Xóa mục này"
              description={
                <p>
                  Bạn có chắc chắn muốn xóa sản phẩm:{' '}
                  <strong>
                    {selectedMultipleProduct
                      .map((product) => product?.name)
                      .join(', ')}
                  </strong>
                  ?
                  <br />
                  Hành động này không thể hoàn tác.
                </p>
              }
              onConfirm={handleDeleteProduct}
            >
              <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
            </PopConfirm>
          )}
        </Space>
        <ProductFilter
          form={filterForm}
          open={isFilterVisible}
          setIsOpen={setIsFilterVisible}
          onCancel={handleCancelFilter}
          onFinish={handleFinishFilter}
        />
      </Flex>

      <div className="py-4 px-5">
        <Table<IProduct>
          className="w-full"
          columns={columns}
          loading={product?.loading}
          dataSource={product?.items}
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          pagination={{
            current: pageInfo?.page,
            pageSize: pageInfo?.pageSize,
            total: product?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </div>
    </Layout>
  );
};

export default ProductManagement;
