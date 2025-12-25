import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Divider, Flex, Space, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FALLBACK_IMG } from '~/assets/images';
import { orderApi } from '~/features/order/api/orderApi';
import { IOrder, IUpdateOrderStatus } from '~/features/order/types/order';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import TextArea from '~/shared/components/Input/TextArea';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import Modal from '~/shared/components/Modal/Modal';
import Table from '~/shared/components/Table/Table';
import { useBreadcrumb } from '~/shared/contexts/BreadcrumbContext';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useTitle } from '~/shared/contexts/TitleContext';
import { convertToVND } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';

interface ICancelForm {
  reason: string;
}

const OrderDetailManagement = () => {
  const toast = useToast();

  const { setTitle } = useTitle();
  const { setBreadcrumb } = useBreadcrumb();

  const { orderId } = useParams<{ orderId: string }>();

  const [cancelForm] = useForm<ICancelForm>();

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState<IOrder>();

  const { mutate: getOrderById, isPending: isGetOrderByIdPending } =
    useMutation({
      mutationFn: (id: string) => orderApi.getOrderById(id),
      onSuccess: (response) => setOrderDetails(response?.data),
    });

  const { mutate: updateOrderStatus, isPending: isUpdateOrderStatusPending } =
    useMutation({
      mutationFn: (params: IUpdateOrderStatus) =>
        orderApi.updateOrderStatus(params),
      onSuccess: (response) => {
        toast.success(response?.message);

        refetch();
        handleCancelModal();
      },
    });

  const isDisabled = useMemo(
    () =>
      orderDetails?.status === 'confirmed' ||
      orderDetails?.status === 'cancelled' ||
      isUpdateOrderStatusPending,
    [orderDetails, isUpdateOrderStatusPending]
  );

  const columns: ColumnType<any>[] = [
    {
      key: '1',
      width: 50,
      title: 'STT',
      align: 'center',
      render: (_, __, index: number) => index + 1,
    },
    {
      key: '2',
      width: 250,
      title: 'Tên sản phẩm',
      render: (_, record) => {
        return (
          <Flex align="start" className="gap-x-2">
            <Image
              preview
              width={40}
              className="object-cover"
              src={record?.imageUrl || FALLBACK_IMG}
            />
            <Space direction="vertical">
              <p>{record?.productName}</p>
              <Flex className="gap-x-2">
                {record?.variantAttributes?.map((item: any) => (
                  <p className="py-1 px-2 bg-gray-200 text-body rounded-sm">
                    {item?.name}: {item?.value}
                  </p>
                ))}
              </Flex>
            </Space>
          </Flex>
        );
      },
    },
    {
      key: '3',
      width: 80,
      align: 'center',
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      key: '4',
      width: 80,
      title: 'Giá',
      align: 'center',
      dataIndex: 'totalPrice',
      render: (price) => convertToVND(price),
    },
  ];

  useEffect(() => {
    setTitle('Chi tiết đơn hàng');
    setBreadcrumb([
      { title: 'Đơn hàng', href: PATH.ADMIN_ORDER_MANAGEMENT },
      { title: 'Chi tiết đơn hàng' },
    ]);
  }, []);

  useEffect(() => {
    refetch();
  }, [orderId]);

  const refetch = () => {
    if (!orderId) {
      toast.error('Không tìm thấy ID của đơn hàng');
      return;
    }

    getOrderById(orderId);
  };

  const handleConfirmOrder = () => {
    if (!orderDetails?.id) {
      toast.error('Không tìm thấy ID của đơn hàng');
      return;
    }

    updateOrderStatus({ id: orderDetails?.id, status: 'confirmed' });
  };

  const handleCancelModal = () => {
    cancelForm.resetFields();
    setIsCancelModalVisible(false);
  };

  const handleCancelOrder = (values: ICancelForm) => {
    console.log(values);

    if (!orderDetails?.id) {
      toast.error('Không tìm thấy ID của đơn hàng');
      return;
    }

    updateOrderStatus({
      id: orderDetails?.id,
      status: 'cancelled',
      cancellationReason: values?.reason,
    });
  };

  return (
    <Layout loading={isGetOrderByIdPending}>
      <Space size="middle" direction="vertical" className="w-full">
        <Flex align="center" className="gap-x-1">
          <p className="text-body">Trạng thái:</p>
          <Tag
            color={
              orderDetails?.status === 'confirmed'
                ? 'green'
                : orderDetails?.status === 'cancelled'
                ? 'red'
                : 'gold'
            }
          >
            {orderDetails?.status === 'confirmed'
              ? 'Hoàn thành'
              : orderDetails?.status === 'cancelled'
              ? 'Từ chối'
              : 'Đang xử lý'}
          </Tag>
        </Flex>
        <Content className="border border-gray-200 rounded-lg overflow-hidden">
          <Flex align="center" justify="space-between">
            <h2 className="font-semibold text-xl text-primary">
              {orderDetails?.orderNumber || '-'}
            </h2>
            <Flex align="center" className="gap-x-2">
              <Button
                title="Từ chối"
                displayType="error"
                disabled={isDisabled}
                iconBefore={<CloseOutlined />}
                onClick={() => setIsCancelModalVisible(true)}
              />
              <Button
                title="Xác nhận"
                displayType="approve"
                disabled={isDisabled}
                iconBefore={<CheckOutlined />}
                onClick={handleConfirmOrder}
              />
            </Flex>
          </Flex>
        </Content>
        <div className="grid grid-cols-2 gap-x-3">
          <Content className="border border-gray-200 rounded-lg overflow-hidden">
            <Space direction="vertical" size="middle">
              <h3 className="font-semibold text-primary text-lg capitalize">
                Thông tin khách hàng
              </h3>
              <Space direction="vertical" size="small">
                <Flex vertical>
                  <p className="text-body">Họ tên</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.customerName}
                  </p>
                </Flex>
                <Flex vertical>
                  <p className="text-body">Số điện thoại</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.customerPhone}
                  </p>
                </Flex>
                <Flex vertical>
                  <p className="text-body">Email</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.customerEmail}
                  </p>
                </Flex>
                <Flex vertical>
                  <p className="text-body">Địa chỉ</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.customerAddress}
                  </p>
                </Flex>
              </Space>
            </Space>
          </Content>
          <Content className="border border-gray-200 rounded-lg overflow-hidden">
            <Space direction="vertical" size="middle">
              <h3 className="font-semibold text-primary text-lg capitalize">
                Thông tin đơn hàng
              </h3>
              <Space direction="vertical" size="small">
                <Flex vertical>
                  <p className="text-body">Ngày tạo</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.createdAt
                      ? dayjs(orderDetails?.createdAt).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : '-'}
                  </p>
                </Flex>
                <Flex vertical>
                  <p className="text-body">Phương thức thanh toán</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.paymentMethod === 'cod'
                      ? 'Thanh toán khi nhận hàng (COD)'
                      : '-'}
                  </p>
                </Flex>
                <Flex vertical>
                  <p className="text-body">Ghi chú</p>
                  <p className="font-semibold text-primary">
                    {orderDetails?.note || '-'}
                  </p>
                </Flex>
              </Space>
            </Space>
          </Content>
        </div>
        <Content className="border border-gray-200 rounded-lg overflow-hidden">
          <Space direction="vertical" size="middle" className="w-full">
            <h3 className="font-semibold text-primary text-lg capitalize">
              Sản phẩm ({orderDetails?.items?.length || 0})
            </h3>
            <Table
              columns={columns}
              dataSource={orderDetails?.items}
              pagination={{ total: orderDetails?.items?.length }}
            />
          </Space>

          <Flex justify="end" className="mt-7!">
            <Space
              size="middle"
              direction="vertical"
              className="w-full max-w-[500px]"
            >
              <h3 className="font-semibold text-primary text-lg capitalize">
                Tổng đơn hàng
              </h3>
              <Space direction="vertical" className="w-full">
                <Flex align="center" justify="space-between">
                  <p>Tạm tính</p>
                  <p>{convertToVND(orderDetails?.subtotal)}</p>
                </Flex>
                <Flex align="center" justify="space-between">
                  <p>Phí vận chuyển</p>
                  <p>{convertToVND(orderDetails?.shippingFee)}</p>
                </Flex>
                <Divider className="my-1!" />
                <Flex align="center" justify="space-between">
                  <p className="font-semibold text-primary">Tổng</p>
                  <p className="font-semibold text-primary">
                    {convertToVND(orderDetails?.total)}
                  </p>
                </Flex>
              </Space>
            </Space>
          </Flex>
        </Content>
      </Space>

      <Modal
        title="Từ chối đơn hàng"
        open={isCancelModalVisible}
        loading={isUpdateOrderStatusPending}
        onCancel={handleCancelModal}
        onOk={() => cancelForm.submit()}
      >
        <Form
          form={cancelForm}
          onFinish={handleCancelOrder}
          onCancel={handleCancelModal}
        >
          <FormItem
            spacing="none"
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <TextArea
              className="min-h-[200px]!"
              placeholder="Lý do từ chối..."
            />
          </FormItem>
        </Form>
      </Modal>
    </Layout>
  );
};

export default OrderDetailManagement;
