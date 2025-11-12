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
      title: 'Liên Hệ',
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
      title: 'Về Chúng Tôi',
      children: [
        {
          label: 'Trung Tâm Hỗ Trợ',
        },
        {
          label: 'Hỗ Trợ Khách Hàng',
        },
        {
          label: 'Bản Quyền',
        },
      ],
    },
    {
      title: 'Chăm Sóc Khách Hàng',
      children: [
        {
          label: 'FAQ & Hỗ Trợ',
        },
        {
          label: 'Vận Chuyển & Giao Hàng',
        },
        {
          label: 'Đổi Trả Hàng',
        },
      ],
    },
    {
      title: 'Thông Tin Của Chúng Tôi',
      children: [
        {
          label: 'Cập nhật Chính sách Bảo mật',
        },
        {
          label: 'Điều khoản & Điều kiện',
        },
        {
          label: 'Chính sách Đổi Trả',
        },
      ],
    },
    {
      title: 'Danh Mục Nổi Bật',
      children: [
        {
          label: 'Thời Trang Nam',
        },
        {
          label: 'Thời Trang Trẻ Em',
        },
        {
          label: 'Đồ Thể Thao',
        },
      ],
    },
  ];

  return (
    <footer className="border-b-4 border-primary mt-9 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-6 mb-24 px-4 md:px-8 2xl:px-16">
          {items.map((item, index) => (
            <div key={index} className="col-span-1">
              <h4 className="font-semibold text-lg text-primary mb-5 capitalize">
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
                    <p className="text-body">{child?.label}</p>
                  </Flex>
                ))}
              </Flex>
            </div>
          ))}
        </div>
      </div>
      <Flex
        align="center"
        justify="space-between"
        className="py-5! px-16! border-t border-gray-200"
      >
        <Flex vertical className="gap-y-1.5">
          <p className="text-body">Copyright © 2025 REDQ All rights reserved</p>
          <p className="text-body">Thiết kế tham khảo từ REDQ.</p>
        </Flex>
        <Flex align="center" className="gap-x-7">
          <MasterCard className="cursor-pointer" />
          <Image width={50} src={VISA} className="cursor-pointer" />
          <Image width={50} src={Paypal} className="cursor-pointer" />
        </Flex>
      </Flex>
    </footer>
  );
};

export default memo(Footer);
