import { Flex, Layout, MenuProps } from 'antd';
import { ReactNode, useState } from 'react';

import {
  EmptyCart,
  Facebook,
  Instagram,
  LOGO,
  Twitter,
  Youtube,
} from '~/assets/svg';
import AuthModal from '~/shared/components/AuthModal/AuthModal';
import Button from '~/shared/components/Button/Button';
import Drawer from '~/shared/components/Drawer/Drawer';
import Menu from '~/shared/components/Menu/Menu';
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
  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);

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
    <Layout className="min-h-screen bg-white! max-lg:pb-14">
      <Header
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />
      <div>{children}</div>
      <Footer />
      <BottomNavBar
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartDrawer={handleOpenCartDrawer}
        onOpenMenuDrawer={handleOpenMenuDrawer}
      />
      <AuthModal
        open={isAuthVisible}
        onCancel={() => setIsAuthVisible(false)}
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
