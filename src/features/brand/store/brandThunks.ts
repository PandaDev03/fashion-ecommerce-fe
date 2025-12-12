import { createAsyncThunk } from '@reduxjs/toolkit';
import { brandApi } from '../api/brandApi';
import { IBrandParams } from '../types/brand';

export const getAllBrands = createAsyncThunk(
  'brand/getAllBrands',
  async (params: IBrandParams, { rejectWithValue }) => {
    try {
      const response = await brandApi.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
