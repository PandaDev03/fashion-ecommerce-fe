import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLocalCartItems } from './cartSlice';
import { ICart } from '../types/cart';
import { cartApi } from '../api/cart';

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const localItems = getLocalCartItems();

      if (localItems.length === 0) return [];

      const response = await cartApi.getCartItems({ items: localItems });

      const cartItems: ICart[] = response?.data?.map((product: any) => {
        const localItem = localItems?.find(
          (item) => item?.variantId === product?.variant?.id
        );

        return {
          ...product,
          quantity: localItem?.quantity || 1,
        };
      });

      return cartItems;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
