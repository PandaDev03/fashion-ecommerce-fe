import axiosApi from '~/config/axios';
import { IChangePassword, IUpdateUser } from '../types/user';

export const UserAPI = {
  getMe: async () => {
    return await axiosApi.get('/users/me');
  },
  updateUser: async (params: IUpdateUser) => {
    return await axiosApi.put('/users', params);
  },
  changePassword: async (params: IChangePassword) => {
    return await axiosApi.put('/users/change-password', params);
  },
};
