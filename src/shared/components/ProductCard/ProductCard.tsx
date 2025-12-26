import { Flex } from 'antd';
import classNames from 'classnames';
import { HTMLAttributes, memo, useMemo } from 'react';

import { FALLBACK_IMG } from '~/assets/images';
import { PlaceholderMedium, PlaceholderSmall } from '~/assets/svg';
import { IProduct } from '~/features/products/types/product';
import { convertToVND } from '~/shared/utils/function';

interface ProductCardProps {
  product: IProduct;
  vertical?: boolean;
  size?: 'sm' | 'md';
  effect?: 'lift' | 'scale';
  customClassNames?: {
    img?: HTMLAttributes<HTMLElement>['className'];
    wrapper?: HTMLAttributes<HTMLElement>['className'];
  };
  onClick?: () => void;
}

const ProductCard = ({
  product,
  customClassNames,
  size = 'md',
  vertical = false,
  effect = 'scale',
  onClick,
}: ProductCardProps) => {
  const defaultProduct = useMemo(() => {
    const productVariant = product?.variants?.[0];

    return {
      imageUrl:
        product?.images?.[0]?.url ||
        productVariant?.imageMappings?.[0]?.image?.url,
      price: product?.price || productVariant?.price,
    };
  }, [product]);

  return (
    <Flex
      vertical={vertical}
      className={classNames(
        'group rounded-md cursor-pointer',
        vertical ? '' : 'bg-[#f9f9f9]',
        effect === 'lift'
          ? 'transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-product'
          : ''
      )}
      onClick={onClick}
    >
      <div
        className={classNames(
          'flex',
          customClassNames?.img,
          vertical ? 'mb-3 md:mb-3.5' : ''
        )}
      >
        <span className="relative inline-block overflow-hidden rounded-md max-w-full">
          <span className="block">
            {size === 'md' ? (
              <PlaceholderMedium
                style={{
                  width: 'initial',
                  height: 'initial',
                }}
                className="block max-w-full"
              />
            ) : (
              <PlaceholderSmall
                style={{
                  width: 'initial',
                  height: 'initial',
                }}
                className="block max-w-full"
              />
            )}
          </span>
          <img
            src={defaultProduct?.imageUrl || FALLBACK_IMG}
            className={classNames(
              'block absolute inset-0 m-auto min-w-full max-w-full min-h-full max-h-full bg-gray-300 object-cover rounded-s-md w-full transition duration-200 ease-in rounded-md',
              effect === 'scale' ? 'group-hover:scale-115' : ''
            )}
          />
        </span>
        <Flex
          vertical
          align="start"
          className="absolute top-3.5 md:top-5 3xl:top-7 ltr:left-3.5 rtl:right-3.5 ltr:md:left-5 rtl:md:right-5 ltr:3xl:left-7 rtl:3xl:right-7 gap-y-1"
        ></Flex>
      </div>
      <Flex
        vertical
        className={classNames(
          'overflow-hidden w-full py-2! px-4!',
          vertical ? '' : 'justify-center'
        )}
      >
        <h4 className="font-semibold text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-primary mb-1 truncate">
          {product?.name}
        </h4>
        <p className="truncate text-xs lg:text-sm text-body">
          {product?.description}
        </p>
        <Flex align="center" className="gap-x-2 mt-2.5!">
          <p className="font-semibold text-sm lg:text-lg text-primary">
            {convertToVND(defaultProduct?.price)}
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProductCard);
