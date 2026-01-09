import { useMutation } from '@tanstack/react-query';
import { Flex, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthApi } from '~/features/auth/api/auth';
import { IResetPassword } from '~/features/auth/types/auth';
import Form from '~/shared/components/Form/Form';
import FormItem from '~/shared/components/Form/FormItem';
import InputPassword from '~/shared/components/Input/InputPassword';
import { Content } from '~/shared/components/Layout/Layout';
import CongratulationModal from '~/shared/components/Modal/CongratulationModal';
import { useToast } from '~/shared/contexts/NotificationContext';
import useQueryParams from '~/shared/hooks/useQueryParams';
import { PATH } from '~/shared/utils/path';

interface IResetPasswordForm {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPassword = () => {
  const toast = useToast();
  const queryParams = useQueryParams();

  const navigate = useNavigate();
  const [resetPasswordForm] = useForm<IResetPasswordForm>();

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCongratulationModalVisible, setIsCongratulationModalVisible] =
    useState(false);

  const { mutate: resetPassword, isPending: isResetPasswordPending } =
    useMutation({
      mutationFn: (params: IResetPassword) => AuthApi.resetPassword(params),
      onSuccess: (response) => {
        toast.success(response?.message);
        setIsCongratulationModalVisible(true);

        setTimeout(() => navigate(PATH.HOME), 3000);
      },
    });

  const handleFinishFailed = () => {
    setHasSubmitted(true);
  };

  const handleFinish = (values: IResetPasswordForm) => {
    const queryValues = queryParams.searchParams;
    const token = queryValues?.token;

    if (!token) {
      toast.error('Không tìm thấy token. Vui lòng thử lại sau');
      return;
    }

    const params: IResetPassword = {
      token: String(token),
      newPassword: values?.newPassword,
    };
    resetPassword(params);
  };

  return (
    <Content>
      <Flex justify="center" className="w-full mt-10!">
        <Flex vertical align="center" className="gap-y-5">
          <Space align="center" direction="vertical">
            <h2 className="font-semibold text-2xl text-primary">
              Đặt lại mật khẩu
            </h2>
            <p>Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
          </Space>

          <Form
            form={resetPasswordForm}
            submitTitle="Đặt lại mật khẩu"
            loading={isResetPasswordPending}
            validateTrigger={hasSubmitted ? 'onChange' : 'onSubmit'}
            onFinishFailed={handleFinishFailed}
            onFinish={handleFinish}
          >
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
              name="confirmNewPassword"
              label="Xác nhận mật khẩu"
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
        </Flex>
      </Flex>

      <CongratulationModal footer={false} open={isCongratulationModalVisible}>
        <div className="text-center space-y-3">
          <h2 className="text-lg font-semibold">Mật khẩu đã được cập nhật</h2>
          <p className="text-sm text-sub font-medium">
            Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của mình
          </p>
        </div>
        <p className="text-sm text-green-500 animate-pulse">
          Đang tự động chuyển hướng...
        </p>
      </CongratulationModal>
    </Content>
  );
};

export default ResetPassword;
