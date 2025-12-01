import { useGoogleLogin } from '@react-oauth/google';
import { Image } from 'antd';
import { memo } from 'react';

import { GOOGLE_LOGO } from '~/assets/images';
import { useToast } from '~/shared/contexts/NotificationContext';
import Button from './Button';

interface IProps {
  title?: string;
  loading?: boolean;
  onClick: (values: any) => void;
}

const GoogleAuthButton = ({
  loading,
  title = 'Đăng nhập bằng Google',
  onClick,
}: IProps) => {
  const toast = useToast();

  const handleSignIn = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response?.access_token;

      if (!accessToken) {
        toast.error(
          'Có lỗi xảy ra khi đăng nhập bằng Google. Vui lòng thử lại sau!'
        );
        return;
      }

      onClick({ accessToken });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Button
      title={title}
      loading={loading}
      iconBefore={
        <Image preview={false} src={GOOGLE_LOGO} width={24} height={24} />
      }
      className="w-full text-[#3c4043] border-[#dadce0] hover:border-[#d2e3fc] hover:bg-[#f7fafe]"
      onClick={() => handleSignIn()}
    />
  );
};

export default memo(GoogleAuthButton);
