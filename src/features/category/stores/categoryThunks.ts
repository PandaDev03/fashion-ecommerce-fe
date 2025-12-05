import { createAsyncThunk } from '@reduxjs/toolkit';

import { categoryApi } from '../api/categoryApi';
import { ICategoryParams } from '../types/category';

export const getAllCategories = createAsyncThunk(
  'category/getAll',
  async (params: ICategoryParams, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAll(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
