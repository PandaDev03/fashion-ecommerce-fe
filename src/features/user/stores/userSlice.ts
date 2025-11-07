import { createSlice } from '@reduxjs/toolkit';
import { IUser, UserState } from '~/shared/types/user';

const initialState: UserState = {
  loading: false,
  currentUser: {} as IUser,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const userReducer = userSlice.reducer;
