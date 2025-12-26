import { FilterOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Select } from 'antd';
import { useEffect, useState } from 'react';

import { productAPI } from '~/features/products/api/productApi';
import { IProduct, IProductParams } from '~/features/products/types/product';
import Button from '~/shared/components/Button/Button';
import { Layout } from '~/shared/components/Layout/Layout';
import ProductModal from '~/shared/components/Modal/ProductModal';
import ProductCard from '~/shared/components/ProductCard/ProductCard';
import Filter from './Filter';

const ProductPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();

  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const { mutate: getProducts, isPending: isGetProductPending } = useMutation({
    mutationFn: (params: IProductParams) => productAPI.getProducts(params),
    onSuccess: (response) => {
      setProducts(response?.data);
    },
  });

  useEffect(() => {
    const params: IProductParams = { status: 'active' };
    getProducts(params);
  }, []);

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

  return (
    <Layout
      loading={isGetProductPending}
      className="bg-white! px-4! md:px-8! 2xl:px-16!"
    >
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
                    <FilterOutlined />
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
        </Flex>
        <ProductModal
          open={isProductModalVisible}
          // quantity={quantity}
          // selectedColor={color}
          // selectedSize={size?.size}
          product={selectedProduct || ({} as IProduct)}
          // onDecrease={handleDecrease}
          // onIncrease={handleIncrease}
          // onSelectSize={handleSelectedSize}
          // onSelectColor={handleSelectedColor}
          onCancel={handleProductModalCancel}
          setIsProductModalVisible={setIsProductModalVisible}
        />
      </Flex>
    </Layout>
  );
};

export default ProductPage;
