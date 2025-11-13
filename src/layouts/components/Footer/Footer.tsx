import { Flex } from 'antd';
import { memo, ReactElement } from 'react';

import { Paypal, VISA } from '~/assets/images';
import {
  Facebook,
  Instagram,
  MasterCard,
  Twitter,
  Youtube,
} from '~/assets/svg';
import Image from '~/shared/components/Image/Image';

interface Item {
  title: string;
  children: {
    label: string;
    icon?: ReactElement;
  }[];
}

const Footer = () => {
  const items: Item[] = [
    {
      title: 'Social',
      children: [
        {
          icon: <Instagram />,
          label: 'Instagram',
        },
        {
          icon: <Twitter />,
          label: 'Twitter',
        },
        {
          icon: <Facebook />,
          label: 'Facebook',
        },
        {
          icon: <Youtube />,
          label: 'Youtube',
        },
      ],
    },
    {
      title: 'Liên hệ',
      children: [
        {
          label: 'Liên hệ với chúng tôi',
        },
        {
          label: 'daiphucduongvinh203@gmail.com',
        },
        {
          label: '0383342787',
        },
      ],
    },
    {
      title: 'Về chúng tôi',
      children: [
        {
          label: 'Trung tâm hỗ trợ',
        },
        {
          label: 'Hỗ trợ khách hàng',
        },
        {
          label: 'Bản quyền',
        },
      ],
    },
    {
      title: 'Chăm sóc khách hàng',
      children: [
        {
          label: 'FAQ & hỗ trợ',
        },
        {
          label: 'Vận chuyển & giao hàng',
        },
        {
          label: 'Đổi trả hàng',
        },
      ],
    },
    {
      title: 'Thông tin của chúng tôi',
      children: [
        {
          label: 'Chính sách bảo mật',
        },
        {
          label: 'Điều khoản & điều kiện',
        },
        {
          label: 'Chính sách đổi trả',
        },
      ],
    },
    {
      title: 'Danh Mục Nổi Bật',
      children: [
        {
          label: 'Thời trang nam',
        },
        {
          label: 'Thời trang trẻ em',
        },
        {
          label: 'Đồ thể thao',
        },
      ],
    },
  ];

  return (
    <footer className="mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      <div className="mx-auto max-w-[1920px] px-4 md:px-8 2xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-9 xl:gap-5  pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24 lg:mb-0.5 2xl:mb-0 3xl:-mb-1 xl:grid-cols-6">
          {items.map((item, index) => (
            <div key={index} className="col-span-1">
              <h4 className="mb-5 text-sm font-semibold text-heading md:text-base xl:text-lg 2xl:mb-6 3xl:mb-7">
                {item?.title}
              </h4>
              <Flex vertical className="gap-y-2">
                {item?.children?.map((child, index) => (
                  <Flex
                    key={index}
                    align="center"
                    className="gap-x-3 cursor-pointer"
                  >
                    {child?.icon && child?.icon}
                    <p className="text-xs md:text-base text-body truncate">
                      {child?.label}
                    </p>
                  </Flex>
                ))}
              </Flex>
            </div>
          ))}
        </div>
      </div>
      <Flex
        align="center"
        className="py-5! px-16! border-t border-gray-200 justify-center md:justify-between"
      >
        <Flex vertical className="gap-y-1.5">
          <p className="text-center text-xs md:text-base text-body">
            Copyright © 2025 REDQ All rights reserved
          </p>
          <p className="text-center text-xs md:text-base text-body">
            Thiết kế tham khảo từ REDQ.
          </p>
        </Flex>
        <div className="hidden md:flex">
          <Flex align="center" className="gap-x-7">
            <MasterCard className="cursor-pointer" />
            <Image width={50} src={VISA} className="cursor-pointer" />
            <Image width={50} src={Paypal} className="cursor-pointer" />
          </Flex>
        </div>
      </Flex>
    </footer>
  );
};

export default memo(Footer);
