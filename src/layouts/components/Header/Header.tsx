import { Badge, Drawer, Flex, Space } from 'antd';
import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ArrowDown, Cart, EmptyCart, LOGO, Search } from '~/assets/svg';
import AuthModal from '~/shared/components/AuthModal/AuthModal';
import Button from '~/shared/components/Button/Button';
import { PATH } from '~/shared/utils/path';

interface Menu {
  title: string;
  href: string;
  children?: Array<{
    title: string;
    href: string;
  }>;
}

const menu: Menu[] = [
  {
    title: 'Thời trang Nam',
    href: '',
    children: [],
  },
  {
    title: 'Thời trang Nữ',
    href: '',
    children: [],
  },
  {
    title: 'Bộ sưu tập',
    href: '',
  },
  {
    title: 'Tìm kiếm',
    href: '',
  },
  {
    title: 'Liên hệ',
    href: '',
  },
  {
    title: 'Giỏ hàng',
    href: '',
  },
  {
    title: 'Đơn hàng',
    href: '',
  },
];

const Header = () => {
  const navigate = useNavigate();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);

  return (
    <div className="h-24 px-6 bg-white max-w-[1920px]">
      <Flex align="center" className="h-full">
        <LOGO className="cursor-pointer" onClick={() => navigate(PATH.HOME)} />
        <Flex align="center" justify="space-between" className="w-full pl-6!">
          <Flex>
            {menu.map((item, index) => (
              <div key={index} className="cursor-pointer group">
                <Space align="center" className="px-4 py-9">
                  <Link to={item.href} className="text-base text-black!">
                    {item.title}
                  </Link>
                  {item.children && (
                    <ArrowDown className="text-xs opacity-30 group-has-hover:rotate-180 transition duration-300 ease-in-out" />
                  )}
                </Space>
              </div>
            ))}
          </Flex>
          <Flex align="center" className="gap-x-6">
            <Search className="cursor-pointer" />
            <Button
              title="Đăng nhập"
              displayType="outlined"
              onClick={() => setIsAuthVisible(true)}
            />
            <Badge showZero count={0}>
              <Cart
                className="cursor-pointer"
                onClick={() => setIsCartDrawerVisible(true)}
              />
            </Badge>
          </Flex>
        </Flex>
      </Flex>
      <AuthModal
        open={isAuthVisible}
        onCancel={() => setIsAuthVisible(false)}
      />
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
    </div>
  );
};

export default memo(Header);
