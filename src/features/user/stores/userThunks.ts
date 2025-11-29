import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI } from '../api/userApi';

export const getMe = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = UserAPI.getMe();
      return response;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error?.message || 'Có lỗi xảy ra');
    }
  }
);
