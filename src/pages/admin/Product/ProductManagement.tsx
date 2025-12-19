import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Flex, Space, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Search } from '~/assets/svg';
import { getProducts } from '~/features/products/store/productThunks';
import { IProduct } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import { Layout } from '~/shared/components/Layout/Layout';
import PopConfirm from '~/shared/components/PopConfirm/PopConfirm';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { PATH } from '~/shared/utils/path';
import ProductFilter from './ProductFilter';

const ProductManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [searchForm] = useForm();
  const [filterForm] = useForm();

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterParams, setFilterParams] = useState();

  const product = useAppSelector((state) => state.product);

  const { pageInfo, handlePageChange } = usePagination({
    setFilterParams,
    extraParams: filterParams,
    fetchFn: (params) => dispatch(getProducts(params)).unwrap(),
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '8',
      width: 150,
      title: 'Người tạo',
      dataIndex: ['creator', 'name'],
    },
    {
      key: '9',
      width: 150,
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '10',
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
        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              displayType="text"
              title={<EyeOutlined className="[&>svg]:fill-blue-500" />}
              onClick={() =>
                navigate(
                  PATH.ADMIN_PRODUCT_DETAILS.replace(':slug', record.slug)
                )
              }
            />
            <Button
              displayType="text"
              title={<EditOutlined className="[&>svg]:fill-blue-500" />}
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
              // onConfirm={() => deleteCategory(record.id)}
            >
              <Button
                displayType="text"
                title={<CloseOutlined className="[&>svg]:fill-red-500" />}
              />
            </PopConfirm>
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
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

  const handleSearch = (values: any) => {
    console.log(values);
  };

  const handleCancelFilter = () => {
    setIsFilterVisible(false);
  };

  const handleFinishFilter = (values: any) => {
    console.log(values);
  };

  return (
    <Layout className="bg-white! border border-gray-200 rounded-lg overflow-hidden">
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
          {/* {!!selectedMultipleCategory?.length && (
            <PopConfirm
              title="Xóa mục này"
              description={
                <p>
                  Bạn có chắc chắn muốn xóa danh mục:{' '}
                  <strong>
                    {selectedMultipleCategory
                      .map((brand) => brand.name)
                      .join(', ')}
                  </strong>
                  ?
                  <br />
                  Hành động này không thể hoàn tác.
                </p>
              }
              onConfirm={handleDeleteManyCategory}
            >
              <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
            </PopConfirm>
          )} */}
        </Space>
        <ProductFilter
          form={filterForm}
          open={isFilterVisible}
          data={[]}
          setIsOpen={setIsFilterVisible}
          onCancel={handleCancelFilter}
          onFinish={handleFinishFilter}
        />
      </Flex>

      <div className="py-4 px-5">
        <Table<IProduct>
          className="w-full"
          columns={columns}
          dataSource={product?.items}
          // rowSelection={{ type: 'checkbox', ...rowSelection }}
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
