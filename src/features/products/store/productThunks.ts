import { createAsyncThunk } from '@reduxjs/toolkit';
import { IProductParams } from '../types/product';
import { productAPI } from '../api/productApi';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (params: IProductParams, { rejectWithValue }) => {
    try {
      const response = productAPI.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
