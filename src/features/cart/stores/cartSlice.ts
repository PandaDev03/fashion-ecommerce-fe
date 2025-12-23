import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CartState,
  ICart,
  IDeleteCartItem,
  ILocalCartItem,
  IUpdateQuantity,
} from '../types/cart';
import { getCartItems } from './cartThunks';

const CART_STORAGE_KEY = 'cartItems';

const initialState: CartState = {
  loading: false,
  items: [] as ICart[],
  pageInfo: {} as IPageInfo,
};

export const getLocalCartItems = (): ILocalCartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ Local Storage:', error);
    return [];
  }
};

const saveLocalCartItems = (cartItems: ICart[]) => {
  try {
    const localItems: ILocalCartItem[] = cartItems.map((item) => ({
      productId: item.id,
      variantId: item.variant.id,
      quantity: item.quantity,
      addedAt: Date.now(),
    }));

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localItems));
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu xuống Local Storage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICart>) => {
      const newItem = action.payload;
      const currentItems = state.items;

      const existingItemIndex = currentItems.findIndex(
        (item) => item?.variant?.id === newItem?.variant?.id
      );

      if (existingItemIndex === -1) state.items.push(newItem);
      else state.items[existingItemIndex].quantity += newItem.quantity;

      saveLocalCartItems(state.items);
      state.pageInfo.totalItems = state.items.length;
    },
    updateQuantity: (state, action: PayloadAction<IUpdateQuantity>) => {
      const { variantId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item?.variant?.id === variantId
      );

      if (itemIndex === -1) return;

      state.items[itemIndex].quantity += quantity;
      saveLocalCartItems(state.items);
    },
    deleteCartItem: (state, action: PayloadAction<IDeleteCartItem>) => {
      const { variantId } = action.payload;
      const currentItems = state.items;

      const newCartItems = currentItems.filter(
        (item) => item?.variant?.id !== variantId
      );

      saveLocalCartItems(newCartItems);

      state.items = newCartItems;
      state.pageInfo.totalItems = state.items.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        const payload = action.payload;

        state.items = payload;
        state.loading = false;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const cartReducer = cartSlice.reducer;
export const { addToCart, updateQuantity, deleteCartItem } = cartSlice.actions;
