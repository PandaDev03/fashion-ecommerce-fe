import { Flex } from 'antd';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import { PlaceholderMedium, PlaceholderSmall } from '~/assets/svg';

interface ProductCard {
  imgSrc: string;
  title: ReactNode;
  subTitle: ReactNode;
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md';
  effect?: 'lift' | 'scale';
}

const ProductCard = ({
  imgSrc,
  title,
  subTitle,
  price,
  originalPrice,
  size = 'md',
  effect = 'scale',
}: ProductCard) => {
  return (
    <Flex
      vertical
      className={classNames(
        'group rounded-md cursor-pointer',
        effect === 'lift'
          ? 'transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-product'
          : ''
      )}
    >
      <div className="flex mb-3 md:mb-3.5">
        <span className="relative inline-block overflow-hidden rounded-md max-w-full">
          <span className="block max-w-full">
            {size === 'md' ? (
              <PlaceholderMedium className="block max-w-full" />
            ) : (
              <PlaceholderSmall className="block max-w-full" />
            )}
          </span>
          <img
            src={imgSrc}
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
      <Flex vertical className="py-2! px-4!">
        <h4 className="font-semibold text-base text-primary mb-1">{title}</h4>
        <p className="truncate text-body max-w-[250px]">{subTitle}$</p>
        <Flex className="gap-x-2">
          <p className="font-semibold text-lg text-primary mt-2.5">{price}$</p>
          {originalPrice && (
            <p className="line-through text-base text-body">{originalPrice}</p>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProductCard);
