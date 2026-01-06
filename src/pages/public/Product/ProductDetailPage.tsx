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
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { addToCart } from '~/features/cart/stores/cartSlice';
import { ICart } from '~/features/cart/types/cart';
import { productAPI } from '~/features/products/api/productApi';
import { IProduct, IVariant } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import Collapse from '~/shared/components/Collapse/Collapse';
import Image from '~/shared/components/Image/Image';
import { Content, Layout } from '~/shared/components/Layout/Layout';
import ProductModal from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import QuantitySelector from '~/shared/components/QuantitySelector/QuantitySelector';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useProductView } from '~/shared/hooks/useProductView';
import { useRecommendations } from '~/shared/hooks/useRecommendation';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { MAX_QUANTITY, MIN_QUANTITY } from '~/shared/utils/constants';
import {
  convertToVND,
  findFirstAvailableOptionValue,
  getOptionValueImage,
  isColorOption,
  validateStockAvailability,
} from '~/shared/utils/function';
import { PATH } from '~/shared/utils/path';
import ProductDetailSkeleton from './components/ProductDetailSkeleton';

const TOAST_COOLDOWN = 2000;

const ProductDetailPage = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { slug } = useParams<{ slug: string }>();

  const lastToastTime = useRef(0);
  const carouselRef = useRef<CarouselRef>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<IVariant>();

  const [productDetails, setProductDetails] = useState<IProduct>();
  const [productOptions, setProductOptions] = useState<IProduct['options']>([]);

  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const [selectedRecommendationProduct, setSelectedRecommendationProduct] =
    useState<IProduct>();

  const { currentUser } = useAppSelector((state) => state.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  const { products: recommendationProducts } = useRecommendations({
    userId: currentUser?.id,
  });

  const { mutate: getProductBySlug, isPending: isGetProductBySlugPending } =
    useMutation({
      mutationFn: (slug: string) => productAPI.getProductBySlug(slug),
      onSuccess: (response) => setProductDetails(response?.data),
    });

  const { trackImageClick } = useProductView({
    productId: productDetails?.id,
    userId: currentUser?.id,
    source: 'direct',
    enabled: !!productDetails?.id,
  });

  const breadCrumbItems: BreadcrumbProps['items'] = [
    {
      key: 'home',
      title: 'Trang chủ',
      href: PATH.HOME,
    },
    {
      key: 'products',
      title: 'Sản phẩm',
      href: PATH.PRODUCTS_WITHOUT_SLUG,
    },
    {
      key: 'product-details',
      title: productDetails?.name,
    },
  ];

  const collapseItems: CollapseProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Chi tiết sản phẩm',
        children: (
          <p className="leading-7 text-sm text-gray-600">
            {productDetails?.description ??
              `Đội ngũ Chăm sóc Khách hàng của chúng tôi làm việc 7 ngày một tuần
            và cung cấp 2 cách liên hệ: Email và Trò chuyện. Chúng tôi cố gắng
            phản hồi nhanh chóng, vì vậy bạn không cần phải chờ đợi quá lâu!`}
          </p>
        ),
      },
      {
        key: '2',
        label: 'Thông tin bổ sung',
        children: (
          <p className="leading-7 text-sm text-gray-600">
            Vui lòng đọc kỹ tài liệu. Chúng tôi cũng có một số video hướng dẫn
            trực tuyến về vấn đề này. Nếu sự cố vẫn tiếp diễn, vui lòng mở phiếu
            hỗ trợ trong diễn đàn hỗ trợ.
          </p>
        ),
      },
      {
        key: '3',
        label: 'Đánh giá của khách hàng',
        children: (
          <div className="leading-7 text-sm text-gray-600">
            <p>
              Trước tiên, vui lòng kiểm tra kết nối internet của bạn. Chúng tôi
              cũng có một số video hướng dẫn trực tuyến về vấn đề này. Nếu sự cố
              vẫn tiếp diễn, vui lòng mở phiếu hỗ trợ trong diễn đàn hỗ trợ.
            </p>
          </div>
        ),
      },
    ],
    [productDetails]
  );

  const isShowSkeleton = useMemo(
    () =>
      isGetProductBySlugPending ||
      !productDetails ||
      (productDetails && !Object.keys(productDetails)?.length),
    [isGetProductBySlugPending, productDetails]
  );

  const isDisabledAddToCart = useMemo(
    () =>
      selectedVariant?.stock === 0 ||
      !selectedVariant ||
      quantity > selectedVariant?.stock,
    [quantity, selectedVariant]
  );

  useEffect(() => {
    if (!slug) return;

    getProductBySlug(slug);
    window.scroll({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!productDetails) return;

    const colorOption = productDetails.options?.find((option) =>
      isColorOption(option.name)
    );
    const sizeOption = productDetails.options?.find(
      (option) => option.id !== colorOption?.id
    );

    let selectedColorId = '';
    if (colorOption) {
      selectedColorId = findFirstAvailableOptionValue(
        productDetails,
        colorOption.id
      );
      setSelectedColorId(selectedColorId);
    }

    if (sizeOption) {
      const selectedSizeId = findFirstAvailableOptionValue(
        productDetails,
        sizeOption.id,
        selectedColorId
      );
      setSelectedSizeId(selectedSizeId);
    }

    setProductOptions(productDetails.options);
  }, [productDetails]);

  useEffect(() => {
    if (!productDetails) return;

    if (productDetails?.hasVariants) {
      if (selectedColorId && selectedSizeId) {
        const selectedVariant = productDetails?.variants?.find((variant) => {
          const isMatchColorId = variant?.optionValues?.some(
            (optVal) => optVal?.optionValueId === selectedColorId
          );
          const isMatchSizeId = variant?.optionValues?.some(
            (optVal) => optVal?.optionValueId === selectedSizeId
          );

          return isMatchColorId && isMatchSizeId;
        });

        setSelectedVariant(selectedVariant);
      } else if (selectedSizeId) {
        const selectedVariant = productDetails?.variants?.find((variant) => {
          const isMatchSizeId = variant?.optionValues?.some(
            (optVal) => optVal?.optionValueId === selectedSizeId
          );

          return isMatchSizeId;
        });

        setSelectedVariant(selectedVariant);
      } else setSelectedVariant(undefined);
    } else {
      const product: IVariant = {
        ...productDetails,
        stock: Number(productDetails?.stock),
        imageMappings: productDetails?.images,
      };

      setSelectedVariant(product);
    }
  }, [selectedColorId, selectedSizeId, productDetails]);

  const goToSlide = (index: number) => {
    carouselRef.current?.goTo(index);
    setCurrentSlide(index);

    trackImageClick();
  };

  const handleDecrease = () => {
    setQuantity((prev) => prev - (prev === MIN_QUANTITY ? 0 : 1));
  };

  const handleIncrease = () => {
    if (!selectedVariant) return;

    const isAvailableStock = validateStockAvailability({
      item: {
        quantity: quantity + 1,
        optionValues: selectedVariant?.optionValues,
        stock: selectedVariant?.stock,
      },
      toastCoolDown: TOAST_COOLDOWN,
      lastToastTime,
    });

    if (!isAvailableStock) return;

    setQuantity((prev) => prev + (prev === MAX_QUANTITY ? 0 : 1));
  };

  const handleAddToCart = () => {
    if (
      !selectedVariant ||
      !productDetails ||
      !Object.keys(selectedVariant)?.length ||
      !Object.keys(productDetails)?.length
    ) {
      toast.error('Không tìm thấy sản phẩm để thêm vào giỏ hàng');
      return;
    }

    const currentCartItem = cartItems?.find(
      (cartItem) => cartItem?.variant?.id === selectedVariant?.id
    );

    let isAvailableStock;
    if (currentCartItem) {
      isAvailableStock = validateStockAvailability({
        item: {
          quantity: quantity + currentCartItem?.quantity,
          optionValues: selectedVariant?.optionValues,
          stock: selectedVariant?.stock,
        },
        toastCoolDown: TOAST_COOLDOWN,
        lastToastTime,
      });
    } else {
      isAvailableStock = validateStockAvailability({
        item: {
          quantity: quantity,
          optionValues: selectedVariant?.optionValues,
          stock: selectedVariant?.stock,
        },
        toastCoolDown: TOAST_COOLDOWN,
        lastToastTime,
      });
    }

    if (!isAvailableStock) return;

    const cartItem: ICart = {
      id: productDetails?.id,
      name: productDetails?.name,
      slug: productDetails?.slug,
      description: productDetails?.description,
      price: productDetails?.price,
      stock: productDetails?.stock,
      status: productDetails?.status,
      category: productDetails?.category,
      brand: productDetails?.brand,
      images: productDetails?.images,
      variant: selectedVariant,
      quantity,
    };

    dispatch(addToCart(cartItem));
  };

  const handleSelectedRecommendationProduct = (product: IProduct) => {
    setIsProductModalVisible(true);
    setSelectedRecommendationProduct(product);
  };

  const handleCancelProductModal = () => {
    setIsProductModalVisible(false);
    setSelectedRecommendationProduct(undefined);
  };

  return (
    <Layout className="bg-white! px-4! md:px-8! 2xl:px-16!">
      <Content className="mx-auto max-w-full lg:max-w-7xl max-lg:px-0!">
        <Breadcrumb items={breadCrumbItems} className="pt-8!" />
        <div
          className={classNames(
            'md:grid grid-cols-9 items-start gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20',
            isShowSkeleton ? 'w-svh' : ''
          )}
        >
          {isShowSkeleton ? (
            <ProductDetailSkeleton />
          ) : (
            <>
              <Flex
                className={classNames(
                  'md:col-span-4 gap-4 max-lg:flex-col-reverse',
                  isShowSkeleton ? 'h-full' : ''
                )}
              >
                <Flex
                  className="gap-1 shrink-0 overflow-x-scroll no-scrollbar select-none lg:flex-col lg:gap-3"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {selectedVariant?.imageMappings?.map(
                    ({ image, url }, index) => (
                      <div
                        key={image?.id}
                        className={classNames(
                          'w-16 h-20 md:w-20 md:h-24 cursor-pointer rounded border-2 transition-all overflow-hidden shrink-0',
                          currentSlide === index
                            ? 'border-black'
                            : 'border-gray-200'
                        )}
                        onClick={() => goToSlide(index)}
                      >
                        <img
                          alt="thumbnail"
                          src={url ?? image?.url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  )}
                </Flex>
                <div className="relative max-h-max flex-1 overflow-hidden rounded-lg select-none">
                  {selectedVariant &&
                    selectedVariant?.imageMappings?.length > 1 && (
                      <>
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
                      </>
                    )}

                  <Carousel
                    autoplay
                    draggable
                    dots={false}
                    arrows={false}
                    ref={carouselRef}
                    autoplaySpeed={3000}
                    afterChange={(current) => setCurrentSlide(current)}
                  >
                    {selectedVariant?.imageMappings?.map(({ image, url }) => (
                      <div
                        key={image?.id}
                        className="outline-none"
                        onClick={trackImageClick}
                      >
                        <Image
                          preview
                          width="100%"
                          alt="main product"
                          src={url ?? image?.url}
                          className="w-full aspect-3/4 object-cover bg-gray-100"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </Flex>

              <div className="col-span-5 pt-8 lg:pt-0">
                <h2 className="text-primary text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
                  {productDetails?.name}
                </h2>
                {/* <p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
                  {productDetails?.description}
                </p> */}
                <Flex className="flex items-center mt-5!">
                  <p className="text-primary font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl ltr:pr-2 rtl:pl-2 ltr:md:pr-0 rtl:md:pl-0 ltr:lg:pr-2 rtl:lg:pl-2 ltr:2xl:pr-0 rtl:2xl:pl-0">
                    {convertToVND(selectedVariant?.price)}
                  </p>
                </Flex>

                <Divider />

                {productOptions?.map(({ id, name, values }) => {
                  const isColorOpt = isColorOption(name);

                  return (
                    <div key={id} className="mb-4">
                      <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                        {name}
                      </h3>
                      <Flex className="gap-x-3">
                        {values?.map((val) => {
                          const imageUrl = isColorOpt
                            ? getOptionValueImage(val?.id, productDetails)
                            : null;

                          const isSelected = isColorOpt
                            ? selectedColorId === val?.id
                            : selectedSizeId === val?.id;

                          let stock = 0;
                          if (isColorOpt) {
                            stock =
                              productDetails?.variants
                                ?.filter((variant) =>
                                  variant.optionValues?.some(
                                    (ov) => ov.optionValueId === val?.id
                                  )
                                )
                                .reduce(
                                  (prev, current) =>
                                    prev + (current?.stock || 0),
                                  0
                                ) || 0;
                          } else {
                            stock =
                              productDetails?.variants
                                ?.filter((variant) => {
                                  const hasSize = variant.optionValues?.some(
                                    (ov) => ov.optionValueId === val?.id
                                  );

                                  if (selectedColorId) {
                                    const hasColor = variant.optionValues?.some(
                                      (ov) =>
                                        ov.optionValueId === selectedColorId
                                    );
                                    return hasSize && hasColor;
                                  }

                                  return hasSize;
                                })
                                .reduce(
                                  (prev, current) =>
                                    prev + (current?.stock || 0),
                                  0
                                ) || 0;
                          }

                          const isOutOfStock = stock === 0;

                          return (
                            <Flex
                              align="center"
                              justify="center"
                              key={val?.id}
                              className={classNames(
                                'border p-1! uppercase overflow-hidden transition-all duration-300 ease-in-out',
                                isColorOpt
                                  ? 'rounded-full'
                                  : 'rounded-md w-9 md:w-11 h-9 md:h-11',
                                isSelected
                                  ? 'border-black'
                                  : 'border-[#e5e5e5]',
                                isOutOfStock
                                  ? `${
                                      isColorOpt
                                        ? ''
                                        : 'text-white bg-[#c2c2c2] border-none'
                                    } cursor-not-allowed`
                                  : 'cursor-pointer'
                              )}
                              onClick={() => {
                                if (isOutOfStock) return;

                                isColorOpt
                                  ? setSelectedColorId(val?.id)
                                  : setSelectedSizeId(val?.id);
                              }}
                            >
                              {isColorOpt && imageUrl ? (
                                <Image
                                  width={36}
                                  height={36}
                                  src={imageUrl}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <span>{val?.value}</span>
                              )}
                            </Flex>
                          );
                        })}
                      </Flex>
                    </div>
                  );
                })}

                <div className="pt-2 md:pt-4">
                  <Flex
                    align="center"
                    className="w-full mb-4! gap-x-3 sm:gap-x-4"
                  >
                    <QuantitySelector
                      className="shrink-0"
                      quantity={quantity}
                      onDecrease={handleDecrease}
                      onIncrease={handleIncrease}
                    />
                    <Button
                      title="Thêm vào giỏ hàng"
                      className="w-full py-3!"
                      disabled={isDisabledAddToCart}
                      onClick={handleAddToCart}
                    />
                  </Flex>
                </div>

                <Divider />

                <Space direction="vertical">
                  <Flex align="center" className="gap-x-2">
                    <span className="font-semibold text-primary">
                      Thương hiệu:
                    </span>
                    <span className="text-body">
                      {productDetails?.brand?.name}
                    </span>
                  </Flex>
                  <Flex align="center" className="gap-x-2">
                    <span className="font-semibold text-primary">
                      Danh mục:
                    </span>
                    <span className="text-body">
                      {productDetails?.category?.name}
                    </span>
                  </Flex>
                </Space>

                <Divider />

                <Flex className="gap-y-6 md:gap-y-7">
                  <Collapse
                    ghost
                    items={collapseItems}
                    defaultActiveKey={'1'}
                    onChange={() => console.log('active')}
                  />
                </Flex>
              </div>
            </>
          )}
        </div>
      </Content>

      <Content>
        <Flex vertical className="gap-y-6">
          <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-primary">
            Có thể bạn sẽ thích
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-7 gap-y-8">
            {recommendationProducts?.map((product, index) => (
              <ProductCard
                vertical
                key={index}
                effect="lift"
                product={product}
                onClick={() => handleSelectedRecommendationProduct(product)}
              />
            ))}
          </div>
        </Flex>

        <ProductModal
          open={isProductModalVisible}
          product={selectedRecommendationProduct ?? ({} as IProduct)}
          setIsProductModalVisible={setIsProductModalVisible}
          onCancel={handleCancelProductModal}
        />
      </Content>
    </Layout>
  );
};

export default ProductDetailPage;
