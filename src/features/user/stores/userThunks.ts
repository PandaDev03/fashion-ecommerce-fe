import { createAsyncThunk } from '@reduxjs/toolkit';

export const logOut = createAsyncThunk('user/logOut', async () => {});
export const getUserInfo = createAsyncThunk('user/getUserInfo', async () => {});
