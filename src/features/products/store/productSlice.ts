import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const productReducer = productSlice.reducer;
