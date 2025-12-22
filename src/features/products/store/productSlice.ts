import { createSlice } from '@reduxjs/toolkit';

import { IProduct, ProductState } from '../types/product';
import { getProducts } from './productThunks';

const initialState: ProductState = {
  loading: false,
  items: [] as IProduct[],
  pageInfo: {} as IPageInfo,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.items = payload?.data;
        state.pageInfo = payload.pageInfo;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const productReducer = productSlice.reducer;
