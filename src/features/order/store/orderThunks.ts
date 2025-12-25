import { createAsyncThunk } from '@reduxjs/toolkit';

import { orderApi } from '../api/orderApi';
import { IGetAllOrder } from '../types/order';

export const getAllOrder = createAsyncThunk(
  'order/getAllOrder',
  async (params: IGetAllOrder, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
