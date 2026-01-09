import { Flex } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PAGE_HEADER } from '~/assets/images';
import { Cart, SettingOutlined, User } from '~/assets/svg';
import { Content } from '~/shared/components/Layout/Layout';
import { PATH } from '~/shared/utils/path';
import Footer from '../components/Footer/Footer';

interface ISidebarItem {
  icon: ReactNode;
  title: string;
  href: string;
}

const sidebarItems: ISidebarItem[] = [
  {
    icon: <Cart />,
    title: 'Đơn đặt hàng',
    href: PATH.ACCOUNT_ORDERS,
  },
  {
    icon: <User className="[&>path]:stroke-[0.2]" />,
    title: 'Thông tin tài khoản',
    href: PATH.ACCOUNT_DETAILS,
  },
  {
    icon: <SettingOutlined />,
    title: 'Đổi mật khẩu',
    href: PATH.ACCOUNT_CHANGE_PASSWORD,
  },
];

const AccountLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
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
            Account
          </h2>
        </div>
      </div>
      <Content className="w-full mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
        <div className="py-16 lg:py-20 px-0 xl:max-w-7xl mx-auto flex md:flex-row w-full">
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col pb-2 md:w-2/6 2xl:w-4/12 ltr:md:pr-8 rtl:md:pl-8 ltr:lg:pr-12 rtl:lg:pl-12 ltr:xl:pr-16 rtl:xl:pl-16 ltr:2xl:pr-20 rtl:2xl:pl-20 md:pb-0">
              {sidebarItems.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  className={classNames(
                    'cursor-pointer text-sm lg:text-base py-3.5! px-4! lg:px-5! rounded mb-2! transition-all duration-300 ease-in-out',
                    pathname === item?.href
                      ? 'font-semibold bg-gray-100 text-primary'
                      : 'hover:bg-gray-50'
                  )}
                  onClick={() => navigate(item?.href)}
                >
                  {item?.icon}
                  <span className="ltr:pl-2 rtl:pr-2">{item?.title}</span>
                </Flex>
              ))}
            </div>
            <div className="md:w-4/6 2xl:w-8/12 mt-4 md:mt-0">{children}</div>
          </div>
        </div>
      </Content>
      <Footer />
    </>
  );
};

export default AccountLayout;
