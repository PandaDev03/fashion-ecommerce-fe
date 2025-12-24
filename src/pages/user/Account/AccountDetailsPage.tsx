import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadProps } from 'antd/es/upload/Upload';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { FALLBACK_IMG } from '~/assets/images';
import { cloudinaryApi } from '~/features/cloudinary/api/cloudinaryApi';
import { UserAPI } from '~/features/user/api/userApi';
import { getMe } from '~/features/user/stores/userThunks';
import { IUpdateUser } from '~/features/user/types/user';
import Button from '~/shared/components/Button/Button';
import DatePicker from '~/shared/components/DatePicker/DatePicker';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import Image from '~/shared/components/Image/Image';
import Input from '~/shared/components/Input/Input';
import TextArea from '~/shared/components/Input/TextArea';
import { Layout } from '~/shared/components/Layout/Layout';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';

type IAccountForm = Omit<IUpdateUser, 'password'>;

const AccountDetailsPage = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [accountForm] = useForm<IAccountForm>();

  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const { currentUser, loading } = useAppSelector((state) => state.user);

  const { mutate: updateUser, isPending: isUpdateUserPending } = useMutation({
    mutationFn: (params: IUpdateUser) => UserAPI.updateUser(params),
    onSuccess: (response) => {
      toast.success(response?.message);

      dispatch(getMe());
    },
  });

  const { mutate: uploadUserAvatar, isPending: isUploadUserAvatarPending } =
    useMutation({
      mutationFn: (data: FormData) => cloudinaryApi.uploadUserAvatar(data),
      onSuccess: (response) => setAvatarUrl(response?.data?.url),
    });

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');

      if (!isImage) {
        toast.error('Chỉ chấp nhận file ảnh!');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error('Kích thước ảnh phải nhỏ hơn 5MB!');
        return false;
      }

      return true;
    },
    customRequest: async ({ file }) => {
      const formData = new FormData();
      formData.append('file', file as File);

      uploadUserAvatar(formData);
    },
  };

  useEffect(() => {
    if (!currentUser || !Object.keys(currentUser).length) return;

    const fieldsValue: IAccountForm = {
      name: currentUser?.name,
      phone: currentUser?.phone,
      email: currentUser?.email,
      birthday: currentUser?.birthday
        ? dayjs(currentUser?.birthday)
        : undefined,
      address: currentUser?.address,
    };
    accountForm.setFieldsValue(fieldsValue);

    setAvatarUrl(currentUser?.avatar);
  }, [currentUser]);

  const handleFinish = (values: IAccountForm) => {
    const params: IUpdateUser = { ...values, avatar: avatarUrl };
    updateUser(params);
  };

  return (
    <Layout loading={loading} className="bg-white!">
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-primary xl:mb-8 capitalize">
        Thông tin tài khoản
      </h2>
      <Flex
        vertical
        align="center"
        justify="center"
        className="w-full mb-3! p-[30px]! bg-gray-100 rounded-md gap-y-4"
      >
        <Image
          preview
          width={96}
          height={96}
          src={avatarUrl || FALLBACK_IMG}
          className="rounded-full object-cover"
        />
        <Upload {...uploadProps}>
          <Button
            title="Thay đổi ảnh"
            iconBefore={<EditOutlined />}
            loading={isUploadUserAvatarPending}
          />
        </Upload>
      </Flex>
      <Form form={accountForm} onFinish={handleFinish}>
        <FormItem
          name="name"
          label="Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Ví dụ: Nguyễn Văn A" />
        </FormItem>
        <div className="grid grid-cols-2 gap-x-3">
          <FormItem
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input disabled placeholder="example@gmail.com" />
          </FormItem>
          <FormItem
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
          >
            <Input placeholder="Ví dụ: 0901234567" />
          </FormItem>
        </div>
        <FormItem
          name="birthday"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]}
        >
          <DatePicker className="w-full" placeholder="Ngày/Tháng/Năm" />
        </FormItem>
        <FormItem name="address" label="Địa chỉ">
          <TextArea
            className="min-h-[200px]!"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
          />
        </FormItem>
      </Form>
      <Flex align="center">
        <Button
          title="Lưu"
          iconBefore={<SaveOutlined />}
          loading={isUpdateUserPending}
          onClick={() => accountForm.submit()}
        />
      </Flex>
    </Layout>
  );
};

export default AccountDetailsPage;
