import { useMutation } from '@tanstack/react-query';
import { Flex, Select } from 'antd';
import { useEffect, useState } from 'react';

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
import useDebounceCallback from '~/shared/hooks/useDebounce';
import useQueryParams from '~/shared/hooks/useQueryParams';
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
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();

  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const [categoryOptions, setCategoryOptions] = useState<IOption[]>();
  const [brandOptions, setBrandOptions] = useState<IOption[]>();

  const [rangPrice, setRangPrice] = useState([0, 20000]);

  const [filterParams, setFilterParams] =
    useState<IFilterParams>(initialFilterParams);

  const { mutate: getProducts, isPending: isGetProductPending } = useMutation({
    mutationFn: (params: IProductParams) => productAPI.getProducts(params),
    onSuccess: (response) => {
      setProducts(response?.data);
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

      const params = new URLSearchParams();

      if (brandValues.length > 0) params.set('brand', brandValues.join(','));
      if (categoryValues.length > 0)
        params.set('category', categoryValues.join(','));

      const queryString = params.toString();
      navigate(queryString ? `?${queryString}` : '', { replace: true });

      const productParams: IProductParams = {
        status: 'active',
        categorySlugs: categoryValues,
        brandSlugs: brandValues,
      };

      getProducts(productParams);
    },
    500
  );

  useEffect(() => {
    const params: IProductParams = { status: 'active' };
    getProducts(params);

    getBrandOptions();
    getCategoryOptions();
  }, []);

  useEffect(() => {
    handleSyncFilters(filterParams);
  }, [filterParams]);

  console.log(rangPrice);

  useEffect(() => {
    const urlCategories = queryParams.get('category')?.split(',') || [];
    const urlBrands = queryParams.get('brand')?.split(',') || [];

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
  }, [categoryOptions, brandOptions]);

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
    setFilterParams({ brands: [], categories: [] });
  };

  return (
    <Layout
      loading={
        // isGetProductPending ||
        isGetCategoryOptionPending || isGetBrandOptionPending
      }
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
          {products?.length ? (
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
          ) : (
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
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-sm text-body md:text-base leading-7 pt-2 md:pt-3.5 pb-7 md:pb-9">
                  Không có sản phẩm nào khớp với bộ lọc của bạn. Hãy thử điều
                  chỉnh bộ lọc hoặc xóa một số tiêu chí.
                </p>
                <Button
                  title={
                    <Flex align="center" className="font-normal">
                      <FilterAdjust className="w-4 h-4" />
                      <p className="ltr:pl-1.5 rtl:pr-1.5">Xóa bộ lọc</p>
                    </Flex>
                  }
                  onClick={() => handleClearFilter()}
                />
              </Flex>
            </Flex>
          )}
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
