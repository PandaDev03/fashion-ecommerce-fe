import { Breadcrumb, BreadcrumbProps, Divider, Flex } from 'antd';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '~/assets/svg';

import Button from '~/shared/components/Button/Button';
import Checkbox from '~/shared/components/Checkbox/Checkbox';
import Drawer from '~/shared/components/Drawer/Drawer';
import { PATH } from '~/shared/utils/path';

interface Filter {
  isOpenFilterDrawer: boolean;
  onClose: () => void;
}

interface FilterContent {
  isBreadcrumb?: boolean;
}

interface FilterItem {
  key: string;
  title: string;
  children: Array<{
    key: string;
    title: string;
    min?: number;
    max?: number | null;
  }>;
}

const filters: FilterItem[] = [
  {
    key: 'category',
    title: 'Danh mục',
    children: [
      {
        key: 'man',
        title: 'Nam',
      },
      {
        key: 'woman',
        title: 'Nữ',
      },
      {
        key: 'watch',
        title: 'Đồng hồ',
      },
      {
        key: 'kids',
        title: 'Trẻ em',
      },
      {
        key: 'sport',
        title: 'Thể thao',
      },
      {
        key: 'bags',
        title: 'Túi xách',
      },
      {
        key: 'sneaker',
        title: 'Sneakers',
      },
    ],
  },
  {
    key: 'brands',
    title: 'Thương hiệu',
    children: [
      {
        key: 'shovia',
        title: 'Shovia',
      },
      {
        key: 'fusion',
        title: 'Fusion',
      },
      {
        key: 'hunter-shoes',
        title: 'Hunter Shoes',
      },
      {
        key: 'club-shoes',
        title: 'Club Shoes',
      },
      {
        key: 'hoppister',
        title: 'Hoppister',
      },
      {
        key: 'blaze-fashion',
        title: 'Blaze Fashion',
      },
      {
        key: 'elegance',
        title: 'Elegance',
      },
      {
        key: 'fashadil',
        title: 'Fashadil',
      },
    ],
  },
  {
    key: 'price',
    title: 'Giá',
    children: [
      {
        key: 'under_1250000',
        title: 'Dưới 1.250.000₫',
        min: 0,
        max: 1250000,
      },
      {
        key: '1250000_2500000',
        title: '1.250.000₫ - 2.500.000₫',
        min: 1250000,
        max: 2500000,
      },
      {
        key: '2500000_3750000',
        title: '2.500.000₫ - 3.750.000₫',
        min: 2500000,
        max: 3750000,
      },
      {
        key: '3750000_5000000',
        title: '3.750.000₫ - 5.000.000₫',
        min: 3750000,
        max: 5000000,
      },
      {
        key: '5000000_7500000',
        title: '5.000.000₫ - 7.500.000₫',
        min: 5000000,
        max: 7500000,
      },
      {
        key: '7500000_12500000',
        title: '7.500.000₫ - 12.500.000₫',
        min: 7500000,
        max: 12500000,
      },
      {
        key: '12500000_25000000',
        title: '12.500.000₫ - 25.000.000₫',
        min: 12500000,
        max: 25000000,
      },
      {
        key: 'over_25000000',
        title: 'Trên 25.000.000₫',
        min: 25000000,
        max: null,
      },
    ],
  },
];

const FilterContent = ({ isBreadcrumb = false }: FilterContent) => {
  const navigate = useNavigate();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      key: 'home',
      title: 'Trang chủ',
      onClick: () => navigate(PATH.HOME),
    },
    {
      key: 'products',
      title: 'Sản phẩm',
    },
  ];

  return (
    <Flex vertical className="w-full gap-y-7">
      {isBreadcrumb && <Breadcrumb items={breadcrumbItems} />}
      <Flex align="center" justify="space-between" className="w-full">
        <h2 className="font-semibold text-primary text-xl md:text-2xl">
          Bộ lọc
        </h2>
        <Button displayType="text" title="Xóa tất cả" />
      </Flex>
      <Divider className="my-1!" />
      <Flex vertical>
        {filters?.map(({ key, title, children }, index) => (
          <div key={key}>
            <Flex vertical>
              <h3 className="text-sm text-primary md:text-base font-semibold mb-7">
                {title}
              </h3>
              <Flex vertical className="gap-y-4">
                {children?.map((item) => (
                  <div key={item.key}>
                    <label className="flex gap-x-4">
                      <Checkbox />
                      {item?.title}
                    </label>
                  </div>
                ))}
              </Flex>
            </Flex>
            {index !== filters?.length - 1 && <Divider className="my-8!" />}
          </div>
        ))}
      </Flex>
    </Flex>
  );
};

const Filter = ({ isOpenFilterDrawer, onClose }: Filter) => {
  return (
    <>
      <div className="w-full hidden lg:block max-w-96 pt-8! pb-16! lg:pb-20!">
        <FilterContent isBreadcrumb />
      </div>
      <Drawer
        placement="left"
        open={isOpenFilterDrawer}
        className="block lg:hidden"
        closeIcon={
          <p className="text-2xl">
            <ArrowLeftOutlined />
          </p>
        }
        title={
          <h2 className="font-bold text-xl md:text-2xl m-0 text-heading w-full text-center ltr:pr-6 rtl:pl-6">
            Bộ lọc
          </h2>
        }
        footer={
          <Flex align="center" justify="center" className="w-full">
            <p className="text-sm md:text-base leading-4 flex items-center justify-center px-7 bg-heading text-white">
              9.608 mục
            </p>
          </Flex>
        }
        classNames={{
          wrapper: 'max-md:w-[80%]! md:min-w-[450px]',
          header: '',
          footer: 'bg-primary',
        }}
        onClose={onClose}
      >
        <FilterContent />
      </Drawer>
    </>
  );
};

export default memo(Filter);
