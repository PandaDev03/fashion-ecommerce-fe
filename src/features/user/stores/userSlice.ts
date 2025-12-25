import { createSlice } from '@reduxjs/toolkit';

import { IUser, UserState } from '~/shared/types/user';
import { getMe } from './userThunks';

const initialState: UserState = {
  loading: false,
  isInitialized: false,
  currentUser: {} as IUser,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.currentUser = initialState.currentUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        const payload = action.payload;

        state.loading = false;
        state.isInitialized = true;
        state.currentUser = payload?.data?.userInfo;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { resetUser } = userSlice.actions;
