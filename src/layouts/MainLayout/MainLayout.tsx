import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Divider, Dropdown, Flex, MenuProps, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  FALLBACK_IMG,
  PROFILE_PICTURE,
  SUBSCRIPTION_BG,
} from '~/assets/images';
import { EmptyCart, LOGO, Trash } from '~/assets/svg';
import { AuthApi } from '~/features/auth/api/auth';
import AuthModal from '~/features/auth/components/AuthModal';
import {
  ISignIn,
  ISignInWithGoogle,
  ISignUp,
} from '~/features/auth/types/auth';
import {
  deleteCartItem,
  updateQuantity,
} from '~/features/cart/stores/cartSlice';
import { getCartItems } from '~/features/cart/stores/cartThunks';
import { resetUser } from '~/features/user/stores/userSlice';
import { getMe } from '~/features/user/stores/userThunks';
import Button from '~/shared/components/Button/Button';
import Drawer from '~/shared/components/Drawer/Drawer';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import { Layout } from '~/shared/components/Layout/Layout';
import Link from '~/shared/components/Link/Link';
import Menu from '~/shared/components/Menu/Menu';
import QuantitySelector from '~/shared/components/QuantitySelector/QuantitySelector';
import { useToast } from '~/shared/contexts/NotificationContext';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { convertToVND } from '~/shared/utils/function';
import BottomNavBar from './components/BottomNavBar/BottomNavBar';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

const siderMenu: MenuProps['items'] = [
  {
    key: 'fashion',
    label: 'Thời trang',
    children: [
      {
        key: 'top-wear',
        label: 'Áo',
        children: [
          {
            key: 't-shirt',
            label: 'Áo Thun (Áo Phông)',
          },
          {
            key: 'casual-shirt',
            label: 'Áo Sơ mi Thường ngày',
          },
          {
            key: 'business-shirt',
            label: 'Áo Sơ mi Công sở',
          },
          {
            key: 'blazer-coat',
            label: 'Áo Blazer & Áo Khoác',
          },
          {
            key: 'suit',
            label: 'Bộ Vest (Com-lê)',
          },
          {
            key: 'jacket',
            label: 'Áo khoác (Jackets)',
          },
        ],
      },
      {
        key: 'belt',
        label: 'Dây lưng, Khăn choàng & Khác',
      },
      {
        key: 'watches',
        label: 'Đồng hồ & Thiết bị đeo',
      },
      {
        key: 'western',
        label: 'Trang phục phong cách Tây',
        children: [
          {
            key: 'dress',
            label: 'Váy (Đầm)',
          },
          {
            key: 'jumpsuit',
            label: 'Đồ Liền (Jumpsuit)',
          },
          {
            key: 'shirt-blouse',
            label: 'Áo kiểu, Áo Thun & Áo sơ mi',
          },
          {
            key: 'short-skirt',
            label: 'Quần Short & Chân Váy',
          },
          {
            key: 'shrug',
            label: 'Áo khoác mỏng (Shrug)',
          },
          {
            key: 'blazer',
            label: 'Áo Blazer',
          },
        ],
      },
      {
        key: 'plus-size',
        label: 'Kích cỡ Lớn (Big Size)',
      },
      {
        key: 'sung-glasses',
        label: 'Kính mát & Gọng kính',
      },
      {
        key: 'foot-wear',
        label: 'Giày Dép',
        children: [
          {
            key: 'flat-shoes',
            label: 'Giày Đế bệt',
          },
          {
            key: 'casual-shoes',
            label: 'Giày Thường ngày',
          },
          {
            key: 'heels',
            label: 'Giày Cao gót',
          },
          {
            key: 'boots',
            label: 'Giày Boots/Bốt',
          },
        ],
      },
      {
        key: 'sport-wear',
        label: 'Đồ Thể thao & Vận động',
        children: [
          {
            key: 'clothing',
            label: 'Quần áo',
          },
          {
            key: 'footwear',
            label: 'Giày Dép',
          },
          {
            key: 'sport-accessories',
            label: 'Phụ kiện Thể thao',
          },
        ],
      },
      {
        key: 'lingerie',
        label: 'Đồ Lót & Đồ Ngủ',
        children: [
          {
            key: 'bra',
            label: 'Áo Ngực',
          },
          {
            key: 'panties',
            label: 'Quần Lót',
          },
          {
            key: 'sleep-wear',
            label: 'Đồ Ngủ',
          },
        ],
      },
      {
        key: 'scarves',
        label: 'Dây lưng, Khăn choàng & Khác',
        children: [
          {
            key: 'makeup',
            label: 'Trang điểm',
          },
          {
            key: 'skincare',
            label: 'Chăm sóc Da',
          },
          {
            key: 'luxury-cosmetic',
            label: 'Mỹ phẩm Cao cấp',
          },
          {
            key: 'lipstick',
            label: 'Son môi',
          },
        ],
      },
      {
        key: 'gadgets',
        label: 'Thiết bị Công nghệ',
        children: [
          {
            key: 'wearable-devices',
            label: 'Thiết bị Đeo thông minh',
          },
          {
            key: 'headphone',
            label: 'Tai nghe',
          },
        ],
      },
      {
        key: 'jewellers',
        label: 'Trang Sức',
        children: [
          {
            key: 'fashion-jewelry',
            label: 'Trang sức Thời trang',
          },
          {
            key: 'fine-jewelry',
            label: 'Trang sức Cao cấp',
          },
        ],
      },
      {
        key: 'backpacks',
        label: 'Balo',
      },
      {
        key: 'handbags',
        label: 'Túi xách & Ví',
      },
    ],
  },
  // {
  //   key: 'women-wear',
  //   label: 'Thời trang Nữ',
  //   children: [
  //     {
  //       key: 'top-wear',
  //       label: 'Áo',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Áo Thun (Áo Phông)',
  //         },
  //         {
  //           key: '2',
  //           label: 'Áo Sơ mi Thường ngày',
  //         },
  //         {
  //           key: '3',
  //           label: 'Áo Sơ mi Công sở',
  //         },
  //         {
  //           key: '4',
  //           label: 'Áo Blazer & Áo Khoác',
  //         },
  //         {
  //           key: '5',
  //           label: 'Bộ Vest (Com-lê)',
  //         },
  //         {
  //           key: '6',
  //           label: 'Áo khoác (Jackets)',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'belt',
  //       label: 'Dây lưng, Khăn choàng & Khác',
  //     },
  //     {
  //       key: 'watches',
  //       label: 'Đồng hồ & Thiết bị đeo',
  //     },
  //     {
  //       key: 'western',
  //       label: 'Trang phục phong cách Tây',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Váy (Đầm)',
  //         },
  //         {
  //           key: '2',
  //           label: 'Đồ Liền (Jumpsuit)',
  //         },
  //         {
  //           key: '3',
  //           label: 'Áo kiểu, Áo Thun & Áo sơ mi',
  //         },
  //         {
  //           key: '4',
  //           label: 'Quần Short & Chân Váy',
  //         },
  //         {
  //           key: '5',
  //           label: 'Áo khoác mỏng (Shrug)',
  //         },
  //         {
  //           key: '6',
  //           label: 'Áo Blazer',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'plus-size',
  //       label: 'Kích cỡ Lớn (Big Size)',
  //     },
  //     {
  //       key: 'sung-glasses',
  //       label: 'Kính mát & Gọng kính',
  //     },
  //     {
  //       key: 'foot-wear',
  //       label: 'Giày Dép',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Giày Đế bệt',
  //         },
  //         {
  //           key: '2',
  //           label: 'Giày Thường ngày',
  //         },
  //         {
  //           key: '3',
  //           label: 'Giày Cao gót',
  //         },
  //         {
  //           key: '4',
  //           label: 'Giày Boots/Bốt',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'sport-wear',
  //       label: 'Đồ Thể thao & Vận động',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Quần áo',
  //         },
  //         {
  //           key: '2',
  //           label: 'Giày Dép',
  //         },
  //         {
  //           key: '3',
  //           label: 'Phụ kiện Thể thao',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'lingerie',
  //       label: 'Đồ Lót & Đồ Ngủ',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Áo Ngực',
  //         },
  //         {
  //           key: '2',
  //           label: 'Quần Lót',
  //         },
  //         {
  //           key: '3',
  //           label: 'Đồ Ngủ',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'scarves',
  //       label: 'Dây lưng, Khăn choàng & Khác',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Trang điểm',
  //         },
  //         {
  //           key: '2',
  //           label: 'Chăm sóc Da',
  //         },
  //         {
  //           key: '3',
  //           label: 'Mỹ phẩm Cao cấp',
  //         },
  //         {
  //           key: '4',
  //           label: 'Son môi',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'gadgets',
  //       label: 'Thiết bị Công nghệ',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Thiết bị Đeo thông minh',
  //         },
  //         {
  //           key: '2',
  //           label: 'Tai nghe',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'jewellers',
  //       label: 'Trang Sức',
  //       children: [
  //         {
  //           key: '1',
  //           label: 'Trang sức Thời trang',
  //         },
  //         {
  //           key: '2',
  //           label: 'Trang sức Cao cấp',
  //         },
  //       ],
  //     },
  //     {
  //       key: 'backpacks',
  //       label: 'Balo',
  //     },
  //     {
  //       key: 'handbags',
  //       label: 'Túi xách & Ví',
  //     },
  //   ],
  // },
  {
    key: 'collection',
    label: 'Bộ sưu tập',
  },
  {
    key: 'search',
    label: 'Tìm kiếm',
  },
  {
    key: 'contac',
    label: 'Liên hệ',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
  },
  {
    key: 'order',
    label: 'Đơn hàng',
  },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const { isXl } = useBreakpoint();
  const dispatch = useAppDispatch();

  const [subscriptionForm] = useForm();
  const [signUpForm] = useForm<ISignUp>();
  const [signInForm] = useForm<ISignIn>();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);

  const { currentUser } = useAppSelector((state) => state.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  console.log(cartItems);

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      className: 'cursor-default! select-none! hover:bg-white!',
      label: (
        <p className="max-sm:max-w-[250px] truncate text-body">
          {currentUser?.email || '-'}
        </p>
      ),
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <Link to={'/'}>Trang tài khoản</Link>,
    },
    {
      key: '3',
      className: 'group hover:bg-[#FEE2E2]! ',
      label: <p className="group-has-hover:text-[#DC2626]">Đăng xuất</p>,
      icon: (
        <LogoutOutlined className="group-has-hover:[&>svg]:fill-[#DC2626]" />
      ),
      onClick: () => signOut(),
    },
  ];

  const isEmptyCart = useMemo(() => !cartItems?.length, [cartItems]);

  const totalPrice = useMemo(
    () =>
      cartItems?.reduce(
        (prev, current) =>
          (prev += Number(current?.variant?.price ?? 0) * current?.quantity),
        0
      ),
    [cartItems]
  );

  const { mutate: signUpMutate, isPending: isSignUpPending } = useMutation({
    mutationFn: (values: ISignUp) => AuthApi.signUp(values),
    onSuccess: async (response) => {
      toast.success(response?.message);

      const { email, password } = signUpForm.getFieldsValue();
      signInMutate({ email, password });
    },
  });

  const { mutate: signInMutate, isPending: isSignInPending } = useMutation({
    mutationFn: (values: ISignIn) => AuthApi.signIn(values),
    onSuccess: (response) => {
      dispatch(getMe());
      toast.success(response?.message);

      handleCancelAuthModal();
      setIsMenuDrawerVisible(false);
    },
  });

  const { mutate: signInWithGoogle, isPending: isSignInWithGooglePending } =
    useMutation({
      mutationFn: (values: ISignInWithGoogle) =>
        AuthApi.signInWithGoogle(values),
      onSuccess: (response) => {
        dispatch(getMe());
        toast.success(response?.message);

        handleCancelAuthModal();
        setIsMenuDrawerVisible(false);
      },
    });

  const { mutate: signOut, isPending: isSignOutPending } = useMutation({
    mutationFn: () => AuthApi.signOut(),
    onSuccess: (response) => {
      localStorage.removeItem('accessToken');
      toast.success(response?.message);

      dispatch(resetUser());
    },
  });

  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  const handleOpenAuthModal = () => {
    setIsAuthVisible(true);
  };

  const handleOpenMenuDrawer = () => {
    setIsMenuDrawerVisible(true);
  };

  const handleOpenCartDrawer = () => {
    setIsCartDrawerVisible(true);
  };

  const handleCancelAuthModal = () => {
    setIsAuthVisible(false);
    setIsSignUpVisible(false);

    signUpForm.resetFields();
    signInForm.resetFields();
  };

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    dispatch(updateQuantity({ variantId, quantity }));
  };

  const handleDeleteCartItem = (variantId: string) => {
    dispatch(deleteCartItem({ variantId }));
  };

  return (
    <Layout loading={isSignOutPending} className="max-lg:pb-14 bg-white!">
      <Header
        onSignOut={signOut}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />
      <div>
        {children}
        <div className="px-4 md:px-8 2xl:px-16 mt-9 lg:mt-10 xl:mt-14">
          <Flex
            vertical
            align={isXl ? 'start' : 'center'}
            className="px-5! sm:px-8! md:px-16! 2xl:px-24! relative overflow-hidden sm:items-center xl:items-start rounded-lg bg-[#f9f9f9] py-10! md:py-14! lg:py-16!"
          >
            <div className="-mt-1.5 lg:-mt-2 xl:-mt-0.5 text-center ltr:xl:text-left rtl:xl:text-right mb-7 md:mb-8 lg:mb-9 xl:mb-0">
              <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading mb-2 md:mb-2.5 lg:mb-3 xl:mb-3.5">
                Nhận lời khuyên của chuyên gia
              </h3>
              <p className="text-xs leading-6 text-body md:text-sm md:leading-7">
                Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin mới
                nhất.
              </p>
            </div>
            <Form
              layout="inline"
              form={subscriptionForm}
              onFinish={(values) => console.log(values)}
              className="w-full shrink-0 sm:w-96 md:w-[545px] md:mt-7! z-1"
            >
              <FormItem className="w-full max-w-full md:max-w-[74%] mb-[2%]! md:mr-[2%]!">
                <Input
                  placeholder="Nhập email của bạn"
                  className="h-11 md:h-12 min-h-12"
                />
              </FormItem>
              <Button
                title="Đăng ký"
                className="w-full max-w-full md:max-w-[24%] text-sm leading-4 px-5! md:px-6! lg:px-8! py-4! md:py-3.5! lg:py-4! mt-3! sm:mt-0! md:h-full"
                onClick={() => subscriptionForm.submit()}
              />
            </Form>
            <div
              style={{ backgroundImage: `url(${SUBSCRIPTION_BG})` }}
              className="hidden xl:block absolute w-full h-full right-0 top-0 bg-contain bg-right bg-no-repeat z-0"
            ></div>
          </Flex>
        </div>
      </div>
      <Footer />

      <BottomNavBar
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />

      <AuthModal
        open={isAuthVisible}
        signUpForm={signUpForm}
        signInForm={signInForm}
        isSignUpVisible={isSignUpVisible}
        loading={
          isSignUpPending || isSignInPending || isSignInWithGooglePending
        }
        onCancel={handleCancelAuthModal}
        setIsSignUpVisible={setIsSignUpVisible}
        onSignUp={(values) => signUpMutate(values)}
        onSignIn={(values) => signInMutate(values)}
        onSignInWithGoogle={(values) => signInWithGoogle(values)}
      />

      <Drawer
        title={<LOGO />}
        placement="left"
        open={isMenuDrawerVisible}
        rootClassName="z-[999]! [&>div]:z-[999]!"
        footer={
          Object.keys(currentUser)?.length > 0 ? (
            <Dropdown
              trigger={['click']}
              placement="topCenter"
              menu={{ items: menuItems }}
            >
              <Flex align="center" className="cursor-pointer gap-x-3">
                <Image
                  width={48}
                  height={48}
                  className="rounded-full"
                  fallback={PROFILE_PICTURE}
                  src={currentUser?.avatar || PROFILE_PICTURE}
                />
                <Flex vertical>
                  <h2 className="font-semibold text-primary">
                    {currentUser?.name}
                  </h2>
                  <p className="max-w-[200px] truncate text-body">
                    {currentUser?.email}
                  </p>
                </Flex>
              </Flex>
            </Dropdown>
          ) : (
            <Button
              title="Đăng nhập"
              className="w-full"
              onClick={() => setIsAuthVisible(true)}
            />
          )
        }
        onClose={() => setIsMenuDrawerVisible(false)}
      >
        <Menu mode="inline" items={siderMenu} />
      </Drawer>

      <Drawer
        width={500}
        open={isCartDrawerVisible}
        title={<p className="font-bold text-2xl text-primary">Giỏ hàng</p>}
        footer={
          <Button
            disabled={isEmptyCart}
            className="w-full py-4! px-5!"
            title={
              <Flex align="center" gap={25}>
                <p>Tiến hành thanh toán</p>
                {!isEmptyCart && <p>{convertToVND(totalPrice)}</p>}
              </Flex>
            }
          />
        }
        onClose={() => setIsCartDrawerVisible(false)}
      >
        {isEmptyCart ? (
          <Flex
            vertical
            align="center"
            justify="center"
            className="h-full px-5 pt-8 pb-5"
          >
            <EmptyCart />
            <p className="font-semibold text-lg text-primary">
              Giỏ hàng của bạn đang trống
            </p>
          </Flex>
        ) : (
          <Space size="middle" direction="vertical">
            {cartItems?.map((item, index) => (
              <>
                <div className="grid grid-cols-9 gap-x-3">
                  <img
                    src={item?.images?.[0]?.url}
                    className="col-span-3 rounded-lg object-cover"
                    onError={(element) => {
                      element.currentTarget.src = FALLBACK_IMG;
                      element.currentTarget.srcset = FALLBACK_IMG;
                    }}
                  />
                  <Flex vertical justify="space-between" className="col-span-4">
                    <Space direction="vertical">
                      <p className="font-semibold text-primary">{item?.name}</p>
                      <p className="text-body">
                        {item?.variant?.optionValues
                          ?.map((optVal) => optVal?.optionValue?.value)
                          .join(' - ')}
                      </p>
                      <span className="text-body">
                        Giá: {convertToVND(Number(item?.variant?.price ?? 0))}
                      </span>
                    </Space>
                    <Flex align="center" justify="space-between">
                      <QuantitySelector
                        size="small"
                        className="shrink-0"
                        quantity={item?.quantity}
                        onDecrease={() =>
                          handleUpdateQuantity(
                            item?.variant?.id,
                            item?.quantity > 1 ? -1 : 0
                          )
                        }
                        onIncrease={() =>
                          handleUpdateQuantity(item?.variant?.id, 1)
                        }
                      />
                    </Flex>
                  </Flex>
                  <Flex
                    vertical
                    align="end"
                    justify="space-between"
                    className="col-span-2"
                  >
                    <p className="font-semibold">
                      {convertToVND(
                        Number(item?.variant?.price ?? 0) * item?.quantity
                      )}
                    </p>
                    <Flex align="center" justify="end">
                      <Button
                        displayType="outlined"
                        title={<Trash />}
                        onClick={() => handleDeleteCartItem(item?.variant?.id)}
                      />
                    </Flex>
                  </Flex>
                </div>
                {index !== cartItems?.length - 1 && <Divider />}
              </>
            ))}
          </Space>
        )}
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
