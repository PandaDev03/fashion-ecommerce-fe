import { createAsyncThunk } from '@reduxjs/toolkit';

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async () => {}
);
