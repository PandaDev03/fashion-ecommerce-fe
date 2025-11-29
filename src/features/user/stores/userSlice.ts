import { createSlice } from '@reduxjs/toolkit';

import { IUser, UserState } from '~/shared/types/user';
import { getMe } from './userThunks';

const initialState: UserState = {
  loading: false,
  currentUser: {} as IUser,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.currentUser = payload?.data?.userInfo;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const userReducer = userSlice.reducer;
