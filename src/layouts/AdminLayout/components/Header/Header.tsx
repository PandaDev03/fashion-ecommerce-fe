import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Flex, MenuProps } from 'antd';
import { memo } from 'react';

import { PROFILE_PICTURE } from '~/assets/images';
import { ArrowDown } from '~/assets/svg';
import Image from '~/shared/components/Image/Image';
import Link from '~/shared/components/Link/Link';
import { useAppSelector } from '~/shared/hooks/useStore';

interface HeaderProps {
  onCollapse: () => void;
}

const Header = ({ onCollapse }: HeaderProps) => {
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
    },
  ];

  return (
    <Flex
      justify="space-between"
      className="w-full bg-white border-b border-gray-200 px-6! py-4!"
    >
      <div
        className="group px-2 py-2 border border-gray-200 rounded-lg cursor-pointer"
        onClick={onCollapse}
      >
        <Flex
          gap={6}
          vertical
          justify="center"
          className="w-6! [&>*:first-child]:w-1/2 [&>*:nth-child(2)]:w-full [&>*:last-child]:w-3/4 group-has-hover:[&>*:nth-child(odd)]:w-full group-has-hover:[&>*:nth-child(even)]:w-1/2"
        >
          {[0, 1, 2].map((index) => (
            <p
              key={index}
              className="h-0.5 bg-primary transition-all duration-300 ease-in-out"
            ></p>
          ))}
        </Flex>
      </div>
      <Dropdown arrow trigger={['click']} menu={{ items: menuItems }}>
        <Flex align="center" className="cursor-pointer gap-x-2">
          <Image
            width={30}
            height={30}
            className="rounded-full"
            src={currentUser?.avatar}
            fallback={PROFILE_PICTURE}
          />
          <Flex align="center" className="gap-x-1">
            <p className="font-semibold text-primary select-none">
              {currentUser?.name}
            </p>
            <ArrowDown className="text-xs" />
          </Flex>
        </Flex>
      </Dropdown>
    </Flex>
  );
};

export default memo(Header);
