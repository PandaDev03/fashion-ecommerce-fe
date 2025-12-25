import {
  DownloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Flex, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Search } from '~/assets/svg';
import { getAllOrder } from '~/features/order/store/orderThunks';
import { IOrderManagement, IOrderParams } from '~/features/order/types/order';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import usePagination from '~/shared/hooks/usePagination';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { convertToVND } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import OrderFilter from './OrderFilter';

interface ISearchForm {
  search: string;
}

interface IFilterForm {
  createdDate?: string[];
  status?: string;
}

const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const queryParams = useQueryParams();

  const [searchForm] = useForm<ISearchForm>();
  const [filterForm] = useForm<IFilterForm>();

  const [filterParams, setFilterParams] = useState<IOrderParams>();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const orders = useAppSelector((state) => state.order);

  const { pageInfo, handlePageChange, resetPaginationAndUrl } = usePagination({
    extraParams: filterParams,
    setFilterParams,
    fetchFn: (params) => dispatch(getAllOrder(params)).unwrap(),
  });

  const columns: ColumnType<IOrderManagement>[] = [
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
      width: 150,
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
    },
    {
      key: '3',
      width: 200,
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
    },
    {
      key: '4',
      width: 150,
      title: 'Tổng',
      dataIndex: 'total',
      render: (total) => convertToVND(total),
    },
    {
      key: '5',
      width: 150,
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '6',
      width: 150,
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag
          color={
            status === 'confirmed'
              ? 'green'
              : status === 'cancelled'
              ? 'red'
              : 'gold'
          }
        >
          {status === 'confirmed'
            ? 'Hoàn thành'
            : status === 'cancelled'
            ? 'Từ chối'
            : 'Đang xử lý'}
        </Tag>
      ),
    },
    {
      key: '7',
      width: 150,
      title: 'Ngày chỉnh sửa',
      dataIndex: 'updatedAt',
      render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      key: '8',
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
                  PATH.ADMIN_ORDER_DETAILS.replace(':orderId', record?.id)
                )
              }
            />
          </Flex>
        );
      },
    },
  ];

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

    filterForm.setFields([
      { name: 'status', value: queryValues?.status },
      { name: 'createdDate', value: [createdFrom, createdTo] },
    ]);
    searchForm.setFieldValue('search', queryValues?.search);

    setTitle('Đơn hàng');
    setBreadcrumb([
      { title: 'Trang chủ', href: PATH.ADMIN_ORDER_MANAGEMENT },
      { title: 'Đơn hàng' },
    ]);
  }, []);

  const handleSearch = (values: ISearchForm) => {
    const { search } = values;

    resetPaginationAndUrl();
    setFilterParams({ ...filterParams, search });
  };

  const handleCancel = () => {
    filterForm.resetFields();

    resetPaginationAndUrl();

    setIsFilterVisible(false);
    setFilterParams({
      status: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    });
  };

  const handleFinishFilter = (values: IFilterForm) => {
    const { createdDate, status } = values;
    const params: IOrderParams = {
      status,
      createdFrom: createdDate?.[0]
        ? dayjs(createdDate?.[0]).startOf('day').toISOString()
        : undefined,
      createdTo: createdDate?.[1]
        ? dayjs(createdDate?.[1]).endOf('day').toISOString()
        : undefined,
    };

    setIsFilterVisible(false);

    resetPaginationAndUrl();
    setFilterParams(params);
  };

  return (
    <Layout className="border border-gray-200 rounded-lg overflow-hidden">
      <Content className="flex items-center justify-between">
        <Flex vertical>
          <h2 className="font-semibold capitalize text-lg text-primary">
            Danh sách Đơn hàng
          </h2>
          <p className="text-body">Quản lý đơn hàng</p>
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
        </Flex>
      </Content>
      <Content className="flex items-center justify-between border-t border-b border-gray-200">
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
        </Space>
        <OrderFilter
          form={filterForm}
          open={isFilterVisible}
          onCancel={handleCancel}
          setIsOpen={setIsFilterVisible}
          onFinish={handleFinishFilter}
        />
      </Content>

      <Content>
        <Table<IOrderManagement>
          columns={columns}
          loading={orders?.loading}
          dataSource={orders?.items}
          pagination={{
            current: pageInfo?.page,
            pageSize: pageInfo?.pageSize,
            total: orders?.pageInfo?.totalItems,
            onChange: handlePageChange,
          }}
        />
      </Content>
    </Layout>
  );
};

export default OrderManagement;
