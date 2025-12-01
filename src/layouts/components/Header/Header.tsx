import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Flex, MenuProps, Space } from 'antd';
import { memo, ReactElement, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { PROFILE_PICTURE } from '~/assets/images';
import { ArrowDown, Cart, LOGO, Search } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Image from '~/shared/components/Image/Image';
import Link from '~/shared/components/Link/Link';
import Menu from '~/shared/components/Menu/Menu';
import { useAppSelector } from '~/shared/hooks/useStore';
import { PATH } from '~/shared/utils/path';
import HeaderDropdown from './HeaderDropdown';

interface HeaderProps {
  onSignOut: () => void;
  onOpenAuthModal: () => void;
  onOpenCartDrawer: () => void;
  onOpenMenuDrawer: () => void;
}

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
  // {
  //   key: 'woman',
  //   title: 'Thời trang Nữ',
  //   href: '',
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
  // },
  {
    key: 'collection',
    title: 'Bộ sưu tập',
    href: '',
  },
  {
    key: 'man',
    title: 'Thời trang',
    href: PATH.PRODUCTS,
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

const Header = ({
  onSignOut,
  onOpenAuthModal,
  onOpenCartDrawer,
  onOpenMenuDrawer,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.user);

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      className: 'cursor-default! select-none! hover:bg-white!',
      icon: (
        <img
          width={56}
          height={56}
          className="rounded-full"
          src={currentUser?.avatar || PROFILE_PICTURE}
          onError={(element) => {
            element.currentTarget.src = PROFILE_PICTURE;
            element.currentTarget.srcset = PROFILE_PICTURE;
          }}
        />
      ),
      label: (
        <Flex vertical>
          <h2 className="uppercase text-lg font-semibold text-primary">
            {currentUser?.name || '-'}
          </h2>
          <p className="max-w-[250px] truncate text-body">
            {currentUser?.email || '-'}
          </p>
        </Flex>
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
      onClick: () => onSignOut(),
    },
  ];

  return (
    <div className="sticky top-0 left-0 shadow-md h-16 sm:h-20 lg:h-24 px-6 bg-white max-w-[1920px] z-100">
      <Flex
        gap={10}
        align="center"
        className="h-full cursor-pointer max-lg:justify-center"
      >
        <Flex
          gap={6}
          vertical
          justify="center"
          onClick={onOpenMenuDrawer}
          className="w-6! h-full! xl:hidden! max-lg:hidden! [&>*:first-child]:w-1/2 [&>*:nth-child(2)]:w-full [&>*:last-child]:w-3/4 hover:[&>*:nth-child(odd)]:w-full hover:[&>*:nth-child(even)]:w-1/2"
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
          className="w-full pl-6! justify-between max-xl:justify-end max-lg:hidden!"
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
          <div className="hidden lg:block">
            <Flex align="center" className="gap-x-6">
              <Search className="cursor-pointer" />
              {!Object.keys(currentUser)?.length ? (
                <Button
                  title="Đăng nhập"
                  displayType="outlined"
                  onClick={onOpenAuthModal}
                />
              ) : (
                <div
                  className={`${
                    Object.keys(currentUser)?.length ? 'order-3' : ''
                  }`}
                >
                  <Dropdown
                    arrow
                    trigger={['click']}
                    menu={{ items: menuItems }}
                  >
                    <Image
                      width={30}
                      height={30}
                      className="rounded-full"
                      fallback={PROFILE_PICTURE}
                      src={currentUser?.avatar || PROFILE_PICTURE}
                    />
                  </Dropdown>
                </div>
              )}
              <Badge showZero count={0} onClick={onOpenCartDrawer}>
                <Cart className="cursor-pointer" />
              </Badge>
            </Flex>
          </div>
        </Flex>
      </Flex>
    </div>
  );
};

export default memo(Header);
