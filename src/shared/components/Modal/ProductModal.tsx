import { Flex, ModalProps, Space } from 'antd';
import {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FILE_NOT_FOUND_ILLUSTRATION } from '~/assets/images';
import { PlaceholderExtraLarge } from '~/assets/svg';
import { addToCart, toggleCartDrawer } from '~/features/cart/stores/cartSlice';
import { ICart } from '~/features/cart/types/cart';
import { IProduct, IVariant } from '~/features/products/types/product';
import { useToast } from '~/shared/contexts/NotificationContext';
import useBreakpoint from '~/shared/hooks/useBreakpoint';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';
import { MAX_QUANTITY, MIN_QUANTITY } from '~/shared/utils/constants';
import {
  convertToVND,
  findFirstAvailableOptionValue,
  getOptionValueImage,
  isColorOption,
  validateStockAvailability,
} from '~/shared/utils/function';
import Button from '../Button/Button';
import Image from '../Image/Image';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { PATH } from '~/shared/utils/path';

interface ProductModalProps extends ModalProps {
  product: IProduct;
  setIsProductModalVisible: Dispatch<SetStateAction<boolean>>;
}

const TOAST_COOLDOWN = 2000;
const fallbackImg = FILE_NOT_FOUND_ILLUSTRATION;

const ProductModal = ({
  open,
  product,
  classNames,
  onCancel,
  setIsProductModalVisible,
  ...props
}: ProductModalProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const lastToastTime = useRef(0);
  const { isLg } = useBreakpoint();

  const [quantity, setQuantity] = useState(1);

  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<IVariant>();

  const { items: cartItems, loading: cartLoading } = useAppSelector(
    (state) => state.cart
  );

  const customClassNames: ModalProps['classNames'] = {
    body: 'max-h-[calc(-120px+100vh)] max-lg:overflow-auto lg:h-[600px]',
    content: 'overflow-hidden p-0!',
    footer: 'mt-0!',
    ...classNames,
  };

  const defaultProduct = useMemo(
    () => ({
      imageUrl:
        product?.images?.[0]?.url ||
        selectedVariant?.imageMappings?.[0]?.image?.url,
      price: product?.price || selectedVariant?.price,
    }),
    [selectedVariant, product]
  );

  useEffect(() => {
    if (open) return;

    setQuantity(1);
    setSelectedColorId('');
    setSelectedSizeId('');
    setSelectedVariant(undefined);
  }, [open]);

  useEffect(() => {
    if (!product || !open) return;

    const colorOption = product.options?.find((option) =>
      isColorOption(option.name)
    );
    const sizeOption = product.options?.find(
      (option) => option.id !== colorOption?.id
    );

    let selectedColorId = '';
    if (colorOption) {
      selectedColorId = findFirstAvailableOptionValue(product, colorOption.id);
      setSelectedColorId(selectedColorId);
    }

    if (sizeOption) {
      const selectedSizeId = findFirstAvailableOptionValue(
        product,
        sizeOption.id,
        selectedColorId
      );
      setSelectedSizeId(selectedSizeId);
    }
  }, [product, open]);

  useEffect(() => {
    if (!product) return;

    if (product?.hasVariants) {
      if (selectedColorId && selectedSizeId) {
        const selectedVariant = product?.variants?.find((variant) => {
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
        const selectedVariant = product?.variants?.find((variant) => {
          const isMatchSizeId = variant?.optionValues?.some(
            (optVal) => optVal?.optionValueId === selectedSizeId
          );

          return isMatchSizeId;
        });

        setSelectedVariant(selectedVariant);
      } else setSelectedVariant(undefined);
    } else {
      setSelectedVariant({
        ...product,
        stock: Number(product?.stock),
        imageMappings: product?.images,
      });
    }
  }, [selectedColorId, selectedSizeId, product]);

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
      !product ||
      !Object.keys(selectedVariant)?.length ||
      !Object.keys(product)?.length
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
      id: product?.id,
      name: product?.name,
      slug: product?.slug,
      description: product?.description,
      price: product?.price,
      stock: product?.stock,
      status: product?.status,
      category: product?.category,
      brand: product?.brand,
      images: product?.images,
      variant: product?.hasVariants ? selectedVariant : undefined,
      quantity,
    };

    dispatch(addToCart(cartItem));
  };

  const handelViewCart = () => {
    setIsProductModalVisible(false);
    dispatch(toggleCartDrawer(true));
  };

  const handleViewDetails = () => {
    setIsProductModalVisible(false);
    navigate(PATH.PRODUCT_DETAILS.replace(':slug', product?.slug));
  };

  return (
    <Modal
      centered
      open={open}
      footer={false}
      width={isLg ? 975 : 650}
      classNames={customClassNames}
      onCancel={onCancel}
      {...props}
    >
      <Flex className="h-full max-lg:flex-col">
        <span className="relative inline-block overflow-hidden max-w-full">
          <span className="block">
            <PlaceholderExtraLarge
              style={{
                width: 'initial',
              }}
              className="block max-w-full"
            />
          </span>
          <img
            src={defaultProduct?.imageUrl || fallbackImg}
            className="block w-full absolute top-0 bottom-0 left-0 right-0 inset-0 m-auto min-w-full max-w-full min-h-full max-h-full object-cover"
          />
        </span>
        <Flex
          vertical
          style={{
            scrollbarWidth: 'thin',
          }}
          className="p-5! md:p-8! w-full overflow-y-scroll"
        >
          <div className="pb-5">
            <div className="mb-2 md:mb-2.5 block -mt-1.5">
              <h2 className="text-primary text-lg md:text-xl lg:text-2xl font-semibold">
                {product?.name || '-'}
              </h2>
            </div>
            {product?.description && (
              <p className="text-sm leading-6 md:text-body md:leading-7">
                {product?.description}
              </p>
            )}
            <Flex align="center" className="mt-3">
              <p className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
                {convertToVND(defaultProduct?.price)}
              </p>
            </Flex>
          </div>

          <div className="mb-4">
            {product?.options?.map(({ id, name, values }) => {
              const isColorOpt = isColorOption(name);

              return (
                <div key={id} className="mb-4">
                  <h3 className="text-base md:text-lg text-heading font-semibold mb-2.5 capitalize">
                    {name}
                  </h3>
                  <Flex className="gap-x-3">
                    {values?.map((val) => {
                      const imageUrl = isColorOpt
                        ? getOptionValueImage(val?.id, product)
                        : null;

                      const isSelected = isColorOpt
                        ? selectedColorId === val?.id
                        : selectedSizeId === val?.id;

                      let stock = 0;
                      if (isColorOpt) {
                        stock =
                          product?.variants
                            ?.filter((variant) =>
                              variant.optionValues?.some(
                                (ov) => ov.optionValueId === val?.id
                              )
                            )
                            .reduce(
                              (prev, current) => prev + (current?.stock || 0),
                              0
                            ) || 0;
                      } else {
                        stock =
                          product?.variants
                            ?.filter((variant) => {
                              const hasSize = variant.optionValues?.some(
                                (ov) => ov.optionValueId === val?.id
                              );

                              if (selectedColorId) {
                                const hasColor = variant.optionValues?.some(
                                  (ov) => ov.optionValueId === selectedColorId
                                );
                                return hasSize && hasColor;
                              }

                              return hasSize;
                            })
                            .reduce(
                              (prev, current) => prev + (current?.stock || 0),
                              0
                            ) || 0;
                      }

                      const isOutOfStock = stock === 0;

                      return (
                        <Flex
                          align="center"
                          justify="center"
                          key={val?.id}
                          className={`border p-1! uppercase overflow-hidden transition-all duration-300 ease-in-out ${
                            isColorOpt
                              ? 'rounded-full'
                              : 'rounded-md w-9 md:w-11 h-9 md:h-11'
                          } ${
                            isSelected ? 'border-black' : 'border-[#e5e5e5]'
                          } ${
                            isOutOfStock
                              ? `${
                                  isColorOpt
                                    ? ''
                                    : 'text-white bg-[#c2c2c2] border-none'
                                } cursor-not-allowed`
                              : 'cursor-pointer'
                          }`}
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
          </div>

          <Space direction="vertical" className="pt-2 md:pt-4">
            <Flex align="center" className="w-full gap-x-3 sm:gap-x-4">
              <QuantitySelector
                className="shrink-0"
                quantity={quantity}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
              />
              <Button
                disabled={cartLoading}
                title="Thêm vào giỏ hàng"
                className="w-full py-3!"
                onClick={handleAddToCart}
              />
            </Flex>
            <Button
              title="Xem giỏ hàng"
              displayType="outlined"
              className="w-full py-3!"
              onClick={handelViewCart}
            />
            <Button
              title="Xem chi tiết"
              className="w-full py-3!"
              onClick={handleViewDetails}
            />
          </Space>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default memo(ProductModal);
