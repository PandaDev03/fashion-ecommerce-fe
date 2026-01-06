import axiosApi from '~/config/axios';
import {
  IRequestPasswordReset,
  IResetPassword,
  ISignIn,
  ISignInWithGoogle,
  ISignUp,
} from '../types/auth';

export const AuthApi = {
  signUp: async (payload: ISignUp) => {
    return await axiosApi.post('/auth/sign-up', payload);
  },
  signIn: async (payload: ISignIn) => {
    return await axiosApi.post('/auth/sign-in', payload);
  },
  signInWithGoogle: async (payload: ISignInWithGoogle) => {
    return await axiosApi.post('/auth/sign-in-with-google', payload);
  },
  signOut: async () => {
    return await axiosApi.post('/auth/sign-out');
  },
  requestPasswordReset: async (params: IRequestPasswordReset) => {
    return await axiosApi.post('/auth/request-password-reset', params);
  },
  resetPassword: async (params: IResetPassword) => {
    return await axiosApi.post('/auth/reset-password', params);
  },
};
