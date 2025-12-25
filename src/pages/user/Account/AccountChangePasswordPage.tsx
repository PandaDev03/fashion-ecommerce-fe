import { SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

import { UserAPI } from '~/features/user/api/userApi';
import { getMe } from '~/features/user/stores/userThunks';
import { IChangePassword } from '~/features/user/types/user';
import Button from '~/shared/components/Button/Button';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import InputPassword from '~/shared/components/Input/InputPassword';
import { Layout } from '~/shared/components/Layout/Layout';
import { useToast } from '~/shared/contexts/NotificationContext';
import { useAppDispatch, useAppSelector } from '~/shared/hooks/useStore';

interface IPasswordForm {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountChangePasswordPage = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [passwordForm] = useForm<IPasswordForm>();
  const { currentUser } = useAppSelector((state) => state.user);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { mutate: changePassword, isPending: isChangePasswordPending } =
    useMutation({
      mutationFn: (params: IChangePassword) => UserAPI.changePassword(params),
      onSuccess: (response) => {
        toast.success(response?.message);

        dispatch(getMe());
        passwordForm.resetFields();
      },
    });

  const handleFinishFailed = () => {
    setHasSubmitted(true);
  };

  const handleFinish = (values: IPasswordForm) => {
    const params: IChangePassword = {
      ...(currentUser?.accountType === 'system' && {
        oldPassword: values?.oldPassword,
      }),
      newPassword: values?.newPassword,
    };

    changePassword(params);
  };

  return (
    <Layout className="bg-white!">
      <h2 className="mb-6 text-lg font-bold md:text-xl xl:text-2xl text-primary xl:mb-8 capitalize">
        Đổi mật khẩu
      </h2>
      <Form
        form={passwordForm}
        validateTrigger={hasSubmitted ? 'onChange' : 'onSubmit'}
        onFinishFailed={handleFinishFailed}
        onFinish={handleFinish}
      >
        {currentUser?.accountType === 'system' && (
          <FormItem
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <InputPassword />
          </FormItem>
        )}
        <FormItem
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          ]}
        >
          <InputPassword />
        </FormItem>
        <FormItem
          name="confirmPassword"
          label="Nhập lại mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value)
                  return Promise.resolve();

                return Promise.reject(
                  new Error('Mật khẩu xác nhận không khớp')
                );
              },
            }),
          ]}
        >
          <InputPassword />
        </FormItem>
      </Form>
      <Flex align="center">
        <Button
          title="Lưu"
          iconBefore={<SaveOutlined />}
          loading={isChangePasswordPending}
          onClick={() => passwordForm.submit()}
        />
      </Flex>
    </Layout>
  );
};

export default AccountChangePasswordPage;
