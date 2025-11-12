import { Badge, Flex, MenuProps, Space } from 'antd';
import { memo, ReactElement, ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  ArrowDown,
  Cart,
  EmptyCart,
  Facebook,
  Instagram,
  LOGO,
  Search,
  Twitter,
  Youtube,
} from '~/assets/svg';
import AuthModal from '~/shared/components/AuthModal/AuthModal';
import Button from '~/shared/components/Button/Button';
import Drawer from '~/shared/components/Drawer/Drawer';
import Menu from '~/shared/components/Menu/Menu';
import { PATH } from '~/shared/utils/path';
import HeaderDropdown from './HeaderDropdown';

export interface MenuItem {
  key: string;
  label?: ReactNode | ReactElement;
  type?: 'divider';
  children?: Array<{
    key: string;
    label: ReactNode | ReactElement;
  }>;
}

interface Menu {
  key: string;
  title: string;
  href: string;
  children?: MenuItem[][];
}

const headerMenu: Menu[] = [
  {
    key: 'man',
    title: 'Thời trang Nam',
    href: '',
    children: [
      [
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
        { key: 'top-wear-divider', type: 'divider' },
        {
          key: 'belt',
          label: 'Dây lưng, Khăn choàng & Khác',
        },
        {
          key: 'watches',
          label: 'Đồng hồ & Thiết bị đeo',
        },
      ],
      [
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
        { key: 'western-divider', type: 'divider' },
        {
          key: 'plus-size',
          label: 'Kích cỡ Lớn (Big Size)',
        },
        {
          key: 'sung-glasses',
          label: 'Kính mát & Gọng kính',
        },
      ],
      [
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
        { key: 'foot-wear-divider', type: 'divider' },
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
      ],
      [
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
        { key: 'lingerie-divider', type: 'divider' },
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
      ],
      [
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
        { key: 'gadgets-divider', type: 'divider' },
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
        { key: 'jewellers-divider', type: 'divider' },
        {
          key: 'backpacks',
          label: 'Balo',
        },
        {
          key: 'handbags',
          label: 'Túi xách & Ví',
        },
      ],
    ],
  },
  {
    key: 'woman',
    title: 'Thời trang Nữ',
    href: '',
    // children: [
    //   [
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
    //     { key: 'divider', type: 'divider' },
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
    //     { key: 'divider', type: 'divider' },
    //     {
    //       key: 'backpacks',
    //       label: 'Balo',
    //     },
    //     {
    //       key: 'handbags',
    //       label: 'Túi xách & Ví',
    //     },
    //   ],
    //   [
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
    //     { key: 'divider', type: 'divider' },
    //     {
    //       key: 'belt',
    //       label: 'Dây lưng, Khăn choàng & Khác',
    //     },
    //     {
    //       key: 'watches',
    //       label: 'Đồng hồ & Thiết bị đeo',
    //     },
    //   ],
    //   [
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
    //     { key: 'divider', type: 'divider' },
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
    //   ],
    //   [
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
    //     { key: 'divider', type: 'divider' },
    //     {
    //       key: 'plus-size',
    //       label: 'Kích cỡ Lớn (Big Size)',
    //     },
    //     {
    //       key: 'sung-glasses',
    //       label: 'Kính mát & Gọng kính',
    //     },
    //   ],
    //   [
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
    //     { key: 'divider', type: 'divider' },
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
    //   ],
    // ],
  },
  {
    key: 'collection',
    title: 'Bộ sưu tập',
    href: '',
  },
  {
    key: 'search',
    title: 'Tìm kiếm',
    href: '',
  },
  {
    key: 'contact',
    title: 'Liên hệ',
    href: '',
  },
  {
    key: 'cart',
    title: 'Giỏ hàng',
    href: '',
  },
  {
    key: 'order',
    title: 'Đơn hàng',
    href: '',
  },
];

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

const Header = () => {
  const navigate = useNavigate();

  const [isAuthVisible, setIsAuthVisible] = useState(false);
  const [isMenuDrawerVisible, setIsMenuDrawerVisible] = useState(false);
  const [isCartDrawerVisible, setIsCartDrawerVisible] = useState(false);

  return (
    <div className="h-24 px-6 bg-white max-w-[1920px]">
      <Flex align="center" className="h-full cursor-pointer" gap={10}>
        <Flex
          gap={6}
          vertical
          justify="center"
          onClick={() => setIsMenuDrawerVisible(true)}
          className="w-6! h-full! xl:hidden! [&>*:first-child]:w-1/2 [&>*:nth-child(2)]:w-full [&>*:last-child]:w-3/4 hover:[&>*:nth-child(odd)]:w-full hover:[&>*:nth-child(even)]:w-1/2"
        >
          {[0, 1, 2].map((index) => (
            <p
              key={index}
              className="h-0.5 bg-primary transition-all duration-300 ease-in-out"
            ></p>
          ))}
        </Flex>
        <LOGO className="cursor-pointer" onClick={() => navigate(PATH.HOME)} />
        <Flex
          align="center"
          className="w-full pl-6! justify-between max-xl:justify-end"
        >
          <Flex className="max-xl:hidden!">
            {headerMenu.map((item, index) => {
              const { key, title, href, children } = item;

              const Child = () => (
                <div key={key} className="cursor-pointer group">
                  <Space align="center" className="relative px-4 py-9">
                    <Link
                      to={href}
                      className="text-base text-black! before:transition-all before:duration-300 before:ease-in-out before:absolute before:content-[''] before:h-0.5 before:w-0 before:bg-primary before:left-0 before:top-[calc(100%-2px)] group-has-hover:before:w-full"
                    >
                      {title}
                    </Link>
                    {children && (
                      <ArrowDown className="text-xs opacity-30 group-has-hover:rotate-180 transition duration-300 ease-in-out" />
                    )}
                  </Space>
                </div>
              );

              if (children?.length)
                return (
                  <HeaderDropdown key={index} menuItems={children}>
                    <Child />
                  </HeaderDropdown>
                );

              return <Child key={index} />;
            })}
          </Flex>
          <Flex align="center" className="gap-x-6">
            <Search className="cursor-pointer" />
            <Button
              title="Đăng nhập"
              displayType="outlined"
              onClick={() => setIsAuthVisible(true)}
            />
            <Badge
              showZero
              count={0}
              onClick={() => setIsCartDrawerVisible(true)}
            >
              <Cart className="cursor-pointer" />
            </Badge>
          </Flex>
        </Flex>
      </Flex>
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
    </div>
  );
};

export default memo(Header);
