import { EyeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Tag } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { orderApi } from '~/features/order/api/orderApi';
import { IOrder } from '~/features/order/types/order';
import Button from '~/shared/components/Button/Button';
import { Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import { convertToVND } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';

const AccountOrderPage = () => {
  const navigate = useNavigate();

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
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-primary xl:mb-8">
        Đơn đặt hàng
      </h2>
      <Table<IOrder> columns={columns} dataSource={orders} />
    </Layout>
  );
};

export default AccountOrderPage;
