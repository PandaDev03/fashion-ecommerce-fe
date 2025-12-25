import { Flex, MenuProps } from 'antd';
import Sider, { SiderProps } from 'antd/es/layout/Sider';
import classNames from 'classnames';
import { memo } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import { Cart, DashBoard, LOGO, UserCircleOutlined } from '~/assets/svg';
import Menu from '~/shared/components/Menu/Menu';
import { PATH } from '~/shared/utils/path';

const siderItems: MenuProps['items'] = [
  { key: PATH.ADMIN_DASHBOARD, label: 'Dashboard', icon: <DashBoard /> },
  {
    key: '2',
    label: 'E-commerce',
    icon: <Cart />,
    children: [
      {
        key: PATH.ADMIN_BRAND_MANAGEMENT,
        label: 'Thương hiệu',
      },
      {
        key: PATH.ADMIN_CATEGORY_MANAGEMENT,
        label: 'Danh mục',
      },
      {
        key: PATH.ADMIN_PRODUCT_MANAGEMENT,
        label: 'Sản phẩm',
      },
      {
        key: PATH.ADMIN_ORDER_MANAGEMENT,
        label: 'Đơn hàng',
      },
    ],
  },
  { key: PATH.ADMIN_PROFILE, label: 'Hồ sơ', icon: <UserCircleOutlined /> },
];

const routePatterns = [
  { pattern: PATH.ADMIN_PROFILE, keys: [PATH.ADMIN_PROFILE] },
  { pattern: PATH.ADMIN_DASHBOARD, keys: [PATH.ADMIN_DASHBOARD] },
  { pattern: PATH.ADMIN_BRAND_MANAGEMENT, keys: [PATH.ADMIN_BRAND_MANAGEMENT] },
  {
    pattern: PATH.ADMIN_CATEGORY_MANAGEMENT,
    keys: [PATH.ADMIN_CATEGORY_MANAGEMENT],
  },
  {
    pattern: PATH.ADMIN_PRODUCT_MANAGEMENT,
    keys: [PATH.ADMIN_PRODUCT_MANAGEMENT],
  },
  {
    pattern: PATH.ADMIN_PRODUCT_DETAILS,
    keys: [PATH.ADMIN_PRODUCT_MANAGEMENT],
  },
  {
    pattern: PATH.ADMIN_ORDER_MANAGEMENT,
    keys: [PATH.ADMIN_ORDER_MANAGEMENT, PATH.ADMIN_ORDER_DETAILS],
  },
];

const Sidebar = ({ className, ...props }: SiderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const customClassName = classNames(
    'bg-white! h-full border-e border-gray-200',
    className
  );

  const getSelectedKey = (pathname: string) => {
    for (const { pattern, keys } of routePatterns) {
      if (matchPath(pattern, pathname)) return keys;
    }
    return [pathname];
  };

  return (
    <Sider width={220} className={customClassName} {...props}>
      <Flex vertical className="w-full h-full">
        <Flex align="center" justify="center" className="pb-8! pt-7!">
          <LOGO
            className="cursor-pointer"
            onClick={() => navigate(PATH.HOME)}
          />
        </Flex>
        <Menu
          mode="inline"
          items={siderItems}
          className="h-full"
          defaultSelectedKeys={['1']}
          selectedKeys={getSelectedKey(location.pathname)}
          defaultOpenKeys={location?.state?.key ? [location?.state?.key] : []}
          onSelect={(e) =>
            navigate(e?.key, {
              state: { key: e?.key, parentKey: e?.keyPath?.[1] },
            })
          }
        />
      </Flex>
    </Sider>
  );
};

export default memo(Sidebar);
