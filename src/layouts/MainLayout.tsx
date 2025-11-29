import { useMutation } from '@tanstack/react-query';
import { Flex, MenuProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ReactNode, useState } from 'react';

import { SUBSCRIPTION_BG } from '~/assets/images';
import {
  EmptyCart,
  Facebook,
  Instagram,
  LOGO,
  Twitter,
  Youtube,
} from '~/assets/svg';
import { AuthApi } from '~/features/auth/api/auth';
import AuthModal from '~/features/auth/components/AuthModal';
import { ISignIn, ISignUp } from '~/features/auth/types/auth';
import { getMe } from '~/features/user';
import Button from '~/shared/components/Button/Button';
import Drawer from '~/shared/components/Drawer/Drawer';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Input from '~/shared/components/Input/Input';
import Layout from '~/shared/components/Layout/Layout';
import Menu from '~/shared/components/Menu/Menu';
import { useToast } from '~/shared/contexts/NotificationContext';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { useAppDispatch } from '~/shared/hooks/useStore';
import { BottomNavBar, Footer, Header } from './components';

const siderMenu: MenuProps['items'] = [
  {
    key: 'men-wear',
    label: 'Thời trang Nam',
    children: [
      {
        key: 'top-wear',
        label: 'Áo',
        children: [
          {
            key: '1',
            label: 'Áo Thun (Áo Phông)',
          },
          {
            key: '2',
            label: 'Áo Sơ mi Thường ngày',
          },
          {
            key: '3',
            label: 'Áo Sơ mi Công sở',
          },
          {
            key: '4',
            label: 'Áo Blazer & Áo Khoác',
          },
          {
            key: '5',
            label: 'Bộ Vest (Com-lê)',
          },
          {
            key: '6',
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
            key: '1',
            label: 'Váy (Đầm)',
          },
          {
            key: '2',
            label: 'Đồ Liền (Jumpsuit)',
          },
          {
            key: '3',
            label: 'Áo kiểu, Áo Thun & Áo sơ mi',
          },
          {
            key: '4',
            label: 'Quần Short & Chân Váy',
          },
          {
            key: '5',
            label: 'Áo khoác mỏng (Shrug)',
          },
          {
            key: '6',
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
            key: '1',
            label: 'Giày Đế bệt',
          },
          {
            key: '2',
            label: 'Giày Thường ngày',
          },
          {
            key: '3',
            label: 'Giày Cao gót',
          },
          {
            key: '4',
            label: 'Giày Boots/Bốt',
          },
        ],
      },
      {
        key: 'sport-wear',
        label: 'Đồ Thể thao & Vận động',
        children: [
          {
            key: '1',
            label: 'Quần áo',
          },
          {
            key: '2',
            label: 'Giày Dép',
          },
          {
            key: '3',
            label: 'Phụ kiện Thể thao',
          },
        ],
      },
      {
        key: 'lingerie',
        label: 'Đồ Lót & Đồ Ngủ',
        children: [
          {
            key: '1',
            label: 'Áo Ngực',
          },
          {
            key: '2',
            label: 'Quần Lót',
          },
          {
            key: '3',
            label: 'Đồ Ngủ',
          },
        ],
      },
      {
        key: 'scarves',
        label: 'Dây lưng, Khăn choàng & Khác',
        children: [
          {
            key: '1',
            label: 'Trang điểm',
          },
          {
            key: '2',
            label: 'Chăm sóc Da',
          },
          {
            key: '3',
            label: 'Mỹ phẩm Cao cấp',
          },
          {
            key: '4',
            label: 'Son môi',
          },
        ],
      },
      {
        key: 'gadgets',
        label: 'Thiết bị Công nghệ',
        children: [
          {
            key: '1',
            label: 'Thiết bị Đeo thông minh',
          },
          {
            key: '2',
            label: 'Tai nghe',
          },
        ],
      },
      {
        key: 'jewellers',
        label: 'Trang Sức',
        children: [
          {
            key: '1',
            label: 'Trang sức Thời trang',
          },
          {
            key: '2',
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
  {
    key: 'women-wear',
    label: 'Thời trang Nữ',
    children: [
      {
        key: 'top-wear',
        label: 'Áo',
        children: [
          {
            key: '1',
            label: 'Áo Thun (Áo Phông)',
          },
          {
            key: '2',
            label: 'Áo Sơ mi Thường ngày',
          },
          {
            key: '3',
            label: 'Áo Sơ mi Công sở',
          },
          {
            key: '4',
            label: 'Áo Blazer & Áo Khoác',
          },
          {
            key: '5',
            label: 'Bộ Vest (Com-lê)',
          },
          {
            key: '6',
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
            key: '1',
            label: 'Váy (Đầm)',
          },
          {
            key: '2',
            label: 'Đồ Liền (Jumpsuit)',
          },
          {
            key: '3',
            label: 'Áo kiểu, Áo Thun & Áo sơ mi',
          },
          {
            key: '4',
            label: 'Quần Short & Chân Váy',
          },
          {
            key: '5',
            label: 'Áo khoác mỏng (Shrug)',
          },
          {
            key: '6',
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
            key: '1',
            label: 'Giày Đế bệt',
          },
          {
            key: '2',
            label: 'Giày Thường ngày',
          },
          {
            key: '3',
            label: 'Giày Cao gót',
          },
          {
            key: '4',
            label: 'Giày Boots/Bốt',
          },
        ],
      },
      {
        key: 'sport-wear',
        label: 'Đồ Thể thao & Vận động',
        children: [
          {
            key: '1',
            label: 'Quần áo',
          },
          {
            key: '2',
            label: 'Giày Dép',
          },
          {
            key: '3',
            label: 'Phụ kiện Thể thao',
          },
        ],
      },
      {
        key: 'lingerie',
        label: 'Đồ Lót & Đồ Ngủ',
        children: [
          {
            key: '1',
            label: 'Áo Ngực',
          },
          {
            key: '2',
            label: 'Quần Lót',
          },
          {
            key: '3',
            label: 'Đồ Ngủ',
          },
        ],
      },
      {
        key: 'scarves',
        label: 'Dây lưng, Khăn choàng & Khác',
        children: [
          {
            key: '1',
            label: 'Trang điểm',
          },
          {
            key: '2',
            label: 'Chăm sóc Da',
          },
          {
            key: '3',
            label: 'Mỹ phẩm Cao cấp',
          },
          {
            key: '4',
            label: 'Son môi',
          },
        ],
      },
      {
        key: 'gadgets',
        label: 'Thiết bị Công nghệ',
        children: [
          {
            key: '1',
            label: 'Thiết bị Đeo thông minh',
          },
          {
            key: '2',
            label: 'Tai nghe',
          },
        ],
      },
      {
        key: 'jewellers',
        label: 'Trang Sức',
        children: [
          {
            key: '1',
            label: 'Trang sức Thời trang',
          },
          {
            key: '2',
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
  const dispatch = useAppDispatch();

  const { isXl } = useBreakpoint();
  const [subscriptionForm] = useForm();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);

  const { mutate: signUpMutate, isPending: isSignUpPending } = useMutation({
    mutationFn: (values: ISignUp) => AuthApi.signUp(values),
    onSuccess: (response) => {
      toast.success(response?.data?.message);
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Có lỗi xảy ra'),
  });

  const { mutate: signInMutate, isPending: isSignInPending } = useMutation({
    mutationFn: (values: ISignIn) => AuthApi.signIn(values),
    onSuccess: (response) => {
      setIsAuthVisible(false);

      dispatch(getMe());
      toast.success(response?.message);
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? 'Có lỗi xảy ra'),
  });

  const handleOpenAuthModal = () => {
    setIsAuthVisible(true);
  };

  const handleOpenMenuDrawer = () => {
    setIsMenuDrawerVisible(true);
  };

  const handleOpenCartDrawer = () => {
    setIsCartDrawerVisible(true);
  };

  return (
    <Layout className="max-lg:pb-14">
      <Header
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
              className="w-full shrink-0 sm:w-96 md:w-[545px] md:mt-7! z-10"
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
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />

      <AuthModal
        open={isAuthVisible}
        loading={isSignUpPending || isSignInPending}
        onCancel={() => setIsAuthVisible(false)}
        onSignUp={(values) => signUpMutate(values)}
        onSignIn={(values) => signInMutate(values)}
      />

      <Drawer
        title={<LOGO />}
        placement="left"
        open={isMenuDrawerVisible}
        footer={
          <Flex justify="center" align="center" className="w-full">
            {[Facebook, Twitter, Youtube, Instagram].map((Item, index) => (
              <span
                key={index}
                className={`p-5 cursor-pointer ${
                  Item === Facebook
                    ? 'hover:*:fill-[#0866ff]'
                    : Item === Twitter
                    ? 'hover:*:fill-[#1c9be9]'
                    : Item === Youtube
                    ? 'hover:*:fill-[#ff0033]'
                    : 'hover:*:fill-[#fe115c]'
                }`}
              >
                <Item />
              </span>
            ))}
          </Flex>
        }
        onClose={() => setIsMenuDrawerVisible(false)}
      >
        <Menu mode="inline" items={siderMenu} />
      </Drawer>
      <Drawer
        open={isCartDrawerVisible}
        title={<p className="font-bold text-2xl text-primary">Giỏ hàng</p>}
        footer={
          <Button
            className="w-full py-4! px-5!"
            title={
              <Flex align="center" gap={25}>
                <p>Tiến hành thanh toán</p>
                <p>0,00 VNĐ</p>
              </Flex>
            }
          />
        }
        onClose={() => setIsCartDrawerVisible(false)}
      >
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
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
