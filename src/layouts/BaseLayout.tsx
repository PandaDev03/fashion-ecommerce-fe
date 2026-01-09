import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Drawer as AntdDrawer, Dropdown, Flex, MenuProps, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Link,
  matchPath,
  NavigateFunction,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { FALLBACK_IMG, PROFILE_PICTURE } from '~/assets/images';
import { CloseFill, EmptyCart, LOGO } from '~/assets/svg';
import { AuthApi } from '~/features/auth/api/auth';
import AuthModal from '~/features/auth/components/AuthModal';
import {
  IRequestPasswordReset,
  ISignIn,
  ISignInWithGoogle,
  ISignUp,
} from '~/features/auth/types/auth';
import {
  deleteCartItem,
  toggleCartDrawer,
  updateQuantity,
} from '~/features/cart/stores/cartSlice';
import { getCartItems } from '~/features/cart/stores/cartThunks';
import { ICart } from '~/features/cart/types/cart';
import { resetUser } from '~/features/user/stores/userSlice';
import { getMe } from '~/features/user/stores/userThunks';
import Button from '~/shared/components/Button/Button';
import Drawer from '~/shared/components/Drawer/Drawer';
import Image from '~/shared/components/Image/Image';
import { Layout } from '~/shared/components/Layout/Layout';
import Menu from '~/shared/components/Menu/Menu';
import QuantitySelector from '~/shared/components/QuantitySelector/QuantitySelector';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { LATEST_ORDER_NUMBER_STORAGE_KEY } from '~/shared/utils/constants';
import {
  convertToVND,
  validateStockAvailability,
} from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import BottomNavBar from './components/BottomNavBar/BottomNavBar';
import Header from './components/Header/Header';

export type IForgotPasswordForm = IRequestPasswordReset;

export interface IFormVisible {
  signUpVisible?: boolean;
  signInVisible?: boolean;
  recoverVisible?: boolean;
}

const TOAST_COOLDOWN = 2000;
const ORDER_MENU_KEY = 'order-menu-key';

const getSiderMenu = (
  latestOrderNumber: string | null,
  navigate?: NavigateFunction
): MenuProps['items'] => [
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'casual-shirt',
            label: 'Áo Sơ mi Thường ngày',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'business-shirt',
            label: 'Áo Sơ mi Công sở',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'blazer-coat',
            label: 'Áo Blazer & Áo Khoác',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'suit',
            label: 'Bộ Vest (Com-lê)',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'jacket',
            label: 'Áo khoác (Jackets)',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
        ],
      },
      {
        key: 'belt',
        label: 'Dây lưng, Khăn choàng & Khác',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
      {
        key: 'watches',
        label: 'Đồng hồ & Thiết bị đeo',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
      {
        key: 'western',
        label: 'Trang phục phong cách Tây',
        children: [
          {
            key: 'dress',
            label: 'Váy (Đầm)',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'jumpsuit',
            label: 'Đồ Liền (Jumpsuit)',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'shirt-blouse',
            label: 'Áo kiểu, Áo Thun & Áo sơ mi',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'short-skirt',
            label: 'Quần Short & Chân Váy',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'shrug',
            label: 'Áo khoác mỏng (Shrug)',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'blazer',
            label: 'Áo Blazer',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
        ],
      },
      {
        key: 'plus-size',
        label: 'Kích cỡ Lớn (Big Size)',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
      {
        key: 'sung-glasses',
        label: 'Kính mát & Gọng kính',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
      {
        key: 'foot-wear',
        label: 'Giày Dép',
        children: [
          {
            key: 'flat-shoes',
            label: 'Giày Đế bệt',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'casual-shoes',
            label: 'Giày Thường ngày',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'heels',
            label: 'Giày Cao gót',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'boots',
            label: 'Giày Boots/Bốt',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'footwear',
            label: 'Giày Dép',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'sport-accessories',
            label: 'Phụ kiện Thể thao',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'panties',
            label: 'Quần Lót',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'sleep-wear',
            label: 'Đồ Ngủ',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'skincare',
            label: 'Chăm sóc Da',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'luxury-cosmetic',
            label: 'Mỹ phẩm Cao cấp',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'lipstick',
            label: 'Son môi',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'headphone',
            label: 'Tai nghe',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
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
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
          {
            key: 'fine-jewelry',
            label: 'Trang sức Cao cấp',
            onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
          },
        ],
      },
      {
        key: 'backpacks',
        label: 'Balo',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
      {
        key: 'handbags',
        label: 'Túi xách & Ví',
        onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG), //
      },
    ],
  },
  {
    key: 'collection',
    label: 'Bộ sưu tập',
    onClick: () => navigate?.(PATH.PRODUCTS_WITHOUT_SLUG),
  },
  {
    key: 'search',
    label: 'Tìm kiếm',
  },
  {
    key: 'contact',
    label: 'Liên hệ',
  },
  {
    key: PATH.CHECKOUT,
    label: 'Thanh toán',
  },
  {
    key: ORDER_MENU_KEY,
    label: 'Đơn hàng',
    onClick: () => {
      const link = latestOrderNumber
        ? PATH.ORDER.replace(':orderNumber', latestOrderNumber)
        : PATH.ORDER_WITHOUT_ORDER_NUMBER;
      navigate?.(link);
    },
  },
];

const routePatterns = [
  { pattern: PATH.CHECKOUT, keys: [PATH.CHECKOUT] },
  { pattern: PATH.ORDER_WITHOUT_ORDER_NUMBER, keys: [ORDER_MENU_KEY] },
  { pattern: PATH.ORDER, keys: [ORDER_MENU_KEY] },
];

const initialFormVisible: IFormVisible = {
  signInVisible: false,
  signUpVisible: false,
  recoverVisible: false,
};

const BaseLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toast = useToast();
  const location = useLocation();
  const lastToastTime = useRef(0);

  const [signUpForm] = useForm<ISignUp>();
  const [signInForm] = useForm<ISignIn>();
  const [forgotPasswordForm] = useForm<IForgotPasswordForm>();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);

  const [isFormVisible, setIsFormVisible] =
    useState<IFormVisible>(initialFormVisible);

  const { currentUser } = useAppSelector((state) => state.user);
  const { items: cartItems, isCartDrawerOpen } = useAppSelector(
    (state) => state.cart
  );

  const latestOrderNumber = localStorage.getItem(
    LATEST_ORDER_NUMBER_STORAGE_KEY
  );

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
      label: <Link to={PATH.ACCOUNT_DETAILS}>Trang tài khoản</Link>,
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

  const dynamicSiderMenu = useMemo(() => {
    return getSiderMenu(latestOrderNumber, navigate);
  }, [latestOrderNumber, navigate]);

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
      toast.success(response?.message);

      dispatch(getMe());
      handleCancelAuthModal();
      setIsMenuDrawerVisible(false);
    },
  });

  const { mutate: signInWithGoogle, isPending: isSignInWithGooglePending } =
    useMutation({
      mutationFn: (values: ISignInWithGoogle) =>
        AuthApi.signInWithGoogle(values),
      onSuccess: (response) => {
        toast.success(response?.message);

        dispatch(getMe());
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

  const {
    mutate: requestPasswordReset,
    isPending: isRequestPasswordResetPending,
  } = useMutation({
    mutationFn: (params: IRequestPasswordReset) =>
      AuthApi.requestPasswordReset(params),
    onSuccess: (response) => {
      toast.success(response?.message);
      forgotPasswordForm.resetFields();
    },
  });

  useEffect(() => {
    dispatch(getCartItems());
  }, []);

  const getSelectedKey = (pathname: string) => {
    for (const { pattern, keys } of routePatterns)
      if (matchPath({ path: pattern, end: false }, pathname)) return keys;

    return [pathname];
  };

  const handleOpenAuthModal = () => {
    setIsAuthVisible(true);
    setIsFormVisible({
      signUpVisible: false,
      signInVisible: true,
      recoverVisible: false,
    });
  };

  const handleOpenMenuDrawer = () => {
    setIsMenuDrawerVisible(true);
  };

  const handleOpenCartDrawer = () => {
    dispatch(toggleCartDrawer(true));
  };

  const handleCancelAuthModal = () => {
    setIsAuthVisible(false);
    setIsFormVisible(initialFormVisible);

    signUpForm.resetFields();
    signInForm.resetFields();
  };

  const handleDecrease = (item: ICart) => {
    if (!item?.variant?.id) {
      toast.error('Không tìm thấy ID của biến thể');
      return;
    }

    dispatch(
      updateQuantity({
        variantId: item?.variant?.id,
        quantity: item?.quantity > 1 ? -1 : 0,
      })
    );
  };

  const handleIncrease = (item: ICart) => {
    if (!item?.variant?.id || !item?.variant?.stock) {
      toast.error('Không tìm thấy ID của biến thể');
      return;
    }

    const { variant } = item;
    const newQuantity = item?.quantity + 1;

    const isAvailableStock = validateStockAvailability({
      item: {
        quantity: newQuantity,
        stock: variant?.stock,
        optionValues: variant?.optionValues,
      },
      toastCoolDown: TOAST_COOLDOWN,
      lastToastTime,
    });

    if (!isAvailableStock) return;

    dispatch(
      updateQuantity({
        variantId: item?.variant?.id,
        quantity: 1,
      })
    );
  };

  const handleDeleteCartItem = (variantId?: string) => {
    if (!variantId) {
      toast.error('Không tìm thấy ID của biến thể');
      return;
    }

    dispatch(deleteCartItem({ variantId }));
  };

  const handleCheckout = () => {
    dispatch(toggleCartDrawer(false));
    navigate(PATH.CHECKOUT);
  };

  return (
    <Layout loading={isSignOutPending} className="max-lg:pb-14 bg-white!">
      <Header
        onSignOut={signOut}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />

      {children}

      <BottomNavBar
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />

      <AuthModal
        open={isAuthVisible}
        signUpForm={signUpForm}
        signInForm={signInForm}
        forgotPasswordForm={forgotPasswordForm}
        isFormVisible={isFormVisible}
        loading={
          isSignUpPending ||
          isSignInPending ||
          isSignInWithGooglePending ||
          isRequestPasswordResetPending
        }
        onCancel={handleCancelAuthModal}
        setIsFormVisible={setIsFormVisible}
        onSignUp={(values) => signUpMutate(values)}
        onSignIn={(values) => signInMutate(values)}
        onSignInWithGoogle={(values) => signInWithGoogle(values)}
        onForgotPassword={(values) => requestPasswordReset(values)}
      />

      <Drawer
        title={
          <LOGO
            className="cursor-pointer"
            onClick={() => navigate(PATH.HOME)}
          />
        }
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
              onClick={handleOpenAuthModal}
            />
          )
        }
        onClose={() => setIsMenuDrawerVisible(false)}
      >
        <Menu
          mode="inline"
          items={dynamicSiderMenu}
          selectedKeys={getSelectedKey(location.pathname)}
          defaultOpenKeys={location?.state?.key ? [location?.state?.key] : []}
          onSelect={(e) => {
            if (e.key.startsWith('/') || Object.values(PATH).includes(e.key))
              navigate(e.key, {
                state: { key: e.key, parentKey: e.keyPath?.[1] },
              });
          }}
        />
      </Drawer>

      <AntdDrawer
        width={500}
        open={isCartDrawerOpen}
        classNames={{
          wrapper: 'sm:max-w-[80%]!',
          header: '[&>*:first-child]:flex-row-reverse',
        }}
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
            onClick={handleCheckout}
          />
        }
        onClose={() => dispatch(toggleCartDrawer(false))}
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
          <Space size="middle" direction="vertical" className="w-full">
            {cartItems?.map((item, index) => {
              const defaultImg =
                item?.images?.[0] || item?.variant?.imageMappings?.[0]?.image;

              return (
                <Flex
                  key={index}
                  align="center"
                  className="w-full h-auto bg-white py-4 md:py-7 border-b border-gray-100 relative last:border-b-0"
                >
                  <div
                    className="group relative flex shrink-0 w-24 h-24 overflow-hidden bg-gray-200 rounded-md cursor-pointer md:w-28 md:h-28 ltr:mr-4 rtl:ml-4"
                    onClick={() => handleDeleteCartItem(item?.variant?.id)}
                  >
                    <img
                      className="w-full rounded-lg object-cover"
                      src={defaultImg?.url}
                      onError={(element) => {
                        element.currentTarget.src = FALLBACK_IMG;
                        element.currentTarget.srcset = FALLBACK_IMG;
                      }}
                    />
                    <div className="absolute flex items-center justify-center top-0 w-full h-full transition duration-200 ease-in-out bg-[#0000004d] ltr:left-0 rtl:right-0 md:bg-transparent md:group-hover:bg-[#0000004d]">
                      <CloseFill />
                    </div>
                  </div>
                  <Flex vertical className="w-full overflow-hidden">
                    <p className="text-sm text-primary mb-1.5 -mt-1 truncate">
                      {item?.name}
                    </p>
                    <p className="text-sm text-gray-400 mb-2.5">
                      Giá:&nbsp;
                      {convertToVND(Number(item?.variant?.price ?? 0))}
                    </p>
                    <Flex align="center" justify="space-between">
                      <QuantitySelector
                        size="small"
                        className="shrink-0"
                        quantity={item?.quantity}
                        onDecrease={() => handleDecrease(item)}
                        onIncrease={() => handleIncrease(item)}
                      />
                      <p className="text-sm font-semibold leading-5 md:text-base text-heading">
                        {convertToVND(Number(item?.price) * item?.quantity)}
                      </p>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Space>
        )}
      </AntdDrawer>
    </Layout>
  );
};

export default BaseLayout;
