import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, ICart, ILocalCartItem } from '../types/cart';
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
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

const saveLocalCartItems = (items: ILocalCartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
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
        (item) => item.variant.id === newItem.variant.id
      );

      if (existingItemIndex === -1) state.items.push(newItem);
      else state.items[existingItemIndex].quantity += newItem.quantity;

      const localItems: ILocalCartItem[] = state.items.map((item) => ({
        productId: item.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        addedAt: Date.now(),
      }));

      saveLocalCartItems(localItems);
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
export const { addToCart } = cartSlice.actions;
