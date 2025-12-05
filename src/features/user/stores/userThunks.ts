import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAPI } from '../api/userApi';

export const getMe = createAsyncThunk(
  'user/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserAPI.getMe();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
