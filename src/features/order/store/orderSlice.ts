import { createSlice } from '@reduxjs/toolkit';
import { IOrderManagement, OrderState } from '../types/order';
import { getAllOrder } from './orderThunks';

const initialState: OrderState = {
  loading: false,
  pageInfo: {} as IPageInfo,
  items: [] as IOrderManagement[],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.items = payload?.data;
        state.pageInfo = payload?.pageInfo;
      })
      .addCase(getAllOrder.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const orderReducer = orderSlice.reducer;
