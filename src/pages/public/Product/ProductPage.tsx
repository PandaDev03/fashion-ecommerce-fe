import { useMutation } from '@tanstack/react-query';
import { Flex, Select } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmptyOrder, FilterAdjust, PlaceholderLarge } from '~/assets/svg';
import { brandApi } from '~/features/brand/api/brandApi';
import { categoryApi } from '~/features/category/api/categoryApi';
import { productAPI } from '~/features/products/api/productApi';
import { IProduct, IProductParams } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import { Layout } from '~/shared/components/Layout/Layout';
import ProductModal from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import ProductCardSkeleton from '~/shared/components/ProductCardSkeleton/ProductCardSkeleton';
import { useToast } from '~/shared/contexts/NotificationContext';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import useDebounceCallback from '~/shared/hooks/useDebounce';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { RANGE_PRICE_CONSTANTS } from '~/shared/utils/constants';
import Filter from './Filter';

export interface IOption {
  label: string;
  value: string;
}

export interface IFilterParams {
  categories: IOption[];
  brands: IOption[];
}

const initialFilterParams: IFilterParams = {
  categories: [],
  brands: [],
};

const ProductPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { queryParams } = useQueryParams();

  const flagRef = useRef(false);
  const isFirstRender = useRef(true);
  const skeletonTimeoutRef = useRef<NodeJS.Timeout>(null);

  const { is2Xl, isXl, isSm } = useBreakpoint();

  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const [categoryOptions, setCategoryOptions] = useState<IOption[]>();
  const [brandOptions, setBrandOptions] = useState<IOption[]>();

  const [rangPrice, setRangPrice] = useState<number[]>([
    RANGE_PRICE_CONSTANTS.MIN,
    RANGE_PRICE_CONSTANTS.MAX_PLUS,
  ]);

  const [filterParams, setFilterParams] =
    useState<IFilterParams>(initialFilterParams);

  const isFilter = useMemo(
    () => !!filterParams?.categories?.length || !!filterParams?.brands?.length,
    [filterParams, products]
  );

  const { mutate: getProducts, isPending: isGetProductPending } = useMutation({
    mutationFn: (params: IProductParams) => productAPI.getProducts(params),
    onMutate: () => {
      skeletonTimeoutRef.current = setTimeout(() => {
        setShouldShowSkeleton(true);
      }, 200);
    },
    onSuccess: (response) => {
      if (skeletonTimeoutRef.current) clearTimeout(skeletonTimeoutRef.current);
      setShouldShowSkeleton(false);

      if (!flagRef.current) flagRef.current = true;
      setProducts(response?.data);
    },
    onError: (error: any) => {
      if (skeletonTimeoutRef.current) clearTimeout(skeletonTimeoutRef.current);

      setShouldShowSkeleton(false);
      toast.error(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi lây thông tin sản phẩm. Vui lòng thử lại sau'
      );
    },
  });

  const { mutate: getCategoryOptions, isPending: isGetCategoryOptionPending } =
    useMutation({
      mutationFn: () => categoryApi.getAllParents(),
      onSuccess: (response) => {
        const options: IOption[] = response?.data?.map((opt: any) => ({
          label: opt?.name,
          value: opt?.slug,
        }));

        setCategoryOptions(options);
      },
    });

  const { mutate: getBrandOptions, isPending: isGetBrandOptionPending } =
    useMutation({
      mutationFn: () => brandApi.getBrandOptions(),
      onSuccess: (response) => {
        const options: IOption[] = response?.data?.map((opt: any) => ({
          label: opt?.name,
          value: opt?.slug,
        }));

        setBrandOptions(options);
      },
    });

  const handleSyncFilters = useDebounceCallback(
    (currentFilters: IFilterParams) => {
      const categoryValues = currentFilters.categories.map((c) => c.value);
      const brandValues = currentFilters.brands.map((b) => b.value);

      const [minPrice, maxPrice] = rangPrice;

      const params = new URLSearchParams();

      if (brandValues.length > 0) params.set('brand', brandValues.join(','));
      if (categoryValues.length > 0)
        params.set('category', categoryValues.join(','));

      if (minPrice) params.set('min', minPrice?.toString());
      if (maxPrice && maxPrice !== RANGE_PRICE_CONSTANTS.MAX_PLUS)
        params.set('max', maxPrice?.toString());

      const queryString = params.toString();
      navigate(queryString ? `?${queryString}` : '', { replace: true });

      const productParams: IProductParams = {
        status: 'active',
        brandSlugs: brandValues,
        categorySlugs: categoryValues,
        minPrice: minPrice * RANGE_PRICE_CONSTANTS.MULTIPLIER,
        maxPrice:
          maxPrice !== RANGE_PRICE_CONSTANTS.MAX_PLUS
            ? maxPrice * RANGE_PRICE_CONSTANTS.MULTIPLIER
            : undefined,
      };
      getProducts(productParams);
    },
    500
  );

  useEffect(() => {
    getBrandOptions();
    getCategoryOptions();

    window.scroll({ top: 0, behavior: 'smooth' });

    return () => {
      if (skeletonTimeoutRef.current) clearTimeout(skeletonTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) return;
    handleSyncFilters(filterParams);
  }, [filterParams, rangPrice, isFirstRender]);

  useEffect(() => {
    const urlCategories = queryParams.get('category')?.split(',') || [];
    const urlBrands = queryParams.get('brand')?.split(',') || [];
    const urlMinPrice = queryParams.get('min');
    const urlMaxPrice = queryParams.get('max');
    if (categoryOptions && brandOptions) {
      const initialCats = categoryOptions.filter((opt) =>
        urlCategories.includes(opt.value)
      );
      const initialBrands = brandOptions.filter((opt) =>
        urlBrands.includes(opt.value)
      );
      if (filterParams.categories.length === 0 && initialCats.length > 0) {
        setFilterParams((prev) => ({
          ...prev,
          categories: initialCats,
          brands: initialBrands,
        }));
      }
    }
    if (urlMinPrice && urlMaxPrice)
      setRangPrice([Number(urlMinPrice), Number(urlMaxPrice)]);
    else if (urlMinPrice)
      setRangPrice([Number(urlMinPrice), RANGE_PRICE_CONSTANTS.MAX_PLUS]);
    else if (urlMaxPrice)
      setRangPrice([RANGE_PRICE_CONSTANTS.MIN, Number(urlMaxPrice)]);
    else
      setRangPrice([RANGE_PRICE_CONSTANTS.MIN, RANGE_PRICE_CONSTANTS.MAX_PLUS]);

    isFirstRender.current = false;
  }, [categoryOptions, brandOptions]);

  const renderContent = () => {
    if (shouldShowSkeleton)
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8 ">
          <ProductCardSkeleton count={is2Xl ? 10 : isXl ? 8 : isSm ? 6 : 4} />
        </div>
      );

    if (flagRef.current) {
      if (products?.length)
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 lg:gap-x-5 xl:gap-x-7 gap-y-3 xl:gap-y-5 2xl:gap-y-8 ">
            {products?.map((product, index) => (
              <ProductCard
                vertical
                key={index}
                effect="lift"
                product={product}
                onClick={() => handleProductCardClick(product)}
              />
            ))}
          </div>
        );

      return (
        <Flex
          vertical
          align="center"
          justify="center"
          className="w-full col-span-10 lg:col-span-8 bg-white text-center px-16! py-16! sm:py-20! lg:py-24! xl:py-32!"
        >
          <div className="relative max-w-full">
            <span
              style={{
                width: 'initial',
                height: 'initial',
              }}
            >
              <PlaceholderLarge
                style={{
                  width: 'initial',
                  height: 'initial',
                }}
                className="block min-w-full max-w-full min-h-full max-h-full"
              />
              <EmptyOrder className="absolute inset-0 top-0 right-0 min-w-full max-w-full min-h-full max-h-full" />
            </span>
          </div>
          <Flex vertical align="center">
            <h3 className="font-bold text-primary text-5xl">
              {isFilter
                ? 'Không tìm thấy sản phẩm phù hợp'
                : 'Chưa có sản phẩm nào'}
            </h3>
            <p className="text-sm text-body md:text-base leading-7 pt-2 md:pt-3.5 pb-7 md:pb-9">
              {isFilter
                ? 'Không có sản phẩm nào khớp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc hoặc xóa một số tiêu chí.'
                : 'Hiện tại chưa có sản phẩm nào trong danh mục này. Vui lòng quay lại sau.'}
            </p>
            {isFilter && (
              <Button
                title={
                  <Flex align="center" className="font-normal">
                    <FilterAdjust className="w-4 h-4" />
                    <p className="ltr:pl-1.5 rtl:pr-1.5">Xóa bộ lọc</p>
                  </Flex>
                }
                onClick={() => handleClearFilter()}
              />
            )}
          </Flex>
        </Flex>
      );
    }
  };

  const handleCloseFilterDrawer = () => {
    setIsOpenFilterDrawer(false);
  };

  const handleProductCardClick = (product: IProduct) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  const handleProductModalCancel = () => {
    setSelectedProduct(undefined);
    setIsProductModalVisible(false);
  };

  const handleClearFilter = () => {
    setFilterParams({
      brands: [],
      categories: [],
    });
  };

  return (
    <Layout
      // loading={isGetCategoryOptionPending || isGetBrandOptionPending}
      className="bg-white! px-4! md:px-8! 2xl:px-16!"
    >
      <div className="grid grid-cols-10 pt-8! gap-x-8">
        <Filter
          className="col-span-2"
          rangePrice={rangPrice}
          filterParams={filterParams}
          totalProducts={products?.length}
          isOpenFilterDrawer={isOpenFilterDrawer}
          categoryOptions={categoryOptions || []}
          brandOptions={brandOptions || []}
          setRangPrice={setRangPrice}
          setFilterParams={setFilterParams}
          onClose={handleCloseFilterDrawer}
          onClearFilter={handleClearFilter}
        />

        <Flex vertical className="gap-y-7 col-span-10 lg:col-span-8">
          <Flex align="center" justify="space-between" className="w-full">
            <h1 className="text-2xl text-primary font-bold hidden lg:inline-flex pb-1">
              Sản phẩm
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
                    <FilterAdjust />
                    <p>Bộ lọc</p>
                  </Flex>
                }
                className="lg:hidden! bg-[#f9f9f9]! text-primary!"
                onClick={() => setIsOpenFilterDrawer(true)}
              />
              <Flex align="center">
                <p className="shrink-0 text-body text-xs md:text-sm leading-4 ltr:pr-4 rtl:pl-4 ltr:md:mr-6 rtl:md:ml-6 ltr:pl-2 rtl:pr-2 hidden lg:block">
                  {products?.length} mục
                </p>
                <Select className="min-w-44" value="Tùy chọn sắp xếp" />
              </Flex>
            </Flex>
          </Flex>

          {renderContent()}
        </Flex>

        <ProductModal
          open={isProductModalVisible}
          product={selectedProduct || ({} as IProduct)}
          onCancel={handleProductModalCancel}
          setIsProductModalVisible={setIsProductModalVisible}
        />
      </div>
    </Layout>
  );
};

export default ProductPage;
