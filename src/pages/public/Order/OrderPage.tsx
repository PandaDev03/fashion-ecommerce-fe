import { useMutation } from '@tanstack/react-query';
import { Flex } from 'antd';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PAGE_HEADER } from '~/assets/images';
import { SuccessFill } from '~/assets/svg';
import { orderApi } from '~/features/order/api/orderApi';
import { IOrder } from '~/features/order/types/order';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Table from '~/shared/components/Table/Table';
import { useToast } from '~/shared/contexts/NotificationContext';
import { convertToVND } from '~/shared/utils/function';

const OrderPage = () => {
  const toast = useToast();

  const [order, setOrder] = useState<IOrder>();
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { mutate: getOrderByNumber, isPending: isGetOrderByNumberPending } =
    useMutation({
      mutationFn: (orderNumber: string) =>
        orderApi.getOrderByNumber(orderNumber),
      onSuccess: (response) => setOrder(response?.data),
    });

  const orderDate = useMemo(() => {
    if (!order) return '-';

    const { createdAt } = order;
    return createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss') : '-';
  }, [order]);

  const columns: ColumnType<IOrder['items'][number]>[] = [
    {
      key: '1',
      title: 'Sản phẩm',
      className: 'w-2/3 lg:w-1/2',
      render: (_, record) => {
        return (
          <p>
            {record?.productName},{' '}
            {record?.variantAttributes?.map((attr) => attr.value).join(' - ')} *{' '}
            {record?.quantity}
          </p>
        );
      },
    },
    {
      key: '1',
      title: 'Tổng',
      className: 'lg:w-1/2',
      render: (_, record) => {
        return <p>{convertToVND(record?.totalPrice)}</p>;
      },
    },
  ];

  useEffect(() => {
    if (!orderNumber) {
      toast.error('Không tìm thấy "orderNumber" của đơn đặt hàng');
      return;
    }

    getOrderByNumber(orderNumber);
  }, [orderNumber]);

  return (
    <Layout loading={isGetOrderByNumberPending}>
      <div
        style={{
          backgroundImage: `url(${PAGE_HEADER})`,
        }}
        className="flex justify-center p-6 md:p-10 2xl:p-8 relative bg-no-repeat bg-center bg-cover"
      >
        <div className="absolute top-0 ltr:left-0 rtl:right-0 bg-black w-full h-full opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
        <div className="w-full flex items-center justify-center relative z-10 py-10 md:py-14 lg:py-20 xl:py-24 2xl:py-32">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center">
            <span className="font-satisfy block font-normal mb-3">explore</span>
            Order
          </h2>
        </div>
      </div>
      <Content className="w-full mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
        <div className="xl:px-32 2xl:px-44 3xl:px-56 py-16 lg:py-20">
          <Flex
            align="center"
            className="border border-gray-300 bg-gray-50 px-4! lg:px-5! py-4! rounded-md text-primary text-sm md:text-base mb-6! lg:mb-8!"
          >
            <Flex
              align="center"
              justify="center"
              className="w-10 h-10 ltr:mr-3! rtl:ml-3! ltr:xl:mr-4! rtl:xl:ml-4! rounded-full bg-gray-300 shrink-0"
            >
              <SuccessFill />
            </Flex>
            <span>Cảm ơn. Đơn đặt hàng của bạn đã được nhận.</span>
          </Flex>
          <Flex className="border border-gray-300 bg-gray-50 rounded-md flex-col lg:flex-row mb-7! lg:mb-8! xl:mb-10!">
            <div className="font-semibold text-primary text-base lg:text-lg border-b lg:border-b-0 lg:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
              <span className="uppercase text-[11px] block text-body font-normal leading-5">
                Mã đơn hàng:
              </span>
              <span>{order?.orderNumber}</span>
            </div>
            <div className="font-semibold text-primary text-base lg:text-lg border-b lg:border-b-0 lg:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
              <span className="uppercase text-[11px] block text-body font-normal leading-5">
                Ngày đặt hàng:
              </span>
              <span>{orderDate}</span>
            </div>
            <div className="font-semibold text-primary text-base lg:text-lg border-b lg:border-b-0 lg:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
              <span className="uppercase text-[11px] block text-body font-normal leading-5">
                Email:
              </span>
              <span>{order?.customerEmail}</span>
            </div>
            <div className="font-semibold text-primary text-base lg:text-lg border-b lg:border-b-0 lg:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
              <span className="uppercase text-[11px] block text-body font-normal leading-5">
                Tổng:
              </span>
              <span>{convertToVND(order?.total)}</span>
            </div>
            <div className="font-semibold text-primary text-base lg:text-lg border-b lg:border-b-0 lg:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
              <span className="uppercase text-[11px] block text-body font-normal leading-5">
                Phương thức thanh toán:
              </span>
              <span>COD</span>
            </div>
          </Flex>
          <div className="pt-10 lg:pt-12">
            <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-primary xl:mb-8 capitalize">
              Chi tiết đơn hàng:
            </h2>
            <Table<IOrder['items'][number]>
              columns={columns}
              pagination={false}
              scroll={{ scrollToFirstRowOnChange: false }}
              dataSource={order?.items}
            />
            <div className="grid grid-cols-3 lg:grid-cols-2">
              <div className="py-3 px-2 bg-[#FAFAFA] max-lg:col-span-2">
                <p className="font-semibold text-primary uppercase">Tạm tính</p>
              </div>
              <div className="py-3 px-2 bg-[#FAFAFA]">
                <p className="font-semibold text-primary uppercase">
                  {convertToVND(order?.subtotal)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2">
              <div className="py-3 px-2 max-lg:col-span-2">
                <p className="font-semibold text-primary uppercase">
                  Vận chuyển
                </p>
              </div>
              <div className="py-3 px-2">
                <p className="font-semibold text-primary uppercase">
                  {convertToVND(order?.shippingFee)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2">
              <div className="py-3 px-2 bg-[#FAFAFA] max-lg:col-span-2">
                <p className="font-semibold text-primary uppercase">Tổng</p>
              </div>
              <div className="py-3 px-2 bg-[#FAFAFA]">
                <p className="font-semibold text-primary uppercase">
                  {convertToVND(order?.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default OrderPage;
