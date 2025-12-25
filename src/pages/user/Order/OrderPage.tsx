import { EyeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Space, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { orderApi } from '~/features/order/api/orderApi';
import { IOrder } from '~/features/order/types/order';
import Button from '~/shared/components/Button/Button';
import { Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { convertToVND } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';

const AccountOrderPage = () => {
  const navigate = useNavigate();
  const { isLg } = useBreakpoint();

  const [orders, setOrders] = useState<IOrder[]>([]);

  const { mutate: getOrderByUserId, isPending } = useMutation({
    mutationFn: () => orderApi.getOrderByUserId(),
    onSuccess: (response) => {
      console.log(response);
      setOrders(response?.data);
    },
  });

  const columns: ColumnType<IOrder>[] = [
    {
      key: '1',
      width: 150,
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
    },
    {
      key: '2',
      width: 150,
      title: 'Tổng',
      dataIndex: 'total',
      render: (total) => convertToVND(total),
    },
    {
      key: '3',
      width: 150,
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'pending' ? 'gold' : 'green'}>
          {status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'}
        </Tag>
      ),
    },
    {
      key: '4',
      width: 200,
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      render: (createAt) =>
        createAt ? dayjs(createAt).format('DD/MM/YYYY HH:mm:ss') : '-',
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
                  PATH.ORDER.replace(':orderNumber', record?.orderNumber)
                )
              }
            />
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    getOrderByUserId();
  }, []);

  return (
    <Layout loading={isPending} className="bg-white!">
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-primary xl:mb-8 capitalize">
        Đơn đặt hàng
      </h2>
      {isLg ? (
        <Table<IOrder> columns={columns} dataSource={orders} />
      ) : (
        <Space size="middle" direction="vertical">
          {orders?.map((order) => (
            <Flex
              vertical
              className="px-4! pt-5! pb-6! gap-y-7 text-sm font-semibold border border-gray-300 rounded-md text-primary"
            >
              <>
                <Flex align="center" justify="space-between">
                  <p className="uppercase">Mã đơn hàng</p>
                  <p className="font-normal">{order?.orderNumber || '-'}</p>
                </Flex>
                <Flex align="center" justify="space-between">
                  <p className="uppercase">Ngày đặt hàng</p>
                  <p className="font-normal">
                    {order?.createdAt
                      ? dayjs(order?.createdAt).format('DD/MM/YYYY HH:mm:ss')
                      : '-'}
                  </p>
                </Flex>
                <Flex align="center" justify="space-between">
                  <p className="uppercase">Trạng thái</p>
                  <p className="font-normal">
                    {order?.status
                      ? order?.status === 'pending'
                        ? 'Đang xử lý'
                        : 'Hoàn thành'
                      : '-'}
                  </p>
                </Flex>
                <Flex align="center" justify="space-between">
                  <p className="uppercase">Tổng</p>
                  <p className="font-normal">{convertToVND(order?.total)}</p>
                </Flex>
                <Flex align="center" justify="space-between">
                  <p className="uppercase">Thao tác</p>
                  <Button
                    title="Xem chi tiết"
                    onClick={() =>
                      navigate(
                        PATH.ORDER.replace(':orderNumber', order?.orderNumber)
                      )
                    }
                  />
                </Flex>
              </>
            </Flex>
          ))}
        </Space>
      )}
    </Layout>
  );
};

export default AccountOrderPage;
