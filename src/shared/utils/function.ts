import { v4 as uuidv4 } from 'uuid';

import { FileType } from '../components/Upload/Dragger';
import { DEFAULT_URL_FIELDS, GUEST_USER_KEY } from './constants';
import { IProduct, IVariant } from '~/features/products/types/product';
import { RefObject } from 'react';
import { notificationEmitter } from './notificationEmitter';

export const generateSlug = (name: string) => {
  if (!name) return undefined;

  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const removeUrlPrefix = <T extends Record<string, any>>(data: T) => {
  const cleanedUrl = Object.entries(data).reduce((prev, current) => {
    const [key, value] = current;

    prev[key] =
      typeof value === 'string' ? value.replace(/^(https?:\/\/)/, '') : value;

    return prev;
  }, {} as Record<string, any>);

  return cleanedUrl;
};

export const normalizeUrlWithHttps = (
  url: string | undefined
): string | undefined => {
  if (!url || url.trim() === '') return undefined;

  const trimmedUrl = url.trim();

  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://'))
    return trimmedUrl;

  return `https://${trimmedUrl}`;
};

export const normalizeObjectStrings = <T extends Record<string, any>>(
  data: T,
  urlFields: string[] = DEFAULT_URL_FIELDS
): T => {
  const normalizedObj = Object.entries(data).reduce((prev, current) => {
    const [key, value] = current;

    if (typeof value === 'string') {
      const trimmedValue = value?.trim();

      if (urlFields?.includes(key))
        prev[key] = normalizeUrlWithHttps(trimmedValue);
      else prev[key] = trimmedValue;
    } else prev[key] = value;

    return prev;
  }, {} as Record<string, any>);

  return normalizedObj as T;
};

export const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const convertToVND = (price?: number | string) => {
  if (!price) return '-';

  const formattedPrice = typeof price === 'string' ? Number(price) : price;

  return formattedPrice?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const getOrCreateGuestUserId = (): string => {
  let userId = localStorage.getItem(GUEST_USER_KEY);

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(GUEST_USER_KEY, userId);
  }

  return userId;
};

export const getGuestUserId = (): string | null => {
  return localStorage.getItem(GUEST_USER_KEY);
};

export const clearGuestUserId = (): void => {
  localStorage.removeItem(GUEST_USER_KEY);
};

export const validateStockAvailability = ({
  item,
  lastToastTime,
  toastCoolDown,
}: {
  toastCoolDown: number;
  lastToastTime: RefObject<number>;
  item: Pick<IVariant, 'stock' | 'optionValues'> & { quantity: number };
}) => {
  const { optionValues, stock, quantity } = item;

  const attributeName = optionValues
    ?.map((optVal) => optVal?.optionValue?.value)
    .join(' - ');

  if (quantity > stock) {
    const now = Date.now();

    if (now - lastToastTime.current > toastCoolDown) {
      notificationEmitter.emit(
        'warning',
        `Mẫu ${attributeName} chỉ còn ${stock} sản phẩm trong kho.`
      );

      lastToastTime.current = now;
    }
    return false;
  }

  return true;
};

export const findFirstAvailableOptionValue = (
  productDetails: IProduct,
  optionId: string,
  otherOptionValueId?: string
) => {
  const option = productDetails.options?.find((opt) => opt.id === optionId);
  if (!option?.values) return '';

  for (const value of option.values) {
    const hasStock = productDetails.variants?.some((variant) => {
      const hasThisValue = variant.optionValues?.some(
        (ov) => ov.optionValueId === value.id
      );

      if (otherOptionValueId) {
        const hasOtherValue = variant.optionValues?.some(
          (ov) => ov.optionValueId === otherOptionValueId
        );
        return hasThisValue && hasOtherValue && (variant.stock || 0) > 0;
      }

      return hasThisValue && (variant.stock || 0) > 0;
    });

    if (hasStock) return value.id;
  }

  return option.values[0]?.id || '';
};

export const getOptionValueImage = (
  optionValueId: string,
  productDetails: IProduct | undefined
) => {
  const variant = productDetails?.variants?.find((v) =>
    v.optionValues?.some((ov) => ov.optionValueId === optionValueId)
  );

  return variant?.imageMappings?.[0]?.image?.url;
};

export const isColorOption = (optionName: string) => {
  const colorKeywords = ['màu', 'color', 'colour'];

  return colorKeywords.some((keyword) =>
    optionName.toLowerCase().includes(keyword)
  );
};
