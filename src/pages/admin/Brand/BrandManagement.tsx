import {
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Flex, Popconfirm } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FALLBACK_IMG } from '~/assets/images';

import { FilterOutlined, Search } from '~/assets/svg';
import { getAllBrands } from '~/features/brand/store/brandThunks';
import {
  IBrand,
  IBrandParams,
  ICreateBrandParams,
} from '~/features/brand/types/brand';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import usePagination from '~/shared/hooks/usePagination';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { PATH } from '~/shared/utils/path';
import BrandModal from './BrandModal';

export type IBrandForm = ICreateBrandParams;

const initialSelectedBrand = {} as IBrand;

const BrandManagement = () => {
  const dispatch = useAppDispatch();

  const [searchForm] = useForm();
  const [brandForm] = useForm<IBrandForm>();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filterParams, setFilterParams] = useState<IBrandParams>();
  const [selectedBrand, setSelectedBrand] =
    useState<IBrand>(initialSelectedBrand);

  const brand = useAppSelector((state) => state.brand);

  const { pageInfo, handlePageChange, resetPaginationAndUrl } =
    usePagination({
      setFilterParams,
      extraParams: filterParams,
      fetchFn: (params) => dispatch(getAllBrands(params)).unwrap(),
    });

  const columns: ColumnType<IBrand>[] = [
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
      width: 100,
      title: 'Logo',
      dataIndex: 'logo',
      render: (value) => (
        <Image
          preview
          width={50}
          height={50}
          src={value}
          fallback={FALLBACK_IMG}
          className="rounded-full"
        />
      ),
    },
    {
      key: '3',
      width: 150,
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      key: '4',
      width: 150,
      title: 'Slug',
      dataIndex: 'slug',
    },
    {
      key: '5',
      width: 250,
      title: 'Mô tả',
      className: 'truncate',
      dataIndex: 'description',
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
      width: 80,
      fixed: 'right',
      align: 'center',
      title: 'Thao tác',
      render: (_, record) => {
        return (
          <Flex justify="center" className="gap-x-3">
            <Button
              displayType="text"
              title={<EyeOutlined className="[&>svg]:fill-blue-500" />}
              onClick={() => handleViewDetailsClick(record)}
            />
            <Button
              displayType="text"
              title={<EditOutlined className="[&>svg]:fill-blue-500" />}
              // onClick={() => handleEditCategory(record)}
            />
            <Popconfirm
              okText="Có"
              cancelText="Không"
              placement="topLeft"
              title="Xoá mục này"
              description="Bạn có chắc chắn muốn xoá mục này?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              // onConfirm={() => deleteCategory(record.id)}
            >
              <Button
                displayType="text"
                title={<CloseOutlined className="[&>svg]:fill-red-500" />}
              />
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    setTitle('Thương hiệu');
    setBreadcrumb([
      { title: 'Trang chủ', href: PATH.ADMIN_DASHBOARD },
      { title: 'Thương hiệu' },
    ]);
  }, []);

  const handleViewDetailsClick = (record: IBrand) => {
    setIsModalVisible(true);
    setSelectedBrand(record);
  };

  const handleCancelModal = () => {
    brandForm.resetFields();
    setIsModalVisible(false);
  };

  return (
    <Layout
      loading={brand?.loading}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <Content className="flex items-center justify-between">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách Thương hiệu
          </h2>
          <p className="text-body">Quản lý thương hiệu</p>
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
          <Button title="Thêm Danh mục" iconBefore={<PlusOutlined />} />
        </Flex>
      </Content>
      <Content className="flex items-center justify-between border-t border-b border-gray-200">
        <Form form={searchForm} onFinish={(values) => console.log(values)}>
          <FormItem name="search" className="mb-0!">
            <Input
              placeholder="Tìm kiếm..."
              className="max-w-[300px]"
              prefix={<Search className="[&>path]:fill-[#667085] mr-1" />}
              onChange={() => searchForm.submit()}
            />
          </FormItem>
        </Form>
        <Button
          title="Lọc"
          displayType="outlined"
          iconBefore={<FilterOutlined />}
        />
      </Content>
      <Content>
        <Table<IBrand>
          columns={columns}
          dataSource={brand.items}
          pagination={{
            current: pageInfo.page,
            pageSize: pageInfo?.pageSize,
            total: brand?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>

      <BrandModal
        form={brandForm}
        open={isModalVisible}
        selectedBrand={selectedBrand}
        onCancel={handleCancelModal}
      />
    </Layout>
  );
};

export default BrandManagement;
