import axiosApi from '~/config/axios';

export const UserAPI = {
  getMe: async () => {
    return await axiosApi.get('/users/me');
  },
};
