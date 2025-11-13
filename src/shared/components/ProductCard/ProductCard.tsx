import { Flex } from 'antd';
import classNames from 'classnames';
import { HTMLAttributes, memo, ReactNode } from 'react';
import { PlaceholderMedium, PlaceholderSmall } from '~/assets/svg';

interface ProductCard {
  imgSrc: string;
  title: ReactNode;
  subTitle: ReactNode;
  price: number;
  originalPrice?: number;
  vertical?: boolean;
  size?: 'sm' | 'md';
  effect?: 'lift' | 'scale';
  customClassNames?: {
    img?: HTMLAttributes<HTMLElement>['className'];
    wrapper?: HTMLAttributes<HTMLElement>['className'];
  };
}

const ProductCard = ({
  imgSrc,
  title,
  subTitle,
  price,
  originalPrice,
  customClassNames,
  size = 'md',
  vertical = false,
  effect = 'scale',
}: ProductCard) => {
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
      <Flex
        vertical
        className={classNames(
          'overflow-hidden w-full py-2! px-4!',
          vertical ? '' : 'justify-center'
        )}
      >
        <h4 className="font-semibold text-sm sm:text-base md:text-sm lg:text-base xl:text-lg text-primary mb-1 truncate">
          {title}
        </h4>
        <p className="truncate text-xs lg:text-sm text-body">
          {subTitle}
        </p>
        <Flex align="center" className="gap-x-2 mt-2.5!">
          <p className="font-semibold text-sm lg:text-lg text-primary">
            ${price}
          </p>
          {originalPrice && (
            <p className="line-through text-sm lg:text-base text-gray-400">
              ${originalPrice}
            </p>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(ProductCard);
