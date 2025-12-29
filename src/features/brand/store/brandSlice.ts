import { createSlice } from '@reduxjs/toolkit';
import { BrandState, IBrand } from '../types/brand';
import { getAllBrands } from './brandThunks';

const initialState: BrandState = {
  loading: false,
  items: [] as IBrand[],
  pageInfo: {} as IPageInfo,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBrands.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.items = payload.data;
        state.pageInfo = payload.pageInfo;
      })
      .addCase(getAllBrands.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const brandReducer = brandSlice.reducer;
