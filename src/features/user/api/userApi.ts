import axiosApi from '~/config/axios';
import {
  IChangePassword,
  IUpdateUser,
  IUpdateUserByAdmin,
  IUserParams,
} from '../types/user';

export const UserAPI = {
  getMe: async () => {
    return await axiosApi.get('/users/me');
  },
  getAllUsers: async (params: IUserParams) => {
    return await axiosApi.get('/users/admin/all', { params });
  },
  exportUser: async (params: IUserParams) => {
    return await axiosApi.get('/users/admin/export', {
      params,
      responseType: 'blob',
    });
  },
  updateUser: async (params: IUpdateUser) => {
    return await axiosApi.put('/users', params);
  },
  updateUserByAdmin: async (params: IUpdateUserByAdmin) => {
    const { id, ...rest } = params;
    return await axiosApi.put(`/users/admin/${id}`, rest);
  },
  changePassword: async (params: IChangePassword) => {
    return await axiosApi.put('/users/change-password', params);
  },
};
