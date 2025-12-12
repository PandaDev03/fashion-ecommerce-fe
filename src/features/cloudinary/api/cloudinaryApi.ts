import axiosApi from '~/config/axios';

export const cloudinaryApi = {
  uploadBrandLogo: async (data: FormData) => {
    return await axiosApi.post('/cloudinary/upload/brand-logo', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
