import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import {
  Breadcrumb,
  BreadcrumbProps,
  Carousel,
  CollapseProps,
  Divider,
  Flex,
  Space,
} from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { productAPI } from '~/features/products/api/productApi';
import { IProduct, IVariant } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import Collapse from '~/shared/components/Collapse/Collapse';
import Image from '~/shared/components/Image/Image';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import ProductModal from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import QuantitySelector from '~/shared/components/QuantitySelector/QuantitySelector';
import { MAX_QUANTITY, MIN_QUANTITY } from '~/shared/utils/constants';
import { convertToVND } from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import { Product } from '../Home/HomePage';

interface IColorImage {
  sizeId?: string;
  colorId: string;
  colorName: string;
  variant?: IVariant;
  image?: IVariant['imageMappings'][number];
}

interface ISize {
  id: string;
  value: string;
  position: number;
}

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

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const flagRef = useRef(false);
  const selectedRef = useRef(false);
  const carouselRef = useRef<CarouselRef>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const [sizes, setSizes] = useState<ISize[]>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [colorImages, setColorImages] = useState<IColorImage[]>();

  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');

  const [selectedVariant, setSelectedVariant] = useState<IVariant>();
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    {} as Product
  );

  const [productDetails, setProductDetails] = useState<IProduct>();

  const { mutate: getProductBySlug, isPending: isGetProductBySlugPending } =
    useMutation({
      mutationFn: (slug: string) => productAPI.getProductBySlug(slug),
      onSuccess: (response) => setProductDetails(response?.data),
    });

  useEffect(() => {
    if (slug) getProductBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (!productDetails?.variantColorData) return;

    const colorImages: IColorImage[] = productDetails?.variantColorData?.map(
      (colorGroup) => {
        const variant = productDetails?.variants?.find((variant) =>
          variant?.optionValues?.some(
            (optVal) => optVal?.optionValueId === colorGroup?.id
          )
        );

        const sizeId = variant?.optionValues?.find(
          (optVal) => optVal?.optionValueId !== colorGroup?.id
        )?.optionValueId;

        return {
          sizeId,
          variant,
          colorId: colorGroup?.id,
          colorName: colorGroup?.name,
          image: variant?.imageMappings?.[0],
        };
      }
    );

    const firstColor = colorImages?.[0];

    setColorImages(colorImages || []);
    setSelectedColorId(firstColor?.colorId);
    setSelectedVariant(firstColor?.variant);
    firstColor?.sizeId && setSelectedSizeId(firstColor?.sizeId);
  }, [productDetails]);

  useEffect(() => {
    if (!selectedRef.current) {
      if (selectedColorId && selectedSizeId) selectedRef.current = true;
      return;
    }

    if (selectedColorId && selectedSizeId) {
      const variant = productDetails?.variants?.find((variant) => {
        const hasColor = variant?.optionValues?.some(
          (optVal) => optVal?.optionValue?.id === selectedColorId
        );
        const hasSize = variant?.optionValues?.some(
          (optVal) => optVal?.optionValue?.id === selectedSizeId
        );

        return hasColor && hasSize;
      });

      setSelectedVariant(variant);
    } else setSelectedVariant(undefined);
  }, [selectedRef, selectedColorId, selectedSizeId, productDetails]);

  useEffect(() => {
    if (selectedColorId) {
      if (flagRef.current) return;

      handleSetSizes(selectedColorId);
      flagRef.current = true;
    }
  }, [selectedColorId, flagRef]);

  const goToSlide = (index: number) => {
    carouselRef.current?.goTo(index);
    setCurrentSlide(index);
  };

  const handleSetSizes = (colorId: string) => {
    const variantWithColor = productDetails?.variants?.filter((variant) =>
      variant?.optionValues?.some(
        (optVal) => optVal?.optionValue?.id === colorId
      )
    );

    const sizes: ISize[] = (
      variantWithColor?.map((variant) => {
        const sizeOption = variant?.optionValues?.find(
          (optVal) => optVal?.optionValue?.id !== colorId
        );

        return {
          id: sizeOption?.optionValue?.id ?? '',
          value: sizeOption?.optionValue?.value ?? '',
          position: sizeOption?.optionValue?.position ?? 0,
        };
      }) || []
    ).filter((size) => size.id !== '');

    setSizes(sizes?.sort((a, b) => a.position - b.position));
  };

  const handleColorClick = (colorId: string) => {
    handleSetSizes(colorId);
    setSelectedColorId(colorId);
  };

  const handleSizeClick = (sizeId: string) => {
    setSelectedSizeId(sizeId);
  };

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
    <Layout
      loading={isGetProductBySlugPending}
      className="bg-white! px-4! md:px-8! 2xl:px-16!"
    >
      <Content className="mx-auto max-w-7xl">
        <Breadcrumb items={breadCrumbItems} className="pt-8!" />
        <div className="lg:grid grid-cols-9 items-start gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20">
          <Space direction="vertical" className="col-span-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-3 shrink-0">
                {selectedVariant?.imageMappings?.map(({ image }, index) => (
                  <div
                    key={image?.id}
                    onClick={() => goToSlide(index)}
                    className={classNames(
                      'w-16 h-20 md:w-20 md:h-24 cursor-pointer rounded border-2 transition-all overflow-hidden',
                      currentSlide === index
                        ? 'border-black'
                        : 'border-gray-200'
                    )}
                  >
                    <img
                      src={image?.url}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="relative flex-1 overflow-hidden rounded-lg">
                <button
                  aria-label="Previous slide"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white py-2 px-3 rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-70"
                  onClick={() => carouselRef.current?.prev()}
                >
                  <LeftOutlined />
                </button>

                <button
                  aria-label="Next slide"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white py-2 px-3 rounded-full shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-70"
                  onClick={() => carouselRef.current?.next()}
                >
                  <RightOutlined />
                </button>

                <Carousel
                  autoplay
                  draggable
                  dots={false}
                  arrows={false}
                  ref={carouselRef}
                  autoplaySpeed={3000}
                  afterChange={(current) => setCurrentSlide(current)}
                >
                  {selectedVariant?.imageMappings?.map(({ image }) => (
                    <div key={image?.id} className="outline-none">
                      <Image
                        preview
                        width="100%"
                        src={image?.url}
                        alt="main product"
                        className="w-full aspect-3/4 object-cover bg-gray-100"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </Space>

          <div className="col-span-5 pt-8 lg:pt-0">
            <h2 className="text-primary text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
              {productDetails?.name}
            </h2>
            <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
              {productDetails?.description}
            </p>
            <Flex className="flex items-center mt-5!">
              <p className="text-primary font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0">
                {convertToVND(productDetails?.price)}
              </p>
            </Flex>

            <Divider />

            {productDetails?.variantColorData?.length && (
              <div className="mb-4">
                <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                  Màu sắc
                </h3>
                <Flex className="gap-x-3">
                  {colorImages?.map(({ colorId, image }) => (
                    <Flex
                      align="center"
                      justify="center"
                      key={colorId}
                      className={classNames(
                        'border rounded-full p-1! uppercase cursor-pointer overflow-hidden transition-all duration-300 ease-in-out',
                        selectedColorId === colorId
                          ? 'border-black'
                          : 'border-[#e5e5e5]'
                      )}
                      onClick={() => handleColorClick(colorId)}
                    >
                      <Image
                        width={36}
                        height={36}
                        src={image?.image?.url}
                        className="rounded-full object-cover"
                      />
                    </Flex>
                  ))}
                </Flex>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                Kích cỡ
              </h3>
              <Flex className="gap-x-3">
                {sizes?.map(({ id, value }) => (
                  <Flex
                    key={id}
                    align="center"
                    justify="center"
                    className={classNames(
                      'w-9 md:w-11 h-9 md:h-11 border rounded-md p-1! uppercase cursor-pointer transition-all duration-300 ease-in-out',
                      selectedSizeId === id
                        ? 'border-black'
                        : 'border-[#e5e5e5]'
                    )}
                    onClick={() => handleSizeClick(id)}
                  >
                    {value}
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
                <Button
                  title="Thêm vào giỏ hàng"
                  className="w-full py-3!"
                  disabled={!selectedVariant}
                />
              </Flex>
            </div>

            <Divider />

            <Space direction="vertical">
              <Flex align="center" className="gap-x-2">
                <span className="font-semibold text-primary">Thương hiệu:</span>
                <span className="text-body">{productDetails?.brand?.name}</span>
              </Flex>
              <Flex align="center" className="gap-x-2">
                <span className="font-semibold text-primary">Danh mục:</span>
                <span className="text-body">
                  {productDetails?.category?.name}
                </span>
              </Flex>
            </Space>

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
      </Content>
    </Layout>
  );
};

export default ProductDetailPage;
