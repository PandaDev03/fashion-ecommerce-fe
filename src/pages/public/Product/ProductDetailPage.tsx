import {
  Breadcrumb,
  BreadcrumbProps,
  Carousel,
  CollapseProps,
  Divider,
  Flex,
} from 'antd';
import { useState } from 'react';

import Button from '~/shared/components/Button/Button';
import Collapse from '~/shared/components/Collapse/Collapse';
import Image from '~/shared/components/Image/Image';
import { Layout } from '~/shared/components/Layout/Layout';
import ProductModal, { Size } from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import QuantitySelector from '~/shared/components/QuantitySelector/QuantitySelector';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { MAX_QUANTITY, MIN_QUANTITY, SIZES } from '~/shared/utils/constants';
import { PATH } from '~/shared/utils/path';
import { Product } from '../Home/HomePage';

const newArrivals: Product[] = [
  {
    key: '1',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F1.jpg&w=384&q=100',
  },
  {
    key: '2',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F3.jpg&w=384&q=100',
  },
  {
    key: '3',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F2.jpg&w=384&q=100',
  },
  {
    key: '4',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F4.jpg&w=384&q=100',
  },
  {
    key: '5',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F5.jpg&w=384&q=100',
  },
  {
    key: '6',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F6.jpg&w=384&q=100',
  },
  {
    key: '7',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F7.jpg&w=384&q=100',
  },
  {
    key: '8',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F8.jpg&w=384&q=100',
  },
  {
    key: '9',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F9.jpg&w=384&q=100',
  },
  {
    key: '10',
    price: 18.59,
    title: 'Áo thun cổ tròn nữ Roadster',
    subTitle:
      'Fendi bắt đầu hoạt động vào năm 1925 với tư cách là một cửa hàng chuyên bán lông thú và đồ da ở Rome.',
    img: 'https://chawkbazar.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fproducts%2Fancient%2F10.jpg&w=384&q=100',
  },
];

const DEFAULT_COLORS = ['#e86c25', '#ffa5b4', '#8224e3', '#dd3333'];

const collapseItems: CollapseProps['items'] = [
  {
    key: '1',
    label: 'Chi tiết sản phẩm',
    children: (
      <p className="leading-7 text-sm text-gray-600">
        Đội ngũ Chăm sóc Khách hàng của chúng tôi làm việc 7 ngày một tuần và
        cung cấp 2 cách liên hệ: Email và Trò chuyện. Chúng tôi cố gắng phản hồi
        nhanh chóng, vì vậy bạn không cần phải chờ đợi quá lâu!
      </p>
    ),
  },
  {
    key: '2',
    label: 'Thông tin bổ sung',
    children: (
      <p className="leading-7 text-sm text-gray-600">
        Vui lòng đọc kỹ tài liệu. Chúng tôi cũng có một số video hướng dẫn trực
        tuyến về vấn đề này. Nếu sự cố vẫn tiếp diễn, vui lòng mở phiếu hỗ trợ
        trong diễn đàn hỗ trợ.
      </p>
    ),
  },
  {
    key: '3',
    label: 'Đánh giá của khách hàng',
    children: (
      <div className="leading-7 text-sm text-gray-600">
        <p>
          Trước tiên, vui lòng kiểm tra kết nối internet của bạn. Chúng tôi cũng
          có một số video hướng dẫn trực tuyến về vấn đề này. Nếu sự cố vẫn tiếp
          diễn, vui lòng mở phiếu hỗ trợ trong diễn đàn hỗ trợ.
        </p>
      </div>
    ),
  },
];

const ProductDetailPage = () => {
  const { isLg } = useBreakpoint();

  const [color, setColor] = useState('');
  const [size, setSize] = useState<Size>();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    {} as Product
  );

  const breadCrumbItems: BreadcrumbProps['items'] = [
    {
      key: 'home',
      title: 'Trang chủ',
      href: '/',
    },
    {
      key: 'products',
      title: 'Sản phẩm',
      href: PATH.PRODUCTS_WITHOUT_SLUG,
    },
    {
      key: 'product-details',
      title: 'Túi Nike',
    },
  ];

  const handleDecrease = () => {
    setQuantity((prev) => prev - (prev === MIN_QUANTITY ? 0 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + (prev === MAX_QUANTITY ? 0 : 1));
  };

  const handleSelectedProduct = (product: Product) => {
    setIsOpen(true);
    setSelectedProduct(product);
  };

  return (
    <Layout className="bg-white! px-4! md:px-8! 2xl:px-16!">
      <Breadcrumb items={breadCrumbItems} className="pt-8!" />
      <div className="lg:grid grid-cols-9 items-start gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20">
        {isLg ? (
          <div className="grid col-span-5 grid-cols-2 gap-2.5 rounded-md overflow-hidden">
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-1.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-2.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-3.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-4.png" />
          </div>
        ) : (
          <Carousel
            draggable
            autoplaySpeed={5000}
            autoplay={{ dotDuration: true }}
          >
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-1.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-2.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-3.png" />
            <Image src="https://chawkbazar.vercel.app/assets/images/products/p-20-4.png" />
          </Carousel>
        )}
        <div className="col-span-4 pt-8 lg:pt-0">
          <h2 className="text-primary text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
            Maniac Red Boys
          </h2>
          <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
            Children’s clothing/ kids wear is usually more casual than adult
            clothing, fit play and rest. Hosiery is usually used. More recently,
            however, tons of childrenswear is heavily influenced by trends in
            adult fashion
          </p>
          <Flex className="flex items-center mt-5!">
            <p className="text-primary font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0">
              $40.00
            </p>
            <p className="line-through font-segoe text-gray-400 text-sm md:text-base lg:text-lg xl:text-xl ltr:pl-2 rtl:pr-2">
              $50.00
            </p>
          </Flex>

          <Divider />

          <div className="mb-4">
            <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
              Kích cỡ
            </h3>
            <Flex className="gap-x-3">
              {SIZES.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="center"
                  className={`w-9 md:w-11 h-9 md:h-11 border rounded-md p-1! uppercase cursor-pointer ${
                    size?.size === item ? 'border-black' : 'border-gray-100'
                  }`}
                  onClick={() => setSize({ size: item })}
                >
                  {item}
                </Flex>
              ))}
            </Flex>
          </div>
          <div className="mb-4">
            <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
              Màu sắc
            </h3>
            <Flex className="gap-x-3">
              {DEFAULT_COLORS.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="center"
                  className={`w-9 md:w-11 h-9 md:h-11 border rounded-md p-1! uppercase cursor-pointer ${
                    color === item ? 'border-black' : 'border-gray-100'
                  }`}
                  onClick={() => setColor(item)}
                >
                  <span
                    style={{
                      backgroundColor: `${item}`,
                    }}
                    className="block w-full h-full rounded"
                  ></span>
                </Flex>
              ))}
            </Flex>
          </div>

          <div className="pt-2 md:pt-4">
            <Flex align="center" className="w-full mb-4! gap-x-3 sm:gap-x-4">
              <QuantitySelector
                className="shrink-0"
                quantity={quantity}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
              />
              <Button title="Thêm vào giỏ hàng" className="w-full py-3!" />
            </Flex>
            <Button title="Xem chi tiết" className="w-full py-3!" />
          </div>

          <Divider />

          <Flex className="gap-y-6 md:gap-y-7">
            <Collapse ghost items={collapseItems} />
          </Flex>
        </div>
      </div>

      <Flex vertical className="gap-y-6">
        <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-primary">
          Sản phẩm liên quan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-7 gap-y-8">
          {newArrivals?.map(({ key, ...product }) => (
            <ProductCard
              vertical
              key={key}
              effect="lift"
              imgSrc={product?.img}
              onClick={() => handleSelectedProduct(product)}
              {...product}
            />
          ))}
        </div>
      </Flex>

      <ProductModal
        open={isOpen}
        quantity={quantity}
        product={selectedProduct}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
        onCancel={() => setIsOpen(false)}
      />
    </Layout>
  );
};

export default ProductDetailPage;
