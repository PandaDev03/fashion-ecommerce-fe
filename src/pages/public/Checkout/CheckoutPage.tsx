import { useMutation } from '@tanstack/react-query';
import { Divider, Flex, Layout } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PAGE_HEADER } from '~/assets/images';
import { clearCart } from '~/features/cart/stores/cartSlice';
import { orderApi } from '~/features/order/api/orderApi';
import { ICreateOrder } from '~/features/order/types/order';
import Button from '~/shared/components/Button/Button';
import { Checkbox } from '~/shared/components/Checkbox/Checkbox';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { convertToVND, getOrCreateGuestUserId } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';

interface IShippingAddressForm {
  name: string;
  address: string;
  phone: string;
  email: string;
  isSave?: boolean;
  orderNotes?: string;
}

const SHIPPING_INFO_STORAGE_KEY = 'shippingInfo';

const CheckoutPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [shippingAddressForm] = useForm<IShippingAddressForm>();

  const { currentUser } = useAppSelector((state) => state.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const { mutate: createOrder, isPending: isCreateOrderPending } = useMutation({
    mutationFn: (params: ICreateOrder) => orderApi.createOrder(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      const orderNumber = response?.data?.orderNumber;
      if (!orderNumber) {
        toast.error('Không tìm thấy ID của đơn đặt hàng');
        return;
      }

      navigate(PATH.ORDER.replace(':orderNumber', orderNumber));
      dispatch(clearCart());
    },
  });

  const totalPrice = useMemo(
    () =>
      cartItems?.reduce(
        (prev, current) =>
          (prev += Number(current?.variant?.price) * current?.quantity),
        0
      ),
    [cartItems]
  );

  useEffect(() => {
    const localShippingInfo = localStorage.getItem(SHIPPING_INFO_STORAGE_KEY);
    if (!localShippingInfo) return;

    const shippingInfo = JSON.parse(localShippingInfo);

    const fieldsValue: IShippingAddressForm = {
      isSave: true,
      name: shippingInfo?.name,
      address: shippingInfo?.address,
      phone: shippingInfo?.phone,
      email: shippingInfo?.email,
    };
    shippingAddressForm.setFieldsValue(fieldsValue);
  }, []);

  const handleSaveToLocal = (values: IShippingAddressForm) => {
    if (!values?.isSave) {
      localStorage.removeItem(SHIPPING_INFO_STORAGE_KEY);
      return;
    }

    const { name, address, phone, email } = values;
    localStorage.setItem(
      SHIPPING_INFO_STORAGE_KEY,
      JSON.stringify({ name, address, phone, email })
    );
  };

  const handleFinish = (values: IShippingAddressForm) => {
    handleSaveToLocal(values);

    let userId;
    if (currentUser || Object.keys(currentUser)?.length)
      userId = currentUser?.id;
    else {
      const guestUserId = getOrCreateGuestUserId();
      userId = guestUserId;
    }

    const orderItems: ICreateOrder['items'] = cartItems?.map((item) => ({
      productId: item?.id,
      productVariantId: item?.variant?.id,
      quantity: item?.quantity,
    }));

    const params: ICreateOrder = {
      userId,
      customerName: values?.name,
      customerAddress: values?.address,
      customerEmail: values?.email,
      customerPhone: values?.phone,
      note: values?.orderNotes,
      items: orderItems,
      paymentMethod: 'cod',
    };
    createOrder(params);
  };

  return (
    <Layout className="bg-white!">
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
            Checkout
          </h2>
        </div>
      </div>
      <Content className="w-full mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
        <div className="py-14 xl:py-20 px-0 2xl:max-w-screen-2xl xl:max-w-7xl mx-auto flex flex-col md:flex-row w-full">
          <div className="md:w-full lg:w-3/5 flex h-full flex-col -mt-1.5">
            <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-primary capitalize mb-6 xl:mb-8">
              Địa chỉ giao hàng
            </h2>
            <Form form={shippingAddressForm} onFinish={handleFinish}>
              <FormItem
                name="name"
                label="Tên người nhận"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên người nhận' },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input />
              </FormItem>
              <div className="grid grid-cols-2 gap-x-3">
                <FormItem
                  name="phone"
                  label="Số điện thoại"
                  rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
                >
                  <Input />
                </FormItem>
                <FormItem
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                >
                  <Input />
                </FormItem>
              </div>
              <FormItem name="isSave" valuePropName="checked">
                <Checkbox>Lưu thông tin này cho lần sau</Checkbox>
              </FormItem>
              <FormItem name="orderNotes" label="Ghi chú đơn hàng">
                <TextArea
                  className="min-h-[150px]!"
                  placeholder="Ghi chú về đơn đặt hàng của bạn, ví dụ: Ghi chú đặc biệt cho việc giao hàng"
                />
              </FormItem>
            </Form>
            <Flex>
              <Button
                title="Đặt hàng"
                loading={isCreateOrderPending}
                onClick={() => shippingAddressForm.submit()}
              />
            </Flex>
          </div>
          <div className="md:w-full lg:w-2/5 ltr:md:ml-7 rtl:md:mr-7 ltr:lg:ml-10 rtl:lg:mr-10 ltr:xl:ml-14 rtl:xl:mr-14 flex flex-col h-full -mt-1.5">
            <div className="pt-12 md:pt-0 ltr:2xl:pl-4 rtl:2xl:pr-4">
              <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-primary capitalize mb-6 xl:mb-8">
                Đơn hàng
              </h2>
              <Flex
                align="center"
                justify="space-between"
                className="p-4! rounded-md mt-6 md:mt-7 xl:mt-9 bg-gray-200 text-sm font-semibold text-primary"
              >
                <span>Sản phẩm</span>
                <span>Tạm tính</span>
              </Flex>
              {cartItems?.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="space-between"
                  className="py-4! items-center lg:px-3!"
                >
                  <Flex>
                    <Image
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      src={item?.variant?.imageMappings?.[0]?.image?.url}
                    />
                    <Flex vertical className="ltr:pl-3! rtl:pr-3!">
                      <div className="text-sm font-regular text-primary max-w-[250px] truncate">
                        Áo Polo Len Nam Tay Dài City Fade Form Regular
                      </div>
                      <span className="text-body">
                        {item?.variant?.optionValues
                          ?.map((optVal) => optVal?.optionValue?.value)
                          .join(' - ')}
                      </span>
                      <span className="text-body">x{item?.quantity}</span>
                    </Flex>
                  </Flex>
                  <span>
                    {convertToVND(
                      Number(item?.variant?.price) * item?.quantity
                    )}
                  </span>
                </Flex>
              ))}
              <Divider className="my-0!" />
              <Flex
                align="center"
                justify="space-between"
                className="py-4! lg:py-5! text-sm lg:px-3! w-full font-semibold text-primary"
              >
                <span>Tạm tính</span>
                <span>{convertToVND(totalPrice)}</span>
              </Flex>
              <Divider className="my-0!" />
              <Flex
                align="center"
                justify="space-between"
                className="py-4! lg:py-5! text-sm lg:px-3! w-full font-semibold text-primary"
              >
                <span>Vận chuyển</span>
                <span>{convertToVND(0)}</span>
              </Flex>
              <Divider className="my-0!" />
              <Flex
                align="center"
                justify="space-between"
                className="py-4! lg:py-5! text-lg lg:px-3! w-full font-semibold text-primary"
              >
                <span>Tổng</span>
                <span>{convertToVND(totalPrice)}</span>
              </Flex>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default CheckoutPage;
