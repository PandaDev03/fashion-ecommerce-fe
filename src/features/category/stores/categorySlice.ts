import { createSlice } from '@reduxjs/toolkit';

import { CategoryState, ICategory } from '../types/category';
import { getAllCategories } from './categoryThunks';

const initialState: CategoryState = {
  loading: false,
  items: [] as ICategory[],
  pageInfo: {} as IPageInfo,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.items = payload?.data;
        state.pageInfo = payload?.pageInfo;
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const categoryReducer = categorySlice.reducer;
