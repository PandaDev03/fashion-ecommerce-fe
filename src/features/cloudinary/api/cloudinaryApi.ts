import axiosApi from '~/config/axios';

export const cloudinaryApi = {
  upload: async (data: FormData) => {
    return await axiosApi.post('/cloudinary/upload', data, {
      timeout: 15000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadBrandLogo: async (data: FormData) => {
    return await axiosApi.post('/cloudinary/upload/brand-logo', data, {
      timeout: 15000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
