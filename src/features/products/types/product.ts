import { IUser } from '~/shared/types/user';

export interface IProductParams extends IPaginationParams {
  search?: string;
  status?: string;
  brandId?: string;
  categoryId?: string;
  brandSlugs?: string[];
  categorySlugs?: string[];
  createdFrom?: string;
  createdTo?: string;
  minPrice?: number;
  maxPrice?: number;
  includeVariants?: boolean;
}

export interface IGetProductOptionParams {
  productId?: string;
}

export interface ICreateProduct {
  variables: {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    brandId: string;
    price?: number;
    stock?: number;
    status: string;
    variants?: {
      price: number;
      stock: number;
      status: string;
      position?: number;
      optionValues: {
        optionName: string;
        value: string;
      }[];
    }[];
  };
  files: FormData;
}

export interface ICreateProductVariant {
  productId: string;
  price: number;
  stock: number;
  status?: string;
  position?: number;
  optionValues: {
    isNewOption?: boolean;
    optionId?: string;
    optionName?: string;
    optionValueId?: string;
    value?: string;
    isNew?: boolean;
  }[];
}

export interface IUpdateProductVariant {
  variantId: string;
  price?: number;
  stock?: number;
  status?: string;
  position?: number;
  optionValues: {
    optionId?: string;
    optionValueId?: string;
    value?: string;
    isNew?: boolean;
  }[];
}

export interface IUpdateProduct {
  productId: string;
  name?: string;
  description?: string;
  slug?: string;
  categoryId?: string;
  brandId?: string;
  position?: number;
  parentPrice?: number;
  parentStock?: number;
  price?: number;
  stock?: number;
  // status?: 'active' | 'inactive';
  variantId: string;
  images?: Array<{
    url?: string;
    position?: number;
    imageId?: string;
  }>;
}

export interface IDeleteManyProduct {
  ids: string[];
}

export interface IProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  price: string;
  stock: string;
  hasVariants: boolean;
  status: string;
  variants: IVariant[];
  options: Option[];
  images: {
    id: string;
    url: string;
    altText: string;
    position: number;
    productId: string;
    updatedAt: string;
    updatedBy: string;
    createdAt: string;
    createdBy: string;
  }[];
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
  variantColorData: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  creator: Omit<IUser, 'role' | 'permissions'>;
  updater: Omit<IUser, 'role' | 'permissions'>;
}

interface Option {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  productId: string;
  name: string;
  position: number;
  values: Value[];
}

interface Value {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  optionId?: string;
  value?: string;
  position: number;
  url?: string;
}

export interface IVariant {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  productId?: string;
  price: string;
  stock: number;
  status: string;
  position?: number;
  optionValues?: OptionValue[];
  imageMappings: ImageMapping[];
}

interface ImageMapping {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  variantId?: string;
  imageId?: string;
  position: number;
  image?: Value;
  url?: string;
}

interface OptionValue {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  variantId: string;
  optionValueId: string;
  optionValue: Value;
}

export type ProductState = IPaginatedData<IProduct>;

export interface IProductOption {
  id: string;
  name: string;
  position: number;
  values: { id: string; value: string; position: number }[];
}
