import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBrandParams } from '../types/brand';
import { brandApi } from '../api/brandApi';

export const getAllBrands = createAsyncThunk(
  'brand/getAllBrands',
  async (params: IBrandParams, { rejectWithValue }) => {
    try {
      const response = await brandApi.getAllBrands(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
