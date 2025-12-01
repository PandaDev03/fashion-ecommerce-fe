import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI } from '../api/userApi';
import { notificationEmitter } from '~/shared/utils/notificationEmitter';

export const getMe = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserAPI.getMe();

      return response;
    } catch (error: any) {
      notificationEmitter.emit('error', error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  }
);
