import { Flex, ModalProps } from 'antd';
import { memo } from 'react';

import { FILE_NOT_FOUND_ILLUSTRATION } from '~/assets/images';
import { PlaceholderExtraLarge } from '~/assets/svg';
import { Product } from '~/pages/public/Home/HomePage';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { SIZES } from '~/shared/utils/constants';
import Button from '../Button/Button';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import Modal from './Modal';

interface ProductModalProps extends ModalProps {
  quantity: number;
  product: Product;
  colors?: string[];
  sizes?: readonly Size['size'][];
  selectedSize?: string;
  selectedColor?: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onSelectColor?: (value: string) => void;
  onSelectSize?: (value: Size['size']) => void;
}

export interface Size {
  size: 's' | 'm' | 'l' | 'xl';
}

const fallbackImg = FILE_NOT_FOUND_ILLUSTRATION;
const DEFAULT_COLORS = ['#e86c25', '#ffa5b4', '#8224e3', '#dd3333'];

const ProductModal = ({
  quantity,
  product,
  classNames,
  selectedSize,
  selectedColor,
  sizes = SIZES,
  colors = DEFAULT_COLORS,
  onDecrease,
  onIncrease,
  onSelectSize,
  onSelectColor,
  ...props
}: ProductModalProps) => {
  const { isLg } = useBreakpoint();

  const customClassNames: ModalProps['classNames'] = {
    body: 'max-h-[calc(-120px+100vh)] overflow-auto',
    content: 'overflow-hidden p-0!',
    footer: 'mt-0!',
    ...classNames,
  };

  return (
    <Modal
      centered
      width={isLg ? 975 : 650}
      classNames={customClassNames}
      {...props}
    >
      <Flex className="h-full max-lg:flex-col">
        <span className="relative inline-block overflow-hidden max-w-full">
          <span className="block">
            <PlaceholderExtraLarge
              style={{
                width: 'initial',
              }}
              className="block max-w-full max-lg:max-h-[430px]"
            />
          </span>
          <img
            src={product?.img || fallbackImg}
            className="block w-full absolute top-0 bottom-0 left-0 right-0 inset-0 m-auto min-w-full max-w-full min-h-full max-h-full object-cover"
          />
        </span>
        <Flex vertical className="p-5! md:p-8! w-full">
          <div className="pb-5">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              <h2 className="text-primary text-lg md:text-xl lg:text-2xl font-semibold">
                {product?.title || '-'}
              </h2>
            </div>
            <p className="text-sm leading-6 md:text-body md:leading-7">
              {product?.subTitle || '-'}
            </p>
            <Flex align="center" className="mt-3">
              <p className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                ${product?.price || 0}
              </p>
              <p className="line-through font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                ${product?.originalPrice || 0}
              </p>
            </Flex>
          </div>
          <div className="mb-4">
            <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
              Kích cỡ
            </h3>
            <Flex className="gap-x-3">
              {sizes.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="center"
                  className={`w-9 md:w-11 h-9 md:h-11 border rounded-md p-1! uppercase cursor-pointer ${
                    selectedSize === item ? 'border-black' : 'border-gray-100'
                  }`}
                  onClick={() => onSelectSize?.(item)}
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
              {colors.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="center"
                  className={`w-9 md:w-11 h-9 md:h-11 border rounded-md p-1! uppercase cursor-pointer ${
                    selectedColor === item ? 'border-black' : 'border-gray-100'
                  }`}
                  onClick={() => onSelectColor?.(item)}
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
                onDecrease={onDecrease}
                onIncrease={onIncrease}
              />
              <Button title="Thêm vào giỏ hàng" className="w-full py-3!" />
            </Flex>
            <Button title="Xem chi tiết" className="w-full py-3!" />
          </div>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default memo(ProductModal);
