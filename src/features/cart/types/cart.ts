import { IVariant } from '~/features/products/types/product';

export interface IGetCartItems {
  items: ILocalCartItem[];
}

export interface ICart {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  quantity: number;
  status: string;
  variant?: IVariant;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
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
}

export type CartState = IPaginatedData<ICart> & { isCartDrawerOpen?: boolean };

export interface ILocalCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  addedAt: number;
}

export interface IUpdateQuantity {
  variantId: string;
  quantity: number;
}

export interface IDeleteCartItem {
  variantId: string;
}
