import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { notificationEmitter } from '~/shared/utils/notificationEmitter';
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
  isCartDrawerOpen: false,
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
      ...(item.variant && { variantId: item.variant.id }),
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
    toggleCartDrawer: (state, action) => {
      state.isCartDrawerOpen = action.payload;
    },
    addToCart: (state, action: PayloadAction<ICart>) => {
      try {
        const newItem = action.payload;
        const currentItems = state.items;

        const existingItemIndex = currentItems.findIndex(
          (item) => item?.variant?.id === newItem?.variant?.id
        );

        if (existingItemIndex === -1) state.items.push(newItem);
        else state.items[existingItemIndex].quantity += newItem.quantity;

        saveLocalCartItems(state.items);
        state.pageInfo.totalItems = state.items.length;

        notificationEmitter.emit('success', 'Thêm vào giỏ hàng thành công');
      } catch (error) {
        notificationEmitter.emit(
          'error',
          `Có lỗi xảy ra khi thêm vào giở hàng: ${error}`
        );
      }
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
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.pageInfo = {} as IPageInfo;

      localStorage.removeItem(CART_STORAGE_KEY);
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

export const {
  toggleCartDrawer,
  addToCart,
  updateQuantity,
  deleteCartItem,
  clearCart,
} = cartSlice.actions;
