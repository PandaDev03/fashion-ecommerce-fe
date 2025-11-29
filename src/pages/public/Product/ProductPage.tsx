import { Flex, Select } from 'antd';
import { ReactNode, useState } from 'react';

import { Filters } from '~/assets/svg';
import Button from '~/shared/components/Button/Button';
import Layout from '~/shared/components/Layout/Layout';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import Filter from './Filter';

interface Product {
  key: string;
  cols?: number;
  rows?: number;
  title: ReactNode;
  subTitle: ReactNode;
  img: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
}

const products: Product[] = [
  {
    key: 'maniac-red-boys',
    price: 15,
    originalPrice: 20,
    title: 'Maniac Red Boys',
    subTitle:
      'Quần short thể thao Under Armour là sản phẩm thiết yếu dành cho thể thao, mềm mại và nhẹ với chất liệu thấm hút ẩm.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-20-m.png&w=384&q=100',
  },
  {
    key: 'global-desi',
    price: 30,
    originalPrice: 40,
    title: 'H&M Global Desi',
    subTitle:
      'Áo dệt trơn màu xanh lam, viền cong với chi tiết tua rua có dây đeo vai và không tay.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-22-s.png&w=384&q=100',
  },
  {
    key: 'wayfarer',
    price: 20,
    originalPrice: 35,
    title: 'Kính râm phân cực Wayfarer',
    subTitle:
      'Sản phẩm này chỉ được đổi sang sản phẩm có cùng kích thước hoặc kích thước khác nếu có và không được trả lại.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-25-s.png&w=384&q=100',
  },
  {
    key: 'nike-shoes',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-24-s.png&w=384&q=100',
  },
  {
    key: 'maniac-red-boys-2',
    price: 15,
    originalPrice: 20,
    title: 'Maniac Red Boys',
    subTitle:
      'Quần short thể thao Under Armour là sản phẩm thiết yếu dành cho thể thao, mềm mại và nhẹ với chất liệu thấm hút ẩm.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-20-m.png&w=384&q=100',
  },
  {
    key: 'nike-shoes-2',
    price: 50,
    originalPrice: 80,
    title: 'Giày NIKE',
    subTitle:
      'NIKE 2020 Black White là một phối màu đơn sắc tinh tế, thuộc dòng giày công nghệ cao mới nhất của thương hiệu. Mẫu giày này được ra mắt lần đầu vào cuối năm ngoái và hiện là đôi giày hiệu suất chủ lực của Jordan Brand.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fp-24-s.png&w=384&q=100',
  },
];

const ProductPage = () => {
  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);

  const handleCloseFilterDrawer = () => {
    setIsOpenFilterDrawer(false);
  };

  return (
    <Layout className="px-4! md:px-8! 2xl:px-16!">
      <Flex className="pt-8! gap-x-16">
        <Filter
          isOpenFilterDrawer={isOpenFilterDrawer}
          onClose={handleCloseFilterDrawer}
        />
        <Flex vertical className="gap-y-7">
          <Flex align="center" justify="space-between" className="w-full">
            <h1 className="text-2xl text-primary font-bold hidden lg:inline-flex pb-1">
              Trang phục thường ngày
            </h1>
            <Flex
              align="center"
              justify="space-between"
              className="max-lg:w-full"
            >
              <Button
                displayType="outlined"
                title={
                  <Flex align="center" className="gap-x-2.5">
                    <Filters />
                    <p>Bộ lọc</p>
                  </Flex>
                }
                className="lg:hidden! bg-[#f9f9f9]! text-primary!"
                onClick={() => setIsOpenFilterDrawer(true)}
              />
              <Flex align="center">
                <p className="shrink-0 text-body text-xs md:text-sm leading-4 ltr:pr-4 rtl:pl-4 ltr:md:mr-6 rtl:md:ml-6 ltr:pl-2 rtl:pr-2 hidden lg:block">
                  9.608 mục
                </p>
                <Select className="min-w-44" value="Tùy chọn sắp xếp" />
              </Flex>
            </Flex>
          </Flex>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8 ">
            {products?.map(({ key, img, ...product }) => (
              <ProductCard
                vertical
                key={key}
                effect="lift"
                imgSrc={img}
                {...product}
              />
            ))}
          </div>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ProductPage;
