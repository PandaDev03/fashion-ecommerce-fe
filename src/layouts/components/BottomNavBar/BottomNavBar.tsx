import { Badge, Flex } from 'antd';
import { memo, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { Cart, HomeOutlined, Search } from '~/assets/svg';
import { PATH } from '~/shared/utils/path';

interface BottomNavBar {
  onOpenCartDrawer: () => void;
  onOpenMenuDrawer: () => void;
}

interface BottomNavBarItem {
  key: string;
  children: ReactElement;
  onClick?: () => void;
}

const BottomNavBar = ({ onOpenCartDrawer, onOpenMenuDrawer }: BottomNavBar) => {
  const navigate = useNavigate();

  const bottomNavBar: BottomNavBarItem[] = [
    {
      key: 'sider',
      children: (
        <Flex
          gap={6}
          vertical
          justify="center"
          onClick={onOpenMenuDrawer}
          className="w-6! h-full! xl:hidden! [&>*:first-child]:w-1/2 [&>*:nth-child(2)]:w-full [&>*:last-child]:w-3/4 hover:[&>*:nth-child(odd)]:w-full hover:[&>*:nth-child(even)]:w-1/2"
        >
          {[0, 1, 2].map((index) => (
            <p
              key={index}
              className="h-0.5 bg-primary transition-all duration-300 ease-in-out"
            ></p>
          ))}
        </Flex>
      ),
    },
    {
      key: 'search',
      children: <Search className="cursor-pointer" />,
    },
    {
      key: 'home',
      children: <HomeOutlined className="cursor-pointer" />,
      onClick: () => navigate(PATH.HOME),
    },
    {
      key: 'cart',
      children: (
        <Badge showZero count={0}>
          <Cart className="cursor-pointer" />
        </Badge>
      ),
      onClick: onOpenCartDrawer,
    },
  ];

  return (
    <div className="lg:hidden h-14 sm:h-16">
      <Flex
        align="center"
        justify="space-between"
        className="w-full fixed z-2 bottom-0 bg-white py-3! px-4! md:px-8! shadow-top"
      >
        {bottomNavBar?.map(({ key, children, ...item }) => (
          <div key={key} {...item} className="max-h-[18px]">
            {children}
          </div>
        ))}
      </Flex>
    </div>
  );
};

export default memo(BottomNavBar);
